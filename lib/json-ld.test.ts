import { describe, expect, test } from "bun:test";
import { serializeJsonLd } from "./json-ld";

describe("serializeJsonLd", () => {
  test("escapes angle brackets so values cannot break out of a script tag", () => {
    const html = serializeJsonLd({
      headline: "</script><script>alert(1)</script>",
    });
    expect(html).not.toContain("</script>");
    expect(html).toContain("\\u003c/script>");
  });
});
