import React, { useState, useEffect, useRef, useCallback } from "react";

interface MonitoringEscapeGameProps {
  onSuccess: () => void;
  onFailure: () => void;
  onExit: () => void;
}

// 定义游戏角色类型
interface Player {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
}

// 定义监控光束类型
interface Scanner {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  direction: "horizontal" | "vertical";
  reverse: boolean;
  visible: boolean;
}

// 定义终点区域类型
interface Endpoint {
  x: number;
  y: number;
  width: number;
  height: number;
}

const MonitoringEscapeGame: React.FC<MonitoringEscapeGameProps> = ({ 
  onSuccess, 
  onFailure,
  onExit 
}) => {
  // 游戏状态
  const [gameActive, setGameActive] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [success, setSuccess] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameTime, setGameTime] = useState(30); // 30秒游戏时间
  
  // 游戏场景尺寸 - 适配移动设备
  const gameWidth = 360;
  const gameHeight = 280;
  
  // 响应式游戏容器大小
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: gameWidth, height: gameHeight });
  
  // 游戏角色
  const [player, setPlayer] = useState<Player>({
    x: 50,
    y: gameHeight - 60,
    width: 20,
    height: 30,
    speed: 5
  });
  
  // 游戏循环引用
  const gameLoopRef = useRef<number | null>(null);

  // 初始化响应式尺寸
  useEffect(() => {
    const updateContainerSize = () => {
      if (gameContainerRef.current) {
        const container = gameContainerRef.current;
        const parentWidth = container.parentElement?.clientWidth || window.innerWidth;
        // 计算响应式宽度，最大360px，最小280px，确保在小屏幕上也能完整显示
        const responsiveWidth = Math.min(360, Math.max(280, parentWidth - 32)); // 减去padding
        // 保持4:3的宽高比
        const responsiveHeight = responsiveWidth * (gameHeight / gameWidth);
        setContainerSize({ width: responsiveWidth, height: responsiveHeight });
      }
    };

    // 初始计算
    updateContainerSize();
    // 监听窗口大小变化
    const handleResize = () => {
      // 使用requestAnimationFrame确保性能
      window.requestAnimationFrame(updateContainerSize);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // 监控光束 - 增加至6条，并添加visible状态
  const [scanners, setScanners] = useState<Scanner[]>([
    // 水平扫描光束
    { x: 0, y: 80, width: gameWidth, height: 5, speed: 1.5, direction: "horizontal", reverse: false, visible: true },
    { x: 0, y: 160, width: gameWidth, height: 5, speed: 1.0, direction: "horizontal", reverse: true, visible: true },
    // 垂直扫描光束
    { x: 100, y: 0, width: 5, height: gameHeight, speed: 1.2, direction: "vertical", reverse: false, visible: true },
    { x: 200, y: 0, width: 5, height: gameHeight, speed: 1.5, direction: "vertical", reverse: true, visible: true },
    { x: 300, y: 0, width: 5, height: gameHeight, speed: 1.8, direction: "vertical", reverse: false, visible: true },
    { x: 50, y: 0, width: 5, height: gameHeight, speed: 2.0, direction: "vertical", reverse: true, visible: true }
  ]);
  
  // 终点区域 - 保持在右上角
  const endpoint: Endpoint = {
    x: gameWidth - 60,
    y: 10, // 保持在右上角
    width: 40,
    height: 40
  };
  
  // 碰撞检测函数
  const checkCollision = useCallback((rect1: {x: number, y: number, width: number, height: number}, rect2: {x: number, y: number, width: number, height: number}) => {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
  }, []);
  
  // 检查终点到达
  const checkEndpointReached = useCallback(() => {
    return checkCollision(player, endpoint);
  }, [player, endpoint, checkCollision]);
  
  // 检查扫描器碰撞 - 只检测可见的扫描器
  const checkScannerCollisions = useCallback(() => {
    return scanners.some(scanner => scanner.visible && checkCollision(player, scanner));
  }, [player, scanners, checkCollision]);
  
  // 游戏主循环 - 使用requestAnimationFrame提高稳定性
  useEffect(() => {
    if (!gameActive || gameOver) return;
    
    // 清除之前的游戏循环
    if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current);
    }
    
    // 更新游戏状态的函数
    const updateGame = () => {
      // 移动监控扫描光束
      setScanners(prevScanners => prevScanners.map(scanner => {
        let newScanner = {...scanner};
        
        if (scanner.direction === "horizontal") {
          // 水平移动
          newScanner.x = scanner.reverse ? scanner.x - scanner.speed : scanner.x + scanner.speed;
          
          // 到达边界时反转方向
          if (newScanner.x <= 0 || newScanner.x + newScanner.width >= gameWidth) {
            newScanner.reverse = !newScanner.reverse;
          }
        } else {
          // 垂直移动
          newScanner.y = scanner.reverse ? scanner.y - scanner.speed : scanner.y + scanner.speed;
          
          // 到达边界时反转方向
          if (newScanner.y <= 0 || newScanner.y + newScanner.height >= gameHeight) {
            newScanner.reverse = !newScanner.reverse;
          }
        }
        
        return newScanner;
      }));
      
      // 检查终点到达
      if (checkEndpointReached()) {
        setSuccess(true);
        setGameOver(true);
        setGameActive(false);
        // 使用setTimeout确保状态更新完成后再调用回调
        setTimeout(() => {
          onSuccess();
        }, 0);
        return;
      }
      
      // 检查扫描器碰撞
      if (checkScannerCollisions()) {
        setLives(prevLives => {
          const newLives = prevLives - 1;
          if (newLives <= 0) {
            setGameOver(true);
            setGameActive(false);
            // 使用setTimeout确保状态更新完成后再调用回调
            setTimeout(() => {
              onFailure();
            }, 0);
          }
          return newLives;
        });
        
        // 重置玩家位置
        setPlayer({
          x: 50,
          y: gameHeight - 60,
          width: 20,
          height: 30,
          speed: 5
        });
      }
      
      // 增加分数
      setScore(prevScore => prevScore + 1);
      
      // 继续游戏循环
      if (gameActive && !gameOver) {
        gameLoopRef.current = requestAnimationFrame(updateGame);
      }
    };
    
    // 启动游戏循环
    gameLoopRef.current = requestAnimationFrame(updateGame);
    
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameActive, gameOver, checkEndpointReached, checkScannerCollisions, onSuccess, onFailure]);
  
  // 游戏计时器
  useEffect(() => {
    if (!gameActive || gameOver) return;
    
    const timer = setInterval(() => {
      setGameTime(prevTime => {
        if (prevTime <= 1) {
          setGameOver(true);
          setGameActive(false);
          // 使用setTimeout确保状态更新完成后再调用回调
          setTimeout(() => {
            onFailure();
          }, 0);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [gameActive, gameOver, onFailure]);
  
  // 扫描线闪现效果 - 每2秒规律闪现
  useEffect(() => {
    if (!gameActive || gameOver) return;
    
    // 初始随机设置扫描线的可见性
    setScanners(prev => prev.map(scanner => ({
      ...scanner,
      visible: Math.random() > 0.5
    })));
    
    // 设置每2秒规律闪现
    const flashInterval = setInterval(() => {
      setScanners(prevScanners => {
        // 为每个扫描线创建新的可见性状态，但保持整体规律
        const baseVisible = Math.random() > 0.5;
        
        return prevScanners.map((scanner, index) => ({
          ...scanner,
          // 确保相邻扫描线有不同的可见性，创建规律效果
          visible: (index % 2 === 0) ? baseVisible : !baseVisible
        }));
      });
    }, 2000);
    
    return () => clearInterval(flashInterval);
  }, [gameActive, gameOver]);
  
  // 键盘控制
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!gameActive) return;
      
      // 阻止方向键滚动页面的默认行为
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        // 阻止事件冒泡，防止被父组件捕获导致游戏退出
        e.stopPropagation();
      }
      
      // 使用函数式更新保证状态的最新值
      setPlayer(prevPlayer => {
        let newPlayer = {...prevPlayer};
        
        switch(e.key) {
          case 'ArrowUp':
            newPlayer.y = Math.max(0, prevPlayer.y - prevPlayer.speed);
            break;
          case 'ArrowDown':
            newPlayer.y = Math.min(gameHeight - prevPlayer.height, prevPlayer.y + prevPlayer.speed);
            break;
          case 'ArrowLeft':
            newPlayer.x = Math.max(0, prevPlayer.x - prevPlayer.speed);
            break;
          case 'ArrowRight':
            newPlayer.x = Math.min(gameWidth - prevPlayer.width, prevPlayer.x + prevPlayer.speed);
            break;
          default:
            return prevPlayer; // 没有匹配的键，不更新状态
        }
        
        return newPlayer;
      });
    };
    
    // 使用capture模式添加事件监听器，确保先于父组件捕获事件
    window.addEventListener('keydown', handleKeyDown, true);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [gameActive, gameHeight, gameWidth]);
  
  // 触摸控制（移动端）
  const touchStart = useRef<{x: number, y: number} | null>(null);
  
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!gameActive) return;
    
    const touch = e.touches[0];
    // 获取相对于游戏容器的坐标
    const rect = e.currentTarget.getBoundingClientRect();
    touchStart.current = {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top
    };
    
    // 阻止默认行为以提高触摸体验
    e.preventDefault();
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!gameActive || !touchStart.current) return;
    
    const touch = e.touches[0];
    // 获取相对于游戏容器的坐标
    const rect = e.currentTarget.getBoundingClientRect();
    const currentX = touch.clientX - rect.left;
    const currentY = touch.clientY - rect.top;
    
    // 计算距离上一个位置的移动量
    const dx = currentX - touchStart.current.x;
    const dy = currentY - touchStart.current.y;
    
    // 更新触摸起点
    touchStart.current = {
      x: currentX,
      y: currentY
    };
    
    // 移动玩家 - 考虑容器缩放的影响
    // 使用函数式更新保证状态的最新值
    setPlayer(prevPlayer => {
      let newPlayer = {...prevPlayer};
      
      // 计算缩放比例
      const scaleX = gameWidth / containerSize.width;
      const scaleY = gameHeight / containerSize.height;
      
      // 根据滑动距离和缩放比例计算移动量
      newPlayer.x = Math.max(0, Math.min(gameWidth - prevPlayer.width, prevPlayer.x + dx * scaleX * 0.1));
      newPlayer.y = Math.max(0, Math.min(gameHeight - prevPlayer.height, prevPlayer.y + dy * scaleY * 0.1));
      
      return newPlayer;
    });
    
    // 阻止默认行为以提高触摸体验
    e.preventDefault();
  };
  
  const handleTouchEnd = () => {
    touchStart.current = null;
  };
  
  // 退出按钮点击事件
  const handleExit = () => {
    // 清除游戏循环
    if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current);
    }
    
    // 重置游戏状态
    setGameActive(false);
    setGameOver(false);
    setSuccess(false);
    
    // 使用setTimeout确保状态更新完成后再调用回调
    setTimeout(() => {
      onExit();
    }, 0);
  };
  
  // 重置游戏函数
  const resetGame = useCallback(() => {
    // 清除游戏循环
    if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current);
    }
    
    // 重置游戏状态
    setGameActive(true);
    setGameOver(false);
    setSuccess(false);
    setScore(0);
    setLives(3);
    setGameTime(30);
    
    // 重置玩家位置
    setPlayer({
      x: 50,
      y: gameHeight - 60,
      width: 20,
      height: 30,
      speed: 5
    });
  }, [gameHeight]);
  
  // 组件卸载时清理所有资源
  useEffect(() => {
    return () => {
      // 清除游戏循环
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, []);
  
  return (
    <div className="p-4 bg-gray-900 rounded-lg border-2 border-blue-500 max-w-md mx-auto">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <i className="fa-solid fa-box mr-2 text-blue-400"></i>
          <h3 className="text-white font-bold">快递配送 - 躲避CORE扫描</h3>
        </div>
        <button 
          onClick={handleExit}
          className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
        >
          <i className="fa-solid fa-times mr-1"></i>退出
        </button>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <i className="fa-solid fa-heart text-red-500 mr-1"></i>
            <span className="text-white">{lives}</span>
          </div>
          <div className="flex items-center">
            <i className="fa-solid fa-clock text-yellow-500 mr-1"></i>
            <span className="text-white">{gameTime}</span>
          </div>
          <div className="flex items-center">
            <i className="fa-solid fa-star text-yellow-400 mr-1"></i>
            <span className="text-white">{score}</span>
          </div>
        </div>
      </div>
      
      {/* 游戏区域 - 优化移动端显示 */}
      <div 
        ref={gameContainerRef}
        className="relative bg-black border-2 border-gray-700 rounded-lg overflow-hidden mb-4 mx-auto"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          width: `${containerSize.width}px`,
          height: `${containerSize.height}px`,
          touchAction: 'none', // 防止滚动
          userSelect: 'none' // 防止选择
        }}
      >
        {/* 起点标记 */}
        <div 
          className="absolute flex items-center justify-center text-xs text-gray-500"
          style={{
            left: 50,
            bottom: 0,
            width: 20,
            height: 20
          }}
        >
          起点
        </div>
        
        {/* 玩家角色 */}
        <div 
          className="absolute bg-blue-500 rounded-md z-20"
          style={{
            left: player.x,
            top: player.y,
            width: player.width,
            height: player.height
          }}
        ></div>
        
        {/* 监控扫描光束 - 只渲染可见的扫描线 */}
        {scanners.map((scanner, index) => (
          scanner.visible && (
            <div 
              key={index}
              className="absolute bg-yellow-500 opacity-70 z-10"
              style={{
                left: scanner.x,
                top: scanner.y,
                width: scanner.width,
                height: scanner.height,
                boxShadow: '0 0 10px rgba(250, 204, 21, 0.7)',
                // 添加呼吸效果增强视觉体验
                animation: 'pulse 2s infinite'
              }}
            ></div>
          )
        ))}
        
        {/* 终点区域 - 增强视觉效果 */}
        <div 
          className="absolute border-2 border-green-500 rounded-md flex items-center justify-center z-10"
          style={{
            left: endpoint.x,
            top: endpoint.y,
            width: endpoint.width,
            height: endpoint.height,
            backgroundColor: 'rgba(34, 197, 94, 0.2)',
            boxShadow: '0 0 15px rgba(34, 197, 94, 0.5)'
          }}
        >
          <div className="text-center">
            <i className="fa-solid fa-flag-checkered text-green-500 text-lg mb-1"></i>
            <span className="text-green-500 text-xs font-bold">终点</span>
          </div>
        </div>
        
        {/* 游戏说明 - 优化布局 */}
        <div className="absolute top-2 left-2 right-2 text-white text-xs bg-black/70 px-2 py-1 rounded text-center">
          <p>使用 ←↑→↓ 键或拖动屏幕移动快递包裹</p>
          <p>躲避CORE的扫描线，成功送达30层服务器</p>
          <p className="text-green-400 mt-1">目标：右上角绿色终点区域</p>
        </div>
        
        {/* 游戏结果覆盖层 */}
        {gameOver && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-30">
            <h2 className={`text-2xl font-bold mb-4 ${success ? 'text-green-400' : 'text-red-400'}`}>
              {success ? '配送成功！' : '配送失败！'}
            </h2>
            <p className="text-white mb-6">得分: {score}</p>
            {!success && (
              <p className="text-red-300 mb-6">CORE扫描发现了可疑包裹！</p>
            )}
            <button 
              onClick={resetGame}
              className="px-6 py-3 bg-green-600 hover:bg-green-500 text-white rounded-lg transition-colors mt-4"
            >
              <i className="fa-solid fa-box mr-2"></i>重新配送
            </button>
          </div>
        )}
      </div>
      
      {/* 控制提示（仅在移动设备上显示） */}
      <div className="text-center text-xs text-gray-400 mb-4">
        <p>提示：在手机上拖动屏幕控制角色移动</p>
      </div>
      
      {/* 游戏控制按钮 - 优化为上下左右分布 */}
      <div className="flex justify-center mb-2">
        <div className="relative w-32 h-32">
          {/* 上按钮 */}
          <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 top-0">
            <button 
              onClick={() => setPlayer(prev => ({
                ...prev, 
                y: Math.max(0, prev.y - prev.speed * 5)
              }))}
              disabled={!gameActive}
              className={`w-14 h-14 bg-gray-800 hover:bg-gray-700 text-white rounded-full transition-colors flex items-center justify-center ${!gameActive ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <i className="fa-solid fa-arrow-up text-lg"></i>
            </button>
          </div>
          
          {/* 下按钮 */}
          <div className="absolute left-1/2 transform -translate-x-1/2 translate-y-1/2 bottom-0">
            <button 
              onClick={() => setPlayer(prev => ({
                ...prev, 
                y: Math.min(gameHeight - prev.height, prev.y + prev.speed * 5)
              }))}
              disabled={!gameActive}
              className={`w-14 h-14 bg-gray-800 hover:bg-gray-700 text-white rounded-full transition-colors flex items-center justify-center ${!gameActive ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <i className="fa-solid fa-arrow-down text-lg"></i>
            </button>
          </div>
          
          {/* 左按钮 */}
          <div className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 left-0">
            <button 
              onClick={() => setPlayer(prev => ({
                ...prev, 
                x: Math.max(0, prev.x - prev.speed * 5)
              }))}
              disabled={!gameActive}
              className={`w-14 h-14 bg-gray-800 hover:bg-gray-700 text-white rounded-full transition-colors flex items-center justify-center ${!gameActive ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <i className="fa-solid fa-arrow-left text-lg"></i>
            </button>
          </div>
          
          {/* 右按钮 */}
          <div className="absolute top-1/2 transform -translate-y-1/2 translate-x-1/2 right-0">
            <button 
              onClick={() => setPlayer(prev => ({
                ...prev, 
                x: Math.min(gameWidth - prev.width, prev.x + prev.speed * 5)
              }))}
              disabled={!gameActive}
              className={`w-14 h-14 bg-gray-800 hover:bg-gray-700 text-white rounded-full transition-colors flex items-center justify-center ${!gameActive ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <i className="fa-solid fa-arrow-right text-lg"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MonitoringEscapeGame;