package handlers

import (
	"backend_sistem_sewa_kendaraan/internal/models"
	"backend_sistem_sewa_kendaraan/internal/repositories"
	"backend_sistem_sewa_kendaraan/internal/services"
	"backend_sistem_sewa_kendaraan/pkg/utils"
	"database/sql"
	"time"

	"github.com/gofiber/fiber/v2"
)

func CreateBookingHandler(db *sql.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var req struct {
			UserID    int    `json:"user_id"`
			RegionID  int    `json:"region_id"`
			VehicleID int    `json:"vehicle_id"`
			DriverID  int    `json:"driver_id"`
			Purpose   string `json:"purpose"`
			StartDate string `json:"start_date"`
			EndDate   string `json:"end_date"`
		}

		if err := c.BodyParser(&req); err != nil {
			return utils.Error(c, "Invalid input")
		}

		start, err := time.Parse("2006-01-02 15:04:05", req.StartDate)
		if err != nil {
			return utils.Error(c, "Format start_date salah (gunakan Y-m-d H:i:s)")
		}
		end, err := time.Parse("2006-01-02 15:04:05", req.EndDate)
		if err != nil {
			return utils.Error(c, "Format end_date salah (gunakan Y-m-d H:i:s)")
		}

		booking := &models.Booking{
			UserID:    req.UserID,
			RegionID:  req.RegionID,
			VehicleID: req.VehicleID,
			DriverID:  req.DriverID,
			Purpose:   req.Purpose,
			StartDate: start,
			EndDate:   end,
		}

		repo := repositories.NewBookingRepository(db)
		service := services.NewBookingService(repo)

		id, err := service.CreateBooking(booking)
		if err != nil {
			return utils.Error(c, err.Error())
		}

		return utils.Success(c, fiber.Map{"booking_id": id})
	}
}

func ListBookingHandler(db *sql.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		repo := repositories.NewBookingRepository(db)
		service := services.NewBookingService(repo)

		bookings, err := service.GetAllBookings()
		if err != nil {
			return utils.Error(c, err.Error())
		}

		return utils.Success(c, bookings)
	}
}

func ListBookingMinimalHandler(db *sql.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		repo := repositories.NewBookingRepository(db)
		service := services.NewBookingService(repo)

		bookings, err := service.GetAllBookingsMinimal()
		if err != nil {
			return utils.Error(c, err.Error())
		}

		return utils.Success(c, bookings)
	}
}
