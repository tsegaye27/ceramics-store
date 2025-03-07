"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  FiSun,
  FiMoon,
  FiChevronDown,
  FiMenu,
  FiHome,
  FiBox,
  FiShoppingCart,
} from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import LanguageSwitcher from "@/app/_components/LanguageSwitcher";
import { useLanguage } from "../_context/LanguageContext";
import { useAuth } from "../_context/AuthContext";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader } from "../_components/Loader";

export default function CeramicsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { logout, token, user } = useAuth();
  const { t } = useLanguage();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const currentPath = usePathname();
  const [darkMode, setDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode");
    if (savedDarkMode !== null) {
      const isDarkMode = savedDarkMode === "true";
      setDarkMode(isDarkMode);
      document.documentElement.classList.toggle("dark", isDarkMode);
    }
  }, []);

  const handleNavigate = (path: string) => {
    startTransition(() => {
      router.push(path);
    });
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    document.documentElement.classList.toggle("dark", newDarkMode);
    localStorage.setItem("darkMode", newDarkMode.toString());
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // Check if the user is an admin
  const isAdmin = user?.role === "admin"; // Adjust this check based on your user role structure

  return (
    <div className={`min-h-screen ${darkMode ? "dark" : "bg-blue-50"}`}>
      <div className="dark:bg-gray-900 dark:text-gray-100 p-6">
        {isPending ? (
          <Loader />
        ) : (
          <>
            <header
              className={`flex  ${isAdmin ? "justify-between" : "justify-end"} items-center mb-6`}
            >
              {isAdmin && (
                <button onClick={toggleSidebar} className="md:hidden">
                  <FiMenu className="h-6 w-6" />
                </button>
              )}
              {isAdmin && (
                <nav className="hidden md:flex items-center gap-4">
                  <button
                    onClick={() => handleNavigate("/dashboard")}
                    className={`flex gap-2 ${
                      currentPath === "/dashboard"
                        ? "text-blue-600 font-semibold"
                        : "text-gray-800 dark:text-gray-100"
                    }`}
                  >
                    <FiHome /> {t("dashboard")}
                  </button>
                  <button
                    onClick={() => handleNavigate("/ceramics")}
                    className={`flex gap-2 ${
                      currentPath === "/ceramics"
                        ? "text-blue-600 font-semibold"
                        : "text-gray-800 dark:text-gray-100"
                    }`}
                  >
                    <FiBox /> {t("ceramics")}
                  </button>
                  <button
                    onClick={() => handleNavigate("/orders")}
                    className={`flex gap-2 ${
                      currentPath === "/orders"
                        ? "text-blue-600 font-semibold"
                        : "text-gray-800 dark:text-gray-100"
                    }`}
                  >
                    <FiShoppingCart /> {t("orders")}
                  </button>
                </nav>
              )}
              <div className="flex items-center gap-4">
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
                <LanguageSwitcher />
                {token && user ? (
                  <Menu as="div" className="relative">
                    <MenuButton className="flex items-center gap-2">
                      <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
                        {user.name.charAt(0)}
                      </div>
                      <span className="text-gray-800 dark:text-gray-100">
                        {user.name}
                      </span>
                      <FiChevronDown className="h-5 w-5 text-gray-800 dark:text-gray-100" />
                    </MenuButton>
                    <Transition
                      enter="transition duration-100 ease-out"
                      enterFrom="transform scale-95 opacity-0"
                      enterTo="transform scale-100 opacity-100"
                      leave="transition duration-75 ease-out"
                      leaveFrom="transform scale-100 opacity-100"
                      leaveTo="transform scale-95 opacity-0"
                    >
                      <MenuItems className="absolute right-0 mt-2 w-48 rounded-md bg-white dark:bg-gray-800 shadow-lg">
                        <MenuItem>
                          {(focus) => (
                            <button
                              onClick={logout}
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
                ) : (
                  <button
                    onClick={() => handleNavigate("/login")}
                    className="text-blue-500 hover:text-blue-700 font-bold"
                  >
                    {t("login")}
                  </button>
                )}
              </div>
            </header>
            <main>{children}</main>
            {isSidebarOpen && isAdmin && (
              <div
                className="fixed inset-0 bg-gray-800 bg-opacity-75 z-40 md:hidden"
                onClick={toggleSidebar}
              >
                <div className="relative bg-white dark:bg-gray-800 w-48 h-full p-4 opacity-85 transform transition-transform">
                  <button
                    className="absolute top-4 right-4 text-2xl dark:text-white text-gray-600"
                    onClick={toggleSidebar}
                  >
                    <IoClose />
                  </button>
                  <nav className="flex flex-col items-start mt-12 gap-4">
                    <button
                      onClick={() => handleNavigate("/dashboard")}
                      className={`flex gap-2 ${
                        currentPath === "/dashboard"
                          ? "text-blue-600 font-semibold"
                          : ""
                      }`}
                    >
                      <FiHome />
                      {t("dashboard")}
                    </button>
                    <button
                      onClick={() => handleNavigate("/ceramics")}
                      className={`flex gap-2 ${
                        currentPath === "/ceramics"
                          ? "text-blue-600 font-semibold"
                          : ""
                      }`}
                    >
                      <FiBox />
                      {t("ceramics")}
                    </button>
                    <button
                      onClick={() => handleNavigate("/orders")}
                      className={`flex gap-2 ${
                        currentPath === "/orders"
                          ? "text-blue-600 font-semibold"
                          : ""
                      }`}
                    >
                      <FiShoppingCart />
                      {t("orders")}
                    </button>
                  </nav>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
