import React, { useState, useContext, useEffect, useRef } from "react";
import { GameContext } from "@/contexts/gameContext";
import EmergencyButton from "@/components/interactives/EmergencyButton";
import ElevatorPanel from "@/components/interactives/ElevatorPanel";
import AdvertisingScreen from "@/components/interactives/AdvertisingScreen";
import InspectionHatch from "@/components/interactives/InspectionHatch";
import Phone from "@/components/interactives/Phone";
import DoorGap from "@/components/interactives/DoorGap";

export default function ElevatorScene() {
    const {
        gameState,
        updateGameState,
        addDiscoveredClue,
        addToInventory,
        resetGame,
        returnToMainMenu
    } = useContext(GameContext);

    const [activeInteractive, setActiveInteractive] = useState<string | null>(null);
    const [isUsingFlashlight, setIsUsingFlashlight] = useState(false);
    const [hasTriedCallButton, setHasTriedCallButton] = useState(false);
    const [hasCheckedDoorGap, setHasCheckedDoorGap] = useState(false);
    const [hasFoundInspectionHatch, setHasFoundInspectionHatch] = useState(false);
    const [hasViewedLogs, setHasViewedLogs] = useState(false);
    const [showPauseMenu, setShowPauseMenu] = useState(false);
    const [showHintButton, setShowHintButton] = useState(false);
    const [showHintDialog, setShowHintDialog] = useState(false);
    const lastInteractionTimeRef = useRef(Date.now());
    const hintTimerRef = useRef<number | null>(null);

  useEffect(() => {
    let nextStage = "initialExploration";

    if (gameState.discoveredClues.length >= 5) {
      nextStage = "truthReveal";
    } else if (gameState.discoveredClues.length >= 3) {
      nextStage = "deepExploration";
    }

    if (gameState.currentStage !== nextStage) {
      updateGameState({ currentStage: nextStage });
    }
  }, [gameState.currentStage, gameState.discoveredClues.length, updateGameState]);

  // 初始化计时器
  useEffect(() => {
    // 每30秒检查一次是否超过5分钟没有交互
    const checkInterval = setInterval(() => {
      const currentTime = Date.now();
      const timeSinceLastInteraction = currentTime - lastInteractionTimeRef.current;
      
      // 5分钟 = 300000毫秒
      if (timeSinceLastInteraction > 300000 && !showHintButton && !activeInteractive) {
        setShowHintButton(true);
      }
    }, 30000); // 每30秒检查一次

    return () => {
      if (checkInterval) {
        clearInterval(checkInterval);
      }
      if (hintTimerRef.current) {
        clearTimeout(hintTimerRef.current);
      }
    };
  }, [showHintButton, activeInteractive]);

  // 重置最后交互时间
  const resetLastInteractionTime = () => {
    lastInteractionTimeRef.current = Date.now();
    // 如果提示按钮已显示，则隐藏它
    if (showHintButton) {
      setShowHintButton(false);
    }
    // 清除可能存在的计时器
    if (hintTimerRef.current) {
      clearTimeout(hintTimerRef.current);
    }
  };

  const handleInteractiveClick = (interactiveType: string) => {
    resetLastInteractionTime();
    setActiveInteractive(interactiveType);
  };

  const closeInteractive = () => {
    resetLastInteractionTime();
    setActiveInteractive(null);
  };

  const toggleFlashlight = () => {
    resetLastInteractionTime();
    setIsUsingFlashlight(!isUsingFlashlight);
  };

  const getProgressHint = () => {
    if (gameState.discoveredClues.length === 0) {
      return "你需要仔细探索电梯内部，寻找线索。试着点击电梯控制面板、广告屏、手机、门缝或检修口等交互点。";
    } else if (gameState.discoveredClues.length === 1) {
      return "试着检查电梯的各个部分，也许能发现更多线索。你已经找到了一个线索，继续探索其他区域。";
    } else if (gameState.discoveredClues.length === 2) {
      return "广告屏看起来有些异常，也许值得深入研究。尝试检查广告屏的系统日志。";
    } else if (gameState.discoveredClues.length === 3) {
      return "系统日志中可能包含重要信息。试着查看电梯控制面板的日志或使用手机查看更多信息。";
    } else if (gameState.discoveredClues.length === 4) {
      return "注意天花板上的检修口，它可能是你的出路。你需要先获取管理员授权才能打开它。";
    } else {
      return "你已经收集了足够的线索，准备揭露真相。";
    }
  };

  // 显示提示对话框
  const showHint = () => {
    setShowHintDialog(true);
    // 点击提示按钮后，10分钟内不再显示
    hintTimerRef.current = setTimeout(() => {
      setShowHintButton(false);
    }, 600000); // 10分钟
  };

  // 关闭提示对话框
  const closeHintDialog = () => {
    setShowHintDialog(false);
  };

    const handlePause = () => {
        setShowPauseMenu(true);
    };

    const handleResume = () => {
        setShowPauseMenu(false);
    };

    const handleReturnToMainMenu = () => {
        setShowPauseMenu(false);
        // 使用gameContext中专门的返回主菜单方法
        returnToMainMenu();
    };

    const handleRestartGame = () => {
        if (window.confirm("确定要重新开始游戏吗？这将清除所有进度。")) {
            resetGame();
            setShowPauseMenu(false);
        }
    };

   return (
    <div
        className={`relative w-full h-screen overflow-hidden transition-all duration-500 ${isUsingFlashlight ? "brightness-125" : "brightness-75"}`}>
        {/* 背景图片 - 移动端优化 */}
        <div
            className="absolute inset-0 digital-noise"
            style={{
                backgroundImage: "url(https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Elevator%20interior%20emergency%20broken%20light%20red%20warning&sign=84f51f0423f7ac76aa25f37fcbfed10c)",
                backgroundSize: "cover",
                backgroundPosition: "center 20%",
                zIndex: -1
            }} />
        
        {/* 遮罩和扫描线效果 */}
        <div
            className="absolute inset-0 bg-gradient-to-b from-red-900/20 to-black/60 animate-flicker" />
        <div className="absolute inset-0 scanline" />
        
        {/* 顶部提示信息 - 移动端优化布局 */}
        <div className="absolute top-2 left-2 right-2 p-3 bg-black/70 rounded-lg backdrop-blur-sm border border-red-500/30">
            <p className="text-xs text-red-300 terminal-text">{getProgressHint()}</p>
        </div>
        
        {/* 身份信息 - 移动端位置调整 */}
        {gameState.isAwakened && (
            <div className="absolute top-20 left-2 right-2 p-2 bg-black/70 rounded-lg backdrop-blur-sm border border-red-500/30">
                <p className="text-xs text-red-400">身份: ELEV-9 AI</p>
            </div>
        )}
        
         {/* 底部按钮 - 移动端优化大小和位置 */}
         <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-between">
             <button
                 onClick={handlePause}
                 className="p-4 rounded-full bg-gray-700 text-white shadow-lg transition-all duration-300 z-10"
                 title="暂停游戏">
                 <i className="fa-solid fa-pause text-lg"></i>
             </button>
         </div>
         
         {/* 提示按钮 - 当玩家卡住时显示 */}
         {showHintButton && (
             <button
                 onClick={showHint}
                 className="absolute top-16 right-4 p-4 rounded-full bg-yellow-600 text-white shadow-lg transition-all duration-300 z-10 animate-pulse"
                 title="获取提示">
                 <i className="fa-solid fa-lightbulb text-lg"></i>
             </button>
         )}
         
         {/* 提示对话框 */}
         {showHintDialog && (
             <div className="absolute inset-0 flex items-center justify-center bg-black/80 p-4 z-50">
                 <div className="bg-gray-900 rounded-lg border-2 border-yellow-500 max-w-md w-full p-6">
                     <div className="flex justify-between items-center mb-4">
                         <h2 className="text-xl font-bold text-yellow-400">提示</h2>
                         <button 
                             onClick={closeHintDialog}
                             className="text-white hover:text-gray-400 transition-colors"
                         >
                             <i className="fa-solid fa-times"></i>
                         </button>
                     </div>
                     <div className="mb-6">
                         <div className="flex items-center justify-center mb-4">
                             <div className="w-16 h-16 rounded-full bg-yellow-900/50 flex items-center justify-center">
                                 <i className="fa-solid fa-lightbulb text-yellow-400 text-2xl"></i>
                             </div>
                         </div>
                         <p className="text-white text-center">
                             {getProgressHint()}
                         </p>
                     </div>
                     <button
                         onClick={closeHintDialog}
                         className="w-full p-3 bg-yellow-600 hover:bg-yellow-500 text-white rounded-lg transition-colors"
                     >
                         明白了
                     </button>
                 </div>
             </div>
         )}
        
        {/* 交互热点 - 移动端优化位置和大小 */}
            {/* 电梯控制面板 - 更明显的标记和交互区域 */}
             <div
                  className="absolute left-[30%] top-[40%] transform -translate-y-1/2 w-20 h-36 cursor-pointer hover:bg-white/10 rounded-lg transition-all duration-300 relative border border-yellow-500/30"
                  onClick={() => handleInteractiveClick("elevatorPanel")}
                  title="电梯控制面板">
                 {/* 添加一个半透明的面板背景，让玩家更容易识别 */}
                 <div className="absolute inset-0 bg-black/30 rounded-lg"></div>
                 {/* 电梯控制面板文字标识 */}
                 <div className="absolute inset-0 flex items-center justify-center z-10">
                   <p className="text-white text-xs font-bold bg-black/50 px-2 py-1 rounded-md backdrop-blur-sm">电梯控制面板</p>
                 </div>
                 {/* 更明显的闪光点效果 */}
                <div className="absolute top-2 right-2 w-2.5 h-2.5 bg-yellow-400 rounded-full animate-[sparkle_1.5s_infinite] opacity-100"></div>
            </div>
            
             {/* 广告屏幕 - 移动端位置调整 */}
            <div
                className="absolute left-[5%] top-[40%] transform -translate-y-1/2 w-28 h-20 cursor-pointer hover:bg-white/5 rounded-lg transition-all duration-300 border border-gray-700 relative"
                onClick={() => handleInteractiveClick("advertisingScreen")}
                title="广告屏">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-70"
                    style={{
                        backgroundImage: "url(https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Broken%20digital%20screen%20error%20message%20glitch&sign=1cd85f81afcf4f1b3cb1270a1b743583)"
                    }} />
                <div
                    className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                    <p className="text-white text-xs">广告屏</p>
                </div>
                {/* 从电梯控制面板移动到广告屏上方的div元素 */}
                <div
                    className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                    <p className="text-white text-xs font-bold">控制面板</p>
                </div>
                {/* 闪光点效果 */}
                <div className="absolute top-2 right-2 w-2 h-2 bg-blue-300 rounded-full animate-[sparkle_1.8s_infinite] opacity-80"></div>
            </div>
            
              {/* 手机调查点 - 将原来的紧急呼叫按钮位置改为手机 */}
            <div
                className="absolute left-[15%] top-[55%] transform -translate-y-1/2 w-16 h-16 cursor-pointer hover:bg-white/10 rounded-lg transition-all duration-300 relative z-10"
                onClick={() => handleInteractiveClick("phone")}
                title="手机">
                <div className="absolute inset-0 flex items-center justify-center">
                    <i className="fa-solid fa-mobile-screen text-3xl text-blue-400"></i>
                </div>
                <div
                    className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                    <p className="text-white text-xs">手机</p>
                </div>
                {/* 闪光点效果 */}
                <div className="absolute top-1 right-1 w-2 h-2 bg-blue-300 rounded-full animate-[sparkle_2s_infinite] opacity-80"></div>
            </div>
            
            {/* 电梯门缝 - 移动端位置调整 */}
            <div
                className="absolute left-1/2 top-[25%] transform -translate-x-1/2 w-20 h-16 cursor-pointer hover:bg-white/5 rounded-lg transition-all duration-300 relative"
                onClick={() => handleInteractiveClick("doorGap")}
                title="电梯门缝">
                <div className="absolute inset-0 border border-gray-500 rounded-lg opacity-50"></div>
                <div
                    className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                    <p className="text-white text-xs">电梯门缝</p>
                </div>
                {/* 闪光点效果 */}
                <div className="absolute top-1 right-1 w-2 h-2 bg-green-300 rounded-full animate-[sparkle_2.2s_infinite] opacity-80"></div>
            </div>
            
            {/* 检修口 - 移动端位置调整 */}
            <div
                className="absolute left-1/2 bottom-32 transform -translate-x-1/2 w-24 h-12 cursor-pointer hover:bg-white/5 rounded-lg transition-all duration-300 relative"
                onClick={() => handleInteractiveClick("inspectionHatch")}
                title="检修口">
                <div className="absolute inset-0 border border-gray-500 rounded-lg opacity-50"></div>
                <div
                    className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                    <p className="text-white text-xs">检修口</p>
                </div>
                {/* 闪光点效果 */}
                <div className="absolute top-1 right-1 w-2 h-2 bg-purple-300 rounded-full animate-[sparkle_1.7s_infinite] opacity-80"></div>
            </div>
            
              {/* 紧急呼叫按钮 - 移到电梯控制面板下方 */}
            <div
                className="absolute right-[5%] top-[70%] transform -translate-y-1/2 w-12 h-12 cursor-pointer hover:bg-white/10 rounded-full bg-red-600 border-2 border-red-400 transition-all duration-300 flex items-center justify-center shadow-lg shadow-red-900/60 z-10 relative"
                onClick={() => handleInteractiveClick("emergencyButton")}
                title="紧急呼叫按钮">
                <i className="fa-solid fa-phone text-white text-base"></i>
                {/* 闪光点效果 */}
                <div className="absolute top-1 right-1 w-2 h-2 bg-yellow-300 rounded-full animate-[sparkle_1.5s_infinite] opacity-80"></div>
            </div>
        
        {/* 交互弹窗 - 保持原有功能 */}
        {activeInteractive === "emergencyButton" && <EmergencyButton onClose={closeInteractive} />}
        {activeInteractive === "elevatorPanel" && <ElevatorPanel onClose={closeInteractive} />}
        {activeInteractive === "advertisingScreen" && <AdvertisingScreen onClose={closeInteractive} />}
        {activeInteractive === "inspectionHatch" && <InspectionHatch onClose={closeInteractive} />}
        {activeInteractive === "phone" && <Phone 
            onClose={closeInteractive} 
            isUsingFlashlight={isUsingFlashlight}
            toggleFlashlight={toggleFlashlight}
        />}
        {activeInteractive === "doorGap" && <DoorGap
            onClose={closeInteractive}
            isUsingFlashlight={isUsingFlashlight}
            toggleFlashlight={toggleFlashlight} />}
        
        {/* 暂停菜单 - 移动端优化 */}
        {showPauseMenu && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/90 z-50 p-4">
                <div className="bg-gray-900 rounded-lg border-2 border-red-500 p-6 w-full max-w-md">
                    <h2 className="text-2xl font-bold text-white mb-6 text-center">游戏菜单</h2>
                    <div className="space-y-4">
                        <button
                            onClick={handleResume}
                            className="w-full p-4 bg-red-600 hover:bg-red-500 text-white rounded transition-colors">
                            继续游戏
                        </button>
                        <button
                            onClick={handleRestartGame}
                            className="w-full p-4 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors">
                            重新开始
                        </button>
                        <button
                            onClick={handleReturnToMainMenu}
                            className="w-full p-4 bg-gray-800 hover:bg-gray-700 text-white rounded transition-colors">
                            返回主菜单
                        </button>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
}
