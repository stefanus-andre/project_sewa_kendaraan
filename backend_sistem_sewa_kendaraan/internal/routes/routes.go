package routes

import (
	"backend_sistem_sewa_kendaraan/internal/handlers"
	"backend_sistem_sewa_kendaraan/pkg/utils"
	"database/sql"

	"github.com/gofiber/fiber/v2"
)

func Setup(app *fiber.App, db *sql.DB) {
	api := app.Group("/api")

	//public
	api.Post("/users", handlers.CreateUserHandler(db))
	api.Post("/login", handlers.LoginHandler(db))
	api.Post("/logout", handlers.LogoutHandler(db))

	//middleware
	api.Use(utils.JWTMiddleware())

	//akses admin untuk user
	api.Get("/users", utils.RoleGuard("admin"), handlers.ListUserHandler(db))
	api.Get("/users/:id", utils.RoleGuard("admin"), handlers.GetUserByIDHandler(db))

	//booking yang di buat oleh admin & employee
	api.Post("/bookings", utils.RoleGuard("admin", "employee"), handlers.CreateBookingHandler(db))
	api.Get("/bookings", utils.RoleGuard("admin", "employee"), handlers.ListBookingHandler(db))
	api.Get("/get_minimal_booking", utils.RoleGuard("admin", "approver"), handlers.ListBookingMinimalHandler(db))

	//approvals routes
	api.Post("/approvals", utils.RoleGuard("admin"), handlers.CreateApprovalHandler(db))
	api.Put("/approvals/:id", utils.RoleGuard("approver"), handlers.UpdateApprovalHandler(db))
	api.Get("/approvals/:booking_id", utils.RoleGuard("admin", "approver"), handlers.ListApprovalByBookingHandler(db))
	api.Get("/approvals", utils.RoleGuard("admin", "approver"), handlers.ListAllApprovalsHandler(db))

	//vehicle routes
	api.Post("/vehicles", handlers.CreateVehicleHandler(db))
	api.Get("/vehicles", handlers.ListVehicleHandler(db))
	api.Post("/vehicles/fuel", handlers.AddFuelLogHandler(db))

	//region routes
	api.Post("/regions", handlers.CreateRegionHandler(db))
	api.Get("/regions", handlers.ListRegionHandler(db))

	//driver routes
	api.Post("/drivers", handlers.CreateDriverHandler(db))
	api.Get("/drivers", handlers.ListDriverHandler(db))

	//report rouutes
	api.Get("/reports/bookings", handlers.ExportBookingReportHandler(db))

	//reports routes
	//api.Get("/reports/export", handlers.ExportReportHandler(db))
}
