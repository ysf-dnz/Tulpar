import { groq } from "next-sanity";

export const SETTINGS_QUERY = groq`*[_type=="siteSettings"][0]`;
export const PAGE_QUERY = groq`*[_type=="page" && slug.current==$slug][0]{
  ..., blocks[]{ ..., products[]->{title, "slug": slug.current, heroImage, sizeVariants, honestLabel} }
}`;
export const PRODUCTS_QUERY = groq`*[_type=="product"] | order(_createdAt desc){
  title, "slug": slug.current, heroImage, sizeVariants, honestLabel, roomTags
}`;
export const PRODUCT_QUERY = groq`*[_type=="product" && slug.current==$slug][0]{
  ..., "slug": slug.current
}`;
export const RELATED_QUERY = groq`*[_type=="product" && slug.current!=$slug
  && honestLabel.tea.result==$tea][0...4]{ title, "slug": slug.current, heroImage, sizeVariants, honestLabel }`;
export const COMPLAINTS_QUERY = groq`*[_type=="complaint"] | order(ticketNo desc){
  ticketNo, date, status, customerText, responseText, responseAt
}`;
export const PANO_STATS_QUERY = groq`{
  "total": count(*[_type=="complaint" && date > now() - 60*60*24*365]),
  "answered": count(*[_type=="complaint" && defined(responseText) && date > now() - 60*60*24*365]),
  "refunds": count(*[_type=="complaint" && status=="REFUND" && date > now() - 60*60*24*365]),
  "avgResponseHours": math::avg(*[_type=="complaint" && defined(responseAt)]{
    "h": (dateTime(responseAt) - dateTime(date)) / 3600 }.h)
}`;
export const POSTS_QUERY = groq`*[_type=="blogPost"] | order(publishedAt desc){
  title, "slug": slug.current, excerpt, category, publishedAt
}`;
export const POST_QUERY = groq`*[_type=="blogPost" && slug.current==$slug][0]`;
export const SLUGS_QUERY = (type: string) => groq`*[_type=="${type}" && defined(slug.current)].slug.current`;
