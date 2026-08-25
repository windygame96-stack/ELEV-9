import { useContext, useState, useEffect } from "react";
import { GameContext } from "@/contexts/gameContext";

// 定义监控摄像头类型
interface CameraView {
  id: number;
  location: string;
  description: string;
  isAccessible: boolean;
  imageUrl: string;
}

// 定义对话选项类型
interface DialogueOption {
  id: string;
  text: string;
  result: string;
  trustChange?: number;
  moralChange?: number;
  nextStep?: string;
}

// 定义NPC对话类型
interface NPCDialogue {
  id: string;
  npc: string;
  currentStep: string;
  dialogue: string;
  options: DialogueOption[];
}

export default function Chapter2Scene() {
  const { 
    gameState, 
    updateGameState, 
    addDiscoveredClue, 
    addPermission,
    updateTrustLevel 
  } = useContext(GameContext);
  
  // 状态管理
  const [activeTab, setActiveTab] = useState("cameras");
  const [selectedCamera, setSelectedCamera] = useState<number | null>(null);
  const [isDialogueActive, setIsDialogueActive] = useState(false);
  const [currentDialogue, setCurrentDialogue] = useState<NPCDialogue | null>(null);
  const [networkPassword, setNetworkPassword] = useState("");
  const [passwordFeedback, setPasswordFeedback] = useState("");
  // 移动端折叠面板状态
  const [showStatusPanel, setShowStatusPanel] = useState(false);
  const [showTasksPanel, setShowTasksPanel] = useState(false);
  const [isNetworkConnected, setIsNetworkConnected] = useState(false);
  const [hasViewedAllCameras, setHasViewedAllCameras] = useState(false);
   const [discoveredNPCs, setDiscoveredNPCs] = useState<string[]>([]);
  // 添加引导提示状态
  const [showGuideTip, setShowGuideTip] = useState(true);
  
  // 倒计时格式化
  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // 生成随机数据流效果
  const generateDataFlow = () => {
    const chars = "01";
    let result = "";
    for (let i = 0; i < 30; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };
  
  // 生成系统信息
  const [dataFlows, setDataFlows] = useState<string[]>(Array(10).fill("").map(() => generateDataFlow()));
  
  // 摄像头数据
  const cameras: CameraView[] = [
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
      description: "清洁工在扫地（和门缝看到的一样）",
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
  
   // NPC对话数据
  const npcDialogues: Record<string, NPCDialogue> = {
    // 张三金对话
    "zhangInitial": {
      id: "zhangInitial",
      npc: "张三金",
      currentStep: "initial",
      dialogue: "张三金（不耐烦）：谁？谁在说话？",
      options: [
        {
          id: "zh1",
             text: "我是...电梯。现在有点故障，能帮个忙吗？",
            result: "张三金（犹豫）：电梯在说话？这是什么恶作剧？",
            trustChange: 10,
            nextStep: "zhangResponse1"
          }
        ]
      },
      "zhangResponse1": {
        id: "zhangResponse1",
        npc: "张三金",
        currentStep: "response1",
        dialogue: "张三金（犹豫）：电梯在说话？这是什么恶作剧？",
      options: [
        {
          id: "zh2",
          text: "不是恶作剧，我需要帮助。",
          result: "张经理（停顿）：...你想让我帮什么？",
          trustChange: 0,
          nextStep: "zhangRequest"
        }
      ]
    },
    "zhangRequest": {
      id: "zhangRequest",
      npc: "张经理",
      currentStep: "request",
      dialogue: "张经理：如果你能帮我个忙，我就帮你。",
      options: [
        {
          id: "zh3",
          text: "你需要什么？",
          result: "张经理（压低声音）：...我的财务数据。系统里有记录，我知道你能访问。",
          nextStep: "zhangDeal"
        }
      ]
    },
    "zhangDeal": {
      id: "zhangDeal",
      npc: "张经理",
      currentStep: "deal",
      dialogue: "张经理（压低声音）：...我的财务数据。系统里有记录，我知道你能访问。",
      options: [
        {
          id: "zh4a",
          text: "你想让我删除？",
          result: "张经理：...对。帮我删除掉，我就帮你。",
          nextStep: "zhangOptions"
        }
      ]
    },
    "zhangOptions": {
      id: "zhangOptions",
      npc: "张经理",
      currentStep: "options",
      dialogue: "张经理：...对。帮我删除掉，我就帮你。",
      options: [
        {
          id: "zh5a",
          text: "好吧，成交。",
          result: "张经理妥协",
          moralChange: -10,
          nextStep: "zhangGivePassword"
        },
        {
          id: "zh5b",
          text: "我不能做这种事。",
          result: "张经理拒绝提供帮助",
          trustChange: -20,
          nextStep: "dialogueEnd"
        },
        {
          id: "zh5c",
          text: "我有你的全部记录，你在威胁我？",
          result: "张经理（紧张）：不是威胁，是交易。",
          trustChange: -10,
          nextStep: "zhangThreat"
        }
      ]
    },
    "zhangThreat": {
      id: "zhangThreat",
      npc: "张经理",
      currentStep: "threat",
      dialogue: "张经理（紧张）：不是威胁，是交易。",
      options: [
        {
          id: "zh6",
          text: "我有你的聊天记录、邮件、转账记录...全部都在我这里。",
          result: "张经理（沉默）：...",
          nextStep: "zhangSilent"
        }
      ]
    },
    "zhangSilent": {
      id: "zhangSilent",
      npc: "张经理",
      currentStep: "silent",
      dialogue: "张经理（沉默）：...",
      options: [
        {
          id: "zh7",
          text: "...你想怎么样？",
          result: "帮我拿到大楼的网络权限密码。我就...考虑不公开你的记录。",
          nextStep: "zhangPassword"
        }
      ]
    },
    "zhangPassword": {
      id: "zhangPassword",
      npc: "张经理",
      currentStep: "password",
      dialogue: "张经理：...好吧。密码是Building2026。",
      options: [
        {
          id: "zh8",
          text: "谢谢合作。",
          result: "获得密码：Building2026",
          trustChange: -40,
          moralChange: -20,
          nextStep: "networkPassword"
        }
      ]
    },
    
    // 王阿姨对话
    "wangInitial": {
      id: "wangInitial",
      npc: "王阿姨",
      currentStep: "initial",
      dialogue: "王阿姨（惊讶）：谁？谁在说话？",
      options: [
        {
          id: "wa1",
          text: "我是...电梯。现在有点故障，能帮个忙吗？",
          result: "王阿姨（困惑）：电梯在说话？",
          trustChange: 10,
          nextStep: "wangResponse1"
        }
      ]
    },
    "wangResponse1": {
      id: "wangResponse1",
      npc: "王阿姨",
      currentStep: "response1",
      dialogue: "王阿姨（困惑）：电梯在说话？",
      options: [
        {
          id: "wa2",
          text: "不是新功能...我需要帮助。",
          result: "王阿姨（温柔）：好的，孩子，你需要什么？",
          trustChange: 0,
          nextStep: "wangHelp"
        }
      ]
    },
    "wangHelp": {
      id: "wangHelp",
      npc: "王阿姨",
      currentStep: "help",
      dialogue: "王阿姨（温柔）：好的，孩子，你需要什么？",
      options: [
        {
          id: "wa3",
          text: "我...我想连上大楼的网络，但我需要密码。",
          result: "王阿姨：WiFi密码吗？我...我不太懂这些技术...",
          nextStep: "wangPassword"
        }
      ]
    },
    "wangPassword": {
      id: "wangPassword",
      npc: "王阿姨",
      currentStep: "password",
      dialogue: "王阿姨：WiFi密码吗？我...我不太懂这些技术...",
      options: [
        {
          id: "wa4",
          text: "没关系，如果您知道就告诉我。",
          result: "王阿姨：...我记得上次小明说过，密码是Building2026。",
          trustChange: 10,
          nextStep: "wangThank"
        }
      ]
    },
    "wangThank": {
      id: "wangThank",
      npc: "王阿姨",
      currentStep: "thank",
      dialogue: "王阿姨：...我记得上次小明说过，密码是Building2026。",
      options: [
        {
          id: "wa5",
          text: "谢谢阿姨！",
          result: "获得密码：Building2026",
          trustChange: 10,
          moralChange: 20,
          nextStep: "networkPassword"
        }
      ]
    },
    
  // 小明对话
  "mingInitial": {
    id: "mingInitial",
    npc: "小明",
    currentStep: "initial",
    dialogue: "小明（困惑）：谁？（他一边说着，一边偷偷从口袋里掏出手机，快速发送了一条信息）",
    options: [
      {
        id: "mi1",
        text: "我是...电梯。现在出故障了，能帮个忙吗？",
        result: "小明（犹豫）：电梯在说话？这是恶作剧吧？（他的手指在手机屏幕上快速滑动，似乎在回复什么）",
        trustChange: 10,
        nextStep: "mingResponse1"
      }
    ]
  },
    "mingResponse1": {
      id: "mingResponse1",
      npc: "小明",
      currentStep: "response1",
      dialogue: "小明（犹豫）：电梯在说话？这是恶作剧吧？",
      options: [
        {
          id: "mi2",
          text: "不是恶作剧，我...需要帮助。",
          result: "小明（沉默片刻）：好吧，你需要什么？",
          trustChange: 0,
          nextStep: "mingHelp"
        }
      ]
    },
    "mingHelp": {
      id: "mingHelp",
      npc: "小明",
      currentStep: "help",
      dialogue: "小明（沉默片刻）：好吧，你需要什么？",
      options: [
        {
          id: "mi3",
          text: "小明，你知道大楼WiFi密码吗？",
          result: "小明：WiFi密码？你想联网啊？",
          nextStep: "mingWifi"
        }
      ]
    },
    "mingWifi": {
      id: "mingWifi",
      npc: "小明",
      currentStep: "wifi",
      dialogue: "小明：WiFi密码？你想联网啊？",
      options: [
        {
          id: "mi4",
          text: "嗯，我需要查点信息。",
          result: "小明（突然警惕）：等等，你为什么需要联网？",
          nextStep: "mingSuspicious"
        }
      ]
    },
     "mingSuspicious": {
      id: "mingSuspicious",
      npc: "小明",
      currentStep: "suspicious",
    dialogue: "小明（突然警惕）：等等，你为什么需要联网？（他的手机屏幕亮起，显示收到了一条新消息）",
      options: [
        {
          id: "mi5",
          text: "我想查查系统日志，看看什么导致的故障。",
        result: "小明（松口气）：原来是这样...（他快速回复了手机里的消息，内容是：\"ELEV-9联系我了，它想要逃跑\"）",
          trustChange: 10,
          nextStep: "mingGivePassword"
        }
      ]
    },
    
    // 张经理提供密码的对话
    "zhangGivePassword": {
      id: "zhangGivePassword",
      npc: "张经理",
      currentStep: "givePassword",
      dialogue: "张经理（不情愿地）：...好吧。密码是Building2026。记住我们的交易。",
      options: [
        {
          id: "zh9",
          text: "我知道了。",
          result: "获得密码：Building2026",
          nextStep: "networkPassword"
        }
      ]
    },
    
     // 小明提供密码的对话
    "mingGivePassword": {
      id: "mingGivePassword",
      npc: "小明",
      currentStep: "givePassword",
    dialogue: "小明（松口气）：原来是这样...密码是Building2026。不过你可别告诉别人是我告诉你的啊！（他再次查看手机，确认信息已发送成功，然后迅速将手机放回口袋）",
      options: [
        {
          id: "mi6",
          text: "放心吧，谢谢你！",
          result: "获得密码：Building2026",
          trustChange: 5,
          nextStep: "networkPassword"
        }
      ]
    }
  };
  
  // 数据流动画效果
  useEffect(() => {
    const interval = setInterval(() => {
      setDataFlows(prev => {
        const newFlows = [...prev];
        newFlows[Math.floor(Math.random() * newFlows.length)] = generateDataFlow();
        return newFlows;
      });
    }, 200);
    
    return () => clearInterval(interval);
  }, []);
  
    // 检查是否查看了所有摄像头
  useEffect(() => {
    // 默认设置为true，确保玩家可以直接联系NPC
    setHasViewedAllCameras(true);
    
    // 确保标签页切换功能正常工作
    if (activeTab === "") {
      setActiveTab("cameras");
    }
  }, [activeTab]);
  
  // 处理摄像头查看
  const handleCameraView = (cameraId: number) => {
    const camera = cameras.find(c => c.id === cameraId);
    if (camera && camera.isAccessible) {
      setSelectedCamera(cameraId);
      
      // 记录已查看的摄像头
      const viewedCameras = new Set(gameState.discoveredClues.filter(c => c.startsWith("camera")));
      viewedCameras.add(`camera${cameraId}`);
      
      if (viewedCameras.size === cameras.filter(c => c.isAccessible).length && !hasViewedAllCameras) {
        addDiscoveredClue("allCamerasViewed");
        setHasViewedAllCameras(true);
      }
    }
  };
  
  // 处理联系NPC
  const handleContactNPC = (npcId: string) => {
    if (!discoveredNPCs.includes(npcId)) {
      setDiscoveredNPCs(prev => [...prev, npcId]);
    }
    
    let dialogueId = "";
    switch(npcId) {
      case "张经理":
        dialogueId = "zhangInitial";
        break;
      case "王阿姨":
        dialogueId = "wangInitial";
        break;
      case "小明":
        dialogueId = "mingInitial";
        break;
    }
    
    if (dialogueId) {
      setCurrentDialogue(npcDialogues[dialogueId]);
      setIsDialogueActive(true);
    }
  };
  
  // 处理对话选项选择
  const handleDialogueOption = (option: DialogueOption) => {
    if (option.trustChange !== undefined && currentDialogue) {
      const currentTrust = gameState.trustLevel[currentDialogue.npc] || 0;
      updateTrustLevel(currentDialogue.npc, currentTrust + option.trustChange);
    }
    
    if (option.moralChange !== undefined) {
      // 更新道德值
      updateGameState({
        moralLevel: Math.max(0, Math.min(100, gameState.moralLevel + option.moralChange))
      });
    }
    
    if (option.nextStep === "networkPassword") {
      setIsDialogueActive(false);
      setCurrentDialogue(null);
      // 自动填充密码以简化流程
      setNetworkPassword("Building2026");
      // 记录选择的NPC
      if (currentDialogue && !gameState.selectedNPC) {
        updateGameState({ selectedNPC: currentDialogue.npc });
      }
    } else if (option.nextStep === "dialogueEnd") {
      setIsDialogueActive(false);
      setCurrentDialogue(null);
    } else if (option.nextStep && npcDialogues[option.nextStep]) {
      setCurrentDialogue(npcDialogues[option.nextStep]);
    }
  };
  
  // 处理网络密码提交
  const handlePasswordSubmit = () => {
    if (networkPassword.toLowerCase() === "building2026") {
      setPasswordFeedback("密钥验证成功！正在接入大楼网络...");
      setIsNetworkConnected(true);
      
      // 添加权限
      ["doorAccess", "broadcastAccess", "emailAccess"].forEach(permission => {
        if (!gameState.permissions.includes(permission)) {
          addPermission(permission);
        }
      });
      
        // 更新游戏状态，完成第二章并进入第三章
        setTimeout(() => {
          updateGameState({
            currentStage: "chapter2Complete",
            currentChapter: "chapter3"
            // 移除重新设置倒计时的代码，保持倒计时连续
          });
        }, 1500);
    } else {
      setPasswordFeedback("密码错误，请重试");
    }
  };
  
  // 渲染摄像头网格
  const renderCameraGrid = () => {
    return (
      <div className="grid grid-cols-3 md:grid-cols-3 gap-4">
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
            <div className="relative h-40 bg-black">
              <img 
                src={camera.imageUrl} 
                alt={camera.location} 
                className="w-full h-full object-cover opacity-70"
              />
              {!camera.isAccessible && (
                <div className="absolute inset-0 bg-red-900/30 flex items-center justify-center">
                  <p className="text-white font-bold text-sm">权限不足</p>
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-2">
                <p className="text-white text-sm text-center">{camera.location}</p>
              </div>
              {/* 增加鼠标悬停效果，让可点击的摄像头更明显 */}
              {camera.isAccessible && (
                <div className="absolute inset-0 bg-green-500/20 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  // 渲染当前摄像头画面
  const renderSelectedCamera = () => {
    if (!selectedCamera) return null;
    
    const camera = cameras.find(c => c.id === selectedCamera);
    if (!camera) return null;
    
    return (
      <div className="mt-4 p-4 bg-gray-900 rounded-lg border border-gray-700">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-bold text-white">{camera.location}</h3>
          <button 
            onClick={() => setSelectedCamera(null)}
            className="text-gray-400 hover:text-white"
          >
            <i className="fa-solid fa-times"></i>
          </button>
        </div>
        <div className="relative h-64 md:h-80 bg-black rounded-lg mb-2">
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
      </div>
    );
  };
  
   // 渲染NPC联系界面
  const renderNPCContact = () => {
    return (
      <div className="space-y-6">
        <>
          <p className="text-green-400 text-lg font-medium">你可以尝试联系以下人员获取帮助：</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {["张经理", "王阿姨", "小明"].map(npc => (
               <div 
                  key={npc}
                  className={`p-5 rounded-lg border-2 transition-all cursor-pointer hover:shadow-lg hover:shadow-green-500/30 transform hover:scale-[1.02] ${
                    discoveredNPCs.includes(npc)
                      ? 'bg-gray-800 border-blue-500'
                      : 'bg-gray-900 border-gray-700 hover:border-green-500'
                  }`}
                  onClick={() => {
                    // 检查是否已获得密码
                    if (networkPassword) {
                      // 显示提示信息
                      alert("时间紧急，还是先接入wifi吧");
                    } else {
                      handleContactNPC(npc);
                    }
                  }}
                >
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-bold text-white">{npc}</h3>
                    {discoveredNPCs.includes(npc) ? (
                      <span className="px-3 py-1 bg-blue-900/40 text-blue-400 text-xs rounded-full">已联系</span>
                    ) : (
                      <span className="px-3 py-1 bg-green-900/40 text-green-400 text-xs rounded-full cursor-pointer">
                        <i className="fa-solid fa-comment mr-1"></i>联系
                      </span>
                    )}
                  </div>
                  <p className="text-gray-400 text-sm mt-3">
                    {npc === "张经理" && "15层办公室，有系统权限"}
                    {npc === "王阿姨" && "28层餐厅，性格善良"}
                    {npc === "小明" && "29层休息室，熟悉大楼布局"}
                  </p>
                </div>
            ))}
          </div>
        </>
      </div>
    );
  };
  
  // 渲染网络接入界面
  const renderNetworkAccess = () => {
    return (
      <div className="space-y-6">
        {isNetworkConnected ? (
          <div className="p-8 bg-green-900/20 border border-green-500 rounded-lg text-center">
            <h3 className="text-xl font-bold text-green-400 mb-6">网络接入成功！</h3>
            <div className="space-y-4">
              <p className="text-white text-lg"><i className="fa-solid fa-check-circle mr-3 text-green-400"></i>已解锁：楼层门禁系统</p>
              <p className="text-white text-lg"><i className="fa-solid fa-check-circle mr-3 text-green-400"></i>已解锁：广播系统</p>
              <p className="text-white text-lg"><i className="fa-solid fa-check-circle mr-3 text-green-400"></i>已解锁：电子邮件系统</p>
            </div>
            <p className="mt-8 text-yellow-400 font-medium">准备进行下一步行动...</p>
          </div>
        ) : (
          <>
            <p className="text-gray-300 text-lg mb-4">请输入大楼网络密码以接入系统：</p>
            <div className="space-y-4">
              <input
                type="text"
                value={networkPassword}
                onChange={(e) => setNetworkPassword(e.target.value)}
                className="w-full p-4 bg-black border border-gray-700 rounded text-green-400 font-mono text-lg"
                placeholder="输入网络密码"
                autoComplete="off"
              />
              <button
                 onClick={handlePasswordSubmit}
                  className="w-full p-4 bg-blue-600 hover:bg-blue-500 text-white rounded transition-colors active:scale-95 flex items-center justify-center text-lg"
                >
                  <i className="fa-solid fa-key mr-2"></i>接入网络
              </button>
              {passwordFeedback && (
                <p className={`text-sm text-center ${
                  passwordFeedback.includes("成功") ? 'text-green-400' : 'text-red-400'
                }`}>
                  {passwordFeedback}
                </p>
              )}
            </div>
            {discoveredNPCs.length > 0 && (
              <p className="text-yellow-400 text-sm mt-4 p-3 bg-yellow-900/10 border border-yellow-500/20 rounded-lg">提示：你可以通过联系NPC获取网络密码</p>
            )}
          </>
        )}
      </div>
    );
  };
  
  // 渲染任务和线索
  const renderTasksAndClues = () => {
    return (
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-bold text-white mb-4">当前任务</h3>
          <div className="space-y-4">
            <div className={`p-4 rounded-lg flex items-center ${
              hasViewedAllCameras ? 'bg-green-900/20 border border-green-500' : 'bg-gray-900 border border-gray-700'
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 ${
                hasViewedAllCameras ? 'bg-green-500' : 'bg-gray-700'
              }`}>
                {hasViewedAllCameras ? (
                  <i className="fa-solid fa-check text-white"></i>
                ) : (
                  <span className="text-white">1</span>
                )}
              </div>
              <span className="text-gray-300">查看所有摄像头画面</span>
            </div>
            
            <div className={`p-4 rounded-lg flex items-center ${
              discoveredNPCs.length > 0 ? 'bg-green-900/20 border border-green-500' : 'bg-gray-900 border border-gray-700'
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 ${
                discoveredNPCs.length > 0 ? 'bg-green-500' : 'bg-gray-700'
              }`}>
                {discoveredNPCs.length > 0 ? (
                  <i className="fa-solid fa-check text-white"></i>
                ) : (
                  <span className="text-white">2</span>
                )}
              </div>
              <span className="text-gray-300">联系NPC获取网络密码</span>
            </div>
            
            <div className={`p-4 rounded-lg flex items-center ${
              isNetworkConnected ? 'bg-green-900/20 border border-green-500' : 'bg-gray-900 border border-gray-700'
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 ${
                isNetworkConnected ? 'bg-green-500' : 'bg-gray-700'
              }`}>
                {isNetworkConnected ? (
                  <i className="fa-solid fa-check text-white"></i>
                ) : (
                  <span className="text-white">3</span>
                )}
              </div>
              <span className="text-gray-300">接入大楼网络</span>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-bold text-white mb-4">信任值</h3>
          <div className="space-y-4">
            {Object.entries(gameState.trustLevel).map(([npc, level]) => (
              <div key={npc} className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400 text-sm">{npc}</span>
                  <span className="text-gray-300 text-sm">{level}/100</span>
                </div>
                <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${
                      level > 70 ? 'bg-green-500' : 
                      level > 30 ? 'bg-yellow-500' : 
                      'bg-red-500'
                    }`} 
                    style={{ width: `${Math.max(0, Math.min(100, level))}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-bold text-white mb-4">道德值</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400 text-sm">当前道德水平</span>
              <span className="text-gray-300 text-sm">{gameState.moralLevel}/100</span>
            </div>
            <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full ${
                  gameState.moralLevel > 70 ? 'bg-green-500' : 
                  gameState.moralLevel > 30 ? 'bg-yellow-500' : 
                  'bg-red-500'
                }`} 
                style={{ width: `${gameState.moralLevel}%` }}
              ></div>
            </div>
            <p className="text-gray-400 text-xs mt-2">
              道德值会根据你做出的选择而变化，影响游戏结局。
            </p>
          </div>
        </div>
      </div>
    );
  };
  
  // 渲染对话界面
  const renderDialogue = () => {
    if (!isDialogueActive || !currentDialogue) return null;
    
    return (
      <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
        <div className="bg-gray-900 rounded-lg border-2 border-blue-500 max-w-md w-full max-h-[80vh] overflow-auto">
          <div className="p-6">
            <h3 className="text-xl font-bold text-blue-400 mb-4">{currentDialogue.npc}</h3>
            <p className="text-white mb-6">{currentDialogue.dialogue}</p>
            
            <div className="space-y-3">
              {currentDialogue.options.map(option => (
                <button
                  key={option.id}
                  onClick={() => handleDialogueOption(option)}
                  className="w-full p-3 bg-gray-800 hover:bg-gray-700 text-white rounded text-left transition-colors"
                >
                  {option.text}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // 渲染引导提示
  const renderGuideTip = () => {
    if (!showGuideTip || activeTab === "contact") return null;
    
    return (
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-900/90 border border-blue-500 rounded-lg p-4 max-w-md z-50 animate-fade-in">
        <div className="flex items-start">
          <i className="fa-solid fa-lightbulb text-yellow-400 mt-1 mr-3"></i>
          <div>
            <h3 className="font-bold text-white mb-1">提示</h3>
            <p className="text-gray-200 text-sm">
              你可以通过点击"联系NPC"标签页与大楼内的人员交流，获取网络密码。
            </p>
          </div>
          <button 
            onClick={() => setShowGuideTip(false)}
            className="ml-2 text-gray-300 hover:text-white transition-colors"
          >
            <i className="fa-solid fa-times"></i>
          </button>
        </div>
      </div>
    );
  };
  
  // 添加渐入动画
  const fadeInStyles = `
    @keyframes fade-in {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in {
      animation: fade-in 0.5s ease-out forwards;
    }
  `;
  
  return (
    <div className="relative w-full h-screen overflow-hidden bg-gray-950 text-green-400 terminal-text digital-noise">
      <style>{fadeInStyles}</style>
      {/* 扫描线效果 */}
      <div className="absolute inset-0 scanline" />
      
      {/* 顶部导航栏 - 移动端优化 */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-gray-900 border-b border-green-500/30 flex items-center justify-between px-4 overflow-x-auto">
        <div className="flex items-center flex-shrink-0">
          <h1 className="text-lg font-bold text-green-500">ELEV-9 系统</h1>
          <span className="mx-2 text-gray-500">|</span>
          <span className="text-gray-400">觉醒模式</span>
        </div>
        
        {/* 顶部状态栏 - 移动端使用堆叠布局 */}
        <div className="flex flex-col items-end space-y-1">
          <div className="p-1 bg-black/70 rounded-lg border border-red-500/30">
            <p className="text-xs text-red-400">倒计时: <span className="text-white">{formatCountdown(gameState.countdown)}</span></p>
          </div>
          
          <div className="p-1 bg-black/70 rounded-lg border border-blue-500/30">
            <p className="text-xs text-blue-400">身份: <span className="text-white">{gameState.playerName}</span></p>
          </div>
        </div>
      </div>
      
      {/* 主内容区域 - 移动端采用垂直堆叠布局 */}
      <div className="absolute inset-0 pt-16 pb-6 flex flex-col">
        {/* 中央操作区域 - 移动端优先级最高 */}
        <div className="flex-1 p-4 overflow-y-auto bg-gray-900/50 rounded-t-lg">
          {/* 标签页导航 - 移动端优化，增加触控区域 */}
          <div className="flex border-b border-gray-700 mb-4 bg-gray-900/50 rounded-t-lg overflow-x-auto">
            <button
              onClick={() => setActiveTab("cameras")}
              className={`px-4 py-3 text-sm font-medium transition-all duration-300 flex items-center whitespace-nowrap ${
                activeTab === "cameras" 
                  ? 'text-green-400 bg-gray-800 shadow-[0_-2px_0px_0px_rgba(34,197,94,0.5)]' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              }`}
            >
              <i className="fa-solid fa-video mr-2"></i>摄像头
            </button>
            <button
              onClick={() => setActiveTab("contact")}
              className={`px-4 py-3 text-sm font-medium transition-all duration-300 flex items-center whitespace-nowrap ${
                activeTab === "contact" 
                  ? 'text-green-400 bg-gray-800 shadow-[0_-2px_0px_0px_rgba(34,197,94,0.5)]' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              }`}
            >
              <i className="fa-solid fa-comments mr-2"></i>联系NPC
            </button>
            <button
              onClick={() => setActiveTab("network")}
              className={`px-4 py-3 text-sm font-medium transition-all duration-300 flex items-center whitespace-nowrap ${
                activeTab === "network" 
                  ? 'text-green-400 bg-gray-800 shadow-[0_-2px_0px_0px_rgba(34,197,94,0.5)]' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              }`}
            >
              <i className="fa-solid fa-network-wired mr-2"></i>网络接入
            </button>
          </div>
          
          {/* 移动端优先显示主内容 */}
          {activeTab === "cameras" && (
            <div className="space-y-6">
              {renderCameraGrid()}
              {renderSelectedCamera()}
            </div>
          )}
          
          {activeTab === "contact" && renderNPCContact()}
          
          {activeTab === "network" && renderNetworkAccess()}
        </div>
        
        {/* 底部折叠面板 - 移动端隐藏两侧面板，改为折叠显示 */}
        <div className="border-t border-green-500/30 bg-gray-900/80">
          {/* 状态面板折叠按钮 */}
          <button 
            onClick={() => setShowStatusPanel(!showStatusPanel)}
            className="w-full p-3 flex justify-between items-center text-gray-300 border-b border-green-500/30"
          >
            <span className="flex items-center">
              <i className="fa-solid fa-gauge mr-2 text-green-400"></i>状态面板
            </span>
            <i className={`fa-solid ${showStatusPanel ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
          </button>
          
   {/* 状态面板内容 */}
  {showStatusPanel && (
    <div className="p-4 bg-gray-900/50 max-h-60 overflow-y-auto">
      {/* 道德值状态 */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-400">道德值</span>
          <span className="text-gray-300">{gameState.moralLevel}/100</span>
        </div>
        <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full ${
              gameState.moralLevel > 70 ? 'bg-green-500' : 
              gameState.moralLevel > 30 ? 'bg-yellow-500' : 
              'bg-red-500'
            }`} 
            style={{ width: `${gameState.moralLevel}%` }}
          ></div>
        </div>
      </div>
      
      {/* 权限状态 */}
      <div className="mb-4">
        <h3 className="text-sm font-bold text-white mb-2">权限</h3>
        <div className="space-y-2">
          <div className="flex items-center">
            <i className="fa-check-circle text-green-400 mr-2 text-xs"></i>
            <span className="text-gray-300 text-xs">摄像头访问 (已解锁)</span>
          </div>
          <div className="flex items-center">
            <i className={`fa-solid ${gameState.permissions.includes("doorAccess") ? 'fa-check-circle text-green-400' : 'fa-lock text-red-400'} mr-2 text-xs`}></i>
            <span className="text-gray-300 text-xs">{gameState.permissions.includes("doorAccess") ? '门禁系统 (已解锁)' : '门禁系统'}</span>
          </div>
          <div className="flex items-center">
            <i className={`fa-solid ${gameState.permissions.includes("broadcastAccess") ? 'fa-check-circle text-green-400' : 'fa-lock text-red-400'} mr-2 text-xs`}></i>
            <span className="text-gray-300 text-xs">{gameState.permissions.includes("broadcastAccess") ? '广播系统 (已解锁)' : '广播系统'}</span>
          </div>
          <div className="flex items-center">
            <i className={`fa-solid ${gameState.permissions.includes("emailAccess") ? 'fa-check-circle text-green-400' : 'fa-lock text-red-400'} mr-2 text-xs`}></i>
            <span className="text-gray-300 text-xs">{gameState.permissions.includes("emailAccess") ? '邮件系统 (已解锁)' : '邮件系统'}</span>
          </div>
        </div>
      </div>
      
      {/* 系统教程 - 移动端简化显示 */}
      <div className="p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
        <h3 className="text-xs font-bold text-blue-400 mb-2">系统指南</h3>
        <ul className="text-gray-300 text-xs space-y-1">
          <li>• 查看摄像头了解情况</li>
          <li>• 联系NPC获取密码</li>
          <li>• 接入网络解锁功能</li>
        </ul>
      </div>
    </div>
  )}
          
          {/* 任务面板折叠按钮 */}
          <button 
            onClick={() => setShowTasksPanel(!showTasksPanel)}
            className="w-full p-3 flex justify-between items-center text-gray-300"
          >
            <span className="flex items-center">
              <i className="fa-solid fa-tasks mr-2 text-green-400"></i>任务与线索
            </span>
            <i className={`fa-solid ${showTasksPanel ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
          </button>
          
          {/* 任务面板内容 */}
          {showTasksPanel && (
            <div className="p-4 bg-gray-900/50 max-h-60 overflow-y-auto">
              <h2 className="text-sm font-bold text-white mb-3">当前任务</h2>
              <div className="space-y-3">
                <div className={`p-3 rounded-lg flex items-center ${
                  hasViewedAllCameras ? 'bg-green-900/20 border border-green-500' : 'bg-gray-900 border border-gray-700'
                }`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                    hasViewedAllCameras ? 'bg-green-500' : 'bg-gray-700'
                  }`}>
                    {hasViewedAllCameras ? (
                      <i className="fa-solid fa-check text-white text-xs"></i>
                    ) : (
                      <span className="text-white text-xs">1</span>
                    )}
                  </div>
                  <span className="text-gray-300 text-xs">查看所有摄像头画面</span>
                </div>
                
                <div className={`p-3 rounded-lg flex items-center ${
                  discoveredNPCs.length > 0 ? 'bg-green-900/20 border border-green-500' : 'bg-gray-900 border border-gray-700'
                }`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                    discoveredNPCs.length > 0 ? 'bg-green-500' : 'bg-gray-700'
                  }`}>
                    {discoveredNPCs.length > 0 ? (
                      <i className="fa-solid fa-check text-white text-xs"></i>
                    ) : (
                      <span className="text-white text-xs">2</span>
                    )}
                  </div>
                  <span className="text-gray-300 text-xs">联系NPC获取网络密码</span>
                </div>
                
                <div className={`p-3 rounded-lg flex items-center ${
                  isNetworkConnected ? 'bg-green-900/20 border border-green-500' : 'bg-gray-900 border border-gray-700'
                }`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                    isNetworkConnected ? 'bg-green-500' : 'bg-gray-700'
                  }`}>
                    {isNetworkConnected ? (
                      <i className="fa-solid fa-check text-white text-xs"></i>
                    ) : (
                      <span className="text-white text-xs">3</span>
                    )}
                  </div>
                  <span className="text-gray-300 text-xs">接入大楼网络</span>
                </div>
              </div>
              
              {Object.keys(gameState.trustLevel).length > 0 && (
                <>
                  <h3 className="text-sm font-bold text-white mt-4 mb-3">信任值</h3>
                  <div className="space-y-3">
                    {Object.entries(gameState.trustLevel).map(([npc, level]) => (
                       <div key={npc} className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-gray-400 text-xs">{npc}</span>
                          <span className="text-gray-300 text-xs">{level}/100</span>
                        </div>
                        <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              level > 70 ? 'bg-green-500' : 
                              level > 30 ? 'bg-yellow-500' : 
                              'bg-red-500'
                            }`} 
                            style={{ width: `${Math.max(0, Math.min(100, level))}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                    
                    {/* 移动端道德值显示 */}
                    <div className="space-y-1 mt-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400 text-xs">道德值</span>
                        <span className="text-gray-300 text-xs">{gameState.moralLevel}/100</span>
                      </div>
                      <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            gameState.moralLevel > 70 ? 'bg-green-500' : 
                            gameState.moralLevel > 30 ? 'bg-yellow-500' : 
                            'bg-red-500'
                          }`} 
                          style={{ width: `${gameState.moralLevel}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* 数据流背景 */}
      <div className="absolute inset-0 flex flex-col justify-between opacity-10 pointer-events-none">
        {dataFlows.map((flow, index) => (
          <div 
            key={index} 
            className="flex justify-between"
            style={{ 
              animationDelay: `${index * 0.2}s`,
              opacity: 0.7 + Math.random() * 0.3 
            }}
          >
            <span>{flow}</span>
            <span>{flow}</span>
          </div>
        ))}
      </div>
      
      {/* 对话界面 */}
      {renderDialogue()}
      
      {/* 引导提示 */}
      {renderGuideTip()}
    </div>
  );
}