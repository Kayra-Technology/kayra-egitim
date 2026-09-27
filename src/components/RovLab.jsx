import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowUpRight, Box, Move, Plus, Minus, RotateCcw } from "lucide-react";
import { KayraBrand } from "./KayraBrand";
import { RovScene } from "./RovScene";
import "./rov-lab.css";
import { asset } from "./assetUrl";

export const rovTopics = [
  { id: "body", number: "01", title: "Gövde & denge", label: "YAPIYI TANI", text: "Bir sualtı aracının dengesi nereden gelir? Gövdeyi farklı açılardan incele; ağırlık merkezi ile kaldırma kuvvetinin ilişkisini keşfet.", question: "Bataryayı aşağıya taşırsan aracın dengesi nasıl değişir?", tags: ["Yüzerlik", "Ağırlık merkezi"], camera: [4.5, 3.5, 5.5], point: [0, .68, .1] },
  { id: "thrust", number: "02", title: "İtki & hareket", label: "HAREKETİ ANLA", text: "İticilerin yönü, aracın nasıl hareket edebileceğini belirler. Yan görünümden yerleşimi incele; ileri hareket, dönüş ve derinlik kontrolü üzerine düşün.", question: "Yerinde dönmek için hangi iticiler birlikte çalışmalı?", tags: ["Kuvvet vektörleri", "Hareket eksenleri"], camera: [5.8, 1.5, 3.5], point: [1.22, .2, .65] },
  { id: "mission", number: "03", title: "Gözlem & görev", label: "GÖREVİ KURGULA", text: "Aracı bir gözlem platformu olarak düşün. Görüş alanı, aydınlatma ve haberleşmenin bir sualtı inceleme görevini nasıl etkilediğini tartış.", question: "Karanlık suda bir yüzeyi incelerken nelere ihtiyaç duyarsın?", tags: ["Görüş alanı", "Görev planlama"], camera: [1.2, .8, 6.8], point: [0, .12, 1.48] },
];

export default function RovLab() {
  const [selected, setSelected] = useState(0);
  const [status, setStatus] = useState("loading");
  const [attempt, setAttempt] = useState(0);
  const scene = useRef(null);
  const topic = rovTopics[selected];
  const courseUrl = new URL(window.location.href);
  courseUrl.searchParams.delete("view");
  courseUrl.hash = "/egitim/sualti";
  useEffect(() => {
    const previous = document.title;
    document.title = "ROV · 3D Atölye — KAYRA";
    return () => { document.title = previous; };
  }, []);

  return <div className="rov-lab">
    <header className="lab-header">
      <a href={courseUrl.href} aria-label="Kayra — Sualtı eğitimine dön"><KayraBrand /></a>
      <span className="lab-version"><span /> DENEYSEL ATÖLYE <b>01</b></span>
      <a className="lab-back" href={courseUrl.href}><ArrowLeft size={15} /> <span>Eğitime dön</span></a>
    </header>
    <main className="lab-main">
      <div className="lab-heading">
        <div><p className="lab-eyebrow">SUALTI / ETKİLEŞİMLİ KEŞİF</p><h1>Biraz yakından <em>bak.</em></h1></div>
        <p>Çevir, incele, merak et.<br />Bir aracı tanımanın başka bir yolu.</p>
      </div>
      <div className="lab-workspace">
        <section className="lab-viewer" aria-label="Etkileşimli ROV modeli">
          <div className="lab-model-label"><span>KAYRA ROV</span><span>UZAKTAN KUMANDALI SUALTI ARACI</span></div>
          <span className="lab-scene-index" aria-hidden="true">02 / SUALTI</span>
          <RovScene key={attempt} ref={scene} selected={selected} topics={rovTopics} onSelect={setSelected} onStatus={setStatus} />
          {status === "loading" && <div className="lab-status" role="status"><Box size={24} /><p>Model hazırlanıyor…</p></div>}
          {status === "error" && <div className="lab-status lab-error" role="alert"><img src={asset("images/kayra-rov.webp")} alt="Kayra ROV" /><div><p>3D görünüm açılamadı.</p><span>Konuları okumaya devam edebilir veya yeniden deneyebilirsin.</span><button onClick={() => { setStatus("loading"); setAttempt(a => a + 1); }}>Yeniden dene</button></div></div>}
          <div className="lab-viewer-foot"><span><Move size={14} /> <span>Sürükle ve keşfet</span></span><div className="lab-controls" aria-label="Model görünüm kontrolleri">
            <button disabled={status !== "ready"} onClick={() => scene.current?.zoom(.8)} aria-label="Modeli yakınlaştır" title="Yakınlaştır"><Plus size={17} /></button>
            <button disabled={status !== "ready"} onClick={() => scene.current?.zoom(1.25)} aria-label="Modeli uzaklaştır" title="Uzaklaştır"><Minus size={17} /></button>
            <i /><button disabled={status !== "ready"} onClick={() => scene.current?.reset()} aria-label="Seçili konunun kamera açısını sıfırla" title="Görünümü sıfırla"><RotateCcw size={16} /></button>
          </div></div>
        </section>
        <aside className="lab-learning" aria-label="Keşif konuları">
          <p className="lab-eyebrow">ARACI BİRLİKTE ÇÖZELİM <span>3 KONU</span></p>
          <div className="lab-topics">{rovTopics.map((item, i) => <button key={item.id} className={i === selected ? "is-selected" : ""} aria-pressed={i === selected} onClick={() => setSelected(i)}><span>{item.number}</span><strong>{item.title}</strong><ArrowUpRight size={18} /></button>)}</div>
          <div className="lab-topic-content" aria-live="polite" aria-atomic="true">
            <p className="lab-topic-label">{topic.label}</p><h2>{topic.title}</h2><p className="lab-description">{topic.text}</p>
            <div className="lab-tags">{topic.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
            <div className="lab-question"><span>BİR DÜŞÜN</span><p>{topic.question}</p></div>
          </div>
          <a className="lab-course-link" href={courseUrl.href}>Sualtı eğitimini keşfet <ArrowUpRight size={17} /></a>
        </aside>
      </div>
      <footer className="lab-footer"><span><Box size={14} /> Gerçek model. Yeni bir öğrenme alanı.</span><p>Noktalar temsili öğrenme alanlarıdır; içerik örnek müfredattır.</p><span>KAYRA / LAB 001</span></footer>
    </main>
  </div>;
}
