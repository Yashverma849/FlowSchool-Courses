"use client"

import { useEffect, useState } from "react"
import { Search, BellRing, Sparkle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { supabase } from "@/lib/supabaseClient";
import AuthOverlay from "@/app/auth-overlay";
import md5 from "md5";

export default function SiteHeader({ sidebarToggle }) {
  const [searchTerm, setSearchTerm] = useState("") // State for global search
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authOpen, setAuthOpen] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      setUser(data?.user || null);
      setLoading(false);
    };
    getUser();
  }, []);

  // Add logout handler
  async function handleLogout() {
    await supabase.auth.signOut();
    setUser(null);
  }

  function getGravatarUrl(email) {
    if (!email) return "/placeholder-user.jpg";
    const hash = md5(email.trim().toLowerCase());
    return `https://www.gravatar.com/avatar/${hash}?d=identicon`;
  }

  return (
    <div className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-col items-start gap-2">
            <Link href="/" className="flex items-center gap-3 group">
              <Sparkle className="h-8 w-8 text-purple-400 group-hover:scale-110 transition-transform" />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent group-hover:underline">
                FlowSchool
              </h1>
            </Link>
            {/* Sidebar Toggle (mobile only) */}
            {sidebarToggle && (
              <div className="block lg:hidden mt-2">{sidebarToggle}</div>
            )}
          </div>

          {/* Search */}
          <div className="relative flex-1 lg:max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
            />
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
              <BellRing className="h-5 w-5" />
            </Button>
            {loading ? null : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <Avatar className="h-9 w-9 border-2 border-purple-500">
                      <AvatarImage src={user.user_metadata?.avatar_url || getGravatarUrl(user.email)} />
                      <AvatarFallback>{(user.user_metadata?.full_name || user.email || "U").slice(0,2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-gray-800 border-gray-700 text-white" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      {loading ? (
                        <div>Loading...</div>
                      ) : user ? (
                        <>
                          <p className="text-sm font-medium leading-none">{user.user_metadata?.full_name || user.email}</p>
                          <p className="text-xs leading-none text-gray-400">{user.email}</p>
                        </>
                      ) : (
                        <div>Not logged in</div>
                      )}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-gray-700" />
                  <DropdownMenuItem className="focus:bg-gray-700 focus:text-white" asChild>
                    <Link href="/my-learning">My Learning</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="focus:bg-gray-700 focus:text-white" asChild>
                    <Link href="/settings">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-gray-700" />
                  <DropdownMenuItem className="focus:bg-gray-700 focus:text-white" onClick={handleLogout}>Log out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button
                  variant="gradient"
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg px-4 py-2 rounded-full"
                  onClick={() => setAuthOpen(true)}
                >
                  Sign In / Register
                </Button>
                <AuthOverlay open={authOpen} onOpenChange={setAuthOpen} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 