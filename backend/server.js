import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import feedRoutes from "./routes/feedRoutes.js";
import interestsRoutes from "./routes/interestsRoutes.js";
import subscriptionRoutes from "./routes/subscriptionRoutes.js";
import voteRoutes from "./routes/voteRoutes.js";
import communityRoutes from "./routes/communityRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import userRoutes from "./routes/userRoutes.js"
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "./config/passport.js";

dotenv.config();

const app = express();
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());

app.use("/api/auth", authRoutes);
app.use("/api/communities", communityRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/categories",categoryRoutes );
app.use("/api/dashboards",dashboardRoutes );
app.use("/api/feeds",feedRoutes );
app.use("/api/interests",interestsRoutes );
app.use("/api/subscriptions",subscriptionRoutes );
app.use("/api/votes",voteRoutes );
app.use("/api/users",userRoutes );


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
