"use client"
import { useState, useTransition } from 'react'
import { motion } from 'framer-motion'
import { Mail, Lock, User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import axios from 'axios'

interface AuthFormProps {
  type: 'signin' | 'signup'
}

export default function AuthForm({ type }: AuthFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({ 
    username: '', 
    email: '', 
    password: '' 
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      try {
        if (type === 'signup') {
          // Handle signup - save to database first
          const signupResponse = await axios.post('/api/signup', {
            username: formData.username,
            email: formData.email,
            password: formData.password
          });
          
          if (signupResponse.status === 201) {
            // Signup successful - redirect to signin
            router.push('/signin');
            return;
          }
          
          // Handle signup error
          const errorMessage = signupResponse.data?.error || "Signup failed";
          setError(errorMessage);
          return;
        }

        // Handle signin
        const signinResponse = await axios.post('/api/signin', {
          email: formData.email,
          password: formData.password
        });
        
        if (signinResponse.status === 200) {
          // Redirecting to dashboard of user
          router.push(`/${signinResponse.data.user.id}/dashboard`);
        }
      } catch (err: any) {
        const errorMessage = err.response?.data?.error || err.message || "Authentication failed";
        setError(errorMessage);
      }
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card p-6 space-y-4 bg-muted/30 rounded-2xl border border-border"
    >
      {error && <p className="text-destructive text-sm text-center">{error}</p>}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Username - Only show for signup */}
        {type === 'signup' && (
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground uppercase tracking-widest font-mono">Username</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                required
                placeholder="Enter your username"
                className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-background border border-border outline-none focus:border-primary/50 transition-colors"
                onChange={(e) => setFormData(p => ({ ...p, username: e.target.value }))}
              />
            </div>
          </div>
        )}

        {/* Email */}
        <div className="space-y-2">
           <label className="text-xs text-muted-foreground uppercase tracking-widest font-mono">Email</label>
           <div className="relative">
             <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
             <input
               type="email"
               required
               placeholder="Enter your email"
               className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-background border border-border outline-none focus:border-primary/50 transition-colors"
               onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))}
             />
           </div>
        </div>

        {/* Password */}
        <div className="space-y-2">
           <label className="text-xs text-muted-foreground uppercase tracking-widest font-mono">Password</label>
           <div className="relative">
             <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
             <input
               type="password"
               required
               placeholder="Enter your password"
               className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-background border border-border outline-none focus:border-primary/50 transition-colors"
               onChange={(e) => setFormData(p => ({ ...p, password: e.target.value }))}
             />
           </div>
        </div>

        <motion.button
          type="submit"
          disabled={isPending}
          whileTap={{ scale: 0.98 }}
          className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-medium disabled:opacity-50 hover:shadow-lg hover:shadow-primary/20 transition-all"
        >
          {isPending ? "Processing..." : type === 'signin' ? "Sign In" : "Sign Up"}
        </motion.button>
      </form>
    </motion.div>
  );
}
