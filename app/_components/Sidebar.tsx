import {
  FiBarChart2,
  FiBox,
  FiChevronLeft,
  FiMenu,
  FiShoppingCart,
} from "react-icons/fi";
import { useAppDispatch } from "../_features/store/store";
import { useAuth } from "../_context/AuthContext";
import { useLanguage } from "../_context/LanguageContext";
import { useCallback } from "react";
import { logout } from "../_features/auth/slice";
import { motion } from "framer-motion";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";

const menuItems = [
  {
    name: "analytics",
    path: "/dashboard",
    icon: <FiBarChart2 className="h-5 w-5" />,
  },
  { name: "ceramics", path: "/ceramics", icon: <FiBox className="h-5 w-5" /> },
  {
    name: "orders",
    path: "/orders",
    icon: <FiShoppingCart className="h-5 w-5" />,
  },
];

const Sidebar = ({
  isSidebarCollapsed,
  setIsSidebarCollapsed,
  onNavigation,
  currentPath,
}: {
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (val: boolean) => void;
  onNavigation: (path: string) => void;
  currentPath: string;
}) => {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const { t } = useLanguage();

  const handleLogout = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  return (
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
            onClick={() => onNavigation(item.path)}
            className={`flex items-center p-4 hover:bg-gray-600 w-full ${isSidebarCollapsed ? "justify-center" : ""} ${currentPath === item.path ? "bg-gray-600 cursor-not-allowed" : ""}`}
          >
            {item.icon}
            {!isSidebarCollapsed && (
              <span className="ml-2">{t(item.name)}</span>
            )}
          </button>
        ))}
      </nav>
      <div className="p-4 bordre-t border-gray-600 mt-auto">
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
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
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
  );
};

export default Sidebar;
