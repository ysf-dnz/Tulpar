import type { DocumentActionsResolver } from "sanity";

export const documentActions: DocumentActionsResolver = (prev, ctx) => {
  if (ctx.schemaType === "complaint") {
    return prev.filter((a) => !["delete", "duplicate", "unpublish"].includes(a.action ?? ""));
  }
  return prev;
};
