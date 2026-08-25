import { useContext, useState } from "react";
import { GameContext } from "@/contexts/gameContext";

export default function Inventory() {
  const { gameState, addPermission, updateGameState } = useContext(GameContext);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [loginInfo, setLoginInfo] = useState({
    username: "",
    password: ""
  });
  const [loginError, setLoginError] = useState(false);
  
  const getItemIcon = (itemName: string) => {
    if (itemName.includes("手机"))
      return "fa-mobile-screen";

    if (itemName.includes("权限卡"))
      return "fa-id-card";

    if (itemName.includes("指纹"))
      return "fa-fingerprint";

    if (itemName.includes("医疗账单"))
      return "fa-file-invoice-medical";

    return "fa-box";
  };
  
  // 处理物品点击事件
  const handleItemClick = (item: string) => {
    // 中级权限卡特殊处理
    if (item === "中级权限卡") {
      setShowLoginDialog(true);
      setLoginError(false);
    }
  };
  
  // 处理登录表单提交
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 陈博士助手账号验证
    if (loginInfo.username === "lms3158" && loginInfo.password === "20251015") {
      // 验证成功，添加30楼访问权限并进入第四章
      if (!gameState.permissions.includes("30FloorAccess")) {
        addPermission("30FloorAccess");
      }
      updateGameState({
        currentChapter: "chapter4",
        currentStage: "completed"
      });
      setShowLoginDialog(false);
    } else {
      // 验证失败
      setLoginError(true);
      setTimeout(() => setLoginError(false), 2000);
    }
  };
  
  // 处理中级权限卡点击
  const handleMiddleLevelCardClick = () => {
    setShowLoginDialog(true);
    setLoginError(false);
  };
  
  return (
    <div className="p-3 bg-gray-900 rounded-lg border border-gray-700">
      <h3 className="text-base font-bold text-white mb-3">物品栏</h3>
      <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
        {gameState.inventory.length > 0 ? gameState.inventory.map((item, index) => {
          // 特殊处理中级权限卡的点击事件
          const isMiddleLevelCard = item === "中级权限卡";
          
          return (
            <div
              key={index}
              className={`p-2 bg-gray-800 rounded-lg text-center border border-gray-700 hover:border-green-500 transition-colors ${
                isMiddleLevelCard && gameState.selectedNPC === "张经理" && !gameState.permissions.includes("30FloorAccess") 
                  ? "cursor-pointer hover:bg-blue-900/30 border-blue-500/50" 
                  : ""
              }`}
              title={item}
              onClick={isMiddleLevelCard ? handleMiddleLevelCardClick : undefined}
            >
              <i className={`fa-solid ${getItemIcon(item)} text-yellow-400 text-lg mb-1`}></i>
              <p className="text-xs text-gray-300 truncate">{item}</p>
              {/* 添加提示文字 */}
              {isMiddleLevelCard && gameState.selectedNPC === "张经理" && !gameState.permissions.includes("30FloorAccess") && (
                <p className="text-xs text-blue-400 mt-1">点击使用</p>
              )}
            </div>
          );
        }) : <div className="col-span-full p-4 text-center text-gray-500">
            <p>暂无物品</p>
        </div>}
      </div>
      <p className="text-xs text-gray-400 mt-2 text-center">物品可以用于合成更高级的道具</p>
      
      {/* 登录对话框 */}
      {showLoginDialog && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg border-2 border-blue-500 p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-blue-400 mb-4">系统验证</h3>
            <p className="text-white mb-6">请输入陈博士助手账号和密码以获取30楼访问权限</p>
            
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-400 mb-1">账号</label>
                <input
                  type="text"
                  value={loginInfo.username}
                  onChange={(e) => setLoginInfo({...loginInfo, username: e.target.value})}
                  className="w-full p-2.5 bg-black border border-gray-700 rounded text-green-400"
                  placeholder="请输入账号"
                  autoComplete="off"
                />
              </div>
              
              <div>
                <label className="block text-gray-400 mb-1">密码</label>
                <p className="text-xs text-gray-500 mb-1">密码为数字</p>
                <input
                  type="password"
                  value={loginInfo.password}
                  onChange={(e) => setLoginInfo({...loginInfo, password: e.target.value})}
                  className="w-full p-2.5 bg-black border border-gray-700 rounded text-green-400"
                  placeholder="请输入密码"
                  autoComplete="off"
                />
              </div>
              
              {loginError && (
                <p className="text-red-400 text-sm text-center">
                  <i className="fa-solid fa-triangle-exclamation mr-1"></i>账号或密码错误
                </p>
              )}
              
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowLoginDialog(false)}
                  className="flex-1 p-2.5 bg-gray-800 hover:bg-gray-700 text-white rounded transition-colors"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="flex-1 p-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded transition-colors"
                >
                  确认
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}