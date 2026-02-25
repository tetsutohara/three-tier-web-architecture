import { $ } from "./utils";
import { getAccessToken } from "./utils";
import { configureAuth } from "./auth";
import { getSub } from "./auth";

interface Response {
  message: string;
}

configureAuth();
const accessToken = await getAccessToken();

const form = $("stock-info") as HTMLFormElement;

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  let sendData = Object.fromEntries(formData.entries());

  const sub = await getSub();
  if (!sub) {
    console.error("Invalid to find login info");
    return;
  }

  sendData = Object.assign({ "userId": sub }, sendData);

  try {
    const res = await fetch("/api/food", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
      },
      body: JSON.stringify(sendData),
    });

    const resData = await res.json() as Response;

    if (!res.ok) {
      console.error(resData.message);
      return;
    }
    console.log(resData.message);
  } catch (e: any) {
    console.error(e.message);
  }
});
