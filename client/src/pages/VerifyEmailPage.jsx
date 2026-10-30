import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircle2, MailCheck, ShieldCheck, ArrowRight, RefreshCw } from 'lucide-react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const tokenFromUrl = searchParams.get('token') || searchParams.get('code') || '';
  const [code, setCode] = useState(tokenFromUrl);
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [resending, setResending] = useState(false);

  const { user, isAuthenticated } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (tokenFromUrl && !verified) {
      handleVerify(tokenFromUrl);
    }
  }, [tokenFromUrl]);

  const handleVerify = async (codeToSubmit) => {
    const codeVal = codeToSubmit || code;
    if (!codeVal.trim()) {
      addToast('Please enter the 6-digit verification code', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/auth/verify-email', { code: codeVal.trim() });
      if (res.success) {
        setVerified(true);
        addToast('Email verified successfully!', 'success');
      }
    } catch (err) {
      addToast(err.data?.message || err.message || 'Verification failed. Code may be invalid or expired.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!isAuthenticated) {
      addToast('Please sign in to resend your verification code', 'error');
      navigate('/login');
      return;
    }

    setResending(true);
    try {
      const res = await api.post('/auth/send-verification');
      if (res.success) {
        addToast(res.message, 'success');
        if (res.devOtp) {
          setCode(res.devOtp);
        }
      }
    } catch (err) {
      addToast(err.data?.message || err.message || 'Failed to dispatch verification code', 'error');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="bg-cream-50/50 min-h-[75vh] flex items-center justify-center py-12 px-4 sm:px-6">
      <div className="max-w-md w-full card p-6 sm:p-8 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-forest-100 text-forest-800 flex items-center justify-center mx-auto shadow-xs">
          {verified ? (
            <CheckCircle2 className="w-8 h-8 text-forest-700" />
          ) : (
            <MailCheck className="w-8 h-8 text-forest-800" />
          )}
        </div>

        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-forest-700 bg-forest-100/70 px-3 py-1 rounded-full">
            Account Integrity
          </span>
          <h2 className="font-serif text-2xl font-bold text-forest-950 mt-2">
            {verified ? 'Email Verified Successfully!' : 'Verify Your Email Address'}
          </h2>
          <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
            {verified
              ? 'Your VRUKSHA account is verified. You now enjoy priority shipping and full account privileges.'
              : user?.email
              ? `Enter the 6-digit verification code sent to ${user.email}`
              : 'Enter the verification code sent to your registered email address.'}
          </p>
        </div>

        {verified ? (
          <div className="space-y-4 pt-2">
            <div className="p-4 rounded-2xl bg-forest-50 border border-forest-100 flex items-center gap-3 text-left">
              <ShieldCheck className="w-6 h-6 text-forest-700 flex-shrink-0" />
              <div>
                <p className="text-xs font-bold text-forest-950">Status: Verified Member</p>
                <p className="text-[11px] text-forest-700">All communication and receipts will reach your inbox safely.</p>
              </div>
            </div>

            <Link
              to="/account"
              className="btn-primary w-full py-3.5 text-xs uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <span>Go to My Account</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleVerify(code);
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-forest-800 mb-1">
                6-Digit Code
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="123456"
                maxLength={6}
                required
                className="input text-center text-lg tracking-widest py-2.5 font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 uppercase tracking-widest text-xs shadow-glow flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{loading ? 'VERIFYING...' : 'VERIFY EMAIL'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleResend}
                disabled={resending}
                className="text-xs text-forest-800 hover:underline font-bold flex items-center justify-center gap-1.5 mx-auto"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${resending ? 'animate-spin' : ''}`} />
                <span>{resending ? 'Sending...' : 'Resend Verification Code'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
