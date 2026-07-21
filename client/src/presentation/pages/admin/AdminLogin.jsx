import { Mail } from 'lucide-react'; // Imports the icon if needed for design decoration
import LoginForm from "@/presentation/components/admin/auth/AdminLoginForm";

export default function AdminLogin() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md overflow-hidden border border-slate-100">
        {/* Render your working form component here */}
        <LoginForm />
      </div>
    </div>
  );
}