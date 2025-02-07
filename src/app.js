import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import config from "./config/appconfig.js";
import compression from "compression";
import path from "path";

// Route Imports
import router from "./router/index.js";

const __dirname = path.resolve();
const app = express();

app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);
app.set(config);
app.use(compression());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "src", "public")));

// Routes
app.get("/", (req, res) => {
  res.send("Server is up and running!");
});

app.use(router);

export { app };
