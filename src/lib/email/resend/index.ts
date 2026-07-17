import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.RESEND_FROM_EMAIL ?? 'support@yourdomain.com';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

export async function sendVerificationEmail(
  to: string,
  firstName: string,
  verifyUrl: string,
) {
  await resend.emails.send({
    from: `MDRRMO Mansalay <${FROM}>`,
    to,
    subject: 'Verify your MDRRMO Volunteer Portal account',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <div style="background: linear-gradient(135deg, #f97316, #dc2626); padding: 24px; border-radius: 12px; text-align: center; margin-bottom: 24px;">
          <h1 style="color: white; margin: 0; font-size: 24px;">MDRRMO Mandalay</h1>
          <p style="color: rgba(255,255,255,0.85); margin: 8px 0 0;">Volunteer Management System</p>
        </div>
        <h2 style="color: #1f2937; margin-bottom: 8px;">Hi ${firstName}, verify your email</h2>
        <p style="color: #6b7280; margin-bottom: 24px; line-height: 1.6;">
          Thank you for registering as a volunteer. Please verify your email address to activate your account and start your application.
        </p>
        <a href="${verifyUrl}"
          style="display: inline-block; background: #f97316; color: white; font-weight: 600; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-size: 16px;">
          Verify Email Address
        </a>
        <p style="color: #9ca3af; font-size: 14px; margin-top: 24px;">
          This link expires in 24 hours. If you did not create an account, you can ignore this email.
        </p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
        <p style="color: #9ca3af; font-size: 12px;">
          MDRRMO Mansalay · Municipal Hall, Mansalay, Quezon · mdrrmo@mansalay.gov.ph
        </p>
      </div>
    `,
  });
}

export async function sendPasswordResetEmail(
  to: string,
  firstName: string,
  resetUrl: string,
) {
  await resend.emails.send({
    from: `MDRRMO Mansalay <${FROM}>`,
    to,
    subject: 'Reset your MDRRMO Volunteer Portal password',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <div style="background: linear-gradient(135deg, #f97316, #dc2626); padding: 24px; border-radius: 12px; text-align: center; margin-bottom: 24px;">
          <h1 style="color: white; margin: 0; font-size: 24px;">MDRRMO Mandalay</h1>
          <p style="color: rgba(255,255,255,0.85); margin: 8px 0 0;">Password Reset Request</p>
        </div>
        <h2 style="color: #1f2937; margin-bottom: 8px;">Hi ${firstName}, reset your password</h2>
        <p style="color: #6b7280; margin-bottom: 24px; line-height: 1.6;">
          We received a request to reset your password. Click the button below to create a new password.
        </p>
        <a href="${resetUrl}"
          style="display: inline-block; background: #f97316; color: white; font-weight: 600; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-size: 16px;">
          Reset Password
        </a>
        <p style="color: #9ca3af; font-size: 14px; margin-top: 24px;">
          This link expires in 1 hour. If you did not request a password reset, you can safely ignore this email.
        </p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
        <p style="color: #9ca3af; font-size: 12px;">
          MDRRMO Mansalay · mdrrmo@mansalay.gov.ph
        </p>
      </div>
    `,
  });
}

export async function sendApplicationReceivedEmail(
  to: string,
  firstName: string,
  applicationId: string,
) {
  await resend.emails.send({
    from: `MDRRMO Mansalay <${FROM}>`,
    to,
    subject: 'Your volunteer application has been received — MDRRMO Mandalay',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <div style="background: linear-gradient(135deg, #f97316, #dc2626); padding: 24px; border-radius: 12px; text-align: center; margin-bottom: 24px;">
          <h1 style="color: white; margin: 0; font-size: 24px;">MDRRMO Mandalay</h1>
          <p style="color: rgba(255,255,255,0.85); margin: 8px 0 0;">Application Received</p>
        </div>
        <h2 style="color: #1f2937;">Hi ${firstName}, we got your application!</h2>
        <p style="color: #6b7280; line-height: 1.6;">
          Your volunteer application (ID: <strong>${applicationId}</strong>) has been successfully submitted. Our team will review it within <strong>3–5 business days</strong>.
        </p>
        <div style="background: #fff7ed; border: 1px solid #fed7aa; border-radius: 8px; padding: 16px; margin: 20px 0;">
          <p style="margin: 0; color: #92400e; font-size: 14px;">
            <strong>What happens next?</strong><br/>
            1. MDRRMO staff will review your application and documents<br/>
            2. You will receive an email with the decision<br/>
            3. If approved, you will be contacted for orientation
          </p>
        </div>
        <a href="${APP_URL}/profile"
          style="display: inline-block; background: #f97316; color: white; font-weight: 600; padding: 12px 28px; border-radius: 8px; text-decoration: none;">
          Track Your Application
        </a>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
        <p style="color: #9ca3af; font-size: 12px;">
          MDRRMO Mansalay · mdrrmo@mansalay.gov.ph
        </p>
      </div>
    `,
  });
}

export async function sendApplicationApprovedEmail(
  to: string,
  firstName: string,
) {
  await resend.emails.send({
    from: `MDRRMO Mansalay <${FROM}>`,
    to,
    subject: '🎉 Your MDRRMO volunteer application has been approved!',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <div style="background: linear-gradient(135deg, #22c55e, #16a34a); padding: 24px; border-radius: 12px; text-align: center; margin-bottom: 24px;">
          <h1 style="color: white; margin: 0;">Application Approved! 🎉</h1>
        </div>
        <h2 style="color: #1f2937;">Congratulations, ${firstName}!</h2>
        <p style="color: #6b7280; line-height: 1.6;">
          Your volunteer application has been <strong style="color: #16a34a;">approved</strong> by MDRRMO Mandalay. Welcome to the team! You will be contacted by our staff for the next steps including orientation and deployment scheduling.
        </p>
        <a href="${APP_URL}/profile"
          style="display: inline-block; background: #f97316; color: white; font-weight: 600; padding: 12px 28px; border-radius: 8px; text-decoration: none;">
          View Your Profile
        </a>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
        <p style="color: #9ca3af; font-size: 12px;">MDRRMO Mansalay · mdrrmo@mansalay.gov.ph</p>
      </div>
    `,
  });
}

export async function sendApplicationRejectedEmail(
  to: string,
  firstName: string,
  reason?: string,
) {
  await resend.emails.send({
    from: `MDRRMO Mandalay <${FROM}>`,
    to,
    subject: 'Update on your MDRRMO volunteer application',
    html: `
     <div
      style="
        font-family: sans-serif;
        max-width: 600px;
        margin: 0 auto;
        padding: 24px;
      "
    >
      <div
        style="
          background: red;
          padding: 24px;
          border-radius: 12px;
          text-align: center;
          margin-bottom: 24px;
        "
      >
        <h1 style="color: white; margin: 0">Application Update</h1>
      </div>
      <h2 style="color: #1f2937">Hi ${firstName},</h2>
      <p style="color: #6b7280; line-height: 1.6">
        After careful review, we are unable to approve your volunteer
        application at this time.
      </p>
      ${
        reason
          ? `<div
        style="
          background: #f9fafb;
          border-left: 4px solid #f97316;
          padding: 16px;
          margin: 16px 0;
        "
        ><p style="margin: 0; color: #374151"
          ><strong>Reason:</strong> ${reason}</p
        ></div
      >`
          : ''
      }
      <p style="color: #6b7280; line-height: 1.6">
        You are welcome to re-apply after addressing any noted concerns. For
        questions, please contact our office directly at mdrrmo@mandalay.gov.ph.
      </p>
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0" />
      <p style="color: #9ca3af; font-size: 12px"
        >MDRRMO Mandalay · mdrrmo@mandalay.gov.ph</p
      >
    </div>
    `,
  });
}
