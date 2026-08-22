import { describe, expect, it } from "vitest";

import {
  findForbiddenDependencies,
  findSecretLikeValues,
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
});
