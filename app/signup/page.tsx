import { Flame } from "lucide-react";
import AuthForm from "../components/AuthForm";

export default function SignUpPage() {
    return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Static Header: Rendered on Server */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Flame className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">Flow State</span>
          </div>
          <p className="text-muted-foreground">Sign up to start tracking your daily progress</p>
        </div>

        {/* Interactive Form: Hydrated on Client */}
        <AuthForm type="signup" />

        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            Already have an account? <a href="/signin" className="text-primary font-medium">Sign in</a>
          </p>
        </div>
      </div>
    </div>
  );
}