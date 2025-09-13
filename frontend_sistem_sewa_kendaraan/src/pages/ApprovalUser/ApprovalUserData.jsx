"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import DashboardLayout from "../Admin/Layout/DashboardLayout"
import { useEffect, useState } from "react"
import api from "@/lib/api"

export default function ApprovalUserData() {
      const [approvals, setApprovals] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [updating, setUpdating] = useState({})

    useEffect(() => {
        fetchApprovals()
    }, [])

    const fetchApprovals = async () => {
        try {
            const res = await api.get("/approvals") // Gunakan endpoint baru
            if (res.data.data) {
                setApprovals(res.data.data)
            }
        } catch (err) {
            console.error("Error fetching approvals:", err)
            setError("Gagal memuat data approval")
        } finally {
            setLoading(false)
        }
    }

    const handleUpdateStatus = async (approvalId, newStatus) => {
        setUpdating(prev => ({ ...prev, [approvalId]: true }))
        
        try {
            const res = await api.put(`/approvals/${approvalId}`, {
                status: newStatus
            })
            
            if (res.data.success) {
                // Refresh data setelah update
                fetchApprovals()
            }
        } catch (err) {
            console.error("Error updating approval:", err)
            setError("Gagal mengupdate status approval")
        } finally {
            setUpdating(prev => ({ ...prev, [approvalId]: false }))
        }
    }

    const formatDate = (dateString) => {
        if (!dateString) return '-'
        const date = new Date(dateString)
        return date.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const getStatusBadge = (status) => {
        const statusConfig = {
            'pending': { color: 'bg-yellow-100 text-yellow-800', label: 'Menunggu' },
            'approved': { color: 'bg-green-100 text-green-800', label: 'Disetujui' },
            'rejected': { color: 'bg-red-100 text-red-800', label: 'Ditolak' }
        }

        const config = statusConfig[status] || { color: 'bg-gray-100 text-gray-800', label: status }
        
        return (
            <span className={`px-2 py-1 rounded-full text-xs ${config.color}`}>
                {config.label}
            </span>
        )
    }

    return (
        <DashboardLayout>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Dashboard Approval</h1>
                <Button 
                    onClick={fetchApprovals} 
                    variant="outline" 
                    size="sm"
                    disabled={loading}
                >
                    {loading ? "Loading..." : "Refresh"}
                </Button>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <div className="rounded-md border w-full">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[60px] text-center">ID</TableHead>
                            <TableHead>Booking ID</TableHead>
                            <TableHead>Approver ID</TableHead>
                            <TableHead>Level</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Approved At</TableHead>
                            <TableHead className="text-center">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-4">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : approvals.length > 0 ? (
                            approvals.map((approval) => (
                                <TableRow key={approval.approval_id} className="text-sm">
                                    <TableCell className="text-center py-2">
                                        {approval.approval_id}
                                    </TableCell>
                                    <TableCell className="py-2">
                                        {approval.booking_id}
                                    </TableCell>
                                    <TableCell className="py-2">
                                        {approval.approver_id}
                                    </TableCell>
                                    <TableCell className="py-2">
                                        Level {approval.level}
                                    </TableCell>
                                    <TableCell className="py-2">
                                        {getStatusBadge(approval.status)}
                                    </TableCell>
                                    <TableCell className="py-2">
                                        {formatDate(approval.approved_at)}
                                    </TableCell>
                                    <TableCell className="py-2 text-center">
                                        <div className="flex gap-2 justify-center">
                                            {approval.status === 'pending' && (
                                                <>
                                                    <Button
                                                        size="sm"
                                                        className="bg-green-500 text-white hover:bg-green-600 text-xs"
                                                        onClick={() => handleUpdateStatus(approval.approval_id, 'approved')}
                                                        disabled={updating[approval.approval_id]}
                                                    >
                                                        {updating[approval.approval_id] ? '...' : 'Approve'}
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white text-xs"
                                                        onClick={() => handleUpdateStatus(approval.approval_id, 'rejected')}
                                                        disabled={updating[approval.approval_id]}
                                                    >
                                                        {updating[approval.approval_id] ? '...' : 'Reject'}
                                                    </Button>
                                                </>
                                            )}
                                            {approval.status !== 'pending' && (
                                                <span className="text-gray-500 text-xs">
                                                    Sudah diproses
                                                </span>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-4">
                                    Tidak ada data approval
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </DashboardLayout>
    )
}