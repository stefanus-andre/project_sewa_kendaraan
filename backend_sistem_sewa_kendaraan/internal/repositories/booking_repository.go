package repositories

import (
	"backend_sistem_sewa_kendaraan/internal/models"
	"database/sql"
)

type BookingRepository struct {
	DB *sql.DB
}

func NewBookingRepository(db *sql.DB) *BookingRepository {
	return &BookingRepository{DB: db}
}

// Create Booking
func (r *BookingRepository) Create(b *models.Booking) (int64, error) {
	query := `
		INSERT INTO bookings (user_id, region_id, vehicle_id, driver_id, purpose, start_date, end_date, status)
		VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')
	`
	res, err := r.DB.Exec(query, b.UserID, b.RegionID, b.VehicleID, b.DriverID, b.Purpose, b.StartDate, b.EndDate)
	if err != nil {
		return 0, err
	}
	return res.LastInsertId()
}

// List Bookings
func (r *BookingRepository) GetAll() ([]models.Booking, error) {
	query := `
		SELECT 
			b.booking_id, b.user_id, b.region_id, b.vehicle_id, b.driver_id, 
			b.purpose, b.start_date, b.end_date, b.status, b.created_at,
			u.name as user_name,
			v.model as vehicle_name,
			v.plate_number as vehicle_plate,
			d.name as driver_name,
			r.name as region_name
		FROM bookings b
		LEFT JOIN users u ON b.user_id = u.user_id
		LEFT JOIN vehicles v ON b.vehicle_id = v.vehicle_id
		LEFT JOIN drivers d ON b.driver_id = d.driver_id
		LEFT JOIN regions r ON b.region_id = r.region_id
		ORDER BY b.created_at DESC
	`

	rows, err := r.DB.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var bookings []models.Booking
	for rows.Next() {
		var b models.Booking
		if err := rows.Scan(
			&b.ID, &b.UserID, &b.RegionID, &b.VehicleID, &b.DriverID,
			&b.Purpose, &b.StartDate, &b.EndDate, &b.Status, &b.CreatedAt,
			&b.UserName, &b.VehicleName, &b.VehiclePlate, &b.DriverName, &b.RegionName,
		); err != nil {
			return nil, err
		}
		bookings = append(bookings, b)
	}
	return bookings, nil
}

func (r *BookingRepository) GetByPeriod(startDate, endDate string) ([]models.Booking, error) {
	query := `
		SELECT 
			b.booking_id, b.user_id, b.region_id, b.vehicle_id, b.driver_id, 
			b.purpose, b.start_date, b.end_date, b.status, b.created_at,
			u.name as user_name,
			v.model as vehicle_name,
			v.plate_number as vehicle_plate,
			d.name as driver_name,
			r.name as region_name
		FROM bookings b
		LEFT JOIN users u ON b.user_id = u.user_id
		LEFT JOIN vehicles v ON b.vehicle_id = v.vehicle_id
		LEFT JOIN drivers d ON b.driver_id = d.driver_id
		LEFT JOIN regions r ON b.region_id = r.region_id
		WHERE b.start_date >= ? AND b.end_date <= ?
		ORDER BY b.start_date ASC
	`

	rows, err := r.DB.Query(query, startDate, endDate)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var bookings []models.Booking
	for rows.Next() {
		var b models.Booking
		if err := rows.Scan(
			&b.ID, &b.UserID, &b.RegionID, &b.VehicleID, &b.DriverID,
			&b.Purpose, &b.StartDate, &b.EndDate, &b.Status, &b.CreatedAt,
			&b.UserName, &b.VehicleName, &b.VehiclePlate, &b.DriverName, &b.RegionName,
		); err != nil {
			return nil, err
		}
		bookings = append(bookings, b)
	}
	return bookings, nil
}

// GetByID dengan JOIN
func (r *BookingRepository) GetByID(id int) (*models.Booking, error) {
	query := `
		SELECT 
			b.booking_id, b.user_id, b.region_id, b.vehicle_id, b.driver_id, 
			b.purpose, b.start_date, b.end_date, b.status, b.created_at,
			u.name as user_name,
			v.model as vehicle_name,
			v.plate_number as vehicle_plate,
			d.name as driver_name,
			r.name as region_name
		FROM bookings b
		LEFT JOIN users u ON b.user_id = u.user_id
		LEFT JOIN vehicles v ON b.vehicle_id = v.vehicle_id
		LEFT JOIN drivers d ON b.driver_id = d.driver_id
		LEFT JOIN regions r ON b.region_id = r.region_id
		WHERE b.booking_id = ?
	`

	row := r.DB.QueryRow(query, id)

	var b models.Booking
	if err := row.Scan(
		&b.ID, &b.UserID, &b.RegionID, &b.VehicleID, &b.DriverID,
		&b.Purpose, &b.StartDate, &b.EndDate, &b.Status, &b.CreatedAt,
		&b.UserName, &b.VehicleName, &b.VehiclePlate, &b.DriverName, &b.RegionName,
	); err != nil {
		return nil, err
	}
	return &b, nil
}

func (r *BookingRepository) GetAllMinimal() ([]models.Booking, error) {
	query := `
		SELECT 
			b.booking_id,
			b.purpose,
			u.name as user_name
		FROM bookings b
		LEFT JOIN users u ON b.user_id = u.user_id
		ORDER BY b.created_at DESC
	`

	rows, err := r.DB.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var bookings []models.Booking
	for rows.Next() {
		var b models.Booking
		if err := rows.Scan(
			&b.ID, &b.Purpose, &b.UserName,
		); err != nil {
			return nil, err
		}
		bookings = append(bookings, b)
	}
	return bookings, nil
}
