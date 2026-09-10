import sqlite3
import os
import json
from datetime import datetime

DB_FILE = os.path.join(os.path.dirname(__file__), "smartzone_local.db")

def get_db():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    cursor = conn.cursor()
    
    # 1. USERS
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        full_name TEXT NOT NULL,
        hashed_password TEXT NOT NULL,
        role TEXT DEFAULT 'cashier',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    ''')
    
    # 2. PRODUCTS
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        category_name TEXT NOT NULL,
        brand_name TEXT NOT NULL,
        model_name TEXT NOT NULL,
        base_price REAL NOT NULL,
        min_stock_alert INTEGER DEFAULT 2,
        warranty_months INTEGER DEFAULT 12,
        image_url TEXT
    );
    ''')

    # 3. STOCK ITEMS (IMEI TRACKING)
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS stock_items (
        id TEXT PRIMARY KEY,
        product_id TEXT REFERENCES products(id),
        imei_or_serial TEXT UNIQUE NOT NULL,
        status TEXT DEFAULT 'AVAILABLE', -- AVAILABLE, SOLD, REPAIR
        cost_price REAL NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    ''')

    # 4. SALES
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS sales (
        id TEXT PRIMARY KEY,
        invoice_number TEXT UNIQUE NOT NULL,
        cashier_id TEXT REFERENCES users(id),
        subtotal REAL NOT NULL,
        discount_amount REAL DEFAULT 0.00,
        grand_total REAL NOT NULL,
        payment_method TEXT NOT NULL,
        customer_name TEXT,
        customer_phone TEXT,
        synced_to_cloud INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    ''')

    # 5. SALE ITEMS
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS sale_items (
        id TEXT PRIMARY KEY,
        sale_id TEXT REFERENCES sales(id),
        product_id TEXT REFERENCES products(id),
        stock_item_id TEXT REFERENCES stock_items(id),
        unit_price REAL NOT NULL,
        warranty_expiry_date TEXT
    );
    ''')

    # 6. REPAIR JOBS
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS repair_jobs (
        id TEXT PRIMARY KEY,
        job_number TEXT UNIQUE NOT NULL,
        customer_name TEXT NOT NULL,
        customer_phone TEXT NOT NULL,
        device_model TEXT NOT NULL,
        imei_or_serial TEXT,
        fault_description TEXT NOT NULL,
        estimated_cost REAL NOT NULL,
        advance_paid REAL DEFAULT 0.0,
        status TEXT DEFAULT 'Pending', -- Pending, In Diagnostics, Waiting for Parts, Repaired, Delivered
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    ''')

    # 7. CUSTOMERS
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS customers (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        phone TEXT UNIQUE NOT NULL,
        email TEXT DEFAULT '',
        points INTEGER DEFAULT 0,
        total_spent REAL DEFAULT 0.0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    ''')

    # 8. OFFLINE SYNC QUEUE
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS sync_queue (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        endpoint TEXT NOT NULL,
        payload_json TEXT NOT NULL,
        status TEXT DEFAULT 'PENDING',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    ''')

    conn.commit()
    conn.close()
