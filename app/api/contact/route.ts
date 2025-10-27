import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// hCaptcha verification
async function verifyHCaptcha(token: string): Promise<boolean> {
  try {
    const response = await fetch('https://hcaptcha.com/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        secret: process.env.HCAPTCHA_SECRET_KEY!,
        response: token,
      }),
    });

    const result = await response.json();
    return result.success === true;
  } catch (error) {
    console.error('hCaptcha verification error:', error);
    return false;
  }
}

// Email templates
const createEmailTemplate = (data: {
  name: string;
  email: string;
  company?: string;
  message: string;
  language?: string;
}) => {
  const isFrench = data.language === 'fr';

  return {
    subject: isFrench
      ? `Nouvelle demande de contact: ${data.name}`
      : `New Contact Request: ${data.name}`,
    html: isFrench ? `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Nouvelle demande de contact</title>
      </head>
      <body style="font-family: Inter, -apple-system, BlinkMacSystemFont, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #0A84FF, #0F62FE); padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 30px;">
          <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">StructureClerk</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Nouvelle demande de contact</p>
        </div>

        <div style="background: #f8f9fa; padding: 25px; border-radius: 12px; margin-bottom: 20px;">
          <h2 style="color: #0B1220; margin: 0 0 20px 0; font-size: 20px;">Informations du contact</h2>

          <div style="display: grid; gap: 15px;">
            <div>
              <strong style="color: #64748B; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Nom:</strong>
              <p style="margin: 5px 0; font-size: 16px;">${data.name}</p>
            </div>

            <div>
              <strong style="color: #64748B; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Courriel:</strong>
              <p style="margin: 5px 0; font-size: 16px;">${data.email}</p>
            </div>

            ${data.company ? `
            <div>
              <strong style="color: #64748B; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Entreprise:</strong>
              <p style="margin: 5px 0; font-size: 16px;">${data.company}</p>
            </div>
            ` : ''}
          </div>
        </div>

        <div style="background: white; border: 1px solid #e2e8f0; padding: 25px; border-radius: 12px;">
          <h2 style="color: #0B1220; margin: 0 0 15px 0; font-size: 20px;">Message</h2>
          <p style="margin: 0; white-space: pre-wrap; font-size: 16px; line-height: 1.7;">${data.message}</p>
        </div>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center; color: #64748B; font-size: 14px;">
          <p>Ce message a été envoyé depuis le formulaire de contact de StructureClerk</p>
          <p style="margin: 5px 0;">Date: ${new Date().toLocaleString('fr-CA', {
            timeZone: 'America/Montreal',
            dateStyle: 'long',
            timeStyle: 'long'
          })}</p>
        </div>
      </body>
      </html>
    ` : `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Contact Request</title>
      </head>
      <body style="font-family: Inter, -apple-system, BlinkMacSystemFont, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #0A84FF, #0F62FE); padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 30px;">
          <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">StructureClerk</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">New Contact Request</p>
        </div>

        <div style="background: #f8f9fa; padding: 25px; border-radius: 12px; margin-bottom: 20px;">
          <h2 style="color: #0B1220; margin: 0 0 20px 0; font-size: 20px;">Contact Information</h2>

          <div style="display: grid; gap: 15px;">
            <div>
              <strong style="color: #64748B; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Name:</strong>
              <p style="margin: 5px 0; font-size: 16px;">${data.name}</p>
            </div>

            <div>
              <strong style="color: #64748B; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Email:</strong>
              <p style="margin: 5px 0; font-size: 16px;">${data.email}</p>
            </div>

            ${data.company ? `
            <div>
              <strong style="color: #64748B; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Company:</strong>
              <p style="margin: 5px 0; font-size: 16px;">${data.company}</p>
            </div>
            ` : ''}
          </div>
        </div>

        <div style="background: white; border: 1px solid #e2e8f0; padding: 25px; border-radius: 12px;">
          <h2 style="color: #0B1220; margin: 0 0 15px 0; font-size: 20px;">Message</h2>
          <p style="margin: 0; white-space: pre-wrap; font-size: 16px; line-height: 1.7;">${data.message}</p>
        </div>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center; color: #64748B; font-size: 14px;">
          <p>This message was sent from the StructureClerk contact form</p>
          <p style="margin: 5px 0;">Date: ${new Date().toLocaleString('en-CA', {
            timeZone: 'America/Montreal',
            dateStyle: 'long',
            timeStyle: 'long'
          })}</p>
        </div>
      </body>
      </html>
    `,
  };
};

// Auto-reply to contact
const createAutoReplyTemplate = (data: { name: string; language?: string }) => {
  const isFrench = data.language === 'fr';

  return {
    subject: isFrench
      ? 'Merci de nous avoir contactés - StructureClerk'
      : 'Thank you for contacting StructureClerk',
    html: isFrench ? `
      <!DOCTYPE html>
      <html>
      <body style="font-family: Inter, -apple-system, BlinkMacSystemFont, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #0A84FF, #0F62FE); padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 30px;">
          <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">StructureClerk</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Merci de votre intérêt!</p>
        </div>

        <div style="background: #f8f9fa; padding: 25px; border-radius: 12px; margin-bottom: 20px;">
          <h2 style="color: #0B1220; margin: 0 0 15px 0;">Bonjour ${data.name},</h2>
          <p style="margin: 0 0 15px 0;">Merci de nous avoir contactés chez StructureClerk. Nous avons bien reçu votre message et vous répondrons dans les 24 heures ouvrables.</p>

          <p style="margin: 0 0 15px 0;">En attendant, n'hésitez pas à explorer nos ressources:</p>
          <ul style="margin: 0 0 20px 0; padding-left: 20px;">
            <li style="margin: 5px 0;">Essayer notre <a href="https://structureclerk.ca/demo" style="color: #0A84FF;">démo en direct</a></li>
            <li style="margin: 5px 0;">Consulter nos <a href="https://structureclerk.ca/pricing" style="color: #0A84FF;">tarifs</a></li>
            <li style="margin: 5px 0;">Découvrir nos <a href="https://structureclerk.ca/features" style="color: #0A84FF;">fonctionnalités</a></li>
          </ul>

          <p style="margin: 0;">Si votre demande est urgente, vous pouvez nous appeler au +1 (514) 555-0123.</p>
        </div>

        <div style="text-align: center; color: #64748B; font-size: 14px; margin-top: 30px;">
          <p>Cordialement,<br>L'équipe StructureClerk</p>
        </div>
      </body>
      </html>
    ` : `
      <!DOCTYPE html>
      <html>
      <body style="font-family: Inter, -apple-system, BlinkMacSystemFont, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #0A84FF, #0F62FE); padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 30px;">
          <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">StructureClerk</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Thank you for your interest!</p>
        </div>

        <div style="background: #f8f9fa; padding: 25px; border-radius: 12px; margin-bottom: 20px;">
          <h2 style="color: #0B1220; margin: 0 0 15px 0;">Hello ${data.name},</h2>
          <p style="margin: 0 0 15px 0;">Thank you for contacting StructureClerk. We've received your message and will respond within 24 business hours.</p>

          <p style="margin: 0 0 15px 0;">In the meantime, feel free to explore our resources:</p>
          <ul style="margin: 0 0 20px 0; padding-left: 20px;">
            <li style="margin: 5px 0;">Try our <a href="https://structureclerk.ca/demo" style="color: #0A84FF;">live demo</a></li>
            <li style="margin: 5px 0;">Check our <a href="https://structureclerk.ca/pricing" style="color: #0A84FF;">pricing</a></li>
            <li style="margin: 5px 0;">Explore our <a href="https://structureclerk.ca/features" style="color: #0A84FF;">features</a></li>
          </ul>

          <p style="margin: 0;">If your inquiry is urgent, you can call us at +1 (514) 555-0123.</p>
        </div>

        <div style="text-align: center; color: #64748B; font-size: 14px; margin-top: 30px;">
          <p>Best regards,<br>The StructureClerk Team</p>
        </div>
      </body>
      </html>
    `,
  };
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, company, message, captchaToken, language = 'en' } = body;

    // Validate required fields
    if (!name || !email || !message || !captchaToken) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Verify hCaptcha
    const captchaValid = await verifyHCaptcha(captchaToken);
    if (!captchaValid) {
      return NextResponse.json(
        { error: 'hCaptcha verification failed' },
        { status: 400 }
      );
    }

    // Prepare contact data
    const contactData = { name, email, company, message, language };
    const emailTemplate = createEmailTemplate(contactData);
    const autoReplyTemplate = createAutoReplyTemplate({ name, language });

    // Send email to StructureClerk
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'noreply@structureclerk.ca',
      to: 'hello@structureclerk.ca',
      ...emailTemplate,
      reply_to: email,
    });

    // Send auto-reply to contact
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'noreply@structureclerk.ca',
      to: email,
      ...autoReplyTemplate,
    });

    // Log contact for analytics (no PII)
    console.log('Contact form submission:', {
      hasCompany: !!company,
      messageLength: message.length,
      language,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: language === 'fr'
        ? 'Votre message a été envoyé avec succès!'
        : 'Your message has been sent successfully!'
    });

  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      {
        error: 'Failed to send message. Please try again or contact us directly at hello@structureclerk.ca',
        success: false
      },
      { status: 500 }
    );
  }
}