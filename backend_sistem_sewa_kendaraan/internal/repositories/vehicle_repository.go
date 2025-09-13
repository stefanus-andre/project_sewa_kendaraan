package repositories

import (
	"backend_sistem_sewa_kendaraan/internal/models"
	"database/sql"
)

type VehicleRepository struct {
	DB *sql.DB
}

func NewVehicleRepository(db *sql.DB) *VehicleRepository {
	return &VehicleRepository{DB: db}
}

func (r *VehicleRepository) Create(v *models.Vehicle) (int64, error) {
	query := `
		INSERT INTO vehicles (plate_number, brand, model, year, status, region_id)
		VALUES (?, ?, ?, ?, ?, ?)
	`
	res, err := r.DB.Exec(query, v.PlateNumber, v.Brand, v.Model, v.Year, v.Status, v.RegionID)
	if err != nil {
		return 0, err
	}
	return res.LastInsertId()
}

func (r *VehicleRepository) GetAll() ([]models.Vehicle, error) {
	rows, err := r.DB.Query(`
		SELECT 
			v.vehicle_id, v.plate_number, v.brand, v.model, v.year, v.status, 
			v.region_id, r.name AS region_name,
			v.created_at, v.updated_at
		FROM vehicles v
		LEFT JOIN regions r ON v.region_id = r.region_id
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var vehicles []models.Vehicle
	for rows.Next() {
		var v models.Vehicle
		if err := rows.Scan(
			&v.VehicleID, &v.PlateNumber, &v.Brand, &v.Model, &v.Year, &v.Status,
			&v.RegionID, &v.RegionName,
			&v.CreatedAt, &v.UpdatedAt,
		); err != nil {
			return nil, err
		}
		vehicles = append(vehicles, v)
	}
	return vehicles, nil
}

func (r *VehicleRepository) GetByID(id int) (*models.Vehicle, error) {
	row := r.DB.QueryRow(`SELECT vehicle_id, plate_number, brand, model, year, status, region_id, created_at, updated_at FROM vehicles WHERE vehicle_id=?`, id)
	var v models.Vehicle
	if err := row.Scan(&v.VehicleID, &v.PlateNumber, &v.Brand, &v.Model, &v.Year, &v.Status, &v.RegionID, &v.CreatedAt, &v.UpdatedAt); err != nil {
		return nil, err
	}
	return &v, nil
}

func (r *VehicleRepository) AddFuelLog(f *models.VehicleFuelLog) (int64, error) {
	query := `INSERT INTO vehicle_fuel_logs (vehicle_id, fuel_date, liters, cost, odometer) VALUES (?, ?, ?, ?, ?)`
	res, err := r.DB.Exec(query, f.VehicleID, f.FuelDate, f.Liters, f.Cost, f.Odometer)
	if err != nil {
		return 0, err
	}
	return res.LastInsertId()
}

func (r *VehicleRepository) AddService(s *models.VehicleService) (int64, error) {
	query := `INSERT INTO vehicle_services (vehicle_id, service_date, service_type, cost, notes) VALUES (?, ?, ?, ?, ?)`
	res, err := r.DB.Exec(query, s.VehicleID, s.ServiceDate, s.ServiceType, s.Cost, s.Notes)
	if err != nil {
		return 0, err
	}
	return res.LastInsertId()
}

func (r *VehicleRepository) AddUsageLog(u *models.VehicleUsageLog) (int64, error) {
	query := `INSERT INTO vehicle_usage_logs (vehicle_id, user_id, booking_id, start_date, end_date, start_odometer, end_odometer, purpose) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
	res, err := r.DB.Exec(query, u.VehicleID, u.UserID, u.BookingID, u.StartDate, u.EndDate, u.StartOdometer, u.EndOdometer, u.Purpose)
	if err != nil {
		return 0, err
	}
	return res.LastInsertId()
}
