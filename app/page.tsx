"use client";
import { useState, useEffect, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";

// Sample data (replace with real data from your backend)
const initialSalesData = [
  { month: "Jan", sales: 12000, orders: 45 },
  { month: "Feb", sales: 15000, orders: 50 },
  { month: "Mar", sales: 18000, orders: 60 },
  { month: "Apr", sales: 9000, orders: 30 },
  { month: "May", sales: 20000, orders: 70 },
  { month: "Jun", sales: 25000, orders: 80 },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function DashboardPage() {
  const [isPending, startTransition] = useTransition();
  const [darkMode, setDarkMode] = useState(false);
  const [salesData, setSalesData] = useState(initialSalesData);
  const router = useRouter();

  // Fetch real sales data from the backend
  useEffect(() => {
    async function fetchSalesData() {
      try {
        const response = await fetch("/api/sales");
        const data = await response.json();
        setSalesData(data);
      } catch (error) {
        console.error("Failed to fetch sales data:", error);
      }
    }
    fetchSalesData();
  }, []);

  const handleNavigation = (path: string) => {
    startTransition(() => {
      router.push(path);
    });
  };

  return (
    <div className={`h-screen ${darkMode ? "dark" : ""}`}>
      <div className="dark:bg-gray-900 dark:text-gray-100">
        {/* Top Header */}
        <div className="flex justify-end p-4 gap-4">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            {darkMode ? "🌞" : "🌙"}
          </button>
          <button
            onClick={() => handleNavigation("/profile")}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            👤
          </button>
        </div>

        {/* Sidebar and Main Content */}
        <div className="flex">
          {/* Sidebar */}
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="w-64 bg-gray-700 shadow-lg"
          >
            <div className="p-6">
              <h2 className="text-xl font-semibold text-white">Dashboard</h2>
            </div>
            <nav className="mt-6">
              <button
                onClick={() => handleNavigation("/")}
                className="flex items-center p-4 text-white hover:bg-gray-600 cursor-pointer w-full text-left"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Analytics</span>
              </button>
              <button
                onClick={() => handleNavigation("/ceramics")}
                className="flex items-center p-4 text-white hover:bg-gray-600 cursor-pointer w-full text-left"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                <span>Ceramics</span>
              </button>
              <button
                onClick={() => handleNavigation("/orders")}
                className="flex items-center p-4 text-white hover:bg-gray-600 cursor-pointer w-full text-left"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span>Orders</span>
              </button>
            </nav>
          </motion.div>

          {/* Main Content */}
          <div className="flex-1 p-8">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-8"
            >
              Welcome to the Ceramics Store
            </motion.h1>

            {/* Graphs Section */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {/* Bar Chart for Monthly Sales */}
              <motion.div
                variants={itemVariants}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
              >
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
                  Monthly Sales
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="sales" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>

              {/* Line Chart for Revenue Over Time */}
              <motion.div
                variants={itemVariants}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
              >
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
                  Revenue Over Time
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="sales" stroke="#3b82f6" />
                  </LineChart>
                </ResponsiveContainer>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
