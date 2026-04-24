import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { prisma } from '@/lib/prisma';
import EmailHtml from '@/services/email-template';
import { smtpConfig } from '@/lib';

const from = `"Know Before You Rent" <${process.env.SMTP_FROM}>`;
const subject = 'Reset Your Password';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({
        message: 'If that email exists, a reset link has been sent.',
      });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 1000 * 60 * 60);

    await prisma.user.update({
      where: { email },
      data: {
        passwordResetToken: token,
        passwordResetExpires: expires,
      },
    });

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;

    await sendResetEmail({
      to: email,
      name: user.name || 'User',
      resetUrl,
    });

    return NextResponse.json({
      message: 'If that email exists, a reset link has been sent.',
    });
  } catch (error) {
    console.error('Reset password error:', error);

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: 'Token and password are required' },
        { status: 400 },
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 },
      );
    }

    const user = await prisma.user.findFirst({
      where: {
        passwordResetToken: token,
        passwordResetExpires: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Reset link is invalid or has expired' },
        { status: 400 },
      );
    }

    const bcrypt = await import('bcryptjs');
    const hashed = await bcrypt.hash(password, 12);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashed,
        passwordResetToken: null,
        passwordResetExpires: null,
      },
    });

    return NextResponse.json({
      message: 'Password reset successfully. You can now sign in.',
    });
  } catch (error) {
    console.error('Confirm reset error:', error);

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

async function sendResetEmail({
  to,
  name,
  resetUrl,
}: {
  to: string;
  name: string;
  resetUrl: string;
}) {
  const transporter = nodemailer.createTransport(smtpConfig);

  await transporter.sendMail({
    from,
    to,
    subject,
    html: EmailHtml(name, resetUrl),
  });

  console.log(`[DEV] Password reset link for ${to}:\n${resetUrl}`);
}
