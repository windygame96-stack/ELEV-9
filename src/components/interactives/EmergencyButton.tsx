import { useContext, useState, useEffect } from "react";
import { GameContext } from "@/contexts/gameContext";

interface EmergencyButtonProps {
  onClose: () => void;
}

export default function EmergencyButton({ onClose }: EmergencyButtonProps) {
  const { addDiscoveredClue, gameState } = useContext(GameContext);
  const [pressCount, setPressCount] = useState(0);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  
  // 按钮消息列表
  const buttonMessages = [
    "...滋滋...系统...滋滋...隔离...",
    "...滋滋...ELEV-9...滋滋...异常...",
    "...滋滋...15:00...滋滋...清理...",
    "1000/0001/0011/1011" // 摩斯电码
  ];
  
  // 处理按钮点击
  const handleButtonPress = () => {
    if (pressCount < buttonMessages.length) {
      setIsPlaying(true);
      setCurrentMessage(buttonMessages[pressCount]);
      
      // 延迟清除消息，模拟对讲机效果
      setTimeout(() => {
        setIsPlaying(false);
        setCurrentMessage("");
      }, 3000);
      
      setPressCount(pressCount + 1);
      
      // 第一次按下按钮时添加线索
      if (pressCount === 0 && !gameState.discoveredClues.includes("emergencyCall")) {
        addDiscoveredClue("emergencyCall");
      }
      
      // 第四次按下按钮时添加摩斯电码线索
      if (pressCount === 3 && !gameState.discoveredClues.includes("morseCode")) {
        addDiscoveredClue("morseCode");
      }
    }
  };
  
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/80 p-4">
      <div className="bg-gray-900 rounded-lg border-2 border-red-500 max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-red-500">紧急呼叫按钮</h2>
          <button 
            onClick={onClose}
            className="text-white hover:text-gray-400 transition-colors"
          >
            <i className="fa-solid fa-times"></i>
          </button>
        </div>
        
        {/* 紧急按钮 */}
        <div className="flex flex-col items-center justify-center my-8">
          <button
            onClick={handleButtonPress}
            disabled={pressCount >= buttonMessages.length}
            className={`w-24 h-24 rounded-full flex items-center justify-center text-white text-xl font-bold transition-all duration-300 ${
              isPlaying 
                ? 'bg-red-600 animate-pulse scale-110' 
                : pressCount >= buttonMessages.length 
                  ? 'bg-gray-600 cursor-not-allowed' 
                  : 'bg-red-500 hover:bg-red-600 hover:scale-110'
            }`}
          >
            {isPlaying ? (
              <i className="fa-solid fa-volume-high"></i>
            ) : (
              "紧急呼叫"
            )}
          </button>
          
          {/* 按钮下方文字 */}
          <div className="mt-4 text-center">
            <p className="text-gray-400 text-sm">如紧急呼叫无人请联系管理员张子烨电话13xxxxx4805</p>
          </div>
        </div>
        
        {/* 消息显示区域 */}
        {currentMessage && (
          <div className="p-4 bg-black/50 rounded-lg border border-gray-700 mb-4">
            <p className={`text-center ${isPlaying ? 'text-yellow-400 animate-pulse' : 'text-gray-300'}`}>
              {currentMessage}
            </p>
          </div>
        )}
        
         {/* 操作提示 */}
         <p className="text-gray-400 text-center text-sm">
           按下按钮获取信息
         </p>
      </div>
    </div>
  );
}