package models

import "time"

type Driver struct {
	DriverID      int       `db:"driver_id" json:"driver_id"`
	Name          string    `db:"name" json:"name"`
	LicenseNumber string    `db:"license_number" json:"license_number"`
	Phone         string    `db:"phone" json:"phone"`
	RegionID      int       `db:"region_id" json:"region_id"`
	RegionName    string    `db:"region_name" json:"region_name,omitempty"`
	CreatedAt     time.Time `db:"created_at" json:"created_at"`
	UpdatedAt     time.Time `db:"updated_at" json:"updated_at"`
}
