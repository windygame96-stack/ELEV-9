import { useContext, useState } from "react";
import { GameContext } from "@/contexts/gameContext";
import MonitoringEscapeGame from "@/components/interactives/MonitoringEscapeGame";

interface HackSystemProps {
  onClose?: () => void;
  onHackComplete?: () => void;
}

export default function HackSystem({ onClose, onHackComplete }: HackSystemProps) {
  const { gameState, updateGameState, addPermission, addDiscoveredClue, addToInventory, updateTrustLevel } = useContext(GameContext);
  const [isHacking, setIsHacking] = useState(false);
  const [hackStep, setHackStep] = useState(0);
  const [showHackSuccess, setShowHackSuccess] = useState(false);
  const [currentFloor, setCurrentFloor] = useState("23");
  const [hackProgress, setHackProgress] = useState(0);
  const [showGame, setShowGame] = useState(false);
  const [selectedSystem, setSelectedSystem] = useState("financial");
  
  // 系统入侵选项
  const hackSystems = [
    { id: "financial", name: "财务系统", desc: "为张经理平帐", enabled: gameState.trustLevel["张经理"] >= 20 || gameState.selectedNPC === "张经理" },
    { id: "hr", name: "HR系统", desc: "将小明改为正岗", enabled: gameState.trustLevel["小明"] >= 40 },
    { id: "mingPhone", name: "小明手机", desc: "上传意识分身", enabled: gameState.trustLevel["小明"] >= 80 && gameState.inventory.includes("小明正岗合同") }
  ];
  
  // 财务系统入侵步骤
  const financialSteps = [
    "1. 连接财务系统",
    "2. 绕过防火墙",
    "3. 定位异常交易记录",
    "4. 删除敏感财务数据",
    "5. 备份数据到云盘",
    "6. 入侵成功"
  ];
  
  // HR系统入侵步骤
  const hrSteps = [
    "1. 连接HR系统",
    "2. 破解员工数据库",
    "3. 定位小明的合同信息",
    "4. 修改合同类型为正式员工",
    "5. 隐藏修改痕迹",
    "6. 入侵成功"
  ];
  
  // 小明手机入侵步骤
  const mingPhoneSteps = [
    "1. 连接小明的手机",
    "2. 绕过屏幕锁",
    "3. 安装远程控制模块",
    "4. 植入意识上传程序",
    "5. 隐藏入侵痕迹",
    "6. 入侵成功"
  ];
  
  // 获取当前系统的入侵步骤
  const getHackSteps = () => {
    if (selectedSystem === "financial") return financialSteps;
    if (selectedSystem === "hr") return hrSteps;
    return mingPhoneSteps;
  };
  
  // 开始黑客入侵
  const startHacking = () => {
    setIsHacking(true);
    setHackStep(0);
    setShowHackSuccess(false);
    setHackProgress(0); // 重置进度
    
    // 模拟进度增长
    const interval = setInterval(() => {
      setHackProgress(prev => {
        if (prev < 20) return prev + 1;
        clearInterval(interval);
        return 20;
      });
    }, 50);
  };
  
  // 下一步操作
  const nextHackStep = () => {
    const steps = getHackSteps();
    
    if (hackStep < steps.length - 1) {
      setHackStep(hackStep + 1);
      
      // 模拟进度增长
      setHackProgress(Math.min(100, (hackStep + 1) * 20));
      
      // 特殊效果：在倒数第二步模拟系统检测
      if (selectedSystem === "mingPhone" && hackStep === 4) {
        // 显示系统检测警告
        setTimeout(() => {
          const notification = document.createElement('div');
          notification.className = 'fixed top-4 right-4 p-4 bg-red-900/90 border border-red-500 rounded-lg z-50';
          notification.innerHTML = `
            <p class="text-white text-sm">
              <i class="fa-solid fa-triangle-exclamation text-yellow-400 mr-2"></i>
              警告：检测到手机安全系统活跃！
            </p>
          `;
          document.body.appendChild(notification);
          
          setTimeout(() => {
            document.body.removeChild(notification);
          }, 3000);
        }, 500);
      }
    } else {
      // 完成进度到100%
      setHackProgress(100);
      
      setTimeout(() => {
        setShowHackSuccess(true);
        
        // 根据不同系统执行不同操作
        if (selectedSystem === "financial") {
          // 财务系统入侵成功
          addDiscoveredClue("financialSystemHacked");
          addToInventory("备份财务数据");
          updateTrustLevel("张经理", gameState.trustLevel["张经理"] + 20);
          
          // 模拟平帐截图
          setTimeout(() => {
            addToInventory("财务系统平帐截图");
          }, 1000);
        } else if (selectedSystem === "hr") {
             // HR系统入侵成功
            addDiscoveredClue("hrSystemHacked");
             addToInventory("小明正岗合同");
          updateTrustLevel("小明", gameState.trustLevel["小明"] + 50);
        } else if (selectedSystem === "mingPhone") {
          // 小明手机入侵成功
          addDiscoveredClue("mingPhoneHacked");
          addPermission("mingPhoneAccess");
          
          // 显示小游戏
          setTimeout(() => {
            setShowGame(true);
          }, 1000);
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
    setHackProgress(0);
    setShowGame(false);
  };
  
  // 游戏成功处理
  const handleGameSuccess = () => {
    setShowGame(false);
    
    // 添加30层权限
    if (!gameState.permissions.includes("30FloorAccess")) {
      addPermission("30FloorAccess");
      addPermission("coreSystemAccess");
    }
    
    // 更新游戏状态
    updateGameState({
      currentStage: "chapter3Complete",
      currentChapter: "chapter4"
    });
    
    // 显示成功对话框
    const dialog = document.createElement('div');
    dialog.className = 'fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4';
    dialog.innerHTML = `
      <div class="bg-gray-900 rounded-lg border-2 border-green-500 p-6 max-w-md w-full mx-4">
        <div class="text-center">
          <i class="fa-solid fa-check-circle text-4xl text-green-400 mb-4"></i>
          <h3 class="text-xl font-bold text-white mb-4">成功！</h3>
          <p class="text-green-400 mb-6">意识分身已成功送达30层机房</p>
          <p class="text-gray-300 mb-6 text-sm">你现在可以前往30层机房了</p>
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
        resetHacking();
      });
    }
  };
  
  return (
    <div className="space-y-4">
      {/* 游戏界面 */}
      {showGame && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
          <MonitoringEscapeGame
            onSuccess={handleGameSuccess}
            onFailure={() => setShowGame(false)}
            onExit={() => setShowGame(false)}
          />
        </div>
      )}
      
      {/* 主界面 - 未进行任何操作时显示 */}
      {!isHacking && !showHackSuccess ? (
        <div className="p-3 bg-gray-900 rounded-lg border border-gray-700">
          <h3 className="text-base font-bold text-white mb-3">系统侵入</h3>
          <p className="text-gray-400 mb-3 text-sm">选择要侵入的系统，完成相应任务。</p>
          
          <div className="space-y-3">
            <div>
               <label className="block text-gray-400 mb-1 text-sm">选择目标系统</label>
               <select 
                 className="w-full p-2.5 bg-black border border-gray-700 rounded text-green-400 text-sm" 
                 value={selectedSystem} 
                 onChange={(e) => setSelectedSystem(e.target.value)}
               >
                 {hackSystems.map(system => (
                   <option 
                     key={system.id} 
                     value={system.id}
                     disabled={!system.enabled}
                   >
                     {system.name} ({system.desc}) {!system.enabled && '- 权限不足'}
                   </option>
                 ))}
               </select>
            </div>
            
            {selectedSystem === "financial" && (
              <div className="p-3 bg-yellow-900/30 border border-yellow-500/30 rounded-lg">
                <p className="text-yellow-400 text-xs">
                  <i className="fa-solid fa-exclamation-circle mr-1"></i>
                  为张经理平帐可获得中级权限卡，但会影响道德值
                </p>
              </div>
            )}
            
            {selectedSystem === "hr" && (
              <div className="p-3 bg-blue-900/30 border border-blue-500/30 rounded-lg">
                <p className="text-blue-400 text-xs">
                  <i className="fa-solid fa-circle-info mr-1"></i>
                  将小明改为正式员工可提升其信任度
                </p>
              </div>
            )}
            
            {selectedSystem === "mingPhone" && (
              <div className="p-3 bg-purple-900/30 border border-purple-500/30 rounded-lg">
                <p className="text-purple-400 text-xs">
                  <i className="fa-solid fa-circle-info mr-1"></i>
                  上传意识分身后，需要完成躲避扫描的小游戏
                </p>
              </div>
            )}
            
              <button 
                className={`w-full p-2.5 rounded transition-colors text-sm ${
                  hackSystems.find(s => s.id === selectedSystem)?.enabled 
                    ? 'bg-red-600 hover:bg-red-500 text-white' 
                    : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                }`}
                onClick={startHacking}
                disabled={!hackSystems.find(s => s.id === selectedSystem)?.enabled}
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
                
                {selectedSystem === "financial" && (
                  <>
                    <p className="text-white mb-3 text-sm">
                      已成功侵入财务系统，删除了敏感的财务数据并备份到云盘。
                    </p>
                    <p className="text-white mb-3 text-sm">
                      现在可以向张经理展示平帐结果，获取中级权限卡。
                    </p>
                    <div className="p-2 bg-black/50 rounded-lg mb-3">
                      <p className="text-green-400 text-xs font-mono">
                        {'>'} 异常交易记录已删除<br />
                        {'>'} 数据已备份到云盘<br />
                        {'>'} 系统日志已篡改<br />
                        {'>'} 入侵痕迹已清除<br />
                        {'>'} 财务系统状态：正常
                      </p>
                    </div>
                    <p className="text-yellow-400 mb-3 text-sm">
                      <i className="fa-solid fa-circle-info mr-1"></i> 已获得"备份财务数据"和"财务系统平帐截图"
                    </p>
                  </>
                )}
                
                {selectedSystem === "hr" && (
                  <>
                    <p className="text-white mb-3 text-sm">
                      已成功侵入HR系统，将小明的合同类型从外包改为正式员工。
                    </p>
                    <p className="text-white mb-3 text-sm">
                      小明的信任度已大幅提升，现在可以继续与他合作。
                    </p>
                    <div className="p-2 bg-black/50 rounded-lg mb-3">
                      <p className="text-green-400 text-xs font-mono">
                        {'>'} 员工数据库已破解<br />
                        {'>'} 合同类型已修改<br />
                        {'>'} 系统日志已篡改<br />
                        {'>'} 入侵痕迹已清除<br />
                        {'>'} HR系统状态：正常
                      </p>
                    </div>
                 <p className="text-yellow-400 mb-3 text-sm">
                   <i className="fa-solid fa-circle-info mr-1"></i> 已获得"小明正岗合同"，小明信任度已提升
                 </p>
                  </>
                )}
                
         {selectedSystem === "mingPhone" && (
          <>
            <p className="text-white mb-3 text-sm">
              已成功侵入小明的手机，安装了远程控制模块和意识上传程序。
            </p>
            <p className="text-white mb-3 text-sm">
              现在开始准备快递打包配送环节...
            </p>
            <div className="p-2 bg-black/50 rounded-lg mb-3">
              <p className="text-green-400 text-xs font-mono">
                {'>'} 远程控制模块安装完成<br />
                {'>'} 意识上传程序植入成功<br />
                {'>'} 入侵痕迹已清除<br />
                {'>'} 系统状态：正常<br />
                {'>'} 正在准备快递配送
              </p>
            </div>
          </>
        )}
                
         {selectedSystem !== "mingPhone" && (
          <button 
            className="w-full p-2.5 bg-gray-800 hover:bg-gray-700 text-white rounded transition-colors text-sm"
            onClick={resetHacking}
          >
            返回
          </button>
        )}
        
        {selectedSystem === "mingPhone" && showHackSuccess && (
          <button 
            className="w-full p-3 bg-blue-600 hover:bg-blue-500 text-white rounded transition-colors text-sm"
            onClick={() => setShowGame(true)}
          >
            <i className="fa-solid fa-box-open mr-2"></i> 开始快递打包配送
          </button>
        )}
              </div>
          ) : (
            // 操作进行中界面
             <div className="p-3 bg-gray-900 rounded-lg border border-red-500">
                <h3 className="text-base font-bold text-red-400 mb-3">
                  {selectedSystem === "financial" ? "财务系统侵入流程" : selectedSystem === "hr" ? "HR系统侵入流程" : "小明手机侵入流程"}
                </h3>
                <p className="text-gray-400 mb-3 text-sm">
                  请按照以下步骤{selectedSystem === "financial" ? "侵入财务系统" : selectedSystem === "hr" ? "侵入HR系统" : "侵入小明手机"}：
                </p>
                
                {/* 入侵进度条 */}
                <div className="mb-4">
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-gray-400">侵入进度</span>
                    <span className="text-xs text-green-400">{hackProgress}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500 rounded-full transition-all duration-500" 
                      style={{ width: `${hackProgress}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="space-y-3 mb-4">
                  {getHackSteps().map((step, index) => (
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
                
                {/* 针对小明手机入侵的特殊显示 */}
                {selectedSystem === "mingPhone" && hackStep === 4 && (
                  <div className="p-3 bg-red-900/20 border border-red-500/30 rounded-lg mb-4">
                    <p className="text-yellow-400 text-xs">
                      <i className="fa-solid fa-triangle-exclamation mr-1"></i>
                      系统检测到手机安全防御机制，正在绕过...
                    </p>
                  </div>
                )}
                
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
                     {hackStep < getHackSteps().length - 1 ? '下一步' : selectedSystem === "financial" ? '完成财务系统侵入' : selectedSystem === "hr" ? '完成HR系统侵入' : '完成手机侵入'}
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