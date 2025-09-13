package repositories

import (
	"backend_sistem_sewa_kendaraan/internal/models"
	"database/sql"
)

type RegionRepository struct {
	DB *sql.DB
}

func NewRegionRepository(db *sql.DB) *RegionRepository {
	return &RegionRepository{DB: db}
}

func (r *RegionRepository) CreateRegion(region *models.Region) (int64, error) {
	query := `INSERT INTO regions (name) VALUES (?)`
	res, err := r.DB.Exec(query, region.Name)
	if err != nil {
		return 0, err
	}
	return res.LastInsertId()
}

func (r *RegionRepository) GetAllDataRegion() ([]models.Region, error) {
	query := `SELECT region_id, name FROM regions`
	rows, err := r.DB.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var regions []models.Region
	for rows.Next() {
		var reg models.Region
		if err := rows.Scan(&reg.RegionID, &reg.Name); err != nil {
			return nil, err
		}
		regions = append(regions, reg)
	}
	return regions, nil
}
