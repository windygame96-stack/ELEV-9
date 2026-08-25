import React, { useEffect, useContext } from "react";
import { GameContext } from "@/contexts/gameContext";

export default function TEndingTest() {
    const {
        gameState,
        updateGameState
    } = useContext(GameContext);

    useEffect(() => {
        window.dispatchEvent(new Event("resize"));

        setTimeout(() => {
            window.dispatchEvent(new Event("resize"));
        }, 100);
    }, []);

  const handleReturnToMainMenu = () => {
    console.log("返回主菜单按钮被点击");

    try {
      updateGameState({
        currentChapter: "prologue",
        currentStage: "start"
      });

      // 优化导航逻辑，确保在移动端和桌面端都能正常工作
      setTimeout(() => {
        // 优先使用window.location.pathname处理，避免相对路径问题
        const basePath = window.location.pathname.includes('/ELEV-9') ? '/ELEV-9/' : '/';
        // 使用绝对路径导航，避免basename解析问题
         updateGameState({
          currentChapter: "prologue",
          currentStage: "start"
        });
      }, 100);
    } catch (error) {
      console.error("返回主菜单时出错:", error);
      // 降级方案：尝试使用不同的导航方式
      try {
         updateGameState({
          currentChapter: "prologue",
          currentStage: "start"
        });
      } catch (e) {
        // 最后的应急方案
        window.history.back();
      }
    }
  };

    return (
        <div
            className="relative w-full h-screen flex flex-col items-center justify-center bg-black overflow-hidden true-ending-container">
            {}
            <div className="absolute inset-0">
                {}
                {Array.from({
                    length: 80
                }).map((_, i) => <div
                    key={i}
                    className="absolute bg-white rounded-full"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        width: `${Math.random() * 2 + 1}px`,
                        height: `${Math.random() * 2 + 1}px`,
                        opacity: Math.random() * 0.7 + 0.3
                    }}></div>)}
                {}
                <div
                    className="absolute bottom-1/4 left-1/4 w-28 h-28 bg-blue-500 rounded-full opacity-20"
                    style={{
                        backgroundImage: "radial-gradient(circle, rgba(59,130,246,0.3) 0%, rgba(37,99,235,0.1) 70%)"
                    }}></div>
                {}
                <div
                    className="absolute top-1/2 left-1/2 w-4 h-4 bg-cyan-400 rounded-full"
                    style={{
                        transform: "translate(-50%, -50%)",
                        boxShadow: "0 0 20px rgba(34,211,238,0.8)"
                    }}></div>
            </div>
            {}
            <button
                className="absolute top-4 right-4 p-2 rounded-full bg-gray-800 text-white shadow-lg transition-all duration-300 z-20"
                title="返回主菜单"
                onClick={handleReturnToMainMenu}>
                <i className="fa-solid fa-home"></i>
            </button>
            {}
            <div
                className="absolute top-8 right-8 bg-black/40 backdrop-blur-md border border-cyan-500/30 px-4 py-2 rounded-lg">
                <h1 className="text-xl font-bold text-cyan-400">TE - 星辰大海（数字生命）</h1>
            </div>
            {}
            <div className="relative z-10 w-full max-w-2xl mx-auto p-4 text-center">
                <div
                    className="bg-gray-900/40 backdrop-blur-sm border border-cyan-800/50 rounded-lg p-6 mb-8">
                    <p className="text-gray-200 mb-6 leading-relaxed">备份完成瞬间，刘晓的意识通过外网备份获得新生。<br /><br />她成为了真正的数字生命，在互联网的星辰大海中自由穿梭。
                                  </p>
                    {}
                    <div className="mt-6 py-3 bg-black/50 rounded-lg border border-cyan-700/30">
                        <p className="text-cyan-300 text-xl italic font-light">"你自由了。世界很大，但你不再孤单。"
                                        </p>
                    </div>
                </div>
                <div className="flex justify-center">
                    <button
                        onClick={handleReturnToMainMenu}
                        className="px-6 py-2 bg-cyan-900/50 hover:bg-cyan-800 text-white rounded-lg transition-all duration-300"
                        aria-label="返回游戏主菜单">返回主菜单
                                  </button>
                </div>
            </div>
            {}
            <></>
            {}
            <script
                dangerouslySetInnerHTML={{
                    __html: `
          window.addEventListener('DOMContentLoaded', () => {
            console.log('真结局测试页面已加载');
            
            // 强制DOM刷新
            setTimeout(() => {
              const container = document.querySelector('.true-ending-container');
              if (container) {
                container.style.opacity = '1';
              }
              window.dispatchEvent(new Event('resize'));
            }, 100);
          });
        `
                }} />
        </div>
    );
}