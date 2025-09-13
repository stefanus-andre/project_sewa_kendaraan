package services

import (
	"backend_sistem_sewa_kendaraan/internal/models"
	"backend_sistem_sewa_kendaraan/internal/repositories"
)

type RegionService struct {
	Repo *repositories.RegionRepository
}

func NewRegionService(repo *repositories.RegionRepository) *RegionService {
	return &RegionService{Repo: repo}
}

func (s *RegionService) CreateRegion(region *models.Region) (int64, error) {
	return s.Repo.CreateRegion(region)
}

func (s *RegionService) GetAllRegions() ([]models.Region, error) {
	return s.Repo.GetAllDataRegion()
}
