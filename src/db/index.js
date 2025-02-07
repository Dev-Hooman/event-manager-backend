import mongoose from "mongoose";
import config from "../config/appconfig.js";

export async function connectDB() {
  try {
    const connectionInstance = await mongoose.connect(
      `${config.db.mongodb_uri}`,
      {
        dbName: `${config.db.name}`,
      }
    );

    console.log(
      `\nMONGODB CONNECTED!! DB HOST: ${connectionInstance.connection.host}.`
    );
  } catch (error) {
    console.log("MONGODB CONNECTION FAILED: ", error);
    process.exit(1);
  }
}
