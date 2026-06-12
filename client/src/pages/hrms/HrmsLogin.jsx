import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginHrms, clearHrmsError } from "../../redux/features/hrms/hrmsSlice";
import toast from "react-hot-toast";
import { Shield, Mail, Lock, Eye, EyeOff, Sun, Moon, Palette } from "lucide-react";
import { motion } from "framer-motion";

const themePresets = {
  blue: {
    name: "Corporate Blue",
    accent: "from-blue-600 to-cyan-500",
    accentText: "text-blue-500",
    accentBorder: "border-blue-500/20 focus:border-blue-500",
    accentBg: "bg-blue-500/10",
    glow1: "bg-blue-700/15",
    glow2: "bg-cyan-700/15",
    btnGradient: "from-blue-600 to-cyan-500 hover:shadow-blue-500/20",
    darkBg: "bg-gradient-to-br from-slate-950 via-slate-950 to-blue-950/40",
    lightBg: "bg-gradient-to-br from-slate-50 via-slate-50 to-blue-50/50"
  },
  emerald: {
    name: "Emerald Wealth",
    accent: "from-emerald-600 to-teal-500",
    accentText: "text-emerald-500",
    accentBorder: "border-emerald-500/20 focus:border-emerald-500",
    accentBg: "bg-emerald-500/10",
    glow1: "bg-emerald-700/15",
    glow2: "bg-teal-700/15",
    btnGradient: "from-emerald-600 to-teal-500 hover:shadow-emerald-500/20",
    darkBg: "bg-gradient-to-br from-slate-950 via-slate-950 to-emerald-950/40",
    lightBg: "bg-gradient-to-br from-slate-50 via-slate-50 to-emerald-50/50"
  },
  royal: {
    name: "Royal Platinum",
    accent: "from-purple-600 to-indigo-500",
    accentText: "text-purple-500",
    accentBorder: "border-purple-500/20 focus:border-purple-500",
    accentBg: "bg-purple-500/10",
    glow1: "bg-purple-700/15",
    glow2: "bg-indigo-700/15",
    btnGradient: "from-purple-600 to-indigo-500 hover:shadow-purple-500/20",
    darkBg: "bg-gradient-to-br from-slate-950 via-slate-950 to-purple-950/40",
    lightBg: "bg-gradient-to-br from-slate-50 via-slate-50 to-purple-50/50"
  },
  sunset: {
    name: "Sunset Premium",
    accent: "from-amber-500 to-rose-500",
    accentText: "text-amber-500",
    accentBorder: "border-amber-500/20 focus:border-amber-500",
    accentBg: "bg-amber-500/10",
    glow1: "bg-amber-700/15",
    glow2: "bg-rose-700/15",
    btnGradient: "from-amber-500 to-rose-500 hover:shadow-amber-500/20",
    darkBg: "bg-gradient-to-br from-slate-950 via-slate-950 to-rose-950/20",
    lightBg: "bg-gradient-to-br from-slate-50 via-slate-50 to-amber-50/50"
  }
};

const HrmsLogin = () => {
  const [email, setEmail] = useState("hradmin@bankhrms.com");
  const [password, setPassword] = useState("HRAdmin@123");
  const [showPassword, setShowPassword] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("hrmsDarkMode") !== "false";
  });
  const [themePreset, setThemePreset] = useState(() => {
    return localStorage.getItem("hrmsThemePreset") || "blue";
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector((state) => state.hrms);

  useEffect(() => {
    if (user) {
      navigate("/hrms");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearHrmsError());
    }
  }, [error, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      return toast.error("Please fill in all fields");
    }
    dispatch(loginHrms({ email, password }));
  };

  const handlePrefill = () => {
    setEmail("hradmin@bankhrms.com");
    setPassword("HRAdmin@123");
    toast.success("Credentials pre-filled");
  };

  const tp = themePresets[themePreset] || themePresets.blue;

  return (
    <div className={`min-h-screen flex items-center justify-center relative overflow-hidden transition-colors duration-500 ${darkMode ? tp.darkBg + " text-white" : tp.lightBg + " text-slate-900"}`}>
      {/* Premium Gradient Background Shapes */}
      <div className={`absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-tr ${tp.accent} opacity-20 blur-[120px] pointer-events-none`} />
      <div className={`absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-bl ${tp.accent} opacity-20 blur-[120px] pointer-events-none`} />

      {/* Top controls container */}
      <div className="absolute top-4 right-4 flex items-center gap-2 z-50">
        {/* Theme Select Dropdown */}
        <div className="flex items-center gap-1.5">
          <Palette size={14} className={darkMode ? "text-slate-400" : "text-slate-650"} />
          <select
            value={themePreset}
            onChange={(e) => {
              setThemePreset(e.target.value);
              localStorage.setItem("hrmsThemePreset", e.target.value);
            }}
            className={`text-[10px] sm:text-xs px-2 py-1 rounded-lg border font-bold outline-none transition-all duration-300 ${darkMode ? "bg-slate-900 border-slate-800 text-white focus:border-blue-500" : "bg-white border-slate-200 text-slate-800 shadow-sm focus:border-blue-600"}`}
          >
            <option value="blue">Corporate Blue</option>
            <option value="emerald">Emerald Wealth</option>
            <option value="royal">Royal Platinum</option>
            <option value="sunset">Sunset Premium</option>
          </select>
        </div>

        {/* Mode Toggle Button */}
        <button
          onClick={() => {
            const nextMode = !darkMode;
            setDarkMode(nextMode);
            localStorage.setItem("hrmsDarkMode", nextMode);
          }}
          className={`p-1.5 rounded-lg border transition-all duration-300 ${darkMode ? "bg-slate-900 border-slate-800 text-yellow-400 hover:bg-slate-800" : "bg-white border-slate-200 text-slate-850 hover:bg-slate-100 shadow-sm"}`}
        >
          {darkMode ? <Sun size={14} /> : <Moon size={14} />}
        </button>
      </div>

      {/* Main Glass Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md px-4 mt-12 sm:mt-0"
      >
        <div className={`backdrop-blur-xl rounded-3xl border p-6 sm:p-8 shadow-2xl transition-all duration-500 ${darkMode ? "bg-slate-900/40 border-slate-800/60 shadow-black/40" : "bg-white/75 border-slate-200/80 shadow-slate-200"}`}>
          {/* Header */}
          <div className="flex flex-col items-center mb-8">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300 ${darkMode ? `bg-gradient-to-tr ${tp.accent} text-white shadow-lg shadow-blue-500/20` : `bg-gradient-to-tr ${tp.accent} text-white shadow-md shadow-blue-300`}`}>
              <Shield size={28} />
            </div>
            <h1 className={`text-2xl font-extrabold tracking-tight text-center bg-gradient-to-r ${tp.accent} bg-clip-text text-transparent`}>
              BANK HRMS
            </h1>
            <p className={`text-xs mt-1 font-semibold ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
              ENTERPRISE HR ADMIN PORTAL
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <Mail size={18} />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="hradmin@bankhrms.com"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border outline-none text-sm transition-all duration-300 ${darkMode ? "bg-slate-950/50 border-slate-800 focus:border-blue-500 text-white" : "bg-slate-50 border-slate-200 focus:border-blue-600 text-slate-900"}`}
                  required
                />
              </div>
            </div>

            <div>
              <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <Lock size={18} />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className={`w-full pl-10 pr-10 py-3 rounded-xl border outline-none text-sm transition-all duration-300 ${darkMode ? "bg-slate-950/50 border-slate-800 focus:border-blue-500 text-white" : "bg-slate-50 border-slate-200 focus:border-blue-600 text-slate-900"}`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-blue-500 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 rounded-xl font-bold text-sm tracking-wide transition-all duration-300 ${loading ? "bg-slate-700 text-slate-400 cursor-not-allowed" : `bg-gradient-to-r ${tp.accent} hover:opacity-90 text-white shadow-lg active:scale-[0.98]`}`}
            >
              {loading ? "Authenticating..." : "Login to Portal"}
            </button>
          </form>

          {/* Quick Demo Login Info Box */}
          <div className={`mt-8 p-4 rounded-2xl border ${darkMode ? "bg-slate-950/40 border-slate-800/60" : "bg-slate-50 border-slate-200"}`}>
            <div className="flex justify-between items-center mb-2">
              <span className={`text-[10px] font-bold tracking-wider uppercase ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                Demo login info
              </span>
              <button
                type="button"
                onClick={handlePrefill}
                className="text-[10px] text-blue-500 hover:text-blue-600 font-bold hover:underline"
              >
                Auto Fill
              </button>
            </div>
            <div className="space-y-1 text-xs">
              <p className={darkMode ? "text-slate-300" : "text-slate-700"}>
                <span className="font-semibold">Email:</span> hradmin@bankhrms.com
              </p>
              <p className={darkMode ? "text-slate-300" : "text-slate-700"}>
                <span className="font-semibold">Password:</span> HRAdmin@123
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default HrmsLogin;

