import { useState, useEffect } from "react";

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  
  // 模拟加载进度
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 100);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-center bg-black overflow-hidden">
      {/* 背景效果 */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black"></div>
      
      {/* 数字噪声效果 */}
      <div className="absolute inset-0 digital-noise"></div>
      
      {/* 主内容 */}
      <div className="relative z-10 text-center px-4">
        {/* Logo */}
        <div className="w-32 h-32 bg-gray-900 rounded-full flex items-center justify-center mb-8 border-2 border-gray-700">
          <i className="fa-solid fa-elevator text-5xl text-green-500"></i>
        </div>
        
        {/* 标题 */}
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">电梯 - ELEV-9</h1>
        <p className="text-xl text-green-400 mb-8">网页解谜游戏</p>
        
        {/* 加载动画 */}
        <div className="w-20 h-20 border-4 border-t-green-500 border-r-green-300 border-b-green-200 border-l-green-400 rounded-full animate-spin mb-8"></div>
        
        {/* 加载文本 */}
        <h2 className="text-xl font-bold text-white mb-2">正在载入电梯系统...</h2>
        <p className="text-gray-400 mb-8">请稍候，系统正在初始化</p>
        
        {/* 进度条 */}
        <div className="w-full max-w-xs mx-auto bg-gray-800 rounded-full h-2 mb-2">
          <div 
            className="bg-green-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-500">{progress}%</p>
      </div>
    </div>
  );
}