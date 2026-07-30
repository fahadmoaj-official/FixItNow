import Stripe from "stripe";
import env from "../../config/env";
import prisma from "../../lib/prisma";
import { stripe } from "../../lib/stripe";

const createPaymentIntoDb = async (bookingId: string) => {
  const booking = await prisma.bookings.findUnique({
    where: { 
        id: bookingId 
    },
    include: { 
        service: true 
    },
  });

  if (!booking ) {
    throw new Error("Booking is not exist");
  }

  const amountInMinorUnits = Math.round(Number(booking.service.price) * 100); 

  if (amountInMinorUnits <= 0) {
    throw new Error("Booking price must be greater than 0");
  }

  const paymentRecord = await prisma.payment.create({
    data: {
      bookingId: booking.id,
      amount: Number(booking.service.price),
      transactionId: "pending",
      status: "PENDING",
      paymentMethod: "STRIPE", 
    },
  });

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "bdt",
          product_data: {
            name: booking.service.title || "FixItNow service",
          },
          unit_amount: amountInMinorUnits,
        },
        quantity: 1,
      },
    ],
    success_url: `${env.APP_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${env.APP_URL}/payment/cancel?bookingId=${booking.id}`,
    metadata: {
      bookingId: booking.id,
      paymentId: paymentRecord.id,
    },
  });

  await prisma.payment.update({
    where: { 
        id: paymentRecord.id 
    },
    data: { 
        transactionId: session.id 
    },
  });

  return {
    paymentId: paymentRecord.id,
    sessionId: session.id,
    checkoutUrl: session.url,
    amount: Number(booking.service.price),
  };
};

const confirmPaymentIntoDb = async (sessionId: string) => {
  const session = await stripe.checkout.sessions.retrieve(sessionId); // d

  const paymentRecord = await prisma.payment.findFirst({
    where: { 
        transactionId: session.id 
    },
  });

  if (!paymentRecord) {
    throw new Error("Payment record not found");
  }

  const nextStatus =
    session.payment_status === "paid" || session.status === "complete"
      ? "PAID"
      : "PENDING";

    //   status update korar jonno payment record update kora hocche
  const updatedPayment = await prisma.payment.update({
    where: {
         id: paymentRecord.id 
        },
    data: {
         status: nextStatus
        },
  });

  return {
    sessionId: session.id,
    paymentStatus: session.payment_status,
    payment: updatedPayment,
  };
};

const getAllPaymentsFromDb = async () => {
  return prisma.payment.findMany({

    include: {
      booking: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const getPaymentByIdFromDb = async (paymentId: string) => {
  return prisma.payment.findUnique({
    where: { 
        id: paymentId 
    },
    include: {
      booking: true,
    },
  });
};

const handleStripeWebhookServices = async (
  payload: Buffer,
  signature: string,
) => {
  const event = stripe.webhooks.constructEvent(
    payload,
    signature,
    env.STRIPE_WEBHOOK_SECRET,
  );

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const paymentRecord = await prisma.payment.findFirst({
      where: { 
         transactionId: session.id 
    },
    });

    if (paymentRecord) {
      await prisma.payment.update({
        where: { 
            id: paymentRecord.id 
        },
        data: { 
            status: "PAID"
         },
      });
    }
  }

  if (
    event.type === "checkout.session.expired" ||
    event.type === "checkout.session.async_payment_failed"
  ) {
    const session = event.data.object as Stripe.Checkout.Session;

    const paymentRecord = await prisma.payment.findFirst({
      where: { 
        transactionId: session.id 
    },
    });

    if (paymentRecord) {
      await prisma.payment.update({
        where: { 
            id: paymentRecord.id 
        },
        data: { 
            status: "FAILED" 
        },
      });
    }
  }

  return event;
};

export const paymentService = {
  createPaymentIntoDb,
  confirmPaymentIntoDb,
  getAllPaymentsFromDb,
  getPaymentByIdFromDb,
  handleStripeWebhookServices,
};
