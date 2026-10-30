import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Lock, ArrowRight, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { validateRegistration, getPasswordStrength } from '../utils/validation';

export const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: '' });
    }
  };

  const passwordStrength = getPasswordStrength(formData.password);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { isValid, errors } = validateRegistration(formData);
    if (!isValid) {
      setFormErrors(errors);
      addToast('Please correct the highlighted fields', 'error');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setFormErrors({ ...errors, confirmPassword: 'Passwords do not match' });
      addToast('Passwords do not match', 'error');
      return;
    }

    setLoading(true);
    const result = await register({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      password: formData.password
    });
    setLoading(false);

    if (result?.success) {
      navigate('/account');
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
          <h2 className="font-serif text-2xl font-bold text-forest-950">Create an Account</h2>
          <p className="text-xs text-stone-500 mt-1">Join the pure living community for fast checkout and offers</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-forest-800 mb-1">
              Full Name *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
                className={`input pl-10 pr-3 text-xs py-3 ${
                  formErrors.name ? 'border-rose-400 focus:ring-rose-200' : ''
                }`}
              />
            </div>
            {formErrors.name && (
              <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                <span>{formErrors.name}</span>
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-forest-800 mb-1">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
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
            <label className="block text-xs font-bold uppercase tracking-wider text-forest-800 mb-1">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="10-digit mobile number"
                className={`input pl-10 pr-3 text-xs py-3 ${
                  formErrors.phone ? 'border-rose-400 focus:ring-rose-200' : ''
                }`}
              />
            </div>
            {formErrors.phone && (
              <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                <span>{formErrors.phone}</span>
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-forest-800 mb-1">
              Password *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password (min 6 characters)"
                required
                className={`input pl-10 pr-3 text-xs py-3 ${
                  formErrors.password ? 'border-rose-400 focus:ring-rose-200' : ''
                }`}
              />
            </div>
            {formData.password && (
              <div className="mt-1.5 flex items-center gap-2">
                <div className="h-1 flex-1 bg-cream-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${passwordStrength.color} transition-all duration-300`}
                    style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                  />
                </div>
                <span className="text-[10px] font-bold text-stone-500">
                  {passwordStrength.label}
                </span>
              </div>
            )}
            {formErrors.password && (
              <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                <span>{formErrors.password}</span>
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-forest-800 mb-1">
              Confirm Password *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                required
                className={`input pl-10 pr-3 text-xs py-3 ${
                  formErrors.confirmPassword ? 'border-rose-400 focus:ring-rose-200' : ''
                }`}
              />
            </div>
            {formErrors.confirmPassword && (
              <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                <span>{formErrors.confirmPassword}</span>
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
                <span>CREATING ACCOUNT...</span>
              </>
            ) : (
              <>
                <span>REGISTER</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-stone-500 pt-2 border-t border-cream-100">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-forest-800 hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};
