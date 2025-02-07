import "dotenv/config";

export const config = {
  app: {
    port: process.env.DEV_APP_PORT || 3000,
    appName: process.env.APP_NAME || "node_app",
    env: process.env.NODE_ENV || "development",
    base_url: process.env.SERVER_BASE_URL,
  },
  db: {
    mongodb_uri: process.env.MONGODB_URI,
    name: process.env.DB_NAME || "test_db",
    logging: true,
  },
  auth: {
    jwt_secret: process.env.JWT_SECRET,
    jwt_expiresin: process.env.JWT_EXPIRES_IN || "1d",
    saltRounds: parseInt(process.env.SALT_ROUND, 10) || 10,
    refresh_token_expiresin: process.env.REFRESH_TOKEN_EXPIRES_IN || "2d",
    active_roles: ["user", "superadmin", "vendor"],
  },
  nodemailer: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASS,
    sender_mail: process.env.NODEMAILER_SENDER_MAIL || "email@gmail.com",
    host: process.env.NODEMAILER_HOST || "gmail",
    port: process.env.NODEMAILER_PORT || 465,
  },
  api: {
    base_path: process.env.API_BASE_PATH || "/api/v1",
  },
};

export default config;
