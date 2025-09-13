package models

import "time"

type Vehicle struct {
	VehicleID   int       `json:"vehicle_id"`
	PlateNumber string    `json:"plate_number"`
	Brand       string    `json:"brand"`
	Model       string    `json:"model"`
	Year        int       `json:"year"`
	Status      string    `json:"status"`
	RegionID    int       `json:"region_id"`
	RegionName  string    `db:"region_name" json:"region_name,omitempty"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

type VehicleFuelLog struct {
	FuelID    int       `json:"fuel_id"`
	VehicleID int       `json:"vehicle_id"`
	FuelDate  time.Time `json:"fuel_date"`
	Liters    float64   `json:"liters"`
	Cost      float64   `json:"cost"`
	Odometer  int64     `json:"odometer"`
}

type VehicleService struct {
	ServiceID   int       `json:"service_id"`
	VehicleID   int       `json:"vehicle_id"`
	ServiceDate time.Time `json:"service_date"`
	ServiceType string    `json:"service_type"`
	Cost        float64   `json:"cost"`
	Notes       string    `json:"notes"`
}

type VehicleUsageLog struct {
	UsageID       int       `json:"usage_id"`
	VehicleID     int       `json:"vehicle_id"`
	UserID        int       `json:"user_id"`
	BookingID     *int      `json:"booking_id,omitempty"`
	StartDate     time.Time `json:"start_date"`
	EndDate       time.Time `json:"end_date"`
	StartOdometer int64     `json:"start_odometer"`
	EndOdometer   int64     `json:"end_odometer"`
	Purpose       string    `json:"purpose"`
}
