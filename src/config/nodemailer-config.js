import nodemailer from "nodemailer";
import config from "./appconfig.js";

/**
 * Transporter for nodemailer which helps to authenticate nodemailer user
 *
 * @type {*}
 */

const transporter = nodemailer.createTransport({
  secure: true,
  service: 'gmail',
  auth: {
    user: config.nodemailer.user,
    pass: config.nodemailer.pass,
  },
});

export default transporter;
