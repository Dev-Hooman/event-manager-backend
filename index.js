import { app } from "./src/app.js";
import config from "./src/config/appconfig.js";
import { connectDB } from "./src/db/index.js";

const startApp = async () => {
  connectDB()
    .then(() => {
      app.listen(config.app.port, () => {
        console.log(
          `Server running on port ${config.app.port}\nlink: http://localhost:${config.app.port}`
        );
      });
    })
    .catch((error) => {
      console.error("MONGO DB Connection Failed!! ", error);
    });
};

startApp();
