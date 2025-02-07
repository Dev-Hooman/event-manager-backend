import nodemailer from "nodemailer";
import config from "./appconfig.js";

/**
 * Transporter for nodemailer which helps to authenticate nodemailer user
 *
 * @type {*}
 */

const transporter = nodemailer.createTransport({
  host: config.nodemailer.host,
  port: config.nodemailer.port,
  secure: true,
  service: "",
  auth: {
    user: config.nodemailer.user,
    pass: config.nodemailer.pass,
  },
});

export default transporter;
