import { seoObject } from "./seo";
import { product } from "./product";
import { complaint } from "./complaint";
import { blogPost } from "./blogPost";
import { siteSettings } from "./siteSettings";
import { page } from "./page";
import { blockTypes } from "./blocks";

export const schemaTypes = [seoObject, product, complaint, blogPost, siteSettings, page, ...blockTypes];
