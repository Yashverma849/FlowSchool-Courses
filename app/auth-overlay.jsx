import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FcGoogle } from "react-icons/fc";
import { FaGithub, FaFacebook } from "react-icons/fa";
import { Sparkle } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { getPostAuthRedirectPath } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function AuthOverlay({ open, onOpenChange }) {
  const router = useRouter();
  const [mode, setMode] = useState("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirm, setSignupConfirm] = useState("");
  const [signupPhone, setSignupPhone] = useState("");

  // Card size based on mode
  const cardSize = mode === "signup"
    ? "w-[420px] min-h-[720px]"
    : "w-[400px] min-h-[540px]";

  // Handle login
  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { data, error } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password: loginPassword,
    });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      onOpenChange(false); // Close overlay
      setLoginEmail("");
      setLoginPassword("");
      
      // Get redirect path based on enrollment count
      if (data.user) {
        const redirectPath = await getPostAuthRedirectPath(data.user.id);
        router.push(redirectPath);
      }
    }
  }

  // Handle signup
  async function handleSignup(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    if (signupPassword !== signupConfirm) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }
    const { data, error } = await supabase.auth.signUp({
      email: signupEmail,
      password: signupPassword,
      options: {
        data: { full_name: signupName, phone: signupPhone },
      },
    });
    if (!error && data.user) {
      await supabase.auth.updateUser({
        data: { full_name: signupName, phone: signupPhone },
      });
    }
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      onOpenChange(false); // Close overlay
      setSignupName("");
      setSignupEmail("");
      setSignupPassword("");
      setSignupConfirm("");
      setSignupPhone("");
      
      // Get redirect path based on enrollment count
      if (data.user) {
        const redirectPath = await getPostAuthRedirectPath(data.user.id);
        router.push(redirectPath);
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-visible bg-transparent border-0 shadow-none p-0 flex items-center justify-center">
        <div className={`perspective relative ${cardSize}`} style={{ perspective: 1200 }}>
          <div
            className={`absolute w-full h-full transition-transform duration-700 [transform-style:preserve-3d] ${mode === "signup" ? "rotate-y-180" : ""}`}
          >
            {/* Login Card */}
            <div className="absolute w-full h-full [backface-visibility:hidden] flex flex-col justify-center">
              <div className="rounded-2xl bg-gradient-to-br from-black via-gray-900 to-green-900 shadow-2xl p-8 flex flex-col justify-center h-full">
                <Link href="/" className="flex items-center gap-3 mb-8 group">
                  <Sparkle className="h-8 w-8 text-purple-400 group-hover:scale-110 transition-transform" />
                  <span className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">FlowSchool</span>
                </Link>
                <div className="mb-8">
                  <h3 className="text-white text-lg font-semibold mb-2">Please Enter your Account details</h3>
                </div>
                <form className="flex flex-col gap-5" onSubmit={handleLogin}>
                  <div>
                    <Label htmlFor="email" className="text-white mb-1 block">Email</Label>
                    <Input id="email" type="email" placeholder="Johndoe@gmail.com" autoComplete="email" className="rounded-lg bg-white text-black border-0 focus:ring-2 focus:ring-green-500" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} required />
                  </div>
                  <div>
                    <Label htmlFor="password" className="text-white mb-1 block">Password</Label>
                    <Input id="password" type="password" placeholder="••••••••" autoComplete="current-password" className="rounded-lg bg-white text-black border-0 focus:ring-2 focus:ring-green-500" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} required />
                  </div>
                  <div className="flex justify-end -mt-3">
                    <button type="button" className="text-xs text-white underline hover:text-green-400">Forgot Password</button>
                  </div>
                  {error && <div className="text-red-400 text-sm text-center -mt-2">{error}</div>}
                  <Button type="submit" className="w-full mt-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-lg font-semibold py-2 shadow-md" disabled={loading}>
                    {loading ? "Signing in..." : "Sign in"}
                  </Button>
                </form>
                <div className="flex items-center gap-3 my-6 justify-center">
                  <button className="rounded-full bg-white p-2 shadow hover:scale-105 transition-transform"><FcGoogle size={28} /></button>
                  <button className="rounded-full bg-white p-2 shadow hover:scale-105 transition-transform"><FaGithub size={26} className="text-gray-800" /></button>
                  <button className="rounded-full bg-white p-2 shadow hover:scale-105 transition-transform"><FaFacebook size={26} className="text-blue-600" /></button>
                </div>
                <div className="flex flex-col items-center mt-2">
                  <button type="button" className="text-white underline text-sm hover:text-green-400" onClick={() => { setMode("signup"); setError(""); }}>Create an account</button>
                </div>
              </div>
            </div>
            {/* Signup Card */}
            <div className="absolute w-full h-full [transform:rotateY(180deg)] [backface-visibility:hidden] flex flex-col justify-center">
              <div className="rounded-2xl bg-gradient-to-br from-black via-gray-900 to-green-900 shadow-2xl p-10 flex flex-col justify-center h-full">
                <Link href="/" className="flex items-center gap-3 mb-8 group">
                  <Sparkle className="h-8 w-8 text-purple-400 group-hover:scale-110 transition-transform" />
                  <span className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">FlowSchool</span>
                </Link>
                <div className="mb-8">
                  <h3 className="text-white text-lg font-semibold mb-2">Create your Account</h3>
                </div>
                <form className="flex flex-col gap-5" onSubmit={handleSignup}>
                  <div>
                    <Label htmlFor="signup-name" className="text-white mb-1 block">Full Name</Label>
                    <Input id="signup-name" type="text" placeholder="Your Name" autoComplete="name" className="rounded-lg bg-white text-black border-0 focus:ring-2 focus:ring-green-500" value={signupName} onChange={e => setSignupName(e.target.value)} required />
                  </div>
                  <div>
                    <Label htmlFor="signup-email" className="text-white mb-1 block">Email</Label>
                    <Input id="signup-email" type="email" placeholder="Johndoe@gmail.com" autoComplete="email" className="rounded-lg bg-white text-black border-0 focus:ring-2 focus:ring-green-500" value={signupEmail} onChange={e => setSignupEmail(e.target.value)} required />
                  </div>
                  <div>
                    <Label htmlFor="signup-phone" className="text-white mb-1 block">Phone Number</Label>
                    <Input id="signup-phone" type="tel" placeholder="e.g. +1234567890" autoComplete="tel" className="rounded-lg bg-white text-black border-0 focus:ring-2 focus:ring-green-500" value={signupPhone} onChange={e => setSignupPhone(e.target.value)} required />
                  </div>
                  <div>
                    <Label htmlFor="signup-password" className="text-white mb-1 block">Password</Label>
                    <Input id="signup-password" type="password" placeholder="Create a password" autoComplete="new-password" className="rounded-lg bg-white text-black border-0 focus:ring-2 focus:ring-green-500" value={signupPassword} onChange={e => setSignupPassword(e.target.value)} required />
                  </div>
                  <div>
                    <Label htmlFor="confirm-password" className="text-white mb-1 block">Confirm Password</Label>
                    <Input id="confirm-password" type="password" placeholder="Repeat password" autoComplete="new-password" className="rounded-lg bg-white text-black border-0 focus:ring-2 focus:ring-green-500" value={signupConfirm} onChange={e => setSignupConfirm(e.target.value)} required />
                  </div>
                  {error && <div className="text-red-400 text-sm text-center -mt-2">{error}</div>}
                  <Button type="submit" className="w-full mt-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-lg font-semibold py-2 shadow-md" disabled={loading}>
                    {loading ? "Signing up..." : "Sign up"}
                  </Button>
                </form>
                <div className="flex items-center gap-3 my-6 justify-center">
                  <button className="rounded-full bg-white p-2 shadow hover:scale-105 transition-transform"><FcGoogle size={28} /></button>
                  <button className="rounded-full bg-white p-2 shadow hover:scale-105 transition-transform"><FaGithub size={26} className="text-gray-800" /></button>
                  <button className="rounded-full bg-white p-2 shadow hover:scale-105 transition-transform"><FaFacebook size={26} className="text-blue-600" /></button>
                </div>
                <div className="flex flex-col items-center mt-2">
                  <button type="button" className="text-white underline text-sm hover:text-green-400" onClick={() => { setMode("login"); setError(""); }}>Already have an account? Sign in</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 