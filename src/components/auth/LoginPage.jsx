import React, { useState } from 'react';
import { 
  Building2, 
  Home, 
  Users, 
  ClipboardList, 
  BarChart2, 
  User, 
  Lock, 
  Eye, 
  EyeOff, 
  LogIn, 
  Building, 
  HardHat, 
  Shield, 
  Check, 
  ArrowRight,
  X,
  TrendingUp,
  ShieldCheck,
  ArrowLeft,
  UserPlus,
  Star,
  Calendar
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import confetti from 'canvas-confetti';
import buildHubBrandHeaderImg from '../../assets/buildhub-brand-hires-trans.png';
import customerLoginIconImg from '../../assets/customer-login-icon.png';
import loginBuildingImg from '../../assets/login-building.png';

export default function LoginPage() {
  const { 
    authStep, 
    setAuthStep, 
    loginAsRole, 
    registerUser,
    loginWithGoogle,
    loginWithMicrosoft
  } = useApp();

  // Form states
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  // Status feedback states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');

  // Customer Registration Form (Clean initial state for real user data)
  const [custReg, setCustReg] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    address: '',
    city: ''
  });

  // Builder Registration Form (Full profile fields for real Firestore storage)
  const [builderReg, setBuilderReg] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    specialization: 'Residential Construction',
    experience: 5,
    location: '',
    licenseNo: '',
    password: '',
    confirmPassword: ''
  });

  const handleSelectRole = (roleKey) => {
    setEmailOrUsername('');
    setPassword('');
    setAuthError('');
    setAuthSuccess('');
    if (roleKey === 'admin') {
      setAuthStep('login-admin');
    } else if (roleKey === 'builder') {
      setAuthStep('login-builder');
    } else if (roleKey === 'customer') {
      setAuthStep('login-customer');
    }
  };

  const handleLoginSubmit = async (roleName) => {
    setAuthError('');
    setAuthSuccess('');
    setIsSubmitting(true);
    try {
      await loginAsRole(roleName, {
        email: emailOrUsername,
        password: password
      });
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (err) {
      console.error('Login submit error:', err);
      setAuthError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCustomerRegisterSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');

    if (custReg.password !== custReg.confirmPassword) {
      setAuthError('Passwords do not match. Please verify and try again.');
      return;
    }
    if (custReg.password.length < 6) {
      setAuthError('Password must be at least 6 characters long.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await registerUser(custReg.email, custReg.password, {
        role: 'customer',
        fullName: custReg.fullName,
        name: custReg.fullName,
        phone: custReg.phone,
        city: custReg.city,
        address: custReg.address
      });

      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.5 }
      });

      setAuthSuccess('Account registered successfully! Redirecting...');
      setTimeout(() => {
        loginAsRole('Customer', {
          uid: res?.user?.uid,
          firebaseUid: res?.user?.uid,
          name: custReg.fullName,
          email: custReg.email,
          phone: custReg.phone,
          city: custReg.city,
          address: custReg.address
        });
      }, 700);
    } catch (err) {
      console.error('Customer registration error:', err);
      let msg = err.message || 'Failed to create customer account.';
      if (err.code === 'auth/email-already-in-use') {
        msg = 'This email address is already in use. Please log in instead.';
      } else if (err.code === 'auth/invalid-email') {
        msg = 'Please enter a valid email address.';
      } else if (err.code === 'auth/weak-password') {
        msg = 'Password is too weak. Please use at least 6 characters.';
      }
      setAuthError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBuilderRegisterSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');

    if (builderReg.password !== builderReg.confirmPassword) {
      setAuthError('Passwords do not match. Please verify and try again.');
      return;
    }
    if (builderReg.password.length < 6) {
      setAuthError('Password must be at least 6 characters long.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await registerUser(builderReg.email, builderReg.password, {
        role: 'builder',
        fullName: builderReg.name,
        name: builderReg.name,
        companyName: builderReg.company,
        company: builderReg.company,
        phone: builderReg.phone,
        specialization: builderReg.specialization,
        experience: Number(builderReg.experience) || 0,
        location: builderReg.location,
        city: builderReg.location,
        licenseNo: builderReg.licenseNo
      });

      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.5 }
      });

      setAuthSuccess('Registration submitted successfully! Your account is pending Admin verification.');
      setTimeout(() => {
        loginAsRole('Builder', {
          uid: res?.user?.uid,
          firebaseUid: res?.user?.uid,
          name: builderReg.name,
          company: builderReg.company,
          email: builderReg.email,
          phone: builderReg.phone,
          specialization: builderReg.specialization,
          experience: Number(builderReg.experience) || 0,
          location: builderReg.location,
          licenseNo: builderReg.licenseNo,
          verificationStatus: 'pending',
          accountStatus: 'pending'
        });
      }, 700);
    } catch (err) {
      console.error('Builder registration error:', err);
      let msg = err.message || 'Failed to complete builder registration.';
      if (err.code === 'auth/email-already-in-use') {
        msg = 'This official email is already registered. Please log in instead.';
      } else if (err.code === 'auth/invalid-email') {
        msg = 'Please enter a valid official email address.';
      } else if (err.code === 'auth/weak-password') {
        msg = 'Password is too weak. Please use at least 6 characters.';
      }
      setAuthError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // =========================================================================
  // VIEW 1: MASTER ROLE SELECTION PAGE (Matches Row 1 in Image)
  // =========================================================================
  if (authStep === 'role-selection') {
    return (
      <div className="min-h-screen bg-[#F4F7FE] flex flex-col justify-between font-['Plus_Jakarta_Sans',sans-serif] relative overflow-hidden">
        
        {/* Top Navbar */}
        <header className="h-16 px-6 sm:px-12 bg-[#071739] text-white flex items-center justify-between shadow-md z-10">
          <div className="flex items-center">
            <img
              src={buildHubBrandHeaderImg}
              alt="Build Hub - Smart Construction"
              className="h-10 w-auto object-contain"
            />
          </div>

          <div className="p-2 rounded-xl bg-white/10 text-gray-300">
            <Home size={18} />
          </div>
        </header>

        {/* Blueprint watermark background */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none flex items-center justify-center">
          <Building2 size={600} />
        </div>

        {/* Center Selection Section */}
        <main className="flex-1 flex flex-col items-center justify-center px-4 py-10 z-10 max-w-6xl mx-auto w-full">
          
          {/* Main Titles */}
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1A30] tracking-tight">
              Welcome to Build Hub
            </h2>
            <p className="text-sm sm:text-base text-gray-500 font-medium mt-1.5">
              Smart Construction Management Platform
            </p>
            <div className="inline-flex items-center gap-2 mt-4 px-4 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-bold">
              <span>Select Your Role</span>
            </div>
          </div>

          {/* 3 Role Selection Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
            
            {/* Card 1: ADMINISTRATOR */}
            <div 
              onClick={() => handleSelectRole('admin')}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-200/90 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group cursor-pointer"
            >
              <div>
                <div className="w-16 h-16 rounded-2xl bg-[#EBF3FF] text-[#1E60FF] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-xs">
                  <Shield size={32} className="stroke-[2.2]" />
                </div>
                <h3 className="text-xl font-bold text-[#0B1A30]">Administrator</h3>
                <p className="text-xs sm:text-sm text-gray-500 font-medium mt-2 leading-relaxed">
                  Manage the entire construction management platform, oversee all builders, projects and analytics.
                </p>
              </div>

              <button
                onClick={(e) => { e.stopPropagation(); handleSelectRole('admin'); }}
                className="mt-6 w-full py-3 px-4 bg-[#092257] hover:bg-[#07183d] text-white font-bold rounded-xl text-xs sm:text-sm transition-all shadow-md shadow-blue-900/20 flex items-center justify-center gap-2 cursor-pointer group-hover:bg-[#1E60FF]"
              >
                <span>Continue as Administrator</span>
                <ArrowRight size={16} />
              </button>
            </div>

            {/* Card 2: BUILDER */}
            <div 
              onClick={() => handleSelectRole('builder')}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-200/90 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group cursor-pointer"
            >
              <div>
                <div className="w-16 h-16 rounded-2xl bg-[#E8F8F0] text-[#10B981] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-xs">
                  <HardHat size={32} className="stroke-[2.2]" />
                </div>
                <h3 className="text-xl font-bold text-[#0B1A30]">Builder</h3>
                <p className="text-xs sm:text-sm text-gray-500 font-medium mt-2 leading-relaxed">
                  Manage customers, projects, construction progress, milestones and site workforce.
                </p>
              </div>

              <button
                onClick={(e) => { e.stopPropagation(); handleSelectRole('builder'); }}
                className="mt-6 w-full py-3 px-4 bg-[#092257] hover:bg-[#07183d] text-white font-bold rounded-xl text-xs sm:text-sm transition-all shadow-md shadow-blue-900/20 flex items-center justify-center gap-2 cursor-pointer group-hover:bg-[#10B981]"
              >
                <span>Continue as Builder</span>
                <ArrowRight size={16} />
              </button>
            </div>

            {/* Card 3: CUSTOMER */}
            <div 
              onClick={() => handleSelectRole('customer')}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-200/90 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group cursor-pointer"
            >
              <div>
                <div className="w-16 h-16 rounded-2xl bg-[#F3E8FF] text-[#8B5CF6] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-xs">
                  <Home size={32} className="stroke-[2.2]" />
                </div>
                <h3 className="text-xl font-bold text-[#0B1A30]">Customer</h3>
                <p className="text-xs sm:text-sm text-gray-500 font-medium mt-2 leading-relaxed">
                  Track your construction project, view live progress, inspect documents and chat with your builder.
                </p>
              </div>

              <button
                onClick={(e) => { e.stopPropagation(); handleSelectRole('customer'); }}
                className="mt-6 w-full py-3 px-4 bg-[#092257] hover:bg-[#07183d] text-white font-bold rounded-xl text-xs sm:text-sm transition-all shadow-md shadow-blue-900/20 flex items-center justify-center gap-2 cursor-pointer group-hover:bg-[#8B5CF6]"
              >
                <span>Continue as Customer</span>
                <ArrowRight size={16} />
              </button>
            </div>

          </div>
        </main>

        {/* Footer */}
        <footer className="py-4 text-center text-xs text-gray-400 z-10 border-t border-gray-200/60 bg-white/50 backdrop-blur-xs">
          Build Hub © 2026 Smart Construction Management Platform • Multi-Role Ecosystem
        </footer>
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: CUSTOMER LOGIN PAGE — Premium Redesigned UI
  // =========================================================================
  if (authStep === 'login-customer') {
    return (
      <div className="min-h-screen bg-[#F0F0F5] flex items-center justify-center p-3 sm:p-6 font-['Plus_Jakarta_Sans',sans-serif]">
        <div className="w-full max-w-[1080px] bg-white rounded-[28px] shadow-[0_20px_60px_rgba(0,0,0,0.12)] overflow-hidden grid grid-cols-1 lg:grid-cols-2 min-h-[660px] border border-gray-100">

          {/* ====== LEFT: Dark Navy Branding Panel ====== */}
          <div className="bg-gradient-to-b from-[#0A1E42] via-[#081A3D] to-[#051230] text-white p-8 sm:p-10 pb-0 flex flex-col justify-between relative overflow-hidden">

            {/* Background decorative elements */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-purple-600/8 to-transparent rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-40 left-0 w-48 h-48 bg-gradient-to-tr from-blue-500/6 to-transparent rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10">
              {/* Build Hub Official Brand Logo matching reference */}
              <div className="flex items-center mb-8">
                <img
                  src={buildHubBrandHeaderImg}
                  alt="Build Hub - Smart Construction"
                  className="h-12 w-auto object-contain drop-shadow-lg"
                />
              </div>

              {/* Main Heading */}
              <h2 className="text-[32px] sm:text-[38px] font-extrabold tracking-tight leading-[1.15] text-white">
                Your Dream Home.{' '}
                <br />
                Built With{' '}
                <span className="bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] bg-clip-text text-transparent">
                  Trust.
                </span>
              </h2>

              {/* Description */}
              <p className="text-[13px] sm:text-sm text-gray-300/90 mt-4 leading-relaxed max-w-[340px]">
                Connect with builders, track progress, manage requests and more – all in one place.
              </p>

              {/* 4 Feature Items */}
              <div className="mt-8 space-y-4">
                {[
                  { icon: Home, label: 'Request Services' },
                  { icon: Calendar, label: 'Track Project Progress' },
                  { icon: ShieldCheck, label: 'Secure & Transparent' },
                  { icon: Star, label: 'Rate & Review' }
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6415C5]/40 to-[#A855F7]/30 border border-purple-400/30 flex items-center justify-center text-[#C084FC] shrink-0 shadow-sm">
                      <Icon size={18} className="stroke-[2.2]" />
                    </div>
                    <span className="text-sm font-semibold text-gray-100">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Building Image — Exact Luxury Villa from Reference */}
            <div className="relative mt-6 -mx-8 sm:-mx-10 overflow-hidden">
              <img
                src={loginBuildingImg}
                alt="Build Hub Premium Modern Villa Architecture"
                className="w-full h-auto object-cover block"
              />
            </div>
          </div>

          {/* ====== RIGHT: Clean White Login Form Panel ====== */}
          <div className="bg-white p-7 sm:p-10 lg:p-12 flex flex-col justify-center relative overflow-hidden">

            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-28 h-28 bg-purple-100/50 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-20 h-20 bg-purple-50/60 rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />
            <div className="absolute top-16 right-8 w-8 h-8 bg-purple-100/40 rounded-full pointer-events-none" />

            <div className="max-w-[400px] mx-auto w-full relative z-10">
              
              {/* Top Icon + Header */}
              <div className="flex flex-col items-center text-center mb-7">
                <img
                  src={customerLoginIconImg}
                  alt="Customer Login"
                  className="w-18 h-18 object-contain mb-3 drop-shadow-sm rounded-2xl"
                />

                <h3 className="text-[26px] sm:text-[30px] font-extrabold text-[#0B1A30] tracking-tight leading-tight">
                  Customer{' '}
                  <span className="text-[#6415C5]">Login</span>
                </h3>
                <p className="text-sm text-gray-500 font-medium mt-1.5">
                  Track Your Project. Stay Connected.
                </p>
              </div>

              {/* Error / Success Messages */}
              {authError && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
                  <X size={15} className="text-red-500 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}
              {authSuccess && (
                <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-2">
                  <Check size={15} className="text-emerald-500 shrink-0" />
                  <span>{authSuccess}</span>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={(e) => { e.preventDefault(); handleLoginSubmit('Customer'); }} className="space-y-4">
                {/* Email / Username */}
                <div className="relative">
                  <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={emailOrUsername}
                    onChange={(e) => setEmailOrUsername(e.target.value)}
                    placeholder="Email / Username"
                    className="w-full bg-white border border-gray-200 hover:border-gray-300 focus:border-[#6415C5] rounded-xl pl-12 pr-4 py-3.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-100 transition-all duration-200"
                  />
                </div>

                {/* Password */}
                <div className="relative">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full bg-white border border-gray-200 hover:border-gray-300 focus:border-[#6415C5] rounded-xl pl-12 pr-12 py-3.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-100 transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {/* Forgot Password */}
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => alert('Demo Customer account: ramesh.kumar@buildhub.io')}
                    className="text-sm font-bold text-[#6415C5] hover:text-[#A855F7] hover:underline cursor-pointer transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>

                {/* Login Button — Purple-to-Blue Gradient */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-[#6415C5] to-[#4F46E5] hover:from-[#7C3AED] hover:to-[#6366F1] disabled:opacity-60 text-white font-bold rounded-xl text-[15px] transition-all duration-300 shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 flex items-center justify-center gap-2.5 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <LogIn size={19} className="stroke-[2.5]" />
                      <span>Login</span>
                    </>
                  )}
                </button>
              </form>

              {/* ── Or continue with ── */}
              <div className="relative flex items-center justify-center my-5">
                <div className="w-full border-t border-gray-200/80" />
                <span className="bg-white px-4 text-xs font-semibold text-gray-400 shrink-0 whitespace-nowrap">
                  Or continue with
                </span>
                <div className="w-full border-t border-gray-200/80" />
              </div>

              {/* Social Login Buttons */}
              <div className="grid grid-cols-2 gap-3">
                {/* Google Login */}
                <button
                  type="button"
                  onClick={async () => {
                    setAuthError('');
                    setIsSubmitting(true);
                    try {
                      await loginWithGoogle('customer');
                      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
                    } catch (err) {
                      console.error('Google login error:', err);
                      if (err.code === 'auth/popup-closed-by-user') {
                        // User closed popup, no error needed
                      } else if (err.code === 'auth/unauthorized-domain') {
                        setAuthError('Google Sign-In is not enabled for this domain. Please contact the administrator.');
                      } else {
                        setAuthError(err.message || 'Google Sign-In failed. Please try again.');
                      }
                    } finally {
                      setIsSubmitting(false);
                    }
                  }}
                  disabled={isSubmitting}
                  className="flex items-center justify-center gap-2.5 py-3 px-3 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 rounded-xl text-sm font-semibold text-gray-700 transition-all duration-200 cursor-pointer disabled:opacity-50 hover:shadow-sm"
                >
                  {/* Official Google G Icon */}
                  <svg width="18" height="18" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                  </svg>
                  <span className="hidden sm:inline">Continue with Google</span>
                  <span className="sm:hidden">Google</span>
                </button>

                {/* Microsoft Login */}
                <button
                  type="button"
                  onClick={async () => {
                    setAuthError('');
                    setIsSubmitting(true);
                    try {
                      await loginWithMicrosoft('customer');
                      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
                    } catch (err) {
                      console.error('Microsoft login error:', err);
                      if (err.code === 'auth/popup-closed-by-user') {
                        // User closed popup, no error needed
                      } else if (err.code === 'auth/unauthorized-domain') {
                        setAuthError('Microsoft Sign-In is not enabled for this domain. Please contact the administrator.');
                      } else {
                        setAuthError(err.message || 'Microsoft Sign-In failed. Please try again.');
                      }
                    } finally {
                      setIsSubmitting(false);
                    }
                  }}
                  disabled={isSubmitting}
                  className="flex items-center justify-center gap-2.5 py-3 px-3 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 rounded-xl text-sm font-semibold text-gray-700 transition-all duration-200 cursor-pointer disabled:opacity-50 hover:shadow-sm"
                >
                  {/* Official Microsoft Logo */}
                  <svg width="18" height="18" viewBox="0 0 21 21">
                    <rect x="1" y="1" width="9" height="9" fill="#F25022"/>
                    <rect x="11" y="1" width="9" height="9" fill="#7FBA00"/>
                    <rect x="1" y="11" width="9" height="9" fill="#00A4EF"/>
                    <rect x="11" y="11" width="9" height="9" fill="#FFB900"/>
                  </svg>
                  <span className="hidden sm:inline">Continue with Microsoft</span>
                  <span className="sm:hidden">Microsoft</span>
                </button>
              </div>

              {/* ── Or Sign Up Using ── */}
              <div className="relative flex items-center justify-center my-5">
                <div className="w-full border-t border-gray-200/80" />
                <span className="bg-white px-4 text-xs font-semibold text-gray-400 shrink-0 whitespace-nowrap">
                  Or Sign Up Using
                </span>
                <div className="w-full border-t border-gray-200/80" />
              </div>

              {/* Register as Customer Button */}
              <button
                type="button"
                onClick={() => setAuthStep('register-customer')}
                className="w-full py-3.5 px-4 bg-[#F3E8FF] hover:bg-[#EDE0FF] text-[#6415C5] font-bold rounded-xl text-sm transition-all duration-200 flex items-center justify-center gap-2.5 cursor-pointer border border-[#E2D0FA] hover:border-[#C4B0F0] hover:shadow-sm transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <UserPlus size={18} className="stroke-[2.2]" />
                <span>Register as Customer</span>
              </button>

              {/* Direct Switch to Builder Login */}
              <div className="mt-4 pt-3 border-t border-gray-100 text-center text-xs text-gray-500 flex items-center justify-center gap-1.5">
                <span>Are you a Builder / Contractor?</span>
                <button
                  type="button"
                  onClick={() => handleSelectRole('builder')}
                  className="font-bold text-[#6415C5] hover:underline cursor-pointer"
                >
                  Login as Builder →
                </button>
              </div>

              {/* Back to Home */}
              <button
                type="button"
                onClick={() => setAuthStep('role-selection')}
                className="w-full mt-3 text-center text-sm font-bold text-gray-500 hover:text-[#6415C5] transition-colors duration-200 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft size={15} />
                <span>Back to Home</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 3: CUSTOMER REGISTRATION PAGE
  // =========================================================================
  if (authStep === 'register-customer') {
    return (
      <div className="min-h-screen bg-[#EEF2F6] flex items-center justify-center p-3 sm:p-6 font-['Plus_Jakarta_Sans',sans-serif]">
        <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200/80">
          
          <div className="p-6 bg-gradient-to-r from-[#081734] to-[#152e60] text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400">
                <Home size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg">Create Your Customer Account</h3>
                <p className="text-xs text-gray-300">Join Build Hub to track your ongoing construction project.</p>
              </div>
            </div>
          </div>

          {authError && (
            <div className="mx-6 mt-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
              <X size={16} className="text-red-500 shrink-0" />
              <span>{authError}</span>
            </div>
          )}
          {authSuccess && (
            <div className="mx-6 mt-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-2">
              <Check size={16} className="text-emerald-500 shrink-0" />
              <span>{authSuccess}</span>
            </div>
          )}

          <form onSubmit={handleCustomerRegisterSubmit} className="p-6 sm:p-8 space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Full Name</label>
              <input
                type="text"
                required
                value={custReg.fullName}
                onChange={(e) => setCustReg({ ...custReg, fullName: e.target.value })}
                className="w-full bg-[#F4F7FE] border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-purple-600 font-medium"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={custReg.email}
                  onChange={(e) => setCustReg({ ...custReg, email: e.target.value })}
                  className="w-full bg-[#F4F7FE] border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-purple-600 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Phone Number</label>
                <input
                  type="text"
                  required
                  value={custReg.phone}
                  onChange={(e) => setCustReg({ ...custReg, phone: e.target.value })}
                  className="w-full bg-[#F4F7FE] border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-purple-600 font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Password</label>
                <input
                  type="password"
                  required
                  placeholder="At least 6 characters"
                  value={custReg.password}
                  onChange={(e) => setCustReg({ ...custReg, password: e.target.value })}
                  className="w-full bg-[#F4F7FE] border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-purple-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Confirm Password</label>
                <input
                  type="password"
                  required
                  placeholder="Repeat password"
                  value={custReg.confirmPassword}
                  onChange={(e) => setCustReg({ ...custReg, confirmPassword: e.target.value })}
                  className="w-full bg-[#F4F7FE] border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-purple-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Address / Site Location</label>
                <input
                  type="text"
                  required
                  value={custReg.address}
                  onChange={(e) => setCustReg({ ...custReg, address: e.target.value })}
                  className="w-full bg-[#F4F7FE] border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-purple-600 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">City</label>
                <input
                  type="text"
                  required
                  value={custReg.city}
                  onChange={(e) => setCustReg({ ...custReg, city: e.target.value })}
                  className="w-full bg-[#F4F7FE] border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-purple-600 font-medium"
                />
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => {
                  setAuthError('');
                  setAuthSuccess('');
                  setAuthStep('login-customer');
                }}
                className="text-xs font-bold text-purple-600 hover:underline cursor-pointer"
              >
                Already have an account? Login
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-6 py-3 bg-[#092257] hover:bg-[#07183d] disabled:opacity-60 text-white font-bold rounded-xl text-xs sm:text-sm transition shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span>Registering...</span>
                ) : (
                  <>
                    <Check size={16} />
                    <span>Create Customer Account</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 4: BUILDER LOGIN PAGE (Matches Row 2 Card 2 in Image)
  // =========================================================================
  if (authStep === 'login-builder') {
    return (
      <div className="min-h-screen bg-[#EEF2F6] flex items-center justify-center p-3 sm:p-6 font-['Plus_Jakarta_Sans',sans-serif]">
        <div className="w-full max-w-[1020px] bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[600px] border border-gray-200/80">
          
          {/* Left Dark Blue Panel with Crane */}
          <div className="lg:col-span-5 bg-gradient-to-b from-[#081734] via-[#071938] to-[#041026] text-white p-7 sm:p-9 flex flex-col justify-between relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center mb-7">
                <img
                  src={buildHubBrandHeaderImg}
                  alt="Build Hub - Smart Construction"
                  className="h-10 w-auto object-contain"
                />
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight text-white">
                Build Smarter. <br />
                <span className="text-[#F59E0B]">Manage Better.</span>
              </h2>

              <p className="text-xs sm:text-sm text-gray-300/90 mt-3 leading-relaxed">
                A centralized platform for builders, workers, customers and projects – all in one place.
              </p>

              <div className="mt-7 space-y-3.5">
                <div className="flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-full bg-[#11274F] border border-[#1E3E7B] flex items-center justify-center text-[#F59E0B] shrink-0">
                    <Home size={18} />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-gray-200">
                    Manage Projects Efficiently
                  </span>
                </div>
                <div className="flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-full bg-[#11274F] border border-[#1E3E7B] flex items-center justify-center text-[#F59E0B] shrink-0">
                    <Users size={18} />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-gray-200">
                    Coordinate with Clients & Workers
                  </span>
                </div>
                <div className="flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-full bg-[#11274F] border border-[#1E3E7B] flex items-center justify-center text-[#F59E0B] shrink-0">
                    <ClipboardList size={18} />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-gray-200">
                    Track Progress & Resources
                  </span>
                </div>
                <div className="flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-full bg-[#11274F] border border-[#1E3E7B] flex items-center justify-center text-[#F59E0B] shrink-0">
                    <BarChart2 size={18} />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-gray-200">
                    Get Real-Time Insights
                  </span>
                </div>
              </div>
            </div>

            <div className="relative z-10 pt-4 mt-6 border-t border-[#132A55] flex items-center justify-between text-xs text-gray-400">
              <span>Portal:</span>
              <span className="font-bold text-amber-300 bg-amber-900/30 px-2.5 py-1 rounded-lg border border-amber-500/30">
                🏗️ Builder Portal
              </span>
            </div>
          </div>

          {/* Right White Form Card */}
          <div className="lg:col-span-7 bg-white p-7 sm:p-12 flex flex-col justify-center">
            <div className="max-w-md mx-auto w-full">
              
              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-18 h-18 rounded-full bg-[#EBF3FF] flex items-center justify-center text-[#1E3A8A] mb-3.5 shadow-sm ring-4 ring-blue-50">
                  <HardHat size={36} className="stroke-[2.1] text-[#1E3A8A]" />
                </div>

                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0B1A30] tracking-tight">
                  Builder Login
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
                  Access Your Builder Dashboard
                </p>
              </div>

              {/* Error / Success Messages */}
              {authError && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
                  <X size={15} className="text-red-500 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}
              {authSuccess && (
                <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-2">
                  <Check size={15} className="text-emerald-500 shrink-0" />
                  <span>{authSuccess}</span>
                </div>
              )}

              <form onSubmit={(e) => { e.preventDefault(); handleLoginSubmit('Builder'); }} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
                    <User size={14} className="text-gray-500" />
                    <span>Email / Username</span>
                  </label>
                  <div className="relative">
                    <User size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      required
                      value={emailOrUsername}
                      onChange={(e) => setEmailOrUsername(e.target.value)}
                      placeholder="Enter your email or username"
                      className="w-full bg-white border border-gray-200 hover:border-gray-300 focus:border-[#1E3A8A] rounded-xl pl-10 pr-4 py-3 text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
                    <Lock size={14} className="text-gray-500" />
                    <span>Password</span>
                  </label>
                  <div className="relative">
                    <Lock size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full bg-white border border-gray-200 hover:border-gray-300 focus:border-[#1E3A8A] rounded-xl pl-10 pr-10 py-3 text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition cursor-pointer"
                    >
                      {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-0.5">
                  <label className="flex items-center gap-2 text-gray-600 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="font-semibold">Remember Me</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => alert('Demo Builder account: contact@techbuilders.com')}
                    className="font-bold text-blue-600 hover:underline cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-4 bg-[#092257] hover:bg-[#07183d] text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-blue-900/20 flex items-center justify-center gap-2 cursor-pointer mt-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <LogIn size={18} />
                      <span>Login as Builder</span>
                    </>
                  )}
                </button>
              </form>

              {/* ── Or continue with ── */}
              <div className="relative flex items-center justify-center my-5">
                <div className="w-full border-t border-gray-200/80" />
                <span className="bg-white px-4 text-xs font-semibold text-gray-400 shrink-0 whitespace-nowrap">
                  Or continue with
                </span>
                <div className="w-full border-t border-gray-200/80" />
              </div>

              {/* Social Login Buttons */}
              <div className="grid grid-cols-2 gap-3">
                {/* Google Login */}
                <button
                  type="button"
                  onClick={async () => {
                    setAuthError('');
                    setIsSubmitting(true);
                    try {
                      await loginWithGoogle('builder');
                      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
                    } catch (err) {
                      console.error('Google login error:', err);
                      if (err.code === 'auth/popup-closed-by-user') {
                        // User closed popup, no error needed
                      } else if (err.code === 'auth/unauthorized-domain') {
                        setAuthError('Google Sign-In is not enabled for this domain. Please contact the administrator.');
                      } else {
                        setAuthError(err.message || 'Google Sign-In failed. Please try again.');
                      }
                    } finally {
                      setIsSubmitting(false);
                    }
                  }}
                  disabled={isSubmitting}
                  className="flex items-center justify-center gap-2.5 py-3 px-3 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 rounded-xl text-sm font-semibold text-gray-700 transition-all duration-200 cursor-pointer disabled:opacity-50 hover:shadow-sm"
                >
                  {/* Official Google G Icon */}
                  <svg width="18" height="18" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                  </svg>
                  <span className="hidden sm:inline">Continue with Google</span>
                  <span className="sm:hidden">Google</span>
                </button>

                {/* Microsoft Login */}
                <button
                  type="button"
                  onClick={async () => {
                    setAuthError('');
                    setIsSubmitting(true);
                    try {
                      await loginWithMicrosoft('builder');
                      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
                    } catch (err) {
                      console.error('Microsoft login error:', err);
                      if (err.code === 'auth/popup-closed-by-user') {
                        // User closed popup, no error needed
                      } else if (err.code === 'auth/unauthorized-domain') {
                        setAuthError('Microsoft Sign-In is not enabled for this domain. Please contact the administrator.');
                      } else {
                        setAuthError(err.message || 'Microsoft Sign-In failed. Please try again.');
                      }
                    } finally {
                      setIsSubmitting(false);
                    }
                  }}
                  disabled={isSubmitting}
                  className="flex items-center justify-center gap-2.5 py-3 px-3 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 rounded-xl text-sm font-semibold text-gray-700 transition-all duration-200 cursor-pointer disabled:opacity-50 hover:shadow-sm"
                >
                  {/* Official Microsoft Logo */}
                  <svg width="18" height="18" viewBox="0 0 21 21">
                    <rect x="1" y="1" width="9" height="9" fill="#F25022"/>
                    <rect x="11" y="1" width="9" height="9" fill="#7FBA00"/>
                    <rect x="1" y="11" width="9" height="9" fill="#00A4EF"/>
                    <rect x="11" y="11" width="9" height="9" fill="#FFB900"/>
                  </svg>
                  <span className="hidden sm:inline">Continue with Microsoft</span>
                  <span className="sm:hidden">Microsoft</span>
                </button>
              </div>

              {/* ── Or Sign Up Using ── */}
              <div className="relative flex items-center justify-center my-5">
                <div className="w-full border-t border-gray-200/80" />
                <span className="bg-white px-4 text-xs font-semibold text-gray-400 shrink-0 whitespace-nowrap">
                  Or Sign Up Using
                </span>
                <div className="w-full border-t border-gray-200/80" />
              </div>

              <button
                type="button"
                onClick={() => setAuthStep('register-builder')}
                className="w-full py-3.5 px-4 bg-[#EBF3FF] hover:bg-[#DDEBFF] text-[#1E40AF] font-bold rounded-xl text-sm transition-all duration-200 flex items-center justify-center gap-2.5 cursor-pointer border border-[#D0E2FF] hover:border-[#B8D5FF] hover:shadow-sm transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <Building size={18} className="stroke-[2.2]" />
                <span>Register as Builder</span>
              </button>

              {/* Direct Switch to Customer Login */}
              <div className="mt-4 pt-3 border-t border-gray-100 text-center text-xs text-gray-500 flex items-center justify-center gap-1.5">
                <span>Are you a Customer?</span>
                <button
                  type="button"
                  onClick={() => handleSelectRole('customer')}
                  className="font-bold text-[#1E40AF] hover:underline cursor-pointer"
                >
                  Login as Customer →
                </button>
              </div>

              <button
                type="button"
                onClick={() => setAuthStep('role-selection')}
                className="w-full mt-3 text-center text-xs font-bold text-gray-400 hover:text-gray-700 transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft size={14} />
                <span>Back to Role Selection</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 5: BUILDER REGISTRATION
  // =========================================================================
  if (authStep === 'register-builder') {
    return (
      <div className="min-h-screen bg-[#EEF2F6] flex items-center justify-center p-3 sm:p-6 font-['Plus_Jakarta_Sans',sans-serif]">
        <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200/80">
          <div className="p-6 bg-gradient-to-r from-[#081734] to-[#152e60] text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400">
                <Building2 size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg">Register Construction Firm</h3>
                <p className="text-xs text-gray-300">Create contractor workspace on Build Hub.</p>
              </div>
            </div>
          </div>

          {authError && (
            <div className="mx-6 mt-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
              <X size={16} className="text-red-500 shrink-0" />
              <span>{authError}</span>
            </div>
          )}
          {authSuccess && (
            <div className="mx-6 mt-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-2">
              <Check size={16} className="text-emerald-500 shrink-0" />
              <span>{authSuccess}</span>
            </div>
          )}

          <form onSubmit={handleBuilderRegisterSubmit} className="p-6 sm:p-8 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Builder / Lead Contact</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vikram Sharma"
                  value={builderReg.name}
                  onChange={(e) => setBuilderReg({ ...builderReg, name: e.target.value })}
                  className="w-full bg-[#F4F7FE] border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-blue-600 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Company Entity</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Infra Construction"
                  value={builderReg.company}
                  onChange={(e) => setBuilderReg({ ...builderReg, company: e.target.value })}
                  className="w-full bg-[#F4F7FE] border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-blue-600 font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Official Email</label>
                <input
                  type="email"
                  required
                  placeholder="builder@company.com"
                  value={builderReg.email}
                  onChange={(e) => setBuilderReg({ ...builderReg, email: e.target.value })}
                  className="w-full bg-[#F4F7FE] border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-blue-600 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Contractor License No.</label>
                <input
                  type="text"
                  required
                  placeholder="LIC-2026-XXXX"
                  value={builderReg.licenseNo}
                  onChange={(e) => setBuilderReg({ ...builderReg, licenseNo: e.target.value })}
                  className="w-full bg-[#F4F7FE] border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-blue-600 font-mono font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Contact Phone</label>
                <input
                  type="text"
                  required
                  placeholder="+91 98765 43210"
                  value={builderReg.phone}
                  onChange={(e) => setBuilderReg({ ...builderReg, phone: e.target.value })}
                  className="w-full bg-[#F4F7FE] border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-blue-600 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Location / City</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hyderabad"
                  value={builderReg.location}
                  onChange={(e) => setBuilderReg({ ...builderReg, location: e.target.value })}
                  className="w-full bg-[#F4F7FE] border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-blue-600 font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Specialization</label>
                <select
                  value={builderReg.specialization}
                  onChange={(e) => setBuilderReg({ ...builderReg, specialization: e.target.value })}
                  className="w-full bg-[#F4F7FE] border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-blue-600 font-medium"
                >
                  <option value="Residential Construction">Residential Construction</option>
                  <option value="Commercial Infrastructure">Commercial Infrastructure</option>
                  <option value="Luxury Villas & Estates">Luxury Villas & Estates</option>
                  <option value="Renovations & Structural">Renovations & Structural</option>
                  <option value="Industrial Buildings">Industrial Buildings</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Experience (Years)</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={builderReg.experience}
                  onChange={(e) => setBuilderReg({ ...builderReg, experience: e.target.value })}
                  className="w-full bg-[#F4F7FE] border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-blue-600 font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Account Password</label>
                <input
                  type="password"
                  required
                  placeholder="At least 6 characters"
                  value={builderReg.password}
                  onChange={(e) => setBuilderReg({ ...builderReg, password: e.target.value })}
                  className="w-full bg-[#F4F7FE] border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Confirm Password</label>
                <input
                  type="password"
                  required
                  placeholder="Repeat password"
                  value={builderReg.confirmPassword}
                  onChange={(e) => setBuilderReg({ ...builderReg, confirmPassword: e.target.value })}
                  className="w-full bg-[#F4F7FE] border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-blue-600"
                />
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => {
                  setAuthError('');
                  setAuthSuccess('');
                  setAuthStep('login-builder');
                }}
                className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
              >
                Already registered? Login
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-6 py-3 bg-[#092257] hover:bg-[#07183d] disabled:opacity-60 text-white font-bold rounded-xl text-xs sm:text-sm transition shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span>Registering...</span>
                ) : (
                  <>
                    <Check size={16} />
                    <span>Complete Builder Registration</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 6: ADMINISTRATOR LOGIN PAGE (Matches Row 2 Card 1 in Image)
  // =========================================================================
  return (
    <div className="min-h-screen bg-[#EEF2F6] flex items-center justify-center p-3 sm:p-6 font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="w-full max-w-[1020px] bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[600px] border border-gray-200/80">
        
        {/* Left Dark Blue Panel */}
        <div className="lg:col-span-5 bg-gradient-to-b from-[#081734] via-[#071938] to-[#041026] text-white p-7 sm:p-9 flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center mb-7">
              <img
                src={buildHubBrandHeaderImg}
                alt="Build Hub - Smart Construction"
                className="h-10 w-auto object-contain"
              />
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight text-white">
              Master Control. <br />
              <span className="text-[#38BDF8]">Platform Analytics.</span>
            </h2>

            <p className="text-xs sm:text-sm text-gray-300/90 mt-3 leading-relaxed">
              System-wide administration, global contractor directory, workforce allocation, and capital reporting.
            </p>

            <div className="mt-7 space-y-3.5">
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-full bg-[#11274F] border border-[#1E3E7B] flex items-center justify-center text-[#38BDF8] shrink-0">
                  <Building size={18} />
                </div>
                <span className="text-xs sm:text-sm font-semibold text-gray-200">
                  Total Builder & Contractor Oversight
                </span>
              </div>

              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-full bg-[#11274F] border border-[#1E3E7B] flex items-center justify-center text-[#38BDF8] shrink-0">
                  <Users size={18} />
                </div>
                <span className="text-xs sm:text-sm font-semibold text-gray-200">
                  Platform-Wide Workforce & Trades
                </span>
              </div>

              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-full bg-[#11274F] border border-[#1E3E7B] flex items-center justify-center text-[#38BDF8] shrink-0">
                  <TrendingUp size={18} />
                </div>
                <span className="text-xs sm:text-sm font-semibold text-gray-200">
                  Portfolio Capital & Budget Variance
                </span>
              </div>

              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-full bg-[#11274F] border border-[#1E3E7B] flex items-center justify-center text-[#38BDF8] shrink-0">
                  <ShieldCheck size={18} />
                </div>
                <span className="text-xs sm:text-sm font-semibold text-gray-200">
                  System Security & Full Backups
                </span>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-4 mt-6 border-t border-[#132A55] flex items-center justify-between text-xs text-gray-400">
            <span>Portal:</span>
            <span className="font-bold text-sky-300 bg-sky-900/30 px-2.5 py-1 rounded-lg border border-sky-500/30">
              🛡️ Admin Master Console
            </span>
          </div>
        </div>

        {/* Right White Form Card */}
        <div className="lg:col-span-7 bg-white p-7 sm:p-12 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-18 h-18 rounded-full bg-[#EFF6FF] flex items-center justify-center text-[#2563EB] mb-3.5 shadow-sm ring-4 ring-indigo-50">
                <Shield size={36} className="stroke-[2.1] text-[#2563EB]" />
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0B1A30] tracking-tight">
                Administrator Login
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
                Access your administration dashboard
              </p>
            </div>

            {/* Error / Success Messages */}
            {authError && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
                <X size={15} className="text-red-500 shrink-0" />
                <span>{authError}</span>
              </div>
            )}
            {authSuccess && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-2">
                <Check size={15} className="text-emerald-500 shrink-0" />
                <span>{authSuccess}</span>
              </div>
            )}

            <form onSubmit={(e) => { e.preventDefault(); handleLoginSubmit('Administrator'); }} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
                  <User size={14} className="text-gray-500" />
                  <span>Email / Username</span>
                </label>
                <div className="relative">
                  <User size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={emailOrUsername}
                    onChange={(e) => setEmailOrUsername(e.target.value)}
                    placeholder="Enter your email or username"
                    className="w-full bg-white border border-gray-200 hover:border-gray-300 focus:border-[#1E60FF] rounded-xl pl-10 pr-4 py-3 text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
                  <Lock size={14} className="text-gray-500" />
                  <span>Password</span>
                </label>
                <div className="relative">
                  <Lock size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full bg-white border border-gray-200 hover:border-gray-300 focus:border-[#1E60FF] rounded-xl pl-10 pr-10 py-3 text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-0.5">
                <label className="flex items-center gap-2 text-gray-600 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="font-semibold">Remember Me</span>
                </label>

                <button
                  type="button"
                  onClick={() => alert('Demo Administrator account: saisri.vinay@buildhub.io')}
                  className="font-bold text-blue-600 hover:underline cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 bg-[#092257] hover:bg-[#07183d] disabled:opacity-60 text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-blue-900/20 flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <LogIn size={18} />
                    <span>Login as Administrator</span>
                  </>
                )}
              </button>
            </form>

            {/* Direct Switch to Customer / Builder */}
            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-center gap-3 text-xs font-semibold text-gray-500">
              <button
                type="button"
                onClick={() => handleSelectRole('customer')}
                className="text-[#6415C5] hover:underline cursor-pointer"
              >
                Customer Login
              </button>
              <span className="text-gray-300">•</span>
              <button
                type="button"
                onClick={() => handleSelectRole('builder')}
                className="text-blue-600 hover:underline cursor-pointer"
              >
                Builder Login
              </button>
            </div>

            <button
              type="button"
              onClick={() => setAuthStep('role-selection')}
              className="w-full mt-3 text-center text-xs font-bold text-gray-500 hover:text-gray-800 transition flex items-center justify-center gap-1 cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>Back to Role Selection</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
