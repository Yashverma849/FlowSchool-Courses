"use client"

import { useEffect, useState } from "react"
import { Search, Menu, X, Bell } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useCourses } from "../contexts/course-context"
import { supabase } from "@/lib/supabaseClient"

export function ModernHeader({ onMyLearningClick, onSettingsClick }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { filters, setSearchTerm } = useCourses()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser()
      setUser(data?.user || null)
      setLoading(false)
    }
    getUser()
  }, [])

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-gray-950/80 backdrop-blur-md supports-[backdrop-filter]:bg-gray-950/60">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-pink-600">
              <span className="text-sm font-bold text-white">F</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              FlowSchool
            </span>
          </div>

          {/* Search Bar */}
          <div className="hidden lg:flex items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search courses..."
                className="w-80 pl-10 bg-gray-900/50 border-gray-700 focus:border-purple-500 focus:ring-purple-500/20 text-gray-100 placeholder:text-gray-400"
                value={filters.searchTerm}
                onChange={handleSearch}
              />
            </div>
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <Button
              variant="ghost"
              size="sm"
              className="hidden md:flex text-gray-400 hover:text-gray-100 hover:bg-gray-800"
            >
              <Bell className="h-4 w-4" />
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg" alt="User" />
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                      AJ
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-gray-900 border-gray-700 text-gray-100" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    {loading ? (
                      <div>Loading...</div>
                    ) : user ? (
                      <>
                        <p className="text-sm font-medium leading-none text-gray-100">{user.user_metadata?.full_name || user.email}</p>
                        <p className="text-xs leading-none text-gray-400">{user.email}</p>
                      </>
                    ) : (
                      <div>Not logged in</div>
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-700" />
                <DropdownMenuItem onClick={onMyLearningClick} className="text-gray-100 hover:bg-gray-800">
                  My Learning
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onSettingsClick} className="text-gray-100 hover:bg-gray-800">
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-700" />
                <DropdownMenuItem className="text-gray-100 hover:bg-gray-800">Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden text-gray-400 hover:text-gray-100 hover:bg-gray-800"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-800 py-4">
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search courses..."
                  className="pl-10 bg-gray-900/50 border-gray-700 focus:border-purple-500 focus:ring-purple-500/20 text-gray-100 placeholder:text-gray-400"
                  value={filters.searchTerm}
                  onChange={handleSearch}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
