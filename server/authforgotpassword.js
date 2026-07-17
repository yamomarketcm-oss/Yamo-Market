// routes/auth.js
import express from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import db from './db.js';

const router = express.Router();

// Configure email service
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Test email connection
transporter.verify((error, success) => {
  if (error) {
    console.log('Email service error:', error);
  } else {
    console.log('Email service ready');
  }
});

// Forgot Password - Send Reset Email to ANY registered user
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    // Validate email
    if (!email || !email.trim()) {
      return res.status(400).json({ 
        message: 'Email is required' 
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user exists with this email
    const userResult = await db.query(
      'SELECT user_id, email, username FROM "User" WHERE LOWER(email) = $1',
      [normalizedEmail]
    );

    if (userResult.rows.length === 0) {
      // Security: Don't reveal if email exists or not
      // But still return success to prevent user enumeration
      return res.status(200).json({
        message: 'If an account exists with this email, a reset link has been sent'
      });
    }

    const user = userResult.rows[0];

    // Generate secure reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
    const resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour expiry

    // Save hashed token to database
    await db.query(
      `UPDATE "User" 
       SET reset_token = $1, reset_token_expires = $2, updated_at = NOW() 
       WHERE user_id = $3`,
      [resetTokenHash, resetTokenExpires, user.user_id]
    );

    // Generate reset URL
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    // Email template
    const emailHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; background: #f9fafb; padding: 20px; border-radius: 8px; }
            .header { background: linear-gradient(135deg, #2563eb 0%, #a855f7 100%); color: white; padding: 30px; text-align: center; border-radius: 8px; margin-bottom: 20px; }
            .header h1 { margin: 0; font-size: 28px; }
            .content { background: white; padding: 30px; border-radius: 8px; margin-bottom: 20px; }
            .content p { margin: 15px 0; }
            .button-container { text-align: center; margin: 30px 0; }
            .reset-button { 
              background: linear-gradient(135deg, #2563eb 0%, #a855f7 100%);
              color: white;
              padding: 14px 40px;
              text-decoration: none;
              border-radius: 8px;
              display: inline-block;
              font-weight: 600;
              font-size: 16px;
              transition: transform 0.2s;
            }
            .reset-button:hover { transform: translateY(-2px); }
            .link-text { 
              background: #f3f4f6;
              padding: 12px;
              border-radius: 4px;
              word-break: break-all;
              font-size: 12px;
              color: #666;
              margin: 15px 0;
            }
            .warning { 
              background: #fef3c7;
              border-left: 4px solid #f59e0b;
              padding: 15px;
              border-radius: 4px;
              margin: 15px 0;
              font-size: 14px;
              color: #92400e;
            }
            .footer { 
              background: #f3f4f6;
              padding: 20px;
              text-align: center;
              font-size: 12px;
              color: #666;
              border-radius: 8px;
            }
            .footer-link { color: #2563eb; text-decoration: none; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1> YamoMarket</h1>
              <p>Password Reset Request</p>
            </div>

            <div class="content">
              <p>Hi <strong>${user.username}</strong>,</p>
              
              <p>We received a request to reset your password. Click the button below to set a new password:</p>

              <div class="button-container">
                <a href="${resetUrl}" class="reset-button">Reset Password</a>
              </div>

              <p style="color: #666; font-size: 14px;">Or copy and paste this link in your browser:</p>
              <div class="link-text">${resetUrl}</div>

              <div class="warning">
                <strong>⚠️ Security Notice:</strong> This link will expire in <strong>1 hour</strong>. If you didn't request a password reset, please ignore this email or contact our support team immediately.
              </div>

              <p style="margin-top: 20px; color: #666; font-size: 14px;">
                <strong>Why did you receive this email?</strong><br>
                This email was sent because someone requested a password reset for your account. If this wasn't you, your account may be at risk. Please contact us immediately if you didn't make this request.
              </p>
            </div>

            <div class="footer">
              <p>© 2026 YamoMarket. All rights reserved.</p>
              <p>
                <a href="${process.env.FRONTEND_URL}" class="footer-link">Visit YamoMarket</a> | 
                <a href="${process.env.FRONTEND_URL}/about" class="footer-link">Contact Support</a>
              </p>
              <p style="margin-top: 15px; color: #999;">
                You received this email because this address is registered with YamoMarket
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Send email
    await transporter.sendMail({
      from: `"YamoMarket" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: '🔐 Reset Your YamoMarket Password',
      html: emailHTML,
      replyTo: process.env.SUPPORT_EMAIL || process.env.EMAIL_USER,
      headers: {
        'X-Priority': '3',
        'X-MSMail-Priority': 'Normal',
        'Importance': 'Normal'
      }
    });

    console.log(`Password reset email sent to ${user.email}`);

    return res.status(200).json({
      message: 'If an account exists with this email, a reset link has been sent. Please check your inbox and spam folder.'
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({ 
      error: error.message || 'Failed to process password reset request'
    });
  }
});

// Validate Reset Token
router.get('/validate-reset-token/:token', async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({ 
        message: 'Token is required' 
      });
    }

    // Hash the token to match what's in database
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    // Find user with valid token
    const userResult = await db.query(
      `SELECT user_id, email, username FROM "User" 
       WHERE reset_token = $1 AND reset_token_expires > NOW()`,
      [tokenHash]
    );

    if (userResult.rows.length === 0) {
      return res.status(400).json({ 
        message: 'Invalid or expired reset token' 
      });
    }

    return res.status(200).json({
      message: 'Token is valid',
      user: {
        user_id: userResult.rows[0].user_id,
        email: userResult.rows[0].email,
        username: userResult.rows[0].username
      }
    });

  } catch (error) {
    console.error('Token validation error:', error);
    return res.status(500).json({ 
      error: 'Failed to validate token' 
    });
  }
});

// Reset Password with Token
router.post('/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body;

    // Validate inputs
    if (!token || !password) {
      return res.status(400).json({ 
        message: 'Token and password are required' 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        message: 'Password must be at least 6 characters' 
      });
    }

    // Hash the token
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    // Find user with valid token
    const userResult = await db.query(
      `SELECT user_id, email FROM "User" 
       WHERE reset_token = $1 AND reset_token_expires > NOW()`,
      [tokenHash]
    );

    if (userResult.rows.length === 0) {
      return res.status(400).json({ 
        message: 'Invalid or expired reset token. Please request a new password reset.' 
      });
    }

    const userId = userResult.rows[0].user_id;
    const userEmail = userResult.rows[0].email;

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update password and clear reset token
    await db.query(
      `UPDATE "User" 
       SET password = $1, reset_token = NULL, reset_token_expires = NULL, updated_at = NOW() 
       WHERE user_id = $2`,
      [hashedPassword, userId]
    );

    // Send confirmation email
    const confirmationHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto; }
            .container { max-width: 600px; margin: 0 auto; background: #f9fafb; padding: 20px; }
            .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 8px; margin-bottom: 20px; }
            .content { background: white; padding: 30px; border-radius: 8px; }
            .success-icon { font-size: 48px; margin-bottom: 10px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="success-icon">✓</div>
              <h1 style="margin: 10px 0;">Password Updated Successfully</h1>
            </div>
            <div class="content">
              <p>Your password has been successfully reset. You can now log in with your new password.</p>
              <p style="margin-top: 20px;">
                <a href="${process.env.FRONTEND_URL}" style="background: linear-gradient(135deg, #2563eb 0%, #a855f7 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; display: inline-block;">
                  Go to Login
                </a>
              </p>
              <p style="margin-top: 20px; color: #666; font-size: 14px;">
                If you didn't reset your password, please contact our support team immediately.
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Send confirmation email asynchronously (don't wait for it)
    transporter.sendMail({
      from: `"YamoMarket" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: '✓ Your Password Has Been Reset',
      html: confirmationHTML
    }).catch(err => console.error('Failed to send confirmation email:', err));

    console.log(`Password reset successfully for user ${userId}`);

    return res.status(200).json({
      message: 'Password has been reset successfully. You can now log in with your new password.'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    return res.status(500).json({ 
      error: 'Failed to reset password. Please try again.' 
    });
  }
});

export default router;
