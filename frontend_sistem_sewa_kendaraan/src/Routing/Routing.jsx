// Routing.jsx
import { Route, Routes } from "react-router-dom";
import Login from "../pages/Login";
import AdminDashboard from "../pages/Admin/AdminDashboard";
import AdminDataBooking from "@/pages/Admin/AdminDataBooking";
import AdminDataKendaraan from "@/pages/Admin/AdminDataKendaraan";
import AdminDataRegion from "@/pages/Admin/AdminDataRegion";
import ApprovalDashboard from "@/pages/ApprovalUser/ApprovalDashboard";
import Unauthorized from "@/pages/Unauthorized";
import RouteGuard from "@/components/ui/RouteGuard";
import ApprovalUserData from "@/pages/ApprovalUser/ApprovalUserData";
import AdminAddDataUser from "@/pages/Admin/AdminAddDataUser";
import AddDataDriver from "@/pages/Admin/AdminDataDriver";
import AdminDataDriver from "@/pages/Admin/AdminDataDriver";
import AdminDataApproval from "@/pages/Admin/AdminDataApproval";

export default function Routing() {
    return (
        <Routes>
            <Route path="/" element={<Login/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/unauthorized" element={<Unauthorized/>}/>

            {/* Admin Routes - hanya bisa diakses oleh admin */}
            <Route path="/admin/dashboard" element={
                <RouteGuard allowedRoles={['admin', 'employee']}>
                    <AdminDashboard/>
                </RouteGuard>
            }/>
            <Route path="/admin/data_booking" element={
                <RouteGuard allowedRoles={['admin', 'employee']}>
                    <AdminDataBooking/>
                </RouteGuard>
            }/>
            <Route path="/admin/data_kendaraan" element={
                <RouteGuard allowedRoles={['admin', 'employee']}>
                    <AdminDataKendaraan/>
                </RouteGuard>
            }/>
            <Route path="/admin/data_region" element={
                <RouteGuard allowedRoles={['admin', 'employee']}>
                    <AdminDataRegion/>
                </RouteGuard>
            }/>

             <Route path="/admin/data_users" element={
                <RouteGuard>
                    <AdminAddDataUser/>
                </RouteGuard>
            }/>

             <Route path="/admin/data_driver" element={
                <RouteGuard>
                    <AdminDataDriver/>
                </RouteGuard>
            }/>

             <Route path="/admin/data_approval" element={
                <RouteGuard>
                    <AdminDataApproval/>
                </RouteGuard>
            }/>

            {/* Approval Routes - hanya bisa diakses oleh approver */}
            <Route path="/approval/dashboard" element={
                <RouteGuard allowedRoles={['approver']}>
                    <ApprovalDashboard/>
                </RouteGuard>
            }/>

            <Route path="/approval/data_approval" element={
                <RouteGuard allowedRoles={['approver']}>
                    <ApprovalUserData/>
                </RouteGuard>
            }/>

           

        </Routes>
    )
}