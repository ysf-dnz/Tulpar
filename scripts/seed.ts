/**
 * Tulpar Carpet — tohum içerik scripti.
 *
 * Kullanım:
 *   SANITY_API_WRITE_TOKEN=sk... NEXT_PUBLIC_SANITY_PROJECT_ID=xxx npx tsx scripts/seed.ts
 *
 * `createIfNotExists` kullanır; mevcut dokümanların üzerine yazmaz.
 * NOT: Ürün görselleri (heroImage, images) burada YÜKLENMEZ — gerçek ürün
 * fotoğrafları Studio üzerinden eklenmelidir (PRD 11.3). Bu yüzden seed'lenen
 * ürünler, galeri eklenene kadar Studio doğrulamasında uyarı verir.
 */
import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !token) {
  console.error("Eksik env: NEXT_PUBLIC_SANITY_PROJECT_ID ve SANITY_API_WRITE_TOKEN zorunlu.");
  process.exit(1);
}

const client = createClient({ projectId, dataset, token, apiVersion: "2026-06-01", useCdn: false });

let keyCounter = 0;
const key = () => `seed-${(keyCounter++).toString(36).padStart(4, "0")}`;

/** Düz metni Portable Text bloklarına çevirir (paragraf başına bir blok). */
function toPortableText(text: string) {
  return text
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => ({
      _type: "block",
      _key: key(),
      style: "normal",
      markDefs: [],
      children: [{ _type: "span", _key: key(), text: p, marks: [] }],
    }));
}

const seo = (metaTitle: string, metaDescription: string) => {
  if (metaTitle.length > 60) throw new Error(`metaTitle > 60: ${metaTitle}`);
  if (metaDescription.length > 155) throw new Error(`metaDescription > 155: ${metaDescription}`);
  return { metaTitle, metaDescription };
};

// ---------------------------------------------------------------------------
// Site ayarları
// ---------------------------------------------------------------------------

const siteSettings = {
  _id: "siteSettings",
  _type: "siteSettings",
  whatsappNumber: "905000000000", // PLACEHOLDER — gerçek numara ile değiştirin
  waMessageGeneral:
    "Merhaba, tulparcarpet.com'dan yazıyorum. Halılarınız hakkında bilgi almak istiyorum.",
  waMessageProduct: "Merhaba, {urun} ({olcu}) hakkında bilgi almak istiyorum. {url}",
  waMessageCalculator: "Merhaba, maliyet hesaplayıcısında {fark} ₺ fark çıktı. Detay konuşabilir miyiz?",
  waMessagePano: "Merhaba, bir konuda geri bildirimde bulunmak istiyorum.",
  calcDefaultWashCount: 2,
  calcDefaultWashPrice: 900,
  instagramUrl: "https://instagram.com/tulparcarpet",
};

// ---------------------------------------------------------------------------
// Ürünler (görseller Studio'dan eklenecek)
// ---------------------------------------------------------------------------

const bozkirDescription = `Bozkır, adını Anadolu'nun uçsuz bucaksız düzlüklerinden alan, sade ama derinlikli bir dokuma. İlk bakışta minimal duran zemin deseni, ışığa göre ton değiştiren hav yapısıyla gün içinde farklı yüzler gösterir. Sabah güneşinde sıcak bir bej, akşam lambası altında ise koyu kum rengine kayar. Bu etki bir baskı hilesi değil; iki farklı kalınlıkta ipliğin aynı sıra üzerinde dönüşümlü kullanılmasından doğan, dokuma tezgâhında kazanılmış bir derinliktir.

Zemini polipropilen friz iplikten dokunur, atkısında pamuk takviyesi vardır. Bu kombinasyon halıya iki şey kazandırır: ayak altında yumuşak ama formunu koruyan bir his ve yıkamaya dayanıklı bir gövde. Hav yüksekliğini etikette gördüğünüz değer olarak biz ölçtük; üretici beyanını değil, kendi kumpasımızla yaptığımız ölçümü yazıyoruz. Parti numarası da etikette açıkça durur, çünkü aynı modelin farklı partilerinde ton farkı olabilir ve bunu saklamak yerine söylemeyi tercih ederiz.

Bozkır'ı en çok salon ve yatak odası için öneriyoruz. Orta yoğunlukta bir ev trafiğini sorunsuz taşır; çay ve kahve lekelerinde test sonuçlarımız etikette yazdığı gibidir, abartmadan aktarıyoruz. Vişne suyu gibi yoğun pigmentli lekelerde hemen müdahale şarttır; mürekkep ise bu halının zayıf noktasıdır ve bunu satış öncesinde söylemekten çekinmeyiz.

Bakımı kolaydır: haftalık çekimde fırçasız başlık yeterlidir, yılda bir profesyonel yıkama dokuyu tazeler. Kendiniz yıkamak isterseniz düşük devirde, soğuk suyla ve gölgede kurutarak yıkayabilirsiniz; doğrudan güneş, rengin sıcak tonlarını zamanla soldurur. Tüy dökmesi ilk iki hafta düşük seviyede görülür, sonrasında durur. Bu açıklamadaki her cümle test kayıtlarımıza dayanır; mağazada gördüğünüz, evinize gelen halıdır.

Bozkır kimin için değil? Yoğun evcil hayvan tüyü olan evlerde temizlik sıklığı sizi yorabilir; mürekkep ve kalem kullanımı yoğun bir ev ofisinde de bu halıyı önermeyiz. Bu sınırı satıştan önce söylüyoruz, çünkü iade edilen bir halıdan değil, yıllarca memnun kullanılan bir halıdan kazanırız. Sorunuz olursa WhatsApp hattımız açık; ölçü krokinizi gönderin, birlikte karar verelim.`;

const kervanDescription = `Kervan, Tulpar koleksiyonunun en yoğun desenli parçası. İlhamını eski kervan yollarının taş döşemelerinden alan geometrik kurgusu, kalabalık kullanılan odalarda izleri ve gölgeleri görünmez kılar; bu yüzden onu özellikle koridor, giriş ve çocuk odası için öneriyoruz. Desen yoğunluğu bir süs değil, pratik bir karardır: kırıntı, ayak izi ve gündelik yıpranma bu doku üzerinde kaybolur.

İplik yapısı yüksek büküm polipropilendir; hav, Bozkır'a göre daha kısa ve sıkı dokunur. Kısa hav iki avantaj getirir: kapı altlarına takılmaz ve robot süpürgeyle sorunsuz çalışır. Hav yüksekliğini etikette milimetre cinsinden, kendi ölçümümüzle veriyoruz. Parti numarası etikette yazılıdır; iki farklı partide zemin tonu arasında fark görürseniz bunun nedeni budur ve değişim talebinde bu numarayı baz alırız.

Leke testlerinde Kervan güçlü bir karne çıkardı: çay ve kahve, doğru müdahaleyle iz bırakmadan çıkar; vişne suyunda kısmi sonuç aldık ve bunu olduğu gibi yazıyoruz. Mürekkep testinde kısa hav avantaj sağlar, ancak yine de kalıcı iz riski vardır — ev ofisinde sandalye altına ayrıca koruyucu öneriyoruz.

Tüy dökme skoru düşüktür; ilk serildiği hafta hafif elyaf gelir, sonra biter. Yıkama konusunda Kervan dayanıklıdır: evde düşük devirli makinede yıkanabilecek ölçülerde üretilir, daha büyük boylar için profesyonel yıkama öneririz. Kurutmayı asla radyatör üzerinde yapmayın; taban tutkalı sıcakta sertleşir ve halı formunu kaybeder.

Kervan kimin için değil? Ayak altında yumuşak, batan bir his arıyorsanız bu halı sizi tatmin etmez; kısa havlı yapısı konfordan çok dayanıklılık için kurgulanmıştır. Bu dürüstlük bizim satış sözleşmemizin parçasıdır: etikette ne yazıyorsa, evinize gelen odur.

Ölçü konusunda kararsızsanız koridor genişliğinizi ve kapı açılış yönünü WhatsApp'tan yazın; Kervan'ın 80x300 yolluk varyantı dar koridorlar için, 120x180 ise çocuk odası oyun alanı için en çok tercih edilen ölçülerdir. Beş yıllık gerçek maliyeti merak ediyorsanız hesaplayıcımıza ölçüyü girin, yıkama masrafıyla birlikte toplamı görün.`;

const products = [
  {
    _id: "product-bozkir-160x230",
    _type: "product",
    title: "Bozkır",
    slug: { _type: "slug", current: "bozkir-160x230" },
    description: bozkirDescription,
    roomTags: ["salon", "yatak-odasi"],
    sizeVariants: [
      { _key: key(), size: "160x230", priceTRY: 4890, stockStatus: "in_stock" },
      { _key: key(), size: "200x290", priceTRY: 7450, stockStatus: "in_stock" },
    ],
    pileHeightMm: 12,
    batchNo: "BZK-2026-04-A",
    honestLabel: {
      tea: { result: "PASS", methodNote: "5 dk bekletildi, soğuk su + pH nötr deterjanla çıktı." },
      coffee: { result: "PASS", methodNote: "Sütlü kahve, 10 dk bekletildi; iz kalmadı." },
      cherry: { result: "PARTIAL", methodNote: "Hemen müdahaleyle açıldı; 1 saat bekleyen lekede soluk iz kaldı." },
      ink: { result: "FAIL", methodNote: "Tükenmez mürekkep çıkmadı; kalıcı iz bıraktı." },
    },
    sheddingScore: "dusuk",
    washingInstructions:
      "Düşük devirde, 30°C altı soğuk suyla yıkanabilir. Gölgede, düz zeminde kurutun; doğrudan güneşten ve radyatörden uzak tutun. Yılda bir profesyonel yıkama önerilir.",
    notFor:
      "Yoğun evcil hayvan tüyü olan evler ve ev ofisinde mürekkep/kalem kullanımı yoğun olanlar için uygun değil; mürekkep lekesi bu halıdan çıkmıyor.",
    seo: seo(
      "Bozkır Halı 160x230 — Dürüst Etiketli | Tulpar Carpet",
      "Bozkır 160x230: ölçülmüş hav yüksekliği, parti no ve 4 leke testi sonucu etikette. Mağazada gördüğün, evine gelen halıdır."
    ),
  },
  {
    _id: "product-kervan-120x180",
    _type: "product",
    title: "Kervan",
    slug: { _type: "slug", current: "kervan-120x180" },
    description: kervanDescription,
    roomTags: ["koridor", "cocuk-odasi"],
    sizeVariants: [
      { _key: key(), size: "120x180", priceTRY: 2990, stockStatus: "in_stock" },
      { _key: key(), size: "80x300", priceTRY: 2590, stockStatus: "in_stock" },
      { _key: key(), size: "160x230", priceTRY: 4590, stockStatus: "in_stock" },
    ],
    pileHeightMm: 7,
    batchNo: "KRV-2026-05-B",
    honestLabel: {
      tea: { result: "PASS", methodNote: "Anında müdahale gerekmeden, 15 dk sonra dahi çıktı." },
      coffee: { result: "PASS", methodNote: "Sade kahve; soğuk su ve beyaz bezle tamamen açıldı." },
      cherry: { result: "PARTIAL", methodNote: "Hemen müdahaleyle büyük oranda çıktı, dipte hafif gölge kaldı." },
      ink: { result: "PARTIAL", methodNote: "Kısa hav sayesinde yüzeysel kaldı; soluk iz görülebilir." },
    },
    sheddingScore: "dusuk",
    washingInstructions:
      "120x180 ve altı ölçüler evde düşük devirli makinede yıkanabilir; büyük ölçüler için profesyonel yıkama önerilir. Radyatör üzerinde kurutmayın.",
    notFor:
      "Ayak altında yumuşak, yüksek havlı ve batan bir konfor hissi arayanlar için uygun değil; Kervan kısa havlı, dayanıklılık odaklı bir halıdır.",
    seo: seo(
      "Kervan Halı — Kısa Havlı, Koridor ve Çocuk Odası | Tulpar",
      "Kervan: kısa havlı, robot süpürge dostu, leke testleri etikette. Koridor ve çocuk odası için dayanıklılık odaklı dürüst etiketli halı."
    ),
  },
];

// ---------------------------------------------------------------------------
// Açık pano — 6 şikayet (karışık durumlar)
// ---------------------------------------------------------------------------

const complaints = [
  {
    _id: "complaint-1001",
    ticketNo: 1001,
    status: "SOLVED",
    date: "2026-04-14T09:30:00Z",
    customerText:
      "Sipariş ettiğim halının kargosu söz verilen 3 günü geçti, 6. günde elime ulaştı. Süreçte bilgilendirme de yapılmadı.",
    responseText:
      "Haklısınız; kargo firmasındaki aktarma gecikmesini size anında bildirmedik, bu bizim hatamız. Özür olarak bir sonraki profesyonel yıkamanız bizden. Kargo takip bildirimlerini artık otomatik SMS ile gönderiyoruz.",
    responseAt: "2026-04-15T11:00:00Z",
  },
  {
    _id: "complaint-1002",
    ticketNo: 1002,
    status: "REFUND",
    date: "2026-04-22T14:05:00Z",
    customerText:
      "Sitedeki fotoğrafta zemin daha açık görünüyordu, gelen halı belirgin şekilde koyu çıktı. Salonuma uymadı.",
    responseText:
      "Fotoğraf ile ürün arasındaki ton farkı bizim sorumluluğumuzdur. Koşulsuz iade hakkınızı işlettik, ücret aynı gün iade edildi. İlgili ürünün fotoğrafları doğal ışıkta yeniden çekildi.",
    responseAt: "2026-04-23T10:20:00Z",
  },
  {
    _id: "complaint-1003",
    ticketNo: 1003,
    status: "SOLVED",
    date: "2026-05-03T08:45:00Z",
    customerText:
      "Halının kenar overloğu iki haftada sökülmeye başladı. Bu fiyata aldığım ürün için kabul edilemez.",
    responseText:
      "Etiketteki parti numarası üzerinden üretim kaydına baktık; o partide overlok ipliği hatalıydı. Halınızı ücretsiz değiştirdik, aynı partideki diğer müşterilerimizi de tek tek aradık.",
    responseAt: "2026-05-04T16:30:00Z",
  },
  {
    _id: "complaint-1004",
    ticketNo: 1004,
    status: "OPEN",
    date: "2026-06-02T19:10:00Z",
    customerText:
      "Maliyet hesaplayıcıdaki yıkama fiyatı bizim şehirdeki gerçek fiyatların altında; hesap olduğundan iyimser çıkıyor.",
  },
  {
    _id: "complaint-1005",
    ticketNo: 1005,
    status: "SOLVED",
    date: "2026-05-18T12:00:00Z",
    customerText:
      "WhatsApp'tan yazdım, iki gün dönüş olmadı. Madem birincil kanal bu, daha hızlı cevap beklerdim.",
    responseText:
      "İki günlük sessizlik kabul edilemez; o hafta tek kişiyle dönüyorduk ve mesajınız gözden kaçtı. Mesai içi yanıt hedefimizi 2 saat olarak panoya yazdık; tutamazsak yine buradan görürsünüz.",
    responseAt: "2026-05-19T09:15:00Z",
  },
  {
    _id: "complaint-1006",
    ticketNo: 1006,
    status: "OPEN",
    date: "2026-06-08T15:40:00Z",
    customerText:
      "Dürüst etikette tüy dökme 'düşük' yazıyordu ama bizim halı üç haftadır tüy bırakıyor. Skor neye göre veriliyor?",
  },
].map((c) => ({ ...c, _type: "complaint" }));

// ---------------------------------------------------------------------------
// Sayfalar
// ---------------------------------------------------------------------------

const anaSayfa = {
  _id: "page-ana-sayfa",
  _type: "page",
  title: "Ana Sayfa",
  slug: { _type: "slug", current: "ana-sayfa" },
  seo: seo(
    "Tulpar Carpet — Mağazada gördüğün, evine gelen halıdır",
    "Dürüst etiketli halılar: ölçülmüş hav, parti no, leke testleri ve açık şikayet panosu. 5 yıllık gerçek maliyeti hesapla, WhatsApp'tan sor."
  ),
  blocks: [
    {
      _type: "heroBlock",
      _key: key(),
      hidden: false,
      variant: "gorselli",
      heading: "Mağazada gördüğün, evine gelen halıdır.",
      subheading:
        "Her halının etiketinde ölçülmüş hav yüksekliği, parti numarası ve gerçek leke testi sonuçları yazar. Abartı yok, sürpriz yok.",
      primaryCtaLabel: "Koleksiyonu Gör",
      primaryCtaHref: "/halilar/",
    },
    {
      _type: "commitmentGridBlock",
      _key: key(),
      hidden: false,
      items: [
        {
          _key: key(),
          title: "Dürüst Etiket",
          text: "Hav yüksekliğini biz ölçer, leke testlerini biz yapar, sonucu olduğu gibi yazarız — ÇIKMAZ dahil.",
          href: "/durust-etiket/",
        },
        {
          _key: key(),
          title: "Açık Şikayet Panosu",
          text: "Her şikayet, cevabıyla birlikte herkese açık yayında. Sildiğimiz tek bir kayıt yok.",
          href: "/acik-pano/",
        },
        {
          _key: key(),
          title: "Koşulsuz İade",
          text: "Halı evinize uymadıysa nedenini sorgulamadan iade alırız; kargo bizden.",
          href: "/iade-kosullari/",
        },
        {
          _key: key(),
          title: "Gerçek Maliyet",
          text: "Satış fiyatı değil, 5 yıllık bakım maliyetiyle birlikte karşılaştırın; hesaplayıcı açık kaynak mantığıyla şeffaf.",
          href: "/maliyet-hesaplayici/",
        },
      ],
    },
    { _type: "panoSummaryBlock", _key: key(), hidden: false, heading: "Açık Şikayet Panosu" },
    { _type: "calculatorCtaBlock", _key: key(), hidden: false, heading: "5 yıllık gerçek maliyeti hesapla" },
    {
      _type: "ctaBandBlock",
      _key: key(),
      hidden: false,
      heading: "Kararsız mısın? Sormaktan çekinme.",
      ctaLabel: "WhatsApp'tan Yaz",
      ctaHref: "/iletisim/",
    },
  ],
};

const faqItems: Array<{ question: string; answer: string }> = [
  {
    question: "İade koşullarınız gerçekten koşulsuz mu?",
    answer:
      "Evet. Halı evinize uymadıysa — renk, doku, his, fark etmez — 14 gün içinde neden sorgulamadan iade alırız. İade kargosunu biz karşılarız, ücret iadesi ürünü teslim aldığımız gün yapılır.",
  },
  {
    question: "Kargo ne kadar sürer ve ücreti kim öder?",
    answer:
      "Stoktaki ürünler 1-3 iş günü içinde kargolanır; kargo ücretsizdir. Aktarma gecikmesi olursa takip bildirimleri SMS ile gelir. 3 iş gününü aşan gecikmelerde durumu size proaktif bildiririz.",
  },
  {
    question: "Halılarınız evde makinede yıkanabilir mi?",
    answer:
      "Modele göre değişir; her ürünün etiketinde ve sayfasında o halı için geçerli yıkama talimatı yazar. Genel kural: küçük ölçüler düşük devirde soğuk suyla yıkanabilir, büyük ölçüler profesyonel yıkamaya verilir.",
  },
  {
    question: "Profesyonel yıkamaya hangi sıklıkla vermeliyim?",
    answer:
      "Normal ev kullanımında yılda bir kez yeterlidir. Evcil hayvan veya yoğun trafik varsa yılda iki kez öneririz. Maliyet hesaplayıcımız bu masrafı 5 yıllık toplam maliyete dahil eder.",
  },
  {
    question: "Ölçü seçerken neye dikkat etmeliyim?",
    answer:
      "Salonda koltuk ön ayaklarının halı üzerine gelmesi ideal orandır. Yemek masasında sandalye geriye çekildiğinde halıdan çıkmamalı: masa ölçüsüne her yönden en az 60 cm ekleyin. Emin değilseniz WhatsApp'tan kroki gönderin, birlikte bakalım.",
  },
  {
    question: "Sitedeki renk ile gelen ürün aynı olur mu?",
    answer:
      "Fotoğraflar doğal ışıkta, filtresiz çekilir. Yine de ekran kalibrasyonu fark yaratabilir; belirgin ton farkı olursa bu bizim sorumluluğumuzdur ve koşulsuz iade kapsamındadır.",
  },
  {
    question: "Dürüst Etiket'teki leke testleri nasıl yapılıyor?",
    answer:
      "Her modelin numunesine çay, kahve, vişne suyu ve mürekkep uygulanır; bekleme süreleri ve müdahale yöntemi not edilir. Sonuç ÇIKAR/KISMEN/ÇIKMAZ olarak, yöntem notuyla birlikte etikete yazılır. ÇIKMAZ sonuçlarını da yayınlarız.",
  },
  {
    question: "Hav yüksekliği neden 'ölçülmüş' diye vurgulanıyor?",
    answer:
      "Sektörde etiketlere genellikle üretici beyanı yazılır ve gerçek değerden yüksek olabilir. Biz her partiden numune alıp kumpasla kendimiz ölçer, etikete kendi ölçümümüzü yazarız.",
  },
  {
    question: "Parti numarası ne işe yarar?",
    answer:
      "Aynı modelin farklı üretim partilerinde küçük ton farkları olabilir. Parti numarası sayesinde hangi üretimden olduğunu biliriz; değişim, şikayet ve üretim hatası takibinde bu numara baz alınır.",
  },
  {
    question: "Halılarınızı kendiniz mi üretiyorsunuz?",
    answer:
      "Hayır ve bunu saklamıyoruz: halılarımız anlaşmalı tesislerde fason üretilir. Bizim katkımız tasarım, kalite şartnamesi, parti bazlı test ve ölçüm sürecidir. 'Kendi fabrikamız' gibi bir iddiamız yok; şeffaflık taahhüdümüzün parçası bu.",
  },
  {
    question: "Tüy dökme skoru neye göre belirleniyor?",
    answer:
      "Yeni halıya standart süpürge testi uygulanır ve ilk dört haftadaki elyaf bırakma gözlemine göre düşük/orta/yüksek skoru verilir. Çoğu halıda ilk 1-2 hafta hafif elyaf gelmesi normaldir ve skoru etkilemez.",
  },
  {
    question: "Robot süpürge halılarınıza zarar verir mi?",
    answer:
      "Kısa havlı modeller (ör. Kervan) robot süpürgeyle sorunsuz çalışır. Yüksek havlı modellerde fırçalı başlık havı yıpratabilir; ürün sayfasında robot süpürge uyumluluğu belirtilir.",
  },
  {
    question: "Açık Şikayet Panosu'ndaki kayıtlar gerçek mi, seçilmiş mi?",
    answer:
      "Tümü gerçek ve eksiksizdir. Pano kayıtları silinmez; çözülen kayıtlar cevabıyla birlikte yayında kalır. Editör rollerinde silme yetkisi teknik olarak kapalıdır — bu kuralı kendimize de uygularız.",
  },
  {
    question: "Fiyatlarınız pazarlıklı mı?",
    answer:
      "Hayır. Etikette yazan fiyat herkes için aynıdır; pazarlık yapan müşteriyle yapmayanın farklı fiyat ödemesini doğru bulmuyoruz. Dönemsel indirimler herkese aynı anda, açıkça duyurulur.",
  },
  {
    question: "Halıyı sermeden önce ne yapmalıyım?",
    answer:
      "Rulodan çıkan halıyı ters yönde hafifçe sarıp birkaç saat bekletin, kıvrımlar açılır. İlk hafta kenar kalkması normaldir; geçmezse WhatsApp'tan yazın, çözüm öneririz. Zemin nemliyse sermeden önce tamamen kurumasını bekleyin.",
  },
];

const sssPage = {
  _id: "page-sss",
  _type: "page",
  title: "Sıkça Sorulan Sorular",
  slug: { _type: "slug", current: "sss" },
  seo: seo(
    "Sıkça Sorulan Sorular | Tulpar Carpet",
    "İade, kargo, yıkama, ölçü seçimi ve dürüst etiket süreçleri hakkında en çok sorulan 15 sorunun açık cevapları."
  ),
  blocks: [
    {
      _type: "faqAccordionBlock",
      _key: key(),
      hidden: false,
      items: faqItems.map((i) => ({ _key: key(), ...i })),
    },
  ],
};

const maliyetSeoText = `Halı satın alırken çoğumuz yalnızca etiketteki satış fiyatına bakarız. Oysa bir halının size gerçek maliyeti, onu evinizde kullandığınız yıllar boyunca yaptığınız bakım harcamalarıyla birlikte ortaya çıkar. Halı yıkama fiyatları, leke çıkarma masrafları, erken yıpranma nedeniyle yapılan yenileme alışverişleri… Bunların tümü toplandığında, "ucuz" görünen bir halı beş yılın sonunda pahalı bir tercihe dönüşebilir. Bu sayfadaki maliyet hesaplayıcıyı tam olarak bu yanılgıyı ortadan kaldırmak için yaptık.

Türkiye'de profesyonel halı yıkama fiyatları şehre, halının ölçüsüne ve malzemesine göre değişir. Büyükşehirlerde orta boy (160x230) bir makine halısının yıkama ücreti genellikle seferlik birkaç yüz lira bandındadır; yün ve el dokuması halılarda bu rakam belirgin biçimde yükselir. Eve servisli yıkamacılarda alma-getirme ücreti de eklenir. Yılda ortalama iki kez yıkatan bir hane için bu, beş yılda on yıkama demektir — yani çoğu zaman halının kendi fiyatına yaklaşan, bazen onu aşan bir toplam.

Bakım maliyetini etkileyen ikinci büyük kalem leke davranışıdır. Lekeyi tutmayan, doğru müdahaleyle temizlenen bir halı, her kazada profesyonel temizlik gerektiren bir halıya göre yıllar içinde ciddi fark yaratır. Bu yüzden Dürüst Etiket'te her modelin çay, kahve, vişne suyu ve mürekkep testlerinin sonuçlarını yöntem notlarıyla birlikte yayınlıyoruz. ÇIKMAZ sonucu alan testleri de gizlemiyoruz; çünkü hangi lekenin çıkmadığını bilmek, sizi gereksiz temizlik masrafından ve hayal kırıklığından korur.

Üçüncü kalem, halının ömrüdür. Hav yüksekliği etikette yazandan düşük çıkan, ilk yıkamada formunu kaybeden ya da iki yılda yolluk gibi ezilen bir halı, ne kadar ucuza alınmış olursa olsun pahalıdır; çünkü yerine yenisini alırsınız. Beş yıllık maliyet hesabında halının beklenen ömrünü hesaba katmak, satın alma kararının en çok atlanan adımıdır. Ölçülmüş hav yüksekliği ve parti bazlı kalite kontrolü tam da bu yüzden etiketimizin merkezindedir.

Evde yıkama bir tasarruf yolu gibi görünebilir ve bazı modeller için gerçekten öyledir: kısa havlı, uygun ölçülü halılar düşük devirli makinede soğuk suyla yıkanabilir. Ancak yanlış yıkama — sıcak su, yüksek devir, radyatör üzerinde kurutma — taban tutkalını bozar ve halının ömrünü kısaltır. Yani yanlış yapılan ev yıkaması, kazandırdığını fazlasıyla geri alır. Hangi modelin evde yıkanabileceğini ürün sayfalarındaki yıkama talimatında açıkça belirtiyoruz; talimat dışına çıkıldığında oluşan hasarın maliyeti, profesyonel yıkamadan her zaman yüksektir.

Hesaplayıcımız şu mantıkla çalışır: halının satış fiyatına, seçtiğiniz yıllık yıkatma sıklığı ve şehrinizdeki ortalama sefer ücretiyle hesaplanan beş yıllık bakım maliyeti eklenir. Çıkan toplam, farklı halılar arasında elma ile elmayı karşılaştırmanızı sağlar. Varsayılan değerleri Türkiye ortalamasına göre belirledik, ancak ikisini de kendi gerçeğinize göre değiştirebilirsiniz — örneğin evcil hayvanınız varsa yıkama sıklığını artırın, kendi şehrinizin fiyatını biliyorsanız onu girin. Hesabın hiçbir adımı gizli değildir; hangi sayının nereden geldiğini ekranda görürsünüz.

Sonuç bölümünde çıkan fark tutarını WhatsApp üzerinden bize gönderebilir, kendi kullanım senaryonuz için hangi modelin daha mantıklı olduğunu birlikte konuşabilirsiniz. Amacımız size en pahalı halıyı satmak değil; beş yılın sonunda "iyi ki bunu almışım" dedirtecek halıyı bulmanızı sağlamaktır. Çünkü bizim işimiz tek seferlik satış değil, etikette yazanın evinizde de doğru çıkması üzerine kurulu bir güven ilişkisidir. Hesaplayıcıyı kullanın, sonuçları sorgulayın, bize de sorun — şeffaflık bunun için var.

Halı bakım maliyetini düşürmenin pratik yolları da var ve bunlar hesaplayıcının çıktısını doğrudan etkiler. Birincisi düzenli kuru bakım: haftada bir, fırçasız başlıkla yapılan çekim, kiri hav dibine inmeden alır ve profesyonel yıkama ihtiyacını seyrekleştirir. İkincisi anında leke müdahalesi: dökülen sıvıyı ovmadan, temiz beyaz bezle bastırarak almak çoğu lekeyi kalıcı olmaktan çıkarır; ovmak ise lekeyi liflerin derinine iter ve temizlik faturasını büyütür. Üçüncüsü halıyı yılda bir kez yön değiştirerek sermek: trafik izi tek bölgede yoğunlaşmaz, halı homojen eskir ve ömrü uzar. Dördüncüsü doğru altlık kullanımı: kaymaz altlık yalnızca güvenlik için değil, tabanın zeminle sürtünerek aşınmasını önlediği için de bakım maliyetini düşürür.

Sık sorulan bir soru da şudur: "Halı yıkama fiyatı metrekare üzerinden mi hesaplanır?" Çoğu profesyonel yıkamacı metrekare birim fiyatı uygular; örneğin 160x230 bir halı yaklaşık 3,7 metrekaredir ve toplam ücret birim fiyatla çarpılarak bulunur. Yün, bambu ve viskon gibi hassas elyaflarda birim fiyat makine halısının iki katına kadar çıkabilir; bu yüzden satın alma aşamasında elyaf seçimi, beş yıllık bakım bütçenizi en baştan belirler. Hesaplayıcıda sefer başı ücret alanına kendi halınızın metrekaresine karşılık gelen gerçek tutarı girerseniz sonuç o kadar isabetli olur.

Bir de zamanlama meselesi var: yıkamacıların yoğun sezonu bahar temizliği ve bayram öncesi dönemlerdir; bu dönemlerde hem fiyatlar yükselir hem teslim süreleri uzar. Yıkamayı sonbahara ya da kış başına planlamak, aynı hizmeti çoğu zaman daha uygun fiyata almanızı sağlar. Küçük bir takvim kararı, beş yıllık toplamda bir yıkama ücreti kadar tasarruf demektir.

Son olarak şunu açıkça söyleyelim: bu sayfadaki rakamlar tavsiye niteliğindedir ve piyasa fiyatları zamanla değişir. Varsayılan değerleri belirli aralıklarla güncelliyoruz; güncel olmadığını düşündüğünüz bir değer görürseniz Açık Pano'dan ya da WhatsApp'tan bize bildirin. Nitekim panodaki kayıtlardan birinde bir müşterimiz hesaplayıcının kendi şehri için iyimser kaldığını yazdı ve haklıydı; varsayılanları onun verdiği veriyle yeniden gözden geçirdik. Şeffaflık tek yönlü bir vitrin değil, karşılıklı bir düzeltme mekanizmasıdır — hesaplayıcı da bu mekanizmanın parçasıdır. Aşağıdaki hesaplayıcıya halı fiyatını, yıllık yıkatma sayınızı ve şehrinizdeki sefer ücretini girin; beş yıllık gerçek maliyeti saniyeler içinde, tüm ara adımlarıyla birlikte görün. Karar yine sizin — biz yalnızca rakamların tamamını masaya koyuyoruz.`;

const maliyetPage = {
  _id: "page-maliyet-hesaplayici",
  _type: "page",
  title: "Maliyet Hesaplayıcı",
  slug: { _type: "slug", current: "maliyet-hesaplayici" },
  seo: seo(
    "Halı Maliyet Hesaplayıcı — 5 Yıllık Gerçek Maliyet | Tulpar",
    "Halı yıkama fiyatları ve bakım masrafıyla 5 yıllık gerçek halı maliyetini hesaplayın. Satış fiyatı değil, toplam maliyetle karşılaştırın."
  ),
  blocks: [
    {
      _type: "manifestoBlock",
      _key: key(),
      hidden: false,
      heading: "Halının gerçek fiyatı, etikette yazan değildir",
      body: toPortableText(maliyetSeoText),
    },
  ],
};

// ---------------------------------------------------------------------------
// Çalıştır
// ---------------------------------------------------------------------------

async function main() {
  const docs = [siteSettings, ...products, ...complaints, anaSayfa, sssPage, maliyetPage];
  for (const doc of docs) {
    const res = await client.createIfNotExists(doc as Parameters<typeof client.createIfNotExists>[0]);
    console.log(`✔ ${doc._type} → ${res._id}`);
  }
  console.warn(
    "\nUYARI: Ürün görselleri (heroImage + ≥5 galeri görseli) seed'e dahil DEĞİL.\n" +
      "Gerçek ürün fotoğraflarını Sanity Studio (/studio) üzerinden ekleyin;\n" +
      "görseller eklenene kadar ürün dokümanları Studio doğrulamasında uyarı verir."
  );
}

main().catch((err) => {
  console.error("Seed başarısız:", err);
  process.exit(1);
});
