// Course page content per program type. Topics are headline-level only (source: Görkem, 2026-09-27).
// `practice` lists hands-on work mentioned for the training; it is shown only when present.
export const courseContent = {
  uav: {
    slug: "hava", domain: "Hava sistemleri", title: "Bir fikir.\nBir uçuş.",
    topics: ["İHA türleri", "Sabit kanat tasarımı", "Aerodinamik ve uçuş dinamiği", "Elektronik donanım", "Üretim ve montaj", "Uçuş öncesi ve sonrası kontroller"],
    practice: ["Lehimleme", "Motor–ESC bağlantısı", "Uçuş kontrol kartı ayarı", "Saha testleri"],
  },
  rov: {
    slug: "sualti", domain: "Su altı sistemleri", title: "Yüzeyin altında\nyeni bir dünya.",
    topics: ["Araç tasarımı", "Sensör entegrasyonu", "Motor ve elektronik kurulum", "Kamera verileri", "Kontrol sistemleri", "Görev planlama ve su altı testleri"],
    practice: ["Lehimleme", "Son montaj", "Su altı testleri"],
  },
  usv: {
    slug: "suustu", domain: "Deniz sistemleri", title: "Yüzeyde\notonom görev.",
    topics: ["Çalışma prensipleri", "Tasarım", "Mekanik kurulum", "Elektronik altyapı", "Kontrol sistemleri", "Prototip geliştirme"],
    practice: [],
  },
  rocket: {
    slug: "roket", domain: "Roket sistemleri", title: "Temelden\nfırlatmaya.",
    topics: ["Roketlerin çalışma mantığı", "Temel bileşenler", "Mühendislik yaklaşımı"],
    practice: [],
  },
  vision: {
    slug: "goruntu-isleme", domain: "Görüntü işleme", title: "Piksellerden\nkarara.",
    topics: ["Renk tespiti", "Kontur analizi", "Hough dönüşümleri", "ArUco tanıma", "Rota planlama"],
    practice: ["Python", "OpenCV"],
  },
};

export const courseHref = type => `#/egitim/${courseContent[type].slug}`;
export function courseFromHash() {
  return Object.keys(courseContent).find(type => window.location.hash === courseHref(type)) || null;
}
