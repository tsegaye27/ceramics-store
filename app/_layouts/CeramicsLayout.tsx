"use client";

import { useState } from "react";
import { FiSun, FiMoon, FiLogOut, FiChevronDown } from "react-icons/fi";
import { Menu, Transition } from "@headlessui/react";
import LanguageSwitcher from "@/app/_components/LanguageSwitcher";
import { useLanguage } from "../_context/LanguageContext";
import { useAuth } from "../_context/AuthContext";
import { useTransition } from "react";
import { useRouter } from "next/navigation";

export default function CeramicsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { logout, token, user } = useAuth();
  const { t } = useLanguage();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);

  const handleLogin = () => {
    startTransition(() => {
      router.push("/login");
    });
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark", !darkMode);
  };

  return (
    <div className={`min-h-screen ${darkMode ? "dark" : "bg-blue-50"}`}>
      <div className="dark:bg-gray-900 dark:text-gray-100 p-6">
        {isPending ? (
          <div>Loading...</div>
        ) : (
          <>
            <header className="flex justify-between items-center mb-6">
              <LanguageSwitcher />
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
                {token && user ? (
                  <Menu as="div" className="relative">
                    <Menu.Button className="flex items-center gap-2">
                      <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
                        {user.name.charAt(0)}
                      </div>
                      <span className="text-gray-800 dark:text-gray-100">
                        {user.name}
                      </span>
                      <FiChevronDown className="h-5 w-5 text-gray-800 dark:text-gray-100" />
                    </Menu.Button>
                    <Transition
                      enter="transition duration-100 ease-out"
                      enterFrom="transform scale-95 opacity-0"
                      enterTo="transform scale-100 opacity-100"
                      leave="transition duration-75 ease-out"
                      leaveFrom="transform scale-100 opacity-100"
                      leaveTo="transform scale-95 opacity-0"
                    >
                      <Menu.Items className="absolute right-0 mt-2 w-48 rounded-md bg-white dark:bg-gray-800 shadow-lg">
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={logout}
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
                ) : (
                  <button
                    onClick={handleLogin}
                    className="text-blue-500 hover:text-blue-700 font-bold"
                  >
                    {t("login")}
                  </button>
                )}
              </div>
            </header>
            <main>{children}</main>
          </>
        )}
      </div>
    </div>
  );
}
