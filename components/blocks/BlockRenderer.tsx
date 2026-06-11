import { Hero } from "./Hero";
import { CommitmentGrid } from "./CommitmentGrid";
import { ProductShowcase } from "./ProductShowcase";
import { Manifesto } from "./Manifesto";
import { PanoSummary } from "./PanoSummary";
import { CalculatorCta } from "./CalculatorCta";
import { VideoBand } from "./VideoBand";
import { InstagramStrip } from "./InstagramStrip";
import { FaqAccordion } from "./FaqAccordion";
import { CtaBand } from "./CtaBand";
import { ScrollReveal } from "@/components/flow/ScrollReveal";

const registry: Record<string, React.ComponentType<{ b: never }>> = {
  heroBlock: Hero, commitmentGridBlock: CommitmentGrid, productShowcaseBlock: ProductShowcase,
  manifestoBlock: Manifesto, panoSummaryBlock: PanoSummary, calculatorCtaBlock: CalculatorCta,
  videoBandBlock: VideoBand, instagramStripBlock: InstagramStrip, faqAccordionBlock: FaqAccordion,
  ctaBandBlock: CtaBand,
};

export function BlockRenderer({ blocks }: { blocks: ({ _type: string; _key: string; hidden?: boolean } & object)[] }) {
  return (
    <>
      {(blocks ?? []).filter((b) => !b.hidden).map((b, i) => {
        const Cmp = registry[b._type];
        if (!Cmp) return null;
        const node = <Cmp key={b._key} b={b as never} />;
        return i === 0 ? node : <ScrollReveal key={b._key}>{node}</ScrollReveal>;
      })}
    </>
  );
}
