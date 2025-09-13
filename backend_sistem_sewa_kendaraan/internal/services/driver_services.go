package services

import (
	"backend_sistem_sewa_kendaraan/internal/models"
	"backend_sistem_sewa_kendaraan/internal/repositories"
)

type DriverService struct {
	Repo *repositories.DriverRepository
}

func NewDriverService(repo *repositories.DriverRepository) *DriverService {
	return &DriverService{Repo: repo}
}

func (s *DriverService) CreateDriver(d *models.Driver) (int64, error) {
	return s.Repo.Create(d)
}

func (s *DriverService) GetAllDrivers() ([]models.Driver, error) {
	return s.Repo.GetAll()
}
