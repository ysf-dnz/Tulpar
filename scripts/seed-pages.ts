/**
 * Tulpar Carpet — eksik statik sayfaların tohum içerik scripti.
 *
 * Kullanım:
 *   SANITY_API_WRITE_TOKEN=sk... NEXT_PUBLIC_SANITY_PROJECT_ID=xxx npx tsx scripts/seed-pages.ts
 *
 * `createIfNotExists` kullanır; mevcut dokümanların üzerine yazmaz.
 * Sayfalar: durust-etiket, taahhutler, hakkimizda, kvkk, cerez-politikasi, iade-kosullari
 */
import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token =
  process.env.SANITY_API_WRITE_TOKEN ?? process.env.SANITY_API_READ_TOKEN;

if (!projectId || !token) {
  console.error("Eksik env: NEXT_PUBLIC_SANITY_PROJECT_ID ve SANITY_API_WRITE_TOKEN zorunlu.");
  process.exit(1);
}

const client = createClient({ projectId, dataset, token, apiVersion: "2026-06-01", useCdn: false });

let keyCounter = 0;
const key = () => `seedp-${(keyCounter++).toString(36).padStart(4, "0")}`;

/** Düz metni Portable Text bloklarına çevirir (paragraf başına bir blok; "## " satırı h2 olur). */
function toPortableText(text: string) {
  return text
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => {
      const isH2 = p.startsWith("## ");
      return {
        _type: "block",
        _key: key(),
        style: isH2 ? "h2" : "normal",
        markDefs: [],
        children: [{ _type: "span", _key: key(), text: isH2 ? p.slice(3) : p, marks: [] }],
      };
    });
}

const seo = (metaTitle: string, metaDescription: string) => {
  if (metaTitle.length > 60) throw new Error(`metaTitle > 60: ${metaTitle}`);
  if (metaDescription.length > 155) throw new Error(`metaDescription > 155: ${metaDescription}`);
  return { metaTitle, metaDescription };
};

const manifesto = (heading: string, body: string) => ({
  _type: "manifestoBlock",
  _key: key(),
  hidden: false,
  heading,
  body: toPortableText(body),
});

const ctaBand = (heading: string, ctaLabel: string, ctaHref: string) => ({
  _type: "ctaBandBlock",
  _key: key(),
  hidden: false,
  heading,
  ctaLabel,
  ctaHref,
});

// ---------------------------------------------------------------------------
// 1) Dürüst Etiket
// ---------------------------------------------------------------------------

const durustEtiketText = `Halı sektöründe etiket, çoğu zaman üreticinin beyanından ibarettir: "hav yüksekliği 12 mm" yazar, kimse ölçmez; "leke tutmaz" yazar, kimse test etmez. Dürüst Etiket bu alışkanlığı tersine çevirir. Tulpar Carpet'ta sattığımız her halının etiketinde, o halı üzerinde bizzat yaptığımız ölçümlerin ve testlerin sonuçları yazar. Üretici ne derse desin, etikete yalnızca kendi ölçtüğümüz değer girer.

## Hav yüksekliğini nasıl ölçüyoruz?

Hav yüksekliği, halının yumuşaklığını ve ezilme ömrünü belirleyen en kritik değerdir ve sektörde en çok şişirilen rakamdır. Biz her partiden örnek alır, hav yüksekliğini dijital kumpasla milimetre cinsinden ölçer ve etikete ölçtüğümüz değeri yazarız. Üretici beyanı 13 mm, bizim ölçümümüz 11 mm ise etikette 11 mm yazar. Ölçüm, halının ortasından ve iki kenarından alınan üç noktanın ortalamasıdır; noktalar arasında 1 mm'den fazla sapma varsa bunu da etikette belirtiriz.

## Parti numarası neden etikette?

Aynı modelin farklı üretim partilerinde ton ve doku farkı olabilir. Çoğu satıcı bunu saklar; biz parti numarasını etikete yazarız. Böylece evinize gelen halının hangi partiden çıktığını bilirsiniz ve ikinci bir halı sipariş ettiğinizde aynı partiden olup olmadığını sorabilirsiniz. Parti bazlı kayıt aynı zamanda bizim kalite takibimizin omurgasıdır: bir partide sorun çıkarsa hangi müşterilere gittiğini biliriz ve kendiliğimizden ulaşırız.

## Leke testi protokolümüz

Her modeli üç standart maddeyle test ederiz: çay, kahve ve yağ. Protokol basit ve her model için aynıdır: madde halının yüzeyine dökülür, 30 dakika bekletilir, ardından standart yıkama uygulanır. Sonuç üç kategoriden birine girer: ÇIKTI (iz kalmadı), KISMEN ÇIKTI (yakından bakınca iz seçiliyor), ÇIKMADI (leke kalıcı). Test koşulları — bekleme süresi, su sıcaklığı, kullanılan deterjan — etiketin yöntem notunda yazar; "laboratuvar koşullarında" gibi belirsiz ifadeler kullanmayız, çünkü sizin eviniz laboratuvar değildir.

## Neden ÇIKMAZ sonuçları da yayınlıyoruz?

Çünkü hangi lekenin çıkmadığını bilmek, en az hangisinin çıktığını bilmek kadar değerlidir. Mürekkep tutmayan bir halıyı ev ofisi olan bir müşteriye satmak bize kısa vadede ciro, uzun vadede iade ve kırılmış güven getirir. ÇIKMAZ sonucu gören müşteri ya o riski bilerek alır ya da başka modele yönelir; iki durumda da karar onun olur ve doğru olur. Şeffaflık bizim için pazarlama sloganı değil, iade oranımızı düşüren ve müşterilerimizi yıllarca tutan bir iş modelidir.

Etikette gördüğünüz herhangi bir değerden şüphe duyarsanız, ölçüm kaydını ve test fotoğraflarını WhatsApp üzerinden isteyebilirsiniz. Gönderiyoruz. Dürüst Etiket'in dürüstlüğü, sorgulanabilir olmasından gelir.`;

const durustEtiketPage = {
  _id: "page-durust-etiket",
  _type: "page",
  title: "Dürüst Etiket",
  slug: { _type: "slug", current: "durust-etiket" },
  seo: seo(
    "Dürüst Etiket — Ölçülmüş Hav, Gerçek Leke Testi | Tulpar",
    "Her halının etiketinde bizzat ölçtüğümüz hav yüksekliği, parti numarası ve çay/kahve/yağ leke testi sonuçları. ÇIKMAZ sonuçları da yayınlıyoruz."
  ),
  blocks: [
    manifesto("Etikette yazan, bizim ölçtüğümüzdür", durustEtiketText),
    ctaBand("Etiketleri kendi gözünle gör", "Koleksiyonu İncele", "/halilar/"),
  ],
};

// ---------------------------------------------------------------------------
// 2) Taahhütler
// ---------------------------------------------------------------------------

const taahhutGiris = `Aşağıdaki dört taahhüt, Tulpar Carpet'ın pazarlama vaatleri değil, işleyiş kurallarıdır. Her biri ölçülebilir, denetlenebilir ve ihlali halinde bize yazabileceğiniz açık bir kanal vardır. Bir taahhüdü tutamadığımızda bunu Açık Şikayet Panosu'nda herkesin görebileceği şekilde kabul ederiz.`;

const taahhutDetay = `## 1. Dürüst Etiket

Her halının etiketinde üretici beyanı değil, bizim ölçümümüz yazar: dijital kumpasla ölçülmüş hav yüksekliği (mm), üretim parti numarası ve çay/kahve/yağ leke testlerinin sonuçları. Olumsuz sonuçları (ÇIKMAZ) gizlemeyiz. Etiketteki herhangi bir değerin ölçüm kaydını talep edebilirsiniz; 48 saat içinde göndeririz. Etikette yazanla evinize gelen halı arasında fark çıkarsa bu, koşulsuz iade kapsamına ek olarak panoda yayınlanır.

## 2. Açık Şikayet Panosu

Tüm şikayetler — çözülmüş ya da çözülmemiş — sitemizde herkese açık yayınlanır. Şikayetleri silmeyiz, yumuşatmayız, "memnuniyete dönüştü" diye kapatmayız; çözüm sürecini tarih damgalarıyla olduğu gibi gösteririz. Bir şikayetin yayından kaldırılmasını yalnızca şikayet sahibi isteyebilir. Pano, bizim için hem hesap verme mekanizması hem de ürün geliştirme girdisidir: hesaplayıcı varsayılanlarımızdan yıkama talimatlarımıza kadar birçok düzeltme panodan geldi.

## 3. Koşulsuz İade — Kargo Bizden

Halıyı 30 gün boyunca evinizde serili kullanın. Beğenmezseniz — gerekçe sormadan, "rengi odama gitmedi" dahil her sebeple — iade alırız ve iade kargosunun ücretini biz öderiz. Halıyı kullanmış olmanız, üzerinde yürümüş olmanız iadeye engel değildir; "Serili Dene" tam olarak bu demektir. Ücret iadesi, halı bize ulaştıktan sonra en geç 14 gün içinde ödeme yönteminize yapılır.

## 4. Gerçek Maliyet Şeffaflığı

Satış fiyatı, bir halının size maliyetinin yalnızca ilk taksitidir. Sitemizdeki 5 yıllık gerçek maliyet hesaplayıcısı; yıkama sıklığı, şehrinizdeki yıkama ücretleri ve halının beklenen ömrünü hesaba katarak toplam maliyeti tüm ara adımlarıyla gösterir. Hesabın hiçbir katsayısı gizli değildir. Pahalı görünen halımız beş yıllık toplamda ucuz çıkmıyorsa, bunu hesaplayıcı da gösterir — ve biz bu sonucu saklamayız.

Bu dört taahhütten herhangi birinin ihlal edildiğini düşünüyorsanız, Açık Pano'dan yazın. Yanıtımız da herkese açık olacaktır.`;

const taahhutlerPage = {
  _id: "page-taahhutler",
  _type: "page",
  title: "Taahhütlerimiz",
  slug: { _type: "slug", current: "taahhutler" },
  seo: seo(
    "Taahhütlerimiz — 4 Açık Söz | Tulpar Carpet",
    "Dürüst Etiket, Açık Şikayet Panosu, koşulsuz iade (kargo bizden) ve gerçek maliyet şeffaflığı. Dört taahhüt, hepsi denetlenebilir."
  ),
  blocks: [
    manifesto("Dört söz, hepsi denetlenebilir", taahhutGiris),
    {
      _type: "commitmentGridBlock",
      _key: key(),
      hidden: false,
      items: [
        {
          _key: key(),
          title: "Dürüst Etiket",
          text: "Ölçülmüş hav yüksekliği, parti numarası ve leke testi sonuçları her etikette. ÇIKMAZ sonuçlar dahil.",
          href: "/durust-etiket/",
        },
        {
          _key: key(),
          title: "Açık Şikayet Panosu",
          text: "Tüm şikayetler çözüm süreciyle birlikte herkese açık. Silmek yok, yumuşatmak yok.",
          href: "/pano/",
        },
        {
          _key: key(),
          title: "Koşulsuz İade",
          text: "30 gün serili dene; beğenmezsen gerekçesiz iade. İade kargosu bizden.",
          href: "/iade-kosullari/",
        },
        {
          _key: key(),
          title: "Gerçek Maliyet",
          text: "5 yıllık toplam maliyeti tüm ara adımlarıyla gösteren açık hesaplayıcı.",
          href: "/maliyet-hesaplayici/",
        },
      ],
    },
    manifesto("Taahhütlerin açılımı", taahhutDetay),
    ctaBand("Sözümüzü test et", "Açık Panoyu Gör", "/pano/"),
  ],
};

// ---------------------------------------------------------------------------
// 3) Hakkımızda
// ---------------------------------------------------------------------------

const hakkimizdaText = `Tulpar Carpet, Türkiye'nin halı üretim başkenti Kayseri'de doğdu. Kurucularımız bu sektörün içinde büyüdü: dokuma tezgâhlarının başında, iplik depolarında, mağaza vitrinlerinin arkasında. Ve yıllar içinde hep aynı sahneyi izledik: müşteri mağazada loş spot ışığı altında parlayan bir halıya dokunur, beğenir, alır; halı eve gelir ve gün ışığında bambaşka bir ürün çıkar ortaya. Rengi farklıdır, havı etikette yazandan kısadır, ilk yıkamada formu bozulur. Müşteri haklı olarak aldatılmış hisseder — ama elinde bunu kanıtlayacak hiçbir şey yoktur, çünkü etikette zaten ölçülmüş hiçbir şey yazmamaktadır.

## "Mağazada gördüğün, evine gelen halıdır"

Tulpar Carpet bu cümleyi kurabilmek için kuruldu. Sorunun kökü kötü niyet değil, ölçümsüzlüktür: sektörde kimse beyanları doğrulamaz, kimse test sonucu yayınlamaz, kimse parti farkını söylemez. Biz tersini yaptık ve buna Dürüst Etiket dedik: her halının etiketinde bizim ölçtüğümüz hav yüksekliği, üretim parti numarası ve standart protokolle yaptığımız leke testlerinin sonuçları yazar — olumsuz sonuçlar dahil. Mağaza ışığıyla ev ışığı arasındaki farkı kapatamayız; ama etiketle gerçek arasındaki farkı sıfırlayabiliriz.

## Neden doğrudan satıyoruz?

Klasik halı zincirinde üreticiyle eviniz arasında toptancı, bölge bayisi ve perakende mağaza vardır; her halka hem fiyata marj ekler hem de üründen sorumluluğu bir sonrakine devreder. Biz bu zinciri kaldırdık: halılarımız Kayseri'deki üretimden çıkar, kalite kontrolümüzden geçer ve doğrudan kapınıza gelir. D2C (üreticiden tüketiciye) model bize iki şey kazandırır: aracı marjı kadar daha doğru fiyat ve — daha önemlisi — sorumluluğu devredebileceğimiz kimsenin olmaması. Halınızla ilgili her sorunun tek muhatabı biziz ve bu muhataplık 30 gün koşulsuz iadeyle, açık şikayet panosuyla ve ölçülmüş etiketle çerçevelidir.

## Kayseri'de üretmek

Kayseri, yüzyıllık dokuma birikimiyle Türkiye makine halısı üretiminin merkezi. Üretimin yanı başında olmak bizim için lojistik bir kolaylık değil, kalite kontrolün ön şartı: partiler tezgâhtan indiğinde örneğini biz alırız, ölçümü biz yaparız, leke testini biz koşarız. Uzaktan sipariş verip konteyner bekleyen bir satıcının yapamayacağı şey tam olarak budur — ve Dürüst Etiket'i mümkün kılan da budur.

## Nereye gidiyoruz?

Amacımız Türkiye'nin en büyük halı satıcısı olmak değil; etiketine en çok güvenilen halı markası olmak. Her ÇIKMAZ test sonucunu yayınladığımızda kısa vadede bir satış kaybediyor, uzun vadede bir müşteri kazanıyoruz. Bu takasın doğru olduğuna inanıyoruz. Sorularınız için WhatsApp hattımız açık; Kayseri'ye yolunuz düşerse üretimi gezdirmekten de memnuniyet duyarız — gizleyecek bir şeyimiz yok, işimiz zaten bunun üzerine kurulu.`;

const hakkimizdaPage = {
  _id: "page-hakkimizda",
  _type: "page",
  title: "Hakkımızda",
  slug: { _type: "slug", current: "hakkimizda" },
  seo: seo(
    "Hakkımızda — Kayseri'den Doğrudan Evinize | Tulpar Carpet",
    "Kayseri üretimi, aracısız satış ve radikal şeffaflık. Mağaza-ev farkı sorununa karşı kurulan D2C halı markası Tulpar Carpet'ın hikayesi."
  ),
  blocks: [
    manifesto("Mağazada gördüğün, evine gelen halıdır", hakkimizdaText),
    ctaBand("Söze değil, etikete güven", "Dürüst Etiket Nedir?", "/durust-etiket/"),
  ],
};

// ---------------------------------------------------------------------------
// 4) KVKK
// ---------------------------------------------------------------------------

const kvkkText = `İşbu Aydınlatma Metni, 6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca, veri sorumlusu sıfatıyla Tulpar Carpet ("Şirket") tarafından kişisel verilerinizin işlenmesine ilişkin olarak sizleri bilgilendirmek amacıyla hazırlanmıştır.

## 1. Veri Sorumlusu

Kişisel verileriniz, veri sorumlusu sıfatıyla Tulpar Carpet tarafından aşağıda açıklanan kapsamda işlenebilecektir. İletişim: tulparcarpet.com üzerindeki iletişim kanalları ve WhatsApp hattı.

## 2. İşlenen Kişisel Veriler

Sitemizi ve hizmetlerimizi kullanmanız kapsamında şu veri kategorileri işlenebilir: kimlik bilgileri (ad, soyad), iletişim bilgileri (telefon numarası, e-posta adresi, teslimat adresi), müşteri işlem bilgileri (sipariş geçmişi, iade kayıtları, şikayet ve talep kayıtları), işlem güvenliği bilgileri (IP adresi, log kayıtları) ve açık rızanıza bağlı olarak pazarlama verileri (çerezler aracılığıyla elde edilen kullanım alışkanlıkları).

## 3. İşleme Amaçları

Kişisel verileriniz; siparişlerinizin alınması ve teslim edilmesi, iade ve değişim süreçlerinin yürütülmesi, 30 Gün Serili Dene taahhüdünün işletilmesi, şikayet ve taleplerinizin yanıtlanması (Açık Şikayet Panosu'nda yayınlanan içeriklerde kimliğiniz açık rızanız olmadan paylaşılmaz), yasal yükümlülüklerin yerine getirilmesi ve açık rızanız bulunması halinde tarafınıza ticari elektronik ileti gönderilmesi amaçlarıyla işlenir.

## 4. İşlemenin Hukuki Sebepleri

Verileriniz, KVKK m.5/2 kapsamında; sözleşmenin kurulması ve ifası için gerekli olması, hukuki yükümlülüğün yerine getirilmesi, bir hakkın tesisi ve korunması ile meşru menfaat hukuki sebeplerine; bu kapsamlara girmeyen haller için (örn. pazarlama iletişimi, analitik çerezler) KVKK m.5/1 uyarınca açık rızanıza dayanılarak işlenir.

## 5. Verilerin Aktarılması

Kişisel verileriniz; teslimatın gerçekleştirilmesi amacıyla kargo firmalarına, ödemenin alınması amacıyla ödeme kuruluşlarına, yasal zorunluluk halinde yetkili kamu kurum ve kuruluşlarına ve hizmet aldığımız bilişim altyapı sağlayıcılarına, amaçla sınırlı ve ölçülü olarak aktarılabilir. Açık rızanız olmaksızın verileriniz üçüncü kişilere pazarlama amaçlı satılmaz veya devredilmez.

## 6. Toplama Yöntemi

Verileriniz; web sitemizdeki formlar, WhatsApp iletişim hattı, çerezler ve sipariş süreçleri aracılığıyla, kısmen veya tamamen otomatik yollarla toplanır.

## 7. KVKK m.11 Kapsamındaki Haklarınız

Kişisel verilerinizin işlenip işlenmediğini öğrenme, işlenmişse buna ilişkin bilgi talep etme, işlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme, yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme, eksik veya yanlış işlenmişse düzeltilmesini isteme, silinmesini veya yok edilmesini isteme, bu işlemlerin aktarılan üçüncü kişilere bildirilmesini isteme, münhasıran otomatik sistemlerle analiz edilmesi suretiyle aleyhinize bir sonucun ortaya çıkmasına itiraz etme ve kanuna aykırı işleme sebebiyle zarara uğramanız halinde zararın giderilmesini talep etme haklarına sahipsiniz. Başvurularınızı sitemizdeki iletişim kanalları üzerinden yazılı olarak iletebilirsiniz; başvurunuz en geç 30 gün içinde ücretsiz olarak sonuçlandırılır.

Bu metin taslaktır; hukuk danışmanı onayıyla güncellenecektir.`;

const kvkkPage = {
  _id: "page-kvkk",
  _type: "page",
  title: "KVKK Aydınlatma Metni",
  slug: { _type: "slug", current: "kvkk" },
  seo: seo(
    "KVKK Aydınlatma Metni | Tulpar Carpet",
    "Tulpar Carpet'ın 6698 sayılı KVKK kapsamında kişisel verilerinizi hangi amaçlarla, hangi hukuki sebeplerle işlediğine dair aydınlatma metni."
  ),
  blocks: [manifesto("Kişisel Verilerin Korunması Aydınlatma Metni", kvkkText)],
};

// ---------------------------------------------------------------------------
// 5) Çerez Politikası
// ---------------------------------------------------------------------------

const cerezText = `Bu politika, tulparcarpet.com üzerinde hangi çerezlerin (cookies) hangi amaçlarla kullanıldığını açıklar. Şeffaflık taahhüdümüz çerezler için de geçerlidir: hangi veriyi neden topladığımızı açıkça yazıyoruz ve zorunlu olmayan hiçbir çerezi onayınız olmadan çalıştırmıyoruz.

## Çerez nedir?

Çerezler, ziyaret ettiğiniz web sitelerinin tarayıcınıza kaydettiği küçük metin dosyalarıdır. Sitenin çalışması için gerekli temel işlevlerden, ziyaret istatistiklerinin tutulmasına kadar farklı amaçlarla kullanılırlar.

## 1. Zorunlu Çerezler (onay gerektirmez)

Bu çerezler sitenin temel işlevleri için teknik olarak zorunludur ve kapatılamaz: oturum yönetimi, güvenlik doğrulamaları ve çerez tercihinizin hatırlanması (verdiğiniz ya da vermediğiniz onayı saklayan çerezin kendisi). Zorunlu çerezler kimliğinizi pazarlama amacıyla takip etmez.

## 2. Analitik ve Pazarlama Çerezleri (onayınıza bağlı)

Sitemize ilk girişinizde karşınıza çıkan onay bandı (ConsentBanner) üzerinden izin vermeniz halinde şu araçlar çalışır:

Google Analytics 4 (GA4): Hangi sayfaların ziyaret edildiği, ziyaret süresi ve trafik kaynağı gibi toplu istatistikleri ölçer. Bu veriyi sitenin hangi bölümlerinin işe yaradığını anlamak için kullanırız.

Meta Pixel: Reklam kampanyalarımızın etkinliğini ölçmek ve sitemizi ziyaret eden kullanıcılara Meta platformlarında (Facebook/Instagram) reklam gösterebilmek için kullanılır.

Onay vermezseniz bu araçların hiçbiri yüklenmez; site tüm işlevleriyle çalışmaya devam eder. Onayınızı daha sonra vermek ya da geri çekmek için çerez tercihlerinizi tarayıcınızdan temizleyebilir veya sitedeki çerez ayarları bağlantısını kullanabilirsiniz — bandı yeniden gördüğünüzde tercihinizi değiştirebilirsiniz.

## Çerezleri tarayıcıdan yönetmek

Tüm tarayıcılar çerezleri silme ve engelleme imkânı sunar (genellikle Ayarlar → Gizlilik bölümünde). Zorunlu çerezleri engellemeniz halinde sitenin bazı bölümleri düzgün çalışmayabilir.

## Saklama süreleri ve değişiklikler

Onay tercihiniz tarayıcınızda azami 12 ay saklanır; süre dolunca tercih yeniden sorulur. Bu politikada değişiklik yaptığımızda güncel sürümü bu sayfada yayınlarız. Çerez kullanımımıza ilişkin sorularınız için KVKK Aydınlatma Metni'ndeki kanallardan bize ulaşabilirsiniz.`;

const cerezPage = {
  _id: "page-cerez-politikasi",
  _type: "page",
  title: "Çerez Politikası",
  slug: { _type: "slug", current: "cerez-politikasi" },
  seo: seo(
    "Çerez Politikası | Tulpar Carpet",
    "tulparcarpet.com'da kullanılan zorunlu çerezler ile onayınıza bağlı GA4 ve Meta Pixel çerezlerinin açık dökümü ve yönetim seçenekleri."
  ),
  blocks: [manifesto("Çerez Politikası", cerezText)],
};

// ---------------------------------------------------------------------------
// 6) İade Koşulları
// ---------------------------------------------------------------------------

const iadeText = `İade politikamız tek cümleyle özetlenir: halıyı 30 gün evinizde serili kullanın; beğenmezseniz gerekçe sormadan geri alırız, iade kargosunu da biz öderiz. Aşağıda bu sözün tüm detayları, küçük puntoya saklanmış hiçbir istisna olmadan yazılıdır.

## 30 Gün Serili Dene nedir?

Halı, mağaza ışığında ya da paket fotoğrafında değil, sizin oturma odanızın gün ışığında, sizin mobilyalarınızın yanında anlam kazanır. Bu yüzden halıyı teslim aldığınız günden itibaren 30 gün boyunca evinizde sermenizi, üzerinde yürümenizi, normal hayatınızda kullanmanızı istiyoruz. Naylonunu açmanız, sermeniz, kullanmanız iade hakkınızı düşürmez — "denemek" tam olarak budur. Ambalajı saklamanız da gerekmez.

## Hangi gerekçeyle iade edebilirim?

Herhangi bir gerekçeyle — ya da gerekçesiz. "Rengi odama gitmedi", "eşim beğenmedi", "vazgeçtim" tamamen geçerli sebeplerdir; sebep belirtmek zorunda bile değilsiniz. İade talebinizde sizi ikna etmeye çalışmayız, "değişimle çözelim" diye yönlendirmeyiz. Tek koşul 30 günlük süre içinde talebinizi iletmiş olmanızdır.

## İade adımları

1. WhatsApp hattımızdan ya da sitedeki iletişim kanallarından "iade etmek istiyorum" yazın; sipariş numaranızı ekleyin.

2. Aynı gün içinde size iade kodu ve anlaşmalı kargo bilgisini gönderelim. Kargo ücreti tarafımıza aittir; sizden ek hiçbir ücret talep edilmez.

3. Halıyı rulo yapın (orijinal ambalaj şart değildir; halıyı koruyacak herhangi bir sarım yeterlidir) ve anlaşmalı kargo şubesine teslim edin ya da adresten alım için gün belirleyin.

4. Halı bize ulaştığında size bilgi veririz. Ücret iadeniz, halının tarafımıza ulaşmasından itibaren en geç 14 gün içinde, ödemeyi yaptığınız yönteme eksiksiz olarak yapılır.

## Aklınızda kalsın

Normal ev kullanımından doğan izler (yürüme, mobilya altında kalma) iadeye engel değildir; Serili Dene'nin doğası budur. Halıda kasıtlı hasar, kesim veya tadilat varsa durumu sizinle açık biçimde konuşuruz — bugüne kadar bu maddeyi işletmemiz neredeyse hiç gerekmedi. Etikette yazan değerlerle (hav yüksekliği, leke testi sonuçları) evinize gelen halı arasında fark tespit ederseniz, bu yalnızca iade sebebi değil, Açık Şikayet Panosu'nda yayınlanacak bir kayıttır; bildirin, hem iadenizi yapalım hem kaydı düşelim.

İade sürecinin herhangi bir adımında sorun yaşarsanız Açık Pano'dan yazabilirsiniz; yanıtımız herkese açık verilir. Koşulsuz iade bizim için maliyet değil, etikete duyduğumuz güvenin sigortasıdır: halılarımızın evinizde de beğenileceğini bildiğimiz için bu sözü verebiliyoruz.`;

const iadePage = {
  _id: "page-iade-kosullari",
  _type: "page",
  title: "İade Koşulları",
  slug: { _type: "slug", current: "iade-kosullari" },
  seo: seo(
    "İade Koşulları — 30 Gün Serili Dene | Tulpar Carpet",
    "30 gün evinizde serili deneyin; beğenmezseniz gerekçesiz iade. İade kargosu bizden, ücret iadesi 14 gün içinde. Tüm adımlar bu sayfada."
  ),
  blocks: [
    manifesto("Koşulsuz iade: 30 Gün Serili Dene", iadeText),
    ctaBand("Önce hesabını yap, sonra dene", "Gerçek Maliyeti Hesapla", "/maliyet-hesaplayici/"),
  ],
};

// ---------------------------------------------------------------------------
// Çalıştır
// ---------------------------------------------------------------------------

async function main() {
  const docs = [durustEtiketPage, taahhutlerPage, hakkimizdaPage, kvkkPage, cerezPage, iadePage];
  for (const doc of docs) {
    const res = await client.createIfNotExists(doc as Parameters<typeof client.createIfNotExists>[0]);
    console.log(`✔ ${doc._type} → ${res._id}`);
  }
}

main().catch((err) => {
  console.error("Seed başarısız:", err);
  process.exit(1);
});
