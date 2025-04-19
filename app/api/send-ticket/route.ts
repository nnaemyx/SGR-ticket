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

export async function POST(request: Request) {
  try {
    console.log('Received request to send ticket email');
    const { email, ticketType, quantity } = await request.json();
    console.log('Request data:', { email, ticketType, quantity });

    if (!email || !ticketType) {
      console.log('Missing required fields:', { email, ticketType });
      return NextResponse.json(
        { error: 'Email and ticket type are required' },
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
            <li>Date: [Event Date]</li>
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
    return NextResponse.json(
      { error: 'Failed to send ticket email', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 