import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
<<<<<<< HEAD
import { User, Mail, Phone, Lock, ArrowRight, AlertCircle } from 'lucide-react';
=======
import { User, Mail, Phone, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
>>>>>>> c282c1146c0ed5459baf610ed72c1e737dd8c6a3
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
<<<<<<< HEAD
  const [errorMessage, setErrorMessage] = useState('');
=======
>>>>>>> c282c1146c0ed5459baf610ed72c1e737dd8c6a3

  const { register } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
<<<<<<< HEAD
    setErrorMessage('');
=======
>>>>>>> c282c1146c0ed5459baf610ed72c1e737dd8c6a3
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
<<<<<<< HEAD
    setErrorMessage('');

    if (formData.password !== formData.confirmPassword) {
      const err = 'Passwords do not match';
      setErrorMessage(err);
      addToast(err, 'error');
=======

    if (formData.password !== formData.confirmPassword) {
      addToast('Passwords do not match', 'error');
>>>>>>> c282c1146c0ed5459baf610ed72c1e737dd8c6a3
      return;
    }

    if (formData.password.length < 6) {
<<<<<<< HEAD
      const err = 'Password must be at least 6 characters';
      setErrorMessage(err);
      addToast(err, 'error');
=======
      addToast('Password must be at least 6 characters', 'error');
>>>>>>> c282c1146c0ed5459baf610ed72c1e737dd8c6a3
      return;
    }

    setLoading(true);
    const result = await register({
<<<<<<< HEAD
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone.trim(),
=======
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
>>>>>>> c282c1146c0ed5459baf610ed72c1e737dd8c6a3
      password: formData.password
    });
    setLoading(false);

    if (result?.success) {
<<<<<<< HEAD
      navigate('/account', { replace: true });
    } else {
      setErrorMessage(result?.message || 'Registration failed');
=======
      navigate('/account');
>>>>>>> c282c1146c0ed5459baf610ed72c1e737dd8c6a3
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

<<<<<<< HEAD
        {/* Error Message */}
        {errorMessage && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{errorMessage}</span>
          </div>
        )}

=======
>>>>>>> c282c1146c0ed5459baf610ed72c1e737dd8c6a3
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
                className="input pl-10 pr-3 text-xs py-3"
              />
            </div>
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
                className="input pl-10 pr-3 text-xs py-3"
              />
            </div>
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
                placeholder="Enter your 10-digit mobile number"
                className="input pl-10 pr-3 text-xs py-3"
              />
            </div>
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
                className="input pl-10 pr-3 text-xs py-3"
              />
            </div>
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
                className="input pl-10 pr-3 text-xs py-3"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3.5 uppercase tracking-widest text-xs shadow-glow flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
          >
            <span>{loading ? 'CREATING ACCOUNT...' : 'REGISTER'}</span>
            <ArrowRight className="w-4 h-4" />
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
