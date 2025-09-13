package main

import (
	"backend_sistem_sewa_kendaraan/config"
	"backend_sistem_sewa_kendaraan/internal/database"
	"backend_sistem_sewa_kendaraan/internal/routes"
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func main() {
	cfg := config.LoadConfig()

	db := database.ConnectDB(cfg)

	app := fiber.New()

	app.Use(cors.New(cors.Config{
		AllowOrigins:     "*",
		AllowMethods:     "GET,POST,PUT,DELETE,OPTIONS",
		AllowHeaders:     "Origin, Content-Type, Accept, Authorization, X-Requested-With",
		AllowCredentials: false, // Tidak bisa true jika AllowOrigins = "*"
		ExposeHeaders:    "Content-Length, Content-Type, Authorization",
	}))

	routes.Setup(app, db)

	log.Fatal(app.Listen(":" + cfg.ServerPort))

}
