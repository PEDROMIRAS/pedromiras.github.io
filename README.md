# 👨‍💻 Pedro Miras - Web Developer Portfolio

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![EmailJS](https://img.shields.io/badge/EmailJS-%23F7DF1E.svg?style=for-the-badge&logo=gmail&logoColor=black)

Welcome to my personal portfolio repository. This project showcases my skills, projects, and experience as a Web
Developer. It is built with a focus on modern UI/UX trends, performance, and clean code.

🔗 **Live Demo:** [Ver Portfolio Online](https://pedromiras.github.io/)

---

## 🚀 Key Features

* **Modern Design:** Dark theme with a single purple accent.
* **Clear Navigation:** Fixed header that highlights the section you are in, with smooth scrolling between sections.
* **Responsive & Adaptive:** Fully responsive layout with a dropdown navigation menu on small screens.
* **Working Contact Form:** Fully functional form integrated with **EmailJS**.
* **Project Showcase:** Every project below is its own React app, linked from the Projects section.

---

## 🛠️ Technologies Used

Every project in this repository is now built with **React** (Vite):

* **React 18 + Vite** for the main site and every sub-project.
* CSS Variables (Custom Properties), Flexbox & Grid, centralized media queries.
* [EmailJS](https://www.emailjs.com/) (Contact Form).
* Icons from [Font Awesome Free](https://fontawesome.com/), served as a local SVG sprite.
* GitHub Actions builds and deploys the whole site automatically on every push to `main`.

---

## 📂 Project Structure

Each project below is an **independent mini-app** (its own `package.json`, its own Vite build), linked from the
Projects section — the same pattern the site already used for Ramo de flores and Sushi Tracker.

```text
/                        # Main site (this React app: Home, About, Experience, Skills, Projects, Contact)
  src/
    components/          # Header, Home, About, Experience, Skills, Projects, Contact, Footer
    styles/              # One .css file per section (same design as before)
  public/assets/          # Images

/ramo-flores-amarillas/  # "Ramo de flores": a random bouquet of flowers, in the color you choose (React + Vite)
/todoApp/                # "TODO APP": task list with filters and localStorage (React + Vite)
/sushi-tracker/          # "Sushi Tracker": sushi-eating counter with history (React + Vite + Tailwind)
/snake/                  # "Snake": the classic game, rebuilt with React state instead of manual DOM (React + Vite)

/.github/workflows/deploy.yml   # Builds all 5 apps and publishes them together to GitHub Pages
```

## ✅ Rendimiento, SEO y accesibilidad

- **Imágenes optimizadas**: las de Sushi Tracker, Snake y la foto de About pesaban varios MB cada una
  (se mostraban a un tamaño pequeño con un archivo gigante detrás); convertidas a WebP y redimensionadas
  a su tamaño real de uso. En total, unos 9 MB menos que descargar.
- **SEO**: `robots.txt`, `sitemap.xml` (con los 4 proyectos incluidos), URL canónica, y etiquetas Open
  Graph / Twitter Card con una imagen propia (`public/assets/img/og-image.webp`) para que el enlace se
  vea bien al compartirlo en LinkedIn, WhatsApp, etc.
- **Accesibilidad**: todos los enlaces y botones tienen ahora un foco de teclado visible (antes solo lo
  tenía el formulario de contacto); contrastes de color comprobados con la fórmula WCAG — el sitio ya
  cumplía el mínimo en los sitios que importan.
- **CI más rápido**: el *workflow* cachea las dependencias de npm entre ejecuciones.
- **Una vulnerabilidad real** (en una dependencia de producción de Sushi Tracker) corregida; las que
  quedan son de una herramienta que solo corre al compilar, nunca llega al navegador de quien visita
  la web.

## 🖥️ Verlo en local: dos formas distintas

**A. Trabajar en el diseño de un proyecto concreto** — `npm run dev` en la carpeta de ese proyecto. Esto
levanta solo ese proyecto; los enlaces a los *otros* proyectos **no van a funcionar** en este modo, porque
cada uno es un proyecto Vite aparte y el servidor de desarrollo de uno no conoce a los demás:

```bash
npm install && npm run dev        # sitio principal -> http://localhost:5173
cd todoApp && npm install && npm run dev
cd snake && npm install && npm run dev
cd ramo-flores-amarillas && npm install && npm run dev
cd sushi-tracker && npm install --legacy-peer-deps && npm run dev
```

**B. Ver el sitio completo, tal como quedará publicado** — con los 5 proyectos enlazados entre sí de verdad.
Para esto no sirve `npm run dev`: hace falta compilar los 5 y servirlos juntos, que es justo lo que hace:

```bash
npm run build:sitio
```

Instala y compila los 5 proyectos, monta el resultado en `_site/` (igual que lo hará GitHub Pages),
comprueba automáticamente que las 5 rutas cargan de verdad, y si todo va bien **deja el sitio servido en
local** con la URL en la terminal para que lo abras en el navegador y pinches por los proyectos tú mismo.
Tarda un par de minutos la primera vez (instala cada `node_modules`); las siguientes veces es mucho más
rápido. `Ctrl+C` para pararlo.

Es el mismo script que ejecuta GitHub Actions (`scripts/build-sitio.mjs`) — si funciona aquí, funciona en
producción; si algo falla, falla igual de claro en tu terminal que en el *log* de Actions.

## 🚢 Despliegue

Al hacer *push* a `main`, GitHub Actions ejecuta `node scripts/build-sitio.mjs` (lo mismo que harías tú a
mano con `npm run build:sitio`) y, si las 5 rutas verifican correctamente, publica el resultado en GitHub
Pages: el sitio principal en la raíz, y cada proyecto en su propia carpeta (`/ramo-flores-amarillas/`,
`/todoApp/`, `/sushi-tracker/`, `/snake/`). Si algún proyecto falla al compilar o alguna ruta no carga, el
*workflow* falla ahí mismo y no se publica nada — nunca queda el sitio a medias. No hace falta compilar nada
a mano ni commitear ninguna carpeta `dist/`.
