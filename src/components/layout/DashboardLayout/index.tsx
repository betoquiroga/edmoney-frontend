import Sidebar from "../Sidebar"
import { AddTransactionFAB } from "../../ui/AddTransactionFAB"
import { createContext, useContext, useEffect, useState } from "react"
import { usersService } from "../../../services/users.service"
import { User } from "../../../types/user.types"

interface UserContextType {
  user: User | null
  isLoading: boolean
}

const UserContext = createContext<UserContextType>({
  user: null,
  isLoading: true,
})
export const useUser = () => useContext(UserContext)

interface DashboardLayoutProps {
  children: React.ReactNode
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await usersService.me()
        setUser(userData)
      } catch (error) {
        console.error("Error cargando usuario:", error)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }
    fetchUser()
  }, [])

  return (
    <UserContext.Provider value={{ user, isLoading }}>
      <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
        <Sidebar />
        <div className="flex-grow overflow-auto dark:bg-gray-900">
          <main className="p-6">{children}</main>
          <AddTransactionFAB />
        </div>
      </div>
    </UserContext.Provider>
  )
}

export default DashboardLayout
