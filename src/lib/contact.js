import { site } from "../data/site.js";

const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";

export const contactAccessKey =
  import.meta.env.VITE_WEB3FORMS_ACCESS_KEY?.trim() || "";

export const isContactFormConfigured = Boolean(contactAccessKey);

/**
 * Send a contact form message to the site Gmail via Web3Forms.
 * @param {{ name: string, email: string, subject?: string, message: string }} fields
 */
export async function submitContactMessage({ name, email, subject, message }) {
  if (!isContactFormConfigured) {
    throw new Error("Contact form is not configured.");
  }

  const response = await fetch(WEB3FORMS_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      access_key: contactAccessKey,
      from_name: name,
      subject: subject?.trim() || `Contact form — ${site.name}`,
      name,
      email,
      message,
      replyto: email,
    }),
  });

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    /* non-JSON error body */
  }

  if (!response.ok || !payload?.success) {
    throw new Error(payload?.message || "Failed to send message.");
  }

  return payload;
}
