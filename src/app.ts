import express, { Express } from "express";
import mongoose, { ConnectOptions } from "mongoose";
import cors from "cors";
import sessionRoutes from "./routes";

require('dotenv').config();

const app: Express = express();

const PORT: string | number = process.env.PORT || 4000;

app.use(cors());
app.use(sessionRoutes);

const uri: string = process.env.MONGODB!;
 
mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as ConnectOptions)
  .then(() =>
    console.log("connected db")
  )
  .catch((error) => {
    throw error;
  });

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
)