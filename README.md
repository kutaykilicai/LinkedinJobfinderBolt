# LinkedinJobfinderBolt

BT denetimi ve bilgi güvenliği ilanlarını profilime göre puanlayan bir iş arama arayüzü. Next.js 13 ve React 18 ile yazıldı, ilk taslağı Bolt ile çıkarıldı.

## Ne yapıyor

- `lib/userData.ts` içindeki profili (beceriler, hedef roller, konum, deneyim) ilanlarla karşılaştırır.
- `lib/matchEngine.ts` beceri, unvan, konum ve kıdem uyumuna göre her ilana bir eşleşme puanı verir. Türkçe ve İngilizce unvanları birlikte tanır.
- Sonuçlar konuma, tarihe, kıdeme ve puana göre süzülür; ilanlar kaydedilip yan yana karşılaştırılabilir.
- İlanlar şimdilik `lib/dummyJobs.ts` içindeki örnek verilerden gelir, gerçek LinkedIn bağlantısı yoktur.

## Çalıştırma

```bash
npm install
npm run dev
```

Ardından http://localhost:3000 adresini açın. Kendi profiliniz için `lib/userData.ts` dosyasını düzenleyin.
