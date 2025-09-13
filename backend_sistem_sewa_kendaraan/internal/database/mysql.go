package database

import (
	"backend_sistem_sewa_kendaraan/config"
	"database/sql"
	"fmt"
	"log"

	_ "github.com/go-sql-driver/mysql"
)

var DB *sql.DB

func ConnectDB(cfg config.Config) *sql.DB {
	// Format DSN → user:password@tcp(host:port)/dbname
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?parseTime=true",
		cfg.DBUser, cfg.DBPass, cfg.DBHost, cfg.DBPort, cfg.DBName)

	db, err := sql.Open("mysql", dsn)
	if err != nil {
		log.Fatal("❌ Gagal open koneksi database:", err)
	}

	// Tes koneksi
	if err := db.Ping(); err != nil {
		log.Fatal("❌ Gagal ping database:", err)
	}

	fmt.Println("✅ Database connected")
	return db
}
