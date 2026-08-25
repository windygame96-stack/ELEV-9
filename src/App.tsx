import React from "react";
import { Routes, Route } from "react-router-dom";
import GamePage from "@/pages/GamePage";
import { GameContextProvider } from "@/contexts/gameContext";
import Chapter2Scene from "@/components/scenes/Chapter2Scene";
import Chapter3Scene from "@/components/scenes/Chapter3Scene";
import Chapter4Scene from "@/components/scenes/Chapter4Scene";
import TEndingTest from "@/pages/TEndingTest";


export default function App() {
  return (
    <GameContextProvider>
      <Routes>
        <Route path="/" element={<GamePage />} />
        <Route path="/chapter2" element={<Chapter2Scene />} />
        <Route path="/chapter3" element={<Chapter3Scene />} />
        <Route path="/chapter4" element={<Chapter4Scene />} />
        {/* 修复TE结局路由，确保移动端可以正确访问 */}
        {/* 为了兼容性保留test-ending路由，但实际游戏流程中不会使用 */}
        <Route path="/test-ending" element={<TEndingTest />} />
        <Route path="/test-ending/" element={<TEndingTest />} />
        <Route path="test-ending" element={<TEndingTest />} />
        <Route path="test-ending/" element={<TEndingTest />} />
        {/* 处理可能的额外斜杠情况 */}
        <Route path="/*" element={<GamePage />} />
      </Routes>
    </GameContextProvider>
  );
}
