"use client"

import { Search, Menu } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function Header({ onMenuClick }) {
  return (
    <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Mobile menu button */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="lg:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 p-0">
              <div className="p-4">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-8 bg-gray-900 rounded flex items-center justify-center">
                    <span className="text-white font-bold text-sm">FS</span>
                  </div>
                  <span className="text-xl font-semibold text-gray-900">FlowSchool</span>
                </div>
                <nav className="space-y-4">
                  <a href="#" className="block text-gray-900 font-medium">
                    Courses
                  </a>
                  <a href="#" className="block text-gray-500 hover:text-gray-900">
                    About
                  </a>
                </nav>
              </div>
            </SheetContent>
          </Sheet>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-900 rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">FS</span>
            </div>
            <span className="text-xl font-semibold text-gray-900">FlowSchool</span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          <a href="#" className="text-gray-900 font-medium">
            Courses
          </a>
          <a href="#" className="text-gray-500 hover:text-gray-900">
            About
          </a>
        </nav>

        {/* Search - responsive */}
        <div className="relative w-full max-w-xs lg:w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input placeholder="Search flow arts..." className="pl-10 bg-gray-50 border-gray-200 text-sm lg:text-base" />
        </div>
      </div>
    </header>
  )
}
