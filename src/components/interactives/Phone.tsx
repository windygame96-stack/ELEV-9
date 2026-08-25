import React, { useContext, useState, useEffect } from "react";
import { GameContext } from "@/contexts/gameContext";

interface PhoneProps {
  onClose: () => void;
  isUsingFlashlight: boolean;
  toggleFlashlight: () => void;
}

export default function Phone({ onClose, isUsingFlashlight, toggleFlashlight }: PhoneProps) {
  const { gameState, addDiscoveredClue } = useContext(GameContext);
  
  // 数字炸弹相关状态
  const [passwordGuess, setPasswordGuess] = useState("");
  const [attemptsLeft, setAttemptsLeft] = useState(10);
  const [feedback, setFeedback] = useState("");
  const [isFrozen, setIsFrozen] = useState(false);
  const [freezeTimeLeft, setFreezeTimeLeft] = useState(120); // 2分钟 = 120秒
  const [isUnlocked, setIsUnlocked] = useState(false);
  
  // 正确密码
  const correctPassword = "9253";
  
  // 检查密码
  const checkPassword = () => {
    if (isFrozen || passwordGuess.length !== 4) return;
    
    setAttemptsLeft(attemptsLeft - 1);
    
    if (passwordGuess === correctPassword) {
      // 密码正确
      setFeedback("密码正确！手机已解锁");
      setIsUnlocked(true);
      
      // 添加线索
      if (!gameState.discoveredClues.includes("phoneUnlocked")) {
        addDiscoveredClue("phoneUnlocked");
      }
    } else {
      // 计算xAxB反馈
      let a = 0;
      let b = 0;
      const guessArray = passwordGuess.split("");
      const correctArray = correctPassword.split("");
      
      // 计算A
      for (let i = 0; i < 4; i++) {
        if (guessArray[i] === correctArray[i]) {
          a++;
          guessArray[i] = "x";
          correctArray[i] = "y";
        }
      }
      
      // 计算B
      for (let i = 0; i < 4; i++) {
        if (guessArray[i] !== "x") {
          const index = correctArray.indexOf(guessArray[i]);
          if (index !== -1) {
            b++;
            correctArray[index] = "y";
          }
        }
      }
      
      setFeedback(`${a}A ${b}B`);
      
      // 如果用完了所有尝试机会
      if (attemptsLeft === 1) {
        setIsFrozen(true);
        setFeedback("尝试次数已用完，请等待2分钟后再试");
      }
    }
    
    // 清空输入
    setPasswordGuess("");
  };
  
  // 冻结时间倒计时
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    if (isFrozen) {
      interval = setInterval(() => {
        setFreezeTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsFrozen(false);
              setAttemptsLeft(10);
            setFeedback("");
            return 120;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isFrozen]);
  
  // 格式化冻结时间
  const formatFreezeTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/80 p-4">
      <div className="bg-gray-900 rounded-lg border-2 border-blue-500 max-w-xs w-full p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">手机</h2>
          <button 
            onClick={onClose}
            className="text-white hover:text-gray-400 transition-colors"
          >
            <i className="fa-solid fa-times"></i>
          </button>
        </div>
        
        {/* 手机状态 */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <p className="text-gray-400">电量</p>
            <p className="text-gray-300">80%</p>
          </div>
          <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-green-500" style={{ width: "80%" }}></div>
          </div>
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <p className="text-gray-400">信号</p>
            <p className="text-red-400">微弱</p>
          </div>
          <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-red-500" style={{ width: "20%" }}></div>
          </div>
        </div>
        
        {/* 手电筒开关 */}
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <i className={`fa-solid ${isUsingFlashlight ? 'fa-lightbulb text-yellow-400' : 'fa-lightbulb-slash text-gray-500'} mr-2`}></i>
              <p className="text-gray-300">手电筒</p>
            </div>
            <button
              onClick={toggleFlashlight}
              className={`w-12 h-6 rounded-full ${isUsingFlashlight ? 'bg-yellow-500' : 'bg-gray-700'} transition-colors relative`}
            >
              <div className={`absolute w-4 h-4 rounded-full bg-white ${isUsingFlashlight ? 'right-1 top-1' : 'left-1 top-1'} transition-transform duration-300`}></div>
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">手电筒不需要解锁即可使用</p>
        </div>
        
        {/* 密码锁 */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-white mb-2">密码锁</h3>
          
          <div className="flex space-x-2 mb-2">
            <input
              type="text"
              value={passwordGuess}
              onChange={(e) => setPasswordGuess(e.target.value.replace(/\D/g, '').slice(0, 4))}
              className="flex-1 p-2 bg-black border border-gray-700 rounded text-green-400 text-center text-lg font-mono"
              maxLength={4}
              disabled={isFrozen}
            />
            <button
              onClick={checkPassword}
              disabled={isFrozen || passwordGuess.length !== 4}
              className={`px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors ${
                isFrozen || passwordGuess.length !== 4 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              确认
            </button>
          </div>
          
          {feedback && (
            <p className={`text-center text-sm ${passwordGuess === correctPassword ? 'text-green-400' : 'text-yellow-400'}`}>
              {feedback}
            </p>
          )}
          
          <div className="flex justify-between items-center text-xs text-gray-400 mt-1">
           <span>尝试次数: {attemptsLeft}/10</span>
            {isFrozen && <span>等待时间: {formatFreezeTime(freezeTimeLeft)}</span>}
          </div>
        </div>
        
        {/* 解锁后的内容 */}
        {isUnlocked && (
          <div className="bg-blue-900/20 border border-blue-500/50 rounded-lg p-3 mb-4">
            <h4 className="text-blue-400 font-bold mb-2">密码学基础</h4>
            <div className="space-y-2 text-xs text-gray-300">
              <p><strong className="text-white">二进制:</strong> 0001 = 1, 0010 = 2, 0011 = 3, 0100 = 4</p>
              <p><strong className="text-white">摩斯码:</strong> . = 短, - = 长</p>
              <p><strong className="text-white">凯撒密码:</strong> 将字母按顺序后移n位</p>
            </div>
          </div>
        )}
        
        {/* 注意事项 */}
        <div className="mt-2 p-2 bg-yellow-900/30 border border-yellow-500/30 rounded text-yellow-400 text-xs">
          四位数字密码，提示xAxB，A代表数字对位置对，B代表数字对位置不对。
        </div>
      </div>
    </div>
  );
}