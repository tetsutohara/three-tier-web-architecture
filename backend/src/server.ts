import express from "express";
import { requireAuth } from "./auth/cognitoJwt.js";
import { operationDB } from "./db/operationDB.js";

const app = express();
app.use(express.json());

app.post("/api/food", requireAuth, operationDB, async (req, res) => {
  res.json({ ok: true, message: "Response from proxy server" });
})

app.listen(3000, () => console.log("listening on 3000"));