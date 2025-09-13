package services

import "errors"

var (
	ErrInvalidDateRange = errors.New("tanggal selesai tidak boleh sebelum tanggal mulai")
)
