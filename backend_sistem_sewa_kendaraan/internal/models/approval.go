package models

import "time"

type Approval struct {
	ApprovalID     int       `json:"approval_id"`
	BookingID      int       `json:"booking_id"`
	ApproverID     int       `json:"approver_id"`
	Level          int       `json:"level"`
	Status         string    `json:"status"`
	ApprovedAt     time.Time `json:"approved_at"`
	BookingPurpose string    `json:"booking_purpose,omitempty"`
	UserName       string    `json:"user_name,omitempty"`
	ApproverName   string    `json:"approver_name,omitempty"`
}
