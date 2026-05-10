CREATE DATABASE IF NOT EXISTS cosmetic_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE cosmetic_db;

CREATE TABLE admin_users (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  username      VARCHAR(100) UNIQUE NOT NULL,
  email         VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE banners (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  image_url   VARCHAR(500) NOT NULL,
  title_th    VARCHAR(255),
  title_en    VARCHAR(255),
  subtitle_th VARCHAR(500),
  subtitle_en VARCHAR(500),
  sort_order  INT DEFAULT 0,
  is_active   BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE categories (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name_th    VARCHAR(255) NOT NULL,
  name_en    VARCHAR(255) NOT NULL,
  slug       VARCHAR(255) UNIQUE NOT NULL,
  sort_order INT DEFAULT 0,
  is_active  BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE products (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  category_id    INT,
  name_th        VARCHAR(255) NOT NULL,
  name_en        VARCHAR(255) NOT NULL,
  description_th TEXT,
  description_en TEXT,
  ingredients_th TEXT,
  ingredients_en TEXT,
  usage_th       TEXT,
  usage_en       TEXT,
  price          DECIMAL(10,2),
  is_active      BOOLEAN DEFAULT TRUE,
  sort_order     INT DEFAULT 0,
  created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

CREATE TABLE product_images (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  image_url  VARCHAR(500) NOT NULL,
  is_primary BOOLEAN DEFAULT FALSE,
  sort_order INT DEFAULT 0,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE contact_submissions (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(255) NOT NULL,
  email      VARCHAR(255),
  phone      VARCHAR(50),
  message    TEXT NOT NULL,
  is_read    BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE site_settings (
  id              INT PRIMARY KEY DEFAULT 1,
  company_name_th VARCHAR(255) DEFAULT 'Cosmetic',
  company_name_en VARCHAR(255) DEFAULT 'Cosmetic',
  logo_url        VARCHAR(500) DEFAULT NULL,
  line_oa_url     VARCHAR(500) DEFAULT NULL,
  facebook_url    VARCHAR(500) DEFAULT NULL,
  instagram_url   VARCHAR(500) DEFAULT NULL,
  tiktok_url      VARCHAR(500) DEFAULT NULL,
  footer_text_th  VARCHAR(500) DEFAULT 'สงวนลิขสิทธิ์',
  footer_text_en  VARCHAR(500) DEFAULT 'All rights reserved',
  updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO site_settings (id) VALUES (1);

-- Default admin (password: admin1234)
INSERT INTO admin_users (username, email, password_hash) VALUES
('admin', 'admin@cosmetic.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');
