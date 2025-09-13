package repositories

import (
	"backend_sistem_sewa_kendaraan/internal/models"
	"database/sql"
)

type UserRepository struct {
	DB *sql.DB
}

func NewUserRepository(db *sql.DB) *UserRepository {
	return &UserRepository{DB: db}
}

// Create User
func (r *UserRepository) Create(u *models.User) (int64, error) {
	query := `
		INSERT INTO users (name, email, password, role, position, region_id)
		VALUES (?, ?, ?, ?, ?, ?)
	`
	res, err := r.DB.Exec(query, u.Name, u.Email, u.Password, u.Role, u.Position, u.RegionID)
	if err != nil {
		return 0, err
	}
	return res.LastInsertId()
}

// List Users
func (r *UserRepository) GetAll() ([]models.User, error) {
	query := `
        SELECT u.user_id, u.name, u.email, u.role, u.position, 
               u.region_id, r.name as region_name 
        FROM users u
        LEFT JOIN regions r ON u.region_id = r.region_id
    `
	rows, err := r.DB.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var users []models.User
	for rows.Next() {
		var u models.User
		if err := rows.Scan(&u.UserID, &u.Name, &u.Email, &u.Role,
			&u.Position, &u.RegionID, &u.RegionName); err != nil {
			return nil, err
		}
		users = append(users, u)
	}
	return users, nil
}

// Get by ID
func (r *UserRepository) GetByID(id int) (*models.User, error) {
	query := `SELECT user_id, name, email, role, position, region_id FROM users WHERE user_id = ?`
	row := r.DB.QueryRow(query, id)

	var u models.User
	if err := row.Scan(&u.UserID, &u.Name, &u.Email, &u.Role, &u.Position, &u.RegionID); err != nil {
		return nil, err
	}
	return &u, nil
}

// Get by Email
func (r *UserRepository) GetByEmail(email string) (*models.User, error) {
	query := `SELECT user_id, name, email, password, role, position, region_id FROM users WHERE email = ?`
	row := r.DB.QueryRow(query, email)

	var u models.User
	if err := row.Scan(&u.UserID, &u.Name, &u.Email, &u.Password, &u.Role, &u.Position, &u.RegionID); err != nil {
		return nil, err
	}
	return &u, nil
}
