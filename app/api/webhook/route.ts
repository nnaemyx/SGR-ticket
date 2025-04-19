import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { toast } from 'sonner';
import { sendTicketEmail } from '@/app/lib/email';

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY!;

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const hash = crypto
      .createHmac('sha512', PAYSTACK_SECRET_KEY)
      .update(body)
      .digest('hex');

    const signature = req.headers.get('x-paystack-signature');

    if (hash !== signature) {
      toast.error('Invalid payment signature');
      return new NextResponse('Invalid signature', { status: 400 });
    }

    const event = JSON.parse(body);

    // Handle successful transactions
    if (event.event === 'charge.success') {
      const { email, metadata, amount } = event.data;

      try {
        // Send ticket email
        await sendTicketEmail(email, {
          category: {
            name: metadata.custom_fields[0].value,
            price: amount / 100,
            id: metadata.custom_fields[0].value.toLowerCase().replace(/\s+/g, '-'),
          },
          quantity: parseInt(metadata.custom_fields[1].value),
          reference: event.data.reference,
        });

        toast.success('Ticket sent successfully!');
        return new NextResponse('Webhook processed', { status: 200 });
      } catch (error) {
        console.error('Email sending error:', error);
        toast.error('Failed to send ticket email');
        return new NextResponse('Email sending failed', { status: 500 });
      }
    }

    return new NextResponse('Unhandled event type', { status: 200 });
  } catch (error) {
    console.error('Webhook error:', error);
    toast.error('Webhook processing failed');
    return new NextResponse('Webhook error', { status: 500 });
  }
} 