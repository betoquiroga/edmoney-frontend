import Sidebar from "../Sidebar"
import { AddTransactionFAB } from "../../ui/AddTransactionFAB"

interface DashboardLayoutProps {
  children: React.ReactNode
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar userName="Juan Silva" />
      <div className="flex-grow overflow-auto">
        <main className="p-6">{children}</main>
        <AddTransactionFAB />
      </div>
    </div>
  )
}

export default DashboardLayout
