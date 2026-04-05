-- Migration 045: Add extra parcel fields (deed_type, vat_rate, road_access, is_corner_parcel)
ALTER TABLE listings.parcels
  ADD COLUMN IF NOT EXISTS deed_type      VARCHAR(100) NULL,
  ADD COLUMN IF NOT EXISTS vat_rate       NUMERIC(5,2) NULL,
  ADD COLUMN IF NOT EXISTS road_access    VARCHAR(100) NULL,
  ADD COLUMN IF NOT EXISTS is_corner_parcel BOOLEAN NOT NULL DEFAULT FALSE;
