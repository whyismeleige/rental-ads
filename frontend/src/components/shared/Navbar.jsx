import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Key, Menu, X, LogOut, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

function getInitials(user) {
  if (!user) return "?";
  if (user.name) {
    const parts = user.name.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return parts[0].slice(0, 2).toUpperCase();
  }
  if (user.email) return user.email.slice(0, 2).toUpperCase();
  return "U";
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsOpen(false);
    logout();
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-stone-50/80 backdrop-blur-md border-b border-stone-200">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-stone-900 text-stone-50 p-2 rounded-lg group-hover:bg-emerald-800 transition-colors">
            <Key size={20} fill="currentColor" className="text-stone-50" />
          </div>
          <span className="font-serif font-bold text-2xl text-stone-900 tracking-tight">
            Ghar Dekho
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-600">
          <Link to="/rentals" className="hover:text-stone-900 transition-colors">Rentals</Link>
        </div>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="rounded-full ring-offset-background focus:outline-none focus:ring-2 focus:ring-stone-400 focus:ring-offset-2">
                  <Avatar className="h-9 w-9 border-2 border-stone-200">
                    <AvatarImage src={user?.avatar ?? user?.image} alt={user?.name ?? "User"} />
                    <AvatarFallback className="bg-stone-200 text-stone-700 text-sm font-medium">
                      {getInitials(user)}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user?.name ?? "User"}</p>
                    {user?.email && (
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/my-listings" className="flex items-center cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    My Listings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600 cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" className="text-stone-600 hover:text-stone-900 hover:bg-stone-200/50">
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button className="bg-stone-900 hover:bg-stone-800 text-stone-50 rounded-full px-6 transition-transform hover:-translate-y-0.5">
                  List Your Property
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-stone-900 p-2" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-stone-50 border-b border-stone-200 p-6 flex flex-col gap-4 shadow-xl animate-in slide-in-from-top-5">
          <Link to="/rentals" className="text-lg font-serif font-medium text-stone-900">Rentals</Link>
          {isAuthenticated ? (
            <div className="flex flex-col gap-3 pt-2 border-t border-stone-200">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border border-stone-200">
                  <AvatarImage src={user?.avatar ?? user?.image} alt={user?.name ?? "User"} />
                  <AvatarFallback className="bg-stone-200 text-stone-700 text-sm font-medium">
                    {getInitials(user)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-stone-900">{user?.name ?? "User"}</p>
                  {user?.email && <p className="text-sm text-stone-500">{user.email}</p>}
                </div>
              </div>
              <Button variant="outline" className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </Button>
            </div>
          ) : (
            <>
              <Link to="/login" className="text-lg font-serif font-medium text-stone-600">Sign In</Link>
              <Link to="/register">
                <Button className="w-full bg-stone-900 text-white mt-4">List Property</Button>
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}