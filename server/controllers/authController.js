// const { Admin, RefreshToken } = require('../models');
// const { generateTokens, verifyRefreshToken, revokeRefreshToken, revokeAllRefreshTokens } = require('../middleware/auth');
// const { sendPasswordResetEmail } = require('../services/email');
// const config = require('../config');

// /**
//  * @desc    Admin login
//  * @route   POST /api/admin/login
//  * @access  Public
//  */
// const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Find admin by email
//     const admin = await Admin.findOne({ email: email.toLowerCase() }).select('+password');

//     if (!admin) {
//       return res.status(401).json({
//         success: false,
//         message: 'Invalid credentials'
//       });
//     }

//     // Check if active
//     if (!admin.isActive) {
//       return res.status(401).json({
//         success: false,
//         message: 'Account is deactivated. Please contact support.'
//       });
//     }

//     // Compare password
//     const isMatch = await admin.comparePassword(password);

//     if (!isMatch) {
//       return res.status(401).json({
//         success: false,
//         message: 'Invalid credentials'
//       });
//     }

//     // Generate tokens
//     const tokens = await generateTokens(admin);

//     // Update last login
//     admin.lastLogin = new Date();
//     await admin.save();

//     res.json({
//       success: true,
//       message: 'Login successful',
//       data: {
//         admin: admin.toJSON(),
//         accessToken: tokens.accessToken,
//         refreshToken: tokens.refreshToken,
//         expiresIn: tokens.expiresIn
//       }
//     });
//   } catch (error) {
//     console.error('Login error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Login failed',
//       error: config.nodeEnv === 'development' ? error.message : undefined
//     });
//   }
// };

// // const login = async (req, res) => {
// //   try {
// //     console.log("BODY:", req.body);

// //     const { email, password } = req.body;

// //     const admin = await Admin.findOne({
// //       email: email.toLowerCase(),
// //     }).select('+password');

// //     console.log("ADMIN FOUND:", admin);

// //     if (!admin) {
// //       console.log("❌ Admin not found");
// //       return res.status(401).json({
// //         success: false,
// //         message: 'Invalid credentials'
// //       });
// //     }

// //     console.log("isActive:", admin.isActive);

// //     if (!admin.isActive) {
// //       console.log("❌ Admin inactive");
// //       return res.status(401).json({
// //         success: false,
// //         message: 'Account deactivated'
// //       });
// //     }

// //     const isMatch = await admin.comparePassword(password);

// //     console.log("PASSWORD MATCH:", isMatch);

// //     if (!isMatch) {
// //       console.log("❌ Password wrong");
// //       return res.status(401).json({
// //         success: false,
// //         message: 'Invalid credentials'
// //       });
// //     }

// //     const tokens = await generateTokens(admin);

// //     res.json({
// //       success: true,
// //       accessToken: tokens.accessToken,
// //     });

// //   } catch (error) {
// //     console.error(error);
// //   }
// // };
// /**
//  * @desc    Refresh access token
//  * @route   POST /api/admin/refresh-token
//  * @access  Public
//  */
// const refreshToken = async (req, res) => {
//   try {
//     const { refreshToken: token } = req.body;

//     if (!token) {
//       return res.status(400).json({
//         success: false,
//         message: 'Refresh token is required'
//       });
//     }

//     // Verify refresh token
//     const admin = await verifyRefreshToken(token);

//     if (!admin) {
//       return res.status(401).json({
//         success: false,
//         message: 'Invalid or expired refresh token'
//       });
//     }

//     // Revoke old refresh token
//     await revokeRefreshToken(token);

//     // Generate new tokens
//     const tokens = await generateTokens(admin);

//     res.json({
//       success: true,
//       message: 'Token refreshed',
//       data: {
//         accessToken: tokens.accessToken,
//         refreshToken: tokens.refreshToken,
//         expiresIn: tokens.expiresIn
//       }
//     });
//   } catch (error) {
//     console.error('Refresh token error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Token refresh failed'
//     });
//   }
// };

// /**
//  * @desc    Admin logout
//  * @route   POST /api/admin/logout
//  * @access  Private
//  */
// const logout = async (req, res) => {
//   try {
//     const { refreshToken: token } = req.body;

//     if (token) {
//       await revokeRefreshToken(token);
//     }

//     res.json({
//       success: true,
//       message: 'Logged out successfully'
//     });
//   } catch (error) {
//     console.error('Logout error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Logout failed'
//     });
//   }
// };

// /**
//  * @desc    Get current admin profile
//  * @route   GET /api/admin/profile
//  * @access  Private
//  */
// const getProfile = async (req, res) => {
//   try {
//     const admin = await Admin.findById(req.admin._id);

//     res.json({
//       success: true,
//       data: admin
//     });
//   } catch (error) {
//     console.error('Get profile error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to get profile'
//     });
//   }
// };

// /**
//  * @desc    Update admin profile
//  * @route   PUT /api/admin/profile
//  * @access  Private
//  */
// const updateProfile = async (req, res) => {
//   try {
//     const { name, avatar } = req.body;

//     const admin = await Admin.findById(req.admin._id);

//     if (name) admin.name = name;
//     if (avatar !== undefined) admin.avatar = avatar;

//     await admin.save();

//     res.json({
//       success: true,
//       message: 'Profile updated',
//       data: admin
//     });
//   } catch (error) {
//     console.error('Update profile error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to update profile'
//     });
//   }
// };

// /**
//  * @desc    Change password
//  * @route   PUT /api/admin/change-password
//  * @access  Private
//  */
// const changePassword = async (req, res) => {
//   try {
//     const { currentPassword, newPassword } = req.body;

//     const admin = await Admin.findById(req.admin._id).select('+password');

//     // Verify current password
//     const isMatch = await admin.comparePassword(currentPassword);

//     if (!isMatch) {
//       return res.status(400).json({
//         success: false,
//         message: 'Current password is incorrect'
//       });
//     }

//     // Update password
//     admin.password = newPassword;
//     await admin.save();

//     // Revoke all refresh tokens (force re-login)
//     await revokeAllRefreshTokens(admin._id);

//     res.json({
//       success: true,
//       message: 'Password changed successfully. Please login again.'
//     });
//   } catch (error) {
//     console.error('Change password error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to change password'
//     });
//   }
// };

// /**
//  * @desc    Forgot password
//  * @route   POST /api/admin/forgot-password
//  * @access  Public
//  */
// const forgotPassword = async (req, res) => {
//   try {
//     const { email } = req.body;

//     const admin = await Admin.findOne({ email: email.toLowerCase() });

//     if (!admin) {
//       // Don't reveal if email exists or not
//       return res.json({
//         success: true,
//         message: 'If that email exists in our system, a password reset link has been sent.'
//       });
//     }

//     // Generate reset token
//     const resetToken = admin.generateResetToken();
//     await admin.save();

//     // Create reset URL
//     const resetUrl = `${config.resetPasswordUrl}?token=${resetToken}`;

//     // Send email
//     await sendPasswordResetEmail(admin.email, resetToken, resetUrl);

//     res.json({
//       success: true,
//       message: 'If that email exists in our system, a password reset link has been sent.'
//     });
//   } catch (error) {
//     console.error('Forgot password error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to process request'
//     });
//   }
// };

// /**
//  * @desc    Reset password
//  * @route   POST /api/admin/reset-password
//  * @access  Public
//  */
// const resetPassword = async (req, res) => {
//   try {
//     const { token, password } = req.body;

//     const crypto = require('crypto');
//     const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

//     // Find admin with valid token
//     const admin = await Admin.findOne({
//       resetPasswordToken: hashedToken,
//       resetPasswordExpire: { $gt: Date.now() }
//     });

//     if (!admin) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid or expired reset token'
//       });
//     }

//     // Update password
//     admin.password = password;
//     admin.resetPasswordToken = undefined;
//     admin.resetPasswordExpire = undefined;
//     admin.isActive = true;

//     await admin.save();

//     // Revoke all refresh tokens
//     await revokeAllRefreshTokens(admin._id);

//     res.json({
//       success: true,
//       message: 'Password reset successfully. Please login with your new password.'
//     });
//   } catch (error) {
//     console.error('Reset password error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to reset password'
//     });
//   }
// };

// /**
//  * @desc    Verify reset token
//  * @route   POST /api/admin/verify-reset-token
//  * @access  Public
//  */
// const verifyResetToken = async (req, res) => {
//   try {
//     const { token } = req.body;

//     const crypto = require('crypto');
//     const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

//     const admin = await Admin.findOne({
//       resetPasswordToken: hashedToken,
//       resetPasswordExpire: { $gt: Date.now() }
//     });

//     if (!admin) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid or expired reset token'
//       });
//     }

//     res.json({
//       success: true,
//       message: 'Token is valid'
//     });
//   } catch (error) {
//     console.error('Verify reset token error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to verify token'
//     });
//   }
// };

// /**
//  * @desc    Initialize default admin (for setup)
//  * @route   POST /api/admin/init
//  * @access  Public (should be disabled in production)
//  */
// const initAdmin = async (req, res) => {
//   try {
//     // Check if any admin exists
//     const existingAdmin = await Admin.findOne({ role: 'admin' });

//     if (existingAdmin) {
//       return res.status(400).json({
//         success: false,
//         message: 'Admin already exists'
//       });
//     }

//     // Create default admin
//     const admin = await Admin.create({
//       email: config.adminEmail,
//       password: config.adminPassword,
//       name: 'Admin',
//       role: 'admin'
//     });

//     res.status(201).json({
//       success: true,
//       message: 'Admin created successfully',
//       data: {
//         email: admin.email,
//         name: admin.name
//       }
//     });
//   } catch (error) {
//     console.error('Init admin error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to create admin'
//     });
//   }
// };

// /**
//  * @desc    Register new admin
//  * @route   POST /api/admin/register
//  * @access  Private (Admin only)
//  */
// const register = async (req, res) => {
//   try {
//     const { email, password, name, role = 'editor' } = req.body;

//     // Check if email already exists
//     const existingAdmin = await Admin.findOne({ email: email.toLowerCase() });

//     if (existingAdmin) {
//       return res.status(400).json({
//         success: false,
//         message: 'Email already registered'
//       });
//     }

//     // Create admin
//     const admin = await Admin.create({
//       email: email.toLowerCase(),
//       password,
//       name,
//       role: req.admin.role === 'admin' ? role : 'editor' // Only admins can create admins
//     });

//     res.status(201).json({
//       success: true,
//       message: 'Admin created successfully',
//       data: admin.toJSON()
//     });
//   } catch (error) {
//     console.error('Register error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to create admin'
//     });
//   }
// };

// /**
//  * @desc    Get current admin (alias for getProfile)
//  * @route   GET /api/admin/me
//  * @access  Private
//  */
// const getMe = getProfile;

// module.exports = {
//   login,
//   register,
//   refreshToken,
//   logout,
//   getProfile,
//   getMe,
//   updateProfile,
//   changePassword,
//   forgotPassword,
//   resetPassword,
//   verifyResetToken,
//   initAdmin
// };


const { Admin, RefreshToken } = require('../models');
const { generateTokens, verifyRefreshToken, revokeRefreshToken, revokeAllRefreshTokens } = require('../middleware/auth');
const { sendPasswordResetEmail } = require('../services/email');
const config = require('../config');

/**
 * @desc    Admin login
 * @route   POST /api/admin/login
 * @access  Public
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find admin by email
    const admin = await Admin.findOne({ email: email.toLowerCase() }).select('+password');
    console.log("Admin : ", admin);

    const admins = await Admin.find().select('+password');;
    console.log("Admins List : ", admins);

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if active
    if (!admin.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated. Please contact support.'
      });
    }

    // Compare password
    const isMatch = await admin.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate tokens
    const tokens = await generateTokens(admin);

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        admin: admin.toJSON(),
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresIn: tokens.expiresIn
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: config.nodeEnv === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Refresh access token
 * @route   POST /api/admin/refresh-token
 * @access  Public
 */
const refreshToken = async (req, res) => {
  try {
    const { refreshToken: token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token is required'
      });
    }

    // Verify refresh token
    const admin = await verifyRefreshToken(token);

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired refresh token'
      });
    }

    // Revoke old refresh token
    await revokeRefreshToken(token);

    // Generate new tokens
    const tokens = await generateTokens(admin);

    res.json({
      success: true,
      message: 'Token refreshed',
      data: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresIn: tokens.expiresIn
      }
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({
      success: false,
      message: 'Token refresh failed'
    });
  }
};

/**
 * @desc    Admin logout
 * @route   POST /api/admin/logout
 * @access  Private
 */
const logout = async (req, res) => {
  try {
    const { refreshToken: token } = req.body;

    if (token) {
      await revokeRefreshToken(token);
    }

    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Logout failed'
    });
  }
};

/**
 * @desc    Get current admin profile
 * @route   GET /api/admin/profile
 * @access  Private
 */
const getProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id);

    res.json({
      success: true,
      data: admin
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get profile'
    });
  }
};

/**
 * @desc    Update admin profile
 * @route   PUT /api/admin/profile
 * @access  Private
 */
const updateProfile = async (req, res) => {
  try {
    const { name, avatar } = req.body;

    const admin = await Admin.findById(req.admin._id);

    if (name) admin.name = name;
    if (avatar !== undefined) admin.avatar = avatar;

    await admin.save();

    res.json({
      success: true,
      message: 'Profile updated',
      data: admin
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile'
    });
  }
};

/**
 * @desc    Change password
 * @route   PUT /api/admin/change-password
 * @access  Private
 */
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const admin = await Admin.findById(req.admin._id).select('+password');

    // Verify current password
    const isMatch = await admin.comparePassword(currentPassword);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    admin.password = newPassword;
    await admin.save();

    // Revoke all refresh tokens (force re-login)
    await revokeAllRefreshTokens(admin._id);

    res.json({
      success: true,
      message: 'Password changed successfully. Please login again.'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to change password'
    });
  }
};

/**
 * @desc    Forgot password
 * @route   POST /api/admin/forgot-password
 * @access  Public
 */
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const admin = await Admin.findOne({ email: email.toLowerCase() });

    if (!admin) {
      // Don't reveal if email exists or not
      return res.json({
        success: true,
        message: 'If that email exists in our system, a password reset link has been sent.'
      });
    }

    // Generate reset token
    const resetToken = admin.generateResetToken();
    await admin.save();

    // Create reset URL
    const resetUrl = `${config.resetPasswordUrl}?token=${resetToken}`;

    // Send email
    await sendPasswordResetEmail(admin.email, resetToken, resetUrl);

    res.json({
      success: true,
      message: 'If that email exists in our system, a password reset link has been sent.'
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process request'
    });
  }
};

/**
 * @desc    Reset password
 * @route   POST /api/admin/reset-password
 * @access  Public
 */
const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    const crypto = require('crypto');
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Find admin with valid token
    const admin = await Admin.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!admin) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    // Update password
    admin.password = password;
    admin.resetPasswordToken = undefined;
    admin.resetPasswordExpire = undefined;
    admin.isActive = true;

    await admin.save();

    // Revoke all refresh tokens
    await revokeAllRefreshTokens(admin._id);

    res.json({
      success: true,
      message: 'Password reset successfully. Please login with your new password.'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reset password'
    });
  }
};

/**
 * @desc    Verify reset token
 * @route   POST /api/admin/verify-reset-token
 * @access  Public
 */
const verifyResetToken = async (req, res) => {
  try {
    const { token } = req.body;

    const crypto = require('crypto');
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const admin = await Admin.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!admin) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    res.json({
      success: true,
      message: 'Token is valid'
    });
  } catch (error) {
    console.error('Verify reset token error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify token'
    });
  }
};

/**
 * @desc    Initialize default admin (for setup)
 * @route   POST /api/admin/init
 * @access  Public (should be disabled in production)
 */
const initAdmin = async (req, res) => {
  try {
    // Check if any admin exists
    const existingAdmin = await Admin.findOne({ role: 'admin' });

    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Admin already exists'
      });
    }

    // Create default admin
    const admin = await Admin.create({
      email: config.adminEmail,
      password: config.adminPassword,
      name: 'Admin',
      role: 'admin'
    });

    res.status(201).json({
      success: true,
      message: 'Admin created successfully',
      data: {
        email: admin.email,
        name: admin.name
      }
    });
  } catch (error) {
    console.error('Init admin error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create admin'
    });
  }
};

/**
 * @desc    Register new admin
 * @route   POST /api/admin/register
 * @access  Private (Admin only)
 */
const register = async (req, res) => {
  try {
    const { email, password, name, role = 'editor' } = req.body;

    // Check if email already exists
    const existingAdmin = await Admin.findOne({ email: email.toLowerCase() });

    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Create admin
    const admin = await Admin.create({
      email: email.toLowerCase(),
      password,
      name,
      role: req.admin.role === 'admin' ? role : 'editor' // Only admins can create admins
    });

    res.status(201).json({
      success: true,
      message: 'Admin created successfully',
      data: admin.toJSON()
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create admin'
    });
  }
};

/**
 * @desc    Get current admin (alias for getProfile)
 * @route   GET /api/admin/me
 * @access  Private
 */
const getMe = getProfile;

module.exports = {
  login,
  register,
  refreshToken,
  logout,
  getProfile,
  getMe,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
  verifyResetToken,
  initAdmin
};