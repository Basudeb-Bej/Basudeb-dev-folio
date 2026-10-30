// back-end/controllers/contactController.js
'use strict';

const axios = require('axios');
const mongoose = require('mongoose');
const Contact = require('../modals/contactModel');

const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 254;
const MAX_MESSAGE_LENGTH = 10000;

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const isMongoAvailable = () => mongoose.connection.readyState === 1;

const formatReceivedDate = (date) => {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return 'Not available';
  }

  return (
    new Intl.DateTimeFormat('en-IN', {
      dateStyle: 'long',
      timeStyle: 'medium',
      timeZone: 'Asia/Kolkata',
    }).format(parsedDate) + ' IST'
  );
};

const validateContactInput = (body) => {
  const name = typeof body?.name === 'string' ? body.name.trim() : '';
  const email = typeof body?.email === 'string' ? body.email.trim() : '';
  const message = typeof body?.message === 'string' ? body.message.trim() : '';

  if (!name || !email || !message) {
    return { error: 'Name, email, and message are required.' };
  }

  if (name.length > MAX_NAME_LENGTH) {
    return { error: `Name must not exceed ${MAX_NAME_LENGTH} characters.` };
  }

  if (email.length > MAX_EMAIL_LENGTH) {
    return { error: 'Email address is too long.' };
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(email)) {
    return { error: 'Please provide a valid email address.' };
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    return { error: `Message must not exceed ${MAX_MESSAGE_LENGTH} characters.` };
  }

  return { value: { name, email, message } };
};

const buildEmail = ({ name, email, message, receivedDateText }) => {
  const safeSubjectName = name.replace(/[\r\n]+/g, ' ').slice(0, MAX_NAME_LENGTH);
  const subject = `Portfolio contact message from ${safeSubjectName}`;

  const replyUrl = `mailto:${email}?subject=${encodeURIComponent(`Re: ${subject}`)}`;

  const html = `
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Portfolio Contact Message</title>
      </head>

      <body style="margin:0;padding:24px;background:#f1f5f9;font-family:Arial,Helvetica,sans-serif;color:#0f172a;">
        <div style="max-width:600px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">

          <div style="padding:26px 24px;background:#0f172a;color:#ffffff;">
            <h2 style="margin:0;font-size:22px;line-height:1.4;">
              New Portfolio Contact Message
            </h2>
            <p style="margin:8px 0 0;color:#cbd5e1;font-size:14px;line-height:1.6;">
              A visitor has submitted your portfolio contact form.
            </p>
          </div>

          <div style="padding:24px;">

            <p style="margin:0 0 8px;font-size:12px;font-weight:bold;letter-spacing:1px;color:#64748b;">
              NAME:
            </p>
            <p style="margin:0 0 22px;font-size:16px;line-height:1.6;color:#0f172a;">
              ${escapeHtml(name)}
            </p>

            <p style="margin:0 0 8px;font-size:12px;font-weight:bold;letter-spacing:1px;color:#64748b;">
              EMAIL ADDRESS:
            </p>
            <p style="margin:0 0 22px;font-size:16px;line-height:1.6;overflow-wrap:anywhere;">
              <a
                href="${escapeHtml(`mailto:${email}`)}"
                style="color:#2563eb;text-decoration:none;"
              >${escapeHtml(email)}</a>
            </p>

            <p style="margin:0 0 8px;font-size:12px;font-weight:bold;letter-spacing:1px;color:#64748b;">
              RECEIVED:
            </p>
            <p style="margin:0 0 22px;font-size:16px;line-height:1.7;color:#0f172a;">
              ${escapeHtml(receivedDateText)}
            </p>

            <p style="margin:0 0 8px;font-size:12px;font-weight:bold;letter-spacing:1px;color:#64748b;">
              MESSAGE:
            </p>

            <div style="padding:18px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;font-size:15px;line-height:1.8;color:#334155;overflow-wrap:anywhere;">
              ${escapeHtml(message).replace(/\r\n|\r|\n/g, '<br />')}
            </div>

            <div style="margin-top:28px;text-align:center;">
              <a
                href="${escapeHtml(replyUrl)}"
                style="display:inline-block;padding:13px 24px;background:#2563eb;color:#ffffff;text-decoration:none;font-size:15px;font-weight:bold;border-radius:8px;"
              >Reply to ${escapeHtml(name)}</a>
            </div>
          </div>

          <div style="padding:16px 24px;background:#f8fafc;border-top:1px solid #e2e8f0;">
            <p style="margin:0;text-align:center;font-size:12px;line-height:1.6;color:#64748b;">
              This is an automated notification from your portfolio contact form.
            </p>
          </div>
        </div>
      </body>
    </html>
  `;

  const text = [
    'New Portfolio Contact Message',
    '',
    `Name: ${name}`,
    `Email: ${email}`,
    `Date & Time Received: ${receivedDateText}`,
    '',
    'Message:',
    message,
    '',
    `Reply to ${name}: ${replyUrl}`,
  ].join('\n');

  return { subject, html, text };
};

const sendContactMessage = async (req, res) => {
  const validation = validateContactInput(req.body);

  if (validation.error) {
    return res.status(400).json({
      success: false,
      message: validation.error,
    });
  }

  const { name, email, message } = validation.value;

  if (!isMongoAvailable()) {
    return res.status(503).json({
      success: false,
      message:
        'The contact service is temporarily unavailable. Please try again later.',
    });
  }

  let savedContact;

  try {
    savedContact = await Contact.create({ name, email, message });
  } catch (error) {
    console.error('Contact database save failed:', error?.message || error);

    return res.status(500).json({
      success: false,
      message: 'Unable to save your message right now. Please try again later.',
    });
  }

  const receivedDate =
    savedContact.submittedAt || savedContact.createdAt || new Date();

  const receivedDateText = formatReceivedDate(receivedDate);

  let emailSent = false;
  let emailWarning;

  try {
    const { RESEND_API_KEY, CONTACT_RECEIVER_EMAIL, CONTACT_SENDER_EMAIL } =
      process.env;

    if (!RESEND_API_KEY || !CONTACT_RECEIVER_EMAIL) {
      emailWarning =
        'Your message was saved, but email notifications are not configured.';
    } else {
      const { subject, html, text } = buildEmail({
        name,
        email,
        message,
        receivedDateText,
      });

      // Until you verify your own domain in Resend, keep the default sender
      // and send only to the email address you signed up to Resend with.
      const from = CONTACT_SENDER_EMAIL || 'Portfolio <onboarding@resend.dev>';

      const response = await axios.post(
        'https://api.resend.com/emails',
        {
          from,
          to: [CONTACT_RECEIVER_EMAIL],
          reply_to: email,
          subject,
          html,
          text,
        },
        {
          headers: {
            Authorization: `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          timeout: 15000,
        }
      );

      if (response.data?.id) {
        emailSent = true;
      } else {
        emailWarning =
          'Your message was saved, but email delivery could not be confirmed.';
      }
    }
  } catch (mailError) {
    console.error(
      'Contact email delivery failed:',
      mailError?.response?.data || mailError?.message || mailError
    );

    emailWarning = 'Your message was saved, but email delivery failed.';
  }

  return res.status(200).json({
    success: true,
    message: emailSent
      ? 'Message sent successfully.'
      : 'Message saved successfully.',
    contactId: savedContact._id,
    submittedAt: savedContact.submittedAt,
    emailSent,
    ...(emailWarning ? { warning: emailWarning } : {}),
  });
};

module.exports = {
  sendContactMessage,
};
