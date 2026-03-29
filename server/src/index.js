import connectDB from "./db/index.js";
import express from "express";
import cors from "cors";
const app = express();
connectDB();

app.use(express.json());



