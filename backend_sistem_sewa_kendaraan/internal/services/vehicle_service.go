package services

import (
	"backend_sistem_sewa_kendaraan/internal/models"
	"backend_sistem_sewa_kendaraan/internal/repositories"
)

type VehicleService struct {
	Repo *repositories.VehicleRepository
}

func NewVehicleService(repo *repositories.VehicleRepository) *VehicleService {
	return &VehicleService{Repo: repo}
}

func (s *VehicleService) CreateVehicle(v *models.Vehicle) (int64, error) {
	return s.Repo.Create(v)
}

func (s *VehicleService) GetAllVehicles() ([]models.Vehicle, error) {
	return s.Repo.GetAll()
}

func (s *VehicleService) GetVehicleByID(id int) (*models.Vehicle, error) {
	return s.Repo.GetByID(id)
}

func (s *VehicleService) AddFuelLog(f *models.VehicleFuelLog) (int64, error) {
	return s.Repo.AddFuelLog(f)
}

func (s *VehicleService) AddService(svc *models.VehicleService) (int64, error) {
	return s.Repo.AddService(svc)
}

func (s *VehicleService) AddUsageLog(u *models.VehicleUsageLog) (int64, error) {
	return s.Repo.AddUsageLog(u)
}
