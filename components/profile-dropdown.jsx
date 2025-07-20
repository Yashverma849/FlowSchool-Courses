"use client"
import { Settings, BookOpen, LogOut, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function ProfileDropdown() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      setUser(data?.user || null);
      setLoading(false);
    };
    getUser();
  }, []);

  if (loading) return <div className="p-4">Loading...</div>;
  if (!user) return <div className="p-4">Not logged in</div>;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-3 p-3 hover:bg-gray-800 rounded-lg transition-colors w-full justify-start"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.user_metadata?.avatar_url || "/placeholder.svg"} alt={user.user_metadata?.full_name || user.email} />
            <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              {user.user_metadata?.full_name
                ? user.user_metadata.full_name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                : user.email
                    .split("@")[0]
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 text-left">
            <p className="text-sm font-medium">{user.user_metadata?.full_name || user.email}</p>
            <p className="text-xs text-gray-400">{user.email}</p>
          </div>
          <ChevronUp className="h-4 w-4 text-gray-400" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-64 bg-gray-900 border-gray-800" align="end" side="top">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.user_metadata?.full_name || user.email}</p>
            <p className="text-xs leading-none text-gray-400">{user.email}</p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="bg-gray-800" />

        <DropdownMenuItem className="hover:bg-gray-800 cursor-pointer" onClick={onMyLearningClick}>
          <BookOpen className="mr-2 h-4 w-4" />
          <span>My Learning</span>
          <span className="ml-auto text-xs bg-purple-600 text-white px-2 py-1 rounded-full">
            {user.user_metadata?.enrolled_courses || 0}
          </span>
        </DropdownMenuItem>

        <DropdownMenuItem className="hover:bg-gray-800 cursor-pointer" onClick={onSettingsClick}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-gray-800" />

        <DropdownMenuItem className="hover:bg-gray-800 cursor-pointer text-red-400 hover:text-red-300">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
