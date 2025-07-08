"use client"

import { ProfileDropdown } from "./components/profile-dropdown"

export function FlowSchoolLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer with Profile */}
      <footer className="bg-gray-900 border-t border-gray-800 p-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-400">© 2024 FlowSchool. Master your flow arts journey.</div>
            </div>

            <div className="flex items-center gap-4">
              <ProfileDropdown />
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
