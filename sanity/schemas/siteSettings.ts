import { defineType, defineField } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Ayarları",
  type: "document",
  fields: [
    defineField({
      name: "whatsappNumber",
      title: "WhatsApp Numarası (90… formatında)",
      type: "string",
      validation: (r) => r.required().regex(/^90\d{10}$/),
    }),
    defineField({
      name: "waMessageGeneral",
      title: "WA Mesajı — Genel",
      type: "text",
      initialValue: "Merhaba, tulparcarpet.com'dan yazıyorum. Halılarınız hakkında bilgi almak istiyorum.",
    }),
    defineField({
      name: "waMessageProduct",
      title: "WA Mesajı — Ürün ({urun}, {olcu}, {url})",
      type: "text",
      initialValue: "Merhaba, {urun} ({olcu}) hakkında bilgi almak istiyorum. {url}",
    }),
    defineField({
      name: "waMessageCalculator",
      title: "WA Mesajı — Hesaplayıcı ({fark})",
      type: "text",
      initialValue: "Merhaba, maliyet hesaplayıcısında {fark} ₺ fark çıktı. Detay konuşabilir miyiz?",
    }),
    defineField({
      name: "waMessagePano",
      title: "WA Mesajı — Pano",
      type: "text",
      initialValue: "Merhaba, bir konuda geri bildirimde bulunmak istiyorum.",
    }),
    defineField({ name: "calcDefaultWashCount", title: "Hesaplayıcı: yıllık yıkatma (varsayılan)", type: "number", initialValue: 2 }),
    defineField({ name: "calcDefaultWashPrice", title: "Hesaplayıcı: sefer başı yıkama ₺ (varsayılan)", type: "number", initialValue: 900 }),
    defineField({ name: "instagramUrl", type: "url", initialValue: "https://instagram.com/tulparcarpet" }),
    defineField({ name: "announcement", title: "Duyuru Bandı", type: "string" }),
  ],
});
