import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from 'sonner';
import App from "./App.tsx";
import "./index.css";

  // 检测是否在运行时环境，并动态设置basename
  const getBasename = () => {
    // 检查当前路径是否包含runtime，以适应不同的部署环境
    if (window.location.pathname.includes('/runtime/')) {
      // 对于runtime环境，不使用固定的basename，让react-router自动处理
      return '';
    }
    return '/ELEV-9';
  };

  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <BrowserRouter basename={getBasename()}>
        <App />
        <Toaster />
      </BrowserRouter>
    </StrictMode>
  );
