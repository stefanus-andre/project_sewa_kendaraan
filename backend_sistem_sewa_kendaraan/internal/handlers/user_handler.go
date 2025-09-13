package handlers

import (
	"backend_sistem_sewa_kendaraan/internal/models"
	"backend_sistem_sewa_kendaraan/internal/repositories"
	"backend_sistem_sewa_kendaraan/internal/services"
	"backend_sistem_sewa_kendaraan/pkg/utils"
	"database/sql"
	"fmt"
	"strconv"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
)

func CreateUserHandler(db *sql.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var req struct {
			Name     string `json:"name"`
			Email    string `json:"email"`
			Password string `json:"password"`
			Role     string `json:"role"`
			Position string `json:"position"`
			RegionID int    `json:"region_id"`
		}

		if err := c.BodyParser(&req); err != nil {
			fmt.Println("Error parsing body:", err) // Debug logging
			return utils.Error(c, "Invalid input")
		}

		fmt.Printf("Parsed data: %+v\n", req) // Debug logging

		user := &models.User{
			Name:     req.Name,
			Email:    req.Email,
			Password: req.Password,
			Role:     strings.ToLower(req.Role), // Convert to lowercase
			Position: req.Position,
			RegionID: req.RegionID,
		}

		repo := repositories.NewUserRepository(db)
		service := services.NewUserService(repo)

		id, err := service.CreateUser(user)
		if err != nil {
			return utils.Error(c, err.Error())
		}

		return utils.Success(c, fiber.Map{"user_id": id})
	}
}

func ListUserHandler(db *sql.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		repo := repositories.NewUserRepository(db)
		service := services.NewUserService(repo)

		users, err := service.GetAllUsers()
		if err != nil {
			return utils.Error(c, err.Error())
		}

		return utils.Success(c, users)
	}
}

func GetUserByIDHandler(db *sql.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		id, _ := strconv.Atoi(c.Params("id"))

		repo := repositories.NewUserRepository(db)
		service := services.NewUserService(repo)

		user, err := service.GetUserByID(id)
		if err != nil {
			return utils.Error(c, "User not found")
		}

		return utils.Success(c, user)
	}
}

func LoginHandler(db *sql.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var req struct {
			Email    string `json:"email"`
			Password string `json:"password"`
		}

		if err := c.BodyParser(&req); err != nil {
			return utils.Error(c, "Invalid input")
		}

		repo := repositories.NewUserRepository(db)
		service := services.NewUserService(repo)

		user, err := service.Authenticate(req.Email, req.Password)
		if err != nil {
			return utils.Error(c, "Invalid email or password")
		}

		token, err := utils.GenerateJWT(user.UserID, user.Role)
		if err != nil {
			return utils.Error(c, "Failed to generate token")
		}

		return utils.Success(c, fiber.Map{
			"token": token,
			"user": fiber.Map{
				"user_id": user.UserID,
				"name":    user.Name,
				"email":   user.Email,
				"role":    user.Role,
			},
		})
	}
}

func LogoutHandler(db *sql.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {

		return utils.Success(c, fiber.Map{
			"message":   "Logout successful",
			"timestamp": time.Now().Unix(),
		})
	}
}
