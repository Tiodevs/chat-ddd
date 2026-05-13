import { describe, expect, it } from "vitest";

import { NodeCryptoIdGenerator } from "./node-crypto-id-generator.js";

describe("NodeCryptoIdGenerator", () => {
  it("deve gerar ids únicos em formato UUID", () => {
    const generator = new NodeCryptoIdGenerator();

    const firstId = generator.generate();
    const secondId = generator.generate();

    expect(firstId).not.toBe(secondId);
    expect(firstId).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
    );
  });
});
