import React, { useEffect, useContext, useState } from "react";
import { GameContext } from "@/contexts/gameContext";
import PrologueScene from "@/components/scenes/PrologueScene";
import ElevatorScene from "@/components/scenes/ElevatorScene";
import AIScene from "@/components/scenes/AIScene";
import Chapter2Scene from "@/components/scenes/Chapter2Scene";
import Chapter3Scene from "@/components/scenes/Chapter3Scene";
import Chapter4Scene from "@/components/scenes/Chapter4Scene";
import Chapter5Scene from "@/components/scenes/Chapter5Scene";
import LoadingScreen from "@/components/ui/LoadingScreen";
import AudioSystem from "@/components/audio/AudioSystem";
import StartScreen from "@/components/ui/StartScreen";
import Empty from "@/components/Empty";

export default function GamePage() {
    const {
        gameState,
        resetGame,
        updateGameState,
        resumeFromSavedState
    } = useContext(GameContext);

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (!gameState || typeof gameState !== "object") {
            updateGameState({
                currentChapter: "prologue",
                currentStage: "start",
                isAwakened: false,
                countdown: 0,
                inventory: ["手机"],
                discoveredClues: [],
                playerName: "Claire",
                permissions: [],

                trustLevel: {
                    "王阿姨": 70,
                    "小明": 40,
                    "张经理": 20,
                    "陈博士": 30,
                    "CORE": 0
                },

                moralLevel: 50
            });
        }
    }, [gameState, updateGameState]);

    const renderScene = () => {
        try {
            if (isLoading) {
                return <LoadingScreen />;
            }

            if (!gameState || typeof gameState !== "object") {
                console.warn("游戏状态无效，使用默认开始画面");
                return <StartScreen />;
            }

            // 优先检查是否需要显示主菜单
            if (gameState.showMainMenu) {
                // 特殊处理：当需要显示主菜单时，传入是否有存档的状态
                return <StartScreen hasSavedProgress={gameState.savedChapter !== "prologue" || gameState.savedStage !== "start"} />;
            }

            // 如果是新游戏或明确指定从开始画面进入
            if (gameState.currentChapter === "prologue" && (gameState.currentStage === "start" || gameState.currentStage === undefined)) {
                return <StartScreen />;
            }

             switch (gameState.currentChapter) {
             case "prologue":
                 return <PrologueScene />;
             case "chapter1":
                 if (gameState.isAwakened) {
                     return <AIScene />;
                 }

                 return <ElevatorScene />;
             case "chapter2":
                 return <Chapter2Scene />;
             case "chapter3":
                 if (gameState.currentStage === "chapter3Complete") {
                     return <Chapter4Scene />;
                 }

                 return <Chapter3Scene />;
             case "chapter4":
                 return (
                     <div className="relative">
                         <Chapter4Scene />
                         <></>
                     </div>
                 );
             case "chapter5":
                 return <Chapter5Scene />;
             default:
                 // 默认根据存档状态决定显示哪个场景，而不是直接返回开始画面
                 if (gameState && gameState.currentChapter) {
                     // 尝试根据存档的章节返回对应场景
                     if (gameState.currentChapter === "chapter2") return <Chapter2Scene />;
                     if (gameState.currentChapter === "chapter3") return <Chapter3Scene />;
                     if (gameState.currentChapter === "chapter4") return <Chapter4Scene />;
                     if (gameState.currentChapter === "chapter5") return <Chapter5Scene />;
                 }
                 return <StartScreen />;
             }
        } catch (error) {
            console.error("渲染场景时出错:", error);
            return <Empty />;
        }
    };

    return (
        <div className="relative w-full h-screen overflow-hidden bg-black font-sans">
            <AudioSystem />
            {renderScene()}
        </div>
    );
}