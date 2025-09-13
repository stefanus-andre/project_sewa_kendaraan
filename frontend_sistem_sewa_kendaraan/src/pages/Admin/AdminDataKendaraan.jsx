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
import { Plus } from "lucide-react"
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

export default function AdminDataKendaraan() {
    const [kendaraan, setKendaraan] = useState([])
    const [regions, setRegions] = useState([])
    const [loading, setLoading] = useState(true)
    const [loadingDropdown, setLoadingDropdown] = useState(false)
    const [error, setError] = useState("")
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [formData, setFormData] = useState({
        plate_number: "",
        brand: "",
        model: "",
        year: "",
        status: "available",
        region_id: ""
    })

    useEffect(() => {
        fetchVehicles()
        fetchRegions()
    }, [])

    const fetchVehicles = async () => {
        setLoading(true)
        try {
            const res = await api.get("/vehicles")
            setKendaraan(res.data.data || [])
        } catch (err) {
            console.error("Error fetching vehicles: ", err)
            setError("Gagal memuat data kendaraan")
        } finally {
            setLoading(false)
        }
    }

    const fetchRegions = async () => {
        setLoadingDropdown(true)
        try {
            const res = await api.get("/regions")
            setRegions(res.data.data || [])
        } catch (err) {
            console.error("Error fetching regions: ", err)
            setError("Gagal memuat data region")
        } finally {
            setLoadingDropdown(false)
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")

        // Validasi minimal
        const requiredFields = ["plate_number", "brand", "model", "year", "status", "region_id"]
        for (let field of requiredFields) {
            if (!formData[field]) {
                setError(`Field ${field} wajib diisi`)
                return
            }
        }

        const payload = {
            ...formData,
            year: Number(formData.year),
            region_id: Number(formData.region_id)
        }

        try {
            const res = await api.post("/vehicles", payload)
            if (res.data.success) {
                setIsModalOpen(false)
                setFormData({
                    plate_number: "",
                    brand: "",
                    model: "",
                    year: "",
                    status: "available",
                    region_id: ""
                })
                fetchVehicles()
            } else {
                setError(res.data.message || "Gagal menambahkan kendaraan")
            }
        } catch (err) {
            console.error("Error creating vehicle: ", err)
            setError(err.response?.data?.message || "Gagal menambahkan kendaraan")
        }
    }

    return (
        <DashboardLayout>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Halaman Data Kendaraan</h1>
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogTrigger asChild>
                        <Button className="flex items-center gap-2">
                            <Plus className="h-4 w-4" />
                            Tambah Kendaraan
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Tambah Kendaraan Baru</DialogTitle>
                            <DialogDescription>
                                Isi form berikut untuk menambahkan kendaraan baru.
                            </DialogDescription>
                        </DialogHeader>

                        {loadingDropdown ? (
                            <div className="text-center py-8">Memuat data...</div>
                        ) : (
                            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 mt-4">
                                <div className="space-y-2">
                                    <Label htmlFor="plate_number">Nomor Plat</Label>
                                    <Input
                                        id="plate_number"
                                        name="plate_number"
                                        value={formData.plate_number}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="brand">Brand</Label>
                                    <Input
                                        id="brand"
                                        name="brand"
                                        value={formData.brand}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="model">Model</Label>
                                    <Input
                                        id="model"
                                        name="model"
                                        value={formData.model}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="year">Tahun</Label>
                                    <Input
                                        id="year"
                                        name="year"
                                        type="number"
                                        value={formData.year}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="status">Status</Label>
                                    <Select
                                        onValueChange={(value) => setFormData(prev => ({...prev, status: value}))}
                                        value={formData.status}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="available">Available</SelectItem>
                                            <SelectItem value="booked">Booked</SelectItem>
                                            <SelectItem value="maintenance">Maintenance</SelectItem>
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
                                                        key={region.region_id}
                                                        value={region.region_id.toString()}
                                                    >
                                                        {region.name}
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

            <div className="rounded-md border w-full">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[60px] text-center">ID</TableHead>
                            <TableHead>Nomor Plat</TableHead>
                            <TableHead>Brand</TableHead>
                            <TableHead>Model</TableHead>
                            <TableHead>Tahun</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Region</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-4">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : kendaraan.length > 0 ? (
                            kendaraan.map(vehicle => (
                                <TableRow key={vehicle.vehicle_id} className="text-sm">
                                    <TableCell className="text-center py-2">{vehicle.vehicle_id}</TableCell>
                                    <TableCell className="py-2">{vehicle.plate_number}</TableCell>
                                    <TableCell className="py-2">{vehicle.brand}</TableCell>
                                    <TableCell className="py-2">{vehicle.model}</TableCell>
                                    <TableCell className="py-2">{vehicle.year}</TableCell>
                                    <TableCell className="py-2">
                                        <span className={`px-2 py-1 rounded-full text-xs ${
                                            vehicle.status === 'available' ? 'bg-green-100 text-green-800' :
                                            vehicle.status === 'booked' ? 'bg-yellow-100 text-yellow-800' :
                                            vehicle.status === 'maintenance' ? 'bg-red-100 text-red-800' :
                                            'bg-gray-100 text-gray-800'
                                        }`}>
                                            {vehicle.status}
                                        </span>
                                    </TableCell>
                                    <TableCell className="py-2">
                                        {vehicle.region_name || vehicle.region_id || '-'}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-4">
                                    Tidak ada data kendaraan
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </DashboardLayout>
    )
}
