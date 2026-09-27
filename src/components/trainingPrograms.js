import { asset } from "./assetUrl";

// Kayra training catalogue (source: Görkem, 2026-09-27). Topic lists stay at headline level on purpose;
// dates are omitted because the referenced announcements may belong to past sessions.

/** Vehicle trainings, in intro order. `modules` is the three-line summary shown in the intro panel and on home. */
export const trainingPrograms = [
  {
    type: "uav", label: "HAVA", name: "İnsansız hava aracı (İHA)", headline: "Fikirden uçuşa.",
    summary: "Tasarım, üretim ve uçuş",
    description: "İHA türlerinden sabit kanat tasarımına, elektronik donanımdan uçuş kontrollerine bir hava aracını baştan sona tanıyın.",
    image: asset("images/kayra-uav.webp"), imageAlt: "Atölye masasında duran, farklı gövdelerde birkaç çok rotorlu İHA.", caption: "Kayra İHA çalışmaları",
    modules: [["Tasarım", "İHA türleri, sabit kanat, aerodinamik ve uçuş dinamiği"], ["Donanım", "Elektronik donanım, üretim ve montaj"], ["Uçuş", "Uçuş öncesi ve sonrası kontroller"]],
  },
  {
    type: "rov", label: "SUALTI", name: "İnsansız su altı aracı (ROV)", headline: "Yüzeyin altında.",
    summary: "Tasarım, sensör ve kontrol",
    description: "Bir su altı aracını tasarlayın; sensör, motor ve elektroniğini kurun, kontrol edip su altında test edin.",
    image: asset("images/kayra-rov.webp"), imageAlt: "Havuz kenarında duran, itici ve kamera kubbeli Kayra ROV.", caption: "Kayra ROV",
    modules: [["Tasarım", "Araç tasarımı ve sensör entegrasyonu"], ["Kurulum", "Motor, elektronik ve kamera verileri"], ["Görev", "Kontrol, görev planlama ve su altı testleri"]],
  },
  {
    type: "usv", label: "SUÜSTÜ", name: "İnsansız deniz aracı (İDA)", headline: "Rotanı kendin çiz.",
    summary: "Otonom deniz sistemleri",
    description: "Deniz yüzeyinde görev yapan otonom araçların çalışma prensiplerini öğrenin, kendi prototipinizi geliştirin.",
    image: asset("images/kayra-usv.webp"), imageAlt: "Göl kıyısında beton zeminde duran çift gövdeli Kayra C-USV.", caption: "Kayra C-USV",
    modules: [["Prensipler", "Otonom deniz araçlarının çalışma mantığı"], ["Kurulum", "Tasarım, mekanik kurulum ve elektronik altyapı"], ["Prototip", "Kontrol sistemleri ve prototip geliştirme"]],
  },
  {
    type: "rocket", label: "ROKET", name: "Roket sistemlerine giriş", headline: "Hedef yukarıda.",
    summary: "Çalışma mantığı ve bileşenler",
    description: "Roketlerin nasıl çalıştığını, temel bileşenlerini ve arkasındaki mühendislik yaklaşımını keşfedin.",
    image: asset("images/kayra-rocket.webp"), imageAlt: "Çakıllı zeminde duran ahşap kanatçıklı beyaz model roketin alt kısmı.", caption: "Kayra model roketi",
    modules: [["Çalışma mantığı", "Bir roket nasıl uçar?"], ["Bileşenler", "Roketin temel bileşenleri"], ["Mühendislik", "Tasarımdan uçuşa yaklaşım"]],
  },
];

/** Short, single-topic workshops listed after the vehicle trainings. */
export const workshops = [
  {
    type: "vision", label: "ATÖLYE", name: "Görüntü işlemeye giriş", headline: "Kameranın gördüğünü anla.",
    summary: "Python ve OpenCV",
    description: "Pikselden segmentasyona: renk uzayları, filtreleme, eşikleme, kenar tespiti ve derin öğrenmeyi kodla, adım adım uygulayın.",
    format: "16 ders",
  },
];

export const allPrograms = [...trainingPrograms, ...workshops];

export const findProgram = (type) => allPrograms.find((program) => program.type === type);
