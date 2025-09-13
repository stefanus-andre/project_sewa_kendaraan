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

import { useEffect, useState } from "react"
import api from "@/lib/api"
import DashboardLayout from "./Layout/DashboardLayout"

export default function AdminAddDataUser() {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [regions, setRegions] = useState([])
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "",
        position: "",
        region_id: ""
    })

    useEffect(() => {
        fetchUsers()
        fetchRegions()
    }, [])

    const fetchUsers = async () => {
        try {
            const res = await api.get("/users")
            if (res.data.data) {
                setUsers(res.data.data)
            }
        } catch (err) {
            console.error("Error fetching users:", err)
            setError("Gagal memuat data user")
        } finally {
            setLoading(false)
        }
    }

    const fetchRegions = async () => {
        try {
            const res = await api.get("/regions")
            if (res.data.data) {
                setRegions(res.data.data)
            }
        } catch (err) {
            console.error("Error fetching regions:", err)
        }
    }

    const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    try {
        // Pastikan region_id adalah number dan role lowercase
        const payload = {
            ...formData,
            region_id: parseInt(formData.region_id),
            role: formData.role.toLowerCase() // Convert to lowercase
        }

        console.log("Sending payload:", payload) // Debug

        const res = await api.post("/users", payload)
        if (res.data.success) {
            setIsModalOpen(false)
            setFormData({
                name: "",
                email: "",
                password: "",
                role: "",
                position: "",
                region_id: ""
            })
            fetchUsers()
            alert("User berhasil ditambahkan")
        }
    } catch (err) {
        console.error("Error creating user:", err)
        setError(err.response?.data?.error || "Gagal menambahkan user")
    }
}

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const getRoleBadge = (role) => {
        const roleConfig = {
            'admin': { color: 'bg-blue-100 text-blue-800', label: 'Admin' },
            'approver': { color: 'bg-purple-100 text-purple-800', label: 'Approver' },
            'employee': { color: 'bg-green-100 text-green-800', label: 'Employee' }
        }

        const config = roleConfig[role] || { color: 'bg-gray-100 text-gray-800', label: role }
        
        return (
            <span className={`px-2 py-1 rounded-full text-xs ${config.color}`}>
                {config.label}
            </span>
        )
    }

    return (
        <DashboardLayout>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Data User</h1>
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogTrigger asChild>
                        <Button>Tambah User</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>Tambah User Baru</DialogTitle>
                            <DialogDescription>
                                Isi form berikut untuk menambahkan user baru ke sistem.
                            </DialogDescription>
                        </DialogHeader>
                        
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nama</Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={formData.password}
                                        onChange={(e) => handleInputChange('password', e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="position">Posisi/Jabatan</Label>
                                    <Input
                                        id="position"
                                        value={formData.position}
                                        onChange={(e) => handleInputChange('position', e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="role">Role</Label>
                                    <Select 
                                        value={formData.role} 
                                        onValueChange={(value) => handleInputChange('role', value)}
                                        required
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="admin">Admin</SelectItem>
                                            <SelectItem value="approver">Approver</SelectItem>
                                            <SelectItem value="employee">Employee</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="region">Region</Label>
                                    <Select 
                                        value={formData.region_id} 
                                        onValueChange={(value) => handleInputChange('region_id', value)}
                                        required
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih region" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {regions.map((region) => (
                                                <SelectItem key={region.region_id} value={region.region_id.toString()}>
                                                    {region.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {error && (
                                <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded text-sm">
                                    {error}
                                </div>
                            )}

                            <div className="flex justify-end space-x-2 pt-4">
                                <Button 
                                    type="button" 
                                    variant="outline" 
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    Batal
                                </Button>
                                <Button type="submit">
                                    Tambah User
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
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
                            <TableHead>Nama</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Posisi</TableHead>
                            <TableHead>Region</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-4">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : users.length > 0 ? (
                            users.map((user) => (
                                <TableRow key={user.user_id} className="text-sm">
                                    <TableCell className="text-center py-2">
                                        {user.user_id}
                                    </TableCell>
                                    <TableCell className="py-2 font-medium">
                                        {user.name}
                                    </TableCell>
                                    <TableCell className="py-2">
                                        {user.email}
                                    </TableCell>
                                    <TableCell className="py-2">
                                        {getRoleBadge(user.role)}
                                    </TableCell>
                                    <TableCell className="py-2">
                                        {user.position || '-'}
                                    </TableCell>
                                    <TableCell className="py-2">
                                        {user.region_name || `Region ${user.region_id}`}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-4">
                                    Tidak ada data user
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </DashboardLayout>
    )
}