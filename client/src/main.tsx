import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Add custom styles for gradients and other utility classes
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  .gradient-text {
    background: linear-gradient(90deg, #0AB5CE 0%, #5CDC74 50%, #FDA035 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .gradient-border {
    position: relative;
  }
  
  .gradient-border::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 100%;
    height: 2px;
    background: linear-gradient(90deg, #0AB5CE 0%, #5CDC74 50%, #FDA035 100%);
  }
  
  .bg-gradient-brand {
    background: linear-gradient(90deg, #0AB5CE 0%, #5CDC74 50%, #FDA035 100%);
  }

  .font-accent {
    font-family: 'Poppins', sans-serif;
  }

  .font-sans {
    font-family: 'Inter', var(--font-sans), sans-serif;
  }
`;
document.head.appendChild(styleSheet);

createRoot(document.getElementById("root")!).render(<App />);
