import Link from "next/link"
import { NavItemProps } from "./types"

const NavItem = ({ href, icon, label, isActive = false }: NavItemProps) => {
  return (
    <Link
      href={href}
      className={`flex items-center py-3 px-4 text-sm rounded-md transition-colors ${
        isActive
          ? "bg-blue-800 dark:bg-blue-950 text-white"
          : "text-blue-100 hover:bg-blue-800 dark:hover:bg-blue-950 hover:text-white"
      }`}
    >
      <span className="mr-3">{icon}</span>
      <span>{label}</span>
    </Link>
  )
}

export default NavItem
