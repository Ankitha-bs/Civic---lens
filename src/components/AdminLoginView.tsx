import { useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  KeyRound,
  Lock,
  ShieldCheck,
  Users,
} from 'lucide-react';
import type { AdminUser } from '../types/civic';
import { authenticateMockAdmin, DEMO_ADMIN_CREDENTIALS } from '../utils/auth';

interface AdminLoginViewProps {
  onLoginSuccess: (user: AdminUser) => void;
  onBackToSelection: () => void;
  onSwitchToCitizen: () => void;
}

export function AdminLoginView({
  onLoginSuccess,
  onBackToSelection,
  onSwitchToCitizen,
}: AdminLoginViewProps) {
  const [officerId, setOfficerId] = useState('');
  const [passcode, setPasscode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = authenticateMockAdmin(officerId, passcode);
    if (!result.ok) {
      setErrorMessage(result.error);
      return;
    }
    setErrorMessage('');
    onLoginSuccess(result.user);
  };

  const handleFillDemo = (index: number) => {
    const demo = DEMO_ADMIN_CREDENTIALS[index] ?? DEMO_ADMIN_CREDENTIALS[0];
    setOfficerId(demo.officerId);
    setPasscode(demo.passcode);
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Top Bar */}
      <header className="bg-navy-900 text-white border-b border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
          <button
            type="button"
            onClick={onBackToSelection}
            className="text-lg font-display font-bold tracking-tight text-white hover:text-teal-300 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            CivicLens
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onSwitchToCitizen}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 hover:text-white border border-navy-700 hover:border-slate-500 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
            >
              <Users className="w-3.5 h-3.5 text-teal-300" aria-hidden="true" />
              <span>Switch to Citizen Portal</span>
            </button>
            <button
              type="button"
              onClick={onBackToSelection}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-navy-800 hover:bg-navy-700 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
            >
              <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Back to Portal Selection</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Panel: Municipal Authority Info & Demo Credentials */}
          <div className="lg:col-span-6 bg-navy-900 text-white rounded-xl p-7 sm:p-8 flex flex-col justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-medium text-teal-300">
                <ShieldCheck className="w-4 h-4" aria-hidden="true" />
                <span>Municipal Admin Portal · Shivamogga City Corporation</span>
              </div>

              <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Municipal Authority Sign-In
              </h1>

              <p className="text-sm text-slate-300 leading-relaxed">
                Access the dedicated municipal console to inspect citizen complaint photos, review
                AI triage severity and department recommendations, assign work orders, and view
                department-wise resolution reports.
              </p>
            </div>

            <div className="bg-navy-950 border border-navy-800 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-semibold text-teal-300 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Mock Demo Credentials</span>
                </p>
                <span className="text-xs text-slate-400">No real account needed</span>
              </div>

              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex items-center justify-between gap-2 py-1.5 border-b border-navy-800">
                  <span>Officer ID:</span>
                  <span className="font-mono text-white font-semibold">
                    {DEMO_ADMIN_CREDENTIALS[0].officerId}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2 py-1.5">
                  <span>Passcode:</span>
                  <span className="font-mono text-white font-semibold">
                    {DEMO_ADMIN_CREDENTIALS[0].passcode}
                  </span>
                </div>
              </div>

              <button
                type="button"
                data-testid="fill-demo-credentials-btn"
                onClick={() => handleFillDemo(0)}
                className="w-full px-4 py-2 text-xs font-semibold text-navy-950 bg-teal-400 hover:bg-teal-300 rounded-lg transition-colors cursor-pointer"
              >
                Fill Demo Credentials
              </button>
            </div>
          </div>

          {/* Right Panel: Login Form */}
          <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-7 sm:p-8 flex flex-col justify-center">
            <div className="mb-6 space-y-1">
              <div className="flex items-center gap-2 text-navy-900">
                <Lock className="w-4 h-4 text-teal-700" aria-hidden="true" />
                <h2 className="font-display text-xl font-bold">Officer Authentication</h2>
              </div>
              <p className="text-xs text-slate-500">
                Enter your municipal officer ID or email and access passcode to continue.
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              {errorMessage && (
                <div
                  role="alert"
                  className="flex items-start gap-2.5 p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm"
                >
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" aria-hidden="true" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label
                  htmlFor="admin-officer-id"
                  className="block text-sm font-semibold text-navy-900"
                >
                  Officer ID or Municipal Email
                </label>
                <input
                  id="admin-officer-id"
                  type="text"
                  autoComplete="username"
                  value={officerId}
                  onChange={(e) => setOfficerId(e.target.value)}
                  placeholder="e.g. SMC-ADMIN-01"
                  className="w-full px-3.5 py-2.5 text-sm text-navy-900 bg-white border border-slate-300 rounded-lg placeholder:text-slate-400 focus:outline-none focus:border-teal-600"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="admin-passcode"
                  className="block text-sm font-semibold text-navy-900"
                >
                  Access Passcode
                </label>
                <input
                  id="admin-passcode"
                  type="password"
                  autoComplete="current-password"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Enter demo passcode"
                  className="w-full px-3.5 py-2.5 text-sm text-navy-900 bg-white border border-slate-300 rounded-lg placeholder:text-slate-400 focus:outline-none focus:border-teal-600"
                />
              </div>

              <button
                type="submit"
                data-testid="admin-login-submit"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-navy-900 hover:bg-navy-800 rounded-lg transition-colors cursor-pointer"
              >
                <span>Sign In to Admin Portal</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
