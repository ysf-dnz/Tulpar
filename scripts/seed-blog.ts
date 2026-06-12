/**
 * Tulpar Carpet — köşe taşı blog yazıları seed scripti (SEO-13).
 *
 * Kullanım:
 *   SANITY_API_WRITE_TOKEN=sk... NEXT_PUBLIC_SANITY_PROJECT_ID=xxx npx tsx scripts/seed-blog.ts
 *
 * `createIfNotExists` kullanır; mevcut dokümanların üzerine yazmaz.
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
const key = () => `seedblog-${(keyCounter++).toString(36).padStart(4, "0")}`;

/** Düz metni Portable Text bloklarına çevirir. "## " ile başlayan paragraflar h2 olur. */
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
  if (metaTitle.length > 60) throw new Error(`metaTitle > 60 (${metaTitle.length}): ${metaTitle}`);
  if (metaDescription.length > 155)
    throw new Error(`metaDescription > 155 (${metaDescription.length}): ${metaDescription}`);
  return { metaTitle, metaDescription };
};

type Faq = { question: string; answer: string };

function post(p: {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: "bakim" | "test" | "rehber" | "marka";
  publishedAt: string;
  body: string;
  faqItems?: Faq[];
  metaTitle: string;
  metaDescription: string;
}) {
  return {
    _id: p.id,
    _type: "blogPost",
    title: p.title,
    slug: { _type: "slug", current: p.slug },
    excerpt: p.excerpt,
    body: toPortableText(p.body),
    category: p.category,
    author: "Tulpar Carpet",
    publishedAt: p.publishedAt,
    ...(p.faqItems ? { faqItems: p.faqItems.map((f) => ({ _key: key(), ...f })) } : {}),
    seo: seo(p.metaTitle, p.metaDescription),
  };
}

// ---------------------------------------------------------------------------
// 1 — Halı Leke Testi Nasıl Yapılır? Bizim Protokolümüz (test)
// ---------------------------------------------------------------------------

const post1 = post({
  id: "blog-hali-leke-testi-protokolu",
  title: "Halı Leke Testi Nasıl Yapılır? Bizim Protokolümüz",
  slug: "hali-leke-testi-nasil-yapilir-protokolumuz",
  category: "test",
  publishedAt: "2026-06-10T09:00:00Z",
  excerpt:
    "Her partiden numune alıyor, üzerine çay, kahve, vişne suyu ve mürekkep döküyoruz. Sonucu ÇIKAR/KISMEN/ÇIKMAZ ölçeğiyle etikete yazıyoruz. İşte adım adım protokol.",
  metaTitle: "Halı Leke Testi Nasıl Yapılır? Protokolümüz | Tulpar",
  metaDescription:
    "Çay, kahve, vişne suyu ve mürekkeple yaptığımız parti bazlı halı leke testinin adım adım protokolü. ÇIKAR/KISMEN/ÇIKMAZ ölçeği ve yöntem notları.",
  faqItems: [
    {
      question: "Leke testini her halıya mı, her partiye mi uyguluyorsunuz?",
      answer:
        "Her üretim partisine. Aynı modelin farklı partilerinde iplik ve boya davranışı değişebilir; bu yüzden test sonucu etikette parti numarasıyla birlikte yazar.",
    },
    {
      question: "ÇIKMAZ sonucu alan bir halıyı yine de satıyor musunuz?",
      answer:
        "Evet, ama sonucu saklamadan. Örneğin mürekkep birçok halıdan çıkmaz; bunu etikete yazarız ve ürün sayfasında o halının kimin için uygun olmadığını açıkça belirtiriz.",
    },
    {
      question: "Evde aynı testi kendim yapabilir miyim?",
      answer:
        "Yapabilirsiniz: halının görünmeyen bir köşesine bir çay kaşığı sıvı dökün, 5 dakika bekleyin, soğuk su ve beyaz bezle bastırarak alın. Ovmayın; ovmak lekeyi liflerin derinine iter.",
    },
  ],
  body: `Sektörün en yıpranmış cümlesi "leke tutmaz"dır. Etikette yazar, reklamda söylenir, mağazada tekrarlanır — ama nasıl test edildiği, hangi lekeyle, kaç dakika bekletilerek denendiği hiçbir yerde yazmaz. Biz bu cümleyi kullanmıyoruz. Onun yerine her üretim partisinden numune alıyor, üzerine dört standart lekeyi kendi elimizle döküyor ve sonucu olduğu gibi etikete yazıyoruz. Bu yazıda o protokolün tamamını, ölçüleriyle birlikte anlatıyoruz; çünkü doğrulanamayan bir iddianın pazarlamadan farkı yoktur.

## Neden dört leke: çay, kahve, vişne suyu, mürekkep

Test maddelerini rastgele seçmedik. Çay, Türkiye'de bir halının başına gelme olasılığı en yüksek kazadır ve tanen içerdiği için iyi bir orta zorluk ölçütüdür. Kahve, yağ ve pigmenti birlikte taşır; sütlü olduğunda protein de eklenir ve temizliği zorlaşır. Vişne suyu, antosiyanin pigmentiyle "zor ama mümkün" sınıfının temsilcisidir — kırmızı şarap, nar suyu ve meyveli içeceklerin davranışını büyük ölçüde temsil eder. Mürekkep ise kasıtlı olarak en kötü senaryodur: çoğu halıdan çıkmaz ve bunu bilmek, ev ofisi olan ya da küçük çocuğu kalem kullanan bir aile için satın alma kararını doğrudan etkiler. Dört madde birlikte, gerçek bir evin beş yılda karşılaşacağı leke yelpazesinin yaklaşık yüzde 90'ını kapsar.

## Protokolün adımları

Birinci adım numune: her partiden, halının satışa çıkacak ölçüsüyle aynı dokuma hattından 50x50 cm numune kesilir. Numune 24 saat oda koşullarında (20-23°C, %45-55 nem) dinlendirilir; çünkü soğuk depodan yeni çıkmış bir halının lifleri sıvıyı farklı emer.

İkinci adım uygulama: her leke için 10 ml standart miktar kullanılır. Çay demli ve 60°C, kahve sütlü ve 50°C, vişne suyu oda sıcaklığında, mürekkep tükenmez kalemden 1 ml çizgi olarak uygulanır. Sıvılar 30 cm yükseklikten dökülür — günlük hayatta bardak masadan böyle devrilir.

Üçüncü adım bekleme: her leke iki senaryoyla test edilir. "Anında müdahale" senaryosunda 5 dakika, "fark edilmedi" senaryosunda 60 dakika beklenir. Çoğu üreticinin testi yalnızca anında müdahaleyi ölçer; oysa gerçek evde leke çoğu zaman kurumaya yüz tutmuşken fark edilir.

Dördüncü adım temizlik: müdahale her numunede aynıdır ki sonuçlar karşılaştırılabilir olsun. Önce kuru beyaz bezle bastırarak emdirme, sonra soğuk su ve pH nötr deterjanla dıştan içe doğru tampon, en son temiz suyla durulama ve gölgede kurutma. Ovma, sıcak su ve çamaşır suyu protokolde yasaktır; bunlar lekeyi değil halıyı bozar.

Beşinci adım değerlendirme: kuruyan numune gün ışığında ve 4000K yapay ışıkta iki ayrı kişi tarafından incelenir. İz tamamen yoksa ÇIKAR, açıdan veya belirli ışıkta seçilebilen soluk gölge varsa KISMEN, leke net biçimde görünüyorsa ÇIKMAZ yazılır. İki değerlendirici anlaşamazsa kötü olan sonuç geçerlidir — şüphe her zaman müşteri lehine değil, iddia aleyhine çözülür.

## ÇIKAR / KISMEN / ÇIKMAZ ölçeği ne anlatır, ne anlatmaz

Bu üçlü ölçek bilinçli olarak kabadır. "Yüzde 87 leke direnci" gibi hassas görünen rakamlar laboratuvar dışında hiçbir şey ifade etmez; ama ÇIKAR, KISMEN ve ÇIKMAZ kelimelerinin evde tek bir karşılığı vardır. ÇIKAR: doğru müdahaleyle iz kalmaz. KISMEN: hemen müdahale ederseniz büyük oranda kurtarırsınız, geç kalırsanız soluk iz kalıcıdır. ÇIKMAZ: bu lekeyle bu halı bir arada yaşayamaz; ya halıyı ya alışkanlığı değiştirin. Etiketteki her sonucun yanında yöntem notu da yazar — örneğin Bozkır'ın etiketinde vişne için "hemen müdahaleyle açıldı; 1 saat bekleyen lekede soluk iz kaldı" notunu görürsünüz. Not olmadan sonuç, sonuç olmadan iddia yayınlamayız.

## Sonuçlar nereye yazılır, nasıl denetlenir

Test sonuçları üç yerde yaşar: halının fiziksel etiketinde, ürün sayfasındaki Dürüst Etiket bölümünde (tulparcarpet.com/durust-etiket/ sayfasında sistemin tamamı anlatılır) ve parti kayıt defterimizde. Parti numarası etikette açıkça durur; elinizdeki halının test kaydını sorduğunuzda WhatsApp üzerinden o partinin sonuçlarını gönderirz dediğimizde kastettiğimiz budur. Bir partinin sonucu önceki partiden kötü çıktıysa etiket güncellenir — pazarlama açısından can sıkıcıdır ama protokolün amacı pazarlamayı rahat ettirmek değildir. Testten geçemeyen sonuçlar da Açık Şikayet Panosu mantığıyla yayında kalır; sildiğimiz tek bir kayıt yoktur.

Bu protokol mükemmel değil. Ev koşulları sonsuz çeşitlidir: halının yaşı, evin nemi, suyunuzun sertliği sonucu etkiler. Bizim taahhüdümüz sonsuz çeşitliliği simüle etmek değil; aynı testi her partiye aynı şekilde uygulamak ve ne bulursak onu yazmaktır. Bir halının çay testinden geçip mürekkepten kaldığını bilmek, "leke tutmaz" cümlesinden daha az parlak ama sonsuz kat daha kullanışlıdır. Satın almadan önce kendi kullanım senaryonuzu düşünün: evinizde en sık ne dökülüyor? Cevabınız vişne suyuysa KISMEN sonucu sizin için ÇIKMAZ kadar önemlidir. Kararsızsanız ölçünüzü ve senaryonuzu WhatsApp'tan yazın; size parlak olanı değil, doğru olanı söyleyelim.

## Sık yapılan üç itiraz ve cevaplarımız

"Bu testi siz yapıyorsunuz, kendi notunuzu kendiniz veriyorsunuz" — doğru ve tam da bu yüzden protokolün her adımını mililitresine kadar yayınlıyoruz. Aynı testi evinizdeki numuneye uygulayıp sonucu karşılaştırabilirsiniz; farklı bir sonuç bulursanız parti numaranızla yazın, kaydı birlikte açalım. Bugüne kadar iki müşterimiz bunu yaptı ve ikisinde de sonuçlar tuttu; tutmadığı gün o kaydı da yayınlarız. "Bağımsız laboratuvar daha güvenilir olmaz mıydı?" — boya haslığı gibi standart ölçümlerde laboratuvar raporu zaten şartnamemizde var; ama leke testi, gerçek ev senaryosunu (devrilen bardak, geç fark edilen leke, elde yapılan müdahale) taklit ettiği için anlamlıdır ve bu senaryoyu en iyi, halıyı satan ve iadesini de üstlenen taraf ciddiye alır. "Üç kademeli ölçek çok kaba değil mi?" — kaba olması özelliktir: satın alma anında ihtiyacınız olan bilgi ondalıklı bir skor değil, "bu leke bu halıyla yaşar mı yaşamaz mı" sorusunun cevabıdır. Protokol her partide tekrarlandığı için zaman içinde bir model hakkında biriken sonuç serisi, tek seferlik hassas bir ölçümden daha güvenilir bir resim verir. Eleştiriniz, öneriniz ya da test etmemizi istediğiniz yeni bir leke maddesi varsa Açık Pano her zaman açık — protokolün dördüncü maddesi de bir müşteri önerisiyle eklendi.

İlgili sayfalar: → tulparcarpet.com/durust-etiket/ · tulparcarpet.com/halilar/ · tulparcarpet.com/acik-pano/`,
});

// ---------------------------------------------------------------------------
// 2 — Halı Tüy Dökmesinin Gerçek Nedenleri (bakim)
// ---------------------------------------------------------------------------

const post2 = post({
  id: "blog-hali-tuy-dokmesi-nedenleri",
  title: "Halı Tüy Dökmesinin Gerçek Nedenleri",
  slug: "hali-tuy-dokmesinin-gercek-nedenleri",
  category: "bakim",
  publishedAt: "2026-06-06T09:00:00Z",
  excerpt:
    "Yeni halının iki hafta elyaf bırakması normal, üç ay sürmesi değil. Tüy dökmesinin dört gerçek nedeni, hangisinin geçici hangisinin üretim hatası olduğu ve ne yapmanız gerektiği.",
  metaTitle: "Halı Tüy Dökmesinin Gerçek Nedenleri | Tulpar Carpet",
  metaDescription:
    "Halı neden tüy döker? Kesik hav, kısa elyaf, yanlış süpürge ve üretim hatası: dört gerçek neden, normal ile kusuru ayıran süreler ve pratik çözümler.",
  body: `Yeni halınızı serdiniz, üç gün sonra süpürge haznesi elyafla doldu ve aklınıza ilk gelen soru şu oldu: "Bozuk mu geldi?" Çoğu zaman hayır — ama bazen evet. Bu yazının amacı ikisini birbirinden ayırmanızı sağlamak. Çünkü sektör bu konuda iki uçta yalan söyler: satıcı "hiç tüy dökmez" der (döker), müşteri hizmetleri her şikayete "normaldir, geçer" der (bazen geçmez). Gerçek, dört ayrı nedene bakmayı gerektirir.

## Neden 1: Kesik havlı üretimin doğası — geçici ve normal

Makine halılarının büyük bölümü kesik havlıdır: ilmekler dokunduktan sonra üstten tıraşlanır ve yüzey kadife gibi düzleşir. Bu tıraşlama sırasında tam bağlanmamış kısa elyaf parçaları hav arasında kalır. Halı fabrikada vakumlanır ama hepsi çıkmaz; kalan serbest elyaf, evinizdeki ilk haftalarda yürüme ve süpürmeyle yüzeye çıkar. Bu, üretimin doğal yan ürünüdür ve halının dokusundan kopan iplik değildir. Normal seyir: ilk 1-2 hafta belirgin, 3-4. haftada azalan, 6. haftada biten elyaf gelişi. Bizim tüy dökme skorumuz tam bu gözleme dayanır — yeni halıya standart süpürge testi uygular, ilk dört haftadaki elyaf bırakmayı kaydeder ve düşük/orta/yüksek olarak etikete yazarız. "Düşük" yazan bir halı sıfır elyaf bırakacak demek değildir; ilk haftalarda gelen miktarın hızla azalacağı ve dokudan kopma olmadığı demektir.

## Neden 2: Kısa ve zayıf elyaf — ucuzluğun gizli faturası

Aynı polipropilen yazısını taşıyan iki halı çok farklı davranabilir, çünkü etikette elyaf cinsinin yanında elyafın kalitesi yazmaz. Kısa kesimli, düşük bükümlü ucuz iplik, kullanım sürtünmesiyle sürekli mikro kopma yaşar; halı aylarca, hatta ömrü boyunca tüy bırakır. Bu, geçici fabrika elyafı değil, dokunun kendisinin aşınmasıdır ve zamanla hav seyrelir, halı "yorgun" görünür. Satın alırken bunu çıplak gözle anlamak zordur; bizim yaklaşımımız iplik bükümünü üretim şartnamesine yazmak ve her partide kontrol etmektir. Etiket fiyatı düşük bir halının beş yılda neden pahalıya geldiğini anlatan yazımızda bu kalemi rakamlarıyla açtık; tüy dökmesi sadece estetik bir sorun değil, ömür kısalmasının erken habercisidir.

## Neden 3: Yanlış süpürge ve yanlış kullanım

Bazı tüy dökmelerinin suçlusu halı değil, başlıktır. Sert döner fırçalı süpürge başlıkları, özellikle yüksek havlı halılarda lifleri çekiştirir ve koparır. Haftada birkaç kez agresif fırçayla süpürülen bir halı, normalde altı haftada bitecek dökme sürecini aylarca uzatabilir; üstelik bu kez gelen elyaf serbest kalıntı değil, koparılmış liftir. Çözüm basit: yüksek havlı halılarda fırçasız ya da fırçası kapatılabilir başlık kullanın, robot süpürgeyi kısa havlı modellerde tercih edin. Diğer kullanım hataları da listeye girer: radyatör üzerinde kurutulan halıda taban tutkalı sertleşip lif bağlarını çatlatır; yüksek devirde yıkanan halı mekanik strese girer. Her ürün sayfamızdaki yıkama talimatı bu yüzden modele özeldir — "yıkanabilir" tek başına bir bilgi değildir.

## Neden 4: Üretim hatası — normalleştirilmemesi gereken durum

Şimdi dürüst kısma gelelim: bazen halı gerçekten kusurludur. Taban tutkalı eksik sürülmüşse, ilmek bağlama gerginliği yanlışsa veya hatalı iplik partisi kullanılmışsa halı dokusundan iplik verir. Bunu normal dökmeden ayırmanın üç işareti var. Birincisi süre: altı haftayı geçen, azalmayan dökülme. İkincisi biçim: kısa toz elyaf yerine uzun, bütün iplik parçaları geliyorsa doku çözülüyor demektir. Üçüncüsü bölgesellik: dökülme halının genelinde değil tek bölgede yoğunsa o bölgede üretim hatası vardır. Bu üç işaretten biri varsa "geçer" cevabını kabul etmeyin. Bizde süreç şöyle işler: etiketteki parti numarasıyla bize yazarsınız, o partinin üretim ve test kaydına bakarız, hata bizdense halı değişir ve kayıt Açık Şikayet Panosu'nda yayınlanır. Nitekim panodaki 1006 numaralı kayıt tam bu konuyla ilgili: bir müşterimiz "düşük" skorlu halısının üç haftadır tüy bıraktığını yazdı ve sorusu haklı bir soru — skorun neye dayandığını burada açıkladığımız gibi, o partinin kaydını da kendisiyle paylaşıyoruz.

## Özet: ne zaman sakin olun, ne zaman yazın

İlk altı hafta, azalan seyirde, kısa elyaf: sakin olun, haftada bir fırçasız başlıkla süpürün, süreç kendini tamamlar. Altı haftadan uzun, azalmayan, uzun iplikli ya da bölgesel dökülme: parti numaranızla bize WhatsApp'tan yazın. Halı alırken de iki soru sorun: "Tüy dökme skorunuz neye göre veriliyor?" ve "Sonuç etikette yazıyor mu?" Bu iki soruya net cevap veremeyen satıcının "hiç dökmez" cümlesi, bizim sektörde en sık duyduğumuz ve hiç kullanmadığımız cümledir.

## Dökme dönemini kısaltan pratik rutin

Yeni halının ilk altı haftası için önerdiğimiz rutin basit ve ucuzdur. İlk hafta: halıyı serdikten sonra 24 saat bekleyin, sonra fırçasız başlıkla, hav yönünde, yavaş geçişlerle süpürün — ilk çekim haznesinin dolu çıkması sizi telaşlandırmasın, bu fabrika kalıntısının kendisidir. İkinci-dördüncü haftalar: haftada iki kez aynı yöntemle süpürün; emiş gücünü orta kademede tutun, türbo modlar serbest elyafı almakla kalmaz, bağlı lifleri de zorlar. Beşinci haftadan itibaren haftada bir çekim yeterlidir. Bu süreçte yapılmaması gerekenler listesi de net: halı çırpma (lif bağlarına mekanik şok), yapışkan tüy toplama ruloları (yüzey liflerini çekiştirir), erken yıkama (ilk üç ay içinde yıkama, dökme sürecini sıfırlar ve uzatır). Evcil hayvan tüyüyle halı elyafını ayırt etmek de bakım kararlarını netleştirir: hazneye gelen materyal halı renginde ve kısa ise elyaftır, karışık renkte ve kıvrımlıysa tüydür — ikisinin temizlik stratejisi farklıdır. Altı haftanın sonunda hazne belirgin biçimde boşalmaya başladıysa süreç normal tamamlanıyor demektir; başlamadıysa yukarıdaki üç işareti tekrar kontrol edin ve gerekiyorsa parti numaranızla bize ulaşın. Tüy dökmesi yönetilebilir bir süreçtir — yeter ki kimin sorumluluğu olduğu baştan dürüstçe konuşulsun.

İlgili sayfalar: → tulparcarpet.com/durust-etiket/ · tulparcarpet.com/acik-pano/ · tulparcarpet.com/halilar/`,
});

// ---------------------------------------------------------------------------
// 3 — 5 Yıllık Halı Maliyeti (rehber)
// ---------------------------------------------------------------------------

const post3 = post({
  id: "blog-5-yillik-hali-maliyeti",
  title: "5 Yıllık Halı Maliyeti: Etiket Fiyatı Neden Yanıltır",
  slug: "5-yillik-hali-maliyeti-etiket-fiyati-neden-yaniltir",
  category: "rehber",
  publishedAt: "2026-06-02T09:00:00Z",
  excerpt:
    "2.000 TL'lik halı mı, 5.000 TL'lik halı mı daha pahalı? Yıkama, leke ve ömür kalemlerini ekleyince cevap değişiyor. Beş yıllık toplam maliyeti kalem kalem hesaplıyoruz.",
  metaTitle: "5 Yıllık Halı Maliyeti: Etiket Neden Yanıltır | Tulpar",
  metaDescription:
    "Halının gerçek maliyeti satış fiyatı değildir. Yıkama, leke müdahalesi ve ömür kalemleriyle 5 yıllık toplam maliyet hesabı; örnek tablolar ve hesaplayıcı.",
  faqItems: [
    {
      question: "5 yıllık maliyet hesabına hangi kalemler girer?",
      answer:
        "Dört kalem: satış fiyatı, profesyonel yıkama masrafı (sıklık x sefer ücreti x 5 yıl), leke ve onarım müdahaleleri, erken yenileme riski. Hesaplayıcımız ilk ikisini otomatik hesaplar.",
    },
    {
      question: "Ucuz halı her zaman pahalıya mı gelir?",
      answer:
        "Hayır. Az kullanılan bir misafir odasında ucuz halı rasyonel tercihtir. Pahalıya gelme, yoğun trafikli alanlarda kısa ömür ve sık bakımla birleşince ortaya çıkar; hesap kullanım senaryosuna göre yapılmalıdır.",
    },
    {
      question: "Halı yıkama fiyatı toplamı gerçekten halı fiyatını aşabilir mi?",
      answer:
        "Evet. Yılda iki kez yıkatılan 160x230 bir halı, sefer başı 900 TL ile beş yılda 9.000 TL yıkama masrafı üretir — bu, birçok orta segment halının satış fiyatının üzerindedir.",
    },
  ],
  body: `Mağazada iki halıya bakıyorsunuz: biri 2.490 TL, diğeri 4.890 TL. Çoğu insan bu karşılaştırmayı üç saniyede yapar ve "yarı fiyatına" olanı alır. Biz aynı karşılaştırmayı beş yıllık zaman penceresinde yapmanızı önereceğiz, çünkü halı bir tüketim ürünü değil, her yıl bakım masrafı üreten ve bir gün yenilenmesi gereken bir kullanım varlığıdır. Etiket fiyatı bu denklemin yalnızca ilk kalemidir — ve çoğu zaman en küçüğü değildir ama tek görüneni odur.

## Kalem 1: Satış fiyatı — buzdağının görünen kısmı

Satış fiyatı tek seferliktir ve nettir; yanıltıcılığı kendisinde değil, tek başına kullanılmasındadır. 2.490 TL ile 4.890 TL arasındaki 2.400 TL fark büyük görünür. Beş yıla bölünce ayda 40 TL'dir. Sorulması gereken soru şudur: bu 40 TL'lik fark bana ne satın alıyor? Cevap iplik kalitesi, leke davranışı ve ömürse, hesap devam etmelidir.

## Kalem 2: Profesyonel yıkama — sessizce biriken fatura

Türkiye'de profesyonel halı yıkama metrekare üzerinden ücretlendirilir ve 160x230 (3,7 m²) bir makine halısının sefer ücreti büyükşehirlerde tipik olarak 700-1.100 TL bandındadır; eve servis eklenince üst banda yaklaşır. Yılda iki kez yıkatan ortalama bir hane için hesap acımasız: sefer başı 900 TL x yılda 2 x 5 yıl = 9.000 TL. Evet, doğru okudunuz — yıkama toplamı her iki halının da satış fiyatını geçti. Bu kalemi küçültmenin iki yolu var: yıkama sıklığını düşüren bir halı (lekeyi tutmayan, kuru bakımla idare eden) ve doğru kuru bakım rutini. Yılda iki yıkamayı bire indiren bir halı, beş yılda 4.500 TL tasarruf demektir; etiketteki 2.400 TL fark bu tek kalemle amorti olur. Kendi şehrinizin fiyatı ve kendi sıklığınızla hesabı tulparcarpet.com/maliyet-hesaplayici/ adresindeki hesaplayıcıda saniyeler içinde yapabilirsiniz; hesabın hiçbir adımı gizli değildir.

## Kalem 3: Leke kazaları — planlanamayan ama öngörülebilen masraf

Beş yılda hiç leke kazası yaşamayan ev neredeyse yoktur. Fark, kazanın faturasındadır. Çay lekesini soğuk suyla kendiniz çıkarabildiğiniz halıda kaza sıfır maliyetlidir; her kazada bölgesel profesyonel temizlik gerektiren halıda sefer başına 300-500 TL yazarsınız, çıkmayan lekede ise halının görünür ömrü biter. Bu yüzden Dürüst Etiket'teki ÇIKAR/KISMEN/ÇIKMAZ sonuçları estetik bilgi değil, doğrudan finansal veridir. Mürekkep testi ÇIKMAZ olan bir halıyı ev ofisine sermek, planlanmış bir masraf kararıdır — bilerek veriyorsanız sorun yok, bilmeden veriyorsanız etiket size söylemeliydi.

## Kalem 4: Ömür — en büyük ve en görünmez kalem

Diyelim ucuz halı üç yılda yolluk gibi ezildi, havı seyreldi ve değiştirdiniz. Gerçek maliyeti artık 2.490 TL değil; üç yıllık kullanım için 2.490 TL, yani yıllık 830 TL'dir. Yedi yıl formunu koruyan 4.890 TL'lik halının yıllık maliyeti 699 TL'dir. "Yarı fiyatına" alınan halı, yıl başına maliyette daha pahalı çıktı — yıkama ve leke kalemleri eklenmeden önce bile. Ömrü belirleyen şeyler ölçülebilir: iplik bükümü, hav yoğunluğu, taban yapısı, ölçülmüş (beyan edilmiş değil) hav yüksekliği. Etiketimizde hav yüksekliğinin "biz ölçtük" vurgusuyla yazmasının nedeni budur; üretici beyanları bu kalemde sistematik olarak iyimserdir.

## Örnek tablo: iki halının beş yılı

Ucuz senaryo: 2.490 TL satış + 9.000 TL yıkama (yılda 2) + 800 TL leke müdahaleleri + 3. yılda yenileme 2.490 TL = beş yılda yaklaşık 14.780 TL. Dayanıklı senaryo: 4.890 TL satış + 4.500 TL yıkama (lekeyi tutmadığı için yılda 1) + 0 TL leke + yenileme yok = 9.390 TL. Aradaki fark 5.390 TL — ve bu, "pahalı" halının lehine. Rakamlar temsilidir, sizin gerçeğiniz farklı çıkabilir; mesele rakamların kendisi değil, hesabın bu dört kalemle yapılması gerektiğidir. Hesaplayıcımızdaki varsayılanları kendi verinizle değiştirin; bir müşterimiz Açık Pano'da varsayılan yıkama fiyatımızın kendi şehri için iyimser kaldığını yazdı ve haklıydı, değerleri gözden geçirdik.

## Sonuç: pahalı halı satmak için değil, doğru hesap için

Açık konuşalım: bu hesap her zaman bizim lehimize çıkmaz ve çıkmak zorunda da değil. Az girilen bir misafir odası için en ucuz halı çoğu zaman en doğru karardır ve bunu satış öncesinde söyleriz — her ürün sayfamızda "kimin için değil" bölümü bu yüzden vardır. İtirazımız ucuz halıya değil, tek kalemli hesaba. Beş yıllık toplamı görün, sonra karar verin; kararsız kalırsanız hesaplayıcı çıktınızı WhatsApp'tan gönderin, senaryonuzu birlikte okuyalım.

## Beş yıllık maliyeti düşüren satın alma soruları

Mağazada ya da ürün sayfasında şu beş soruyu sorarak dört kalemin hepsini tek seferde test edebilirsiniz. Bir: "Hav yüksekliği ölçülmüş değer mi, üretici beyanı mı?" — ömür kaleminin ilk göstergesi. İki: "Leke testleriniz hangi maddelerle, kaç dakika bekletilerek yapıldı ve sonuçlar nerede yazıyor?" — leke kaleminin tamamı bu cevapta. Üç: "Bu modelin hangi ölçüleri evde yıkanabilir, hangi koşullarda?" — yıkama kaleminin yarısı. Dört: "Bu halı kimin için uygun değil?" — bu soruya cevap veremeyen satıcı, size her halıyı satar. Beş: "Parti numarası ve iade koşulu nedir?" — hesabınız yanlış çıkarsa geri dönüş yolunuz. Bu soruların tamamına etiketinde ve ürün sayfasında cevap veren bir markadan alışveriş ediyorsanız, beş yıllık maliyet hesabınızın girdileri gerçek veridir; vermeyen bir markadaysa hesap, iyimser varsayımlar üzerine kurulu bir tahmindir. Aradaki fark, bu yazıdaki örnek tabloda gördüğünüz 5.390 TL'nin ta kendisi olabilir. Etiket fiyatı bir başlangıç noktasıdır — hesap makinesinin ilk tuşu, son tuşu değil. Beş soruyu telefonda bile sorabilirsiniz; iki dakikanızı alır ve cevap verme isteksizliğinin kendisi de bir cevaptır. Unutmayın: dört kalemli hesabı sizin yerinize kimse yapmaz, ama yapmanızı kolaylaştıran marka ile zorlaştıran marka arasındaki fark, beş yıl boyunca her yıkama faturasında karşınıza çıkar.

İlgili sayfalar: → tulparcarpet.com/maliyet-hesaplayici/ · tulparcarpet.com/durust-etiket/ · tulparcarpet.com/halilar/`,
});

// ---------------------------------------------------------------------------
// 4 — Halıdan Çay Lekesi Nasıl Çıkar? Test Ettik (bakim)
// ---------------------------------------------------------------------------

const post4 = post({
  id: "blog-halidan-cay-lekesi-nasil-cikar",
  title: "Halıdan Çay Lekesi Nasıl Çıkar? Test Ettik",
  slug: "halidan-cay-lekesi-nasil-cikar-test-ettik",
  category: "bakim",
  publishedAt: "2026-05-28T09:00:00Z",
  excerpt:
    "Demli çayı kendi halılarımıza döktük: 5 dakikalık ve 1 saatlik senaryolarda hangi yöntem işe yaradı, hangisi lekeyi kalıcı hale getirdi? Adım adım sonuçlar ve yapılmaması gerekenler.",
  metaTitle: "Halıdan Çay Lekesi Nasıl Çıkar? Test Ettik | Tulpar",
  metaDescription:
    "Demli çayı halıya döküp denedik: soğuk su + pH nötr deterjan yöntemi, 5 dk ve 1 saat senaryoları, kurumuş leke çözümü ve lekeyi kalıcılaştıran 4 hata.",
  faqItems: [
    {
      question: "Kurumuş çay lekesi halıdan çıkar mı?",
      answer:
        "Çoğu zaman evet, ama daha uzun sürer. Lekeyi ılık (sıcak değil) suyla nemlendirip 10 dakika bekletin, sonra pH nötr deterjanlı soğuk suyla dıştan içe tamponlayın. İlk seferde çıkmazsa işlemi 2-3 kez tekrarlayın; çamaşır suyuna asla başvurmayın.",
    },
    {
      question: "Çay lekesine karbonat veya sirke kullanılır mı?",
      answer:
        "Beyaz sirke seyreltilmiş halde (1 ölçü sirke, 2 ölçü su) inatçı çay lekesinde işe yarayabilir; testimizde kısmi fayda gördük. Karbonatı kuru emici olarak taze lekede kullanabilirsiniz, ama sürtmeden. İkisini birden köpürtmek ise temizlik değil, gösteridir.",
    },
  ],
  body: `Bu yazı bir tavsiye derlemesi değil, bir test raporu. İnternette "halıdan çay lekesi nasıl çıkar" diye arattığınızda karşınıza çıkan yöntemlerin çoğu hiç denenmeden birbirinden kopyalanmıştır. Biz farklı bir şey yaptık: leke testi protokolümüzü kullanarak demli çayı kendi halılarımızın numunelerine döktük, iki farklı senaryoda dört yöntemi karşılaştırdık ve sonuçları — işe yaramayanlar dahil — burada yayınlıyoruz.

## Test düzeni: ne döktük, nasıl bekledik

Standart protokolümüzdeki gibi 10 ml demli çayı (60°C) 30 cm yükseklikten, 50x50 cm halı numunelerine döktük. İki senaryo çalıştık: "anında fark edildi" (5 dakika bekleme) ve "sonra fark edildi" (60 dakika, leke kurumaya yüz tutmuş). Numuneler Bozkır ve Kervan'ın güncel partilerinden alındı; ikisi de çay testinde ÇIKAR sonuçlu modeller, yani buradaki bulgular "çıkabilen" leke üzerinden yöntem karşılaştırmasıdır. Çayın zorluğu tanenden gelir: bu bitkisel bileşik liflere tutunur ve sıcaklık yükseldikçe tutunması güçlenir — birazdan göreceğiniz gibi bu detay, en yaygın hatanın da açıklamasıdır.

## 5 dakika senaryosu: dört yöntemin karnesi

Yöntem 1 — kuru bezle emdirme + soğuk su + pH nötr deterjan: kazanan bu. Önce temiz beyaz bezle bastırarak sıvının alabildiğimiz kadarını aldık (bastırma, ovma değil). Sonra bir su bardağı soğuk suya yarım çay kaşığı pH nötr deterjan karıştırıp beze emdirdik ve lekenin dışından merkezine doğru tamponladık. Üç tekrar, ardından temiz suyla durulama tamponu ve kuru bezle son emdirme. Sonuç: iki numunede de iz yok — ÇIKAR.

Yöntem 2 — sadece soğuk su: şaşırtıcı derecede iyi. Deterjansız, yalnızca soğuk su tamponuyla Kervan'da iz tamamen çıktı, Bozkır'ın yüksek havında çok soluk bir gölge kaldı ve ertesi gün ikinci tamponla o da gitti. Ders: müdahale hızı, kullanılan kimyasaldan daha önemli.

Yöntem 3 — sıcak su: işte klasik hata. Sıcak su tanenin liflere bağlanmasını hızlandırır; 5 dakikalık taze lekede bile sıcak suyla tamponladığımız numunede belirgin sarı halka kaldı ve sonradan soğuk su yöntemine dönmek tam temizlik sağlamadı. Çay lekesinde sıcak su, lekeyi "pişirmektir".

Yöntem 4 — köpüklü halı şampuanı, bolca: kutudaki talimatın iki katı kadar kullandık, çünkü evde herkes öyle yapıyor. Leke çıktı ama durulanamayan deterjan kalıntısı havda yapışkan bir film bıraktı; iki hafta sonra o bölge, çevresinden gözle görülür biçimde daha kirliydi. Fazla deterjan, geleceğe leke siparişidir.

## 60 dakika senaryosu: kurumaya yüz tutmuş leke

Bir saat bekleyen çay lekesinde sıralama değişmedi ama eforlar büyüdü. Kazanan yöntem (soğuk su + pH nötr deterjan) Kervan'ın kısa havında üç tekrar yerine beş tekrarla ÇIKAR sonucu verdi. Bozkır'da önce lekeyi oda sıcaklığında suyla nemlendirip 10 dakika beklettik — kurumuş taneni yeniden çözmek için bu ara adım şart — ardından standart tamponlama ile soluk izin tamamı ancak ertesi günkü ikinci seansta gitti: teknik olarak KISMEN'den ÇIKAR'a uzanan bir sonuç. Seyreltilmiş beyaz sirkeyi (1 ölçü sirke, 2 ölçü su) de bu senaryoda denedik: inatçı kalıntıda fark yarattı, ancak kokusu için son durulamayı atlamamak gerekiyor.

## Lekeyi kalıcılaştıran dört hata

Testlerin ve yıllardır panomuza düşen kayıtların ortak listesi: Bir — ovmak. Ovma lekeyi çıkarmaz, lif diplerine ve geniş bir alana dağıtır; üstelik havın dokusunu bozar. Her zaman bastırarak emdirin. İki — sıcak su. Yukarıda gördünüz; çayda kesin yasak. Üç — çamaşır suyu. Leke gider, halının rengi de gider; yerinde leke yerine soluk yama kalır ve bu geri döndürülemez. Dört — ıslak bırakmak. Bölgeyi temizledikten sonra kuru bezle iyice emdirmez ve havalandırmazsanız nem, taban tutkalında ve havda küf kokusuna dönüşür. Kurutma için saç kurutma makinesini en düşük ve soğuk kademede, 30 cm mesafeden kullanabilirsiniz; radyatöre sermek yine yasak listesinde.

## Etiketteki sonuçla evdeki gerçek

Bir dürüstlük notu: bu test, çay sonucu ÇIKAR olan modellerimizde yapıldı ve her halı böyle davranmaz. Yün ve viskon gibi doğal elyaflar çaya karşı çok daha hassastır; bazı koyu boyalı halılarda ise leke çıkar ama müdahale bölgesi renk verir. Halınız bizden ise etiketinizdeki çay satırına ve yöntem notuna bakın — o sonuç, tam bu protokolle, sizin halınızın partisinde elde edildi. Sonuç KISMEN ise bu yazıdaki hız kuralı sizin için iki kat geçerli. Çıkmayan bir lekeyle uğraşıyorsanız fotoğrafını ve parti numaranızı WhatsApp'tan gönderin; deneyip de işe yaramayacak bir şeyi size "bir de şunu deneyin" diye satmayız. Halı seçerken leke davranışının maliyet tarafını da görmek isterseniz, beş yıllık maliyet yazımız ve hesaplayıcımız tam bunun için var.

## Acil durum kartı: çay döküldüğünde 60 saniyelik plan

Bu yazıdan tek bir şey kalacaksa şu kart kalsın; isterseniz yazdırıp mutfak dolabının içine yapıştırın. Saniye 0-10: paniği bırakın, halıyı değil bezi getirin — kuru, temiz, beyaz bir bez ya da kağıt havlu. Saniye 10-30: bezi lekenin üzerine koyup avucunuzla bastırın, ağırlığınızı verin, sıvının beze geçmesini bekleyin; bez doydukça temiz yüzeye çevirin. Asla dairesel hareket yapmayın. Saniye 30-60: bir bardak soğuk suya yarım çay kaşığı pH nötr deterjan karıştırın, temiz beze emdirin ve lekenin dış sınırından merkezine doğru tamponlayın. Sonraki 10 dakika: iki-üç tampon turu, ardından yalnızca temiz suyla durulama tamponu ve kuru bezle son emdirme. Bölgenin üzerine temiz kuru bez serip üzerine kitap gibi bir ağırlık koyarsanız kalan nem gece boyunca beze geçer. Bu plan yalnızca çay için de değil; kahve, kola ve meyve suyunun ilk müdahalesi aynıdır — yalnızca inatçı kalıntı aşamasında yöntemler ayrışır. Altmış saniyelik doğru başlangıç, çoğu lekede profesyonel temizlik ile kendi kendine çözüm arasındaki tek farktır.

İlgili sayfalar: → tulparcarpet.com/durust-etiket/ · tulparcarpet.com/maliyet-hesaplayici/ · tulparcarpet.com/halilar/`,
});

// ---------------------------------------------------------------------------
// 5 — Yıkanabilir Halı Ne Demek? (rehber)
// ---------------------------------------------------------------------------

const post5 = post({
  id: "blog-yikanabilir-hali-ne-demek",
  title: "Yıkanabilir Halı Ne Demek? Pazarlama mı Gerçek mi?",
  slug: "yikanabilir-hali-ne-demek-pazarlama-mi-gercek-mi",
  category: "rehber",
  publishedAt: "2026-05-23T09:00:00Z",
  excerpt:
    "'Yıkanabilir' etiketi tek başına hiçbir şey söylemez: hangi makinede, kaç derecede, kaç yıkamada? Terimin gerçek karşılığını, sınırlarını ve sorulması gereken beş soruyu açıklıyoruz.",
  metaTitle: "Yıkanabilir Halı Ne Demek? Pazarlama mı Gerçek mi?",
  metaDescription:
    "Yıkanabilir halı etiketi neyi garanti eder, neyi etmez? Makine kapasitesi, sıcaklık, devir, taban tutkalı ve form koruma: satın almadan sorulacak 5 soru.",
  body: `Son birkaç yılın en parlak halı pazarlama kelimesi: "yıkanabilir". Kulağa bir özellik gibi geliyor, oysa çoğu zaman bir cümlenin yarısı. Çünkü asıl soru şu: neyle, kaç derecede, kaç kez yıkanabilir — ve yıkandıktan sonra aynı halı olarak mı çıkar? Bu yazıda terimi parçalarına ayırıyoruz; amacımız "yıkanabilir" yazan halıları kötülemek değil, etiketin garantilediği ile garantilemediği arasındaki çizgiyi netleştirmek. Biz bu çizgiyi netleştirmeyi iş edinmiş bir markayız: ürün sayfalarımızdaki yıkama talimatları modele özeldir ve "yıkanabilir" kelimesini tek başına, koşulsuz biçimde kullanmayız.

## Teknik olarak ne anlama gelir?

Dar anlamıyla "yıkanabilir halı", suya daldırılarak yıkandığında dağılmayan, taban yapısı su ile bozulmayan halı demektir. Bunu mümkün kılan üç üretim tercihi vardır: suya dayanıklı sentetik elyaf (çoğunlukla polyester veya polipropilen), su bazlı değil termoplastik ya da dikişli taban konstrüksiyonu ve düşük gramajlı, ince yapı. Üçüncü madde kritik: bir halının ev tipi çamaşır makinesine girebilmesi için ince ve hafif olması gerekir. Yani "makinede yıkanabilir" iddiası, çoğu zaman halının aynı zamanda ince olduğu anlamına gelir — bu bir kusur değildir ama ayak altındaki his, ses yalıtımı ve dolgunluk beklentinizle çelişebilir. Mucize yoktur, takas vardır: yıkanabilirlik kazanırken genellikle hav yüksekliğinden ve gövdeden verirsiniz.

## Etiketin söylemediği dört şey

Birincisi makine kapasitesi. 120x180 bir halı ıslakken 7-8 kiloyu bulur; "makinede yıkanır" yazan halının sizin 8 kg'lık makinenize sığacağı anlamı yoktur. 160x230 ve üzeri ölçüler pratikte hiçbir ev makinesine sağlıklı sığmaz. İkincisi sıcaklık ve devir. Sentetik elyaf 30°C üstünde ve yüksek devirde mekanik strese girer; taban katmanlı modellerde tutkal yumuşar, halı yamulur. "Yıkanabilir" etiketli halıların kullanım kılavuzunda genellikle 30°C ve düşük devir yazar — kılavuzu kimse okumadığı için halı 60°C'de yıkanır ve suç halıya atılır. Üçüncüsü yıkama sayısı. Hiçbir etiket "kaç yıkamaya dayanır" demez. İlk yıkamada güzel çıkan halı önemli değil; on beşinci yıkamada hâlâ formunu koruyor mu, kenarları dalgalanmıyor mu, rengi solmadı mı? Dördüncüsü kuruma. Yıkamanın en çok hasar üreten aşaması kurutmadır: radyatör üzerinde kurutulan halıda taban sertleşir, asılı kurutulan ağır halıda kendi suyunun ağırlığıyla form bozulur. Doğrusu düz zeminde, gölgede, ara sıra çevirerek kurutmaktır ve bu, balkonu olmayan bir evde hiç pratik değildir.

## Pazarlama mı gerçek mi: cevap "hangisi olduğuna bağlı"

Dürüst cevap: ikisi de piyasada mevcut. Gerçekten suya daldırılarak yıkanmak üzere tasarlanmış, test edilmiş ürünler var; bunlar takaslarını (incelik, kısa hav) açıkça taşır. Bir de havuza girince dağılmadığı için "yıkanabilir" yazılmış sıradan halılar var — teknik olarak yalan değil, pratik olarak anlamsız. İkisini ayırmak için satıcıya beş soru sorun: Kaç derecede ve kaç devirde? Hangi ölçüleri ev makinesine girer? Kaç yıkama test edildi, form ve renk ne oldu? Taban konstrüksiyonu ne — tutkal su ile nasıl davranıyor? Yıkama kaynaklı form bozulması iade kapsamında mı? Net cevap alamadığınız her soru, etiketin pazarlama tarafına bir puan yazar.

## Bizim yaklaşımımız: modele özel talimat, koşulsuz iade

Tulpar'da genel kural şudur: kısa havlı modellerin küçük ölçüleri (örneğin Kervan 120x180 ve altı) evde düşük devirde, 30°C altı soğuk suyla yıkanabilir; büyük ölçüler ve yüksek havlı modeller için profesyonel yıkama öneririz. Bu bilgi her ürün sayfasında, o modelin etiketinde yazar — çünkü "yıkanabilirlik" bir marka sloganı değil, modele ve ölçüye bağlı bir mühendislik özelliğidir. Talimata uyduğunuz halde halınız formunu kaybettiyse bu bizim sorumluluğumuzdur ve koşulsuz iade kapsamındadır; pazarlama cümlesinin arkasında durmak tam olarak bu demektir. Bir de maliyet açısı var: "evde yıkarım, yıkamacıya para vermem" hesabı, yanlış yıkamayla halıyı erken emekli ettiğinizde tersine döner. Beş yıllık gerçek maliyeti yıkama senaryonuzla birlikte görmek için hesaplayıcımızı kullanın; evde yıkanabilen halının bu hesapta gerçek bir avantajı vardır, ama yalnızca doğru yıkanırsa.

Özetle: "yıkanabilir" kelimesini gördüğünüzde silmeyin ama tek başına da satın almayın. Derece, devir, ölçü, tekrar sayısı ve iade güvencesi — bu beşi cümleye eklendiğinde pazarlama biter, bilgi başlar. Hangi modelin sizin makinenize ve kullanımınıza uyduğundan emin değilseniz makinenizin kapasitesini ve düşündüğünüz ölçüyü WhatsApp'tan yazın; "hepsi yıkanır" demeyeceğimize emin olabilirsiniz.

## Evde yıkama yapacaklara: doğru prosedür

Evde yıkanabilir bir modeli, talimatına uygun yıkamak isteyenler için adım adım prosedür şöyle. Önce halıyı dışarıda iyice çırpmadan, fırçasız başlıkla her iki yüzünden süpürün; makineye kuru kir götürmeyin. Makineye tek başına koyun — yanına havlu, çarşaf eklemek hem halıyı hem makineyi zorlar. Program: 30°C, hassas/elde yıkama programı, maksimum 600 devir sıkma; mümkünse ekstra durulama ekleyin, hav arasında kalan deterjan kalıntısı kuruyunca kiri mıknatıs gibi çeker. Deterjan: az miktarda sıvı ve pH nötr; toz deterjan ve yumuşatıcı yasak — yumuşatıcı hav üzerinde film bırakır ve kaymaya neden olur. Kurutma bu işin yarısıdır: halıyı asarak değil, düz zeminde, gölgede ve mümkünse hava akımı olan bir yerde kurutun; iki-üç saatte bir çevirin. Tam kurumadan sermeyin — nemli taban, zeminde küf ve koku üretir. Tüm bunlar size fazla iş gibi geldiyse, doğru sonuç şu olabilir: sizin için ideal halı "yıkanabilir" olan değil, profesyonel yıkamaya yılda bir gidip dönen dayanıklı bir modeldir. İkisi de meşru tercihtir; yeter ki kararı pazarlama cümlesi değil, kendi kullanım gerçeğiniz versin. Bir ölçü hatırlatması daha: ıslak halı kuru ağırlığının iki katından fazlasına çıkar, bu yüzden 8 kg makine kapasitesi pratikte en fazla 120x180 ince bir halı demektir. Makinenizin kazanına katlamadan, bastırmadan giren halı doğru ölçüdür; zorla sığdırılan halı hem motoru hem rulmanı hem de halının tabanını aynı seansta yorar.

İlgili sayfalar: → tulparcarpet.com/halilar/ · tulparcarpet.com/maliyet-hesaplayici/ · tulparcarpet.com/sss/`,
});

// ---------------------------------------------------------------------------
// 6 — Salon Halısı Seçimi (rehber)
// ---------------------------------------------------------------------------

const post6 = post({
  id: "blog-salon-halisi-secimi",
  title: "Salon Halısı Seçimi: Ölçü, Hav, Leke Direnci",
  slug: "salon-halisi-secimi-olcu-hav-leke-direnci",
  category: "rehber",
  publishedAt: "2026-05-19T09:00:00Z",
  excerpt:
    "Salon halısında üç karar her şeyi belirler: doğru ölçü (koltuk ayağı kuralı), doğru hav yüksekliği (konfor-bakım takası) ve gerçekçi leke direnci. Üçü için de somut kurallar burada.",
  metaTitle: "Salon Halısı Seçimi: Ölçü, Hav, Leke Direnci | Tulpar",
  metaDescription:
    "Salon halısı nasıl seçilir? Koltuk ayağı kuralıyla ölçü hesabı, hav yüksekliği takası (7 mm mi 20 mm mi?) ve leke direnci soruları tek rehberde.",
  body: `Salon, evin en pahalı halısının serildiği ve en çok kazanın yaşandığı odadır: misafir, çay, kahve, çocuk, kumanda ve günde yüzlerce adım. Bu yüzden salon halısı seçimi üç ayrı kararın toplamıdır — ölçü, hav, leke direnci — ve üçünden birinde yapılan hata, diğer ikisinin doğruluğunu boşa çıkarır. Doğru ölçüde ama lekeyi kalıcı tutan halı da yanlış alımdır, mükemmel leke karnesi olan ama odada "paspas gibi" duran küçük halı da. Sırayla gidelim, her karar için somut kural verelim.

## Ölçü: koltuk ayağı kuralı ve 30-40 cm payı

Salon halısında en yaygın hata küçük ölçü almaktır; küçük halı odayı büyütmez, tam tersine parçalar. Temel kural koltuk ayağı kuralıdır: oturma grubunun en azından ön ayakları halının üzerine basmalı. Üç kişilik koltuk, iki berjer ve orta sehpadan oluşan standart bir oturma grubu için bu, pratikte minimum 160x230 demektir; ferah bir yerleşimde 200x290 doğru tercihtir. İkinci kural duvar payı: halı ile duvar arasında her yönden 30-40 cm boş zemin kalmalı — duvardan duvara serilen halı, halı değil duvardan duvara kaplama görüntüsü verir ve kenarlardan kalkar. Üçüncü pratik adım: satın almadan önce düşündüğünüz ölçüyü zemine maskeleme bandıyla çizin ve iki gün öyle yaşayın. Kapı açılıyor mu, geçiş yollarında kenar tökezletiyor mu, koltuk ayakları nereye basıyor — bandın size söyleyeceklerini hiçbir ürün sayfası söyleyemez. Emin olamadıysanız oda krokinizi WhatsApp'tan gönderin; ölçü tavsiyesi için halı satmamız gerekmiyor.

## Hav yüksekliği: konfor ile bakımın takası

Hav yüksekliği zevk meselesi gibi sunulur ama aslında bir bakım kararıdır. Kısa hav (5-8 mm): robot süpürgeyle sorunsuz çalışır, kapıya takılmaz, leke yüzeyde kalır ve müdahalesi kolaydır; karşılığında ayak altında "batma" hissi vermez. Orta hav (9-13 mm): salon için altın aralık — dolgunluk hissi verir, bakımı hâlâ yönetilebilirdir. Uzun hav (14 mm ve üstü, shaggy tarzı): çıplak ayakla en konforlusu, ama dökülen sıvı hav dibine iner, kırıntı içinde kaybolur ve fırçalı süpürge lifleri çekiştirir. Çocuklu, evcil hayvanlı veya yoğun misafirli bir salonda uzun hav, güzelliğini bakım yüküyle ödetir. Burada sektörle bir derdimizi de söyleyelim: etiketlerde yazan hav yüksekliği çoğu zaman üretici beyanıdır ve iyimserdir. Biz her partiden numune alıp kumpasla kendimiz ölçer, etikete kendi ölçümümüzü yazarız — 12 mm yazıyorsa 12 mm'dir. Mağazada gördüğünüz halının havını parmaklarınızla dibe kadar bastırın; geri toparlanma hızı, yoğunluk hakkında etiketten çok şey söyler.

## Leke direnci: "leke tutmaz" değil, test sonucu isteyin

Salon halısında leke direnci üçüncü ve en çok yalan söylenen karardır. "Leke tutmaz" cümlesi bir test sonucu değil, bir umuttur. Doğru soru şudur: hangi lekeyle, kaç dakika bekletilerek test edildi ve sonuç ne oldu? Biz bu sorunun cevabını her halının etiketine yazıyoruz: çay, kahve, vişne suyu ve mürekkep testlerinin ÇIKAR/KISMEN/ÇIKMAZ sonuçları, yöntem notlarıyla birlikte Dürüst Etiket'te durur. Salon için pratik okuma şöyle: çay ve kahve sonuçları ÇIKAR olmalı, çünkü salonun gündelik kazaları bunlardır. Vişne/meyve suyu sonucu KISMEN ise küçük çocuklu evde bilinçli karar verin — KISMEN, "hemen müdahale ederseniz kurtarırsınız" demektir ve misafir kalabalığında lekeyi hemen fark etmeyebilirsiniz. Mürekkep sonucu salon için çoğu evde kritik değildir; ev ofisi salonda kuruluysa kritiktir. Görüldüğü gibi doğru cevap halıya değil, sizin evinize bağlıdır — bu yüzden ürün sayfalarımızda "kimin için değil" bölümü vardır ve oraya yazdıklarımız satışımızı düşürür ama iadelerimizi de düşürür.

## Üç kararı birleştirmek: örnek senaryolar

Senaryo bir, küçük çocuklu yoğun salon: 160x230 veya 200x290, kısa-orta hav, çay/kahve ÇIKAR ve vişne en az KISMEN, koyu-orta zeminde desenli model (izleri gizler). Senaryo iki, çocuksuz ve az misafirli ev: orta-uzun hav konforu rahatça seçilebilir, leke karnesinde tek kritik satır kahvedir. Senaryo üç, evcil hayvanlı salon: kısa hav neredeyse zorunlu (tüy temizliği), tüy dökme skoru düşük model ve robot süpürge uyumu. Her senaryoda son adım aynı: etiket fiyatına değil beş yıllık maliyete bakın — yıkama sıklığınızı ve şehrinizin fiyatını hesaplayıcıya girin, iki adayınızı toplam maliyetle karşılaştırın. Salon halısı beş-yedi yıl sizinle yaşar; üç dakikalık hesap, beş yıllık pişmanlıktan ucuzdur. Mağazada gördüğünüzün evinize gelen halı olması ise bizim işimiz: ölçülmüş hav, parti numarası ve test sonuçları etikette, koşulsuz iade arkasında.

## Sık yapılan beş salon hatası

Yıllardır gördüğümüz hataların kısa listesi, alışveriş öncesi son kontrol olarak işinize yarar. Bir: halıyı koltuk takımından önce almak — yerleşim planı olmadan alınan halı, ölçü kuralının değil şansın eseridir; önce yerleşim, sonra halı. İki: ekran rengine güvenmek — aynı halı gün ışığında ve akşam aydınlatmasında farklı tondadır; bizde fotoğraflar doğal ışıkta ve filtresiz çekilir ama yine de belirgin ton farkı çıkarsa bu bizim sorumluluğumuzdur ve koşulsuz iade kapsamındadır. Üç: yolluk mantığıyla salon halısı seçmek — koridorda doğru olan kısa hav ve yoğun desen, geniş salon zemininde sıkışık durabilir; oda büyüdükçe desen ölçeği de büyümelidir. Dört: altlığı unutmak — kaymaz altlık hem güvenlik hem tabanın aşınmasını önlediği için ömür demektir; halıyla aynı gün alın. Beş: "indirimde büyüğü al" refleksi — duvar payı kuralını ihlal eden bir ölçü, ne kadar ucuza gelirse gelsin yanlış ölçüdür. Bu beş maddeyi geçen bir seçim, üç ana kararla (ölçü, hav, leke) birleştiğinde salon halısı alışverişi kumar olmaktan çıkar; geriye kalan tek şey zevkinizdir ve o konuda karışmayız.

İlgili sayfalar: → tulparcarpet.com/halilar/ · tulparcarpet.com/durust-etiket/ · tulparcarpet.com/maliyet-hesaplayici/`,
});

// ---------------------------------------------------------------------------
// 7 — Kayseri'de Halı Üretimi: Fason Şeffaflığı (marka)
// ---------------------------------------------------------------------------

const post7 = post({
  id: "blog-kayseri-hali-uretimi-fason-seffafligi",
  title: "Kayseri'de Halı Üretimi: Fason Şeffaflığı",
  slug: "kayseride-hali-uretimi-fason-seffafligi",
  category: "marka",
  publishedAt: "2026-05-15T09:00:00Z",
  excerpt:
    "Kendi fabrikamız yok ve bunu saklamıyoruz: halılarımız Kayseri'de anlaşmalı tesislerde fason üretiliyor. Türkiye halı sektörünün gerçek işleyişi ve bizim şartname-test-etiket zincirimiz.",
  metaTitle: "Kayseri'de Halı Üretimi: Fason Şeffaflığı | Tulpar",
  metaDescription:
    "Halılarımız Kayseri'de fason üretiliyor — saklamıyoruz. Sektörde markaların çoğu üretici değil; bizim farkımız şartname, parti bazlı test ve dürüst etiket.",
  body: `Sektörün açık sırrıyla başlayalım: Türkiye'de halı satan markaların büyük çoğunluğu halı üretmez. Üretim, başta Gaziantep ve Kayseri olmak üzere belirli merkezlerde toplanmış dokuma tesislerinde yapılır; markalar bu tesislere fason üretim verir, üzerine etiketlerini koyar ve satar. Bunda utanılacak bir şey yok — dünya tekstilinin işleyişi budur. Utanılacak olan, bunu yaparken "kendi fabrikamızdan evinize" diye reklam vermektir. Biz Tulpar olarak baştan söylüyoruz: kendi fabrikamız yok. Halılarımız Kayseri'de, anlaşmalı dokuma tesislerinde, bizim şartnamemizle üretiliyor. Bu yazı, o cümlenin arkasındaki sistemi anlatıyor.

## Neden Kayseri?

Kayseri, Anadolu'nun en eski dokuma merkezlerinden biridir; Bünyan ve Yahyalı halıları bu şehrin el dokuma geleneğinin tescilli isimleridir. Bugün o gelenek, modern makine halıcılığıyla iç içe yaşıyor: şehirde wilton ve yüz yüze dokuma teknolojisine yatırım yapmış, iplik bükümünden konfeksiyona kadar zinciri yerinde kurabilen tesisler var. Bizim için Kayseri tercihinin üç pratik nedeni var. Birincisi ustalaşmış ara kadro: dokuma hatasını makinenin sayacından önce gözüyle yakalayan ustalar, kalite şartnamesinin gerçek güvencesidir. İkincisi lojistik: Orta Anadolu'dan ülkenin her yerine dağıtım, kargo süresi taahhüdümüzü tutmamızı kolaylaştırıyor. Üçüncüsü ilişki ölçeği: dev fabrikaların yüzlerce müşterisinden biri olmak yerine, orta ölçekli tesislerle parti bazında oturup konuşabildiğimiz bir ilişki kurduk — birazdan anlatacağımız test ve düzeltme döngüsü ancak böyle bir ilişkide işler.

## Fason üretimde markanın gerçek işi nedir?

"Üretmiyorsanız ne yapıyorsunuz?" sorusunun dürüst cevabı: tasarım, şartname ve denetim. Tasarım kendini anlatıyor; asıl mesele diğer ikisi. Şartname, tesise verdiğimiz teknik sözleşmedir ve "güzel olsun" yazmaz; iplik cinsi ve büküm değeri, metrekare gramaj, hav yüksekliği toleransı (ölçümde ±0,5 mm), taban konstrüksiyonu, overlok ipliği ve boya haslık sınıfı tek tek yazar. Denetim ise şartnamenin kağıt üstünde kalmamasıdır: her üretim partisinden numune alırız, hav yüksekliğini kumpasla kendimiz ölçeriz, leke testi protokolümüzü (çay, kahve, vişne suyu, mürekkep — sonuçlar ÇIKAR/KISMEN/ÇIKMAZ ölçeğiyle) o partinin numunesine uygularız ve tüy dökme gözlemini dört hafta boyunca kaydederiz. Sonuçlar o partinin etiketine yazılır. Yani etiketteki parti numarası bir süs değil, üretim kaydına giden adrestir: 1003 numaralı pano kaydında bir müşterimizin overlok şikayetini tam bu numara üzerinden izledik, hatalı ipliğin kullanıldığı partiyi bulduk ve o partiden alan diğer müşterileri biz aradık.

## "Fason" kelimesini neden etiketten silmiyoruz?

Çünkü silmek, müşterinin karar verirken kullandığı bir bilgiyi saklamaktır. Fason üretimin markaya getirdiği gerçek riskler var ve bunları bilerek yönetiyoruz: partiler arası ton farkı olabilir (etikette parti numarası bu yüzden yazar ve değişimde baz alınır), tesisin başka müşterileri için ürettiği benzer desenler piyasada görülebilir, kapasite dönemlerinde termin uzayabilir. Bunların hiçbiri müşteriye yansıtılamaz bahane değildir; ama varlıklarını inkar eden bir marka, ortaya çıktıklarında yalanını da yönetmek zorunda kalır. Biz tersini seçtik: ne gönderirsek o. Mağazada ve sitede gördüğünüz halı, etiketindeki ölçülmüş değerlerle evinize gelir; gelmezse koşulsuz iade çalışır ve şikayetiniz Açık Şikayet Panosu'nda, cevabımızla birlikte herkesin gözü önünde durur. Üretici olmamak güvensizlik nedeni değildir — güvensizlik nedeni, ne olduğunu söylememektir.

## Bu modelin size faydası ne?

Somut üç fayda. Bir: esneklik — tek fabrikaya bağlı olmadığımız için bir modelde kalite sorunu çözülemezse üretimi durdurabilir, başka hatta taşıyabiliriz; sabit tesis maliyeti savunma refleksi yaratmaz. İki: doğrulanabilirlik — her iddiamız parti kaydına bağlıdır; halınızın test sonuçlarını parti numarasıyla WhatsApp'tan sorabilirsiniz. Üç: dürüst fiyat — "fabrikadan direkt" masalı yerine, fiyatın neye gittiğini söyleriz: iplik kalitesi, test süreci ve iade güvencesi. Kayseri'deki ustaların tezgahından çıkan halının üzerine bizim eklediğimiz şey budur: ölçen, test eden, yazan ve yazdığının arkasında duran bir etiket. Üretim sürecine dair sorularınızı da panodan veya WhatsApp'tan sorabilirsiniz; "ticari sır" perdesini sevmiyoruz.

## Bir partinin yolculuğu: siparişten etikete

Sistemin nasıl işlediğini en iyi, tek bir partinin yolculuğu anlatır. Birinci hafta: satış verisine ve stok durumuna göre üretim emri çıkar; emirde model, ölçü kırılımı ve şartname revizyon numarası yazar. İkinci-üçüncü hafta: tesis dokumayı yapar, biz ara kontrole gideriz — tezgah başında gramaj ve büküm örneklemesi, konfeksiyon öncesi overlok ipliği kontrolü (1003 numaralı pano kaydından sonra bu kontrol kalıcı maddeye dönüştü). Dördüncü hafta: parti tamamlanır, numuneler ayrılır; hav ölçümü kumpasla üç ayrı noktadan yapılır ve ortalaması etikete yazılır, leke testleri başlar, tüy dökme gözlemi için takvim açılır. Beşinci hafta: test sonuçları parti kayıt defterine işlenir, etiketler basılır ve halılar etiketleriyle eşleştirilir; bir sonuç önceki partiden kötüyse ürün sayfası güncellenir — bunu pazarlama onayına bağlamayız, kayıt neyse etiket odur. Altıncı hafta: parti depoya girer ve satışa açılır. Tüy dökme gözlemi satış başladıktan sonra da dört haftayı tamamlar; gözlem skoru değiştirirse o partinin alıcılarına haber veririz. Bu döngünün maliyeti var ve fiyatın içinde — "fabrikadan direkt olsa daha ucuz olurdu" diyen haklıdır, ama o fiyattan testi, ölçümü ve arkasında durmayı çıkarmış olur. Biz bu takası açıkça yaptık: biraz daha pahalı, tamamen doğrulanabilir.

Son bir söz, sektördeki meslektaşlarımıza: fason üretim yaptırıp "kendi tesisimiz" diyen her marka, bu cümlenin bir gün bir müşteri tarafından doğrulanacağını bilmelidir — ve o gün, kaybedilen şey tek bir satış değil, etiketteki diğer her cümlenin inandırıcılığıdır. Türkiye halı üretimi dünyada açık ara liderdir; bu güçlü zincirin parçası olmak saklanacak değil, anlatılacak bir hikayedir. Biz Kayseri'yi anlatmayı seçtik: ustasını, tezgahını, parti defterini ve evet, ara sıra çıkan hatalı overlok ipliğini de. Çünkü hatasını anlatabilen marka, sözüne güvenilen markadır. Sorularınız için kanallar açık; üretim ziyareti talep eden ilk müşterimizi de memnuniyetle ağırlarız.

İlgili sayfalar: → tulparcarpet.com/durust-etiket/ · tulparcarpet.com/acik-pano/ · tulparcarpet.com/halilar/`,
});

// ---------------------------------------------------------------------------
// 8 — Halı Yıkama Fiyatları 2026 (rehber)
// ---------------------------------------------------------------------------

const post8 = post({
  id: "blog-hali-yikama-fiyatlari-2026",
  title: "Halı Yıkama Fiyatları 2026: Gerçek Maliyet Tablosu",
  slug: "hali-yikama-fiyatlari-2026-gercek-maliyet-tablosu",
  category: "rehber",
  publishedAt: "2026-05-13T09:00:00Z",
  excerpt:
    "2026'da halı yıkama metrekaresi kaç lira? Makine halısı, yün ve viskon için fiyat bantları, ölçü bazlı sefer hesabı, fiyatı şişiren kalemler ve 5 yıllık toplamı düşürmenin yolları.",
  metaTitle: "Halı Yıkama Fiyatları 2026: Gerçek Maliyet | Tulpar",
  metaDescription:
    "2026 halı yıkama fiyatları: makine halısında m² 150-250 TL bandı, yün ve viskonda iki katı. Ölçü bazlı sefer tablosu ve tasarruf taktikleri.",
  faqItems: [
    {
      question: "2026'da 160x230 halının yıkama ücreti ortalama ne kadar?",
      answer:
        "160x230 yaklaşık 3,7 m²'dir. Makine halısında m² fiyatı 150-250 TL bandında seyrettiği için sefer ücreti tipik olarak 550-950 TL arasıdır; eve servis ve büyükşehir faktörüyle 1.000 TL'yi aşabilir. Şehrinize göre 2-3 yerden fiyat alın.",
    },
    {
      question: "Halı yıkama fiyatı neye göre hesaplanır?",
      answer:
        "Üç değişkene: metrekare (ölçü), elyaf cinsi (makine halısı en ucuz, yün ve viskon 1,5-2 kat) ve hizmet kapsamı (alma-getirme, leke ön işlemi, akar/alerjen işlemi gibi ekler). Telefonda net fiyat için ölçü ve elyafı birlikte söyleyin.",
    },
    {
      question: "Yılda kaç kez halı yıkatmak gerekir?",
      answer:
        "Normal ev kullanımında yılda bir kez yeterlidir; evcil hayvan, alerji veya yoğun trafik varsa yılda iki. Düzenli kuru bakım ve hızlı leke müdahalesi, yıkama sıklığını düşürerek 5 yıllık toplamda binlerce lira tasarruf sağlar.",
    },
  ],
  body: `Halı yıkama fiyatı sorulduğunda alınan klasik cevap "halıya göre değişir"dir — doğru ama işe yaramaz. Bu yazıda 2026 itibarıyla Türkiye'deki fiyat bantlarını, hesabın nasıl yapıldığını ve faturayı sessizce şişiren kalemleri tek tabloya indiriyoruz. Baştan iki not: birincisi, biz halı yıkama hizmeti satmıyoruz; bu rakamları derliyoruz çünkü maliyet hesaplayıcımızın varsayılanlarını gerçekçi tutmak bizim işimizin parçası. İkincisi, fiyatlar şehre ve hatta mahalleye göre oynar; aşağıdaki bantlar pazarlık zemini değil, "kazıklanıyor muyum?" sorusunun cetvelidir.

## 2026 fiyat bantları: metrekare mantığı

Profesyonel yıkamacılar fiyatı metrekare üzerinden verir. 2026 ortası itibarıyla gözlemlediğimiz bantlar şöyle: makine halısı (polipropilen/polyester) m² başına 150-250 TL; yün halı 250-400 TL; viskon, bambu ve ipek karışımlı hassas halılar 350-550 TL ve üzeri. El dokuması ve antika halılar bant dışıdır, parça başı ekspertizle fiyatlanır. Büyükşehir merkezlerinde bandın üst yarısını, Anadolu şehirlerinde alt yarısını görmek normaldir. Bu bantları ölçülere çevirelim ki telefonda duyduğunuz rakamı yerine oturtabilesiniz: 120x180 (2,2 m²) makine halısı 330-550 TL; 160x230 (3,7 m²) 550-950 TL; 200x290 (5,8 m²) 870-1.450 TL. Aynı ölçülerin yün versiyonları bu rakamların kabaca 1,6-2 katıdır. Yani salonunuzda 200x290 yün halı varsa her yıkama sezonu 2.000-2.300 TL civarı bir randevudur — elyaf seçiminin bakım bütçesini en baştan belirlediğini söylerken kastettiğimiz bu.

## Faturayı şişiren kalemler

Telefonda söylenen m² fiyatıyla kapıda ödenen tutar arasındaki fark, genellikle şu dört kalemden doğar. Alma-getirme: çoğu firmada belli tutarın altındaki işlerde 100-200 TL servis ücreti vardır ya da m² fiyatına gömülüdür — sorun. Leke ön işlemi: "çıkmayan leke" için özel işlem adıyla 150-400 TL eklenebilir; hangi lekenin gerçekten özel işlem gerektirdiğini bilmek burada para eder (çay çoğu zaman gerektirmez, kurumuş vişne gerektirebilir). Akar/alerjen ve dezenfeksiyon paketleri: alerjik bireyler için anlamlı, diğer herkes için çoğunlukla opsiyoneldir; varsayılan olarak eklenmişse çıkartılmasını isteyebilirsiniz. Aciliyet: 24 saatte teslim, standart 3-5 günlük teslime göre %20-30 fark yaratır. Bir de sezon etkisi var: bahar temizliği (Mart-Mayıs) ve bayram öncesi dönemler hem fiyatların hem teslim sürelerinin zirvesidir; yıkamayı sonbahara planlamak aynı hizmeti çoğu zaman daha ucuza almak demektir.

## Beş yıllık toplam: asıl tablo bu

Tek seferlik ücret yönetilebilir görünür; mesele tekrarıdır. 160x230 makine halısını sefer başı 900 TL'den yılda iki kez yıkatan bir hane, beş yılda 9.000 TL öder — bu, halının kendisinden pahalı bir bakım geçmişidir. Aynı halı yılda bir yıkamayla 4.500 TL'ye iner. Aradaki 4.500 TL'lik fark, büyük ölçüde halının kendisine bağlıdır: lekeyi yüzeyde tutan, kuru bakımla idare eden, tüy ve koku biriktirmeyen bir halı yılda bir yıkamayı gerçekçi kılar. Biz tam bu nedenle leke testi sonuçlarını (ÇIKAR/KISMEN/ÇIKMAZ) etikete yazıyoruz; Dürüst Etiket'teki çay-kahve satırları, beş yıllık yıkama bütçenizin erken göstergesidir. Kendi rakamlarınızla hesabı görmek için maliyet hesaplayıcımıza halı fiyatını, yıllık yıkatma sayınızı ve şehrinizdeki sefer ücretini girin; hesabın tüm ara adımları ekranda açık durur. Hesaplayıcının varsayılanlarının iyimser kaldığını söyleyen bir pano kaydı üzerine değerleri gözden geçirdiğimizi de ekleyelim — bu yazıdaki bantlar o düzeltmenin ürünüdür.

## Toplamı düşürmenin dört gerçekçi yolu

Bir: haftalık kuru bakım — fırçasız başlıkla düzenli çekim, kiri hav dibine inmeden alır ve yıkama ihtiyacını seyrekleştirir; bedavadır. İki: anında leke müdahalesi — dökülen sıvıyı ovmadan, beyaz bezle bastırarak almak, 300-400 TL'lik "özel leke işlemi" kalemini çoğu zaman sıfırlar. Üç: sezon dışı yıkatma — sonbahar randevusu, bahar fiyatından tipik olarak daha iyidir ve beş yılda bir sefer ücreti kadar fark eder. Dört: doğru halı seçimi — evde yıkanabilen küçük ölçüler (kısa havlı modellerin 120x180 ve altı, düşük devir ve soğuk suyla) profesyonel sefer sayısını azaltır; ama yanlış evde yıkama (sıcak su, yüksek devir, radyatörde kurutma) halıyı erken emekli ederek tasarrufu fazlasıyla geri alır. Son söz yine şeffaflık üzerine: bu yazıdaki rakamlar 2026 gözlemidir ve eskiyecektir. Güncelliğini yitirdiğini gördüğünüzde Açık Pano'dan yazın; düzeltir, düzelttiğimizi de açıkça not ederiz.

## Yıkamacı seçerken sorulacak beş soru

Fiyat bandını bilmek işin yarısı; diğer yarısı doğru firmayı seçmek, çünkü ucuz ama yanlış yıkama halının ömründen yer. Telefonda şu beşi sorun. Bir: "Fiyat metrekare üzerinden mi, ölçümü kim yapıyor?" — ölçüm teslim alırken birlikte yapılmalı ve fişe yazılmalı; "fabrikada ölçeriz" cevabı, kapıda büyüyen fatura demektir. Ona karşı kendi ölçünüzü bilin: en x boy, basit çarpım. İki: "Hangi yıkama yöntemi?" — makine halısı için tam yıkama normaldir; yün ve viskon için "hepsini aynı hatta yıkıyoruz" cevabı alarm işaretidir, hassas elyaf düşük devir ve özel deterjan ister. Üç: "Kurutma nasıl yapılıyor?" — sıkma santrifüjü sonrası askıda kurutma standarttır; "kalorifer dairesinde kurutuyoruz" tarzı cevaplar taban tutkalı için risktir. Dört: "Teslimde halı ıslak çıkarsa ya da form bozulursa sorumluluk kimde?" — yazılı teslim fişi ve hasar kaydı isteyin; ciddi firmalar bunu kendiliğinden verir. Beş: "Alma-getirme ve leke işlemi fiyata dahil mi?" — yukarıdaki gizli kalemleri telefonda netleştiren müşteri, kapıda pazarlık yapmak zorunda kalmaz. Bu beş soruya rahat cevap veren bir yıkamacıyla kurulan ilişki yıllarca sürer ve beş yıllık tabloda en az bir sefer ücreti kadar tasarruf, en çok da halınızın ömrü olarak geri döner. Şeffaflık sadece halı satarken değil, halı yıkatırken de en ucuz sigortadır. Bu yazıyı yılda bir güncelliyoruz; bandın dışında bir fiyatla karşılaştıysanız — ucuz ya da pahalı, fark etmez — şehrinizi ve aldığınız rakamı bize yazın ki tablo herkes için gerçek kalsın.

İlgili sayfalar: → tulparcarpet.com/maliyet-hesaplayici/ · tulparcarpet.com/durust-etiket/ · tulparcarpet.com/acik-pano/`,
});

// ---------------------------------------------------------------------------
// Çalıştır
// ---------------------------------------------------------------------------

const posts = [post1, post2, post3, post4, post5, post6, post7, post8];

async function main() {
  for (const doc of posts) {
    const res = await client.createIfNotExists(doc as Parameters<typeof client.createIfNotExists>[0]);
    console.log(`✔ blogPost → ${res._id}`);
  }
  console.log(`\n${posts.length} blog yazısı seed edildi (createIfNotExists; mevcutlar atlandı).`);
}

main().catch((err) => {
  console.error("Seed başarısız:", err);
  process.exit(1);
});
