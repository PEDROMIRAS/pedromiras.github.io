// Escena de la portada: tres móviles flotando en abanico, cada uno con una de las apps en pantalla.
// Se descarga aparte (import dinámico desde Hero3D.jsx): three.js no entra en la carga inicial de la web.
import {
    AmbientLight,
    DirectionalLight,
    Group,
    Mesh,
    MeshBasicMaterial,
    MeshStandardMaterial,
    PerspectiveCamera,
    PlaneGeometry,
    Raycaster,
    Scene,
    SRGBColorSpace,
    TextureLoader,
    Vector2,
    WebGLRenderer,
} from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

// Los móviles se reparten por un arco cuyo centro queda detrás, como cartas en la mano: todos miran al frente
const RADIO = 2.2;
const SEPARACION = 0.34; // radianes entre móvil y móvil
const PANTALLA = { ancho: 0.84, alto: 1.82 }; // la proporción de las capturas (585 x 1266)
const ARRASTRE = 0.004; // radianes por píxel arrastrado
const LIMITE = 0.6; // lo más que se gira el abanico arrastrando

/**
 * @param {HTMLCanvasElement} lienzo
 * @param {{imagen: string, url: string}[]} apps - Captura vertical y dirección de cada app.
 * @param {Function} alPintar - Avisa tras el primer fotograma con las pantallas cargadas, para mostrar el lienzo.
 * @returns {Function} Para la escena y suelta toda su memoria.
 */
export function iniciar(lienzo, apps, alPintar) {
    const renderer = new WebGLRenderer({ canvas: lienzo, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.outputColorSpace = SRGBColorSpace;
    const escena = new Scene();
    const camara = new PerspectiveCamera(32, 1, 0.1, 20);
    camara.position.set(0, 0.15, 5);
    escena.add(new AmbientLight(0xffffff, 1.4));
    const frente = new DirectionalLight(0xffffff, 1.6);
    frente.position.set(1, 2, 4);
    // Contraluz morado: el color de acento de la web dibuja el canto de los móviles
    const contraluz = new DirectionalLight(0x9b59b6, 3);
    contraluz.position.set(-3, 1, -2);
    escena.add(frente, contraluz);

    const abanico = new Group();
    escena.add(abanico);
    const cuerpo = new RoundedBoxGeometry(PANTALLA.ancho + 0.08, PANTALLA.alto + 0.14, 0.09, 4, 0.07);
    const carcasa = new MeshStandardMaterial({ color: 0x16121c, metalness: 0.6, roughness: 0.35 });
    const plano = new PlaneGeometry(PANTALLA.ancho, PANTALLA.alto);
    const cargador = new TextureLoader();
    const pantallas = [];
    const moviles = apps.map((app, i) => {
        const angulo = (i - (apps.length - 1) / 2) * SEPARACION;
        const movil = new Group();
        // El del centro, un poco por delante: tapa el borde de los de los lados
        const delante = angulo === 0 ? 0.3 : 0;
        movil.position.set(Math.sin(angulo) * RADIO, 0, Math.cos(angulo) * RADIO - RADIO + delante);
        movil.rotation.y = angulo * 1.6;
        const textura = cargador.load(app.imagen, () => {
            if (pantallas.every((p) => p.material.map.image?.complete)) { pintar(); alPintar(); }
        });
        textura.colorSpace = SRGBColorSpace;
        textura.anisotropy = 4;
        // La pantalla no recibe luz: la captura se ve con sus colores reales, como una pantalla encendida
        const pantalla = new Mesh(plano, new MeshBasicMaterial({ map: textura, toneMapped: false }));
        pantalla.position.z = 0.046;
        pantalla.userData.url = app.url;
        pantallas.push(pantalla);
        movil.add(new Mesh(cuerpo, carcasa), pantalla);
        abanico.add(movil);
        return movil;
    });

    // Solo, el abanico se mece; arrastrando se gira a mano y al soltar vuelve poco a poco
    let giro = 0, arrastrando = null, movido = 0;
    const raton = new Vector2();
    const rayo = new Raycaster();
    const pantallaBajo = (evento) => {
        const caja = lienzo.getBoundingClientRect();
        raton.set(((evento.clientX - caja.left) / caja.width) * 2 - 1, -((evento.clientY - caja.top) / caja.height) * 2 + 1);
        rayo.setFromCamera(raton, camara);
        return rayo.intersectObjects(pantallas)[0]?.object;
    };
    const alPulsar = (evento) => {
        arrastrando = evento.clientX;
        movido = 0;
        lienzo.setPointerCapture(evento.pointerId);
    };
    const alMover = (evento) => {
        if (arrastrando === null) {
            lienzo.style.cursor = pantallaBajo(evento) ? 'pointer' : '';
            return;
        }
        const dx = evento.clientX - arrastrando;
        arrastrando = evento.clientX;
        movido += Math.abs(dx);
        giro = Math.max(-LIMITE, Math.min(LIMITE, giro + dx * ARRASTRE));
    };
    const alSoltar = (evento) => {
        arrastrando = null;
        // Un toque sin arrastrar abre la app de la pantalla tocada, en la misma pestaña como "Live Demo"
        if (movido < 6) {
            const url = pantallaBajo(evento)?.userData.url;
            if (url) window.location.href = url;
        }
    };
    lienzo.addEventListener('pointerdown', alPulsar);
    lienzo.addEventListener('pointermove', alMover);
    lienzo.addEventListener('pointerup', alSoltar);
    lienzo.addEventListener('pointercancel', () => { arrastrando = null; });

    const pintar = () => renderer.render(escena, camara);
    let anterior = 0, fotograma = 0, visible = false;
    const bucle = (ahora) => {
        const dt = Math.min((ahora - anterior) / 1000, 0.05);
        anterior = ahora;
        if (arrastrando === null) giro *= Math.pow(0.05, dt); // vuelve al centro en un par de segundos
        abanico.rotation.y = giro + Math.sin(ahora / 2500) * 0.12;
        abanico.rotation.x = Math.sin(ahora / 3100) * 0.04;
        moviles.forEach((movil, i) => { movil.position.y = Math.sin(ahora / 900 + i * 2) * 0.05; });
        pintar();
        fotograma = requestAnimationFrame(bucle);
    };
    // Solo se anima mientras se ve: fuera de pantalla o con la pestaña oculta no gasta batería
    const actualizar = () => {
        cancelAnimationFrame(fotograma);
        if (visible && !document.hidden) {
            anterior = performance.now();
            fotograma = requestAnimationFrame(bucle);
        }
    };
    const observador = new IntersectionObserver(([entrada]) => { visible = entrada.isIntersecting; actualizar(); });
    observador.observe(lienzo);
    document.addEventListener('visibilitychange', actualizar);

    const ajustar = () => {
        const { clientWidth: ancho, clientHeight: alto } = lienzo;
        if (!ancho || !alto) return;
        renderer.setSize(ancho, alto, false);
        camara.aspect = ancho / alto;
        // En un hueco estrecho la cámara se aleja para que quepa el abanico entero (unas 2,6 unidades de ancho)
        camara.position.z = Math.max(4.6, 2.6 / (2 * Math.tan((camara.fov * Math.PI) / 360) * camara.aspect));
        camara.updateProjectionMatrix();
        pintar();
    };
    const tamano = new ResizeObserver(ajustar);
    tamano.observe(lienzo);

    return () => {
        cancelAnimationFrame(fotograma);
        observador.disconnect();
        tamano.disconnect();
        document.removeEventListener('visibilitychange', actualizar);
        lienzo.removeEventListener('pointerdown', alPulsar);
        lienzo.removeEventListener('pointermove', alMover);
        lienzo.removeEventListener('pointerup', alSoltar);
        for (const pantalla of pantallas) {
            pantalla.material.map.dispose();
            pantalla.material.dispose();
        }
        plano.dispose();
        cuerpo.dispose();
        carcasa.dispose();
        renderer.dispose();
    };
}
