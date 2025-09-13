-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Sep 14, 2025 at 01:33 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `project_sewa_kendaraan`
--

-- --------------------------------------------------------

--
-- Table structure for table `bookings`
--

CREATE TABLE `bookings` (
  `booking_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `region_id` int(11) NOT NULL,
  `vehicle_id` int(11) NOT NULL,
  `driver_id` int(11) NOT NULL,
  `purpose` varchar(255) NOT NULL,
  `start_date` datetime NOT NULL,
  `end_date` datetime NOT NULL,
  `status` enum('pending','approved','rejected','cancelled') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bookings`
--

INSERT INTO `bookings` (`booking_id`, `user_id`, `region_id`, `vehicle_id`, `driver_id`, `purpose`, `start_date`, `end_date`, `status`, `created_at`) VALUES
(10, 9, 1, 2, 1, 'Pengantaran material ke tambang A', '2025-09-15 08:00:00', '2025-09-15 17:00:00', 'approved', '2025-09-13 05:27:58'),
(11, 9, 1, 2, 1, 'Pengantaran material ke tambang A', '2025-09-15 08:00:00', '2025-09-15 17:00:00', 'pending', '2025-09-13 16:00:07'),
(12, 9, 1, 2, 1, 'Pengantaran material ke tambang A', '2025-09-15 08:00:00', '2025-09-15 17:00:00', 'pending', '2025-09-13 16:34:02'),
(13, 9, 1, 2, 1, 'Pengantaran material ke tambang A', '2025-09-15 08:00:00', '2025-09-15 17:00:00', 'pending', '2025-09-13 16:56:47'),
(14, 11, 2, 5, 1, 'dasfasd', '2025-09-15 12:00:00', '2025-09-17 14:00:00', 'pending', '2025-09-13 16:59:42'),
(15, 18, 2, 5, 1, 'afasdsa', '2025-09-17 13:00:00', '2025-09-26 14:00:00', 'pending', '2025-09-13 17:00:25'),
(16, 11, 1, 5, 3, 'dadsadsa', '2025-09-15 12:00:00', '2025-09-16 12:00:00', 'pending', '2025-09-13 17:27:40');

-- --------------------------------------------------------

--
-- Table structure for table `booking_approvals`
--

CREATE TABLE `booking_approvals` (
  `approval_id` int(11) NOT NULL,
  `booking_id` int(11) NOT NULL,
  `approver_id` int(11) NOT NULL,
  `level` int(11) NOT NULL,
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  `approved_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `booking_approvals`
--

INSERT INTO `booking_approvals` (`approval_id`, `booking_id`, `approver_id`, `level`, `status`, `approved_at`) VALUES
(11, 10, 9, 1, 'rejected', '2025-09-13 14:20:34'),
(12, 10, 9, 1, 'approved', '2025-09-13 12:55:58'),
(13, 14, 14, 1, 'pending', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `drivers`
--

CREATE TABLE `drivers` (
  `driver_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `license_number` varchar(50) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `region_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `drivers`
--

INSERT INTO `drivers` (`driver_id`, `name`, `license_number`, `phone`, `region_id`, `created_at`, `updated_at`) VALUES
(1, 'Driver Satu', 'SIM123456', '08123456789', 1, '2025-09-13 05:27:01', '2025-09-13 05:27:01'),
(3, 'gundik', '123412', '12121', 3, '2025-09-13 17:13:38', '2025-09-13 17:13:38'),
(7, 'asdsad', '1211', '121', 1, '2025-09-13 17:15:13', '2025-09-13 17:15:13');

-- --------------------------------------------------------

--
-- Table structure for table `regions`
--

CREATE TABLE `regions` (
  `region_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `location` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `regions`
--

INSERT INTO `regions` (`region_id`, `name`, `location`) VALUES
(1, 'Jakarta', NULL),
(2, 'Jakarta', NULL),
(3, 'Bandung', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `usage_history`
--

CREATE TABLE `usage_history` (
  `usage_id` int(11) NOT NULL,
  `vehicle_id` int(11) NOT NULL,
  `booking_id` int(11) NOT NULL,
  `distance` decimal(10,2) DEFAULT NULL,
  `remarks` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','approver','driver','pegawai') NOT NULL,
  `position` varchar(100) DEFAULT NULL,
  `region_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `name`, `email`, `password`, `role`, `position`, `region_id`) VALUES
(9, 'Admin', 'admin@example.com', '$2a$10$WPzuBoI4Bj3F4kBiCvP74u1OdBIzsy9tsrtgx4GtJFG9KkvA4rNjO', 'admin', 'Manager', 1),
(11, 'Approver', 'approver@example.com', '$2a$10$dlsNhU3MIEx/gyujML3gzuMzRnd4sL.qQco4V3yAskDXLgAk6c6ZS', 'approver', 'Approver', 1),
(14, 'udin', 'udin@example.com', '$2a$10$EEpqnT/eciOmPAHJVUdlDubeLPjwP6FL.85JR0p/1g.qJSs.Bjnx2', 'approver', 'Approver', 1),
(16, 'udin', 'udin1@example.com', '$2a$10$1K867KPiIXn6.cNbiLBraufU8feLRBm1Qj4We4uzff54GJJlCXHR2', 'approver', 'Approver', 1),
(18, 'udin', 'udin2@example.com', '$2a$10$ZM5uX/Sf6vWeS5fll9O.ouQ.nThXI5/h26UIU0gcMJTxFiDo68EQe', 'approver', 'Approver', 1),
(19, 'udin3', 'udin3@mail.com', '$2a$10$vBDcO2Hb47js76UYwzZOnemqBWV4ykZAEPUYEJLezgxCVI5xZ54m.', 'approver', 'approver', 1);

-- --------------------------------------------------------

--
-- Table structure for table `vehicles`
--

CREATE TABLE `vehicles` (
  `vehicle_id` int(11) NOT NULL,
  `plate_number` varchar(20) NOT NULL,
  `brand` varchar(50) NOT NULL,
  `model` varchar(50) NOT NULL,
  `year` int(11) NOT NULL,
  `status` enum('available','rented','maintenance') DEFAULT 'available',
  `region_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `vehicles`
--

INSERT INTO `vehicles` (`vehicle_id`, `plate_number`, `brand`, `model`, `year`, `status`, `region_id`, `created_at`, `updated_at`) VALUES
(2, 'B1234XYZ', 'Toyota', 'Avanza', 2022, 'available', 1, '2025-09-13 04:56:30', '2025-09-13 04:56:30'),
(5, 'AB1234XYZ', 'Toyota', 'Avanza', 2022, 'available', 1, '2025-09-13 05:17:34', '2025-09-13 05:17:34'),
(7, 'AB1122CC', 'Suzuki', 'Ignis', 2022, 'available', 1, '2025-09-13 17:03:32', '2025-09-13 17:03:32');

-- --------------------------------------------------------

--
-- Table structure for table `vehicle_fuel_logs`
--

CREATE TABLE `vehicle_fuel_logs` (
  `fuel_id` int(11) NOT NULL,
  `vehicle_id` int(11) NOT NULL,
  `fuel_date` date NOT NULL,
  `liters` decimal(10,2) NOT NULL,
  `cost` decimal(12,2) NOT NULL,
  `odometer` bigint(20) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `vehicle_services`
--

CREATE TABLE `vehicle_services` (
  `service_id` int(11) NOT NULL,
  `vehicle_id` int(11) NOT NULL,
  `service_date` date NOT NULL,
  `service_type` varchar(100) NOT NULL,
  `cost` decimal(12,2) DEFAULT 0.00,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `vehicle_usage_logs`
--

CREATE TABLE `vehicle_usage_logs` (
  `usage_id` int(11) NOT NULL,
  `vehicle_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `booking_id` int(11) DEFAULT NULL,
  `start_date` datetime NOT NULL,
  `end_date` datetime NOT NULL,
  `start_odometer` bigint(20) NOT NULL,
  `end_odometer` bigint(20) NOT NULL,
  `purpose` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bookings`
--
ALTER TABLE `bookings`
  ADD PRIMARY KEY (`booking_id`),
  ADD KEY `fk_booking_user` (`user_id`),
  ADD KEY `fk_booking_region` (`region_id`),
  ADD KEY `fk_booking_vehicle` (`vehicle_id`),
  ADD KEY `fk_booking_driver` (`driver_id`);

--
-- Indexes for table `booking_approvals`
--
ALTER TABLE `booking_approvals`
  ADD PRIMARY KEY (`approval_id`),
  ADD KEY `booking_id` (`booking_id`),
  ADD KEY `approver_id` (`approver_id`);

--
-- Indexes for table `drivers`
--
ALTER TABLE `drivers`
  ADD PRIMARY KEY (`driver_id`),
  ADD UNIQUE KEY `license_number` (`license_number`),
  ADD KEY `fk_driver_region` (`region_id`);

--
-- Indexes for table `regions`
--
ALTER TABLE `regions`
  ADD PRIMARY KEY (`region_id`);

--
-- Indexes for table `usage_history`
--
ALTER TABLE `usage_history`
  ADD PRIMARY KEY (`usage_id`),
  ADD KEY `vehicle_id` (`vehicle_id`),
  ADD KEY `booking_id` (`booking_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `region_id` (`region_id`);

--
-- Indexes for table `vehicles`
--
ALTER TABLE `vehicles`
  ADD PRIMARY KEY (`vehicle_id`),
  ADD UNIQUE KEY `plate_number` (`plate_number`),
  ADD KEY `fk_vehicle_region` (`region_id`);

--
-- Indexes for table `vehicle_fuel_logs`
--
ALTER TABLE `vehicle_fuel_logs`
  ADD PRIMARY KEY (`fuel_id`),
  ADD KEY `vehicle_id` (`vehicle_id`);

--
-- Indexes for table `vehicle_services`
--
ALTER TABLE `vehicle_services`
  ADD PRIMARY KEY (`service_id`),
  ADD KEY `vehicle_id` (`vehicle_id`);

--
-- Indexes for table `vehicle_usage_logs`
--
ALTER TABLE `vehicle_usage_logs`
  ADD PRIMARY KEY (`usage_id`),
  ADD KEY `vehicle_id` (`vehicle_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `booking_id` (`booking_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `bookings`
--
ALTER TABLE `bookings`
  MODIFY `booking_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `booking_approvals`
--
ALTER TABLE `booking_approvals`
  MODIFY `approval_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `drivers`
--
ALTER TABLE `drivers`
  MODIFY `driver_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `regions`
--
ALTER TABLE `regions`
  MODIFY `region_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `usage_history`
--
ALTER TABLE `usage_history`
  MODIFY `usage_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `vehicles`
--
ALTER TABLE `vehicles`
  MODIFY `vehicle_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `vehicle_fuel_logs`
--
ALTER TABLE `vehicle_fuel_logs`
  MODIFY `fuel_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `vehicle_services`
--
ALTER TABLE `vehicle_services`
  MODIFY `service_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `vehicle_usage_logs`
--
ALTER TABLE `vehicle_usage_logs`
  MODIFY `usage_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `bookings`
--
ALTER TABLE `bookings`
  ADD CONSTRAINT `fk_booking_driver` FOREIGN KEY (`driver_id`) REFERENCES `drivers` (`driver_id`),
  ADD CONSTRAINT `fk_booking_region` FOREIGN KEY (`region_id`) REFERENCES `regions` (`region_id`),
  ADD CONSTRAINT `fk_booking_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `fk_booking_vehicle` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles` (`vehicle_id`);

--
-- Constraints for table `booking_approvals`
--
ALTER TABLE `booking_approvals`
  ADD CONSTRAINT `booking_approvals_ibfk_1` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`booking_id`),
  ADD CONSTRAINT `booking_approvals_ibfk_2` FOREIGN KEY (`approver_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `drivers`
--
ALTER TABLE `drivers`
  ADD CONSTRAINT `fk_driver_region` FOREIGN KEY (`region_id`) REFERENCES `regions` (`region_id`);

--
-- Constraints for table `usage_history`
--
ALTER TABLE `usage_history`
  ADD CONSTRAINT `usage_history_ibfk_1` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles` (`vehicle_id`),
  ADD CONSTRAINT `usage_history_ibfk_2` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`booking_id`);

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`region_id`) REFERENCES `regions` (`region_id`);

--
-- Constraints for table `vehicles`
--
ALTER TABLE `vehicles`
  ADD CONSTRAINT `fk_vehicle_region` FOREIGN KEY (`region_id`) REFERENCES `regions` (`region_id`);

--
-- Constraints for table `vehicle_fuel_logs`
--
ALTER TABLE `vehicle_fuel_logs`
  ADD CONSTRAINT `vehicle_fuel_logs_ibfk_1` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles` (`vehicle_id`);

--
-- Constraints for table `vehicle_services`
--
ALTER TABLE `vehicle_services`
  ADD CONSTRAINT `vehicle_services_ibfk_1` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles` (`vehicle_id`);

--
-- Constraints for table `vehicle_usage_logs`
--
ALTER TABLE `vehicle_usage_logs`
  ADD CONSTRAINT `vehicle_usage_logs_ibfk_1` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles` (`vehicle_id`),
  ADD CONSTRAINT `vehicle_usage_logs_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `vehicle_usage_logs_ibfk_3` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`booking_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
