"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  FiChevronLeft,
  FiSun,
  FiMoon,
  FiMenu,
  FiBarChart2,
  FiBox,
  FiShoppingCart,
} from "react-icons/fi";
import { Menu, Transition } from "@headlessui/react";
import axiosInstance from "./_lib/axios";
import { useAuth } from "./_context/AuthContext";
import { useAppDispatch } from "./_features/store/store";
import { logout } from "./_features/auth/slice";
import LanguageSwitcher from "./_components/LanguageSwitcher";
import toast from "react-hot-toast";

export default function DashboardPage() {
  const [mostSoldData, setMostSoldData] = useState<{
    today: { ceramic: { size: string }; totalQuantity: number }[];
    thisWeek: { ceramic: { size: string }; totalQuantity: number }[];
    thisMonth: { ceramic: { size: string }; totalQuantity: number }[];
  }>({ today: [], thisWeek: [], thisMonth: [] });
  const [totalItemsData, setTotalItemsData] = useState<
    { size: string; totalArea: number }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const router = useRouter();
  const { user, token } = useAuth();
  const dispatch = useAppDispatch();
  const [selectedPeriod, setSelectedPeriod] = useState<
    "today" | "thisWeek" | "thisMonth"
  >("today");

  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }
    const fetchData = async () => {
      try {
        const mostSold = await axiosInstance.get("/analytics/most-sold", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const totalItems = await axiosInstance.get("/analytics/total-items", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setMostSoldData(mostSold.data.data);
        setTotalItemsData(totalItems.data.data);
      } catch (error) {
        toast.error("Failed to fetch data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark", !darkMode);
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const COLORS = ["#3b82f6", "#10b981", "#ef4444", "#f59e0b", "#8b5cf6"];

  const menuItems = [
    { name: "Analytics", path: "/", icon: <FiBarChart2 className="h-5 w-5" /> },
    {
      name: "Ceramics",
      path: "/ceramics",
      icon: <FiBox className="h-5 w-5" />,
    },
    {
      name: "Orders",
      path: "/orders",
      icon: <FiShoppingCart className="h-5 w-5" />,
    },
  ];

  return (
    <div className={`min-h-screen ${darkMode ? "dark" : "bg-blue-50"}`}>
      <div className="h-screen dark:bg-gray-900 dark:text-gray-100 flex">
        {/* Fixed Sidebar */}
        <motion.div
          className={`bg-gray-700 h-full text-white flex flex-col transition-all duration-300 ${
            isSidebarCollapsed ? "w-20" : "w-64"
          } fixed`}
        >
          <div
            className={`flex items-center ${isSidebarCollapsed ? "justify-center" : "justify-between"} p-4`}
          >
            {!isSidebarCollapsed && (
              <h2 className="text-xl font-semibold">Dashboard</h2>
            )}
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="p-2"
            >
              {isSidebarCollapsed ? (
                <FiMenu className="h-5 w-5" />
              ) : (
                <FiChevronLeft className="h-5 w-5" />
              )}
            </button>
          </div>
          <nav>
            {menuItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavigation(item.path)}
                className={`flex items-center p-4 hover:bg-gray-600 w-full  ${isSidebarCollapsed ? "justify-center" : ""}`}
              >
                {item.icon}
                {!isSidebarCollapsed && (
                  <span className="ml-2">{item.name}</span>
                )}
              </button>
            ))}
          </nav>

          {/* Profile Section */}
          <div className="p-4 border-t border-gray-600 mt-auto">
            <Menu as="div" className="relative">
              <Menu.Button className="flex items-center gap-2 w-full">
                <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
                  {user?.name?.charAt(0)}
                </div>
                {!isSidebarCollapsed && (
                  <span className="text-white">{user?.name}</span>
                )}
              </Menu.Button>
              <Transition
                enter="transition duration-100 ease-out"
                enterFrom="transform scale-95 opacity-0"
                enterTo="transform scale-100 opacity-100"
                leave="transition duration-75 ease-out"
                leaveFrom="transform scale-100 opacity-100"
                leaveTo="transform scale-95 opacity-0"
              >
                <Menu.Items className="absolute bottom-12 left-0 w-48 rounded-md bg-white dark:bg-gray-800 shadow-lg">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={handleLogout}
                        className={`${
                          active ? "bg-gray-100 dark:bg-gray-700" : ""
                        } w-full text-left p-2 text-gray-800 dark:text-gray-100`}
                      >
                        Logout
                      </button>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </motion.div>

        {/* Scrollable Main Content */}
        <div className="flex-1 p-8 ml-64 overflow-y-auto">
          {/* Header with Dark Mode Toggle and Language Switcher */}
          <div className="flex justify-end gap-4 mb-6">
            <LanguageSwitcher />
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

          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="h-16 w-16 border-8 border-t-8 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Most Sold Chart */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Most Sold</h2>
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => setSelectedPeriod("today")}
                    className={`p-2 rounded ${
                      selectedPeriod === "today"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200"
                    }`}
                  >
                    Today
                  </button>
                  <button
                    onClick={() => setSelectedPeriod("thisWeek")}
                    className={`p-2 rounded ${
                      selectedPeriod === "thisWeek"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200"
                    }`}
                  >
                    This Week
                  </button>
                  <button
                    onClick={() => setSelectedPeriod("thisMonth")}
                    className={`p-2 rounded ${
                      selectedPeriod === "thisMonth"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200"
                    }`}
                  >
                    This Month
                  </button>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={
                      mostSoldData[selectedPeriod]?.map((item) => ({
                        name: item.ceramic.size,
                        quantity: item.totalQuantity,
                      })) || []
                    }
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="quantity" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Total Items Chart */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Total Items</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={totalItemsData.map((item) => ({
                        ...item,
                        totalArea: parseFloat(item.totalArea.toFixed(2)),
                      }))}
                      dataKey="totalArea"
                      nameKey="size"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#3b82f6"
                      label
                    >
                      {totalItemsData.map((_entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      content={({ payload }) => (
                        <div className="bg-white p-2 rounded shadow">
                          <p>Type: {payload?.[0]?.payload?.type}</p>
                          <p>Size: {payload?.[0]?.payload?.size}</p>
                          <p>
                            Manufacturer: {payload?.[0]?.payload?.manufacturer}
                          </p>
                        </div>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
