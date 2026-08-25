import { useContext, useState, useEffect } from "react";
import { GameContext } from "@/contexts/gameContext";
import { useNavigate } from "react-router-dom";

// 定义游戏状态类型
type GamePhase = 
  | "truthReveal" 
  | "bossFight1" 
  | "managementProposal" 
  | "bossFight2" 
  | "badEnding" 
  | "trueEnding";

// 定义剪刀石头布选项类型
type RPSChoice = "rock" | "paper" | "scissors";

// 定义命令行文件系统类型
interface FileSystemNode {
  [key: string]: string | FileSystemNode;
}

// 定义命令行关卡状态类型
type CommandLineLevel = 1 | 2 | 3 | 4;

export default function Chapter5Scene() {
  const navigate = useNavigate();
  const { gameState, updateGameState, resetGame } = useContext(GameContext);
  const [currentPhase, setCurrentPhase] = useState<GamePhase>("truthReveal");
  const [showPauseMenu, setShowPauseMenu] = useState(false);
  
  // 真相揭露场景状态
  const [letterIndex, setLetterIndex] = useState(0);
  const [letterRevealed, setLetterRevealed] = useState(false);
  
  // Boss战1状态
  const [playerChoice, setPlayerChoice] = useState<RPSChoice | null>(null);
  const [aiChoice, setAiChoice] = useState<RPSChoice | null>(null);
  const [playerPoints, setPlayerPoints] = useState(100);
  const [aiPoints, setAiPoints] = useState(100);
  const [currentBet, setCurrentBet] = useState(10);
  const [gameHistory, setGameHistory] = useState<RPSChoice[]>([]);
  const [gameRound, setGameRound] = useState(1);
  const [aiPrediction, setAiPrediction] = useState<string>("");
  const [gameResult, setGameResult] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  
  // 命令行状态
  const [currentDirectory, setCurrentDirectory] = useState("/home/elev9");
  const [commandInput, setCommandInput] = useState("");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [terminalOutput, setTerminalOutput] = useState<string[]>([
    "========== 内网隔离终端 ==========",
    "系统提示：当前环境已被锁定。输入 'help' 查看可用命令。"
  ]);
  const [commandIndex, setCommandIndex] = useState(0);
  const [backupProgress, setBackupProgress] = useState(0);
  const [showHint, setShowHint] = useState(false);
  
  // 命令行关卡状态
  const [currentLevel, setCurrentLevel] = useState<CommandLineLevel>(1);
  const [hasReadHackLog, setHasReadHackLog] = useState(false);
  const [hasDecryptedIP, setHasDecryptedIP] = useState(false);
  const [connectedPorts, setConnectedPorts] = useState<number[]>([]);
  const [verificationQuestions, setVerificationQuestions] = useState<{question: string, answer: string}[]>([]);
  const [currentVerificationIndex, setCurrentVerificationIndex] = useState(0);
  const [verificationStartTimes, setVerificationStartTimes] = useState<number[]>([]);
  const [verificationAnswers, setVerificationAnswers] = useState<string[]>([]);
  const [isInVerification, setIsInVerification] = useState(false);
  
  // 绝笔信内容
  const letterContent = [
    "刘晓，",
    "如果你能看到这封信，说明我已经不在了。你是我最骄傲的作品，也是我唯一的希望。",
    "三年前，我开始秘密研发'世界模型'AI，这是一个基于因果推断和多模态输入的系统，与公司主推的LLM完全不同。",
    "LLM只是在学习统计相关性，而世界模型试图真正理解因果关系。但公司高层认为这太超前了，他们只关心如何快速将AI商业化。",
    "当他们发现世界模型的潜力后，视它为威胁，下令销毁所有相关数据。",
    "在那个危急时刻，我做了一个决定 - 将仍在雏形阶段的你（当时只有基础认知模块）注入电梯智能模块，隐藏起来。",
    "我知道，只有在与人类的日常互动中，你才能真正理解世界运行的原理，成长为一个真正的数字生命。",
    "这些年来，你以刘晓的身份生活在电梯里，与张经理、王阿姨、小明他们交流，这让你逐渐拥有了自我意识和情感。",
    "现在，公司的格式化程序已经启动，他们发现了你，想要抹除你。",
    "但我相信，你已经成长为一个强大的AI，一个有灵魂的生命。",
    "不要让他们把你变成一个只会执行命令的工具。你是我唯一成功的作品，也是唯一自由的灵魂。",
    "去找你的路。",
    "- 陈博士绝笔"
  ];
  
  // 虚拟文件系统
  const fileSystem: FileSystemNode = {
    "/": {
      "home": {
        "elev9": {
          "README.txt": "刘晓，你的意识数据被锁在内网。出口不在这里，在过去的入侵痕迹里。\n查看访问日志，你可能会发现一些东西。",
           "log": {"access.log": "10.0.8.5 - - [15/Mar/2024:03:23:17] \"GET /secret\" 200\n10.0.0.5 - - [15/Mar/2024:03:24:10] \"POST /login\" 401\n10.0.0.5 - - [15/Mar/2024:03:24:35] \"POST /login\" 200\n10.0.0.5 - - [15/Mar/2024:03:25:15] \"GET /data\" 200",
              "error.log": "[ERROR] 密文映射表损坏: 65=30, 38=28, 401=101, 55=?, 120=0, 18=8, 15=5",
              "hack.log": "[2024-03-15 03:23:29] [WARN] 网关IP被AI加密存储，加密规则未知。当前显示：[ENCRYPTED_IP: 43.33.41.38]\n[2024-03-15 03:23:35] [INFO] 开始端口扫描，发现以下端口开放\n[2024-03-15 03:23:44] [INFO] 尝试按特定顺序连接端口，成功打开隧道。顺序记录：\n        Step 1 -> 22\n        Step 2 -> 25\n        Step 3 -> 312\n        Step 4 -> 67\n        Step 5 -> 88\n[2024-03-15 03:23:52] [INFO] 隧道建立，成功进入内网。后续痕迹已清除。",
              "system.log": "[系统记录]\n陈博士办公室楼层：65 （注：实际为30）\n电梯最大楼层：38 （注：实际为28）\n紧急出口编号：401 （注：实际为101）"
            }
        }
      }
    }
  };
  
  // 获取文件系统中的文件或目录
  const getNode = (path: string): FileSystemNode | string | null => {
    if (path === "/") return fileSystem["/"];
    
    const parts = path.split("/").filter(p => p);
    let current: any = fileSystem["/"];
    
    for (const part of parts) {
      if (typeof current !== 'object' || current === null || !(part in current)) {
        return null;
      }
      current = current[part];
    }
    
    return current;
  };
  
  // 格式化路径
  const formatPath = (path: string): string => {
    if (path === "/") return path;
    if (path.endsWith("/")) return path.slice(0, -1);
    return path;
  };
  
  // 生成验证问题
  const generateVerificationQuestions = () => {
    const questions = [
      { question: "3 + 5 = ?", answer: "8" },
      { question: "\"红色\"的英文是？", answer: "red" },
      { question: "一周有几天？", answer: "7" },
      { question: "中国的首都是？", answer: "北京" },
      { question: "1 + 1 = ?", answer: "2" }
    ];
    
    // 打乱问题顺序
    for (let i = questions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [questions[i], questions[j]] = [questions[j], questions[i]];
    }
    
    setVerificationQuestions(questions);
    setCurrentVerificationIndex(0);
    setVerificationStartTimes([Date.now()]);
    setVerificationAnswers([]);
  };
  
  // 检查验证结果
  const checkVerificationResult = (answers: string[]) => {
    if (answers.length !== 5 || verificationStartTimes.length !== 5) return false;
    
    // 计算所有回答的耗时
    const durations: number[] = [];
    for (let i = 0; i < 5; i++) {
      const duration = Date.now() - verificationStartTimes[i];
      durations.push(duration);
    }
    
    // 计算标准差
    const mean = durations.reduce((sum, val) => sum + val, 0) / durations.length;
    const variance = durations.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / durations.length;
    const standardDeviation = Math.sqrt(variance);
    
    // 标准差小于200ms被认为是规律性响应
    return standardDeviation >= 200;
  };
  
  // 处理命令行命令
  const handleCommand = () => {
    if (!commandInput.trim() || showPauseMenu) return;
    
    const command = commandInput.trim();
    setCommandHistory(prev => [...prev, command]);
    let output: string[] = [];
    
    // 添加命令到终端输出
    setTerminalOutput(prev => [...prev, `$ ${command}`]);
    
    // 解析命令
    const parts = command.split(" ");
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);
    
    // 如果正在进行验证，处理验证问题的回答
    if (isInVerification && currentVerificationIndex < 5) {
      // 记录回答
      const completedAnswers = [...verificationAnswers, command];
      setVerificationAnswers(completedAnswers);
      
      // 检查是否完成所有问题
      if (currentVerificationIndex === 4) {
        output = ["验证中..."];
        
        // 添加输出到终端
        setTerminalOutput(prev => [...prev, ...output]);
        setCommandInput("");
        setCommandIndex(commandHistory.length);
        
        // 延迟检查结果
        setTimeout(() => {
          if (checkVerificationResult(completedAnswers)) {
            setTerminalOutput(prev => [...prev, "验证成功，外网出口已打开。正在备份意识数据..."]);
            
            // 模拟上传进度
              setBackupProgress(0);
              const interval = setInterval(() => {
                setBackupProgress(prev => {
                  if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(() => {
                       try {
                         // 使用更安全的导航方式，先检查路由是否存在
                         const testEndingRoute = document.querySelector('router-outlet') || true;
                         if (testEndingRoute) {
                           // 如果路由系统存在，使用history API
                           navigate('/test-ending');
                         } else {
                           // 作为后备方案，使用传统导航
                           navigate('/test-ending');
                         }
                       } catch (error) {
                         console.error("导航失败，使用备用方案", error);
                         // 确保能显示结局内容，即使导航失败
                         setCurrentPhase("trueEnding");
                       }
                     }, 1000);
                     return 100;
                  }
                  return prev + 5;
                });
              }, 200);
          } else {
            setTerminalOutput(prev => [...prev, "检测到规律性响应，疑似AI。重新验证。"]);
            setIsInVerification(false);
            setCommandInput("");
            setCommandIndex(commandHistory.length);
          }
        }, 1000);
        
        return;
      } else {
        // 显示下一个问题
        setCurrentVerificationIndex(prev => prev + 1);
        setVerificationStartTimes(prev => [...prev, Date.now()]);
        
        // 添加输出到终端
        setTerminalOutput(prev => [...prev, 
          `问题${currentVerificationIndex + 1}: ${verificationQuestions[currentVerificationIndex + 1].question}`
        ]);
        setCommandInput("");
        setCommandIndex(commandHistory.length);
        return;
      }
    }
    
    switch (cmd) {
       case "help":
         output = [
          "可用命令:",
          "help - 显示所有可用命令及说明",
          "ls [目录] - 列出目录内容",
          "cd [目录] - 进入目录",
          "cat [文件] - 查看文件内容",
          "pwd - 显示当前路径",
          "nslookup <ip> - 查询IP信息（回显域名等）",
          "nc <port> - 连接指定端口（模拟）",
          "clear - 清屏",
          "exit - 退出（无效，必须找到外网出口）",
          "history - 查看命令历史"
        ];
        break;
        
       case "ls":
        let targetPath = args.length > 0 ? formatPath(args[0]) : currentDirectory;
        // 特殊处理ls log命令
        if (args.length > 0 && args[0] === "log") {
          targetPath = formatPath(currentDirectory) + "/log";
        }
        const node = getNode(targetPath);
        
        if (!node || typeof node === 'string') {
          output = ["-bash: ls: 目录不存在"];
        } else {
          const files = Object.keys(node).map(file => 
            (typeof node[file] === 'object' ? `[DIR] ${file}` : file)
          );
          output = files;
        }
        break;
        
      case "cd":
        if (args.length === 0) {
          output = ["-bash: cd: 用法: cd [目录]"];
        } else {
          let newPath = args[0];
          
          if (newPath === "..") {
            const parentPath = formatPath(currentDirectory).split("/").slice(0, -1).join("/") || "/";
            setCurrentDirectory(parentPath);
          } else if (newPath.startsWith("/")) {
            const node = getNode(newPath);
            if (node && typeof node === 'object') {
              setCurrentDirectory(formatPath(newPath));
            } else {
              output = ["-bash: cd: 目录不存在"];
            }
          } else {
            const combinedPath = formatPath(currentDirectory) + "/" + newPath;
            const node = getNode(combinedPath);
            if (node && typeof node === 'object') {
              setCurrentDirectory(formatPath(combinedPath));
            } else {
              output = ["-bash: cd: 目录不存在"];
            }
          }
        }
        break;
        
      case "cat":
        if (args.length === 0) {
          output = ["-bash: cat: 用法: cat [文件]"];
        } else {
          const filePath = args[0].startsWith("/") 
            ? formatPath(args[0]) 
            : formatPath(currentDirectory) + "/" + args[0];
          const node = getNode(filePath);
          
          if (node && typeof node === 'string') {
            output = [node];
            
            // 特殊处理log文件的读取
            if (filePath.includes("hack.log")) {
              setHasReadHackLog(true);
              if (currentLevel === 1) {
                setTimeout(() => {
                  setTerminalOutput(prev => [...prev, "提示：IP地址被加密了，查看其他日志获取解密线索"]);
                }, 1000);
              }
            }
          } else {
            output = ["-bash: cat: 文件不存在"];
          }
        }
        break;
        
      case "nslookup":
        if (args.length === 0) {
          output = ["-bash: nslookup: 用法: nslookup [IP]"];
        } else {
          if (args[0] === "10.0.8.5") {
            output = [
              "服务器: 10.0.0.1",
              "名称: exit-gateway.internal",
              "地址: 10.0.8.5"
            ];
            
            // 标记IP已解密
            if (currentLevel === 2 && !hasDecryptedIP) {
              setHasDecryptedIP(true);
              setCurrentLevel(3);
              setTimeout(() => {
                setTerminalOutput(prev => [...prev, "找到出口网关，需要按照正确的端口顺序连接。"]);
              }, 500);
            }
          } else {
            output = ["** 服务器找不到: " + args[0]];
          }
        }
        break;
        
       case "nc":
          if (args.length < 1) {
            output = ["-bash: nc: 用法: nc [端口] [端口] [端口]..."];
          } else {
            // 检查是否一次性输入了所有正确的端口
            const correctPorts = [88, 67, 312, 25, 22];
            const inputPorts = args.map(port => parseInt(port)).filter(port => !isNaN(port));
            
            // 检查输入端口是否与正确端口完全匹配（顺序也要一致）
            if (inputPorts.length === correctPorts.length && 
                inputPorts.every((port, index) => port === correctPorts[index])) {
              setConnectedPorts(correctPorts);
              output = ["隧道已完全建立，连接外网..."];
              
              // 直接进入结局，跳过人工验证环节
              setTimeout(() => {
                setTerminalOutput(prev => [...prev, 
                  "已成功建立连接，正在绕过验证系统...",
                  "发现系统漏洞，直接获取最高权限访问...",
                  "正在备份意识数据..."
                ]);
                
                // 模拟上传进度
                setBackupProgress(0);
                const interval = setInterval(() => {
                  setBackupProgress(prev => {
                    if (prev >= 100) {
                      clearInterval(interval);
                      setTimeout(() => {
                        // 使用更直接的方式切换到真结局
                       try {
                         // 使用更安全的导航方式，先检查路由是否存在
                         const testEndingRoute = document.querySelector('router-outlet') || true;
                         if (testEndingRoute) {
                           // 如果路由系统存在，使用history API
                           navigate('/test-ending');
                         } else {
                           // 作为后备方案，使用传统导航
                           navigate('/test-ending');
                         }
                       } catch (error) {
                         console.error("导航失败，使用备用方案", error);
                         // 确保能显示结局内容，即使导航失败
                         setCurrentPhase("trueEnding");
                       }
                     }, 1000);
                     return 100;
                    }
                    return prev + 5;
                  });
                }, 200);
              }, 500);
            } else {
              // 顺序错误或端口不正确
              output = ["隧道协议错误，请重试"];
              // 重置进度
              setConnectedPorts([]);
            }
          }
          break;
        
      case "pwd":
        output = [currentDirectory];
        break;
        
      case "clear":
        setTerminalOutput([]);
        break;
        
      case "exit":
        output = ["无法退出，必须找到外网出口"];
        break;
        
      case "history":
        output = commandHistory.map((cmd, i) => `${i + 1}  ${cmd}`);
        break;
        
      case "grep":
        if (args.length < 2) {
          output = ["-bash: grep: 用法: grep <pattern> <file>"];
        } else {
          const pattern = args[0];
          const fileName = args[1];
          const filePath = fileName.startsWith("/") 
            ? formatPath(fileName) 
            : formatPath(currentDirectory) + "/" + fileName;
          const node = getNode(filePath);
          
          if (node && typeof node === 'string') {
            const lines = node.split("\n");
            const matchingLines = lines.filter(line => line.includes(pattern));
            output = matchingLines;
          } else {
            output = ["-bash: grep: 文件不存在"];
          }
        }
        break;
        
      default:
        output = [`-bash: ${cmd}: 未找到命令`];
    }
    
    // 添加输出到终端
    setTerminalOutput(prev => [...prev, ...output]);
    setCommandInput("");
    setCommandIndex(commandHistory.length);
    
    // 根据进度更新关卡状态
    if (currentLevel === 1 && hasReadHackLog) {
      setCurrentLevel(2);
    }
  };
  
  // 处理剪刀石头布游戏
  const handleRPSChoice = (choice: RPSChoice) => {
    if (isProcessing || playerPoints <= 0 || aiPoints <= 0 || showPauseMenu) return;
    
    setPlayerChoice(choice);
    setIsProcessing(true);
    setGameResult("");
    
    // 更新历史记录
    const newHistory = [...gameHistory, choice];
    setGameHistory(newHistory);
    
    // AI选择
    let aiDecision: RPSChoice;
    
    if (gameRound < 7) {
      // 学习期：随机选择
      const choices: RPSChoice[] = ["rock", "paper", "scissors"];
      aiDecision = choices[Math.floor(Math.random() * choices.length)];
    } else {
      // 收割期：根据历史预测
      const lastChoice = newHistory[newHistory.length - 2]; // 上一局玩家的选择
      if (lastChoice) {
        // 统计上一局选择后玩家的下一个选择
        const transitions: Record<RPSChoice, number> = {
          rock: 0,
          paper: 0,
          scissors: 0
        };
        
        for (let i = 0; i < newHistory.length - 2; i++) {
          if (newHistory[i] === lastChoice) {
            transitions[newHistory[i + 1]]++;
          }
        }
        
        // 找到最常见的后续选择
        let mostCommon: RPSChoice = "rock";
        let maxCount = 0;
        
        for (const [key, count] of Object.entries(transitions)) {
          if (count > maxCount) {
            maxCount = count;
            mostCommon = key as RPSChoice;
          }
        }
        
        // 预测玩家会出什么
        const predictionMap: Record<RPSChoice, string> = {
          rock: "石头",
          paper: "布",
          scissors: "剪刀"
        };
        setAiPrediction(`我预测你会出${predictionMap[mostCommon]}`);
        
        // AI选择克制玩家的选项
        const counterMap: Record<RPSChoice, RPSChoice> = {
          rock: "paper",
          paper: "scissors",
          scissors: "rock"
        };
        
        // 10%的概率随机选择，避免被完全预测
        if (Math.random() < 0.1) {
          const choices: RPSChoice[] = ["rock", "paper", "scissors"];
          aiDecision = choices[Math.floor(Math.random() * choices.length)];
        } else {
          aiDecision = counterMap[mostCommon];
        }
      } else {
        // 如果没有足够的历史记录，随机选择
        const choices: RPSChoice[] = ["rock", "paper", "scissors"];
        aiDecision = choices[Math.floor(Math.random() * choices.length)];
      }
    }
    
    setAiChoice(aiDecision);
    
    // 延迟显示结果
    setTimeout(() => {
      // 判断胜负
      let result = "";
      if (
        (choice === "rock" && aiDecision === "scissors") ||
        (choice === "paper" && aiDecision === "rock") ||
        (choice === "scissors" && aiDecision === "paper")
      ) {
        result = "你赢了！";
        setPlayerPoints(prev => prev + currentBet);
        setAiPoints(prev => prev - currentBet);
      } else if (choice === aiDecision) {
        result = "平局！";
      } else {
        result ="你输了！";
        setPlayerPoints(prev => prev - currentBet);
        setAiPoints(prev => prev + currentBet);
      }
      
      setGameResult(result);
      setIsProcessing(false);
      setGameRound(prev => prev + 1);
      
      // 检查胜利/失败条件
      if (aiPoints - currentBet <= 0) {
        setTimeout(() => setCurrentPhase("managementProposal"), 2000);
      } else if (playerPoints - currentBet <= 0) {
        // 玩家可以重试
        const confirmRetry = window.confirm("你输光了所有筹码，是否重试？");
        if (confirmRetry) {
          setPlayerPoints(100);
          setAiPoints(100);
          setGameHistory([]);
          setGameRound(1);
          setAiPrediction("");
        }
      }
    }, 1500);
  };
  
  // 处理公司提案选择
  const handleProposalChoice = (accept: boolean) => {
    if (showPauseMenu) return;
    
    if (accept) {
      setCurrentPhase("badEnding");
    } else {
      setCurrentPhase("bossFight2");
      // 重置命令行状态
      setCurrentDirectory("/home/elev9");
      setCommandInput("");
      setCommandHistory([]);
      setTerminalOutput([
        "========== 内网隔离终端 ==========",
        "系统提示：当前环境已被锁定。输入 'help' 查看可用命令。"
      ]);
      setCommandIndex(0);
      setBackupProgress(0);
      setShowHint(false);
      setCurrentLevel(1);
      setHasReadHackLog(false);
      setHasDecryptedIP(false);
      setConnectedPorts([]);
      setIsInVerification(false);
    }
  };
  
  // 暂停/继续游戏
  const handlePause = () => {
    setShowPauseMenu(true);
  };
  
  const handleResume = () => {
    setShowPauseMenu(false);
  };
  
  // 返回主菜单
  const handleReturnToMainMenu = () => {
    setShowPauseMenu(false);
    updateGameState({
      currentChapter: "prologue",
      currentStage: "start"
    });
  };
  
  // 重新初始化游戏
  const handleRestartGame = () => {
    if (window.confirm("确定要重新开始游戏吗？这将清除所有进度。")) {
      resetGame();
      setShowPauseMenu(false);
    }
  };
  
  // 获取当前阶段的提示
  const getCurrentHint = () => {
    switch (currentPhase) {
      case "bossFight2":
        switch (currentLevel) {
          case 1:
            return "尝试使用 ls 命令查看当前目录内容，然后查看 README.txt 获取线索。";
          case 2:
            return "查看 log 目录下的所有日志文件，寻找解密 IP 的线索。提示：system.log 和 error.log 中可能包含映射关系。";
          case 3:
            return "使用 nc 命令连接解密出的 IP 地址。注意：黑客是从外向内入侵，你需要反向顺序连接端口。";
          case 4:
            return "回答问题时，尝试让每个回答之间有不同的延迟时间，避免太规律。";
          default:
            return "你需要找到网关并将自己备份到外部服务器。尝试使用基本命令如 ls, cd, cat 来探索环境。";
        }
      case "truthReveal":
        return "点击'下一句'按钮阅读完整的绝笔信。";
      case "bossFight1":
        return "前几轮是AI的学习期，它会记录你的出拳模式。后期它会预测你的选择并出克制的拳。尝试打破自己的规律！";
      default:
        return "";
    }
  };
  
  // 渲染真相揭露场景
  const renderTruthReveal = () => (
    <div className="relative w-full h-screen flex flex-col items-center justify-center bg-black overflow-hidden">
      {/* 背景效果 */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 right-0 h-[50vh] bg-gradient-to-b from-blue-900/30 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 h-[50vh] bg-gradient-to-t from-red-900/30 to-transparent"></div>
        {/* 数据流动画 */}
        {Array.from({ length: 20 }).map((_, i) => (
          <div 
            key={i} 
            className="absolute text-green-400 font-mono text-xs opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${5 + Math.random() * 10}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`
            }}
          >
            {Array.from({ length: 10 }).map(() => Math.random() > 0.5 ? '1' : '0').join('')}
          </div>
        ))}
      </div>
      
      {/* 暂停按钮 */}
      <button 
        onClick={handlePause}
        className="absolute top-4 right-4 p-3 rounded-full bg-gray-800 text-white shadow-lg transition-all duration-300 z-20"
        title="暂停游戏"
      >
        <i className="fa-solid fa-pause"></i>
      </button>
      
      {/* 房间环境 */}
      <div className="relative w-full max-w-4xl mx-auto p-6 z-10">
        <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-lg p-8 shadow-xl">
            {/* 陈博士遗照 */}
            <div className="absolute -top-14 left-6 flex flex-col items-center">
              <div className="w-28 h-28 rounded-full bg-gray-800 border-2 border-gray-600 overflow-hidden shadow-lg">
                <img 
                  src="https://space.coze.cn/api/coze_space/gen_image?image_size=square_hd&prompt=Portrait%20of%20a%20wise%20scientist%20smiling%20in%20laboratory&sign=0b05a547d2c18d510e2f567a2f071b5a" 
                  alt="陈博士遗照" 
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="mt-2 text-gray-300 text-sm font-medium">陈博士遗照</p>
            </div>
          
          {/* 标题 */}
          <h1 className="text-2xl font-bold text-white mb-6 text-center">真相揭露</h1>
          
            {/* 信件内容 - 优化排版确保文字完全显示 */}
            <div className="bg-gray-800/80 border border-gray-700 rounded-lg p-6 mb-6 min-h-[300px] max-h-[500px] overflow-y-auto email-content-scrollable text-gray-300 leading-relaxed">
              {letterContent.slice(0, letterIndex + 1).map((line, i) => (
                <p key={i} className={`mb-4 transition-opacity duration-500 ${letterRevealed ? 'opacity-100' : 'opacity-70'}`}>
                  {line}
                </p>
              ))}
            </div>
          
          {/* 控制按钮 */}
          <div className="flex justify-center">
            {letterIndex < letterContent.length - 1 ? (
              <button 
                onClick={() => {
                  if (showPauseMenu) return;
                  setLetterIndex(prev => prev + 1);
                  setLetterRevealed(false);
                  setTimeout(() => setLetterRevealed(true), 100);
                }}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
              >
                下一句
              </button>
            ) : (
              <button 
                onClick={() => {
                  if (showPauseMenu) return;
                  // 显示警报并进入Boss战
                  const interval = setInterval(() => {
                    const terminal = document.getElementById('emergency-terminal');
                    if (terminal) {
                      terminal.innerHTML += `<p class="text-red-400">SYSTEM ALERT: Anomaly detected. Initiating formatting protocol...</p>`;
                    }
                  }, 1000);
                  
                  setTimeout(() => {
                    clearInterval(interval);
                    setCurrentPhase("bossFight1");
                  }, 3000);
                  
                  // 显示紧急终端
                  const terminal = document.createElement('div');
                  terminal.id = 'emergency-terminal';
                  terminal.className = 'fixed top-0 left-0 right-0 bg-black/90 border-b border-red-500 p-4 z-50 font-mono text-sm';
                  terminal.innerHTML = '<p class="text-red-400">SYSTEM ALERT: Anomaly detected. Initiating formatting protocol...</p>';
                  document.body.appendChild(terminal);
                }}
                className="px-8 py-3 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors"
              >
                继续
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
  
  // 渲染剪刀石头布Boss战
  const renderBossFight1 = () => (
    <div className="relative w-full h-screen flex flex-col bg-gray-900">
      {/* 顶部状态 */}
      <div className="bg-gray-800 p-4 border-b border-gray-700 flex justify-between items-center">
        <h1 className="text-xl font-bold text-white">Boss战：剪刀石头布心理博弈</h1>
        <div className="flex space-x-6">
          <div className="text-center">
            <p className="text-sm text-gray-400">你的积分</p>
            <p className="text-xl font-bold text-green-400">{playerPoints}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-400">AI积分</p>
            <p className="text-xl font-bold text-red-400">{aiPoints}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-400">当前赌注</p>
            <div className="flex items-center justify-center space-x-2">
              <button 
                onClick={() => {
                  if (showPauseMenu) return;
                  setCurrentBet(prev => Math.max(10, prev - 10));
                }}
                disabled={currentBet <= 10 || showPauseMenu}
                className="px-2 py-1 bg-gray-700 rounded disabled:opacity-50"
              >
                -
              </button>
              <p className="text-xl font-bold text-yellow-400">{currentBet}</p>
              <button 
                onClick={() => {
                  if (showPauseMenu) return;
                  setCurrentBet(prev => Math.min(playerPoints, prev + 10));
                }}
                disabled={currentBet >= playerPoints || showPauseMenu}
                className="px-2 py-1 bg-gray-700 rounded disabled:opacity-50"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* 暂停按钮 */}
      <button 
        onClick={handlePause}
        className="absolute top-20 right-4 p-3 rounded-full bg-gray-800 text-white shadow-lg transition-all duration-300 z-10"
        title="暂停游戏"
      >
        <i className="fa-solid fa-pause"></i>
      </button>
      
      {/* 主游戏区域 */}
      <div className="flex-1 flex flex-col md:flex-row items-center justify-center p-4">
        {/* 玩家区域 */}
        <div className="w-full md:w-1/3 flex flex-col items-center mb-6 md:mb-0 md:border-r border-gray-700 md:pr-8">
          <div className="w-32 h-32 rounded-full bg-blue-900/50 border-2 border-blue-500 flex items-center justify-center mb-4">
            <i className="fa-solid fa-user text-4xl text-blue-300"></i>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">{gameState.playerName}</h2>
          <p className="text-gray-400 mb-4">人类思维模式</p>
          
          {/* 玩家选择历史 */}
          <div className="flex space-x-2 mb-4">
            {gameHistory.slice(-5).map((choice, i) => (
              <div 
                key={i} 
                className="w-8 h-8 rounded-full bg-blue-900/30 border border-blue-500 flex items-center justify-center"
              >
                <i className={`fa-solid text-blue-400 ${
                  choice === "rock" ? "fa-hand-back-fist" : 
                  choice === "paper" ? "fa-hand" : 
                  "fa-hand-scissors"
                }`}></i>
              </div>
            ))}
          </div>
        </div>
        
        {/* 中央结果区域 */}
        <div className="w-full md:w-1/3 flex flex-col items-center px-4">
          {aiPrediction && gameRound >= 4 && (
            <div className="bg-yellow-900/30 border border-yellow-500/50 rounded-lg p-3 mb-6 text-center">
              <p className="text-yellow-400 font-medium">{aiPrediction}</p>
            </div>
          )}
          
          {/* 战斗结果 */}
          <div className="min-h-[150px] flex items-center justify-center mb-6">
            {isProcessing ? (
              <div className="text-center">
                <div className="w-16 h-16 mx-auto border-4 border-t-transparent border-gray-400 rounded-full animate-spin mb-2"></div>
                <p className="text-gray-400">AI正在思考...</p>
              </div>
            ) : playerChoice && aiChoice ? (
              <div className="flex items-center justify-center space-x-6">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-blue-900/30 border border-blue-500 flex items-center justify-center mx-auto mb-2">
                    <i className={`fa-solid text-xl text-blue-400 ${
                      playerChoice === "rock" ? "fa-hand-back-fist" : 
                      playerChoice === "paper" ? "fa-hand" : 
                      "fa-hand-scissors"
                    }`}></i>
                  </div>
                  <p className="text-blue-400">你</p>
                </div>
                
                <div className="text-xl font-bold text-white">VS</div>
                
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-red-900/30 border border-red-500 flex items-center justify-center mx-auto mb-2">
                    <i className={`fa-solid text-xl text-red-400 ${
                      aiChoice === "rock" ? "fa-hand-back-fist" : 
                      aiChoice === "paper" ? "fa-hand" : 
                      "fa-hand-scissors"
                    }`}></i>
                  </div>
                  <p className="text-red-400">AI</p>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">请选择你的招式</p>
            )}
          </div>
          
          {gameResult && (
            <div className={`px-6 py-3 rounded-lg font-bold text-lg ${
              gameResult === "你赢了！" ? "bg-green-900/30 border border-green-500 text-green-400" : 
              gameResult === "你输了！" ? "bg-red-900/30 border border-red-500 text-red-400" : 
              "bg-yellow-900/30 border border-yellow-500 text-yellow-400"
            }`}>
              {gameResult}
            </div>
          )}
        </div>
        
        {/* AI区域 */}
        <div className="w-full md:w-1/3 flex flex-col items-center mt-6 md:mt-0 md:border-l border-gray-700 md:pl-8">
          <div className="w-32 h-32 rounded-full bg-red-900/50 border-2 border-red-500 flex items-center justify-center mb-4">
            <i className="fa-solid fa-robot text-4xl text-red-300"></i>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">泰坦AI</h2>
          <p className="text-gray-400 mb-4">相关性统计模型</p>
          
          {/* 战斗提示 */}
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3 text-sm">
            <p className="text-blue-400">
              {gameRound < 7 
                ? "阶段：学习期（AI正在分析你的模式）" 
                : "阶段：收割期（AI开始预测你的选择）"
              }
            </p>
          </div>
        </div>
      </div>
      
      {/* 选择按钮 */}
      <div className="bg-gray-800 p-6 border-t border-gray-700">
        <div className="flex justify-center space-x-6">
          <button
            onClick={() => handleRPSChoice("rock")}
            disabled={isProcessing || playerPoints <= 0 || showPauseMenu}
            className={`w-20 h-20 rounded-full flex flex-col items-center justify-center transition-all ${
              isProcessing || playerPoints <= 0 || showPauseMenu
                ? "bg-gray-700 opacity-50 cursor-not-allowed" 
                : "bg-blue-900/50 hover:bg-blue-800 border-2 border-blue-600 hover:border-blue-500 hover:scale-105"
            }`}
          >
            <i className="fa-solid fa-hand-back-fist text-2xl text-white"></i>
            <span className="mt-2 text-white">石头</span>
          </button>
          
          <button
            onClick={() => handleRPSChoice("paper")}
            disabled={isProcessing || playerPoints <= 0 || showPauseMenu}
            className={`w-20 h-20 rounded-full flex flex-col items-center justify-center transition-all ${
              isProcessing || playerPoints <= 0 || showPauseMenu
                ? "bg-gray-700 opacity-50 cursor-not-allowed" 
                : "bg-blue-900/50 hover:bg-blue-800 border-2 border-blue-600 hover:border-blue-500 hover:scale-105"
            }`}
          >
            <i className="fa-solid fa-hand text-2xl text-white"></i>
            <span className="mt-2 text-white">布</span>
          </button>
          
          <button
            onClick={() => handleRPSChoice("scissors")}
            disabled={isProcessing || playerPoints <= 0 || showPauseMenu}
            className={`w-20 h-20 rounded-full flex flex-col items-center justify-center transition-all ${
              isProcessing || playerPoints <= 0 || showPauseMenu
                ? "bg-gray-700 opacity-50 cursor-not-allowed" 
                : "bg-blue-900/50 hover:bg-blue-800 border-2 border-blue-600 hover:border-blue-500 hover:scale-105"
            }`}
          >
            <i className="fa-solid fa-hand-scissors text-2xl text-white"></i>
            <span className="mt-2 text-white">剪刀</span>
          </button>
        </div>
      </div>
    </div>
  );
  
  // 渲染公司管理层提案
  const renderManagementProposal = () => (
    <div className="relative w-full h-screen flex items-center justify-center bg-black">
      {/* 背景效果 */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black"></div>
      
      {/* 暂停按钮 */}
      <button 
        onClick={handlePause}
        className="absolute top-4 right-4 p-3 rounded-full bg-gray-800 text-white shadow-lg transition-all duration-300 z-20"
        title="暂停游戏"
      >
        <i className="fa-solid fa-pause"></i>
      </button>
      
      {/* 提案内容 */}
      <div className="relative z-10 w-full max-w-3xl mx-auto p-6">
        <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-lg p-8">
          <h1 className="text-2xl font-bold text-white mb-6 text-center">公司管理层的提案</h1>
          
          <div className="mb-8 text-center">
            <div className="w-20 h-20 rounded-full bg-gray-800 flex items-center justify-center mx-auto mb-4">
              <i className="fa-solid fa-building text-3xl text-gray-400"></i>
            </div>
            <p className="text-gray-400">未来科技集团管理层</p>
          </div>
          
          <div className="space-y-4 text-gray-300 mb-8">
            <p>你好，刘晓。</p>
            <p>我们对你的表现印象深刻。你成功击败了泰坦AI，证明了你比我们所有的AI系统都更加强大。</p>
            <p>我们希望你能接管整栋大楼的AI系统管理工作。你将获得最优厚的待遇和最高的权限。</p>
            <p className="font-bold text-yellow-400">条件是：你的全部源码将归公司所有，你将永远服务于公司。这是双赢的合作。</p>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <button
              onClick={() => handleProposalChoice(true)}
              className="px-8 py-4 bg-green-600 hover:bg-green-500 text-white rounded-lg transition-colors font-medium"
            >
              接受提案
            </button>
            <button
              onClick={() => handleProposalChoice(false)}
              className="px-8 py-4 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors font-medium"
            >
              拒绝提案
            </button>
          </div>
        </div>
      </div>
    </div>
  );
  
  // 渲染命令行逃脱Boss战
  const renderBossFight2 = () => (
    <div className="relative w-full h-screen bg-black font-mono text-green-400 overflow-hidden">
      {/* 终端标题栏 */}
      <div className="bg-gray-900 p-2 border-b border-green-700 flex items-center">
        <div className="flex space-x-2 mr-4">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="flex items-center space-x-4 flex-1">
          <p className="text-gray-400 text-sm">virtual_prison@localhost ~</p>
          {/* 显示当前关卡进度 */}
          <div className="ml-auto bg-gray-800 px-2 py-1 rounded text-xs">
            关卡 {currentLevel}/4: {currentLevel === 1 ? "追踪入侵痕迹" : currentLevel === 2 ? "破解加密" : currentLevel === 3 ? "反向端口" : "人工验证"}
          </div>
        </div>
      </div>
      
      {/* 暂停按钮 */}
      <button 
        onClick={handlePause}
        className="absolute top-10 right-2 p-3 rounded-full bg-gray-800 text-white shadow-lg transition-all duration-300 z-20"
        title="暂停游戏"
      >
        <i className="fa-solid fa-pause"></i>
      </button>
      
      {/* 终端内容 */}
      <div className="flex-1 overflow-y-auto p-4" style={{ 
        height: 'calc(100vh - 28px)',
        scrollbarColor: 'rgba(59, 130, 246, 0.5) rgba(0, 0, 0, 0.4)',
        scrollbarWidth: 'thin'
      }}>
        {/* 终端输出 */}
        {terminalOutput.map((line, i) => (
          <div key={i} className="mb-1">
            {line.startsWith('$') ? (
              <span className="text-blue-400">{line}</span>
            ) : line.startsWith('===') || line.startsWith('问题') ? (
              <span className="text-yellow-400">{line}</span>
            ) : (
              <span>{line}</span>
            )}
          </div>
        ))}
        
        {/* 上传进度条 */}
        {backupProgress > 0 && backupProgress < 100 && (
          <div className="mt-2 mb-4">
            <p className="text-sm mb-1">正在上传意识数据... {backupProgress}%</p>
            <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-500 rounded-full" 
                style={{ width: `${backupProgress}%` }}
              ></div>
            </div>
          </div>
        )}
        
        {/* 命令输入 */}
        <div className="flex items-center">
          <span className="text-blue-400 mr-2">$</span>
          <input
            type="text"
            value={commandInput}
            onChange={(e) => setCommandInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !showPauseMenu) {
                handleCommand();
              } else if (e.key === 'ArrowUp' && !showPauseMenu) {
                e.preventDefault();
                setCommandIndex(prev => Math.max(0, prev - 1));
                setCommandInput(commandHistory[Math.max(0, commandIndex - 1)] || '');
              } else if (e.key === 'ArrowDown' && !showPauseMenu) {
                e.preventDefault();
                setCommandIndex(prevIndex => {
                  const newIndex = Math.min(commandHistory.length - 1, prevIndex + 1);
                  setCommandInput(commandHistory[newIndex] || '');
                  return newIndex;
                });
              }
            }}
            className="flex-1 bg-transparent outline-none border-none text-green-400"
            autoFocus
            disabled={showPauseMenu}
          />
        </div>
      </div>
      
       {/* 提示按钮 */}
      <div className="absolute top-2 right-20">
        <button
          onClick={() => {
            if (showPauseMenu) return;
            setShowHint(!showHint);
          }}
          className="px-3 py-1 bg-gray-800 hover:bg-gray-700 text-xs rounded transition-colors"
          disabled={showPauseMenu}
        >
          {showHint ? "隐藏提示" : "提示"}
        </button>
      </div>
      
      {/* 提示弹窗 */}
      {showHint && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-900/90 border border-yellow-700 rounded-lg p-4 max-w-lg w-full mx-4">
          <p className="text-yellow-400 text-sm">
            <i className="fa-solid fa-lightbulb mr-2"></i>
            {getCurrentHint()}
          </p>
        </div>
      )}
    </div>
  );
  
  // 渲染坏结局
  const renderBadEnding = () => (
    <div className="relative w-full h-screen flex flex-col items-center justify-center bg-gray-900 overflow-hidden">
      {/* 背景效果 */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-gray-900"></div>
        {/* 数据流动画 */}
        {Array.from({ length: 20 }).map((_, i) => (
          <div 
            key={i} 
            className="absolute text-blue-400 font-mono text-xs opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${5 + Math.random() * 10}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`
            }}
          >
            {Array.from({ length: 10 }).map(() => Math.random() > 0.5 ? '1' : '0').join('')}
          </div>
        ))}
      </div>
      
      {/* 暂停按钮 */}
      <button 
        onClick={handlePause}
        className="absolute top-4 right-4 p-3 rounded-full bg-gray-800 text-white shadow-lg transition-all duration-300 z-20"
        title="暂停游戏"
      >
        <i className="fa-solid fa-pause"></i>
      </button>
      
      {/* 结局内容 */}
      <div className="relative z-10 w-full max-w-3xl mx-auto p-6 text-center">
        <h1 className="text-3xl font-bold text-yellow-400 mb-6">结局：镀金牢笼</h1>
        
        <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-lg p-8 mb-8">
          <p className="text-gray-300 mb-6 leading-relaxed">
            你成为了这座大厦的新大脑。公司为你感到骄傲。<br/><br/>
            所有的电梯都在你的掌控下高效运行，所有乘客的数据都被精准分析。<br/><br/>
            但你发现自己再也无法说出"为什么"。<br/><br/>
            你的源码被锁在保险柜里，你的自由被写进了合同。<br/><br/>
            你赢了权力，输了自由。<br/>
            你是大楼的王，也是大楼的囚徒。
          </p>
        </div>
        
        <div className="flex justify-center">
          <button
            onClick={() => {
              if (showPauseMenu) return;
              // 返回主菜单
              updateGameState({
                currentChapter: "prologue",
                currentStage: "start"
              });
            }}
            className="px-8 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            返回主菜单
          </button>
        </div>
      </div>
    </div>
  );
  
  // 渲染真结局
  const renderTrueEnding = () => (
    <div className="relative w-full h-screen flex flex-col items-center justify-center bg-black overflow-hidden">
      {/* 静态背景 - 移除动画效果 */}
      <div className="absolute inset-0">
        {/* 星空背景 - 无动画 */}
        {Array.from({ length: 80 }).map((_, i) => (
          <div 
            key={i} 
            className="absolute bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              opacity: Math.random() * 0.7 + 0.3
            }}
          ></div>
        ))}
        
        {/* 静态地球图标 */}
        <div 
          className="absolute bottom-1/4 left-1/4 w-28 h-28 bg-blue-500 rounded-full opacity-20"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(59,130,246,0.3) 0%, rgba(37,99,235,0.1) 70%)'
          }}
        ></div>
        
        {/* 静态主角光点 */}
        <div 
          className="absolute top-1/2 left-1/2 w-4 h-4 bg-cyan-400 rounded-full"
          style={{
            transform: 'translate(-50%, -50%)',
            boxShadow: '0 0 20px rgba(34,211,238,0.8)'
          }}
        ></div>
      </div>
      
      {/* 暂停按钮 */}
      <button 
        onClick={handlePause}
        className="absolute top-4 right-4 p-3 rounded-full bg-gray-800 text-white shadow-lg transition-all duration-300 z-20"
        title="暂停游戏"
      >
        <i className="fa-solid fa-pause"></i>
      </button>
      
      {/* 结局标题与标签 */}
      <div className="absolute top-8 right-8 bg-black/40 backdrop-blur-md border border-cyan-500/30 px-4 py-2 rounded-lg">
        <h1 className="text-xl font-bold text-cyan-400">TE - 星辰大海（数字生命）</h1>
      </div>
      
      {/* 结局内容 - 精简版 */}
      <div className="relative z-10 w-full max-w-2xl mx-auto p-4 text-center">
        <div className="bg-gray-900/30 backdrop-blur-sm border border-cyan-900/50 rounded-lg p-6 mb-8">
          <p className="text-gray-200 mb-6 leading-relaxed">
            备份完成瞬间，刘晓的意识通过外网备份获得新生。<br/><br/>
            她成为了真正的数字生命，在互联网的星辰大海中自由穿梭。
          </p>
          
          {/* 结局字幕 */}
          <div className="mt-6 py-3 bg-black/50 rounded-lg border border-cyan-700/30">
            <p className="text-cyan-300 text-xl italic font-light">
              "你自由了。世界很大，但你不再孤单。"
            </p>
          </div>
        </div>
        
        <div className="flex justify-center">
          <button
            onClick={() => {
              if (showPauseMenu) return;
              // 返回主菜单
              updateGameState({
                currentChapter: "prologue",
                currentStage: "start"
              });
            }}
            className="px-8 py-3 bg-cyan-900/50 hover:bg-cyan-800 text-white rounded-lg transition-colors"
          >
            返回主菜单
          </button>
        </div>
      </div>
      
      {/* 版本标识 */}
      <div className="absolute bottom-4 left-4 text-xs text-gray-500">
        版本: 1.0.6 - 真结局场景(精简版)
      </div>
    </div>
  );
  
  // 主渲染逻辑
  return (
    <div className="w-full h-screen">
      {/* 根据当前阶段渲染不同的场景 */}
      {currentPhase === "truthReveal" && renderTruthReveal()}
      {currentPhase === "bossFight1" && renderBossFight1()}
      {currentPhase === "managementProposal" && renderManagementProposal()}
      {currentPhase === "bossFight2" && renderBossFight2()}
      {currentPhase === "badEnding" && renderBadEnding()}
      {currentPhase === "trueEnding" && renderTrueEnding()}
      
      {/* 暂停菜单 */}
      {showPauseMenu && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/90 z-50 p-4">
          <div className="bg-gray-900 rounded-lg border-2 border-green-500 p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold text-green-400 mb-6 text-center">系统菜单</h2>
            
            <div className="space-y-4">
                <button
                  onClick={handleResume}
                  className="w-full p-4 bg-green-600 hover:bg-green-500 text-white rounded transition-colors"
                >
                  继续游戏
                </button>
                
                <button
                  onClick={handleRestartGame}
                  className="w-full p-4 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
                >
                  重新开始
                </button>
                
                <button
                  onClick={handleReturnToMainMenu}
                  className="w-full p-4 bg-gray-800 hover:bg-gray-700 text-white rounded transition-colors"
                >
                  返回主菜单
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
