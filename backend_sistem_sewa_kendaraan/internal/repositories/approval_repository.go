package repositories

import (
	"backend_sistem_sewa_kendaraan/internal/models"
	"database/sql"
	"time"
)

type ApprovalRepository struct {
	DB *sql.DB
}

func NewApprovalRepository(db *sql.DB) *ApprovalRepository {
	return &ApprovalRepository{DB: db}
}

func (r *ApprovalRepository) Create(a *models.Approval) (int64, error) {
	query := `
		INSERT INTO booking_approvals (booking_id, approver_id, level, status)
		VALUES (?, ?, ?, 'pending')
	`
	res, err := r.DB.Exec(query, a.BookingID, a.ApproverID, a.Level)
	if err != nil {
		return 0, err
	}
	return res.LastInsertId()
}

func (r *ApprovalRepository) UpdateStatus(approvalID int, status string) error {
	query := `
		UPDATE booking_approvals
		SET status = ?, approved_at = ?
		WHERE approval_id = ?
	`
	_, err := r.DB.Exec(query, status, time.Now(), approvalID)
	return err
}

// Get Approvals by Booking
func (r *ApprovalRepository) GetByBooking(bookingID int) ([]models.Approval, error) {
	query := `SELECT approval_id, booking_id, approver_id, level, status, approved_at FROM booking_approvals WHERE booking_id = ?`
	rows, err := r.DB.Query(query, bookingID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var approvals []models.Approval
	for rows.Next() {
		var a models.Approval
		var approvedAt sql.NullTime
		if err := rows.Scan(&a.ApprovalID, &a.BookingID, &a.ApproverID, &a.Level, &a.Status, &approvedAt); err != nil {
			return nil, err
		}
		if approvedAt.Valid {
			a.ApprovedAt = approvedAt.Time
		}
		approvals = append(approvals, a)
	}
	return approvals, nil
}

func (r *ApprovalRepository) GetByID(id int) (*models.Approval, error) {
	query := `SELECT approval_id, booking_id, approver_id, level, status, approved_at 
	          FROM booking_approvals WHERE approval_id = ?`
	row := r.DB.QueryRow(query, id)

	var a models.Approval
	var approvedAt sql.NullTime
	if err := row.Scan(&a.ApprovalID, &a.BookingID, &a.ApproverID, &a.Level, &a.Status, &approvedAt); err != nil {
		return nil, err
	}
	if approvedAt.Valid {
		a.ApprovedAt = approvedAt.Time
	}
	return &a, nil
}

func (r *ApprovalRepository) GetAllWithDetails() ([]models.Approval, error) {
	query := `
	SELECT 
		a.approval_id, a.booking_id, a.approver_id, a.level, a.status, a.approved_at,
		b.purpose as booking_purpose,
		u.name as user_name,
		ap.name as approver_name
	FROM booking_approvals a
	LEFT JOIN bookings b ON a.booking_id = b.booking_id
	LEFT JOIN users u ON b.user_id = u.user_id
	LEFT JOIN users ap ON a.approver_id = ap.user_id
	ORDER BY a.approval_id DESC
	`

	rows, err := r.DB.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var approvals []models.Approval
	for rows.Next() {
		var a models.Approval
		var approvedAt sql.NullTime
		var bookingPurpose, userName, approverName sql.NullString

		if err := rows.Scan(
			&a.ApprovalID,
			&a.BookingID,
			&a.ApproverID,
			&a.Level,
			&a.Status,
			&approvedAt,
			&bookingPurpose,
			&userName,
			&approverName,
		); err != nil {
			return nil, err
		}

		if approvedAt.Valid {
			a.ApprovedAt = approvedAt.Time
		}
		if bookingPurpose.Valid {
			a.BookingPurpose = bookingPurpose.String
		}
		if userName.Valid {
			a.UserName = userName.String
		}
		if approverName.Valid {
			a.ApproverName = approverName.String
		}

		approvals = append(approvals, a)
	}

	return approvals, nil
}

func (r *ApprovalRepository) UpdateBookingStatus(bookingID int, status string) error {
	_, err := r.DB.Exec(`UPDATE bookings SET status = ? WHERE booking_id = ?`, status, bookingID)
	return err
}
