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
import {
  Menu,
  Transition,
  MenuItem,
  MenuButton,
  MenuItems,
} from "@headlessui/react";
import { useAuth } from "@/app/_context/AuthContext";
import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from "@/app/_features/store/store";
import { logout } from "@/app/_features/auth/slice";
import LanguageSwitcher from "@/app/_components/LanguageSwitcher";
import { Loader } from "@/app/_components/Loader";
import { fetchAnalytics } from "@/app/_features/analytics/slice";

const DashboardPage = () => {
  const { mostSold, totalItems, loading, error } = useAppSelector(
    (state: RootState) => state.analytics,
  );
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const router = useRouter();
  const { user, token } = useAuth();
  const dispatch = useAppDispatch();
  const [selectedPeriod, setSelectedPeriod] = useState<
    "today" | "thisWeek" | "thisMonth"
  >("today");
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    if (token === null) {
      router.push("/login");
      return;
    } else if (user.role === "user") {
      router.push("/not-found");
      return;
    }
    setIsChecked(true);

    if (token) {
      dispatch(fetchAnalytics());
    }
  }, [token, dispatch, router, user?.role]);

  const getWeekDays = () => {
    const days = [];
    const date = new Date();
    const first = date.getDate() - date.getDay() + 1;
    for (let i = 0; i < 7; i++) {
      const day = new Date(date.setDate(first + 1));
      days.push(day.toLocaleDateString("en-US", { weekday: "short" }));
    }
    return days;
  };

  const getChartData = (): { name: string; quantity: number }[] => {
    switch (selectedPeriod) {
      case "today":
        return mostSold.today.map((item) => ({
          name: item.ceramic.size,
          quantity: item.totalQuantity,
        }));
      case "thisWeek": {
        const weekDays = getWeekDays();
        return weekDays.map((day) => {
          const found = mostSold.thisWeek.find(
            (d) =>
              new Date(d.ceramic.createdAt).toLocaleDateString("en-US", {
                weekday: "short",
              }) === day,
          );
          return {
            name: day,
            quantity: found?.totalQuantity || 0,
          };
        });
      }
      case "thisMonth": {
        const weeks = ["Week 1", "Week 2", "Week 3", "Week 4"];
        return weeks.map((week, idx) => {
          const found = mostSold.thisMonth.find((_, i) => i === idx);
          return {
            name: week,
            quantity: found?.totalQuantity || 0,
          };
        });
      }
      default:
        return [];
    }
  };
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

  if (!isChecked) {
    return <Loader />;
  }

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
              <MenuButton className="flex items-center gap-2 w-full">
                <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
                  {user?.name?.charAt(0)}
                </div>
                {!isSidebarCollapsed && (
                  <span className="text-white">{user?.name}</span>
                )}
              </MenuButton>
              <Transition
                enter="transition duration-100 ease-out"
                enterFrom="transform scale-95 opacity-0"
                enterTo="transform scale-100 opacity-100"
                leave="transition duration-75 ease-out"
                leaveFrom="transform scale-100 opacity-100"
                leaveTo="transform scale-95 opacity-0"
              >
                <MenuItems className="absolute bottom-12 left-0 w-48 rounded-md bg-white dark:bg-gray-800 shadow-lg">
                  <MenuItem>
                    {({ focus }) => (
                      <button
                        onClick={handleLogout}
                        className={`${
                          focus ? "bg-gray-100 dark:bg-gray-700" : ""
                        } w-full text-left p-2 text-gray-800 dark:text-gray-100`}
                      >
                        Logout
                      </button>
                    )}
                  </MenuItem>
                </MenuItems>
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

          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader />
            </div>
          ) : error ? (
            <div className="text-red-500 text-center">{error}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Most Sold Chart */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Most Sold</h2>
                <div className="flex gap-2 mb-4 overflow-x-auto">
                  {["today", "thisWeek", "thisMonth"].map((period) => (
                    <button
                      key={period}
                      onClick={() => setSelectedPeriod(period as any)}
                      className={`p-2 rounded min-w-[100px] ${
                        selectedPeriod === period
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200"
                      }`}
                    >
                      {period.replace("this", "").replace("t", "T")}
                    </button>
                  ))}
                </div>
                <div className="h-[300px]">
                  {getChartData().length === 0 ? (
                    <div className="h-full flex items-center justify-center">
                      No items sold today {selectedPeriod.replace("this", "")}
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={getChartData()}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="quantity" fill="#3b82f6" />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>
              {/* Total Items Chart */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Total Items</h2>
                <div className="h-[300px]">
                  {totalItems.length > 0 ? (
                    <>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={totalItems}
                            dataKey="totalArea"
                            nameKey="size"
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            label
                          >
                            {totalItems.map((_, index) => (
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
                                  Manufacturer:{" "}
                                  {payload?.[0]?.payload?.manufacturer}
                                </p>
                              </div>
                            )}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {totalItems.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-1 text-sm"
                          >
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{
                                backgroundColor: COLORS[index % COLORS.length],
                              }}
                            ></div>
                            <span>
                              {item.size} ({item.type}) - {item.manufacturer}
                            </span>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      No items available
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
