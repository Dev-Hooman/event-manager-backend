import config from "../config/appconfig.js";

/**
 * Generates an HTML email template for password reset OTP.
 *
 * @param {string} otpCode - The OTP code to reset the password.
 * @param {string} validityDuration - The validity duration of the OTP.
 * @returns {string} - The HTML string for the email content.
 */
export function otpTemplate(otpCode, validityDuration) {
  return `
        <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f9;
                margin: 0;
                padding: 0;
              }
              .container {
                width: 100%;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #ffffff;
                border-radius: 8px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              }
              .header {
                text-align: center;
                margin-bottom: 20px;
              }
              .header h1 {
                color: #43C0DB;
                font-size: 24px;
                margin: 0;
              }
              .content {
                font-size: 16px;
                color: #333333;
                line-height: 1.5;
              }
              .content p {
                margin-bottom: 15px;
              }
              .code {
                display: inline-block;
                background-color: #f1f1f1;
                color: #333333;
                padding: 10px 20px;
                font-size: 18px;
                font-weight: bold;
                border-radius: 4px;
                margin-top: 15px;
              }
              .otp_body {
                display: flex;
                justify-content: center;
              }
              .footer {
                text-align: center;
                margin-top: 30px;
                font-size: 12px;
                color: #888888;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Password Reset Request</h1>
              </div>
              <div class="content">
                <p>Hello,</p>
                <p>We received a request to reset your password. If you made this request, please use the following OTP code to reset your password:</p>
                <div class="otp_body">
                  <div class="code">${otpCode}</div>
                </div>
                <p>The OTP is valid for: ${validityDuration}</p>
                <p>If you did not request this, please ignore this email or contact support.</p>
              </div>
              <div class="footer">
                <p>&copy; ${new Date().getFullYear()} ${config.app.appName}. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
    `;
}


/**
 * Generates an HTML email template to notify the user that their password has been successfully updated.
 *
 * @param {string} email - The user's email address to personalize the email.
 * @returns {string} - The HTML string for the email content.
 */
export function passwordUpdatedTemplate(email) {
  return `
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f7fa;
            margin: 0;
            padding: 0;
          }
          .container {
            width: 100%;
            max-width: 650px;
            margin: 0 auto;
            padding: 25px;
            background-color: #ffffff;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .header h1 {
            color: #43C0DB;
            font-size: 28px;
            margin: 0;
          }
          .content {
            font-size: 16px;
            color: #4a5568;
            line-height: 1.6;
            margin-bottom: 20px;
          }
          .content p {
            margin-bottom: 15px;
          }
          .footer {
            text-align: center;
            margin-top: 25px;
            font-size: 12px;
            color: #a0aec0;
          }
          .button {
            display: inline-block;
            padding: 10px 20px;
            margin-top: 20px;
            background-color: #3182ce;
            color: white !important;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
          }
          .button:hover {
            background-color: #2b6cb0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Password Successfully Updated</h1>
          </div>
          <div class="content">
            <p>Dear ${email},</p>
            <p>We are writing to confirm that your password has been successfully updated. If you initiated this change, no further action is required on your part.</p>
            <p>If you did not request this change, or if you believe this update was made in error, please contact our support team immediately. Your security is our top priority.</p>
            <p>Thank you for choosing <strong>${config.app.appName}</strong>.</p>
            <a href="${config.app.supportUrl}" class="button">Contact Support</a>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} ${config.app.appName}. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}
