package handlers

import (
	"backend_sistem_sewa_kendaraan/internal/models"
	"backend_sistem_sewa_kendaraan/internal/repositories"
	"backend_sistem_sewa_kendaraan/internal/services"
	"backend_sistem_sewa_kendaraan/pkg/utils"
	"database/sql"

	"github.com/gofiber/fiber/v2"
)

func CreateDriverHandler(db *sql.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var req models.Driver
		if err := c.BodyParser(&req); err != nil {
			return utils.Error(c, "Invalid input")
		}

		repo := repositories.NewDriverRepository(db)
		service := services.NewDriverService(repo)

		id, err := service.CreateDriver(&req)
		if err != nil {
			return utils.Error(c, err.Error())
		}

		return utils.Success(c, fiber.Map{"driver_id": id})
	}
}

func ListDriverHandler(db *sql.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		repo := repositories.NewDriverRepository(db)
		service := services.NewDriverService(repo)

		drivers, err := service.GetAllDrivers()
		if err != nil {
			return utils.Error(c, err.Error())
		}

		return utils.Success(c, drivers)
	}
}
