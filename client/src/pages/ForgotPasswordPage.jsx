import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { KeyRound, Mail, Lock, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { api } from '../api/client';
import { useToast } from '../context/ToastContext';
import { isValidEmail } from '../utils/validation';

export const ForgotPasswordPage = () => {
  const [step, setStep] = useState(1); // 1: request OTP, 2: reset password
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [devOtpHint, setDevOtpHint] = useState('');

  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleRequestCode = async (e) => {
    e.preventDefault();
    if (!isValidEmail(email)) {
      addToast('Please enter a valid email address', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/auth/forgot-password', { email });
      if (res.success) {
        addToast(res.message, 'success');
        if (res.devOtp) {
          setDevOtpHint(res.devOtp);
          setCode(res.devOtp); // Auto-fill for convenience
        }
        setStep(2);
      }
    } catch (err) {
      addToast(err.data?.message || err.message || 'Failed to dispatch reset code', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!code.trim()) {
      addToast('Please enter the 6-digit verification code', 'error');
      return;
    }
    if (newPassword.length < 6) {
      addToast('Password must be at least 6 characters long', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      addToast('Passwords do not match', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/auth/reset-password', {
        email,
        code,
        newPassword
      });
      if (res.success) {
        addToast('Password reset successfully! Please sign in.', 'success');
        navigate('/login', { replace: true });
      }
    } catch (err) {
      addToast(err.data?.message || err.message || 'Failed to reset password', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-cream-50/50 min-h-[80vh] flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full card p-5 sm:p-8 space-y-6">
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-forest-100 text-forest-800 flex items-center justify-center mx-auto mb-3 shadow-xs">
            <KeyRound className="w-6 h-6" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-forest-950">
            {step === 1 ? 'Reset Your Password' : 'Enter Verification Code'}
          </h2>
          <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
            {step === 1
              ? 'Enter your registered email address and we will generate a secure reset code for your account.'
              : `Enter the 6-digit code sent to ${email} along with your new password.`}
          </p>
        </div>

        {devOtpHint && step === 2 && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
            <span className="font-bold">Development Preview OTP:</span> {devOtpHint}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleRequestCode} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-forest-800 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your registered email"
                  required
                  className="input pl-10 pr-3 text-xs py-3"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 uppercase tracking-widest text-xs shadow-glow flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{loading ? 'SENDING CODE...' : 'SEND RESET CODE'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-forest-800 mb-1">
                6-Digit Verification Code
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. 123456"
                maxLength={6}
                required
                className="input text-center text-lg tracking-widest py-2.5 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-forest-800 mb-1">
                New Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  required
                  className="input pl-10 pr-3 text-xs py-3"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-forest-800 mb-1">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  required
                  className="input pl-10 pr-3 text-xs py-3"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 uppercase tracking-widest text-xs shadow-glow flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{loading ? 'UPDATING PASSWORD...' : 'RESET PASSWORD'}</span>
              <CheckCircle2 className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full text-xs text-stone-500 hover:text-stone-800 flex items-center justify-center gap-1.5 pt-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Change email or re-send code</span>
            </button>
          </form>
        )}

        <div className="text-center text-xs text-stone-500 pt-2 border-t border-cream-100">
          Remember your password?{' '}
          <Link to="/login" className="font-bold text-forest-800 hover:underline">
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};
