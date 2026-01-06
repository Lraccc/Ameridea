-- Migration: Add profile_picture column to users table
-- Run this in your Supabase SQL Editor

ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_picture TEXT;
