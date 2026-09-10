from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime
from backend.database import get_db, init_db
from backend.seed_data import seed_database

app = FastAPI(title="SmartZone POS API", version="1.0.0", description="Backend service for SmartZone Mobile Hub POS")

# Allow CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    init_db()
    seed_database()

# Pydantic Schemas
class IMEIValidateRequest(BaseModel):
    imei: str = Field(..., min_length=15, max_length=18)

class SaleItemSchema(BaseModel):
    product_id: str
    stock_item_id: str
    unit_price: float
    imei_or_serial: Optional[str] = None
    warranty_months: Optional[int] = 12

class CreateSaleRequest(BaseModel):
    invoice_number: str
    cashier_id: str = "user_cashier_01"
    subtotal: float
    discount_amount: float = 0.0
    grand_total: float
    payment_method: str
    customer_name: Optional[str] = "Walk-in Customer"
    customer_phone: Optional[str] = ""
    items: List[SaleItemSchema]

class CreateRepairRequest(BaseModel):
    customer_name: str
    customer_phone: str
    device_model: str
    imei_or_serial: Optional[str] = ""
    fault_description: str
    estimated_cost: float
    advance_paid: float = 0.0

class UpdateRepairStatusRequest(BaseModel):
    status: str

class CreateStockRequest(BaseModel):
    category_name: str
    brand_name: str
    model_name: str
    base_price: float
    cost_price: Optional[float] = None
    min_stock_alert: Optional[int] = 2
    warranty_months: Optional[int] = 12
    imei_or_serial: Optional[str] = None
    quantity: Optional[int] = 1
    image_url: Optional[str] = None

class CreateUserRequest(BaseModel):
    full_name: str
    username: str
    role: Optional[str] = "Cashier"
    password: Optional[str] = "password123"

class CreateCustomerRequest(BaseModel):
    name: str
    phone: str
    email: Optional[str] = ""

# API Endpoints
@app.get("/api/v1/health")
def health_check():
    return {"status": "ONLINE", "system": "SmartZone POS API v1.0.0", "timestamp": datetime.now().isoformat()}

@app.post("/api/v1/stock/verify-imei")
def verify_imei(payload: IMEIValidateRequest):
    conn = get_db()
    cursor = conn.cursor()
    
    imei_clean = payload.imei.strip()
    cursor.execute("""
        SELECT s.id as stock_item_id, s.imei_or_serial, s.status, p.id as product_id, p.model_name, p.brand_name, p.base_price, p.warranty_months, p.image_url
        FROM stock_items s
        JOIN products p ON s.product_id = p.id
        WHERE s.imei_or_serial = ?
    """, (imei_clean,))
    
    row = cursor.fetchone()
    conn.close()

    if not row:
        raise HTTPException(status_code=444, detail=f"IMEI/Serial '{imei_clean}' not found in stock database.")
    
    row_dict = dict(row)
    if row_dict["status"] != "AVAILABLE":
        raise HTTPException(status_code=400, detail=f"IMEI '{imei_clean}' is marked as {row_dict['status']}.")

    return {
        "status": "VALID",
        "stock_item_id": row_dict["stock_item_id"],
        "imei": row_dict["imei_or_serial"],
        "product_id": row_dict["product_id"],
        "product_name": f"{row_dict['brand_name']} {row_dict['model_name']}",
        "price": row_dict["base_price"],
        "warranty_months": row_dict["warranty_months"],
        "image_url": row_dict["image_url"]
    }

@app.get("/api/v1/products")
def get_products():
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute("""
        SELECT p.*, COUNT(s.id) as available_stock
        FROM products p
        LEFT JOIN stock_items s ON p.id = s.product_id AND s.status = 'AVAILABLE'
        GROUP BY p.id
    """)
    products = [dict(row) for row in cursor.fetchall()]
    
    conn.close()
    return {"products": products}

@app.get("/api/v1/products/{product_id}/imeis")
def get_product_imeis(product_id: str):
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute("""
        SELECT id, imei_or_serial, status, cost_price, created_at
        FROM stock_items
        WHERE product_id = ? AND status = 'AVAILABLE'
    """, (product_id,))
    
    imeis = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return {"product_id": product_id, "available_imeis": imeis}

@app.post("/api/v1/stock/add")
def add_stock(payload: CreateStockRequest):
    conn = get_db()
    cursor = conn.cursor()
    prod_id = f"prod_{uuid.uuid4().hex[:8]}"
    cost = payload.cost_price if payload.cost_price else payload.base_price * 0.85
    
    cursor.execute("""
        INSERT INTO products (id, category_name, brand_name, model_name, base_price, min_stock_alert, warranty_months, image_url)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        prod_id, payload.category_name, payload.brand_name, payload.model_name,
        payload.base_price, payload.min_stock_alert or 2, payload.warranty_months or 12,
        payload.image_url or "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500"
    ))
    
    qty = payload.quantity or 1
    for i in range(qty):
        stk_id = f"stk_{uuid.uuid4().hex[:8]}"
        imei_val = payload.imei_or_serial if (payload.imei_or_serial and i == 0) else f"358{uuid.uuid4().int % 1000000000000:012d}"
        cursor.execute("""
            INSERT INTO stock_items (id, product_id, imei_or_serial, status, cost_price)
            VALUES (?, ?, ?, 'AVAILABLE', ?)
        """, (stk_id, prod_id, imei_val, cost))
        
    conn.commit()
    conn.close()
    return {"success": True, "product_id": prod_id}

@app.get("/api/v1/users")
def get_users():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT id, username, full_name, role, created_at FROM users")
    rows = [dict(r) for r in cursor.fetchall()]
    conn.close()
    return {"users": rows}

@app.get("/api/v1/customers")
def get_customers():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM customers ORDER BY name COLLATE NOCASE")
    customers = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return {"customers": customers}

@app.post("/api/v1/customers/create")
def create_customer(payload: CreateCustomerRequest):
    conn = get_db()
    cursor = conn.cursor()
    customer_id = f"cust_{uuid.uuid4().hex[:8]}"
    try:
        cursor.execute(
            "INSERT INTO customers (id, name, phone, email) VALUES (?, ?, ?, ?)",
            (customer_id, payload.name.strip(), payload.phone.strip(), (payload.email or "").strip())
        )
        conn.commit()
    except Exception as e:
        conn.rollback()
        conn.close()
        raise HTTPException(status_code=409, detail=f"Customer could not be created: {str(e)}")
    conn.close()
    return {"success": True, "customer_id": customer_id}

@app.post("/api/v1/users/create")
def create_user(payload: CreateUserRequest):
    conn = get_db()
    cursor = conn.cursor()
    usr_id = f"usr_{uuid.uuid4().hex[:8]}"
    cursor.execute("""
        INSERT INTO users (id, username, full_name, hashed_password, role)
        VALUES (?, ?, ?, ?, ?)
    """, (usr_id, payload.username, payload.full_name, payload.password or "hash", payload.role or "Cashier"))
    conn.commit()
    conn.close()
    return {"success": True, "user_id": usr_id}

@app.post("/api/v1/sales/create")
def create_sale(sale_data: CreateSaleRequest):
    conn = get_db()
    cursor = conn.cursor()
    
    sale_id = f"sale_{uuid.uuid4().hex[:10]}"
    now = datetime.now()

    try:
        cursor.execute("""
            INSERT INTO sales (id, invoice_number, cashier_id, subtotal, discount_amount, grand_total, payment_method, customer_name, customer_phone, synced_to_cloud)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            sale_id,
            sale_data.invoice_number,
            sale_data.cashier_id,
            sale_data.subtotal,
            sale_data.discount_amount,
            sale_data.grand_total,
            sale_data.payment_method,
            sale_data.customer_name,
            sale_data.customer_phone,
            1
        ))

        for item in sale_data.items:
            item_id = f"item_{uuid.uuid4().hex[:10]}"
            expiry = f"{now.year + 1}-{now.month:02d}-{now.day:02d}"
            
            cursor.execute("""
                INSERT INTO sale_items (id, sale_id, product_id, stock_item_id, unit_price, warranty_expiry_date)
                VALUES (?, ?, ?, ?, ?, ?)
            """, (item_id, sale_id, item.product_id, item.stock_item_id, item.unit_price, expiry))

            cursor.execute("""
                UPDATE stock_items
                SET status = 'SOLD'
                WHERE id = ?
            """, (item.stock_item_id,))

        conn.commit()
        conn.close()
        
        return {
            "success": True,
            "sale_id": sale_id,
            "invoice_number": sale_data.invoice_number,
            "message": "Transaction committed successfully to SQLite database."
        }

    except Exception as e:
        conn.rollback()
        conn.close()
        raise HTTPException(status_code=500, detail=f"Transaction Failed: {str(e)}")

@app.get("/api/v1/sales/history")
def get_sales_history():
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute("""
        SELECT s.*, u.full_name as cashier_name
        FROM sales s
        LEFT JOIN users u ON s.cashier_id = u.id
        ORDER BY s.created_at DESC
        LIMIT 50
    """)
    
    sales = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return {"sales": sales}

@app.get("/api/v1/sales/{sale_id}")
def get_sale(sale_id: str):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT s.*, u.full_name as cashier_name FROM sales s LEFT JOIN users u ON s.cashier_id = u.id WHERE s.id = ?", (sale_id,))
    sale = cursor.fetchone()
    if not sale:
        conn.close()
        raise HTTPException(status_code=404, detail="Sale not found")
    cursor.execute("""
        SELECT si.*, p.model_name, p.brand_name, p.warranty_months, st.imei_or_serial
        FROM sale_items si
        JOIN products p ON si.product_id = p.id
        LEFT JOIN stock_items st ON si.stock_item_id = st.id
        WHERE si.sale_id = ?
    """, (sale_id,))
    items = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return {"sale": dict(sale), "items": items}

@app.get("/api/v1/repairs")
def get_repairs():
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM repair_jobs ORDER BY created_at DESC")
    repairs = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return {"repairs": repairs}

@app.post("/api/v1/repairs/create")
def create_repair(payload: CreateRepairRequest):
    conn = get_db()
    cursor = conn.cursor()
    
    job_id = f"rep_{uuid.uuid4().hex[:8]}"
    cursor.execute("SELECT COUNT(*) FROM repair_jobs")
    count = cursor.fetchone()[0] + 8844
    job_number = f"JOB-{count}"

    cursor.execute("""
        INSERT INTO repair_jobs (id, job_number, customer_name, customer_phone, device_model, imei_or_serial, fault_description, estimated_cost, advance_paid, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        job_id, job_number, payload.customer_name, payload.customer_phone,
        payload.device_model, payload.imei_or_serial, payload.fault_description,
        payload.estimated_cost, payload.advance_paid, "Pending"
    ))

    conn.commit()
    conn.close()
    return {"success": True, "job_id": job_id, "job_number": job_number}

@app.put("/api/v1/repairs/{job_id}/status")
def update_repair_status(job_id: str, payload: UpdateRepairStatusRequest):
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute("UPDATE repair_jobs SET status = ? WHERE id = ?", (payload.status, job_id))
    conn.commit()
    conn.close()
    return {"success": True, "job_id": job_id, "status": payload.status}

@app.get("/api/v1/reports/summary")
def get_reports_summary():
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("SELECT COALESCE(SUM(grand_total), 0) FROM sales")
    total_revenue = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM sales")
    total_sales_count = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM stock_items WHERE status = 'AVAILABLE'")
    available_stock_count = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM repair_jobs WHERE status != 'Delivered'")
    pending_repairs_count = cursor.fetchone()[0]

    conn.close()
    return {
        "today_revenue": total_revenue,
        "total_sales_count": total_sales_count,
        "available_stock_count": available_stock_count,
        "pending_repairs_count": pending_repairs_count
    }
