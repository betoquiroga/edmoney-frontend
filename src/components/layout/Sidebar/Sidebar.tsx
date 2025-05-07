import { usePathname } from "next/navigation"
import NavItem from "./NavItem"
import { useState, useEffect } from "react"
import { useUser } from "../DashboardLayout"
import { authService } from "../../../services/auth.service"

// Icons
const DashboardIcon = () => (
  <svg
    className="w-5 h-5"
    fill="currentColor"
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4z"></path>
    <path d="M3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6z"></path>
    <path d="M14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path>
  </svg>
)
const TransactionsIcon = () => (
  <svg
    className="w-5 h-5"
    fill="currentColor"
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M8 5a1 1 0 100 2h5.586l-1.293 1.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L13.586 5H8zM12 15a1 1 0 100-2H6.414l1.293-1.293a1 1 0 10-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L6.414 15H12z"></path>
  </svg>
)

// Menu Toggle Icon
const MenuToggleIcon = () => (
  <svg
    className="w-6 h-6"
    fill="currentColor"
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
      clipRule="evenodd"
    ></path>
  </svg>
)

// Close Icon
const CloseIcon = () => (
  <svg
    className="w-6 h-6"
    fill="currentColor"
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
      clipRule="evenodd"
    ></path>
  </svg>
)

// Logout Icon
const LogoutIcon = () => (
  <svg
    className="w-5 h-5"
    fill="currentColor"
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h9a1 1 0 001-1v-2a1 1 0 10-2 0v1H4V5h7v1a1 1 0 102 0V4a1 1 0 00-1-1H3zm14.707 4.707a1 1 0 010 1.414L15.414 12l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z"
      clipRule="evenodd"
    ></path>
  </svg>
)

const Sidebar = () => {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { user } = useUser()

  // Close sidebar when route changes on mobile
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (
        isMobileMenuOpen &&
        !target.closest(".sidebar-container") &&
        !target.closest(".mobile-menu-button")
      ) {
        setIsMobileMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isMobileMenuOpen])

  const handleLogout = () => {
    authService.logout()
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="fixed top-4 right-4 z-50 lg:hidden bg-blue-700 dark:bg-blue-800 text-white p-2 rounded-md mobile-menu-button"
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? <CloseIcon /> : <MenuToggleIcon />}
      </button>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 dark:bg-black/70 bg-blend-luminosity blur-3xl bg-opacity-50 z-30 lg:hidden"
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-64 z-40 transform transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 lg:w-64 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } lg:block`}
      >
        <div className="flex flex-col h-full min-h-screen bg-blue-700 dark:bg-blue-900 text-white overflow-y-auto">
          <div className="p-4 border-b border-blue-800 dark:border-blue-950">
            <h1 className="flex items-center text-xl font-bold">
              <span>EDmoney</span>
              <svg
                className="w-4 h-4 ml-1 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M3 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm11 1H6v8l4-2 4 2V6z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </h1>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            <NavItem
              href="/dashboard"
              icon={<DashboardIcon />}
              label="Dashboard"
              isActive={pathname === "/dashboard"}
            />
            <NavItem
              href="/transacciones"
              icon={<TransactionsIcon />}
              label="Transacciones"
              isActive={pathname === "/transacciones"}
            />
          </nav>

          <div className="p-4 border-t border-blue-800 dark:border-blue-950">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-3 py-2 rounded-lg hover:bg-blue-800 dark:hover:bg-blue-800 transition-colors"
            >
              <span className="inline-flex items-center justify-center">
                <LogoutIcon />
              </span>
              <span className="ml-3">Cerrar sesión</span>
            </button>

            <div className="flex items-center mt-4 p-3 rounded-lg bg-blue-800 dark:bg-blue-950">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-200 flex items-center justify-center text-blue-700 dark:text-blue-900 font-bold">
                {user?.name ? user.name.charAt(0) : "?"}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-white">
                  {user?.name || "Usuario"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar
