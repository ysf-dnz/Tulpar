"use client";
import Script from "next/script";
import { useCallback, useState } from "react";
import { ConsentBanner } from "./ConsentBanner";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

export function AnalyticsScripts() {
  const [granted, setGranted] = useState(false);
  const onConsent = useCallback((g: boolean) => setGranted(g), []);
  return (
    <>
      <ConsentBanner onConsent={onConsent} />
      {granted && GA_ID && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
          <Script id="ga4" strategy="afterInteractive">{`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = gtag;
            gtag('consent', 'default', { ad_storage: 'granted', analytics_storage: 'granted', ad_user_data: 'granted', ad_personalization: 'granted' });
            gtag('js', new Date());
            gtag('config', '${GA_ID}');
          `}</Script>
        </>
      )}
      {granted && PIXEL_ID && (
        <Script id="meta-pixel" strategy="afterInteractive">{`
          !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;
          s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${PIXEL_ID}'); fbq('track', 'PageView');
        `}</Script>
      )}
    </>
  );
}
