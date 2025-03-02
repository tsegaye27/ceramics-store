"use client";
import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useTransition,
} from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { CartesianGrid, XAxis, YAxis, Tooltip, Bar, Pie, Cell } from "recharts";
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
import {
  endOfWeek,
  isSameDay,
  isWithinInterval,
  startOfWeek,
  subWeeks,
} from "date-fns";
import { useLanguage } from "@/app/_context/LanguageContext";

const ResponsiveContainer = dynamic(
  () => import("recharts").then((mod) => mod.ResponsiveContainer),
  { ssr: false },
);
const BarChart = dynamic(() => import("recharts").then((mod) => mod.BarChart), {
  ssr: false,
});
const PieChart = dynamic(() => import("recharts").then((mod) => mod.PieChart), {
  ssr: false,
});

const COLORS = ["#3b82f6", "#10b981", "#ef4444", "#f59e0b", "#8b5cf6"];
const menuItems = [
  { name: "analytics", path: "/", icon: <FiBarChart2 className="h-5 w-5" /> },
  { name: "ceramics", path: "/ceramics", icon: <FiBox className="h-5 w-5" /> },
  {
    name: "orders",
    path: "/orders",
    icon: <FiShoppingCart className="h-5 w-5" />,
  },
];

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
  const { t } = useLanguage();
  const [isPending, startTransition] = useTransition();

  const chartData = useMemo(() => {
    const now = new Date();
    switch (selectedPeriod) {
      case "today":
        return mostSold.today.map((item) => ({
          name: `${item.ceramic.size}(${item.ceramic.code})`,
          quantity: item.totalQuantity,
        }));
      case "thisWeek": {
        const weekStart = startOfWeek(now, { weekStartsOn: 1 });
        return Array.from({ length: 7 }, (_, i) => {
          const day = new Date(weekStart);
          day.setDate(day.getDate() + i);
          return {
            name: day.toLocaleDateString("en-US", { weekday: "short" }),
            quantity:
              mostSold.thisWeek.find((item) =>
                isSameDay(new Date(item.ceramic.createdAt), day),
              )?.totalQuantity || 0,
          };
        });
      }
      case "thisMonth": {
        const weeks = [];
        for (let i = 3; i >= 0; i--) {
          const weekStart = subWeeks(startOfWeek(now, { weekStartsOn: 1 }), i);
          weeks.push({
            start: weekStart,
            label: `W${Math.ceil((weekStart.getDate() + 6) / 7) - 1}`,
          });
        }
        return weeks.map((week) => ({
          name: week.label,
          quantity: mostSold.thisMonth
            .filter((item) =>
              isWithinInterval(new Date(item.ceramic.createdAt), {
                start: week.start,
                end: endOfWeek(week.start, { weekStartsOn: 1 }),
              }),
            )
            .reduce((sum, item) => sum + item.totalQuantity, 0),
        }));
      }
      default:
        return [];
    }
  }, [selectedPeriod, mostSold]);

  useEffect(() => {
    if (!token) router.push("/login");
    else if (user?.role === "user") router.push("/not-found");
    else {
      setIsChecked(true);
      dispatch(fetchAnalytics());
    }
  }, [token, dispatch, router, user?.role]);

  const handleNavigation = (path: string) => {
    startTransition(() => router.push(path));
  };

  const toggleDarkMode = useCallback(() => {
    setDarkMode((prev) => {
      document.documentElement.classList.toggle("dark", !prev);
      return !prev;
    });
  }, []);

  const handleLogout = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  if (!isChecked) return <Loader />;

  return (
    <div className={`min-h-screen ${darkMode ? "dark" : "bg-blue-50"}`}>
      {isPending ? (
        <Loader />
      ) : (
        <>
          <div className="h-screen dark:bg-gray-900 dark:text-gray-100 flex">
            <motion.div
              className={`bg-gray-700 dark:bg-gray-800 h-full text-white flex flex-col transition-all duration-300 ${
                isSidebarCollapsed ? "w-20" : "w-64"
              } fixed`}
            >
              <div
                className={`flex items-center ${isSidebarCollapsed ? "justify-center" : "justify-between"} p-4`}
              >
                {!isSidebarCollapsed && (
                  <h2 className="text-xl font-semibold">{t("dashboard")}</h2>
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
                      <span className="ml-2">{t(item.name)}</span>
                    )}
                  </button>
                ))}
              </nav>

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
                            {t("logout")}
                          </button>
                        )}
                      </MenuItem>
                    </MenuItems>
                  </Transition>
                </Menu>
              </div>
            </motion.div>
            <div
              className={`flex-1 p-8 ${isSidebarCollapsed ? "ml-20" : "ml-64"} transition-all duration-300 overflow-y-auto`}
            >
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
                <div className="text-red-500 dark:text-red-400 text-center">
                  {error}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4 dark:text-gray-200">
                      {t("mostSold")}
                    </h2>
                    <div className="flex gap-2 mb-4 overflow-x-auto">
                      {["today", "thisWeek", "thisMonth"].map((period) => (
                        <button
                          key={period}
                          onClick={() => setSelectedPeriod(period as any)}
                          className={`p-2 rounded min-w-[100px] ${
                            selectedPeriod === period
                              ? "bg-blue-500 text-white"
                              : "bg-gray-200 dark:bg-gray-700 dark:text-gray-200"
                          }`}
                        >
                          {t(period.replace("this", ""))}
                        </button>
                      ))}
                    </div>
                    <div className="h-[300px]">
                      {chartData.length === 0 ? (
                        <div className="h-full flex items-center justify-center dark:text-gray-400">
                          {t("noItemsSoldToday")}{" "}
                          {selectedPeriod.replace("this", "")}
                        </div>
                      ) : (
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={chartData}>
                            <CartesianGrid
                              strokeDasharray="3 3"
                              stroke={darkMode ? "#374151" : "#e5e7eb"}
                            />
                            <XAxis
                              dataKey="name"
                              stroke={darkMode ? "#9ca3af" : "#6b7280"}
                              tick={{ fill: darkMode ? "#e5e7eb" : "#1f2937" }}
                            />
                            <YAxis
                              stroke={darkMode ? "#9ca3af" : "#6b7280"}
                              tick={{ fill: darkMode ? "#e5e7eb" : "#1f2937" }}
                            />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: darkMode ? "#1f2937" : "#fff",
                                borderColor: darkMode ? "#374151" : "#e5e7eb",
                                borderRadius: "0.5rem",
                              }}
                              itemStyle={{
                                color: darkMode ? "#e5e7eb" : "#1f2937",
                              }}
                            />
                            <Bar
                              dataKey="quantity"
                              fill="#3b82f6"
                              radius={[4, 4, 0, 0]}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      )}
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4 dark:text-gray-200">
                      {t("totalItemsArea")}
                    </h2>
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
                                  <div className="bg-white dark:bg-gray-700 p-2 rounded shadow text-sm">
                                    <p className="dark:text-gray-200">
                                      {t('type')}: {payload?.[0]?.payload?.type}
                                    </p>
                                    <p className="dark:text-gray-200">
                                      {t('size')}: {payload?.[0]?.payload?.size}
                                    </p>
                                    <p className="dark:text-gray-200">
                                      {t('manufacturer')}:{" "}
                                      {payload?.[0]?.payload?.manufacturer}
                                    </p>
                                  </div>
                                )}
                              />
                            </PieChart>
                          </ResponsiveContainer>
                          <div className="mt-4 flex flex-wrap gap-2 overflow-x-auto pb-2">
                            {totalItems.map((item, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-1 text-sm px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full flex-shrink-0"
                              >
                                <div
                                  className="w-3 h-3 rounded-full"
                                  style={{
                                    backgroundColor:
                                      COLORS[index % COLORS.length],
                                  }}
                                />
                                <span className="dark:text-gray-200 whitespace-nowrap">
                                  {item.size} ({item.type}) -{" "}
                                  {item.manufacturer}
                                </span>
                              </div>
                            ))}
                          </div>
                        </>
                      ) : (
                        <div className="h-full flex items-center justify-center dark:text-gray-400">
                          {t("noItemsAvailable")}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardPage;
