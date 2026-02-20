import express from "express";
import { meRouter } from "./routes/me";

const app = express();
app.use(express.json());

// /api 配下に置く（CloudFrontで api/* をALBへ回している想定）
app.use("/api", meRouter);

app.listen(3000, () => console.log("listening on 3000"));