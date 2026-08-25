import React from "react";
import { GameContext } from "@/contexts/gameContext";

export default function StartScreen({ hasSavedProgress = false }: { hasSavedProgress?: boolean } = {}) {
    const {
        updateGameState,
        resetGame,
        resumeFromSavedState
    } = React.useContext(GameContext);

    const startGame = () => {
        // 添加确认对话框
        if (hasSavedProgress) {
            const confirmRestart = window.confirm("您有已保存的游戏进度，确定要重新开始游戏吗？这将清除所有存档。");
            if (!confirmRestart) {
                return; // 用户取消，不执行任何操作
            }
        }
        
        // 重置全部进度，并从序章动画开始新游戏。
        resetGame();
        updateGameState({
            currentChapter: "prologue",
            currentStage: "intro",
            showMainMenu: false,
            countdown: 0,
        });
    };

    const handleResumeGame = () => {
        resumeFromSavedState();
    };

    return (
        <div className="relative w-full h-screen flex flex-col items-center justify-center bg-black overflow-hidden">
            {/* 背景效果 */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 left-0 right-0 h-[50vh] bg-gradient-to-b from-blue-900/30 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 h-[50vh] bg-gradient-to-t from-purple-900/30 to-transparent"></div>
                {/* 数据流动画 */}
                {Array.from({ length: 20 }).map((_, i) => (
                    <div 
                        key={i} 
                        className="absolute text-green-400 font-mono text-xs opacity-30"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animation: `float ${5 + Math.random() * 10}s linear infinite`,
                            animationDelay: `${Math.random() * 5}s`
                        }}
                    >
                        {Array.from({ length: 10 }).map(() => Math.random() > 0.5 ? '1' : '0').join('')}
                    </div>
                ))}
            </div>
            
            {/* 主内容 */}
            <div className="relative z-10 text-center p-4">
                <div className="mb-8">
                    <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2 tracking-tighter">ELEV-9</h1>
                    <p className="text-lg sm:text-xl text-blue-400">智能电梯逃生</p>
                </div>
                
                <div className="w-full max-w-xs mx-auto">
                    {/* 开始游戏按钮 */}
                    <button
                        onClick={startGame}
                        className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20 mb-4"
                    >
                        开始新游戏
                    </button>
                    
                    {/* 继续游戏按钮 */}
                    {hasSavedProgress && (
                        <button
                            onClick={handleResumeGame}
                            className="w-full py-4 px-6 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-lg transition-all duration-300"
                        >
                            继续上次游戏
                        </button>
                    )}
                </div>
                
                <div className="mt-12 text-gray-400 text-sm">
                    <p>由 未来科技集团 开发</p>
                    <p className="mt-1">v1.0.0</p>
                </div>
            </div>
            
            {/* 全局样式 */}
            <style>{`
                @keyframes float {
                    0% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                    100% { transform: translateY(0); }
                }
                
                @keyframes twinkle {
                    0%, 100% { opacity: 0.3; }
                    50% { opacity: 0.8; }
                }
            `}</style>
        </div>
    );
}
