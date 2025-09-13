package repositories

import (
	"backend_sistem_sewa_kendaraan/internal/models"
	"database/sql"
)

type DriverRepository struct {
	DB *sql.DB
}

func NewDriverRepository(db *sql.DB) *DriverRepository {
	return &DriverRepository{DB: db}
}

// Create Driver
func (r *DriverRepository) Create(d *models.Driver) (int64, error) {
	query := `
		INSERT INTO drivers (name, license_number, phone, region_id)
		VALUES (?, ?, ?, ?)
	`
	res, err := r.DB.Exec(query, d.Name, d.LicenseNumber, d.Phone, d.RegionID)
	if err != nil {
		return 0, err
	}
	return res.LastInsertId()
}

// List Drivers
func (r *DriverRepository) GetAll() ([]models.Driver, error) {
	rows, err := r.DB.Query(`
		SELECT 
			d.driver_id, d.name, d.license_number, d.phone, 
			d.region_id, r.name AS region_name,
			d.created_at, d.updated_at
		FROM drivers d
		LEFT JOIN regions r ON d.region_id = r.region_id
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var drivers []models.Driver
	for rows.Next() {
		var d models.Driver
		if err := rows.Scan(
			&d.DriverID, &d.Name, &d.LicenseNumber, &d.Phone,
			&d.RegionID, &d.RegionName,
			&d.CreatedAt, &d.UpdatedAt,
		); err != nil {
			return nil, err
		}
		drivers = append(drivers, d)
	}
	return drivers, nil
}
