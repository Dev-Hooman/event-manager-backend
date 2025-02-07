import transporter from "../config/nodemailer-config.js";

/**
 * Sends an email using the specified transporter.
 *
 * @param {string} from - The email address of the sender.
 * @param {string} to - The recipient's email address.
 * @param {string} subject - The subject of the email.
 * @param {string} html - The HTML content of the email body.
 * @returns {Promise<{success: boolean, info?: object, error?: object}>}
 *          - An object indicating the success status, with additional information or error details.
 */
export async function sendEmail(from, to, subject, html) {
  const mailOptions = {
    from: from,
    to: to,
    subject: subject,
    html: html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
    return { success: true, info };
  } catch (error) {
    console.error("Failed to send email:", error);
    return { success: false, error };
  }
}