"use client"

import { useEffect, useState } from "react"
import { BellRing } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { supabase } from "@/lib/supabaseClient";
import AuthOverlay from "@/app/auth-overlay";
import md5 from "md5";

export default function SiteHeader({ sidebarToggle }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authOpen, setAuthOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [flipAnimation, setFlipAnimation] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      setUser(data?.user || null);
      setLoading(false);
      
      // Show welcome animation after user loads
      if (data?.user) {
        setShowWelcome(true);
        setTimeout(() => setFlipAnimation(true), 4000); // 4 seconds for first message
      }
    };
    getUser();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
        setUser(session?.user || null);
        if (session?.user) {
          setShowWelcome(true);
          setTimeout(() => setFlipAnimation(true), 4000);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setShowWelcome(false);
        setFlipAnimation(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Add logout handler
  async function handleLogout() {
    await supabase.auth.signOut();
    setUser(null);
    setShowWelcome(false);
    setFlipAnimation(false);
  }

  // Loop animation effect
  useEffect(() => {
    if (showWelcome && user) {
      const interval = setInterval(() => {
        setFlipAnimation(prev => !prev);
      }, 4000); // Switch every 4 seconds

      return () => clearInterval(interval);
    }
  }, [showWelcome, user]);

  function getGravatarUrl(email) {
    if (!email) return "/placeholder-user.jpg";
    const hash = md5(email.trim().toLowerCase());
    return `https://www.gravatar.com/avatar/${hash}?d=identicon`;
  }

  function getDisplayName(user) {
    if (!user) return 'User';
    
    // First try to get from user metadata
    if (user.user_metadata?.full_name) {
      return user.user_metadata.full_name;
    }
    
    // If no full name, try to extract from email
    if (user.email) {
      const emailName = user.email.split('@')[0];
      // Convert email name to proper case (e.g., "john.doe" -> "John Doe")
      return emailName
        .split(/[._-]/)
        .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
        .join(' ');
    }
    
    return 'User';
  }

  return (
    <div className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          <div className="flex flex-col items-start gap-2">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-8 h-8 animate-spin-slow">
                <svg 
                  width="32" 
                  height="32" 
                  viewBox="0 0 200 200" 
                  className="w-full h-full"
                >
                  {/* Outer purple petals */}
                  <g className="opacity-90">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <path
                        key={`outer-${i}`}
                        d={`M 100 100 L ${100 + 80 * Math.cos(i * Math.PI / 6)} ${100 + 80 * Math.sin(i * Math.PI / 6)} 
                            Q ${100 + 70 * Math.cos((i + 0.5) * Math.PI / 6)} ${100 + 70 * Math.sin((i + 0.5) * Math.PI / 6)} 
                            ${100 + 60 * Math.cos((i + 1) * Math.PI / 6)} ${100 + 60 * Math.sin((i + 1) * Math.PI / 6)} Z`}
                        fill={`hsl(${270 + i * 5}, 70%, ${60 + i * 2}%)`}
                        stroke={`hsl(${270 + i * 5}, 80%, ${50 + i * 2}%)`}
                        strokeWidth="1"
                      />
                    ))}
                  </g>
                  
                  {/* Middle teal petals */}
                  <g className="opacity-80">
                    {Array.from({ length: 16 }).map((_, i) => (
                      <path
                        key={`middle-${i}`}
                        d={`M 100 100 L ${100 + 50 * Math.cos(i * Math.PI / 8)} ${100 + 50 * Math.sin(i * Math.PI / 8)} 
                            Q ${100 + 40 * Math.cos((i + 0.5) * Math.PI / 8)} ${100 + 40 * Math.sin((i + 0.5) * Math.PI / 8)} 
                            ${100 + 30 * Math.cos((i + 1) * Math.PI / 8)} ${100 + 30 * Math.sin((i + 1) * Math.PI / 8)} Z`}
                        fill={`hsl(${180 + i * 8}, 70%, ${50 + i * 3}%)`}
                        stroke={`hsl(${180 + i * 8}, 80%, ${40 + i * 3}%)`}
                        strokeWidth="1"
                      />
                    ))}
                  </g>
                  
                  {/* Inner blue petals */}
                  <g className="opacity-70">
                    {Array.from({ length: 20 }).map((_, i) => (
                      <path
                        key={`inner-${i}`}
                        d={`M 100 100 L ${100 + 25 * Math.cos(i * Math.PI / 10)} ${100 + 25 * Math.sin(i * Math.PI / 10)} 
                            Q ${100 + 20 * Math.cos((i + 0.5) * Math.PI / 10)} ${100 + 20 * Math.sin((i + 0.5) * Math.PI / 10)} 
                            ${100 + 15 * Math.cos((i + 1) * Math.PI / 10)} ${100 + 15 * Math.sin((i + 1) * Math.PI / 10)} Z`}
                        fill={`hsl(${200 + i * 10}, 80%, ${60 + i * 2}%)`}
                        stroke={`hsl(${200 + i * 10}, 90%, ${50 + i * 2}%)`}
                        strokeWidth="1"
                      />
                    ))}
                  </g>
                  
                  {/* Center spiral */}
                  <circle
                    cx="100"
                    cy="100"
                    r="8"
                    fill="hsl(180, 90%, 60%)"
                    stroke="hsl(180, 100%, 50%)"
                    strokeWidth="2"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent group-hover:underline">
                FlowSchool
              </h1>
            </Link>
            {/* Sidebar Toggle (mobile only) */}
            {sidebarToggle && (
              <div className="block lg:hidden mt-2">{sidebarToggle}</div>
            )}
          </div>

          <div className="flex items-center gap-4">
            {/* Welcome Message */}
            {user && (
              <div className="hidden lg:flex items-center gap-3 text-white">
                <div className="relative h-6 overflow-hidden w-64">
                  <div className={`absolute inset-0 transition-all duration-1000 ease-out ${flipAnimation ? 'opacity-0 -translate-y-full' : 'opacity-100 translate-y-0'}`}>
                    <span className="text-sm font-medium text-white">
                      Hi {getDisplayName(user)}!
                    </span>
                  </div>
                  <div className={`absolute inset-0 transition-all duration-1000 ease-out ${flipAnimation ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full'}`}>
                    <span className="text-sm text-purple-300">Welcome Back To Flow Journey</span>
                  </div>
                </div>
              </div>
            )}
            
            {loading ? null : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <Avatar className="h-9 w-9 border-2 border-purple-500">
                      <AvatarImage src={user.user_metadata?.avatar_url || getGravatarUrl(user.email)} />
                      <AvatarFallback>{getDisplayName(user).slice(0,2).toUpperCase()}</AvatarFallback>
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
                          <p className="text-sm font-medium leading-none">{getDisplayName(user)}</p>
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