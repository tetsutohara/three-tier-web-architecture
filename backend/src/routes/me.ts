import { Router } from "express";
import { requireAuth } from "../auth/cognitoJwt.ts";

export const meRouter = Router();

meRouter.get("/me", requireAuth, (req, res) => {
  res.json({
    sub: req.auth!.sub,
    username: req.auth!.username ?? null,
    // 必要なら email 等も返せます（scope/設定次第）
    // claims: req.auth!.claims,
  });
});