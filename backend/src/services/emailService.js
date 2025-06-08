const nodemailer = require('nodemailer');
const config = require('../config');
const logger = require('../utils/logger');

class EmailService {
  constructor() {
    this.transporter = null;
    this.initializeTransporter();
  }

  async initializeTransporter() {
    try {
      // Create transporter based on configuration
      this.transporter = nodemailer.createTransporter({
        service: config.EMAIL.SERVICE,
        host: config.EMAIL.HOST,
        port: config.EMAIL.PORT,
        secure: false, // true for 465, false for other ports
        auth: {
          user: config.EMAIL.USERNAME,
          pass: config.EMAIL.PASSWORD
        },
        tls: {
          rejectUnauthorized: false
        }
      });

      // Verify connection
      await this.transporter.verify();
      logger.info('Email service initialized successfully');
    } catch (error) {
      logger.error('Email service initialization failed:', error);
      // Don't throw error to prevent app from crashing
    }
  }

  async sendEmail({ email, subject, template, data, html, text }) {
    try {
      if (!this.transporter) {
        throw new Error('Email service not initialized');
      }

      let emailHtml = html;
      let emailText = text;

      // Generate email content based on template
      if (template && !html) {
        const emailContent = this.generateEmailTemplate(template, data);
        emailHtml = emailContent.html;
        emailText = emailContent.text;
      }

      const mailOptions = {
        from: `"SkillSync" <${config.EMAIL.FROM}>`,
        to: email,
        subject: subject,
        html: emailHtml,
        text: emailText
      };

      const result = await this.transporter.sendMail(mailOptions);
      
      logger.info('Email sent successfully', {
        to: email,
        subject: subject,
        messageId: result.messageId
      });

      return {
        success: true,
        messageId: result.messageId
      };
    } catch (error) {
      logger.error('Failed to send email:', error);
      throw error;
    }
  }

  generateEmailTemplate(template, data = {}) {
    const templates = {
      welcome: this.getWelcomeTemplate(data),
      verification: this.getVerificationTemplate(data),
      resetPassword: this.getResetPasswordTemplate(data),
      careerAnalysis: this.getCareerAnalysisTemplate(data),
      jobAlert: this.getJobAlertTemplate(data),
      learningReminder: this.getLearningReminderTemplate(data),
      newsletter: this.getNewsletterTemplate(data),
      feedback: this.getFeedbackTemplate(data)
    };

    return templates[template] || templates.welcome;
  }

  getWelcomeTemplate({ name, verifyUrl }) {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to SkillSync</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🚀 Welcome to SkillSync!</h1>
          </div>
          <div class="content">
            <h2>Hi ${name || 'there'}!</h2>
            <p>Welcome to SkillSync, your AI-powered career companion! We're excited to help you discover and navigate your ideal career path.</p>
            
            <p><strong>What you can do with SkillSync:</strong></p>
            <ul>
              <li>🧠 Get AI-powered career analysis and recommendations</li>
              <li>📊 Identify skill gaps and learning opportunities</li>
              <li>💼 Discover job opportunities that match your profile</li>
              <li>📈 Track your career progress and growth</li>
              <li>🎯 Set and achieve your career goals</li>
            </ul>

            ${verifyUrl ? `
              <p>To get started, please verify your email address:</p>
              <div style="text-align: center;">
                <a href="${verifyUrl}" class="button">Verify Email Address</a>
              </div>
            ` : ''}

            <p>Once verified, you can complete your profile and start getting personalized career insights!</p>
            
            <p>If you have any questions, our support team is here to help at support@skillsync.com</p>
            
            <p>Best regards,<br>The SkillSync Team</p>
          </div>
          <div class="footer">
            <p>© 2024 SkillSync. All rights reserved.</p>
            <p>You received this email because you signed up for SkillSync.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
      Welcome to SkillSync, ${name || 'there'}!
      
      We're excited to help you discover and navigate your ideal career path.
      
      What you can do with SkillSync:
      - Get AI-powered career analysis and recommendations
      - Identify skill gaps and learning opportunities  
      - Discover job opportunities that match your profile
      - Track your career progress and growth
      - Set and achieve your career goals
      
      ${verifyUrl ? `To get started, please verify your email address: ${verifyUrl}` : ''}
      
      Once verified, you can complete your profile and start getting personalized career insights!
      
      If you have any questions, contact us at support@skillsync.com
      
      Best regards,
      The SkillSync Team
    `;

    return { html, text };
  }

  getVerificationTemplate({ name, verifyUrl }) {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Verify Your SkillSync Account</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #667eea; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #28a745; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📧 Verify Your Email</h1>
          </div>
          <div class="content">
            <h2>Hi ${name || 'there'}!</h2>
            <p>Please verify your email address to complete your SkillSync account setup.</p>
            
            <div style="text-align: center;">
              <a href="${verifyUrl}" class="button">Verify Email Address</a>
            </div>
            
            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <p style="word-break: break-all; background: #eee; padding: 10px; border-radius: 5px;">${verifyUrl}</p>
            
            <p>This link will expire in 24 hours for security reasons.</p>
            
            <p>If you didn't create a SkillSync account, you can safely ignore this email.</p>
            
            <p>Best regards,<br>The SkillSync Team</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
      Hi ${name || 'there'}!
      
      Please verify your email address to complete your SkillSync account setup.
      
      Verification link: ${verifyUrl}
      
      This link will expire in 24 hours for security reasons.
      
      If you didn't create a SkillSync account, you can safely ignore this email.
      
      Best regards,
      The SkillSync Team
    `;

    return { html, text };
  }

  getResetPasswordTemplate({ name, resetUrl, resetToken }) {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Reset Your SkillSync Password</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #dc3545; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #dc3545; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; margin: 20px 0; }
          .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Password Reset Request</h1>
          </div>
          <div class="content">
            <h2>Hi ${name || 'there'}!</h2>
            <p>We received a request to reset your SkillSync password.</p>
            
            <div style="text-align: center;">
              <a href="${resetUrl}" class="button">Reset Password</a>
            </div>
            
            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <p style="word-break: break-all; background: #eee; padding: 10px; border-radius: 5px;">${resetUrl}</p>
            
            <div class="warning">
              <strong>⚠️ Security Notice:</strong>
              <ul>
                <li>This link will expire in 10 minutes</li>
                <li>If you didn't request this reset, please ignore this email</li>
                <li>Your password won't change until you click the link and set a new one</li>
              </ul>
            </div>
            
            <p>For security reasons, we recommend choosing a strong password that includes:</p>
            <ul>
              <li>At least 8 characters</li>
              <li>A mix of uppercase and lowercase letters</li>
              <li>Numbers and special characters</li>
            </ul>
            
            <p>If you continue to have problems, contact our support team at support@skillsync.com</p>
            
            <p>Best regards,<br>The SkillSync Team</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
      Hi ${name || 'there'}!
      
      We received a request to reset your SkillSync password.
      
      Reset your password: ${resetUrl}
      
      Security Notice:
      - This link will expire in 10 minutes
      - If you didn't request this reset, please ignore this email
      - Your password won't change until you click the link and set a new one
      
      For security reasons, we recommend choosing a strong password with at least 8 characters, including uppercase and lowercase letters, numbers, and special characters.
      
      If you continue to have problems, contact support@skillsync.com
      
      Best regards,
      The SkillSync Team
    `;

    return { html, text };
  }

  getCareerAnalysisTemplate({ name, analysisResults, profileUrl }) {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Your Career Analysis is Ready!</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; margin: 20px 0; }
          .insight { background: white; padding: 20px; margin: 15px 0; border-radius: 8px; border-left: 4px solid #667eea; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎯 Your Career Analysis is Ready!</h1>
          </div>
          <div class="content">
            <h2>Hi ${name}!</h2>
            <p>Great news! Your AI-powered career analysis has been completed. Here are some key insights:</p>
            
            ${analysisResults ? `
              <div class="insight">
                <h3>🚀 Recommended Career Path</h3>
                <p><strong>${analysisResults.primaryPath || 'Software Developer'}</strong></p>
                <p>Match Score: ${analysisResults.confidenceScore ? Math.round(analysisResults.confidenceScore * 100) : 85}%</p>
              </div>
              
              <div class="insight">
                <h3>💡 Top Skill Recommendations</h3>
                <p>${analysisResults.recommendedSkills ? analysisResults.recommendedSkills.slice(0, 3).join(', ') : 'JavaScript, React, Node.js'}</p>
              </div>
            ` : ''}
            
            <div style="text-align: center;">
              <a href="${profileUrl || 'https://skillsync.app/dashboard'}" class="button">View Full Analysis</a>
            </div>
            
            <p>Your personalized career roadmap includes:</p>
            <ul>
              <li>📊 Detailed skill gap analysis</li>
              <li>📚 Recommended learning resources</li>
              <li>💼 Matching job opportunities</li>
              <li>📈 Salary progression insights</li>
            </ul>
            
            <p>Ready to take the next step in your career journey?</p>
            
            <p>Best regards,<br>The SkillSync Team</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
      Hi ${name}!
      
      Great news! Your AI-powered career analysis has been completed.
      
      ${analysisResults ? `
      Recommended Career Path: ${analysisResults.primaryPath || 'Software Developer'}
      Match Score: ${analysisResults.confidenceScore ? Math.round(analysisResults.confidenceScore * 100) : 85}%
      
      Top Skill Recommendations: ${analysisResults.recommendedSkills ? analysisResults.recommendedSkills.slice(0, 3).join(', ') : 'JavaScript, React, Node.js'}
      ` : ''}
      
      View your full analysis: ${profileUrl || 'https://skillsync.app/dashboard'}
      
      Your personalized career roadmap includes:
      - Detailed skill gap analysis
      - Recommended learning resources  
      - Matching job opportunities
      - Salary progression insights
      
      Ready to take the next step in your career journey?
      
      Best regards,
      The SkillSync Team
    `;

    return { html, text };
  }

  getJobAlertTemplate({ name, jobs, alertUrl }) {
    return {
      html: `<h2>Hi ${name}!</h2><p>We found ${jobs?.length || 3} new job opportunities that match your profile!</p><a href="${alertUrl}">View Jobs</a>`,
      text: `Hi ${name}! We found ${jobs?.length || 3} new job opportunities that match your profile! View jobs: ${alertUrl}`
    };
  }

  getLearningReminderTemplate({ name, course, progressUrl }) {
    return {
      html: `<h2>Hi ${name}!</h2><p>Don't forget to continue your learning journey with "${course || 'your current course'}"!</p><a href="${progressUrl}">Continue Learning</a>`,
      text: `Hi ${name}! Don't forget to continue your learning journey with "${course || 'your current course'}"! Continue: ${progressUrl}`
    };
  }

  getNewsletterTemplate({ name, content }) {
    return {
      html: `<h2>Hi ${name}!</h2><p>Here's your weekly career insights newsletter:</p>${content || '<p>Latest career trends and tips...</p>'}`,
      text: `Hi ${name}! Here's your weekly career insights newsletter: ${content || 'Latest career trends and tips...'}`
    };
  }

    getFeedbackTemplate({ name, message }) {
      return {
        html: `<h2>Thank you for your feedback, ${name}!</h2><p>We've received your message: "${message || 'No message provided'}"</p><p>We'll get back to you soon!</p>`,
        text: `Thank you for your feedback, ${name}! We've received your message: "${message || 'No message provided'}". We'll get back to you soon!`
      };
    }
  }