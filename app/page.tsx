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
import { FiSun, FiMoon, FiUser, FiLogOut } from "react-icons/fi"; // Import icons from Feather Icons
import { useAuth } from "./_context/AuthContext";

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
  const { user } = useAuth(); // Replace with real user data

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

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark", !darkMode);
  };

  return (
    <div className={`min-h-screen ${darkMode ? "dark" : ""}`}>
      <div className="dark:bg-gray-900 dark:text-gray-100 flex flex-col h-screen">
        {/* Top Header */}
        <div className="flex justify-end p-4 gap-4">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            {darkMode ? (
              <FiSun className="h-5 w-5 text-gray-800 dark:text-gray-100" />
            ) : (
              <FiMoon className="h-5 w-5 text-gray-800 dark:text-gray-100" />
            )}
          </button>
        </div>

        {/* Sidebar and Main Content */}
        <div className="flex flex-1">
          {/* Sidebar */}
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="w-64 bg-gray-700 shadow-lg flex flex-col"
          >
            <div className="p-6">
              <h2 className="text-xl font-semibold text-white">Dashboard</h2>
            </div>
            <nav className="mt-6 flex-1">
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

            {/* Profile Section */}
            <div className="p-4 border-t border-gray-600">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
                  {user.name.charAt(0)}
                </div>
                <span className="text-white">{user.name}</span>
                <button
                  onClick={() => handleNavigation("/logout")}
                  className="ml-auto p-2 hover:bg-gray-600 rounded-full"
                >
                  <FiLogOut className="h-5 w-5 text-white" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="flex-1 p-8 overflow-y-auto">
            {isPending ? (
              <div className="flex items-center justify-center h-full">
                <div className="h-16 w-16 border-8 border-t-8 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {/* Bar Chart */}
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

                {/* Line Chart */}
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
