import 'dotenv/config'
import type { Request, Response, NextFunction } from "express";
import { CognitoJwtVerifier } from "aws-jwt-verify";

const region = process.env.COGNITO_REGION!;
const userPoolId = process.env.COGNITO_USER_POOL_ID!;
const clientId = process.env.COGNITO_CLIENT_ID!;

// Access Token 用（token_use = "access"）
const verifier = CognitoJwtVerifier.create({
  userPoolId,
  tokenUse: "access",
  clientId, // access token の場合は clientId を検証対象にできる
});

function getBearerToken(req: Request): string | null | undefined {
  const h = req.headers.authorization;
  if (!h) return null;
  const m = h.match(/^Bearer\s+(.+)$/i);
  return m ? m[1] : null;
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = getBearerToken(req);
  if (!token) return res.status(401).json({ message: "Missing Authorization Bearer token" });

  try {
    const payload = await verifier.verify(token);

    // ここで「誰が呼んだか」が取れる
    // payload.sub, payload.username, payload.scope など
    (req as any).user = payload;

    return next();
  } catch (e) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}