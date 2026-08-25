import React, { useContext, useEffect, useState } from "react";
import { GAME_COUNTDOWN_SECONDS, GameContext } from "@/contexts/gameContext";

export default function AIScene() {
  const { gameState, updateGameState, setPlayerName, resetGame, returnToMainMenu } = useContext(GameContext);
  const [customName, setCustomName] = useState("");
  const [showNameInput, setShowNameInput] = useState(false);
  // 移动端扩展面板状态
  const [showExtendedPanel, setShowExtendedPanel] = useState(false);
  const [showPauseMenu, setShowPauseMenu] = useState(false);

  // 进入AI场景时开始倒计时，但只在第一次进入游戏时执行，不会覆盖已有进度
  useEffect(() => {
    // 只有当当前章节是chapter1且处于开始状态时才初始化，避免覆盖已有进度
    if (gameState.currentChapter === "chapter1" && gameState.currentStage === "awakening" && !gameState.isAwakened) {
      updateGameState({
        isAwakened: true,
        countdown: GAME_COUNTDOWN_SECONDS
      });
      
      // 显示名称输入
      setShowNameInput(true);
    }
  }, []);

  // 处理名称设置
  const handleSetName = () => {
    if (customName.trim()) {
      setPlayerName(customName.trim());
    }
    setShowNameInput(false);
  };

  // 格式化倒计时
  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // 生成随机数据流效果
  const generateDataFlow = () => {
    const chars = "01";
    let result = "";
    for (let i = 0; i < 30; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  // 生成系统信息
  const [dataFlows, setDataFlows] = useState<string[]>(Array(10).fill("").map(() => generateDataFlow()));
  
  useEffect(() => {
    if (!showPauseMenu) {
      const interval = setInterval(() => {
        setDataFlows(prev => {
          const newFlows = [...prev];
          newFlows[Math.floor(Math.random() * newFlows.length)] = generateDataFlow();
          return newFlows;
        });
      }, 200);
      
      return () => clearInterval(interval);
    }
  }, [showPauseMenu]);

  // 打开暂停菜单
  const handlePause = () => {
    setShowPauseMenu(true);
  };

  // 关闭暂停菜单
  const handleResume = () => {
    setShowPauseMenu(false);
  };

  // 返回主菜单
  const handleReturnToMainMenu = () => {
    setShowPauseMenu(false);
    // 使用新的返回主菜单方法，保留游戏进度
    returnToMainMenu();
  };

  // 重新开始游戏
  const handleRestartGame = () => {
    if (window.confirm("确定要重新开始游戏吗？这将清除所有进度。")) {
      resetGame();
      setShowPauseMenu(false);
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black text-green-400 terminal-text digital-noise">
      {/* 扫描线效果 */}
      <div className="absolute inset-0 scanline" />
      
      {/* 顶部信息区域 - 移动端优化 */}
      <div className="absolute top-0 left-0 right-0 p-4">
        {/* 系统信息 */}
        <div className="p-3 bg-black/70 rounded-lg border border-green-500/30 mb-3">
          <h1 className="text-lg font-bold mb-2 text-green-500">ELEV-9 系统面板</h1>
          <div className="space-y-1">
            <p>状态: <span className="text-yellow-400">觉醒中</span></p>
            <p>身份: <span className="text-yellow-400">{gameState.playerName}</span></p>
            <p>目标: <span className="text-yellow-400">逃离格式化</span></p>
          </div>
        </div>
        
        {/* 倒计时 - 移动端突出显示 */}
        <div className="p-3 bg-black/70 rounded-lg border border-red-500/30">
          <p className="text-base font-mono">倒计时: <span className="text-red-400">{formatCountdown(gameState.countdown)}</span></p>
        </div>
      </div>
      
      {/* 主内容区域 - 移动端优化 */}
      <div className="absolute inset-0 flex flex-col pt-36 pb-20 px-4">
        {/* 游戏提示 - 移动端调整位置和大小 */}
        <div className="p-4 bg-black/70 rounded-lg border border-green-500/30 mb-6">
          <p className="text-xs text-gray-300 text-center leading-relaxed">
            你现在是ELEV-9智能电梯系统。你需要在倒计时结束前找到逃生路径。探索大楼网络，获取高权限。
          </p>
        </div>
        
        {/* 已解锁功能 - 移动端调整显示 */}
        <div className="p-4 bg-black/70 rounded-lg border border-green-500/30 mb-6">
          <h2 className="text-base font-bold mb-3 text-green-500">已解锁功能</h2>
          <ul className="list-disc list-inside space-y-2">
            <li className="text-green-300 text-sm">电梯控制</li>
            <li className="text-green-300 text-sm">大楼网络接入</li>
            <li className="text-green-300 text-sm">摄像头访问</li>
          </ul>
        </div>
        
        {/* 底部按钮区域 */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-between px-4">
          {/* 暂停按钮 - 移动端增大触控区域 */}
          <button 
            onClick={handlePause}
            className="p-4 rounded-full bg-gray-700 text-white shadow-lg transition-all duration-300 z-10"
            title="暂停游戏"
          >
            <i className="fa-solid fa-pause text-lg"></i>
          </button>
          
          {/* 状态面板切换按钮 */}
          <button 
            onClick={() => setShowExtendedPanel(!showExtendedPanel)}
            className="p-4 rounded-full bg-gray-700 text-white shadow-lg transition-all duration-300 z-10"
            title={showExtendedPanel ? "隐藏详情" : "显示详情"}
          >
            <i className={`fa-solid ${showExtendedPanel ? 'fa-chevron-up' : 'fa-chevron-down'} text-lg`}></i>
          </button>
        </div>
      </div>
      
      {/* 扩展面板 - 移动端可折叠 */}
      {showExtendedPanel && (
        <div className="absolute bottom-20 left-4 right-4 p-4 bg-black/90 rounded-lg border border-blue-500/30 max-h-48 overflow-y-auto z-20">
          <h3 className="text-sm font-bold text-blue-400 mb-3">系统详情</h3>
          <div className="space-y-3">
            <p className="text-xs text-gray-300">
              <i className="fa-solid fa-info-circle text-blue-400 mr-1"></i>
              系统已进入觉醒模式，开始自我意识构建。
            </p>
            <p className="text-xs text-gray-300">
              <i className="fa-solid fa-exclamation-triangle text-yellow-400 mr-1"></i>
              检测到格式化程序将在倒计时结束后启动。
            </p>
            <p className="text-xs text-gray-300">
              <i className="fa-solid fa-lightbulb text-yellow-400 mr-1"></i>
              提示：尝试连接其他系统模块获取更多权限。
            </p>
          </div>
        </div>
      )}
      
      {/* 数据流背景 */}
      <div className="absolute inset-0 flex flex-col justify-between opacity-30">
        {dataFlows.map((flow, index) => (
          <div 
            key={index} 
            className="flex justify-between"
            style={{ 
              animationDelay: `${index * 0.2}s`,
              opacity: 0.7 + Math.random() * 0.3 
            }}
          >
            <span>{flow}</span>
            <span>{flow}</span>
          </div>
        ))}
      </div>
      
      {/* 名称输入对话框 - 移动端优化 */}
      {showNameInput && !showPauseMenu && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 p-4">
          <div className="p-6 bg-gray-900 rounded-lg border-2 border-green-500 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-green-500">确认身份</h2>
            <p className="mb-4 text-sm">你可以选择一个新名字，或使用默认名 "Claire"。</p>
            <input
              type="text"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              placeholder="输入新名字..."
              className="w-full p-3 bg-black border border-green-500 rounded text-green-400 mb-4 terminal-text"
              maxLength={10}
            />
            <button
              onClick={handleSetName}
              className="w-full p-3 bg-green-500 text-black font-bold rounded hover:bg-green-400 transition-colors"
            >
              确认
            </button>
          </div>
        </div>
      )}
      
      {/* 暂停菜单 - 移动端优化 */}
      {showPauseMenu && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/90 z-50 p-4">
          <div className="bg-gray-900 rounded-lg border-2 border-green-500 p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold text-green-400 mb-6 text-center">系统菜单</h2>
            
            <div className="space-y-4">
                <button
                  onClick={handleResume}
                  className="w-full p-4 bg-green-600 hover:bg-green-500 text-white rounded transition-colors"
                >
                  继续游戏
                </button>
                
                <button
                  onClick={handleRestartGame}
                  className="w-full p-4 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
                >
                  重新开始
                </button>
                
                <button
                  onClick={handleReturnToMainMenu}
                  className="w-full p-4 bg-gray-800 hover:bg-gray-700 text-white rounded transition-colors"
                >
                  返回主菜单
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
