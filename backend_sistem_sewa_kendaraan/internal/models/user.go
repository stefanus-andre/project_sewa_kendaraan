package models

type User struct {
	UserID     int    `json:"user_id"`
	Name       string `json:"name"`
	Email      string `json:"email"`
	Password   string `json:"password"`
	Role       string `json:"role"`
	Position   string `json:"position"`
	RegionID   int    `json:"region_id"`
	RegionName string `json:"region_name,omitempty"`
}
