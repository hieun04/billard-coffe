-- Migration: Add category column to suppliers table
-- Run this script against your database to fix the "Invalid column name 'category'" error

ALTER TABLE suppliers ADD COLUMN category NVARCHAR(200) NULL;
