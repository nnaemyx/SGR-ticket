import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

// Verify SMTP connection configuration
const verifyTransporter = async () => {
  try {
    await transporter.verify();
    console.log('SMTP connection verified successfully');
    return true;
  } catch (error) {
    console.error('SMTP connection verification failed:', error);
    return false;
  }
};

export async function POST(request: Request) {
  try {
    console.log('Received request to send ticket email');
    
    // Verify SMTP connection first
    const isConnected = await verifyTransporter();
    if (!isConnected) {
      return NextResponse.json(
        { error: 'Email service is not properly configured', details: 'SMTP connection failed' },
        { status: 500 }
      );
    }

    const { email, ticketType, quantity } = await request.json();
    console.log('Request data:', { email, ticketType, quantity });

    if (!email || !ticketType) {
      console.log('Missing required fields:', { email, ticketType });
      return NextResponse.json(
        { error: 'Email and ticket type are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('Invalid email format:', email);
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Determine which ticket image to attach based on ticket type
    let ticketImagePath = '';
    let ticketName = '';

    if (ticketType === 'RAVERS') {
      ticketImagePath = '/tickets/ravers-ticket.svg';
      ticketName = 'RAVERS Ticket';
    } else if (ticketType === 'GENG OF SIX') {
      ticketImagePath = '/tickets/geng-ticket.svg';
      ticketName = 'GENG OF SIX Ticket';
    } else {
      console.log('Invalid ticket type:', ticketType);
      return NextResponse.json(
        { error: 'Invalid ticket type' },
        { status: 400 }
      );
    }

    console.log('Preparing email with:', { ticketImagePath, ticketName });

    // Email content
    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: email,
      subject: `Your ${ticketName} for Lagos in Port Harcourt`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #067976; text-align: center;">Thank You for Your Purchase!</h1>
          <p>Dear Customer,</p>
          <p>Thank you for purchasing ${quantity} ${ticketName}${quantity > 1 ? 's' : ''} for Lagos in Port Harcourt.</p>
          <p>Please find your ticket${quantity > 1 ? 's' : ''} attached to this email.</p>
          <p>Important Information:</p>
          <ul>
            <li>Event: Lagos in Port Harcourt</li>
            <li>Date: 19th of May 2025</li>
            <li>Location: [Event Location]</li>
            <li>Ticket Type: ${ticketType}</li>
            <li>Quantity: ${quantity}</li>
          </ul>
          <p>Please present this ticket${quantity > 1 ? ' or one of these tickets' : ''} at the event entrance.</p>
          <p>If you have any questions, please contact us at [Contact Information].</p>
          <p>We look forward to seeing you at the event!</p>
          <p style="margin-top: 20px; text-align: center; color: #067976; font-weight: bold;">Lagos in Port Harcourt Team</p>
        </div>
      `,
      attachments: [
        {
          filename: `${ticketName.toLowerCase().replace(/\s+/g, '-')}.svg`,
          path: `${process.cwd()}/public${ticketImagePath}`,
        },
      ],
    };

    console.log('Attempting to send email...');
    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending ticket email:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Detailed error:', {
      message: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : 'Unknown error type'
    });
    
    return NextResponse.json(
      { 
        error: 'Failed to send ticket email', 
        details: errorMessage,
        type: error instanceof Error ? error.name : 'Unknown error type'
      },
      { status: 500 }
    );
  }
} 