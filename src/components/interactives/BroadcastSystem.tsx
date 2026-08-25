import { useContext, useState } from "react";
import { GameContext } from "@/contexts/gameContext";

interface BroadcastSystemProps {
  onClose?: () => void;
  onHackComplete?: () => void;
}

export default function BroadcastSystem({ onClose, onHackComplete }: BroadcastSystemProps) {
  const { gameState, updateGameState, addPermission, addDiscoveredClue, addToInventory } = useContext(GameContext);
  const [isHacking, setIsHacking] = useState(false);
  const [hackStep, setHackStep] = useState(0);
  const [showHackSuccess, setShowHackSuccess] = useState(false);
  const [selectedSystem, setSelectedSystem] = useState("financial");
  const [progressPercentage, setProgressPercentage] = useState(0);
  
  // 财务系统入侵步骤
  const financialSteps = [
    "1. 连接财务系统数据库",
    "2. 破解防火墙保护",
    "3. 定位张经理相关交易记录",
    "4. 分析异常数据模式",
    "5. 修改数据日志，消除异常痕迹",
    "6. 植入自动清理脚本",
    "7. 断开连接，清理入侵痕迹"
  ];
  
  // HR系统入侵步骤
  const hrSteps = [
    "1. 连接HR系统内部网络",
    "2. 绕过身份验证模块",
    "3. 访问员工数据库",
    "4. 提取权限卡相关信息",
    "5. 分析权限结构",
    "6. 查找系统漏洞",
    "7. 断开连接，清理入侵痕迹"
  ];
  
  // 获取当前入侵步骤
  const getCurrentSteps = () => {
    return selectedSystem === "financial" ? financialSteps : hrSteps;
   };
   
   // 显示保留证据选择对话框
   const showEvidenceChoiceDialog = () => {
     const dialog = document.createElement('div');
     dialog.className = 'fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4';
     dialog.innerHTML = `
       <div class="bg-gray-900 rounded-lg border-2 border-yellow-500 p-6 max-w-md w-full mx-4">
         <div class="text-center">
           <i class="fa-solid fa-file-circle-exclamation text-4xl text-yellow-400 mb-4"></i>
           <h3 class="text-xl font-bold text-white mb-4">发现异常财务记录</h3>
           <p class="text-gray-300 mb-6">你发现了张经理的贪污证据，是否保留这些证据？</p>
           <div class="space-y-3">
             <button id="keepEvidenceBtn" class="w-full p-3 bg-blue-600 hover:bg-blue-500 text-white rounded transition-colors">
               保留证据
             </button>
             <button id="deleteEvidenceBtn" class="w-full p-3 bg-red-600 hover:bg-red-500 text-white rounded transition-colors">
               删除证据
             </button>
           </div>
         </div>
       </div>
     `;
     
     document.body.appendChild(dialog);
     
     const keepEvidenceBtn = dialog.querySelector('#keepEvidenceBtn');
     const deleteEvidenceBtn = dialog.querySelector('#deleteEvidenceBtn');
     
     if (keepEvidenceBtn) {
       keepEvidenceBtn.addEventListener('click', () => {
         // 保留证据，获得物品
         if (!gameState.inventory.includes("张经理贪污证据")) {
           addToInventory("张经理贪污证据");
         }
         document.body.removeChild(dialog);
       });
     }
     
     if (deleteEvidenceBtn) {
       deleteEvidenceBtn.addEventListener('click', () => {
         // 删除证据，道德值-20
         updateGameState({
           moralLevel: Math.max(0, gameState.moralLevel - 20)
         });
         document.body.removeChild(dialog);
       });
     }
   };
  
  // 开始黑客入侵
  const startHacking = () => {
    setIsHacking(true);
    setHackStep(0);
    setShowHackSuccess(false);
    setProgressPercentage(0);
  };
  
  // 下一步操作
  const nextHackStep = () => {
    const steps = getCurrentSteps();
    
    if (hackStep < steps.length - 1) {
      setHackStep(hackStep + 1);
      // 更新进度百分比
      const newProgress = Math.floor(((hackStep + 1) / steps.length) * 100);
      setProgressPercentage(newProgress);
    } else {
      // 完成操作
      setProgressPercentage(100);
      
     setTimeout(() => {
      setShowHackSuccess(true);
      
      if (selectedSystem === "financial") {
        addDiscoveredClue("financialSystemHacked");
        addPermission("financialSystemAccess");
        // 完成财务平帐任务
        updateGameState({ financialBooksFixed: true });
        
        // 添加财务系统平帐截图到物品栏
        if (!gameState.inventory.includes("财务系统平帐截图")) {
          addToInventory("财务系统平帐截图");
        }
        
        // 显示保留证据选择对话框
        setTimeout(() => {
          showEvidenceChoiceDialog();
        }, 500);
      } else {
        addDiscoveredClue("hrSystemHacked");
        addPermission("hrSystemAccess");
      }
      
      // 通知父组件操作完成
      if (onHackComplete) {
        onHackComplete();
      }
    }, 500);
    }
  };
  
  // 重置操作
  const resetHacking = () => {
    setIsHacking(false);
    setHackStep(0);
    setShowHackSuccess(false);
    setProgressPercentage(0);
  };
  
  return (
    <div className="space-y-4">
      {/* 主界面 - 未进行任何操作时显示 */}
      {!isHacking && !showHackSuccess ? (
        <div className="p-3 bg-gray-900 rounded-lg border border-gray-700">
          <h3 className="text-base font-bold text-white mb-3">系统侵入</h3>
          <p className="text-gray-400 mb-3 text-sm">通过此系统可以侵入大楼内的各种企业系统，获取权限或修改数据。</p>
          
          <div className="space-y-3">
            <div>
              <label className="block text-gray-400 mb-1 text-sm">选择目标系统</label>
              <select 
                className="w-full p-2.5 bg-black border border-gray-700 rounded text-green-400 text-sm" 
                value={selectedSystem}
                onChange={(e) => setSelectedSystem(e.target.value)}
              >
                <option value="financial">财务系统</option>
                <option value="hr">HR系统</option>
              </select>
            </div>
            
            <div className="p-2 bg-blue-900/20 border border-blue-500/30 rounded-lg">
              <p className="text-xs text-blue-400">
                <i className="fa-solid fa-lightbulb mr-1"></i>
                {selectedSystem === "financial" 
                  ? "入侵财务系统可以帮助张经理平帐，提高他的信任度" 
                  : "入侵HR系统可能获取员工权限卡相关信息"}
              </p>
            </div>
            
            <button 
              className="w-full p-2.5 bg-red-600 hover:bg-red-500 text-white rounded transition-colors text-sm"
              onClick={startHacking}
            >
              <i className="fa-solid fa-terminal mr-2"></i> 开始侵入
            </button>
          </div>
        </div>
      ) : (
        // 操作进行中或完成界面
        <>
          {showHackSuccess ? (
            // 入侵成功界面
            <div className="p-3 bg-green-900/30 rounded-lg border border-green-500">
              <div className="flex justify-between items-center">
                <h3 className="text-base font-bold text-green-400 mb-3">侵入成功！</h3>
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <i className="fa-solid fa-check text-white text-xl"></i>
                </div>
              </div>
              
              <p className="text-white mb-3 text-sm">
                {selectedSystem === "financial" 
                  ? "已成功入侵财务系统，修改了相关交易记录，消除了异常痕迹。" 
                  : "已成功入侵HR系统，获取了员工数据库的访问权限。"}
              </p>
              
              <div className="p-2 bg-black/50 rounded-lg mb-3">
                <p className="text-green-400 text-xs font-mono">
                  {'>'} 系统安全模块绕过完成<br />
                  {'>'} 数据修改成功<br />
                  {'>'} 入侵痕迹已清除<br />
                  {'>'} 系统状态：正常<br />
                  {'>'} 连接已断开
                </p>
              </div>
              
              {selectedSystem === "financial" && (
                <p className="text-yellow-400 mb-3 text-sm">
                  <i className="fa-solid fa-circle-info mr-1"></i> 任务完成：财务系统平帐
                </p>
              )}
              
              <button 
                className="w-full p-2.5 bg-gray-800 hover:bg-gray-700 text-white rounded transition-colors text-sm"
                onClick={resetHacking}
              >
                返回
              </button>
            </div>
          ) : (
            // 操作进行中界面
            <div className="p-3 bg-gray-900 rounded-lg border border-red-500">
              <h3 className="text-base font-bold text-red-400 mb-3">
                {selectedSystem === "financial" ? "财务系统侵入流程" : "HR系统侵入流程"}
              </h3>
              
              {/* 进度条 */}
              <div className="mb-4">
                <div className="flex justify-between mb-1">
                  <span className="text-xs text-gray-400">侵入进度</span>
                  <span className="text-xs text-green-400">{progressPercentage}%</span>
                </div>
                <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500 rounded-full transition-all duration-500" 
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              </div>
              
              <p className="text-gray-400 mb-3 text-sm">
                请按照以下步骤{selectedSystem === "financial" ? "侵入财务系统" : "侵入HR系统"}：
              </p>
              
              <div className="space-y-3 mb-4">
                {getCurrentSteps().map((step, index) => (
                  <div 
                    key={index} 
                    className={`p-3 rounded-lg flex items-center ${
                      index < hackStep 
                        ? 'bg-green-900/30 border border-green-500' 
                        : index === hackStep 
                          ? 'bg-yellow-900/30 border border-yellow-500' 
                          : 'bg-gray-800 border border-gray-700'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                      index < hackStep 
                        ? 'bg-green-500' 
                        : index === hackStep 
                          ? 'bg-yellow-500' 
                          : 'bg-gray-700'
                    }`}>
                      {index < hackStep ? (
                        <i className="fa-solid fa-check text-white text-xs"></i>
                      ) : (
                        <span className="text-white text-xs">{index + 1}</span>
                      )}
                    </div>
                    <span className={`text-sm ${
                      index < hackStep 
                        ? 'text-green-400' 
                        : index === hackStep 
                          ? 'text-yellow-400' 
                          : 'text-gray-400'
                    }`}>{step}</span>
                  </div>
                ))}
              </div>
              
              <div className="flex space-x-3">
                <button 
                  className={`flex-1 p-2.5 rounded transition-colors text-sm ${
                    hackStep > 0 
                      ? 'bg-blue-600 hover:bg-blue-500 text-white' 
                      : 'bg-gray-700 cursor-not-allowed text-gray-400'
                  }`}
                  onClick={() => hackStep > 0 && setHackStep(hackStep - 1)}
                  disabled={hackStep === 0}
                >
                  上一步
                </button>
                <button 
                  className="flex-1 p-2.5 bg-green-600 hover:bg-green-500 text-white rounded transition-colors text-sm"
                  onClick={nextHackStep}
                >
                  {hackStep < getCurrentSteps().length - 1 ? '下一步' : '完成侵入'}
                </button>
              </div>
              
              <button 
                className="w-full mt-3 p-2 bg-gray-800 hover:bg-gray-700 text-white rounded transition-colors text-sm"
                onClick={resetHacking}
              >
                取消
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}