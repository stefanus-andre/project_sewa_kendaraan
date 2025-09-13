package handlers

import (
	"backend_sistem_sewa_kendaraan/internal/repositories"
	"database/sql"
	"fmt"

	"github.com/gofiber/fiber/v2"
	"github.com/xuri/excelize/v2"
)

func ExportBookingReportHandler(db *sql.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		start := c.Query("start_date") // format: yyyy-mm-dd
		end := c.Query("end_date")

		if start == "" || end == "" {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "start_date and end_date required",
			})
		}

		repo := repositories.NewBookingRepository(db)
		bookings, err := repo.GetByPeriod(start, end)
		if err != nil {
			return c.Status(500).JSON(fiber.Map{
				"error": err.Error(),
			})
		}

		// buat file excel
		f := excelize.NewFile()
		sheet := "Laporan"
		f.SetSheetName("Sheet1", sheet)

		// header
		headers := []string{"Booking ID", "User ID", "Vehicle ID", "Driver ID", "Purpose", "Start Date", "End Date", "Status"}
		for i, h := range headers {
			cell := fmt.Sprintf("%c1", 'A'+i)
			f.SetCellValue(sheet, cell, h)
		}

		// isi data
		for i, b := range bookings {
			row := i + 2
			f.SetCellValue(sheet, fmt.Sprintf("A%d", row), b.ID)
			f.SetCellValue(sheet, fmt.Sprintf("B%d", row), b.UserID)
			f.SetCellValue(sheet, fmt.Sprintf("C%d", row), b.VehicleID)
			f.SetCellValue(sheet, fmt.Sprintf("D%d", row), b.DriverID)
			f.SetCellValue(sheet, fmt.Sprintf("E%d", row), b.Purpose)
			f.SetCellValue(sheet, fmt.Sprintf("F%d", row), b.StartDate.Format("2006-01-02 15:04"))
			f.SetCellValue(sheet, fmt.Sprintf("G%d", row), b.EndDate.Format("2006-01-02 15:04"))
			f.SetCellValue(sheet, fmt.Sprintf("H%d", row), b.Status)
		}

		// stream sebagai response
		c.Set("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
		c.Set("Content-Disposition", fmt.Sprintf("attachment; filename=laporan_%s_%s.xlsx", start, end))

		return f.Write(c.Response().BodyWriter())
	}
}
