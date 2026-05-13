-- ── EduTech Pro — Script de Criação do Banco de Dados ──────────────────────
-- Execute este script uma vez para criar o banco e as tabelas.
-- mysql -u root -p < schema.sql

CREATE DATABASE IF NOT EXISTS edutech_pro
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE edutech_pro;

CREATE TABLE IF NOT EXISTS documents (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    file_id    VARCHAR(36)  NOT NULL UNIQUE,
    filename   VARCHAR(255) NOT NULL,
    summary    LONGTEXT,
    created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_file_id (file_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
