import React from "react"
import { Header } from "../components/landing/Header"
import { Hero } from "../components/landing/Hero"
import { Features } from "../components/landing/Features"
import { Plans } from "../components/landing/Plans"
import { Footer } from "../components/landing/Footer"

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Hero />
        <Features />
        <Plans />
      </main>
      <Footer />
    </div>
  )
}
