import uuid
from backend.database import get_db, init_db

def seed_database():
    init_db()
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""
        UPDATE products
        SET image_url = ?
        WHERE id = 'prod_baseus'
    """, ("https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=500&auto=format&fit=crop&q=60",))
    conn.commit()

    customers = [
        ("cust_1001", "Kasun Perera", "0771234567", "kasun@gmail.com", 120, 445000.00),
        ("cust_1002", "Nimali Fernando", "0719876543", "nimali@yahoo.com", 45, 96000.00),
        ("cust_1003", "Dilshan Silva", "0755544332", "dilshan@outlook.com", 280, 680000.00),
        ("cust_1004", "Ruwan Wijesinghe", "0768899001", "ruwan@gmail.com", 15, 28000.00)
    ]
    cursor.execute("SELECT COUNT(*) FROM customers")
    if cursor.fetchone()[0] == 0:
        for customer in customers:
            cursor.execute("""
                INSERT INTO customers (id, name, phone, email, points, total_spent)
                VALUES (?, ?, ?, ?, ?, ?)
            """, customer)
        conn.commit()

    # Check if products already exist
    cursor.execute("SELECT COUNT(*) FROM products")
    if cursor.fetchone()[0] > 0:
        conn.close()
        return

    print("Seeding initial database with Mobile Phones, IMEIs, Accessories & Repairs...")

    # 1. Users
    user_id = "user_cashier_01"
    cursor.execute("""
        INSERT INTO users (id, username, full_name, hashed_password, role)
        VALUES (?, ?, ?, ?, ?)
    """, (user_id, "supun", "Supun D. - Cashier", "hashed_pass_123", "cashier"))

    # 2. Products
    products = [
        # Smartphones
        ("prod_s25u", "Smartphones", "Samsung", "Galaxy S25 Ultra (12GB/512GB)", 385000.00, 2, 12, "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"),
        ("prod_ip16p", "Smartphones", "Apple", "iPhone 16 Pro Max (256GB)", 445000.00, 2, 12, "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"),
        ("prod_mi14u", "Smartphones", "Xiaomi", "Xiaomi 14 Ultra (16GB/512GB)", 295000.00, 3, 12, "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"),
        ("prod_pix9p", "Smartphones", "Google", "Pixel 9 Pro XL (128GB)", 320000.00, 1, 12, "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"),
        
        # Accessories & Audio
        ("prod_ap2pro", "Accessories", "Apple", "AirPods Pro (2nd Gen Type-C)", 78000.00, 5, 6, "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"),
        ("prod_ank65w", "Chargers", "Anker", "Anker 65W GaN III Fast Charger", 14500.00, 10, 6, "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"),
        ("prod_baseus", "Audio & Cables", "Baseus", "Baseus 100W PD Type-C Cable 2m", 3500.00, 15, 3, "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"),
        ("prod_magsafe", "Accessories", "Apple", "MagSafe Wireless Charger 15W", 16500.00, 8, 6, "https://images.unsplash.com/photo-1622445268121-8b1d9d94943f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"),
        ("prod_glass", "Accessories", "Remax", "9H Tempered Glass Screen Guard", 1500.00, 25, 0, "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3")
    ]

    for p in products:
        cursor.execute("""
            INSERT INTO products (id, category_name, brand_name, model_name, base_price, min_stock_alert, warranty_months, image_url)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, p)

    # 3. Stock Items with Authentic 15-digit IMEIs
    stock_items = [
        # Galaxy S25 Ultra IMEIs
        ("stk_s25_01", "prod_s25u", "358291048291048", "AVAILABLE", 340000.00),
        ("stk_s25_02", "prod_s25u", "358291048291049", "AVAILABLE", 340000.00),
        ("stk_s25_03", "prod_s25u", "358291048291050", "AVAILABLE", 340000.00),

        # iPhone 16 Pro Max IMEIs
        ("stk_ip16_01", "prod_ip16p", "359124091823901", "AVAILABLE", 395000.00),
        ("stk_ip16_02", "prod_ip16p", "359124091823902", "AVAILABLE", 395000.00),

        # Xiaomi 14 Ultra IMEIs
        ("stk_mi14_01", "prod_mi14u", "864910293810293", "AVAILABLE", 260000.00),
        ("stk_mi14_02", "prod_mi14u", "864910293810294", "AVAILABLE", 260000.00),

        # Pixel 9 Pro XL IMEIs
        ("stk_pix9_01", "prod_pix9p", "353091827364510", "AVAILABLE", 280000.00),

        # Accessories / Barcode Serials
        ("stk_ap2_01", "prod_ap2pro", "SN-AP2-8849102", "AVAILABLE", 65000.00),
        ("stk_ap2_02", "prod_ap2pro", "SN-AP2-8849103", "AVAILABLE", 65000.00),
        ("stk_ank_01", "prod_ank65w", "SN-ANK-65W-001", "AVAILABLE", 11000.00),
        ("stk_bas_01", "prod_baseus", "ACC-BASEUS-001", "AVAILABLE", 2200.00),
        ("stk_mag_01", "prod_magsafe", "ACC-MAGSAFE-01", "AVAILABLE", 13000.00)
    ]

    for s in stock_items:
        cursor.execute("""
            INSERT INTO stock_items (id, product_id, imei_or_serial, status, cost_price)
            VALUES (?, ?, ?, ?, ?)
        """, s)

    # 4. Repair Jobs
    repairs = [
        ("rep_1001", "JOB-8841", "Kasun Perera", "0771234567", "iPhone 14 Pro", "359110293810294", "Display glass broken & touch unresponsive", 45000.00, 15000.00, "In Diagnostics"),
        ("rep_1002", "JOB-8842", "Nimali Fernando", "0719876543", "Samsung S23 Ultra", "358001928374651", "Battery replacement & charging port clean", 18500.00, 5000.00, "Waiting for Parts"),
        ("rep_1003", "JOB-8843", "Dilshan Silva", "0755544332", "Xiaomi 13T", "864112233445566", "Speaker distortion during calls", 12000.00, 12000.00, "Repaired")
    ]

    for r in repairs:
        cursor.execute("""
            INSERT INTO repair_jobs (id, job_number, customer_name, customer_phone, device_model, imei_or_serial, fault_description, estimated_cost, advance_paid, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, r)

    conn.commit()
    conn.close()
    print("Database seeding completed successfully.")

if __name__ == "__main__":
    seed_database()
