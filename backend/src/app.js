import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import commentRoutes from "./routes/comment.routes.js";
import newsRoutes from "./routes/news.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
import serviceRoutes from "./routes/service.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import pdfRoutes from "./routes/pdf.routes.js";

const app = express();

// Definir el origen según el entorno
const origin =
  process.env.NODE_ENV === "production"
    ? process.env.CORS_ORIGIN_PROD
    : process.env.CORS_ORIGIN_LOCAL;

console.log("Frontend URL:", origin);

app.use(
  cors({
    origin: origin,
    optionsSuccessStatus: 200,
    credentials: true,
  })
);

app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

app.use("/api", authRoutes);
app.use("/api", commentRoutes);
app.use("/api", newsRoutes);
app.use("/api", bookingRoutes);
app.use("/api", serviceRoutes);
app.use("/api", paymentRoutes);
app.use("/api", pdfRoutes);

// Ruta principal
app.get("/", (req, res) => {
  res.send("¡Hola desde el backend!");
});

export default app;
