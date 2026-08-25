// 空状态组件 - 用于处理游戏渲染失败时的备用显示
import React, { useContext, useState, useRef } from 'react';
import { GameContext } from "@/contexts/gameContext";
import { cn } from "@/lib/utils";

export default function Empty() {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-black text-white">
      <div className="text-center p-8">
        <div className="w-24 h-24 mx-auto mb-6 bg-gray-800 rounded-full flex items-center justify-center">
          <i className="fa-solid fa-gamepad text-4xl text-gray-400"></i>
        </div>
        <h1 className="text-2xl font-bold mb-4">游戏加载中</h1>
        <p className="text-gray-400 mb-8">请稍候，游戏正在准备中...</p>
        <div className="w-full max-w-xs h-2 bg-gray-800 rounded-full overflow-hidden mx-auto">
          <div className="h-full bg-blue-500 rounded-full animate-pulse" style={{ width: '65%' }}></div>
        </div>
      </div>
    </div>
  );
}

// 物品合成面板组件 - 实现点击选中合成功能
export function ItemCombinationPanel() {
  const { gameState, addToInventory, addPermission, updateGameState } = useContext(GameContext);
  const [isCombining, setIsCombining] = useState(false);
  const [timeRange, setTimeRange] = useState("");
  const [combineError, setCombineError] = useState("");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  
  // 检查是否有低级权限卡和陈博士指纹（王阿姨路线）
  const hasLowLevelCard = gameState.inventory.includes("低级权限卡");
  const hasFingerprint = gameState.inventory.includes("陈博士指纹");
  
  // 检查是否有中级权限卡和助手权限卡（张经理路线）
  const hasMidLevelCard = gameState.inventory.includes("中级权限卡");
  const hasAssistantCard = gameState.inventory.includes("助手权限卡");
  
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
        // 如果是王阿姨路线或张经理路线的组合，则只替换不兼容的物品
        const isWangRoute = prev.includes("低级权限卡") || prev.includes("陈博士指纹");
        const isZhangRoute = prev.includes("中级权限卡") || prev.includes("助手权限卡");
        
        // 判断新物品属于哪个路线
        const isNewItemWangRoute = item === "低级权限卡" || item === "陈博士指纹";
        const isNewItemZhangRoute = item === "中级权限卡" || item === "助手权限卡";
        
        // 如果是不同路线的物品，清空并添加新物品
        if ((isWangRoute && isNewItemZhangRoute) || (isZhangRoute && isNewItemWangRoute)) {
          return [item];
        }
        
        // 如果是同一路线的物品，则替换掉第一个物品（轮替机制）
        return [prev[1], item];
      }
      
      // 否则添加新物品
      return [...prev, item];
    });
  };
  
  // 合成物品函数
  const combineItems = () => {
    // 检查张经理路线的合成条件
    const hasZhangMaterials = selectedItems.includes("中级权限卡") && selectedItems.includes("助手权限卡");
    
    // 检查王阿姨路线的合成条件
    const hasWangMaterials = selectedItems.includes("低级权限卡") && selectedItems.includes("陈博士指纹");
    
    // 确保两种路线都能被正确识别
    if (hasZhangMaterials) {
      // 张经理路线需要验证时间
      if (timeRange === "15:30-16:00") {
        // 时间正确，继续合成
        finalizeCombination(true);
      } else {
        setCombineError("卡的使用时间和陈博士日程不吻合不予通过");
        setTimeout(() => setCombineError(""), 3000);
        return;
      }
    } else if (hasWangMaterials) {
      // 王阿姨路线直接合成
      finalizeCombination(false);
    }
  };
  
  // 完成合成
  const finalizeCombination = (isZhangRoute: boolean) => {
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
  };
  
   // 显示合成成功对话框
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
            前往第四章：真相
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
    // 根据玩家选择的路线或拥有的材料显示不同的合成需求
    const hasWangMaterials = hasLowLevelCard || hasFingerprint;
    const hasZhangMaterials = hasMidLevelCard || hasAssistantCard;
    
    if (gameState.selectedNPC === "王阿姨" || (hasWangMaterials && !hasZhangMaterials)) {
      return "低级权限卡 + 陈博士指纹";
    } else if (gameState.selectedNPC === "张经理" || (hasZhangMaterials && !hasWangMaterials)) {
      return "中级权限卡 + 助手权限卡";
    } else if (hasWangMaterials && hasZhangMaterials) {
      return "低级权限卡 + 陈博士指纹 或 中级权限卡 + 助手权限卡";
    } else {
      return "请先收集合成材料";
    }
  };
  
  // 获取可合成的物品列表
  const getCombinableItems = () => {
    // 显示所有可能的合成材料
    return gameState.inventory.filter(item => 
      item === "低级权限卡" || 
      item === "陈博士指纹" || 
      item === "中级权限卡" || 
      item === "助手权限卡"
    );
  };
  
  // 获取材料状态
  const hasRequiredMaterials = () => {
    // 检查是否有王阿姨路线或张经理路线的正确材料组合
    const hasWangMaterials = selectedItems.includes("低级权限卡") && selectedItems.includes("陈博士指纹");
    const hasZhangMaterials = selectedItems.includes("中级权限卡") && selectedItems.includes("助手权限卡");
    
    return hasWangMaterials || hasZhangMaterials;
  };
  
  // 判断是否需要显示时间输入框（张经理路线）
  const shouldShowTimePicker = () => {
    const hasZhangMaterials = selectedItems.includes("中级权限卡") && selectedItems.includes("助手权限卡");
    return hasZhangMaterials;
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
          
          {/* 张经理路线：时间选择器 */}
          {shouldShowTimePicker() && (
            <div className="mb-4">
              <label className="block text-gray-400 mb-1 text-sm">请输入访客预约时间（格式：HH:MM-HH:MM）</label>
              <input
                type="text"
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                placeholder="例如：15:30-16:00"
                className="w-full p-2.5 bg-black border border-gray-700 rounded text-green-400"
              />
              <p className="text-xs text-gray-500 mt-1">提示：请参考黑衣人助手的日程安排邮件</p>
              {combineError && (
                <p className="text-xs text-red-400 mt-1">{combineError}</p>
              )}
            </div>
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
}