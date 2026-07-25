import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../data/site.js", () => ({
  site: {
    name: "The Ten Talents Initiative",
    email: "thetentalentsinitiative@gmail.com",
  },
}));

describe("submitContactMessage", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("throws when access key is missing", async () => {
    vi.stubEnv("VITE_WEB3FORMS_ACCESS_KEY", "");
    const { submitContactMessage } = await import("./contact.js");

    await expect(
      submitContactMessage({
        name: "Ada",
        email: "ada@example.com",
        message: "Hello",
      })
    ).rejects.toThrow(/not configured/i);
  });

  it("posts to Web3Forms and returns payload on success", async () => {
    vi.stubEnv("VITE_WEB3FORMS_ACCESS_KEY", "test-access-key");
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, message: "OK" }),
    });
    vi.stubGlobal("fetch", fetchMock);

    const { submitContactMessage } = await import("./contact.js");
    const result = await submitContactMessage({
      name: "Ada",
      email: "ada@example.com",
      subject: "Question",
      message: "Hello there",
    });

    expect(result).toEqual({ success: true, message: "OK" });
    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toBe("https://api.web3forms.com/submit");
    expect(options.method).toBe("POST");
    const body = JSON.parse(options.body);
    expect(body).toMatchObject({
      access_key: "test-access-key",
      name: "Ada",
      email: "ada@example.com",
      subject: "Question",
      message: "Hello there",
      replyto: "ada@example.com",
    });
  });

  it("throws when Web3Forms reports failure", async () => {
    vi.stubEnv("VITE_WEB3FORMS_ACCESS_KEY", "test-access-key");
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({ success: false, message: "Invalid key" }),
      })
    );

    const { submitContactMessage } = await import("./contact.js");
    await expect(
      submitContactMessage({
        name: "Ada",
        email: "ada@example.com",
        message: "Hello",
      })
    ).rejects.toThrow(/Invalid key/);
  });
});
