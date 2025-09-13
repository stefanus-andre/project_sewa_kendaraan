package handlers

import (
	"backend_sistem_sewa_kendaraan/internal/models"
	"backend_sistem_sewa_kendaraan/internal/repositories"
	"backend_sistem_sewa_kendaraan/internal/services"
	"backend_sistem_sewa_kendaraan/pkg/utils"
	"database/sql"

	"github.com/gofiber/fiber/v2"
)

func CreateRegionHandler(db *sql.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var req models.Region
		if err := c.BodyParser(&req); err != nil {
			return utils.Error(c, "Invalid input")
		}

		repo := repositories.NewRegionRepository(db)
		service := services.NewRegionService(repo)

		id, err := service.CreateRegion(&req)
		if err != nil {
			return utils.Error(c, err.Error())
		}

		return utils.Success(c, fiber.Map{"region_id": id})
	}
}

func ListRegionHandler(db *sql.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		repo := repositories.NewRegionRepository(db)
		service := services.NewRegionService(repo)

		regions, err := service.GetAllRegions()
		if err != nil {
			return utils.Error(c, err.Error())
		}

		return utils.Success(c, regions)
	}
}
