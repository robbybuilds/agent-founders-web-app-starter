import { describe, expect, it } from "vitest";

import {
  findForbiddenDependencies,
  findSecretLikeValues,
  isProbablyText,
} from "../../scripts/check-repository.mjs";

describe("findForbiddenDependencies", () => {
  it("flags services and abstractions outside the golden path", () => {
    expect(
      findForbiddenDependencies({
        dependencies: { "@prisma/client": "latest", zustand: "latest" },
        devDependencies: {},
      }),
    ).toEqual(["@prisma/client", "zustand"]);
  });

  it("allows the approved stack", () => {
    expect(
      findForbiddenDependencies({
        dependencies: { next: "latest", "@supabase/supabase-js": "latest" },
        devDependencies: { vitest: "latest" },
      }),
    ).toEqual([]);
  });
});

describe("findSecretLikeValues", () => {
  it("flags assigned secret keys and private keys", () => {
    const content = [
      `${["SUPABASE", "SERVICE", "ROLE", "KEY"].join("_")}=real-secret-value`,
      ["-----BEGIN", "PRIVATE KEY-----"].join(" "),
    ].join("\n");

    expect(findSecretLikeValues(content)).toEqual([
      "assigned service-role key",
      "private key material",
    ]);
  });

  it("does not flag documentation that names a secret", () => {
    expect(
      findSecretLikeValues("Never expose SUPABASE_SERVICE_ROLE_KEY in browser code."),
    ).toEqual([]);
  });

  it("flags generic assigned credentials and current provider keys", () => {
    expect(
      findSecretLikeValues(
        [
          [["API", "TOKEN"].join("_"), "very-long-live-credential-value-12345"].join("="),
          [
            ["SUPABASE", "SECRET", "KEY"].join("_"),
            ["sb", "secret", "1234567890abcdefghijklmnopqrstuvwxyz"].join("_"),
          ].join("="),
        ].join("\n"),
      ),
    ).toEqual(["Supabase secret key", "assigned credential"]);
  });

  it("allows obvious placeholders", () => {
    expect(
      findSecretLikeValues(
        ["API_TOKEN=your-access-token", "SUPABASE_SECRET_KEY=placeholder"].join("\n"),
      ),
    ).toEqual([]);
  });
});

describe("isProbablyText", () => {
  it("accepts text regardless of its filename extension", () => {
    expect(isProbablyText(Buffer.from("token in credentials.txt"))).toBe(true);
  });

  it("rejects binary content", () => {
    expect(isProbablyText(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x00]))).toBe(false);
  });
});
