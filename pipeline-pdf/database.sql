-- Script de setup completo do banco de dados
-- Execute no MySQL Workbench ou terminal MySQL

CREATE DATABASE IF NOT EXISTS pdf_pipeline CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE pdf_pipeline;

CREATE TABLE IF NOT EXISTS documentos (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  nome_arquivo    VARCHAR(255)  NOT NULL,
  nome_cliente    VARCHAR(255)  NULL,
  numero_fatura   VARCHAR(50)   NULL,
  cnpj            VARCHAR(20)   NULL,
  email_cliente   VARCHAR(100)  NULL,
  data_emissao    DATE          NULL,
  data_vencimento DATE          NULL,
  valor_extraido  DECIMAL(10,2) NULL,
  data_upload     TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
);

-- Verifique a estrutura:
DESCRIBE documentos;
