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
  const [lives, setLives] = useState(4);
  const [gameTime, setGameTime] = useState(50);
  const [isHit, setIsHit] = useState(false);
  
  // 游戏场景尺寸 - 适配移动设备
  const gameWidth = 360;
  const gameHeight = 280;
  
  // 响应式游戏容器大小
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: gameWidth, height: gameHeight });
  
  // 游戏角色
  const [player, setPlayer] = useState<Player>({
    x: 24,
    y: gameHeight - 48,
    width: 26,
    height: 26,
    speed: 8
  });
  
  // 游戏循环引用
  const gameLoopRef = useRef<number | null>(null);
  const hitCooldownRef = useRef(Date.now() + 3000);
  const playerRef = useRef(player);
  const scannersRef = useRef<Scanner[]>([]);
  const livesRef = useRef(lives);
  const gameFinishedRef = useRef(false);
  const onSuccessRef = useRef(onSuccess);
  const onFailureRef = useRef(onFailure);

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
  
  // 标准难度：五条扫描束轮流激活，丰富路线变化但避免同时封路。
  const [scanners, setScanners] = useState<Scanner[]>([
    { x: 0, y: 105, width: gameWidth, height: 4, speed: 0.5, direction: "horizontal", reverse: false, visible: true },
    { x: 170, y: 0, width: 4, height: gameHeight, speed: 0.65, direction: "vertical", reverse: true, visible: false },
    { x: 0, y: 205, width: gameWidth, height: 4, speed: 0.55, direction: "horizontal", reverse: true, visible: false },
    { x: 82, y: 0, width: 4, height: gameHeight, speed: 0.58, direction: "vertical", reverse: false, visible: false },
    { x: 0, y: 54, width: gameWidth, height: 4, speed: 0.62, direction: "horizontal", reverse: false, visible: false }
  ]);

  useEffect(() => {
    playerRef.current = player;
  }, [player]);

  useEffect(() => {
    scannersRef.current = scanners;
  }, [scanners]);

  useEffect(() => {
    livesRef.current = lives;
  }, [lives]);

  useEffect(() => {
    onSuccessRef.current = onSuccess;
    onFailureRef.current = onFailure;
  }, [onSuccess, onFailure]);
  
  // 终点区域 - 保持在右上角
  const endpoint: Endpoint = {
    x: gameWidth - 66,
    y: 10,
    width: 54,
    height: 54
  };
  
  // 碰撞检测函数
  const checkCollision = useCallback((rect1: {x: number, y: number, width: number, height: number}, rect2: {x: number, y: number, width: number, height: number}) => {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
  }, []);
  
  // 使用单一帧循环，避免状态变化时叠加多个碰撞检测循环。
  useEffect(() => {
    if (!gameActive || gameOver) return;
    
    // 清除之前的游戏循环
    if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current);
    }
    
    // 更新游戏状态的函数
    const updateGame = () => {
      // 移动监控扫描光束
      const nextScanners = scannersRef.current.map(scanner => {
        let newScanner = {...scanner};
        
        if (scanner.direction === "horizontal") {
          // 横向光束沿纵轴扫描
          newScanner.y = scanner.reverse ? scanner.y - scanner.speed : scanner.y + scanner.speed;
          
          // 到达边界时反转方向
          if (newScanner.y <= 0 || newScanner.y + newScanner.height >= gameHeight) {
            newScanner.y = Math.max(0, Math.min(gameHeight - newScanner.height, newScanner.y));
            newScanner.reverse = !newScanner.reverse;
          }
        } else {
          // 纵向光束沿横轴扫描
          newScanner.x = scanner.reverse ? scanner.x - scanner.speed : scanner.x + scanner.speed;
          
          // 到达边界时反转方向
          if (newScanner.x <= 0 || newScanner.x + newScanner.width >= gameWidth) {
            newScanner.x = Math.max(0, Math.min(gameWidth - newScanner.width, newScanner.x));
            newScanner.reverse = !newScanner.reverse;
          }
        }
        
        return newScanner;
      });
      scannersRef.current = nextScanners;
      setScanners(nextScanners);
      
      // 检查终点到达
      if (!gameFinishedRef.current && checkCollision(playerRef.current, endpoint)) {
        gameFinishedRef.current = true;
        setSuccess(true);
        setGameOver(true);
        setGameActive(false);
        setTimeout(() => onSuccessRef.current(), 0);
        return;
      }
      
      // 检查扫描器碰撞
      const scannerHit = nextScanners.some(scanner => scanner.visible && checkCollision(playerRef.current, scanner));
      if (!gameFinishedRef.current && scannerHit && Date.now() >= hitCooldownRef.current) {
        hitCooldownRef.current = Date.now() + 4200;
        setIsHit(true);
        setTimeout(() => setIsHit(false), 260);
        const newLives = Math.max(0, livesRef.current - 1);
        livesRef.current = newLives;
        setLives(newLives);
        if (newLives === 0) {
          gameFinishedRef.current = true;
          setGameOver(true);
          setGameActive(false);
          setTimeout(() => onFailureRef.current(), 0);
          return;
        }
        
        // 重置玩家位置
        const resetPlayer = {
          x: 24,
          y: gameHeight - 48,
          width: 26,
          height: 26,
          speed: 8
        };
        playerRef.current = resetPlayer;
        setPlayer(resetPlayer);
      }
      
      // 继续游戏循环
      if (!gameFinishedRef.current) {
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
  }, [gameActive, gameOver, checkCollision]);
  
  // 游戏计时器
  useEffect(() => {
    if (!gameActive || gameOver) return;
    
    const timer = setInterval(() => {
      setGameTime(prevTime => {
        if (prevTime <= 1) {
          if (!gameFinishedRef.current) {
            gameFinishedRef.current = true;
            setGameOver(true);
            setGameActive(false);
            setTimeout(() => onFailureRef.current(), 0);
          }
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [gameActive, gameOver]);
  
  // 扫描线闪现效果 - 每2秒规律闪现
  useEffect(() => {
    if (!gameActive || gameOver) return;
    
    // 初始只激活一条扫描束，之后按顺序轮换。
    setScanners(prev => {
      const next = prev.map((scanner, index) => ({ ...scanner, visible: index === 0 }));
      scannersRef.current = next;
      return next;
    });
    
    let activeScannerIndex = 0;
    const flashInterval = setInterval(() => {
      setScanners(prevScanners => {
        activeScannerIndex = (activeScannerIndex + 1) % prevScanners.length;
        const next = prevScanners.map((scanner, index) => ({
          ...scanner,
          visible: index === activeScannerIndex
        }));
        scannersRef.current = next;
        return next;
      });
    }, 1900);
    
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
      newPlayer.x = Math.max(0, Math.min(gameWidth - prevPlayer.width, prevPlayer.x + dx * scaleX));
      newPlayer.y = Math.max(0, Math.min(gameHeight - prevPlayer.height, prevPlayer.y + dy * scaleY));
      
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
    setLives(4);
    livesRef.current = 4;
    setGameTime(50);
    setIsHit(false);
    hitCooldownRef.current = Date.now() + 3000;
    gameFinishedRef.current = false;
    
    // 重置玩家位置
    const resetPlayer = {
      x: 24,
      y: gameHeight - 48,
      width: 26,
      height: 26,
      speed: 8
    };
    playerRef.current = resetPlayer;
    setPlayer(resetPlayer);
  }, [gameHeight]);

  const movePlayer = useCallback((dx: number, dy: number) => {
    if (!gameActive) return;
    setPlayer(prev => ({
      ...prev,
      x: Math.max(0, Math.min(gameWidth - prev.width, prev.x + dx)),
      y: Math.max(0, Math.min(gameHeight - prev.height, prev.y + dy))
    }));
  }, [gameActive]);

  const routeProgress = Math.max(0, Math.min(100, Math.round(
    ((player.x - 24) / (endpoint.x - 24) * 55) +
    ((gameHeight - 48 - player.y) / (gameHeight - 48 - endpoint.y) * 45)
  )));
  
  // 组件卸载时清理所有资源
  useEffect(() => {
    return () => {
      // 清除游戏循环
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, []);
  
  const controlButtonClass = `h-12 w-12 rounded-xl border border-cyan-400/30 bg-slate-800/90 text-cyan-100 shadow-[0_0_18px_rgba(34,211,238,0.08)] transition active:scale-90 active:border-cyan-300 active:bg-cyan-500/20 ${!gameActive ? "cursor-not-allowed opacity-40" : "hover:border-cyan-300 hover:bg-cyan-500/10"}`;

  return (
    <div className="mx-auto w-full max-w-lg overflow-hidden rounded-2xl border border-cyan-400/30 bg-slate-950 text-white shadow-[0_24px_80px_rgba(0,0,0,0.55),0_0_40px_rgba(6,182,212,0.08)]">
      <header className="border-b border-white/10 bg-gradient-to-r from-slate-950 via-cyan-950/40 to-slate-950 px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="mb-1 flex items-center gap-2 text-[10px] font-semibold tracking-[0.24em] text-cyan-300/70">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-300" />
              ROUTE // 30F
            </div>
            <h3 className="truncate text-base font-bold tracking-wide text-white">隐匿配送通道</h3>
          </div>
          <button
            onClick={handleExit}
            aria-label="退出配送"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition hover:border-red-400/40 hover:bg-red-500/10 hover:text-red-300"
          >
            <i className="fa-solid fa-xmark" />
          </button>
        </div>
      </header>

      <div className="space-y-3 p-3 sm:p-4">
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-xl border border-red-400/15 bg-red-500/5 px-3 py-2">
            <p className="text-[9px] tracking-[0.18em] text-red-300/60">隐匿次数</p>
            <div className="mt-1 flex gap-1" aria-label={`剩余生命 ${lives}`}>
              {[0, 1, 2, 3].map(index => <i key={index} className={`fa-solid fa-shield-halved text-sm ${index < lives ? "text-red-400" : "text-slate-700"}`} />)}
            </div>
          </div>
          <div className="rounded-xl border border-amber-400/15 bg-amber-500/5 px-3 py-2 text-center">
            <p className="text-[9px] tracking-[0.18em] text-amber-300/60">窗口</p>
            <p className={`mt-0.5 font-mono text-lg font-bold ${gameTime <= 10 ? "animate-pulse text-red-400" : "text-amber-200"}`}>{gameTime}s</p>
          </div>
          <div className="rounded-xl border border-cyan-400/15 bg-cyan-500/5 px-3 py-2 text-right">
            <p className="text-[9px] tracking-[0.18em] text-cyan-300/60">路由进度</p>
            <p className="mt-0.5 font-mono text-lg font-bold text-cyan-200">{routeProgress}%</p>
          </div>
        </div>

        <div className="flex items-start gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-xs leading-relaxed text-slate-300">
          <i className="fa-solid fa-satellite-dish mt-0.5 text-red-400" />
          <p>将意识载体送往右上角接收节点。红色扫描束出现时保持距离。</p>
        </div>

        <div
          ref={gameContainerRef}
          className={`relative mx-auto overflow-hidden rounded-xl border bg-[#030712] transition ${isHit ? "border-red-400 shadow-[0_0_35px_rgba(248,113,113,0.4)]" : "border-cyan-400/25 shadow-inner shadow-black"}`}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{
            width: `${containerSize.width}px`,
            height: `${containerSize.height}px`,
            touchAction: "none",
            userSelect: "none"
          }}
        >
          <div
            className="absolute left-0 top-0 overflow-hidden"
            style={{
              width: gameWidth,
              height: gameHeight,
              transform: `scale(${containerSize.width / gameWidth})`,
              transformOrigin: "top left",
              backgroundImage: "linear-gradient(rgba(34,211,238,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,.06) 1px, transparent 1px), radial-gradient(circle at 82% 15%, rgba(34,197,94,.12), transparent 24%)",
              backgroundSize: "24px 24px, 24px 24px, 100% 100%"
            }}
          >
            <div className="absolute bottom-2 left-3 flex items-center gap-1.5 font-mono text-[9px] tracking-widest text-slate-600">
              <span className="h-1.5 w-1.5 rounded-full bg-slate-500" /> ORIGIN
            </div>

            <div
              className="absolute z-20 grid place-items-center rounded-md border border-cyan-100/70 bg-gradient-to-br from-cyan-300 to-blue-600 text-[12px] text-slate-950 shadow-[0_0_18px_rgba(34,211,238,.65)] transition-[box-shadow]"
              style={{ left: player.x, top: player.y, width: player.width, height: player.height }}
            >
              <i className="fa-solid fa-box" />
            </div>

            {scanners.map((scanner, index) => scanner.visible && (
              <div
                key={index}
                className="absolute z-10 bg-red-400/80"
                style={{
                  left: scanner.x,
                  top: scanner.y,
                  width: scanner.width,
                  height: scanner.height,
                  boxShadow: scanner.direction === "horizontal"
                    ? "0 0 5px #fb7185, 0 0 16px #ef4444"
                    : "0 0 5px #fb7185, 0 0 16px #ef4444"
                }}
              />
            ))}

            <div
              className="absolute z-10 grid place-items-center rounded-lg border border-emerald-300 bg-emerald-400/10 text-center shadow-[0_0_24px_rgba(52,211,153,.35)]"
              style={{ left: endpoint.x, top: endpoint.y, width: endpoint.width, height: endpoint.height }}
            >
              <i className="fa-solid fa-server text-sm text-emerald-300" />
              <span className="font-mono text-[7px] tracking-wider text-emerald-200">30F</span>
            </div>

            {gameOver && (
              <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-slate-950/90 px-8 text-center backdrop-blur-sm">
                <div className={`mb-3 grid h-14 w-14 place-items-center rounded-full border ${success ? "border-emerald-300/40 bg-emerald-400/10 text-emerald-300" : "border-red-300/40 bg-red-400/10 text-red-300"}`}>
                  <i className={`fa-solid ${success ? "fa-check" : "fa-shield-virus"} text-xl`} />
                </div>
                <h2 className={`text-xl font-bold ${success ? "text-emerald-300" : "text-red-300"}`}>{success ? "载体已送达" : "配送链路中断"}</h2>
                <p className="mt-2 text-xs text-slate-400">{success ? `剩余窗口 ${gameTime} 秒` : "CORE 已识别异常信号"}</p>
                {!success && <button onClick={resetGame} className="mt-5 rounded-lg border border-cyan-300/30 bg-cyan-400/10 px-5 py-2 text-xs font-semibold text-cyan-200 transition hover:bg-cyan-400/20">重新建立链路</button>}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-slate-900/70 p-3">
          <div className="max-w-[10rem] text-[10px] leading-relaxed text-slate-500 sm:max-w-none">
            <p className="text-slate-300"><span className="text-cyan-300">桌面端</span> 方向键移动</p>
            <p><span className="text-cyan-300">移动端</span> 拖动画布或使用方向盘</p>
          </div>
          <div className="grid shrink-0 grid-cols-3 grid-rows-3 gap-1">
            <span />
            <button aria-label="向上移动" onClick={() => movePlayer(0, -25)} disabled={!gameActive} className={controlButtonClass}><i className="fa-solid fa-chevron-up" /></button>
            <span />
            <button aria-label="向左移动" onClick={() => movePlayer(-25, 0)} disabled={!gameActive} className={controlButtonClass}><i className="fa-solid fa-chevron-left" /></button>
            <div className="grid h-12 w-12 place-items-center rounded-xl border border-white/5 bg-black/20"><span className="h-2 w-2 rounded-full bg-cyan-300/40" /></div>
            <button aria-label="向右移动" onClick={() => movePlayer(25, 0)} disabled={!gameActive} className={controlButtonClass}><i className="fa-solid fa-chevron-right" /></button>
            <span />
            <button aria-label="向下移动" onClick={() => movePlayer(0, 25)} disabled={!gameActive} className={controlButtonClass}><i className="fa-solid fa-chevron-down" /></button>
            <span />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MonitoringEscapeGame;
