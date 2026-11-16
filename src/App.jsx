import Footer from "./components/Footer";
import Nav from "./components/Nav";
import About from "./sections/About";
import Contact from "./sections/Contact";
import Hero from "./sections/Hero";
import Projects from "./sections/Projects";

export default function App() {
  return (
    <>
      {/* Hidden until focused with Tab: lets keyboard users jump past the nav */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-4 focus:z-50 focus:rounded-md focus:bg-accent focus:px-3 focus:py-2 focus:text-label-s focus:text-on-accent"
      >
        Skip to content
      </a>
      <Nav />
      <main id="main">
        <Hero />
        <Projects />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
