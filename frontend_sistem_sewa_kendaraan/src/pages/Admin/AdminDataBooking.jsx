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
import { Download, Calendar, Plus } from "lucide-react"
import DashboardLayout from "./Layout/DashboardLayout"
import { useEffect, useState } from "react"
import api from "@/lib/api"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function AdminDataBooking() {
    const [bookings, setBookings] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [downloading, setDownloading] = useState(false)
    const [dateRange, setDateRange] = useState({
        start_date: "",
        end_date: ""
    })
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [formData, setFormData] = useState({
        user_id: "",
        region_id: "",
        vehicle_id: "",
        driver_id: "",
        purpose: "",
        start_date: "",
        end_date: ""
    })
    const [users, setUsers] = useState([])
    const [regions, setRegions] = useState([])
    const [vehicles, setVehicles] = useState([])
    const [drivers, setDrivers] = useState([])
    const [loadingDropdown, setLoadingDropdown] = useState(false)

    useEffect(() => {
        fetchBookings()
        fetchDropdownData()
    }, [])

    const fetchBookings = () => {
        setLoading(true)
        api.get("/bookings")
        .then((res) => {
            if (res.data.success && res.data.data) {
                setBookings(res.data.data)
            }
        })
        .catch((err) => {
            console.error("Error fetching bookings: ", err)
            setError("Gagal memuat data booking")
        })
        .finally(() => setLoading(false))
    }

    const fetchDropdownData = async () => {
        setLoadingDropdown(true)
        try {
            const [usersRes, regionsRes, vehiclesRes, driversRes] = await Promise.all([
                api.get("/users").catch(err => ({ data: { success: false, data: [] } })),
                api.get("/regions").catch(err => ({ data: { success: false, data: [] } })),
                api.get("/vehicles").catch(err => ({ data: { success: false, data: [] } })),
                api.get("/drivers").catch(err => ({ data: { success: false, data: [] } }))
            ])

            // Filter data untuk menghindari nilai kosong dengan field names yang benar
            const filterValidData = (data, idField) => {
                if (!data || !Array.isArray(data)) return []
                return data.filter(item => item && item[idField] !== undefined && item[idField] !== null && item[idField] !== '')
            }

            if (usersRes.data?.success) {
                setUsers(filterValidData(usersRes.data.data, 'user_id'))
            }
            if (regionsRes.data?.success) {
                setRegions(filterValidData(regionsRes.data.data, 'region_id'))
            }
            if (vehiclesRes.data?.success) {
                setVehicles(filterValidData(vehiclesRes.data.data, 'vehicle_id'))
            }
            if (driversRes.data?.success) {
                setDrivers(filterValidData(driversRes.data.data, 'driver_id'))
            }

        } catch (err) {
            console.error("Error fetching dropdown data: ", err)
            setError("Gagal memuat data dropdown")
        } finally {
            setLoadingDropdown(false)
        }
    }

    const handleDownloadExcel = async () => {
        if (!dateRange.start_date || !dateRange.end_date) {
            setError("Pilih tanggal mulai dan tanggal selesai terlebih dahulu")
            return
        }

        setDownloading(true)
        setError("")

        try {
            const response = await api.get("/reports/bookings", {
                params: {
                    start_date: dateRange.start_date,
                    end_date: dateRange.end_date
                },
                responseType: 'blob'
            })

            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', `laporan-booking-${dateRange.start_date}-to-${dateRange.end_date}.xlsx`)
            document.body.appendChild(link)
            link.click()
            link.remove()
            window.URL.revokeObjectURL(url)

        } catch (err) {
            console.error("Error downloading report: ", err)
            setError("Gagal mengunduh laporan")
        } finally {
            setDownloading(false)
        }
    }

    const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    // Validasi wajib
    const requiredFields = ["user_id", "region_id", "vehicle_id", "start_date", "end_date", "purpose"]
    for (let field of requiredFields) {
        if (!formData[field]) {
            setError(`Field ${field} wajib diisi`)
            return
        }
    }

    const formatDatetimeForBackend = (datetimeLocal) => {
        return datetimeLocal.replace("T", " ") + ":00"
    }

    const payload = {
        user_id: Number(formData.user_id),
        region_id: Number(formData.region_id),
        vehicle_id: Number(formData.vehicle_id),
        driver_id: formData.driver_id ? Number(formData.driver_id) : null,
        purpose: formData.purpose,
        start_date: formatDatetimeForBackend(formData.start_date),
        end_date: formatDatetimeForBackend(formData.end_date)
    }

    try {
        const response = await api.post("/bookings", payload)
        if (response.data.success) {
            setIsModalOpen(false)
            setFormData({
                user_id: "",
                region_id: "",
                vehicle_id: "",
                driver_id: "",
                purpose: "",
                start_date: "",
                end_date: ""
            })
            fetchBookings()
        } else {
            setError(response.data.message || "Gagal membuat booking")
        }
    } catch (err) {
        console.error("Error creating booking: ", err)
        setError(err.response?.data?.message || "Gagal membuat booking")
    }
}



    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
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
            'rejected': { color: 'bg-red-100 text-red-800', label: 'Ditolak' },
            'completed': { color: 'bg-blue-100 text-blue-800', label: 'Selesai' },
            'cancelled': { color: 'bg-gray-100 text-gray-800', label: 'Dibatalkan' }
        }

        const config = statusConfig[status] || { color: 'bg-gray-100 text-gray-800', label: status }
        
        return (
            <span className={`px-2 py-1 rounded-full text-xs ${config.color}`}>
                {config.label}
            </span>
        )
    }

    // Helper function untuk mendapatkan nilai yang aman dengan field names yang benar
    const getSafeValue = (item, key, fallback = '') => {
        return item && item[key] !== undefined && item[key] !== null && item[key] !== '' 
            ? item[key] 
            : fallback
    }

    return (
        <DashboardLayout>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Halaman Data Booking</h1>
                
                <div className="flex items-center gap-4">
                    {/* Date Picker */}
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <input
                            type="date"
                            value={dateRange.start_date}
                            onChange={(e) => setDateRange(prev => ({...prev, start_date: e.target.value}))}
                            className="border rounded px-2 py-1 text-sm"
                            placeholder="Tanggal Mulai"
                        />
                        <span className="text-gray-500">s/d</span>
                        <input
                            type="date"
                            value={dateRange.end_date}
                            onChange={(e) => setDateRange(prev => ({...prev, end_date: e.target.value}))}
                            className="border rounded px-2 py-1 text-sm"
                            placeholder="Tanggal Selesai"
                        />
                    </div>

                    {/* Download Button */}
                    <Button 
                        onClick={handleDownloadExcel}
                        disabled={downloading || !dateRange.start_date || !dateRange.end_date}
                        className="flex items-center gap-2"
                    >
                        <Download className="h-4 w-4" />
                        {downloading ? "Mengunduh..." : "Download Excel"}
                    </Button>

                    {/* Add Booking Button */}
                    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                        <DialogTrigger asChild>
                            <Button className="flex items-center gap-2">
                                <Plus className="h-4 w-4" />
                                Tambah Booking
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>Tambah Booking Baru</DialogTitle>
                                <DialogDescription>
                                    Isi form berikut untuk menambahkan booking baru.
                                </DialogDescription>
                            </DialogHeader>
                            
                            {loadingDropdown ? (
                                <div className="text-center py-8">Memuat data...</div>
                            ) : (
                                <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 mt-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="user_id">User</Label>
                                        <Select 
                                            onValueChange={(value) => setFormData(prev => ({...prev, user_id: value}))}
                                            value={formData.user_id}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih User" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {users.length > 0 ? (
                                                    users.map(user => (
                                                        <SelectItem 
                                                            key={`user-${getSafeValue(user, 'user_id', 'unknown')}`}
                                                            value={getSafeValue(user, 'user_id').toString()}
                                                        >
                                                            {getSafeValue(user, 'name', `User ${getSafeValue(user, 'user_id')}`)}
                                                        </SelectItem>
                                                    ))
                                                ) : (
                                                    <SelectItem value="no-data" disabled>
                                                        Tidak ada data user
                                                    </SelectItem>
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="region_id">Region</Label>
                                        <Select 
                                            onValueChange={(value) => setFormData(prev => ({...prev, region_id: value}))}
                                            value={formData.region_id}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih Region" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {regions.length > 0 ? (
                                                    regions.map(region => (
                                                        <SelectItem 
                                                            key={`region-${getSafeValue(region, 'region_id', 'unknown')}`}
                                                            value={getSafeValue(region, 'region_id').toString()}
                                                        >
                                                            {getSafeValue(region, 'name', `Region ${getSafeValue(region, 'region_id')}`)}
                                                        </SelectItem>
                                                    ))
                                                ) : (
                                                    <SelectItem value="no-data" disabled>
                                                        Tidak ada data region
                                                    </SelectItem>
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="vehicle_id">Kendaraan</Label>
                                        <Select 
                                            onValueChange={(value) => setFormData(prev => ({...prev, vehicle_id: value}))}
                                            value={formData.vehicle_id}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih Kendaraan" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {vehicles.length > 0 ? (
                                                    vehicles.map(vehicle => (
                                                        <SelectItem 
                                                            key={`vehicle-${getSafeValue(vehicle, 'vehicle_id', 'unknown')}`}
                                                            value={getSafeValue(vehicle, 'vehicle_id').toString()}
                                                        >
                                                            {getSafeValue(vehicle, 'brand', 'N/A')} {getSafeValue(vehicle, 'model', 'N/A')} ({getSafeValue(vehicle, 'plate_number', 'N/A')})
                                                        </SelectItem>
                                                    ))
                                                ) : (
                                                    <SelectItem value="no-data" disabled>
                                                        Tidak ada data kendaraan
                                                    </SelectItem>
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="driver_id">Driver</Label>
                                        <Select 
                                            onValueChange={(value) => setFormData(prev => ({...prev, driver_id: value}))}
                                            value={formData.driver_id}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih Driver" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {drivers.length > 0 ? (
                                                    drivers.map(driver => (
                                                        <SelectItem 
                                                            key={`driver-${getSafeValue(driver, 'driver_id', 'unknown')}`}
                                                            value={getSafeValue(driver, 'driver_id').toString()}
                                                        >
                                                            {getSafeValue(driver, 'name', `Driver ${getSafeValue(driver, 'driver_id')}`)}
                                                        </SelectItem>
                                                    ))
                                                ) : (
                                                    <SelectItem value="no-data" disabled>
                                                        Tidak ada data driver
                                                    </SelectItem>
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2 col-span-2">
                                        <Label htmlFor="purpose">Tujuan</Label>
                                        <Input
                                            id="purpose"
                                            name="purpose"
                                            value={formData.purpose}
                                            onChange={handleInputChange}
                                            placeholder="Masukkan tujuan booking"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="start_date">Tanggal Mulai</Label>
                                        <Input
                                            id="start_date"
                                            name="start_date"
                                            type="datetime-local"
                                            value={formData.start_date}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="end_date">Tanggal Selesai</Label>
                                        <Input
                                            id="end_date"
                                            name="end_date"
                                            type="datetime-local"
                                            value={formData.end_date}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    {error && (
                                        <div className="col-span-2 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-sm">
                                            {error}
                                        </div>
                                    )}

                                    <div className="col-span-2 flex justify-end gap-2 mt-4">
                                        <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                                            Batal
                                        </Button>
                                        <Button type="submit">
                                            Simpan
                                        </Button>
                                    </div>
                                </form>
                            )}
                        </DialogContent>
                    </Dialog>
                </div>
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
                            <TableHead>User</TableHead>
                            <TableHead>Region</TableHead>
                            <TableHead>Kendaraan</TableHead>
                            <TableHead>Driver</TableHead>
                            <TableHead>Tanggal Mulai</TableHead>
                            <TableHead>Tanggal Selesai</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Keterangan</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={9} className="text-center py-4">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : bookings.length > 0 ? (
                            bookings.map((booking) => (
                                <TableRow key={`booking-${booking.id}`} className="text-sm">
                                    <TableCell className="text-center py-2">
                                        {booking.id}
                                    </TableCell>
                                    <TableCell className="py-2">
                                        {booking.user_name || `User ${booking.user_id}`}
                                    </TableCell>
                                    <TableCell className="py-2">
                                        {booking.region_name || `Region ${booking.region_id}`}
                                    </TableCell>
                                    <TableCell className="py-2">
                                        {booking.vehicle_name} ({booking.vehicle_plate})
                                    </TableCell>
                                    <TableCell className="py-2">
                                        {booking.driver_name || 
                                         (booking.driver_id ? `Driver ${booking.driver_id}` : 'Tidak ada driver')}
                                    </TableCell>
                                    <TableCell className="py-2">
                                        {formatDate(booking.start_date)}
                                    </TableCell>
                                    <TableCell className="py-2">
                                        {formatDate(booking.end_date)}
                                    </TableCell>
                                    <TableCell className="py-2">
                                        {getStatusBadge(booking.status)}
                                    </TableCell>
                                    <TableCell className="py-2">
                                        {booking.purpose || '-'}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={9} className="text-center py-4">
                                    Tidak ada data booking
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </DashboardLayout>
    )
}