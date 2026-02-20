import { configureAuth, login, logout, getSub } from "./auth";

function $(id: string) {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Element not found: ${id}`);
  return el;
}

async function refresh() {
  const outSub = $("out-sub");
  const outDebug = $("out-debug");

  const sub = await getSub();
  outSub.textContent = sub ?? "(not signed in)";

  // 参考：URLに ?code=... が付いて戻ってくるので、開発時は見えると便利
  outDebug.textContent = `location.href = ${location.href}`;
}

configureAuth();

$("btn-login").addEventListener("click", () => {
  login().catch(console.error);
});

$("btn-logout").addEventListener("click", () => {
  logout().then(refresh).catch(console.error);
});

$("btn-refresh").addEventListener("click", () => {
  refresh().catch(console.error);
});

// Cognitoから戻ってきた直後でも、ここでトークン取得→sub表示できる
refresh().catch(console.error);