import nodemailer from 'nodemailer';

// Validate email configuration
const validateEmailConfig = () => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        throw new Error('Email configuration is missing. Please check your .env file for EMAIL_USER and EMAIL_PASS');
    }
};

// Create transporter with validation
const createTransporter = () => {
    validateEmailConfig();
    
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
};

export const sendResetPasswordEmail = async (email, resetToken) => {
    try {
        validateEmailConfig();
        
        const transporter = createTransporter();
        const resetUrl = `http://localhost:4444/reset-password.html?token=${resetToken}`;
        
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset Request',
            html: `
                <h1>Password Reset Request</h1>
                <p>You requested to reset your password. Click the link below to reset it:</p>
                <a href="${resetUrl}">Reset Password</a>
                <p>This link will expire in 1 hour.</p>
                <p>If you didn't request this, please ignore this email.</p>
            `
        };

        // Verify transporter configuration
        await transporter.verify();
        
        // Send email
        const info = await transporter.sendMail(mailOptions);

        return true;
    } catch (error) {
        console.error('Error in sendResetPasswordEmail:', error);
        if (error.message.includes('configuration is missing')) {
            console.error('Email configuration error:', error.message);
        } else if (error.code === 'EAUTH') {
            console.error('Email authentication failed. Please check your credentials.');
        } else {
            console.error('Unexpected email error:', error);
        }
        return false;
    }
}; 