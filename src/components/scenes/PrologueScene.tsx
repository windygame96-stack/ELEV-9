import { useEffect, useRef, useState, useContext } from "react";
import { GameContext } from "@/contexts/gameContext";

export default function PrologueScene() {
  const { updateGameState } = useContext(GameContext);
  const [currentScene, setCurrentScene] = useState(1);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [displayedText, setDisplayedText] = useState("");
  const [showContinue, setShowContinue] = useState(false);
  const typingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // 场景文本内容
  const sceneTexts = [
    {
      bgImage: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Elevator%20interior%20modern%20clean%20blue%20uniform%20woman&sign=6347dd2e3193d813f2b2bb8043d7d345",
      texts: [
        "09:00 - 电梯内部",
        "你是一个电梯管理员刘晓，有一天你发现你被困在了电梯里...",
        "\"电梯上行\"",
        "18层门开，张经理进入。",
        "\"早啊，张总\"",
        "\"早，小刘，今天气色不错\""
      ]
    },
    {
      bgImage: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Elevator%20passengers%20morning%20rush%20hour&sign=651c9f7f84aaf955d373c04ae0485b52",
      texts: [
        "09:15 - 乘客互动",
        "多个乘客进出电梯。",
        "一个抱着文件的女孩跑过来。",
        "你按住\"开门\"键等她。",
        "\"谢谢你，刘晓！\"",
        "\"没事，小心门\""
      ]
    },
    {
      bgImage: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Rest%20room%20office%20older%20woman%20water&sign=3ace12f733fdb794577fdfb5be7640e6",
      texts: [
        "12:00 - 休息室",
        "王阿姨递来一杯水。",
        "\"今天挺忙的，歇会儿吧\"",
        "你接过水杯。",
        "奇怪，今天怎么不觉得累？"
      ]
    },
    {
      bgImage: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Bathroom%20mirror%20reflection%20glitch%20code&sign=2a1bc38a8e67f8399fbfb2dc78dcb8eb",
      texts: [
        "12:30 - 洗手间镜子",
        "你在镜子前整理制服。",
        "镜子里是正常的自己。",
        "你眨眼...",
        "> IDENTITY_MODULE: ACTIVE",
        "\"最近加班太多了吗...\""
      ]
    },
    {
      bgImage: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Elevator%20delivery%20boy%20milk%20tea&sign=003054856d1aebd815a4e2867d757915",
      texts: [
        "13:00 - 小明送奶茶",
        "小明冲进电梯，拿着奶茶。",
        "\"刘姐，你的奶茶，冰的！\"",
        "\"谢了\"",
        "小明放下奶茶，跑出去送快递。",
        "\"下午班开始了\""
      ]
    },
    {
      bgImage: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Elevator%20emergency%20red%20light%20broken&sign=54102d08eb9890ed70f86d10ffd0af6a",
      texts: [
        "2026-02-12 14:30",
        "下午班开始",
        "",
        "",
        "",
        "游戏正式开始"
      ]
    }
  ];

  // 打字机效果
  const typeText = (text: string) => {
    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
    }

    setIsTyping(true);
    setDisplayedText("");
    setShowContinue(false);
    
    let index = 0;
    typingIntervalRef.current = setInterval(() => {
      setDisplayedText(text.substring(0, index + 1));
      index++;
      
      if (index >= text.length) {
        if (typingIntervalRef.current) {
          clearInterval(typingIntervalRef.current);
          typingIntervalRef.current = null;
        }
        setIsTyping(false);
        setShowContinue(true);
      }
    }, 50);
  };

  useEffect(() => () => {
    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
    }
  }, []);

  // 初始化当前场景文本
  useEffect(() => {
    if (sceneTexts[currentScene - 1]) {
      setCurrentTextIndex(0);
      typeText(sceneTexts[currentScene - 1].texts[0]);
    }
  }, [currentScene]);

  // 处理继续按钮点击
  const handleContinue = () => {
    const currentSceneData = sceneTexts[currentScene - 1];
    
    if (currentTextIndex < currentSceneData.texts.length - 1) {
      // 显示当前场景的下一段文本
      setCurrentTextIndex(currentTextIndex + 1);
      typeText(currentSceneData.texts[currentTextIndex + 1]);
    } else if (currentScene < sceneTexts.length) {
      // 进入下一个场景
      setCurrentScene(currentScene + 1);
    } else {
      // 序章结束，进入第一章
      updateGameState({
        currentChapter: "chapter1",
        currentStage: "initialExploration"
      });
    }
  };

  // 跳过序章
  const skipPrologue = () => {
    if (window.confirm("确定要跳过序章直接进入游戏吗？")) {
      updateGameState({
        currentChapter: "chapter1",
        currentStage: "initialExploration"
      });
    }
  };

  if (!sceneTexts[currentScene - 1]) {
    return null;
  }

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* 背景图片 - 优先适配移动端 */}
      <div 
        className="absolute inset-0 bg-center"
        style={{ 
          backgroundImage: `url(${sceneTexts[currentScene - 1].bgImage})`,
          filter: 'brightness(0.7) saturate(0.9)',
          // 移动端优先使用cover，确保背景填满，同时调整position确保主要内容可见
          backgroundSize: 'cover',
          // 对于不同设备调整位置，确保关键内容在视图中
          backgroundPosition: 'center 30%'
        }}
      />
      
      {/* 半透明遮罩 */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
      
      {/* 扫描线效果 */}
      <div className="absolute inset-0 scanline" />
      
      {/* 跳过按钮 */}
      <button 
        onClick={skipPrologue}
        className="absolute top-4 right-4 px-4 py-2 bg-black/50 text-white text-sm rounded-md hover:bg-black/70 transition-all duration-300 z-10 border border-white/20"
      >
        跳过序章
      </button>
      
      {/* 文本显示区域 */}
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
        <div className="max-w-3xl mx-auto text-white">
          {isTyping && (
            <div className="animate-pulse inline-block ml-1 w-2 h-5 bg-white"></div>
          )}
          
          <p className="text-xl md:text-2xl font-light leading-relaxed tracking-wide mb-6">
            {displayedText}
          </p>
          
          {showContinue && (
            <div 
              className="mt-8 text-center"
              onClick={handleContinue}
            >
              <button className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-md hover:bg-white/10 transition-all duration-300">
                继续
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
