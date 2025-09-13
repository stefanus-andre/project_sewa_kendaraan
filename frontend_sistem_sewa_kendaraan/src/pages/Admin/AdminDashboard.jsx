"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardLayout from "./Layout/DashboardLayout";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from "recharts"
import api from "@/lib/api"

export default function AdminDashboard() {
  const [totals, setTotals] = useState({
    users: 0,
    bookings: 0,
    approvals: 0,
    vehicles: 0
  })

  const [chartData, setChartData] = useState([])

  useEffect(() => {
    fetchTotals()
    fetchChartData()
  }, [])

  const fetchTotals = async () => {
    try {
      const usersRes = await api.get("/users")
      const bookingsRes = await api.get("/bookings")
      const approvalsRes = await api.get("/approvals")
      const vehiclesRes = await api.get("/vehicles")

      setTotals({
        users: usersRes.data.data.length,
        bookings: bookingsRes.data.data.length,
        approvals: approvalsRes.data.data.length,
        vehicles: vehiclesRes.data.data.length,
      })
    } catch (err) {
      console.error("Error fetching totals:", err)
    }
  }

  const fetchChartData = async () => {
    try {
      // contoh membuat chart bulanan dari booking
      const res = await api.get("/bookings")
      const bookings = res.data.data

      // hitung jumlah booking per bulan
      const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
      const data = Array.from({length: 12}, (_, i) => ({ name: months[i], bookings: 0, approvals: 0 }))

      bookings.forEach(b => {
        const month = new Date(b.created_at).getMonth()
        data[month].bookings += 1
      })

      // ambil approval data untuk chart
      const approvalsRes = await api.get("/approvals")
      approvalsRes.data.data.forEach(a => {
        const month = new Date(a.approved_at || a.created_at).getMonth()
        data[month].approvals += 1
      })

      setChartData(data)
    } catch (err) {
      console.error("Error fetching chart data:", err)
    }
  }

  return (
    <DashboardLayout>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Total Users</CardTitle>
            </CardHeader>
            <CardContent>{totals.users}</CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Total Bookings</CardTitle>
            </CardHeader>
            <CardContent>{totals.bookings}</CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Total Approvals</CardTitle>
            </CardHeader>
            <CardContent>{totals.approvals}</CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Total Vehicles</CardTitle>
            </CardHeader>
            <CardContent>{totals.vehicles}</CardContent>
          </Card>
        </div>

        {/* Chart */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Booking & Approval Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="bookings" stroke="#8884d8" />
                <Line type="monotone" dataKey="approvals" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
