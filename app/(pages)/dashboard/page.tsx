"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { CartesianGrid, XAxis, YAxis, Tooltip, Bar, Pie, Cell } from "recharts";
import { FiSun, FiMoon } from "react-icons/fi";
import { useAuth } from "@/app/_context/AuthContext";
import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from "@/app/_features/store/store";
import LanguageSwitcher from "@/app/_components/LanguageSwitcher";
import { Loader } from "@/app/_components/Loader";
import { fetchAnalytics } from "@/app/_features/analytics/slice";
import {
    addDays,
  isSameDay,
  isWithinInterval,
  subDays,
} from "date-fns";
import { useLanguage } from "@/app/_context/LanguageContext";
import Sidebar from "@/app/_components/Sidebar";

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

const DashboardPage = () => {
  const { mostSold, totalItems, loading } = useAppSelector(
    (state: RootState) => state.analytics,
  );
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const router = useRouter();
  const { user, token, loading: contextLoading } = useAuth();
  const dispatch = useAppDispatch();
  const [selectedPeriod, setSelectedPeriod] = useState<
    "today" | "thisWeek" | "thisMonth"
  >("today");
  const [isChecked, setIsChecked] = useState(false);
  const { t } = useLanguage();

  const chartData = useMemo(() => {
    const now = new Date();
    switch (selectedPeriod) {
      case "today":
        return mostSold.today.map((item) => ({
          name: `${item.ceramic.size}(${item.ceramic.code})`,
          quantity: item.totalQuantity,
        }));
      case "thisWeek": {
        return Array.from({ length: 7 }, (_, i) => {
          const day = subDays(now, 6 - i);
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
        const weeks = Array.from({ length: 4 }, (_, i) => {
          const weekStart = subDays(now, 27 - i * 7);
          return {
            start: weekStart,
            label: `W${4 - i}`,
          }
        });

        return weeks.map((week) => ({
          name: week.label,
          quantity: mostSold.thisMonth.filter((item) => 
          isWithinInterval(new Date(item.ceramic.createdAt), {
              start: week.start,
              end: addDays(week.start, 6),
            }),
          ).reduce((sum, item) => sum + item.totalQuantity, 0)
        }))
      }
      default:
        return [];
    }
  }, [selectedPeriod, mostSold]);

  useEffect(() => {
    if (!token && !contextLoading) router.replace("/login");
    else if (user?.role === "user") router.replace("/not-found");
    else {
      setIsChecked(true);
      dispatch(fetchAnalytics());
    }
  }, [token, dispatch, router, user?.role, contextLoading]);

  const toggleDarkMode = useCallback(() => {
    setDarkMode((prev) => {
      document.documentElement.classList.toggle("dark", !prev);
      return !prev;
    });
  }, []);

  if (!isChecked || contextLoading) return <Loader />;

  return (
    <div className={`min-h-screen ${darkMode ? "dark" : "bg-blue-50"}`}>
      <div className="h-screen dark:bg-gray-900 dark:text-gray-100 flex">
        <Sidebar
          isSidebarCollapsed={isSidebarCollapsed}
          setIsSidebarCollapsed={setIsSidebarCollapsed}
        />
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
            <Loader />
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
                                  {t("type")}: {payload?.[0]?.payload?.type}
                                </p>
                                <p className="dark:text-gray-200">
                                  {t("size")}: {payload?.[0]?.payload?.size}
                                </p>
                                <p className="dark:text-gray-200">
                                  {t("manufacturer")}:{" "}
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
                                backgroundColor: COLORS[index % COLORS.length],
                              }}
                            />
                            <span className="dark:text-gray-200 whitespace-nowrap">
                              {item.size} ({item.type}) - {item.manufacturer}
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
    </div>
  );
};

export default DashboardPage;
