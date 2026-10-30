import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { inMemoryStore } from '../config/inMemoryStore.js';
import { User } from '../models/User.js';
import { isConnectedToMongo } from '../config/db.js';
import { env } from '../config/env.js';

const generateToken = (id) => {
  return jwt.sign({ id }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN
  });
};

export const register = async (req, res, next) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email and password' });
    }

    if (isConnectedToMongo) {
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ success: false, message: 'User already exists with this email' });
      }
      const user = await User.create({ name, email, phone, password });
      return res.status(201).json({
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role
        },
        token: generateToken(user._id)
      });
    } else {
      const existing = await inMemoryStore.findUserByEmail(email);
      if (existing) {
        return res.status(400).json({ success: false, message: 'User already exists with this email' });
      }
      const user = await inMemoryStore.createUser({ name, email, phone, password });
      return res.status(201).json({
        success: true,
        user,
        token: generateToken(user.id)
      });
    }
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    if (isConnectedToMongo) {
      const user = await User.findOne({ email });
      if (user && (await user.matchPassword(password))) {
        return res.json({
          success: true,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            addresses: user.addresses,
            wishlist: user.wishlist
          },
          token: generateToken(user._id)
        });
      }
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    } else {
      const user = await inMemoryStore.findUserByEmail(email);
      if (user && (await bcrypt.compare(password, user.password))) {
        const { password: _, ...safeUser } = user;
        return res.json({
          success: true,
          user: safeUser,
          token: generateToken(user.id)
        });
      }
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (err) {
    next(err);
  }
};

export const getProfile = async (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, addresses } = req.body;
    if (isConnectedToMongo) {
      const user = await User.findById(req.user._id || req.user.id);
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });

      if (name) user.name = name;
      if (phone !== undefined) user.phone = phone;
      if (addresses) user.addresses = addresses;

      const updated = await user.save();
      res.json({
        success: true,
        user: {
          id: updated._id,
          name: updated.name,
          email: updated.email,
          phone: updated.phone,
          role: updated.role,
          addresses: updated.addresses,
          wishlist: updated.wishlist
        }
      });
    } else {
      const updated = await inMemoryStore.updateUser(req.user.id, {
        ...(name && { name }),
        ...(phone !== undefined && { phone }),
        ...(addresses && { addresses })
      });
      res.json({ success: true, user: updated });
    }
  } catch (err) {
    next(err);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Please provide your registered email address' });
    }

    // Generate 6-digit OTP and reset token
    const resetOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

    if (isConnectedToMongo) {
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        // Obfuscate user existence for privacy security, but return clear success message
        return res.json({
          success: true,
          message: 'If an account exists with this email, a 6-digit password reset code has been dispatched.'
        });
      }
      user.resetPasswordToken = resetOtp;
      user.resetPasswordExpires = expiresAt;
      await user.save();
    } else {
      const user = await inMemoryStore.findUserByEmail(email);
      if (!user) {
        return res.json({
          success: true,
          message: 'If an account exists with this email, a 6-digit password reset code has been dispatched.'
        });
      }
      await inMemoryStore.setResetToken(email, resetOtp, expiresAt);
    }

    console.log(`🔐 [Password Reset OTP for ${email}]: ${resetOtp} (Valid for 30 minutes)`);

    res.json({
      success: true,
      message: `Password reset code dispatched to ${email}. For development/testing preview, your OTP code is: ${resetOtp}`,
      devOtp: process.env.NODE_ENV !== 'production' ? resetOtp : undefined
    });
  } catch (err) {
    next(err);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { email, code, newPassword } = req.body;

    if (!email || !code || !newPassword) {
      return res.status(400).json({ success: false, message: 'Email, verification code, and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long' });
    }

    if (isConnectedToMongo) {
      const user = await User.findOne({
        email: email.toLowerCase(),
        resetPasswordToken: code.trim(),
        resetPasswordExpires: { $gt: Date.now() }
      });

      if (!user) {
        return res.status(400).json({ success: false, message: 'Invalid or expired reset code' });
      }

      user.password = newPassword; // Will be hashed by pre('save')
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
    } else {
      const user = await inMemoryStore.findByResetToken(code.trim());
      if (!user || user.email.toLowerCase() !== email.toLowerCase()) {
        return res.status(400).json({ success: false, message: 'Invalid or expired reset code' });
      }
      await inMemoryStore.updateUserPassword(user.id, newPassword);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
    }

    res.json({
      success: true,
      message: 'Password successfully reset! You can now log in with your new password.'
    });
  } catch (err) {
    next(err);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Current password and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters long' });
    }

    const userId = req.user._id || req.user.id;

    if (isConnectedToMongo) {
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });

      const isMatch = await user.matchPassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Current password does not match' });
      }

      user.password = newPassword;
      await user.save();
    } else {
      const user = await inMemoryStore.findUserByEmail(req.user.email);
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Current password does not match' });
      }

      await inMemoryStore.updateUserPassword(user.id, newPassword);
    }

    res.json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (err) {
    next(err);
  }
};

export const sendVerification = async (req, res, next) => {
  try {
    const userEmail = req.user.email;
    const userId = req.user._id || req.user.id;
    const verificationOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    if (isConnectedToMongo) {
      await User.findByIdAndUpdate(userId, {
        verificationCode: verificationOtp,
        verificationExpires: expiresAt
      });
    } else {
      await inMemoryStore.setVerificationCode(userId, verificationOtp, expiresAt);
    }

    console.log(`📧 [Email Verification OTP for ${userEmail}]: ${verificationOtp}`);

    res.json({
      success: true,
      message: `Verification code sent to ${userEmail}. For development preview, your OTP is: ${verificationOtp}`,
      devOtp: process.env.NODE_ENV !== 'production' ? verificationOtp : undefined
    });
  } catch (err) {
    next(err);
  }
};

export const verifyEmail = async (req, res, next) => {
  try {
    const { code } = req.body;
    const userId = req.user ? (req.user._id || req.user.id) : null;

    if (!code) {
      return res.status(400).json({ success: false, message: 'Verification code is required' });
    }

    if (isConnectedToMongo) {
      const user = await User.findOne({
        _id: userId,
        verificationCode: code.trim(),
        verificationExpires: { $gt: Date.now() }
      });

      if (!user) {
        return res.status(400).json({ success: false, message: 'Invalid or expired verification code' });
      }

      user.isVerified = true;
      user.verificationCode = undefined;
      user.verificationExpires = undefined;
      await user.save();
    } else {
      const user = inMemoryStore.users.find(
        u => u.id === userId && u.verificationCode === code.trim() && new Date(u.verificationExpires).getTime() > Date.now()
      );

      if (!user) {
        return res.status(400).json({ success: false, message: 'Invalid or expired verification code' });
      }

      await inMemoryStore.verifyUserEmail(userId);
    }

    res.json({
      success: true,
      message: 'Email address verified successfully!'
    });
  } catch (err) {
    next(err);
  }
};

export const deleteAccount = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;

    if (isConnectedToMongo) {
      await User.findByIdAndDelete(userId);
    } else {
      await inMemoryStore.deleteUser(userId);
    }

    res.json({
      success: true,
      message: 'Account permanently deleted. Thank you for being a part of VRUKSHA.'
    });
  } catch (err) {
    next(err);
  }
};

