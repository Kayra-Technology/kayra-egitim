import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { asset } from "./assetUrl";

export const RovScene = forwardRef(function RovScene({ selected, topics, onSelect, onStatus }, ref) {
  const host = useRef(null);
  const markers = useRef([]);
  const api = useRef(null);
  const selectedRef = useRef(selected);
  selectedRef.current = selected;
  useImperativeHandle(ref, () => ({ zoom: factor => api.current?.zoom(factor), reset: () => api.current?.focus(selectedRef.current) }), []);
  useEffect(() => { api.current?.focus(selected); }, [selected]);

  useEffect(() => {
    let disposed = false, renderer, controls, decoder, observer, frame = 0, model;
    let flight = null, lastTime = 0;
    const container = host.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, 1, .1, 100);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const point = new THREE.Vector3();
    const materials = new Set(), geometries = new Set();
    const requestDraw = () => { if (!disposed && !frame && !document.hidden) frame = requestAnimationFrame(draw); };
    function draw(time) {
      frame = 0;
      if (disposed) return;
      const dt = Math.min((time - lastTime) / 1000, .05); lastTime = time;
      if (flight) {
        camera.position.lerp(flight, 1 - Math.exp(-7 * dt));
        if (camera.position.distanceTo(flight) < .008) { camera.position.copy(flight); flight = null; }
      }
      controls.update();
      renderer.render(scene, camera);
      topics.forEach((topic, i) => {
        const marker = markers.current[i]; if (!marker) return;
        point.fromArray(topic.point).project(camera);
        const visible = model && point.z > -1 && point.z < 1 && Math.abs(point.x) < .9 && Math.abs(point.y) < .78;
        marker.style.visibility = visible ? "visible" : "hidden";
        marker.style.left = `${(point.x + 1) * 50}%`;
        marker.style.top = `${(1 - point.y) * 50}%`;
      });
      if (flight) requestDraw();
    }
    function focus(index) {
      const target = new THREE.Vector3(...topics[index].camera);
      if (reduceMotion.matches) { camera.position.copy(target); flight = null; }
      else flight = target;
      controls.target.set(0, 0, 0);
      requestDraw();
    }
    function contextLost(event) { event.preventDefault(); onStatus("error"); }
    function visibilityChange() { if (!document.hidden) requestDraw(); }
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
      renderer.setClearColor(0x000000, 0);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.1;
      renderer.domElement.setAttribute("aria-label", "Modelleri sürükleyerek döndürebilirsin. Konu düğmeleri hazır kamera açılarını açar.");
      renderer.domElement.setAttribute("role", "img");
      renderer.domElement.addEventListener("webglcontextlost", contextLost);
      container.prepend(renderer.domElement);
      camera.position.fromArray(topics[selectedRef.current].camera);
      controls = new OrbitControls(camera, renderer.domElement);
      controls.enablePan = false;
      controls.enableZoom = false; // Page scrolling remains native; use buttons for zoom.
      controls.enableDamping = false;
      controls.rotateSpeed = .65;
      controls.minPolarAngle = .18;
      controls.maxPolarAngle = Math.PI * .82;
      // Horizontal drags rotate; the browser owns vertical page scrolling.
      controls.touches.ONE = THREE.TOUCH.ROTATE;
      controls.touches.TWO = THREE.TOUCH.DOLLY_ROTATE;
      renderer.domElement.style.touchAction = "pan-y";
      controls.addEventListener("start", () => { flight = null; });
      controls.addEventListener("change", requestDraw);
      scene.add(new THREE.HemisphereLight(0xf8fcff, 0x6a706b, 2));
      const key = new THREE.DirectionalLight(0xfff5e3, 3); key.position.set(4, 7, 5); scene.add(key);
      const fill = new THREE.DirectionalLight(0xd6e8ef, 2); fill.position.set(-5, 2, -4); scene.add(fill);
      observer = new ResizeObserver(() => {
        const { width, height } = container.getBoundingClientRect();
        if (!width || !height) return;
        renderer.setSize(width, height); camera.aspect = width / height;
        // Preserve horizontal breathing room when the scene becomes portrait.
        camera.fov = THREE.MathUtils.radToDeg(2 * Math.atan(Math.tan(THREE.MathUtils.degToRad(18)) * Math.max(1, 1.15 / camera.aspect)));
        camera.updateProjectionMatrix(); requestDraw();
      });
      observer.observe(container);
      document.addEventListener("visibilitychange", visibilityChange);
      api.current = { focus, zoom(factor) {
        flight = null;
        const offset = camera.position.clone().sub(controls.target);
        offset.setLength(THREE.MathUtils.clamp(offset.length() * factor, 4.4, 12));
        camera.position.copy(controls.target).add(offset); requestDraw();
      } };
      // three r186 bundles the Draco decoder via import.meta.url; no public copy needed.
      decoder = new DRACOLoader();
      const loader = new GLTFLoader().setDRACOLoader(decoder);
      loader.load(asset("models/rov.glb"), gltf => {
        if (disposed) {
          gltf.scene.traverse(child => { child.geometry?.dispose(); if (child.material) [child.material].flat().forEach(m => m.dispose()); });
          decoder.dispose();
          return;
        }
        model = gltf.scene;
        const bounds = new THREE.Box3().setFromObject(model);
        const size = bounds.getSize(new THREE.Vector3());
        const center = bounds.getCenter(new THREE.Vector3());
        const scale = 3.5 / Math.max(size.x, size.y, size.z);
        model.scale.multiplyScalar(scale); model.position.sub(center.multiplyScalar(scale));
        const material = new THREE.MeshStandardMaterial({ color: 0x506b64, roughness: .65, metalness: .15, side: THREE.DoubleSide, flatShading: true });
        materials.add(material);
        model.traverse(child => {
          if (!child.isMesh) return;
          geometries.add(child.geometry);
          [child.material].flat().filter(Boolean).forEach(m => m.dispose());
          child.material = material;
        });
        scene.add(model); onStatus("ready"); requestDraw();
      }, undefined, () => { if (!disposed) onStatus("error"); else decoder.dispose(); });
    } catch { onStatus("error"); }
    return () => {
      disposed = true; cancelAnimationFrame(frame); api.current = null;
      observer?.disconnect(); controls?.dispose(); decoder?.dispose();
      document.removeEventListener("visibilitychange", visibilityChange);
      geometries.forEach(g => g.dispose()); materials.forEach(m => m.dispose());
      if (renderer) { renderer.domElement.removeEventListener("webglcontextlost", contextLost); renderer.dispose(); renderer.domElement.remove(); }
    };
  }, [topics, onStatus]);

  return <div className="lab-canvas" ref={host}>{topics.map((topic, i) => <button key={topic.id} ref={element => { markers.current[i] = element; }} className={`lab-hotspot ${selected === i ? "is-active" : ""}`} aria-label={`${topic.number}: ${topic.title} konusunu keşfet`} aria-pressed={selected === i} onClick={() => onSelect(i)}>{topic.number}</button>)}</div>;
});
