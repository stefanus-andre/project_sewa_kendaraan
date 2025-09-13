"use client"

import DashboardLayout from "./Layout/DashboardLayout"
import { useEffect, useState } from "react"
import api from "@/lib/api"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function AdminDataApproval() {
    const [approvals, setApprovals] = useState([])
    const [bookings, setBookings] = useState([])
    const [approvers, setApprovers] = useState([])
    const [loading, setLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [formData, setFormData] = useState({
        booking_id: "",
        approver_id: "",
        level: null
    })
    const [error, setError] = useState("")

    useEffect(() => {
        fetchApprovals()
        fetchBookings()
        fetchApprovers()
    }, [])

    const fetchApprovals = async () => {
        setLoading(true)
        try {
            const res = await api.get("/approvals")
            setApprovals(res.data.data || [])
        } catch (err) {
            console.error("Error fetching approvals: ", err)
        } finally {
            setLoading(false)
        }
    }

    const fetchBookings = async () => {
    try {
        const res = await api.get("/get_minimal_booking?fields=purpose,user_name")
        // Ambil data yang relevan saja
        setBookings(res.data.data.map(b => ({
            id: b.id,
            purpose: b.purpose,
            user_name: b.user_name
        })))
    } catch (err) {
        console.error("Error fetching bookings: ", err)
    }
}


    const fetchApprovers = async () => {
        try {
            const res = await api.get("/users?role=approver")
            setApprovers(res.data.data || [])
        } catch (err) {
            console.error("Error fetching approvers: ", err)
        }
    }

    const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (!formData.booking_id || !formData.approver_id || formData.level === null) {
        setError("Semua field wajib diisi")
        return
    }

    try {
        const payload = {
            booking_id: Number(formData.booking_id),
            approver_id: Number(formData.approver_id),
            level: Number(formData.level)
        }

        const res = await api.post("/approvals", payload)
        if (res.data.success) {
            setIsModalOpen(false)
            setFormData({ booking_id: "", approver_id: "", level: null })
            fetchApprovals()
        } else {
            setError(res.data.message || "Gagal menambahkan approval")
        }
    } catch (err) {
        console.error("Error creating approval: ", err)
        setError(err.response?.data?.message || "Gagal menambahkan approval")
    }
}


    return (
        <DashboardLayout>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Halaman Approval</h1>
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogTrigger asChild>
                        <Button className="flex items-center gap-2">
                            <Plus className="h-4 w-4" />
                            Tambah Approval
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle>Tambah Approval Baru</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="grid gap-4 mt-4">
                            <div className="space-y-2">
                                <Label htmlFor="booking_id">Booking</Label>
                                <Select
                                    onValueChange={(value) => setFormData(prev => ({ ...prev, booking_id: value }))}
                                    value={formData.booking_id}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih booking" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {bookings.map(b => (
                                            <SelectItem key={b.id} value={String(b.id)}>
                                            {b.purpose} - {b.user_name}
                                            </SelectItem>
                                        ))}
                                        </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="approver_id">Approver</Label>
                                <Select
                                    onValueChange={(value) => setFormData(prev => ({ ...prev, approver_id: value }))}
                                    value={formData.approver_id}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih approver" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {approvers.map(a => (
                                            <SelectItem key={a.user_id} value={String(a.user_id)}>
                                                {a.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="level">Level</Label>
                                <Select
                                    onValueChange={(value) => setFormData(prev => ({ ...prev, level: value }))}
                                    value={formData.level ?? ""}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih level" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">Approver</SelectItem>
                                        <SelectItem value="2">Employee</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {error && (
                                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-sm">
                                    {error}
                                </div>
                            )}

                            <div className="flex justify-end gap-2 mt-4">
                                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                                    Batal
                                </Button>
                                <Button type="submit">Simpan</Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="rounded-md border w-full">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[60px] text-center">ID</TableHead>
                            <TableHead>Booking</TableHead>
                            <TableHead>Approver</TableHead>
                            <TableHead>Level</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Approved At</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-4">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : approvals.length > 0 ? (
                            approvals.map((a) => (
                                <TableRow key={a.approval_id} className="text-sm">
                                    <TableCell className="text-center py-2">{a.approval_id}</TableCell>
                                    <TableCell className="py-2">{a.booking_purpose} - {a.user_name}</TableCell>
                                    <TableCell className="py-2">{a.approver_name}</TableCell>
                                    <TableCell className="py-2">{a.level === 1 ? "Approver" : "Employee"}</TableCell>
                                    <TableCell className="py-2">{a.status || "-"}</TableCell>
                                    <TableCell className="py-2">{a.approved_at || "-"}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-4">
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
