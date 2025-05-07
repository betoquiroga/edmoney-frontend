"use client"

import DashboardLayout from "../../components/layout/DashboardLayout"

export default function DashboardPageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  console.log("Dashboard App Layout MONTADO")
  return <DashboardLayout>{children}</DashboardLayout>
}
