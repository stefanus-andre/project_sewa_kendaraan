package services

import (
	"backend_sistem_sewa_kendaraan/internal/models"
	"backend_sistem_sewa_kendaraan/internal/repositories"
)

type BookingService struct {
	Repo *repositories.BookingRepository
}

func NewBookingService(repo *repositories.BookingRepository) *BookingService {
	return &BookingService{Repo: repo}
}

func (s *BookingService) CreateBooking(b *models.Booking) (int64, error) {
	// Validasi sederhana: tanggal end harus >= start
	if b.EndDate.Before(b.StartDate) {
		return 0, ErrInvalidDateRange
	}
	return s.Repo.Create(b)
}

func (s *BookingService) GetAllBookings() ([]models.Booking, error) {
	return s.Repo.GetAll()
}

func (s *BookingService) GetBookingByID(id int) (*models.Booking, error) {
	return s.Repo.GetByID(id)
}

func (s *BookingService) GetAllBookingsMinimal() ([]models.Booking, error) {
	return s.Repo.GetAllMinimal()
}
