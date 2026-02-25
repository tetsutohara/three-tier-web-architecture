import { fetchAuthSession } from "aws-amplify/auth";


export function $(id: string) {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Element not found: ${id}`);
  return el;
}

export async function getAccessToken(): Promise<string | null> {
  const session = await fetchAuthSession();
  return session.tokens?.accessToken?.toString() ?? null;
}