import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";

import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";
import path from "path";

dotenv.config();

const app = express();

// ✅ middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ CORS (important fix)
// app.use(cors({
//   origin: "https://your-frontend-url.onrender.com",
//   credentials: true
// }));
app.use(cors({
  origin: [
    "https://nexthire-jobportal-2-8hfc.onrender.com",
   
  ],
  credentials: true
}));

// ✅ test route (important)
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

// ✅ API routes
app.use("/api/user", userRoute);
app.use("/api/company", companyRoute);
app.use("/api/job", jobRoute);
app.use("/api/application", applicationRoute);

// ----------------- code for deployment -----------------
if (process.env.NODE_ENV === "production") {
  const __dirname = path.resolve();
  app.use(express.static('../Frontend/dist')); 
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(dirpath, './Frontend/dist', 'index.html'));
  }); 
   }








const PORT = process.env.PORT || 5011;

// ✅ DB connect BEFORE server start
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});