import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export default function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register } = useAuth();
  
  const isSignup = location.pathname === "/register";
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignup) {
        await register({
          name: formData.fullName,
          email: formData.email,
          password: formData.password,
        });
      } else {
        await login({
          email: formData.email,
          password: formData.password,
        });
      }
      navigate("/rentals");
    } catch {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-stone-50">
      <div className="hidden lg:block w-1/2 relative">
         <img 
            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1600" 
            alt="Interior" 
            className="absolute inset-0 w-full h-full object-cover"
         />
         <div className="absolute inset-0 bg-stone-900/20"></div>
         <div className="absolute bottom-12 left-12 text-white max-w-md">
            <h2 className="text-4xl font-serif font-medium mb-4">Welcome home.</h2>
            <p className="text-lg opacity-90">"Architecture should speak of its time and place, but yearn for timelessness."</p>
         </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16">
         <div className="w-full max-w-md space-y-8">
            <div className="text-center lg:text-left">
               <h1 className="text-3xl font-serif text-stone-900 mb-2">
                  {isSignup ? "Create an account" : `Sign in to Ghar Dekho`}
               </h1>
               <p className="text-stone-500">
                  {isSignup ? "Start your journey to finding the perfect space." : "Welcome back. Please enter your details."}
               </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
               {isSignup && (
                 <div className="space-y-2">
                    <label className="text-sm font-medium text-stone-700">Full Name</label>
                    <input 
                      name="fullName"
                      type="text" 
                      required
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-stone-200 bg-white focus:outline-none focus:border-stone-500 focus:ring-1 focus:ring-stone-500 transition-all" 
                      placeholder="John Doe" 
                    />
                 </div>
               )}

               <div className="space-y-2">
                  <label className="text-sm font-medium text-stone-700">Email Address</label>
                  <input 
                    name="email"
                    type="email" 
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-stone-200 bg-white focus:outline-none focus:border-stone-500 focus:ring-1 focus:ring-stone-500 transition-all" 
                    placeholder="name@example.com" 
                  />
               </div>

               <div className="space-y-2">
                  <div className="flex justify-between">
                     <label className="text-sm font-medium text-stone-700">Password</label>
                     {!isSignup && <a href="#" className="text-sm text-stone-500 hover:text-stone-900 hover:underline">Forgot?</a>}
                  </div>
                  <input 
                    name="password"
                    type="password" 
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-stone-200 bg-white focus:outline-none focus:border-stone-500 focus:ring-1 focus:ring-stone-500 transition-all" 
                    placeholder="••••••••" 
                  />
               </div>

               <Button 
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-stone-900 hover:bg-emerald-900 text-white rounded-lg text-lg font-medium transition-colors shadow-lg shadow-stone-200"
               >
                  {loading ? <Loader2 className="animate-spin" /> : (isSignup ? "Sign Up" : "Sign In")}
               </Button>
            </form>

            <div className="pt-6 border-t border-stone-100 text-center text-sm text-stone-500">
               {isSignup ? "Already have an account? " : "Don't have an account? "}
               <Link to={isSignup ? "/login" : "/register"} className="text-stone-900 font-bold hover:underline">
                  {isSignup ? "Sign In" : "Register Now"}
               </Link>
            </div>
         </div>
      </div>
    </div>
  );
}