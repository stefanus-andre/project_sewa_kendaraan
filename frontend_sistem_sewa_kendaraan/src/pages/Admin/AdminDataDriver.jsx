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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function AdminDataDriver() {
    const [drivers, setDrivers] = useState([])
    const [regions, setRegions] = useState([])
    const [loading, setLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        license_number: "",
        phone: "",
        region_id: ""
    })
    const [error, setError] = useState("")

    useEffect(() => {
        fetchDrivers()
        fetchRegions()
    }, [])

    const fetchDrivers = async () => {
        setLoading(true)
        try {
            const res = await api.get("/drivers")
            setDrivers(res.data.data || [])
        } catch (err) {
            console.error("Error fetching drivers: ", err)
        } finally {
            setLoading(false)
        }
    }

    const fetchRegions = async () => {
        try {
            const res = await api.get("/regions")
            setRegions(res.data.data || [])
        } catch (err) {
            console.error("Error fetching regions: ", err)
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    // Validasi
    if (!formData.name || !formData.license_number || !formData.phone || !formData.region_id) {
        setError("Semua field wajib diisi")
        return
    }

    try {
        // Convert region_id ke number
        const payload = {
            ...formData,
            region_id: Number(formData.region_id)
        }

        const res = await api.post("/drivers", payload)
        if (res.data.success) {
            setIsModalOpen(false)
            setFormData({ name: "", license_number: "", phone: "", region_id: "" })
            fetchDrivers()
        } else {
            setError(res.data.message || "Gagal menambahkan driver")
        }
    } catch (err) {
        console.error("Error creating driver: ", err)
        setError(err.response?.data?.message || "Gagal menambahkan driver")
    }
}


    return (
        <DashboardLayout>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Halaman Driver</h1>
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogTrigger asChild>
                        <Button className="flex items-center gap-2">
                            <Plus className="h-4 w-4" />
                            Tambah Driver
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle>Tambah Driver Baru</DialogTitle>
                            <DialogDescription>
                                Isi form berikut untuk menambahkan driver baru.
                            </DialogDescription>
                        </DialogHeader>

                        <form onSubmit={handleSubmit} className="grid gap-4 mt-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nama Driver</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="license_number">Nomor SIM</Label>
                                <Input
                                    id="license_number"
                                    name="license_number"
                                    value={formData.license_number}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Nomor HP</Label>
                                <Input
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="region_id">Region</Label>
                                <Select
                                    onValueChange={(value) => setFormData(prev => ({ ...prev, region_id: value }))}
                                    value={formData.region_id}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih region" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {regions.map(region => (
                                            <SelectItem key={region.region_id} value={String(region.region_id)}>
                                                {region.name}
                                            </SelectItem>
                                        ))}
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
                            <TableHead>Nama</TableHead>
                            <TableHead>Nomor SIM</TableHead>
                            <TableHead>Nomor HP</TableHead>
                            <TableHead>Region</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-4">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : drivers.length > 0 ? (
                            drivers.map(driver => (
                                <TableRow key={driver.driver_id} className="text-sm">
                                    <TableCell className="text-center py-2">{driver.driver_id}</TableCell>
                                    <TableCell className="py-2">{driver.name}</TableCell>
                                    <TableCell className="py-2">{driver.license_number}</TableCell>
                                    <TableCell className="py-2">{driver.phone}</TableCell>
                                    <TableCell className="py-2">{driver.region_name || driver.region_id}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-4">
                                    Tidak ada data driver
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </DashboardLayout>
    )
}
