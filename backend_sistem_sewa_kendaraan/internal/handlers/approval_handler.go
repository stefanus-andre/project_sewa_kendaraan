package handlers

import (
	"backend_sistem_sewa_kendaraan/internal/models"
	"backend_sistem_sewa_kendaraan/internal/repositories"
	"backend_sistem_sewa_kendaraan/internal/services"
	"backend_sistem_sewa_kendaraan/pkg/utils"
	"database/sql"
	"strconv"

	"github.com/gofiber/fiber/v2"
)

func CreateApprovalHandler(db *sql.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var req struct {
			BookingID  int `json:"booking_id"`
			ApproverID int `json:"approver_id"` // ✅ harus pakai approver_id
			Level      int `json:"level"`
		}

		if err := c.BodyParser(&req); err != nil {
			return utils.Error(c, "Invalid input")
		}

		approval := &models.Approval{
			BookingID:  req.BookingID,
			ApproverID: req.ApproverID, // ✅ masukkan ke ApproverID
			Level:      req.Level,
			Status:     "pending",
		}

		repo := repositories.NewApprovalRepository(db)
		service := services.NewApprovalService(repo)

		id, err := service.CreateApproval(approval)
		if err != nil {
			return utils.Error(c, "Failed to create approval: "+err.Error())
		}
		return utils.Success(c, fiber.Map{"approval_id": id})
	}
}

func UpdateApprovalHandler(db *sql.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		id, _ := strconv.Atoi(c.Params("id"))

		var req struct {
			Status string `json:"status"`
		}

		if err := c.BodyParser(&req); err != nil {
			return utils.Error(c, "Invalid input")
		}

		repo := repositories.NewApprovalRepository(db)
		service := services.NewApprovalService(repo)

		if err := service.UpdateApprovalStatus(id, req.Status); err != nil {
			return utils.Error(c, err.Error())
		}
		return utils.Success(c, fiber.Map{"message": "Approval updated"})
	}
}

func ListApprovalByBookingHandler(db *sql.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		bookingID, _ := strconv.Atoi(c.Params("booking_id"))

		repo := repositories.NewApprovalRepository(db)
		service := services.NewApprovalService(repo)

		approvals, err := service.GetApprovalByBooking(bookingID)
		if err != nil {
			return utils.Error(c, err.Error())
		}
		return utils.Success(c, approvals)
	}
}

func ListAllApprovalsHandler(db *sql.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		repo := repositories.NewApprovalRepository(db)
		service := services.NewApprovalService(repo)

		approvals, err := service.GetAllApprovals()
		if err != nil {
			return utils.Error(c, "Failed to fetch approvals: "+err.Error())
		}
		return utils.Success(c, approvals)
	}
}
