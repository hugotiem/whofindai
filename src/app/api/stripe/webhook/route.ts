import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/client';
import { prisma } from '@/lib/prisma';
import Stripe from 'stripe';

// This is your Stripe webhook secret for testing your endpoint locally.
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  let event: Stripe.Event;

  try {
    if (!signature) throw new Error('No signature found');
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    const error = err as Error;
    console.error('Webhook signature verification failed:', error.message);
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const priceId = subscription.items.data[0].price.id;
        const customerId = subscription.customer as string;

        // Get the plan name from metadata or use a mapping
        const planMap: { [key: string]: string } = {
          [process.env.STRIPE_PAY_AS_YOU_GO_PRICE_ID!]: 'PAY_AS_YOU_GO',
          [process.env.STRIPE_PRO_PRICE_ID!]: 'PRO'
        };

        const plan = planMap[priceId] || 'FREE';

        // Update user's plan in your database
        await prisma.user.update({
          where: {
            stripeCustomerId: customerId
          },
          data: {
            plan,
            subscriptionId: subscription.id,
            subscriptionStatus: subscription.status
          }
        });
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        // Reset user's plan to FREE
        await prisma.user.update({
          where: {
            stripeCustomerId: customerId
          },
          data: {
            plan: 'FREE',
            subscriptionId: null,
            subscriptionStatus: 'canceled'
          }
        });
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;

        // Update user's payment status
        await prisma.user.update({
          where: {
            stripeCustomerId: customerId
          },
          data: {
            paymentStatus: 'succeeded',
            lastPaymentDate: new Date()
          }
        });
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;

        // Update user's payment status
        await prisma.user.update({
          where: {
            stripeCustomerId: customerId
          },
          data: {
            paymentStatus: 'failed'
          }
        });

        // Optionally send notification to user about failed payment
        // await sendPaymentFailedNotification(customerId);
        break;
      }

      // case 'customer.updated': {
      //   const customer = event.data.object as Stripe.Customer;

      //   // Update customer details in your database
      //   await prisma.user.update({
      //     where: {
      //       stripeCustomerId: customer.id
      //     },
      //     data: {
      //       email: customer.email || undefined,
      //       name: customer.name || undefined
      //     }
      //   });
      //   break;
      // }

      // Add more event types as needed
    }

    return new NextResponse('Webhook received and processed', { status: 200 });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return new NextResponse('Webhook handler failed', { status: 500 });
  }
}
