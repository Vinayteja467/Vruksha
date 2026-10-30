/**
 * Form validation utilities for VRUKSHA E-Commerce
 */

export const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(email.trim());
};

export const isValidPhone = (phone) => {
  if (!phone || typeof phone !== 'string') return false;
  // Indian 10-digit mobile number starting with 6-9
  const cleaned = phone.replace(/[\s\-+]/g, '');
  const digitsOnly = cleaned.startsWith('91') && cleaned.length === 12 ? cleaned.slice(2) : cleaned;
  return /^[6-9]\d{9}$/.test(digitsOnly);
};

export const isValidPincode = (pincode) => {
  if (!pincode) return false;
  return /^[1-9][0-9]{5}$/.test(pincode.toString().trim());
};

export const getPasswordStrength = (password) => {
  if (!password) return { score: 0, label: 'Empty', color: 'bg-stone-200' };
  let score = 0;
  if (password.length >= 6) score += 1;
  if (password.length >= 10) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score <= 2) return { score, label: 'Weak', color: 'bg-rose-500' };
  if (score <= 3) return { score, label: 'Fair', color: 'bg-amber-500' };
  if (score <= 4) return { score, label: 'Good', color: 'bg-lime-500' };
  return { score, label: 'Strong', color: 'bg-forest-600' };
};

export const validateRegistration = ({ name, email, phone, password }) => {
  const errors = {};

  if (!name || name.trim().length < 2) {
    errors.name = 'Full name must be at least 2 characters';
  }

  if (!isValidEmail(email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (phone && !isValidPhone(phone)) {
    errors.phone = 'Please enter a valid 10-digit mobile number';
  }

  if (!password || password.length < 6) {
    errors.password = 'Password must be at least 6 characters long';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateLogin = ({ email, password }) => {
  const errors = {};

  if (!isValidEmail(email)) {
    errors.email = 'Please enter a valid registered email address';
  }

  if (!password) {
    errors.password = 'Password is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
