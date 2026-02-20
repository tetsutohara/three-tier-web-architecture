import { Amplify } from "aws-amplify";
import { signInWithRedirect, signOut, fetchAuthSession } from "aws-amplify/auth";

export function configureAuth() {
  Amplify.configure({
    Auth: {
      Cognito: {
        userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
        userPoolClientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
        loginWith: {
          oauth: {
            domain: import.meta.env.VITE_COGNITO_DOMAIN,
            scopes: ["openid", "email", "profile"],
            redirectSignIn: [import.meta.env.VITE_COGNITO_REDIRECT],
            redirectSignOut: [import.meta.env.VITE_COGNITO_REDIRECT],
            responseType: "code", // Authorization Code + PKCE
          },
        },
      },
    },
  });
}

export async function login() {
  // Hosted UIへリダイレクト
  await signInWithRedirect();
}

export async function logout() {
  await signOut({ global: false });
}

export async function getSub(): Promise<string | null> {
  try {
    const session = await fetchAuthSession();
    const idToken = session.tokens?.idToken;
    const payload = idToken?.payload as any;
    return payload?.sub ?? null;
  } catch {
    return null;
  }
}