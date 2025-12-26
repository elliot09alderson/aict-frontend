import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";

import axios from "axios";

// Global axios config
axios.defaults.withCredentials = true;
axios.defaults.baseURL = "http://localhost:5001"; // Explicitly point to backend just in case proxy fails

function LenisScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return <App />;
}

createRoot(document.getElementById("root")!).render(<LenisScroll />);
