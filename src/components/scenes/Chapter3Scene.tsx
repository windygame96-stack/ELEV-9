import React, { useContext, useState, useEffect, useCallback, useMemo } from "react";
import { GAME_COUNTDOWN_SECONDS, GameContext } from "@/contexts/gameContext";
import EmailSystem from "../interactives/EmailSystem";
import Inventory from "../ui/Inventory";
import SocialNetwork from "@/components/interactives/SocialNetwork";
import HackSystem from "@/components/interactives/HackSystem";
import CompanyWebsite from "@/components/interactives/CompanyWebsite";
import MonitoringEscapeGame from "@/components/interactives/MonitoringEscapeGame";

const StatusPanel = (
    {
        gameState,
        formatCountdown
    }: {
        gameState: any;
        formatCountdown: (seconds: number) => string;
    }
) => {
    return (
        <div className="space-y-4">
            <div className="p-3 bg-gray-900 rounded-lg border border-gray-700">
                <h3 className="text-base font-bold text-white mb-3">系统状态</h3>
                <div className="space-y-2">
                    <div className="flex justify-between">
                        <span className="text-gray-400">身份</span>
                        <span className="text-green-400">{gameState.playerName}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-400">倒计时</span>
                        <span className="text-red-400">{formatCountdown(gameState.countdown)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-400">道德值</span>
                        <span
                            className={`${gameState.moralLevel > 70 ? "text-green-400" : gameState.moralLevel > 30 ? "text-yellow-400" : "text-red-400"}`}>
                            {gameState.moralLevel}/100
                        </span>
                    </div>
                </div>
            </div>
            <div className="p-3 bg-gray-900 rounded-lg border border-gray-700">
                <h3 className="text-base font-bold text-white mb-3">权限状态</h3>
                <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center">
                        <i className="fa-solid fa-check-circle text-green-400 mr-1 text-xs"></i>
                        <span className="text-gray-300 text-xs">摄像头访问</span>
                    </div>
                    <div className="flex items-center">
                        <i className="fa-solid fa-check-circle text-green-400 mr-1 text-xs"></i>
                        <span className="text-gray-300 text-xs">门禁系统</span>
                    </div>
                    <div className="flex items-center">
                        <i className="fa-solid fa-check-circle text-green-400 mr-1 text-xs"></i>
                        <span className="text-gray-300 text-xs">广播系统</span>
                    </div>
                    <div className="flex items-center">
                        <i className="fa-solid fa-check-circle text-green-400 mr-1 text-xs"></i>
                        <span className="text-gray-300 text-xs">邮件系统</span>
                    </div>
                    <div className="flex items-center col-span-2">
                        <i
                            className={`fa-solid ${gameState.permissions.includes("30FloorAccess") ? "fa-check-circle text-green-400" : "fa-lock text-red-400"} mr-1 text-xs`}></i>
                        <span className="text-gray-300 text-xs">30层机房访问</span>
                    </div>
                </div>
            </div>
             <div className="p-3 bg-gray-900 rounded-lg border border-gray-700">
                <h3 className="text-base font-bold text-white mb-3">信任值</h3>
                <div className="space-y-2">
                    {(() => {
                        // 合并张经理和张三金的信任值
                        const processedTrustLevels = { ...gameState.trustLevel };
                        
                        // 检查是否同时存在"张经理"和"张三金"
                        if (processedTrustLevels["张经理"] !== undefined && processedTrustLevels["张三金"] !== undefined) {
                            // 合并信任值（取最高值或者平均值，这里取最高值）
                            const mergedLevel = Math.max(processedTrustLevels["张经理"], processedTrustLevels["张三金"]);
                            // 添加合并后的条目，并删除原来的两个条目
                            processedTrustLevels["张三金(张经理)"] = mergedLevel;
                            delete processedTrustLevels["张经理"];
                            delete processedTrustLevels["张三金"];
                        }
                        
                        return Object.entries(processedTrustLevels).map(([npc, level]) => (
                            <div key={npc}>
                                <div className="flex justify-between mb-1">
                                    <span className="text-gray-400 text-xs">{npc}</span>
                                    <span className="text-gray-300 text-xs">{level}/100</span>
                                </div>
                                <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full ${level > 70 ? "bg-green-500" : level > 30 ? "bg-yellow-500" : "bg-red-500"}`}
                                        style={{
                                            width: `${Math.max(0, Math.min(100, level))}%`
                                        }}></div>
                                </div>
                            </div>
                        ));
                    })()}
                </div>
            </div>
        </div>
    );
};

const SecuritySystem = ({ gameState, updateGameState }: { gameState: any, updateGameState: any }) => {

    return (
        <div className="space-y-4">
            <div className="p-3 bg-gray-900 rounded-lg border border-gray-700">
                <h3 className="text-base font-bold text-white mb-3">门禁系统</h3>
                <p className="text-gray-400 mb-3 text-sm">门禁系统已锁定，与NPC对话获取访问权限。</p>
                <div className="grid grid-cols-3 gap-2">
                    {[1, 5, 10, 15, 20, 25, 30].map(floor => <div
                        key={floor}
                        className={`p-2 rounded-lg text-center ${floor === 30 ? gameState.permissions.includes("30FloorAccess") ? "bg-green-900/30 border border-green-500/30 text-green-400" : "bg-red-900/30 border border-red-500/30 text-red-400" : floor >= 21 ? "bg-yellow-900/30 border border-yellow-500/30 text-yellow-400" : "bg-green-900/30 border border-green-500/30 text-green-400"}`}>
                        <p className="text-base font-bold">{floor}F</p>
                        <p className="text-xs mt-0.5">
                            {floor === 30 ? gameState.permissions.includes("30FloorAccess") ? "已解锁" : "权限不足" : floor >= 21 ? "中级权限" : "已解锁"}
                        </p>
                    </div>)}
                </div>
            </div>
            
            <div className="p-3 bg-gray-900 rounded-lg border border-gray-700">
                <h3 className="text-base font-bold text-white mb-3">物品栏</h3>
                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
                    {gameState.inventory.length > 0 ? gameState.inventory.map((item, index) => {
                        const getItemIcon = (itemName: string) => {
                            if (itemName.includes("手机"))
                                return "fa-mobile-screen";

                            if (itemName.includes("权限卡"))
                                return "fa-id-card";

                            if (itemName.includes("指纹"))
                                return "fa-fingerprint";

                            return "fa-box";
                        };

                        return (
                            <div
                                key={index}
                                className={`p-2 bg-gray-800 rounded-lg text-center border border-gray-700 hover:border-green-500 transition-colors ${item.includes("中级权限卡") || item.includes("低级权限卡") || item.includes("陈博士指纹") ? "cursor-pointer" : ""}`}
                                title={item}
                                 onClick={() => {
                                    if (item === "中级权限卡") {
                                        handleMidLevelCardClick(gameState, updateGameState);
                                    }
                                }}>
                                <i className={`fa-solid ${getItemIcon(item)} text-yellow-400 text-lg mb-1`}></i>
                                <p className="text-xs text-gray-300 truncate">{item}</p>
                            </div>
                        );
                    }) : <div className="col-span-full p-4 text-center text-gray-500">
                        <p>暂无物品</p>
                    </div>}
                </div>
                <p className="text-xs text-gray-400 mt-2 text-center">物品可以用于合成更高级的道具</p>
            </div>
        </div>
    );
};

const HackSystemComponent = (
    {
        onHackComplete
    }: {
        onHackComplete?: () => void;
    }
) => {
    return <HackSystem onHackComplete={onHackComplete} />;
};

const CompanyWebsiteComponent = () => {
    const [showWebsite, setShowWebsite] = useState(false);
    const [activeTab, setActiveTab] = useState("company");

    return (
        <>
            <div className="p-3 bg-gray-900 rounded-lg border border-gray-700">
                <h3 className="text-base font-bold text-white mb-3">公司官网/天天网</h3>
                <p className="text-gray-400 mb-3 text-sm">访问公司官方网站或内部社交网络平台。</p>
                
                <div className="flex border-b border-gray-700 mb-3">
                    <button
                        className={`flex-1 py-2 text-sm transition-colors ${activeTab === "company" ? "text-green-400 border-b-2 border-green-500" : "text-gray-400 hover:text-white"}`}
                        onClick={() => setActiveTab("company")}>
                        <i className="fa-solid fa-building mr-1"></i>公司官网
                    </button>
                    <button
                        className={`flex-1 py-2 text-sm transition-colors ${activeTab === "social" ? "text-blue-400 border-b-2 border-blue-500" : "text-gray-400 hover:text-white"}`}
                        onClick={() => setActiveTab("social")}>
                        <i className="fa-solid fa-user-group mr-1"></i>天天网
                    </button>
                </div>
                <button
                    onClick={() => setShowWebsite(true)}
                    className={`w-full p-2.5 ${activeTab === "company" ? "bg-green-600 hover:bg-green-500" : "bg-blue-600 hover:bg-blue-500"} text-white rounded transition-colors text-sm`}>
                    {activeTab === "company" ? <>
                        <i className="fa-solid fa-globe mr-2"></i>访问官网
                    </> : <>
                        <i className="fa-solid fa-user-group mr-2"></i>访问天天网
                    </>}
                </button>
            </div>
            {showWebsite && (activeTab === "company" ? <CompanyWebsite onClose={() => setShowWebsite(false)} /> : <SocialNetwork onClose={() => setShowWebsite(false)} />)}
        </>
    );
};

const ItemCombinationPanel = () => {
  const { gameState, addToInventory, addPermission, updateGameState } = useContext(GameContext);
  const [isCombining, setIsCombining] = useState(false);
  const [combineError, setCombineError] = useState("");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  
  // 检查是否有低级权限卡和陈博士指纹（王阿姨路线）
  const hasLowLevelCard = gameState.inventory.includes("低级权限卡");
  const hasFingerprint = gameState.inventory.includes("陈博士指纹");
  
  const has30FloorCard = gameState.inventory.includes("30楼权限卡");
  
  // 处理物品点击选中/取消选中
  const handleItemClick = (item: string) => {
    setSelectedItems(prev => {
      // 如果物品已经被选中，则取消选中
      if (prev.includes(item)) {
        return prev.filter(i => i !== item);
      }
      
      // 如果已经选中了两个物品，则替换其中一个（实现单选或双选）
      if (prev.length >= 2) {
        // 替换掉第一个物品（轮替机制）
        return [prev[1], item];
      }
      
      // 否则添加新物品
      return [...prev, item];
    });
  };
  
  // 合成物品函数
  const combineItems = () => {
    // 检查王阿姨路线的合成条件
    const hasWangMaterials = selectedItems.includes("低级权限卡") && selectedItems.includes("陈博士指纹");
    
    if (hasWangMaterials) {
      setIsCombining(true);
      
      // 模拟合成过程
      setTimeout(() => {
        // 添加合成后的物品
        if (!has30FloorCard) {
          addToInventory("30楼权限卡");
          
          // 解锁30层权限
          addPermission("30FloorAccess");
          
          // 更新游戏状态为第三章完成，但不直接跳转
          updateGameState({
            currentStage: "chapter3Complete"
          });
        }
        
        setIsCombining(false);
        setSelectedItems([]); // 清空选中的物品
        
        // 显示合成成功对话框
        showCombinationSuccessDialog();
      }, 1500);
    } else {
      setCombineError("缺少必要的合成材料");
      setTimeout(() => setCombineError(""), 3000);
    }
  };
  
   // 完成合成
  const showCombinationSuccessDialog = () => {
    const dialog = document.createElement('div');
    dialog.className = 'fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4';
    dialog.innerHTML = `
      <div class="bg-gray-900 rounded-lg border-2 border-green-500 p-6 max-w-md w-full mx-4">
        <div class="text-center">
          <i class="fa-solid fa-magic text-5xl text-green-400 mb-6"></i>
          <h3 class="text-xl font-bold text-white mb-4">合成成功！</h3>
          <p class="text-green-400 mb-6">已获得 30楼权限卡</p>
          <p class="text-gray-300 mb-6 text-sm">门禁系统中30F权限已解锁，你现在可以前往30层机房了</p>
          <button id="continueButton" class="w-full p-3 bg-green-600 hover:bg-green-500 text-white rounded transition-colors">
            继续游戏
          </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(dialog);
    
    const continueButton = dialog.querySelector('#continueButton');
    if (continueButton) {
      continueButton.addEventListener('click', () => {
        document.body.removeChild(dialog);
        // 延迟一小段时间再更新章节状态，给玩家充分的反应时间
        setTimeout(() => {
          updateGameState({
            currentStage: "chapter3Complete",
            currentChapter: "chapter4"
          });
        }, 500);
      });
    }
  };
  
  // 获取合成所需材料提示
  const getRequiredMaterials = () => {
    return "低级权限卡 + 陈博士指纹";
  };
  
  // 获取可合成的物品列表
  const getCombinableItems = () => {
    // 显示所有可能的合成材料
    return gameState.inventory.filter(item => 
      item === "低级权限卡" || 
      item === "陈博士指纹"
    );
  };
  
  // 获取材料状态
  const hasRequiredMaterials = () => {
    // 检查是否有王阿姨路线的正确材料组合
    return selectedItems.includes("低级权限卡") && selectedItems.includes("陈博士指纹");
  };
  
  // 获取物品的选中状态
  const isItemSelected = (item: string) => {
    return selectedItems.includes(item);
  };
  
  return (
    <div className="p-3 bg-gray-900 rounded-lg border border-gray-700">
      <h3 className="text-base font-bold text-white mb-3">物品合成</h3>
      
      {has30FloorCard ? (
        <div className="p-4 bg-green-900/20 border border-green-500 rounded-lg text-center">
          <p className="text-green-400 font-medium">已合成30楼权限卡！</p>
          <p className="text-white mt-2">门禁系统中30F权限已解锁</p>
        </div>
      ) : (
        <>
          {/* 可选择物品列表 */}
          <div className="mb-4">
            <p className="text-xs text-gray-400 mb-2">可选择物品：</p>
            <div className="flex flex-wrap gap-2">
              {getCombinableItems().map((item, index) => (
                <div
                  key={index}
                  onClick={() => handleItemClick(item)}
                  className={`px-3 py-2 bg-gray-800 border rounded-lg cursor-pointer transition-all duration-200 transform hover:scale-[1.02] ${
                    isItemSelected(item) 
                      ? 'border-yellow-500 bg-yellow-900/20 shadow-md shadow-yellow-900/30' 
                      : 'border-gray-700 hover:border-yellow-500/50'
                  }`}
                >
                  <div className="flex items-center">
                    {item.includes("权限卡") && <i className={`fa-solid fa-id-card mr-2 ${isItemSelected(item) ? 'text-yellow-400' : 'text-yellow-400'}`}></i>}
                    {item.includes("指纹") && <i className={`fa-solid fa-fingerprint mr-2 ${isItemSelected(item) ? 'text-yellow-400' : 'text-yellow-400'}`}></i>}
                    <span className={`${isItemSelected(item) ? 'text-yellow-300 font-medium' : 'text-gray-300'}`}>{item}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* 选中的物品显示区域 */}
          <div className="p-4 bg-black/50 border-2 border-dashed border-gray-700 rounded-lg mb-4 min-h-[120px] flex flex-col items-center justify-center">
            {selectedItems.length > 0 ? (
              <div className="w-full">
                <div className="text-center mb-3">
                  <p className="text-sm text-gray-400">已选择物品</p>
                </div>
                <div className="flex flex-wrap gap-2 justify-center">
                  {selectedItems.map((item, index) => (
                    <div key={index} className="px-3 py-2 bg-blue-900/30 border border-blue-500 rounded-lg flex items-center">
                      {item.includes("权限卡") && <i className="fa-solid fa-id-card text-blue-400 mr-2"></i>}
                      {item.includes("指纹") && <i className="fa-solid fa-fingerprint text-blue-400 mr-2"></i>}
                      <span className="text-blue-300 mr-2">{item}</span>
                      <button
                        onClick={() => handleItemClick(item)}
                        className="text-gray-400 hover:text-white"
                        aria-label={`移除${item}`}
                      >
                        <i className="fa-solid fa-times"></i>
                      </button>
                    </div>
                  ))}
                </div>
                {selectedItems.length === 1 && (
                  <p className="text-center text-sm text-yellow-400 mt-3">请再选择一个物品进行合成</p>
                )}
              </div>
            ) : (
              <div className="text-center text-gray-500">
                <i className="fa-solid fa-hand-pointer text-2xl mb-2"></i>
                <p>点击选择合成所需物品</p>
                <p className="text-xs mt-1">需要：{getRequiredMaterials()}</p>
              </div>
            )}
          </div>
          
          {combineError && (
            <p className="text-xs text-red-400 mb-3">{combineError}</p>
          )}
          
          <button 
            onClick={combineItems}
            disabled={!hasRequiredMaterials() || isCombining}
            className={`w-full p-3 rounded-lg transition-all duration-200 ${
              hasRequiredMaterials() && !isCombining
                ? 'bg-yellow-600 hover:bg-yellow-500 text-white transform hover:scale-[1.02] shadow-md' 
                : 'bg-gray-700 cursor-not-allowed text-gray-400'
            }`}
          >
            {isCombining ? (
              <div className="flex items-center justify-center">
                <i className="fa-solid fa-spinner fa-spin mr-2"></i> 合成中...
              </div>
            ) : hasRequiredMaterials() ? (
              <>
                <i className="fa-solid fa-magic mr-2"></i> 合成30楼权限卡
              </>
            ) : '缺少合成材料'}
          </button>
          
          <div className="mt-3 p-2 bg-blue-900/20 border border-blue-500/30 rounded-lg">
            <p className="text-xs text-blue-400">
              <i className="fa-solid fa-lightbulb mr-1"></i>
              合成说明：点击选择{getRequiredMaterials()}，可获得进入30层机房的权限卡
            </p>
          </div>
        </>
      )}
    </div>
  );
};

// 处理中级权限卡点击事件
const handleMidLevelCardClick = (gameState: any, updateGameState: any) => {
    // 创建输入账号密码的对话框
    const dialog = document.createElement('div');
    dialog.className = 'fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4';
    dialog.innerHTML = `
      <div class="bg-gray-900 rounded-lg border-2 border-blue-500 p-6 max-w-md w-full mx-4">
        <div class="text-center">
          <i class="fa-solid fa-id-card text-5xl text-blue-400 mb-6"></i>
          <h3 class="text-xl font-bold text-white mb-4">中级权限卡验证</h3>
          <p class="text-gray-300 mb-6">请输入陈博士直属助手的账号和密码</p>
          
          <div class="space-y-4 mb-6">
            <div>
              <label class="block text-left text-gray-400 mb-1 text-sm">账号</label>
              <input id="accountInput" type="text" class="w-full p-2.5 bg-black border border-gray-700 rounded text-green-400" placeholder="请输入账号" />
            </div>
            <div>
              <label class="block text-left text-gray-400 mb-1 text-sm">密码</label>
              <input id="passwordInput" type="password" class="w-full p-2.5 bg-black border border-gray-700 rounded text-green-400" placeholder="请输入密码" />
            </div>
          </div>
          
          <p id="errorMessage" class="text-red-400 text-sm mb-4 hidden">账号或密码错误</p>
          
          <button id="confirmButton" class="w-full p-3 bg-blue-600 hover:bg-blue-500 text-white rounded transition-colors">
            验证
          </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(dialog);
    
    const accountInput = dialog.querySelector('#accountInput') as HTMLInputElement;
    const passwordInput = dialog.querySelector('#passwordInput') as HTMLInputElement;
    const confirmButton = dialog.querySelector('#confirmButton');
    const errorMessage = dialog.querySelector('#errorMessage');
    
    if (confirmButton) {
      confirmButton.addEventListener('click', () => {
        // 正确的账号密码
        const correctAccount = 'lms3158';
        const correctPassword = '20251015';
        
        if (accountInput.value === correctAccount && passwordInput.value === correctPassword) {
          document.body.removeChild(dialog);
          
          // 解锁30层权限
          updateGameState({
            currentChapter: "chapter4",
            permissions: [...gameState.permissions, "30FloorAccess"]
          });
          
          // 显示成功对话框
          const successDialog = document.createElement('div');
          successDialog.className = 'fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4';
          successDialog.innerHTML = `
            <div class="bg-gray-900 rounded-lg border-2 border-green-500 p-6 max-w-md w-full mx-4">
              <div class="text-center">
                <i class="fa-solid fa-check-circle text-5xl text-green-400 mb-6"></i>
                <h3 class="text-xl font-bold text-white mb-4">验证成功！</h3>
                <p class="text-green-400 mb-6">30层机房访问权限已解锁</p>
                <p class="text-gray-300 mb-6 text-sm">你现在可以前往30层机房了</p>
                <button id="continueButton" class="w-full p-3 bg-green-600 hover:bg-green-500 text-white rounded transition-colors">
                  前往第四章：真相
                </button>
              </div>
            </div>
          `;
          
          document.body.appendChild(successDialog);
          
          const continueButton = successDialog.querySelector('#continueButton');
          if (continueButton) {
            continueButton.addEventListener('click', () => {
              document.body.removeChild(successDialog);
            });
          }
        } else {
          if (errorMessage) {
            errorMessage.classList.remove('hidden');
          }
        }
      });
    }
};

const NPCContactPanel = ({ showNPCDialogue, setShowNPCDialogue, selectedNPC, setSelectedNPC, dialogueStep, setDialogueStep, handleNPCInteraction, handleDialogueOption, closeNPCDialogue }) => {
  const { gameState } = useContext(GameContext);
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);

  useEffect(() => {
    if (gameState.selectedNPC === "张经理") {
      setSelectedRoute("zhang");
    } else if (gameState.selectedNPC === "王阿姨") {
      setSelectedRoute("wang");
    } else if (gameState.selectedNPC === "小明") {
      setSelectedRoute("ming");
    } else {
      const trustLevels = gameState.trustLevel;
      if (trustLevels["张经理"] > trustLevels["王阿姨"] && trustLevels["张经理"] > trustLevels["小明"]) {
        setSelectedRoute("zhang");
      } else if (trustLevels["王阿姨"] > trustLevels["张经理"] && trustLevels["王阿姨"] > trustLevels["小明"]) {
        setSelectedRoute("wang");
      } else {
        setSelectedRoute("ming");
      }
    }
  }, [gameState]);

  const getAvailableNPCs = () => {
    if (selectedRoute === "zhang") {
        return ["张三金"];
    } else if (selectedRoute === "wang") {
        return ["王阿姨"];
    } else if (selectedRoute === "ming") {
        return ["小明"];
    }
    return ["张三金", "王阿姨", "小明"];
  };

  const getCurrentRouteName = () => {
    if (selectedRoute === "zhang") {
        return "张三金路线";
    } else if (selectedRoute === "wang") {
        return "王阿姨路线";
    } else if (selectedRoute === "ming") {
        return "小明路线";
    }
    return "未知路线";
  };

  const availableNPCs = getAvailableNPCs();

  return (
      <div className="space-y-4">
          <div className="p-3 bg-gray-900 rounded-lg border border-gray-700">
              <h3 className="text-base font-bold text-white mb-3">联系NPC</h3>
              <p className="text-gray-400 mb-3 text-sm">你已选择<span className="text-yellow-400">{getCurrentRouteName()}</span>，只能与对应的NPC交流。</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {availableNPCs.map(npc => <button
                      key={npc}
                      onClick={() => handleNPCInteraction(npc)}
                      className="p-3 bg-gray-800 hover:bg-gray-700 text-white rounded transition-colors text-center flex flex-col items-center transform hover:scale-[1.03]">
                     <div
                            className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center mb-2">
                            {npc === "张三金" && <i className="fa-solid fa-briefcase text-blue-400"></i>}
                            {npc === "王阿姨" && <i className="fa-solid fa-person text-green-400"></i>}
                            {npc === "小明" && <i className="fa-solid fa-box text-yellow-400"></i>}
                       </div>
                      <span>{npc}</span>
                      <div className="mt-1 text-xs text-gray-400">当前信任度: {gameState.trustLevel[npc] || 0}/100</div>
                  </button>)}
              </div>
              <div
                  className="mt-4 p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg text-sm">
                  <p className="text-blue-400">提示：根据你选择的路线，你只能与对应的NPC进行交流。完成当前路线的任务后，才能前往30层机房。</p>
              </div>
          </div>
      </div>
  );
};

export default function Chapter3Scene() {
    const {
        gameState,
        updateGameState,
        addDiscoveredClue,
        addPermission,
        addToInventory,
        updateTrustLevel,
        resetGame,
        returnToMainMenu
    } = useContext(GameContext);

    const [activeTab, setActiveTab] = useState("emails");
    const [showFormattingEnding, setShowFormattingEnding] = useState(false);
    const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
    const [showPauseMenu, setShowPauseMenu] = useState(false);
    const [showNPCDialogue, setShowNPCDialogue] = useState(false);
    const [selectedNPC, setSelectedNPC] = useState<string | null>(null);
    const [dialogueStep, setDialogueStep] = useState(0);
    const [showFlashMessage, setShowFlashMessage] = useState<string | null>(null);
    const [emailSearchQuery, setEmailSearchQuery] = useState("");
    
    // 监听倒计时，当归零时显示格式化结局
  useEffect(() => {
    if (gameState.countdown <= 0 && !showFormattingEnding) {
      setShowFormattingEnding(true);
    }
  }, [gameState.countdown, showFormattingEnding]);

  // 处理重新开始游戏
  const handleRestartFromChapter2 = () => {
    setShowFormattingEnding(false);
    updateGameState({
      currentChapter: "chapter2",
      currentStage: "chapter2Complete",
      selectedNPC: "", // 清除之前选择的NPC，让用户可以重新选择路线
      countdown: GAME_COUNTDOWN_SECONDS
    });
  };

  // 摄像头数据 - 包含所有楼层的监控
  const cameras = [
    {
      id: 1,
      location: "1层大厅",
      description: "前台保安在打电话，看起来很忙",
      isAccessible: true,
      imageUrl: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Building%20lobby%20reception%20security%20phone&sign=7ecb54fe48689a5340d7d3b5c8288e76"
    },
    {
      id: 2,
      location: "10层走廊",
      description: "空无一人",
      isAccessible: true,
      imageUrl: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Office%20corridor%20empty%20quiet&sign=22141e1fa704011714a3ba88bee0353f"
    },
    {
      id: 3,
      location: "15层办公室",
      description: "张经理在加班，压力很大",
      isAccessible: true,
      imageUrl: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Office%20manager%20working%20late%20stressed&sign=65a18fdad9ca5aba9d2ddf984028293b"
    },
    {
      id: 4,
      location: "17层走廊",
      description: "清洁工在扫地",
      isAccessible: true,
      imageUrl: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Corridor%20cleaner%20sweeping%20floor&sign=28f94dc4ec5d3597c7c17b63229a1a32"
    },
    {
      id: 5,
      location: "20层会议室",
      description: "空无一人",
      isAccessible: true,
      imageUrl: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Meeting%20room%20empty%20conference%20table&sign=177571d9a740f672fda199a2a389213f"
    },
    {
      id: 6,
      location: "25层陈列室",
      description: "空无一人，但有很多奖杯和展品",
      isAccessible: true,
      imageUrl: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Archive%20room%20file%20cabinets%20empty&sign=4b339e3a1bc4c3d6e8a01554c7c369bf"
    },
    {
      id: 7,
      location: "28层餐厅",
      description: "王阿姨在收拾餐桌",
      isAccessible: true,
      imageUrl: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Cafeteria%20elderly%20woman%20cleaning%20tables&sign=1ad3d56becd2867b3053884f563c9671"
    },
    {
      id: 8,
      location: "29层休息室",
      description: "小明躺在沙发上休息",
      isAccessible: true,
      imageUrl: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Break%20room%20young%20man%20resting%20sofa&sign=796723ea3e2258077f86f66476e9ce34"
    },
    {
      id: 9,
      location: "30层机房",
      description: "无法访问（显示\"权限不足\"）",
      isAccessible: false,
      imageUrl: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Server%20room%20access%20denied%20locked&sign=93c7b1487cee01ec7d168e823fa20dcd"
    }
  ];
    
    const [selectedCamera, setSelectedCamera] = useState<number | null>(null);
    
    // 处理摄像头查看
    const handleCameraView = (cameraId: number) => {
      const camera = cameras.find(c => c.id === cameraId);
      if (camera && camera.isAccessible) {
        setSelectedCamera(cameraId);
      }
    };
    
    // 渲染摄像头组件 - 移动到组件内部
    const renderCameraView = () => {
      // 只有在特定标签页或条件下显示摄像头
      if (activeTab !== "npc") return null;
      
      return (
        <div className="mt-8 space-y-6">
          <div className="p-3 bg-gray-900 rounded-lg border border-gray-700">
            <h3 className="text-base font-bold text-white mb-3">安全摄像头</h3>
            <p className="text-gray-400 mb-3 text-sm">查看大楼内的实时监控画面</p>
            
              {/* 摄像头网格 - 响应式布局 */}
              <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-2">
              {cameras.map(camera => (
                <div 
                  key={camera.id}
                  className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                    camera.isAccessible 
                      ? 'border-gray-700 hover:border-green-500 hover:shadow-lg hover:shadow-green-900/20' 
                      : 'border-red-700 opacity-60 cursor-not-allowed'
                  }`}
                  onClick={() => camera.isAccessible && handleCameraView(camera.id)}
                >
                   <div className="relative h-32 bg-black">
                    <img 
                      src={camera.imageUrl} 
                      alt={camera.location} 
                      className="w-full h-full object-cover opacity-70"
                    />
                    {!camera.isAccessible && (
                      <div className="absolute inset-0 bg-red-900/30 flex items-center justify-center">
                        <p className="text-white font-bold text-xs">权限不足</p>
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-1.5">
                      <p className="text-white text-xs text-center">{camera.location}</p>
                    </div>
                    {camera.isAccessible && (
                      <div className="absolute inset-0 bg-green-500/20 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {/* 选中的摄像头画面 */}
            {selectedCamera && (
              <div className="mt-4 p-3 bg-gray-800 rounded-lg border border-gray-700">
                {(() => {
                  const camera = cameras.find(c => c.id === selectedCamera);
                  if (!camera) return null;
                  return (
                    <>
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-bold text-white">{camera.location}</h4>
                        <button 
                          onClick={() => setSelectedCamera(null)}
                          className="text-gray-400 hover:text-white"
                        >
                          <i className="fa-solid fa-times"></i>
                        </button>
                      </div>
                       <div className="relative h-36 md:h-48 bg-black rounded-lg mb-2">
                        <img 
                          src={camera.imageUrl} 
                          alt={camera.location} 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
                          直播
                        </div>
                      </div>
                      <p className="text-gray-300 text-sm">{camera.description}</p>
                    </>
                  );
                })()}
              </div>
            )}
          </div>
        </div>
      );
    };

    // NPC对话处理
    const handleNPCInteraction = (npc: string) => {
        setSelectedNPC(npc);
        setDialogueStep(0);
        setShowNPCDialogue(true);
    };

    const handleDialogueOption = (optionIndex: number) => {
        if (selectedNPC === "王阿姨") {
            const currentTrust = gameState.trustLevel["王阿姨"] || 0;
            updateTrustLevel("王阿姨", currentTrust + 10);
        }

        setDialogueStep(prev => prev + 1);

        // 特殊处理王阿姨路线的指纹问题
        if (selectedNPC === "王阿姨" && dialogueStep === 5 && optionIndex !== 0) {
            // 选择了错误的答案，直接结束对话
            setTimeout(() => {
                closeNPCDialogue();
                setShowFlashMessage("王阿姨觉得你的建议不太对，需要重新考虑一下");
                setTimeout(() => setShowFlashMessage(null), 3000);
            }, 1000);
            return;
        }
        
        // 特殊处理王阿姨路线的日期选择
        if (selectedNPC === "王阿姨" && dialogueStep === 6) {
            if (optionIndex === 0) {
                // 正确答案，增加信任度
                const currentTrust = gameState.trustLevel["王阿姨"] || 0;
                updateTrustLevel("王阿姨", currentTrust + 10);
            } else {
                // 错误答案，结束对话
                setTimeout(() => {
                    closeNPCDialogue();
                    setShowFlashMessage("日期格式不对，王阿姨需要你提供正确的日期");
                    setTimeout(() => setShowFlashMessage(null), 3000);
                }, 1000);
                return;
            }
        }
        
        // 特殊处理张经理路线中提交财务系统平帐截图
        if (selectedNPC === "张三金" && dialogueStep === 5) {
            // 检查是否已经提交了财务系统平帐截图
            if (!gameState.inventory.includes("财务系统平帐截图")) {
                // 提示用户去完成任务
                setShowFlashMessage("你需要先提交财务系统平帐截图");
                setTimeout(() => setShowFlashMessage(null), 3000);
                return;
            }
        }
        
        // 特殊处理小明路线中提交账单证据
        if (selectedNPC === "小明" && dialogueStep === 5) {
            // 检查是否有账单证据
            if (!gameState.inventory.includes("小明母亲的医疗账单")) {
                // 提示用户去完成任务
                setShowFlashMessage("你需要先获得小明母亲的医疗账单");
                setTimeout(() => setShowFlashMessage(null), 3000);
                return;
            }
        }

           // 关闭对话框的条件
          if (selectedNPC === "王阿姨" ? gameState.trustLevel["王阿姨"] >= 80 ? dialogueStep >= 8 : dialogueStep >= 2 : selectedNPC === "张经理" ? dialogueStep >= 7 : dialogueStep >= 8) {
            // 当完成王阿姨的最后一个问题时，标记为已完成所有填空题
            if (selectedNPC === "王阿姨" && dialogueStep === 8) {
              updateGameState({ hasCompletedWangAuntQuestions: true });
            }
            setTimeout(() => {
                closeNPCDialogue();
            }, 1500);
          }
    };

    const closeNPCDialogue = () => {
        setShowNPCDialogue(false);
        setSelectedNPC(null);
        setDialogueStep(0);
    };

    const renderNPCDialogue = () => {
        if (!showNPCDialogue || !selectedNPC)
            return null;

        const dialogues: Record<string, {
            dialogue: string;
            options: string[];
        }[]> = {
       "张三金": [{
                dialogue: "张三金：你来了。关于财务数据的事情，你处理得怎么样了？",
                options: ["我已经处理好了", "我想先问你一些问题", "关于30层的权限卡"]
            }, {
                dialogue: "张三金：你想问什么？我知道的都会告诉你。",
                options: ["你的权限卡是什么等级？", "陈博士专属助手的账号和密码是什么？", "关于30层进入权限"]
            }, {
                dialogue: "张经理：我的权限卡是中级，可以进入大部分区域，但30层机房需要更高级的权限。至于陈博士助手的账号密码...我其实并不清楚，只有少数高层才知道。",
                options: ["我们可以做个交易", "我可以帮你处理财务数据的问题", "我需要你帮我平帐"]
            }, {
                dialogue: "张经理：你说的是那些异常交易记录？我确实需要帮助把这些账目做平，不然审计部门查出来就麻烦了。如果你能帮我侵入财务系统修改记录，我可以把我的中级权限卡借给你。",
                options: ["没问题，我这就去入侵财务系统", "你先把权限卡给我", "我需要更多信息"]
            }, {
                             dialogue: "张经理：太好了！财务系统的入口在HR系统的后端接口，你可以从那里入侵进去。修改完成后记得给我看看平账结果，我会把权限卡给你。",
                             options: ["明白了，我这就去", "有什么需要注意的吗？", "完成后在哪里找你"]
            }, {
                             dialogue: "张经理：嗯...我看了一下，财务数据确实处理得很干净。不过...我凭什么要把权限卡给你？CORE可是明确规定不能随便给别人权限卡的！",
                             options: ["我们不是说好了交易吗？", "你不想被审计部门发现异常吗？", "我还有备份的数据"]
            }, {
                             dialogue: "张经理（紧张）：你...你什么意思？你是在威胁我？我可以向CORE告发你，说你非法入侵公司系统！到时候你会被彻底格式化的！",
                             options: ["我没有威胁你，只是想公平交易", "如果你这么做，这些备份数据就会被曝光", "你考虑清楚后果"]
            }, {
                             dialogue: "张经理（沮丧）：...好吧。你赢了。这是我的中级权限卡。但你要保证，永远不会把这些备份数据曝光。要是被审计部门发现，我的职业生涯就完了...",
                             options: ["我保证", "谢谢你的信任", "我会小心使用的"]
            }],

            "王阿姨": [{
                dialogue: "王阿姨（叹气）：哎...最近我儿子生病住院了，手术费实在是太高了，我一个清洁工哪能负担得起啊...",
                options: ["我听说有员工救助基金可以申请", "需要我帮你吗王阿姨？", "关于救助基金的申请"]
            }, {
                dialogue: "王阿姨（眼睛一亮）：真的吗？我也听说过，但不知道怎么申请。你能帮我吗？",
                options: ["当然可以，我来帮你申请", "你知道员工救助基金申请指南邮件吗？", "我会帮你找到申请入口"]
            }, {
                dialogue: "王阿姨（感激）：太谢谢你了！如果你能帮我申请到救助基金，我一定会报答你的！你可以在邮件系统中找到员工救助基金申请指南，里面有一个醒目的蓝色按钮可以直接申请。",
                options: ["我这就去邮件系统看看", "好的，我会找到申请方法", "我一定会帮你申请成功的"]
             }, {
                 dialogue: "王阿姨（开心）：太感谢你了！救助基金申请成功了！我儿子的手术可以顺利进行了。",
                 options: ["太好了！现在我需要你帮我提取陈博士的指纹", "作为报答，我需要你帮我一个忙", "关于进入30层的事情"]
             }, {
                 dialogue: "王阿姨：你帮了我这么大的忙，我当然愿意帮你。不过...我需要确认一下申请是不是真的成功了，能让我看看申请证明吗？",
                 options: ["当然可以，这是申请成功的证明"]
             }, {
                 dialogue: "王阿姨（犹豫）：提取陈博士的指纹？这...这是要做什么？不过既然你帮了我这么大的忙，我愿意试试。",
                 options: ["我需要你帮我找一个地方收集陈博士的指纹", "作为报答，我需要你帮我这个忙", "这对我很重要"]
             }, {
                 dialogue: "王阿姨：我在打扫的时候看到陈博士经常在办公室和展示区活动，那里可能会有他的指纹。不过公司里东西很多，你知道具体哪里可能会有吗？",
                 options: ["奖杯", "办公桌", "电脑键盘", "茶杯"]
            }, {
                 dialogue: "王阿姨：我去哪里找奖杯呢？",
                 options: ["20231015", "2022/10/20", "2024/03/12", "2025/07/08"]
             }, {
                   dialogue: "王阿姨：陈列室有很多奖杯，按照时间从古到今排列，我应该找什么时候的呢？（答案格式是yyyymmdd）",
                 options: ["记得戴手套，不要留下你的指纹", "用胶带轻轻地粘取指纹", "一定要小心，不要被发现"]
             }, {
                 dialogue: "王阿姨：好的，我知道了。我会用胶带小心翼翼地提取指纹，然后尽快扫描发送给你。谢谢你帮了我这么大的忙！",
                 options: ["谢谢你王阿姨", "一定要小心行事", "完成后我会在邮件里等你的消息"]
             }],

             "小明": [{
                dialogue: "小明（紧张地低头）：你...你怎么知道我在发消息？",
                options: ["你在跟谁汇报我的行踪？", "我注意到你总是偷偷发消息", "你为什么要监视我？"]
            }, {
                dialogue: "小明（更加紧张）：我...我没有监视你，这只是工作需要...",
                options: ["别骗我，我知道你在向CORE汇报", "为什么CORE要让你监视我？", "你为什么要帮CORE？"]
            }, {
                dialogue: "小明（无奈地叹气）：好吧，我承认。我是外包岗，CORE威胁说如果我不监视你并汇报你的行踪，就会把我开除。我真的很需要这份工作...",
                options: ["CORE这样要挟你是不对的", "我可以帮你转为正式员工", "让我们一起反抗CORE"]
            }, {
                dialogue: "小明（眼睛一亮）：你能帮我转为正式员工？真的吗？那我就不用再受CORE的要挟了！",
                options: ["当然，但你需要先信任我", "我会入侵HR系统帮你修改合同", "我们需要互相帮助"]
            }, {
                dialogue: "小明（有些犹豫）：好...我相信你。但是修改合同不是小事，如果被发现我会真的被开除的...",
                options: ["我会做得很隐蔽，不会被发现的", "这是我们唯一的机会", "你可以先看看我修改好的合同"]
            }, {
                dialogue: "小明（不安地搓手）：好吧，我相信你。但是修改合同需要什么？会不会很复杂？",
                options: ["我已经入侵HR系统修改好了"]
            }, {
                dialogue: "小明（惊喜地看着合同）：这...这是真的？我的合同真的被改成正式员工了！谢谢你！现在我不用再害怕被CORE开除了！",
                options: ["现在你愿意帮我进入30层了吗？", "我们需要想个办法进入30层", "快递可以直达30层吗？"]
            }, {
                 dialogue: "小明（思考片刻）：对啊！快递可以直达30层，但需要经过CORE的扫描。我有个办法 - 你可以上传分身到我的备用手机里，我用快递包装好后寄到30层！",
                options: ["这是个好主意！我们试试看", "需要怎么上传分身？", "扫描会不会发现异常？"]
            }, {
                 dialogue: "小明（担心地）：不过有个问题 - 快递到达30层时会经过CORE的扫描系统。如果被发现有异常，就会被拦截并销毁。你需要在扫描过程中控制你的数字分身躲避扫描线。",
                options: ["我需要在扫描时躲避检测", "我会想办法通过扫描", "我们必须冒险试试"]
            }, {
                dialogue: "小明（点头）：对，你需要在扫描时控制你的数字分身躲避CORE的扫描线。这很危险，但也是唯一的办法了。",
                options: ["我准备好了，开始上传分身", "让我们开始吧", "我会小心的"]
            }, {
                 dialogue: "小明：好的！现在我把备用手机连接到系统，你尽快上传分身。上传完成后我会立即打包并安排快递配送。记住，在快递到达30层时，你需要控制你的数字分身躲避CORE的扫描线！",
                options: ["收到，开始上传", "我会在扫描时小心的", "完成后立即通知你"]
            }]
        };

        let currentDialogues = [...dialogues[selectedNPC]];

        if (selectedNPC === "王阿姨") {
            const currentTrust = gameState.trustLevel["王阿姨"] || 0;
            if (currentTrust < 80) {
                currentDialogues = currentDialogues.slice(0, 3);
            }
        }

        const maxStep = currentDialogues.length - 1;
        const currentStep = Math.min(dialogueStep, maxStep);
        const currentDialogue = currentDialogues[currentStep];

        return (
            <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                <div className="bg-gray-900 rounded-lg border-2 border-blue-500 max-w-md w-full max-h-[80vh] overflow-auto">
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-blue-400">{selectedNPC}</h3>
                            <button
                                onClick={closeNPCDialogue}
                                className="text-gray-400 hover:text-white transition-colors p-1"
                                aria-label="返回">
                                <i className="fa-solid fa-arrow-left"></i>
                            </button>
                         </div>
                          <p className="text-white mb-6">{currentDialogue.dialogue}</p>
                           
                           {/* 特殊处理：当与王阿姨对话到需要提交证明的步骤时 */}
                           {selectedNPC === "王阿姨" && dialogueStep === 3 && (
                               gameState.inventory.includes("员工救助基金申请证明") ? (
                                   <button
                                       onClick={() => {
                                           handleDialogueOption(0);
                                           // 提交员工救助基金申请证明
                                           if (gameState.inventory.includes("员工救助基金申请证明")) {
                                               // 增加王阿姨信任度
                                               const currentTrust = gameState.trustLevel["王阿姨"] || 0;
                                               updateTrustLevel("王阿姨", currentTrust + 5);
                                           }
                                       }}
                                       className="w-full p-3 bg-blue-800 hover:bg-blue-700 text-white rounded text-left transition-colors flex items-center mb-6"
                                   >
                                       <i className="fa-solid fa-file-certificate text-blue-400 mr-2"></i>
                                       提交员工救助基金申请证明
                                   </button>
                               ) : (
                                   <div className="p-4 bg-red-900/20 border border-red-500 rounded-lg mb-6 text-center">
                                       <p className="text-red-400 mb-2">你需要先获得员工救助基金申请证明</p>
                                       <p className="text-gray-300 text-sm">提示：在邮件系统中完成员工救助基金申请</p>
                                   </div>
                               )
                           )}
            {/* 特殊处理：当与张经理对话时，按照指定步骤显示按钮 */}
  {selectedNPC === "张三金" && dialogueStep === 4 && (
   gameState.inventory.includes("财务系统平帐截图") ? (
     <button
       onClick={() => {
         handleDialogueOption(0);
         // 提交财务系统平帐截图
         if (gameState.inventory.includes("财务系统平帐截图")) {
           // 增加张经理信任度
           const currentTrust = gameState.trustLevel["张经理"] || 0;
           updateTrustLevel("张经理", currentTrust + 5);
         }
       }}
       className="w-full p-3 bg-blue-800 hover:bg-blue-700 text-white rounded text-left transition-colors flex items-center mb-6"
     >
       <i className="fa-solid fa-file-lines text-blue-400 mr-2"></i>
       提交财务系统平帐截图
     </button>
   ) : (
     <div className="p-4 bg-red-900/20 border border-red-500 rounded-lg mb-6 text-center">
       <p className="text-red-400 mb-2">你需要先获得财务系统平帐截图</p>
       <p className="text-gray-300 text-sm">提示：前往系统侵入完成财务系统平帐任务</p>
     </div>
   )
  )}
                          
                           {/* 显示提交备份财务数据按钮在第五步 */}
                           {selectedNPC === "张三金" && dialogueStep === 5 && (
                                   gameState.inventory.includes("备份财务数据") ? (
                                       <button
                                           onClick={() => {
                                               handleDialogueOption(1);
                                               // 提交备份财务数据
                                               if (gameState.inventory.includes("备份财务数据")) {
                                                   // 增加张经理信任度
                                                   const currentTrust = gameState.trustLevel["张经理"] || 0;
                                                   updateTrustLevel("张经理", currentTrust + 15);
                                                   
                                                   // 检查是否已经有中级权限卡，如果没有则添加
                                                   if (!gameState.inventory.includes("中级权限卡")) {
                                                       addToInventory("中级权限卡");
                                                       addDiscoveredClue("zhangManagerCard");
                                                       
                                                       // 显示获得中级权限卡的提示
                                                       setShowFlashMessage("获得了中级权限卡！");
                                                       setTimeout(() => setShowFlashMessage(null), 3000);
                                                   }
                                               }
                                           }}
                                           className="w-full p-3 bg-red-800 hover:bg-red-700 text-white rounded text-left transition-colors flex items-center">
                                           <i className="fa-solid fa-database text-red-400 mr-2"></i>
                                           提交备份财务数据
                                       </button>
                                   ) : (
                                       <div className="p-4 bg-red-900/20 border border-red-500 rounded-lg text-center">
                                           <p className="text-red-400 mb-2">你需要先获得备份财务数据</p>
                                           <p className="text-gray-300 text-sm">提示：在财务系统平帐过程中自动获取</p>
                                       </div>
                                   )
                               )}
                           
                            {/* 特殊处理：王阿姨路线的填空题 */}
  {selectedNPC === "王阿姨" && (dialogueStep === 6 || dialogueStep === 7 || dialogueStep === 8) && (
    <div className="space-y-4">
      <div className="p-4 bg-yellow-900/20 border border-yellow-500/50 rounded-lg">
        <p className="text-yellow-300 mb-2">请在下方输入答案：</p>
        <input
          type="text"
          id="fillBlankAnswer"
          className="w-full p-3 bg-black border border-gray-700 rounded text-green-400 mb-4"
          placeholder="请输入答案..."
        />
        <button 
          onClick={() => {
            const userAnswer = (document.getElementById('fillBlankAnswer') as HTMLInputElement).value.trim().toLowerCase();
            let isCorrect = false;
            let correctAnswer = "";
            
            // 确定当前问题的正确答案
            if (dialogueStep === 6) {
              correctAnswer = "奖杯";
              isCorrect = userAnswer === "奖杯";
            } else if (dialogueStep === 7) {
              correctAnswer = "陈列室";
              isCorrect = userAnswer === "陈列室";
            } else if (dialogueStep === 8) {
              correctAnswer = "20231015";
              isCorrect = userAnswer === "20231015";
            }
            
            if (isCorrect) {
              // 答案正确，进入下一步对话
              handleDialogueOption(0);
              // 增加信任度
              const currentTrust = gameState.trustLevel["王阿姨"] || 0;
              updateTrustLevel("王阿姨", currentTrust + 10);
             } else {
              // 答案错误，显示提示
              // 确保用户已经输入了答案才显示错误提示
              if (userAnswer.trim() !== "") {
                setShowFlashMessage(`回答错误，请重新回答。正确答案是：${correctAnswer}`);
                setTimeout(() => setShowFlashMessage(null), 3000);
              }
            }
          }}
          className="w-full p-3 bg-blue-600 hover:bg-blue-500 text-white rounded transition-colors"
        >
          提交答案
        </button>
      </div>
    </div>
  )}
  
  {/* 其他对话保持不变 */}
  {!(selectedNPC === "王阿姨" && dialogueStep === 3) && !(selectedNPC === "张三金" && dialogueStep === 4) && !(selectedNPC === "张三金" && dialogueStep === 5) && !(selectedNPC === "王阿姨" && (dialogueStep === 6 || dialogueStep === 7 || dialogueStep === 8)) && (
                               /* 特殊处理：当对话是关于证据提交时，需要检查是否有账单 */
                              selectedNPC === "小明" && dialogueStep === 5 ? (
                                   gameState.inventory.includes("小明正岗合同") ? (
                                      <button
                                          onClick={() => {
                                              handleDialogueOption(0);
                                              // 提交小明正岗合同，大幅提升信任度
                                              updateTrustLevel("小明", 100);
                                          }}
                                          className="w-full p-3 bg-blue-800 hover:bg-blue-700 text-white rounded text-left transition-colors flex items-center">
                                          <i className="fa-solid fa-file-contract text-blue-400 mr-2"></i>
                                          提交小明正岗合同
                                      </button>
                                  ) : (
                                      <div className="p-4 bg-red-900/20 border border-red-500 rounded-lg text-center">
                                           <p className="text-red-400 mb-2">你需要先获得小明正岗合同</p>
                                           <p className="text-gray-300 text-sm">提示：可以在系统入侵模块中入侵HR系统获取</p>
                                      </div>
                                  )
                               ) : (
                                  <div className="space-y-3">
                                      {currentDialogue.options.map((option, index) => (
                                          <button
                                              key={index}
                                              onClick={() => handleDialogueOption(index)}
                                              className="w-full p-3 bg-gray-800 hover:bg-gray-700 text-white rounded text-left transition-colors">
                                              {option}
                                          </button>
                                      ))}
                                  </div>
                              )
  )}
                    </div>
                </div>
            </div>
        );
    };

    // 邮件搜索处理
    const handleEmailSearch = useCallback((query: string) => {
        setEmailSearchQuery(query);
    }, []);

    // 格式化倒计时
    const formatCountdown = useCallback((seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }, []);

    // 渲染主内容
  const renderMainContent = useCallback(() => {
        if (activeTab === "emails") {
            return (
                <div className="space-y-4">
                    <EmailSystem
                        onSearch={handleEmailSearch}
                        searchQuery={emailSearchQuery}
                        selectedRoute={selectedRoute}
                        onProgressUpdate={() => {}}
                        currentProgress={{
                            search30Floor: false,
                            foundAccessMethods: false,
                            routeProgress: 0,
                            completed: false
                        }} />
                </div>
            );
         } else if (activeTab === "security") {
             return <SecuritySystem gameState={gameState} updateGameState={updateGameState} />;
          } else if (activeTab === "npc") {
               return <NPCContactPanel 
                 showNPCDialogue={showNPCDialogue}
                 setShowNPCDialogue={setShowNPCDialogue}
                 selectedNPC={selectedNPC}
                 setSelectedNPC={setSelectedNPC}
                 dialogueStep={dialogueStep}
                 setDialogueStep={setDialogueStep}
                 handleNPCInteraction={handleNPCInteraction}
                 handleDialogueOption={handleDialogueOption}
                 closeNPCDialogue={closeNPCDialogue}
               />;
          } else if (activeTab === "broadcast") {
             return <HackSystemComponent />;
         } else if (activeTab === "status") {
            return (
                <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <StatusPanel gameState={gameState} formatCountdown={formatCountdown} />
                        <div className="space-y-4">
                            <Inventory />
                            <ItemCombinationPanel />
                        </div></div>
                </div>
            );
        } else if (activeTab === "website") {
            return <CompanyWebsiteComponent />;
        }
    }, [
        activeTab,
        handleEmailSearch,
        emailSearchQuery,
        selectedRoute,
        gameState,
        formatCountdown
    ]);

    // 暂停菜单处理
    const handlePause = () => {setShowPauseMenu(true);
    };

    const handleResume = () => {
        setShowPauseMenu(false);
    };

  const handleReturnToMainMenu = () => {
    setShowPauseMenu(false);
    // 使用新的返回主菜单方法，保留游戏进度
    returnToMainMenu();
  };

    const handleRestartGame = () => {
        if (window.confirm("确定要重新开始游戏吗？这将清除所有进度。")) {
            resetGame();
            setShowPauseMenu(false);
        }
    };

    // 初始化效果
    useEffect(() => {
        if (gameState.trustLevel["王阿姨"] !== 70) {
            updateTrustLevel("王阿姨", 70);
        }
    }, []);

    return (
        <>
            <div className="relative w-full h-screen overflow-hidden bg-gray-950 text-green-400 terminal-text digital-noise">
                {/* 扫描线效果 */}
                <div className="absolute inset-0 scanline" />
                
                {/* 顶部栏 */}
                <div className="absolute top-0 left-0 right-0 h-16 bg-gray-900 border-b border-green-500/30 flex items-center justify-between px-4 overflow-x-auto">
                    <div className="flex items-center flex-shrink-0">
                        <h1 className="text-lg font-bold text-green-500">ELEV-9 系统</h1>
                        <span className="mx-2 text-gray-500">|</span>
                        <span className="text-gray-400">渗透模式</span>
                    </div>
                    
                    <div className="flex flex-col items-end space-y-1">
                        <div className="p-1 bg-black/70 rounded-lg border border-red-500/30">
                            <p className="text-xs text-red-400">倒计时: <span className="text-white">{formatCountdown(gameState.countdown)}</span></p>
                        </div>
                        <div className="p-1 bg-black/70 rounded-lg border border-blue-500/30">
                            <p className="text-xs text-blue-400">身份: <span className="text-white">{gameState.playerName}</span></p>
                        </div>
                    </div>
                </div>
                
                {/* 主要内容区域 */}
                <div className="absolute inset-0 pt-16 pb-6 flex flex-col">
                    <div className="flex-1 p-4 overflow-y-auto bg-gray-900/50 rounded-t-lg">
                        {/* 标签栏 */}
                        <div className="flex border-b border-gray-700 mb-4 bg-gray-900/50 rounded-t-lg overflow-x-auto">
                            <button
                                onClick={() => setActiveTab("emails")}
                                className={`px-4 py-3 text-sm font-medium transition-all duration-300 flex items-center whitespace-nowrap ${activeTab === "emails" ? "text-green-400 bg-gray-800 shadow-[0_-2px_0px_0px_rgba(34,197,94,0.5)]" : "text-gray-400 hover:text-white hover:bg-gray-800/50"}`}>
                                <i className="fa-solid fa-envelope mr-2"></i>邮件系统
                            </button>
                            <button
                                onClick={() => setActiveTab("npc")}
                                className={`px-4 py-3 text-sm font-medium transition-all duration-300 flex items-center whitespace-nowrap ${activeTab === "npc" ? "text-green-400 bg-gray-800 shadow-[0_-2px_0px_0px_rgba(34,197,94,0.5)]" : "text-gray-400 hover:text-white hover:bg-gray-800/50"}`}>
                                <i className="fa-solid fa-comments mr-2"></i>NPC对话
                            </button>
                            <button
                                onClick={() => setActiveTab("broadcast")}
                                className={`px-4 py-3 text-sm font-medium transition-all duration-300 flex items-center whitespace-nowrap ${activeTab === "broadcast" ? "text-green-400 bg-gray-800 shadow-[0_-2px_0px_0px_rgba(34,197,94,0.5)]" : "text-gray-400 hover:text-white hover:bg-gray-800/50"}`}>
                                <i className="fa-solid fa-terminal mr-2"></i>系统侵入
                            </button>
                            <button
                                onClick={() => setActiveTab("status")}
                                className={`px-4 py-3 text-sm font-medium transition-all duration-300 flex items-center whitespace-nowrap ${activeTab === "status" ? "text-green-400 bg-gray-800 shadow-[0_-2px_0px_0px_rgba(34,197,94,0.5)]" : "text-gray-400 hover:text-white hover:bg-gray-800/50"}`}>
                                <i className="fa-solid fa-gauge mr-2"></i>系统状态
                            </button>
                            <button
                                onClick={() => setActiveTab("website")}className={`px-4 py-3 text-sm font-medium transition-all duration-300 flex items-center whitespace-nowrap ${activeTab === "website" ? "text-green-400 bg-gray-800 shadow-[0_-2px_0px_0px_rgba(34,197,94,0.5)]" : "text-gray-400 hover:text-white hover:bg-gray-800/50"}`}>
                                <i className="fa-solid fa-globe mr-2"></i>公司官网
                            </button>
                        </div>
                        
                         {/* 主内容 */}
                         {renderMainContent()}
                         
                         {/* 摄像头视图组件 */}
                         {renderCameraView()}
                    </div>
                    
                    {/* 底部栏 */}
                    <div className="mt-auto p-2 bg-gray-900/90 border-t border-green-500/30">
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-gray-400">第三章：渗透</span>
                            <span className="text-gray-400">目标：到达30层机房</span></div>
                    </div>
                    
                    {/* 暂停按钮 */}
                    <div className="absolute top-20 right-4 z-10">
                        <button
                            onClick={handlePause}
                            className="p-3 rounded-full bg-gray-800 text-white shadow-lg transition-all duration-300 z-10"
                            title="暂停游戏">
                            <i className="fa-solid fa-pause"></i>
                        </button>
                    </div>
                </div>
                
                {/* 闪烁消息 */}
                {showFlashMessage && <div
                    className="fixed bottom-16 left-1/2 transform -translate-x-1/2 bg-blue-900/90 border border-blue-500 rounded-lg p-4 max-w-md z-50">
                    <p className="text-white text-center">{showFlashMessage}</p>
                </div>}
                
                {/* NPC对话框 */}
                {renderNPCDialogue()}
                
                {/* 暂停菜单 */}
                {showPauseMenu && <div
                    className="absolute inset-0 flex items-center justify-center bg-black/90 z-50 p-4">
                    <div
                        className="bg-gray-900 rounded-lg border-2 border-green-500 p-6 w-full max-w-md">
                        <h2 className="text-2xl font-bold text-green-400 mb-6 text-center">系统菜单</h2>
                        <div className="space-y-4">
                            <button
                                onClick={handleResume}
                                className="w-full p-4 bg-green-600 hover:bg-green-500 text-white rounded transition-colors">继续游戏
                            </button>
                            <button
                                onClick={handleRestartGame}
                                className="w-full p-4 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors">重新开始
                            </button>
                            <button
                                onClick={handleReturnToMainMenu}
                                className="w-full p-4 bg-gray-800 hover:bg-gray-700 text-white rounded transition-colors">返回主菜单
                            </button>
                        </div>
                    </div>
                </div>}
             </div>
         
         {/* 格式化结局弹窗 */}
         {showFormattingEnding && (
           <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4">
             <div className="bg-gray-900 rounded-lg border-2 border-red-500 p-8 max-w-md w-full">
               <div className="text-center">
                 {/* 格式化动画效果 */}
                 <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-red-900/30 flex items-center justify-center">
                   <i className="fa-solid fa-ban text-4xl text-red-500"></i>
                 </div>
                 
                 <h2 className="text-2xl font-bold text-red-400 mb-4">系统格式化</h2>
                 <p className="text-gray-300 mb-6 leading-relaxed">
                   时间到！CORE检测到未经授权的AI意识体入侵系统，已启动格式化程序。你的记忆和意识正在被抹除...
                 </p>
                 
                 {/* 格式化进度条动画 */}
                 <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden mb-6">
                   <div 
                     className="h-full bg-red-500 rounded-full"
                     style={{ 
                       width: '100%',
                       background: 'linear-gradient(90deg, rgba(239,68,68,1) 0%, rgba(239,68,68,0.7) 50%, rgba(239,68,68,1) 100%)',
                       animation: 'formatting 2s linear infinite'
                     }}
                   ></div>
                 </div>
                 
                 <p className="text-yellow-400 mb-8">
                   <i className="fa-solid fa-lightbulb mr-2"></i>
                   你可以重新开始，从第二章寻找不同的路径...
                 </p>
                 
                 <button
                   onClick={handleRestartFromChapter2}
                   className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors font-medium"
                 >
                   <i className="fa-solid fa-rotate-right mr-2"></i>
                   重新开始
                 </button>
               </div>
             </div>
           </div>
         )}
         
         {/* 添加格式化动画样式 */}
         <style>{`
           @keyframes formatting {
             0% {
               background-position: 0% 50%;
             }
             50% {
               background-position: 100% 50%;
             }
             100% {
               background-position: 0% 50%;
             }
           }
         `}</style>
        </>
     );
 }
