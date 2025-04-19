import nodemailer from 'nodemailer';
import { TicketCategory } from '../types';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function sendTicketEmail(
  to: string,
  ticket: {
    category: TicketCategory;
    quantity: number;
    reference: string;
  }
) {
  const eventDate = new Date('2025-04-01'); // Replace with actual event date
  
  const emailContent = `
    <div style="font-family: 'Gilmer', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="font-family: 'Greconian', serif; text-align: center; color: #1e3a8a;">Lagos in Port Harcourt</h1>
      <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h2 style="color: #1e3a8a;">Your Ticket Details</h2>
        <p><strong>Ticket Type:</strong> ${ticket.category.name}</p>
        <p><strong>Quantity:</strong> ${ticket.quantity}</p>
        <p><strong>Reference:</strong> ${ticket.reference}</p>
        <p><strong>Event Date:</strong> ${eventDate.toLocaleDateString()}</p>
        <p><strong>Venue:</strong> Port Harcourt, Rivers State</p>
      </div>
      <div style="text-align: center; margin-top: 20px;">
        <p style="color: #4b5563; font-size: 14px;">
          Please keep this email as proof of purchase. You'll need to show it at the entrance.
        </p>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject: 'Your Lagos in Port Harcourt Ticket',
    html: emailContent,
  });
} 