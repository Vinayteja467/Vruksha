import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { validateLogin } from '../utils/validation';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/account';

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { isValid, errors } = validateLogin({ email, password });
    if (!isValid) {
      setFormErrors(errors);
      return;
    }
    setFormErrors({});

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result?.success) {
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="bg-cream-50/50 min-h-[80vh] flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full card p-5 sm:p-8 space-y-6">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-2">
            <img src="/logo.png" alt="VRUKSHA" className="w-10 h-10 rounded-full object-cover shadow-xs" />
            <span className="font-serif text-2xl font-bold text-forest-950">VRUKSHA</span>
          </Link>
          <h2 className="font-serif text-2xl font-bold text-forest-950">Welcome Back</h2>
          <p className="text-xs text-stone-500 mt-1">Sign in to manage orders, wishlist, and saved addresses</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-forest-800 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (formErrors.email) setFormErrors({ ...formErrors, email: '' });
                }}
                placeholder="Enter your email address"
                required
                className={`input pl-10 pr-3 text-xs py-3 ${
                  formErrors.email ? 'border-rose-400 focus:ring-rose-200' : ''
                }`}
              />
            </div>
            {formErrors.email && (
              <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                <span>{formErrors.email}</span>
              </p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold uppercase tracking-wider text-forest-800">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-[11px] text-forest-800 hover:underline font-semibold"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (formErrors.password) setFormErrors({ ...formErrors, password: '' });
                }}
                placeholder="Enter your password"
                required
                className={`input pl-10 pr-3 text-xs py-3 ${
                  formErrors.password ? 'border-rose-400 focus:ring-rose-200' : ''
                }`}
              />
            </div>
            {formErrors.password && (
              <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                <span>{formErrors.password}</span>
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3.5 uppercase tracking-widest text-xs shadow-glow flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>SIGNING IN...</span>
              </>
            ) : (
              <>
                <span>SIGN IN</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-stone-500 pt-2 border-t border-cream-100">
          Don't have an account yet?{' '}
          <Link to="/register" className="font-bold text-forest-800 hover:underline">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};
