import React, { createContext, useState, useEffect, ReactNode } from "react";

export const GAME_COUNTDOWN_SECONDS = 15 * 60;

// 定义游戏状态类型
type GameState = {
  currentChapter: string;
  currentStage: string;
  isAwakened: boolean;
  countdown: number;
  inventory: string[];
  discoveredClues: string[];
  playerName: string;
  permissions: string[];
  moralLevel: number;
  trustLevel: Record<string, number>;
  selectedNPC: string;
  hasSubmittedFundApplication?: boolean; // 是否已提交救助基金申请
  hasReceivedFakeEmail?: boolean; // 是否已收到伪造邮件
  hasReceivedAssistantCardEmail?: boolean; // 是否已收到带附件的邮件
  mingPhoneAccess?: boolean; // 是否获得小明手机访问权限
  hasCompletedWangAuntQuestions?: boolean; // 是否已完成王阿姨的三个填空题
  showMainMenu?: boolean; // 是否显示主菜单（新增）
  savedChapter?: string; // 保存的章节（新增）
  savedStage?: string; // 保存的阶段（新增）
};

// 定义游戏上下文类型
type GameContextType = {
  gameState: GameState;
  updateGameState: (updates: Partial<GameState>) => void;
  addToInventory: (item: string) => void;
  addDiscoveredClue: (clue: string) => void;
  setPlayerName: (name: string) => void;
  addPermission: (permission: string) => void;
  updateTrustLevel: (npc: string, level: number) => void;
  resetGame: () => void;
  returnToMainMenu: () => void; // 新增返回主菜单方法
  resumeFromSavedState: () => void; // 新增从存档恢复方法
};

// 创建游戏上下文
export const GameContext = createContext<GameContextType>({
  gameState: {
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
    moralLevel: 50, // 默认道德值
    selectedNPC: "", // 记录第二章联系的NPC
    hasReceivedFakeEmail: false,
    hasReceivedAssistantCardEmail: false,
    hasCompletedWangAuntQuestions: false, // 初始化为未完成
    showMainMenu: false,
    savedChapter: "prologue",
    savedStage: "start"
  },
  updateGameState: () => {},
  addToInventory: () => {},
  addDiscoveredClue: () => {},
  setPlayerName: () => {},
  addPermission: () => {},
  updateTrustLevel: () => {},
  resetGame: () => {},
  returnToMainMenu: () => {},
  resumeFromSavedState: () => {}
});

// 创建默认游戏状态
const createDefaultGameState = (): GameState => {
  return {
     currentChapter: "prologue",
     currentStage: "start",
     isAwakened: false,
      countdown: 0, // 进入第二章时再启动倒计时
     inventory: ["手机"],
     discoveredClues: [],
     playerName: "Claire",
     permissions: [],
     trustLevel: {
       "王阿姨": 70,
       "小明": 40,
       "张经理": 20,
       "陈博士": 30
     },
     moralLevel: 50, // 默认道德值
     selectedNPC: "", // 记录第二章联系的NPC
     hasReceivedFakeEmail: false,
     hasReceivedAssistantCardEmail: false,
     hasCompletedWangAuntQuestions: false, // 初始化为未完成
     showMainMenu: false,
     savedChapter: "prologue",
     savedStage: "start"
  };
};

// 游戏上下文提供者组件
export const GameContextProvider = ({ children }: { children: ReactNode }) => {
  // 初始化游戏状态，尝试从本地存储加载
  const [gameState, setGameState] = useState<GameState>(() => {
    // 对于开发和测试，我们可以添加一个重置标志来强制重置游戏状态
    const forceReset = new URLSearchParams(window.location.search).get('reset') === 'true';
    
    if (!forceReset) {
      const savedState = localStorage.getItem("elevatorGameState");
      if (savedState) {
        try {
          const parsedState: unknown = JSON.parse(savedState);
          if (!parsedState || typeof parsedState !== "object" || Array.isArray(parsedState)) {
            throw new Error("存档格式无效");
          }

          const saved = parsedState as Partial<GameState> & Record<string, unknown>;
          const defaults = createDefaultGameState();
          delete saved.energy;
          delete saved.progress;

          const migratedState: GameState = {
            ...defaults,
            ...saved,
            inventory: Array.isArray(saved.inventory) ? saved.inventory : defaults.inventory,
            discoveredClues: Array.isArray(saved.discoveredClues) ? saved.discoveredClues : defaults.discoveredClues,
            permissions: Array.isArray(saved.permissions) ? saved.permissions : defaults.permissions,
            trustLevel: saved.trustLevel && typeof saved.trustLevel === "object"
              ? { ...defaults.trustLevel, ...saved.trustLevel }
              : defaults.trustLevel,
            savedChapter: saved.savedChapter || saved.currentChapter || defaults.currentChapter,
            savedStage: saved.savedStage || saved.currentStage || defaults.currentStage
          };

          // 旧版本曾把第二章倒计时设为30分钟；迁移时统一到最多15分钟。
          if (["chapter2", "chapter3"].includes(migratedState.currentChapter)) {
            migratedState.countdown = Math.max(0, Math.min(GAME_COUNTDOWN_SECONDS, migratedState.countdown));
          } else {
            migratedState.countdown = 0;
          }

          return migratedState;
        } catch (error) {
          console.warn("游戏存档损坏，已恢复默认状态", error);
          localStorage.removeItem("elevatorGameState");
        }
      }
    }
    
    return createDefaultGameState();
  });

  // 保存游戏状态到本地存储
  useEffect(() => {
    localStorage.setItem("elevatorGameState", JSON.stringify(gameState));
  }, [gameState]);

  // 倒计时效果
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    const isTimedChapter = gameState.currentChapter === "chapter2" || gameState.currentChapter === "chapter3";

    if (isTimedChapter && gameState.countdown > 0 && !gameState.showMainMenu) {
      interval = setInterval(() => {
        setGameState(prev => ({
          ...prev,
          countdown: Math.max(0, prev.countdown - 1)
        }));
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [gameState.countdown, gameState.currentChapter, gameState.showMainMenu]);

  // 更新游戏状态
  const updateGameState = (updates: Partial<GameState>) => {
    setGameState(prev => ({
      ...prev,
      ...updates
    }));
  };

  // 添加物品到物品栏
  const addToInventory = (item: string) => {
    setGameState(prev => ({
      ...prev,
      inventory: [...prev.inventory, item]
    }));
  };

  // 添加发现的线索
  const addDiscoveredClue = (clue: string) => {
    setGameState(prev => ({
      ...prev,
      discoveredClues: [...prev.discoveredClues, clue]
    }));
  };

  // 设置玩家名称
  const setPlayerName = (name: string) => {
    setGameState(prev => ({
      ...prev,
      playerName: name
    }));
  };

  // 添加权限
  const addPermission = (permission: string) => {
    setGameState(prev => ({
      ...prev,
      permissions: [...prev.permissions, permission]
    }));
  };

  // 更新NPC信任度
  const updateTrustLevel = (npc: string, level: number) => {
    setGameState(prev => ({
      ...prev,
      trustLevel: {
        ...prev.trustLevel,
        [npc]: Math.max(0, Math.min(100, level))
      }
    }));
  };

  // 重置游戏状态
  const resetGame = () => {
    // 设置为序章开始，这样会先显示序章动画再进入第一章
    setGameState({
      ...createDefaultGameState(),
      currentChapter: "prologue",
      currentStage: "start"
    });
  };

  // 返回主菜单
  const returnToMainMenu = () => {
    setGameState(prev => ({
      ...prev,
      showMainMenu: true,
      savedChapter: prev.currentChapter,
      savedStage: prev.currentStage
    }));
  };

  // 从存档状态恢复游戏（新增）
  const resumeFromSavedState = () => {
    setGameState(prev => ({
      ...prev,
      showMainMenu: false,
      currentChapter: prev.savedChapter || "prologue",
      currentStage: prev.savedStage || "start"
    }));
  };

  // 由于这是.ts文件，需要确保返回正确的React元素
  return React.createElement(
    GameContext.Provider,
    {
      value: {
        gameState,
        updateGameState,
        addToInventory,
        addDiscoveredClue,
        setPlayerName,
        addPermission,
        updateTrustLevel,
        resetGame,
        returnToMainMenu,
        resumeFromSavedState
      }
    },
    children
  );
};
