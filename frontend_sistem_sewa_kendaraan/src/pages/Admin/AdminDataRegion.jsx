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

export default function AdminDataRegion() {
    const [regions, setRegions] = useState([])
    const [loading, setLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        location: ""
    })
    const [error, setError] = useState("")

    useEffect(() => {
        fetchRegions()
    }, [])

    const fetchRegions = async () => {
        setLoading(true)
        try {
            const res = await api.get("/regions")
            setRegions(res.data.data || [])
        } catch (err) {
            console.error("Error fetching regions: ", err)
        } finally {
            setLoading(false)
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")

        if (!formData.name) {
            setError("Nama region wajib diisi")
            return
        }

        try {
            const res = await api.post("/regions", formData)
            if (res.data.success) {
                setIsModalOpen(false)
                setFormData({ name: "", location: "" })
                fetchRegions()
            } else {
                setError(res.data.message || "Gagal menambahkan region")
            }
        } catch (err) {
            console.error("Error creating region: ", err)
            setError(err.response?.data?.message || "Gagal menambahkan region")
        }
    }

    return (
        <DashboardLayout>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Halaman Region</h1>
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogTrigger asChild>
                        <Button className="flex items-center gap-2">
                            <Plus className="h-4 w-4" />
                            Tambah Region
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle>Tambah Region Baru</DialogTitle>
                            <DialogDescription>
                                Isi form berikut untuk menambahkan region baru.
                            </DialogDescription>
                        </DialogHeader>

                        <form onSubmit={handleSubmit} className="grid gap-4 mt-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nama Region</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="location">Lokasi</Label>
                                <Input
                                    id="location"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                />
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
                            <TableHead>Lokasi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center py-4">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : regions.length > 0 ? (
                            regions.map(region => (
                                <TableRow key={region.region_id} className="text-sm">
                                    <TableCell className="text-center py-2">{region.region_id}</TableCell>
                                    <TableCell className="py-2">{region.name}</TableCell>
                                    <TableCell className="py-2">{region.location || "-"}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center py-4">
                                    Tidak ada data region
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </DashboardLayout>
    )
}
