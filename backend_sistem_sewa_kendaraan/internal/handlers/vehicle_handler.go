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

func CreateVehicleHandler(db *sql.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var req models.Vehicle
		if err := c.BodyParser(&req); err != nil {
			return utils.Error(c, "Invalid input")
		}
		repo := repositories.NewVehicleRepository(db)
		service := services.NewVehicleService(repo)
		id, err := service.CreateVehicle(&req)
		if err != nil {
			return utils.Error(c, err.Error())
		}
		return utils.Success(c, fiber.Map{"vehicle_id": id})
	}
}

func ListVehicleHandler(db *sql.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		repo := repositories.NewVehicleRepository(db)
		service := services.NewVehicleService(repo)
		vehicles, err := service.GetAllVehicles()
		if err != nil {
			return utils.Error(c, err.Error())
		}
		return utils.Success(c, vehicles)
	}
}

func AddFuelLogHandler(db *sql.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var req struct {
			VehicleID int     `json:"vehicle_id"`
			FuelDate  string  `json:"fuel_date"`
			Liters    float64 `json:"liters"`
			Cost      float64 `json:"cost"`
			Odometer  int64   `json:"odometer"`
		}
		if err := c.BodyParser(&req); err != nil {
			return utils.Error(c, "Invalid input")
		}
		date, _ := time.Parse("2006-01-02", req.FuelDate)
		f := &models.VehicleFuelLog{VehicleID: req.VehicleID, FuelDate: date, Liters: req.Liters, Cost: req.Cost, Odometer: req.Odometer}

		repo := repositories.NewVehicleRepository(db)
		service := services.NewVehicleService(repo)
		id, err := service.AddFuelLog(f)
		if err != nil {
			return utils.Error(c, err.Error())
		}
		return utils.Success(c, fiber.Map{"fuel_id": id})
	}
}
