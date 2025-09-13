package models

import "time"

type Booking struct {
	ID        int       `db:"booking_id" json:"id"`
	UserID    int       `db:"user_id" json:"user_id"`
	RegionID  int       `db:"region_id" json:"region_id"`
	VehicleID int       `db:"vehicle_id" json:"vehicle_id"`
	DriverID  int       `db:"driver_id" json:"driver_id"`
	Purpose   string    `db:"purpose" json:"purpose"`
	StartDate time.Time `db:"start_date" json:"start_date"`
	EndDate   time.Time `db:"end_date" json:"end_date"`
	Status    string    `db:"status" json:"status"`
	CreatedAt time.Time `db:"created_at" json:"created_at"`

	// Fields for joined data
	UserName     string `db:"user_name" json:"user_name,omitempty"`
	VehicleName  string `db:"vehicle_name" json:"vehicle_name,omitempty"`
	DriverName   string `db:"driver_name" json:"driver_name,omitempty"`
	RegionName   string `db:"region_name" json:"region_name,omitempty"`
	VehiclePlate string `db:"vehicle_plate" json:"vehicle_plate,omitempty"`
}
