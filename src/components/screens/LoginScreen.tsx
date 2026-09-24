import React, { useState } from 'react';
import { School, Eye, EyeOff, Lock, Mail, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';

export const LoginScreen: React.FC = () => {
  const { login } = useSchool();
  const [email, setEmail] = useState('admin@oakridgevidyalaya.edu.in');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const errors: { email?: string; password?: string } = {};
    if (!email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 4) {
      errors.password = 'Password must be at least 4 characters';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!validate()) return;

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const success = login(email, password, rememberMe);
      if (!success) {
        setErrorMessage('Invalid credentials. Please verify your email and password.');
      }
    }, 600);
  };

  const handleFillDemo = () => {
    setEmail('admin@oakridgevidyalaya.edu.in');
    setPassword('admin123');
    setFieldErrors({});
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-slate-50">
      {/* Left side: Branding & Visuals */}
      <div className="lg:w-1/2 bg-blue-700 text-white p-8 lg:p-16 flex flex-col justify-between relative overflow-hidden">
        {/* Ambient subtle decorative background glow */}
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-blue-900/30 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white text-blue-700 flex items-center justify-center shadow-md">
              <School className="w-6 h-6" />
            </div>
            <div>
              <span className="font-display font-bold text-2xl tracking-tight text-white block">
                SchoolERP
              </span>
              <span className="text-xs text-blue-200">
                School Management System
              </span>
            </div>
          </div>
        </div>

        <div className="my-12 lg:my-auto relative z-10 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/60 border border-blue-400/30 text-xs font-semibold text-blue-100 mb-6">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Administrative Console • Academic Year 2026–27</span>
          </div>

          <h2 className="font-display font-bold text-3xl sm:text-4xl text-white tracking-tight leading-tight mb-4">
            Simplicity and clarity for your school operations.
          </h2>

          <p className="text-blue-100 text-sm sm:text-base leading-relaxed mb-8">
            Manage student records, parent contacts, daily attendance, class fee schedules,
            and instant receipting from one clean, unified dashboard.
          </p>

          {/* Value Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-blue-100">
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-blue-800/40 border border-blue-600/40">
              <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
              <span>Accurate Fee Ledger & Dues</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-blue-800/40 border border-blue-600/40">
              <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
              <span>1-Click Daily Attendance</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-blue-800/40 border border-blue-600/40">
              <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
              <span>Parent Contact Lineage</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-blue-800/40 border border-blue-600/40">
              <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
              <span>Printable Receipts & Reports</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-blue-200">
          &copy; {new Date().getFullYear()} SchoolERP. Built for small & mid-size schools.
        </div>
      </div>

      {/* Right side: Login Form */}
      <div className="lg:w-1/2 p-8 sm:p-12 lg:p-16 flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 tracking-tight">
              Welcome Back
            </h1>
            <p className="text-sm text-slate-500 mt-1.5">
              Sign in with your administrator credentials to access your school dashboard.
            </p>
          </div>

          {/* Global Error Banner */}
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Admin Email <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@school.edu.in"
                  className={`w-full pl-9 pr-4 py-2.5 bg-white border rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
                    fieldErrors.email
                      ? 'border-rose-300 focus:ring-rose-500/20 focus:border-rose-500'
                      : 'border-slate-200 focus:ring-blue-500/20 focus:border-blue-500'
                  }`}
                />
              </div>
              {fieldErrors.email && (
                <p className="text-xs text-rose-600 mt-1 font-medium">{fieldErrors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Password <span className="text-rose-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() =>
                    alert('Password recovery: Contact system supervisor or use demo credentials.')
                  }
                  className="text-xs font-medium text-blue-600 hover:text-blue-700"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full pl-9 pr-10 py-2.5 bg-white border rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
                    fieldErrors.password
                      ? 'border-rose-300 focus:ring-rose-500/20 focus:border-rose-500'
                      : 'border-slate-200 focus:ring-blue-500/20 focus:border-blue-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="text-xs text-rose-600 mt-1 font-medium">{fieldErrors.password}</p>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                />
                <span className="text-xs font-medium text-slate-600">Remember me on this device</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-60 text-white rounded-xl text-sm font-semibold shadow-xs flex items-center justify-center gap-2 transition-all"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In as Admin</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Box */}
          <div className="mt-8 p-4 rounded-xl bg-blue-50/70 border border-blue-100 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-blue-900">Prototype Demo Credentials</p>
              <p className="text-[11px] text-blue-700 font-mono mt-0.5">
                admin@oakridgevidyalaya.edu.in / admin123
              </p>
            </div>
            <button
              type="button"
              onClick={handleFillDemo}
              className="px-2.5 py-1 bg-white hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold border border-blue-200 shadow-2xs transition-colors shrink-0"
            >
              Auto Fill
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
