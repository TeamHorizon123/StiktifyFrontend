import { useEffect } from "react";

declare global {
  interface Window {
    chtlConfig?: { chatbotId: string };
  }
}

const Chatbox = () => {
  useEffect(() => {
    window.chtlConfig = { chatbotId: "6311757987" };

    const script = document.createElement("script");
    script.src = "https://chatling.ai/js/embed.js";
    script.async = true;
    script.id = "chatling-embed-script";

    document.body.appendChild(script);
  }, []);

  return null;
};

export default Chatbox;
