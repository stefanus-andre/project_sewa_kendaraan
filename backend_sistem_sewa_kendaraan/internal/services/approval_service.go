package services

import (
	"backend_sistem_sewa_kendaraan/internal/models"
	"backend_sistem_sewa_kendaraan/internal/repositories"
)

type ApprovalService struct {
	Repo *repositories.ApprovalRepository
}

func NewApprovalService(repo *repositories.ApprovalRepository) *ApprovalService {
	return &ApprovalService{Repo: repo}
}

func (s *ApprovalService) CreateApproval(a *models.Approval) (int64, error) {
	return s.Repo.Create(a)
}

// services/approval_service.go

func (s *ApprovalService) UpdateApprovalStatus(id int, status string) error {
	// update approval status dulu
	err := s.Repo.UpdateStatus(id, status)
	if err != nil {
		return err
	}

	// ambil booking_id dari approval_id
	approval, err := s.Repo.GetByID(id)
	if err != nil {
		return err
	}

	// cek semua approval untuk booking ini
	approvals, err := s.Repo.GetByBooking(approval.BookingID)
	if err != nil {
		return err
	}

	allApproved := true
	for _, a := range approvals {
		if a.Status != "approved" {
			allApproved = false
			break
		}
	}

	if allApproved {
		// update status booking
		return s.Repo.UpdateBookingStatus(approval.BookingID, "approved")
	}

	return nil
}

func (s *ApprovalService) GetAllApprovals() ([]models.Approval, error) {
	return s.Repo.GetAllWithDetails()
}

func (s *ApprovalService) GetApprovalByBooking(bookingID int) ([]models.Approval, error) {
	return s.Repo.GetByBooking(bookingID)
}
