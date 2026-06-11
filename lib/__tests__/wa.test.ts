import { describe, expect, test } from "vitest";
import { buildWaLink, fillTemplate } from "@/lib/wa";

describe("fillTemplate", () => {
  test("yer tutucuları doldurur", () => {
    expect(fillTemplate("Merhaba, {urun} ({olcu})", { urun: "Bozkır", olcu: "160x230" }))
      .toBe("Merhaba, Bozkır (160x230)");
  });
});

describe("buildWaLink", () => {
  test("wa.me linki + Ref kodu (WA-05, WA-06)", () => {
    const url = buildWaLink({ number: "905001112233", message: "Merhaba", refCode: "UD-bozkir" });
    expect(url).toBe("https://wa.me/905001112233?text=" + encodeURIComponent("Merhaba\n\nRef: UD-bozkir"));
  });
  test("ref kodu yoksa eklenmez", () => {
    const url = buildWaLink({ number: "905001112233", message: "Merhaba" });
    expect(url).toBe("https://wa.me/905001112233?text=" + encodeURIComponent("Merhaba"));
  });
});
