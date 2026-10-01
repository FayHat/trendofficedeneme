# TrendOffice — Revize site

## Üçüncü revizyon (1 Ekim 2026)

**Görsel ve içerik**
- Hero: dikey ofis fotoğrafı (renk ve perspektif düzeltildi, `assets/hero-office.webp`) ve üzerinde dikiş atölyesi kartı (`assets/hero-sewing.webp`). Alt yazı “İstanbul ofisimiz. · Bahçelievler”.
- Hero üst satırı “İstanbul · 2009’dan beri · Trendden ürüne”; yeni giriş metni; rakamlar 17+ yıl / 15 üretici partner / 5 ülke · 3 kıta.
- Hero altına müşteri logoları şeridi (`assets/clients/`): Jaded London, NAWÁ, attrattivo, adL, ALE. “Love my body” logosu dosya gelince eklenecek (`index.html` içinde yorum satırı hazır).
- Yaklaşımımız bölümüne 6 hizmet etiketi.
- Ürün gruplarında somut ürün ve uygulama listeleri; “Kadın, erkek, aksesuar” bilgisi. “Dokular kategori anlatımı içindir” ve “Bir kategoriye dokunun” metinleri kaldırıldı.
- Süreç 6 adım: Tech pack & brief → Sourcing → Numune & onay → Fiyat & sipariş → Üretim & kalite → Sevkiyat & teslimat.
- Harita: ABD pazarı (New York · New Jersey ve Los Angeles) aynı nokta/rota formatında eklendi, harita uzaklaştırıldı. New York ile New Jersey bu ölçekte üst üste düştüğü için tek nokta ve tek etiketle gösterilir. Mobilde Atina ve Paris etiketi yalnızca seçildiğinde görünür.
- Sloganlar sadeleşti: “Kumaştan koleksiyona”, “İstanbul’dan, ortak bir çalışma dili” ve “Bir koleksiyon. Bir konuşma. Yeni bir başlangıç.” kaldırıldı.
- İletişim ve footer: telefon, açık adres, Google Maps bağlantısı.

**Dördüncü tur (1 Ekim 2026)**
- “Az marka, çok dikkat” metni ve maddeleri (A seçeneği) altı dilde güncellendi.
- Header menü yazıları 15 px’e, “Talep oluştur” ve dil seçici aynı ölçeğe çekildi.
- E-posta ve telefon: fareyle üzerine gelince altın zemin, alt çizgi ve hafif büyüme; tıklayınca basılma efekti. Dokunmatik cihazlarda takılı kalan hover yok.
- “E-postayı kopyala” butonu (panoya kopyalar, 2 saniye “Kopyalandı” gösterir).
- “Love my body” logosu ve “Gizlilik anlaşmalı diğer markalar” kartı eklendi. Footer’a telif satırı eklendi (yıl otomatik).
- Sezon planı kaldırıldı.
- Mobil/tablet: 320 px’ten 1366 px’e 11 cihaz ölçüsünde test edildi; yatay taşma yok. iOS’ta form alanlarına dokununca yakınlaşma engellendi (16 px), dokunma alanları büyütüldü, tablet logo düzeni ve iletişim bölümü tek sütuna alındı, harita etiketleri telefon ve tablette okunur boyuta ayarlandı.

**Teknik**
- Özel imleç: tıklama noktası figürün tam ortasında; dikiş izi figürün arkasında kalmıyor. Gizlilik penceresi açıkken normal imleç kullanılır.
- `?lang=en` gibi bağlantılarla site doğrudan o dilde açılır; dil değişince adres güncellenir. hreflang etiketleri eklendi.
- Paylaşım önizlemesi (Open Graph): `assets/og-image.jpg`. Adres olarak `https://trendoffice.com.tr/` varsayıldı; alan adı farklıysa `index.html` başındaki adresleri değiştirin.
- KVKK/GDPR gizlilik bildirimi (form yanında ve footer’da). Yayından önce hukuki olarak kontrol edilmelidir.
- Header logosunda “OFFICE” kısmı okunur olacak şekilde koyulaştırıldı (`assets/trendoffice-logo-header.webp`; orijinal logo dosyaları değişmedi).
- Metinler 12 pikselin altına inmiyor (dekoratif numaralar hariç).
- Yeni stiller ayrı dosyada: `v3.css` (style.css ve enhancements.css’ten sonra yüklenir).


Bu paket, mevcut TrendOffice sitesinin 15 Eylül 2026 tarihli ikinci revizyonudur.

## İkinci revizyonda eklenenler

- Orijinal yürüyen figürlü imleç, kısa dikiş izi ve hassas tıklama noktasıyla geri getirildi. Bordo yüzeylerde aynı figürün açık görünümü kullanılır. Form alanlarında, dokunmatik kullanımda, hareket azaltma tercihinde veya görsel yüklenemezse normal imleç korunur.
- Seçili kumaş kartı, sayılar, form adımı ve özet başlığında bordo kullanımı güçlendirildi.
- Üretim şeridine 3 piksel ilerleme çizgisi ve 12 piksel uç noktası eklendi. Konum, aşama numaralarının merkezlerinden hesaplanır; açılan içerikler, font yüklemesi ve ekran genişliği değiştiğinde yeniden ölçülür.
- Haritada dört pazar için ayrı, uyumlu renkler ve kavisli hareketli bağlantılar eklendi. Seçim, fareyle önizleme, durdur/oynat, ekran dışında ve sekme gizliyken duraklatma desteklenir. Hareket azaltma tercihi uygulanır.
- Temas noktası bölümü; marka ihtiyaçları, bordo TrendOffice paneli ve 15 üretici partnerden oluşan tek kompozisyona dönüştürüldü. Altındaki üç seçenek açıklamayı değiştirir; klavyeyle de kullanılabilir. Dil değiştirildiğinde seçili açıklama korunur.
- Yeni içerikler ve hareket kontrolleri altı dilde tamamlandı. İspanyolcada mevcut resmî hitap, İtalyancada mevcut tekil hitap korundu.

Bu sürümde talep gönderim adresi ve özet sonrası paylaşım davranışı korunmuştur.

## Açma ve yayınlama

1. ZIP dosyasını tamamen bir klasöre çıkarın.
2. Görünümü incelemek için `index.html` dosyasını tarayıcıda açın.
3. Yayınlamak için bu klasörün içindeki dosyaları, klasör yapısını koruyarak mevcut statik web barındırma alanına yükleyin. Ana dizinde `index.html` bulunmalıdır.

Derleme, npm kurulumu veya özel bir sunucu yazılımı gerekmez. Yerel HTTP üzerinden incelemek isterseniz site klasöründe `python3 -m http.server 8080` çalıştırıp `http://localhost:8080` adresini açabilirsiniz.

## Yapılan değişiklikler

- Ana başlık korundu. Giriş bağlantıları “Koleksiyonunuzu görüşelim” ve “Ürün gruplarımızı inceleyin” olarak değiştirildi.
- Giriş videosu, dönen fotoğraf galerisi, fotoğraflı stop-motion bölümü ve büyük açılış logosu kaldırıldı. Eski galerideki kumaş ruloları görseli açılışta tek fotoğraf olarak kullanıldı.
- Krem ve bordo kimliği korunarak tipografi, boşluklar, butonlar ve mobil menü düzenlendi.
- Kumaş dokuları görünür bir uzmanlık alanına taşındı. Örme, dokuma, triko ve denim seçimi fare, dokunma ve klavyeyle çalışır. Seçime göre açıklama ve uzmanlık detayları değişir; ilgili kategori talep formuna aktarılabilir.
- Üretim süreci beş aşamalı, dikey ve fotoğrafsız tek şeritte toplandı. Aşamalar açıldığında üstlenilen işler ve müşteriyle paylaşılan bilgiler görünür.
- “Az marka, çok dikkat” bölümü bordo arka plan, belirgin başlık ve ince çizgi deseniyle yeniden tasarlandı.
- Mini test; ürün, destek, iletişim ve özet adımlarından oluşan talep akışına dönüştürüldü.
- Türkçe, İngilizce, Almanca, Fransızca, İspanyolca ve İtalyanca içerikler aynı kapsamda düzenlendi. Dil değiştirmek doldurulan formu sıfırlamaz.
- Görseller WebP biçiminde optimize edildi; fontlar yerel dosyalara alındı. Kullanılmayan video ve fotoğraflar bu pakete dahil edilmedi.

## Talep gönderimi

Form özeti oluşturulurken herhangi bir ağ isteğiyle talep gönderilmez. Ziyaretçi özetini düzenleyebilir. Gönderimi yalnızca özet ekranındaki **Paylaş** düğmesi başlatır. Enter tuşu özet ekranında otomatik gönderim yapmaz.

Mevcut sitedeki FormSubmit hizmeti ve `gfayat@trendoffice.com.tr` alıcısı kullanılır. Gönderim internet bağlantısı ve hizmetin bu alıcı için çalışır durumda olmasını gerektirir. Dil tercihi tarayıcıda saklanır; form bilgileri yerel depolamaya kaydedilmez.

Hizmetten olumlu yanıt gelmeden başarı ekranı açılmaz. Hata veya zaman aşımında girilen bilgiler korunur; yeniden deneme ve e-posta uygulamasıyla devam etme seçenekleri sunulur. Aynı anda ikinci gönderim engellenir.

Gerçek e-posta gönderilmedi ve alıcıya teslim doğrulanmadı. Yayındaki adreste hizmetin alıcı aktivasyonu ve gerçek teslimi kontrol edilmelidir.

## Düzenlenecek dosyalar

- `index.html`: Sayfa yapısı ve başlangıç Türkçe içeriği.
- `style.css`: Renkler, tipografi, yerleşim ve ekran genişliği kuralları.
- `enhancements.css`: İkinci revizyonun renkleri, temas noktası düzeni, imleci, çizgileri ve hareket kuralları. `style.css` dosyasından sonra yüklenir.
- `locales.js`: Altı dilin bütün metinleri, form mesajları ve uzmanlık açıklamaları. Dil anahtarları aynı yapıda tutulmalıdır.
- `script.js`: Dil seçimi, kumaş etkileşimi, süreç şeridi, harita ve talep akışı.
- `motion.js`: Temas noktası sekmeleri, bağlantıların belirmesi ve orijinal özel imlecin davranışı.
- `fonts.css` ve `assets/fonts/`: Outfit ve Fraunces fontları; OFL lisans metinleri dahildir.
- `assets/`: Korunan logolar, tek açılış fotoğrafı, dört kumaş dokusu ve orijinal imleç görseli.
- `vendor/`: Mevcut projeden korunan harita verisi, D3 ve TopoJSON dosyaları.

## Kontrol kapsamı

Altı dilin anahtar ve içerik kapsamı, dosya yolları, bölüm bağlantıları, başlığın korunması, kumaş seçimi, form doğrulamaları, on alanlı özet, düzenleme sonrası gönderilecek verinin eşleşmesi, otomatik gönderimin engellenmesi, hata ve çift gönderim davranışları DOM tabanlı testlerden geçti. Gönderim yanıtları testlerde taklit edildi; dışarıya e-posta gönderilmedi.

İkinci revizyonda ayrıca imlecin yükleme/hata ve metin alanı davranışı, dokunmatik ve hareket azaltma tercihi, sekmelerin klavyeyle kullanılması, seçili açıklamanın çevrilmesi, dört pazar rengi ve seçimi, haritanın duraklatılması, sayfa görünürlüğü ve süreç çizgisinin değişen yükseklik ile başlangıç/bitiş sınırları test edildi.

Masaüstü ve mobil ölçülerde statik yerleşim incelemesi yapıldı. Bu ortamda canlı tarayıcı önizlemesi güvenlik politikası nedeniyle engellendi; statik inceleme gerçek tarayıcı testinin yerine geçmez.
