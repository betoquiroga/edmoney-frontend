import Sidebar from "../Sidebar"

interface DashboardLayoutProps {
  children: React.ReactNode
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-64 flex-shrink-0">
        <Sidebar userName="Juan Silva" />
      </div>
      <div className="flex-grow overflow-auto">
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}

export default DashboardLayout
