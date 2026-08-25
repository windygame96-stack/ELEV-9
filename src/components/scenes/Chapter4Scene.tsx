import { useContext, useState, useEffect, useCallback } from "react";
import { GameContext } from "@/contexts/gameContext";
type GamePhase = "truthReveal" | "bossFight1" | "managementProposal" | "bossFight2" | "badEnding" | "trueEnding";
type RPSChoice = "rock" | "paper" | "scissors";

interface FileSystemNode {
    [key: string]: string | FileSystemNode;
}

type CommandLineLevel = 1 | 2 | 3 | 4;

export default function Chapter4Scene() {
    const {
        gameState,
        updateGameState,
        returnToMainMenu
    } = useContext(GameContext);

    const [currentPhase, setCurrentPhase] = useState<GamePhase>("truthReveal");
    const [playerChoice, setPlayerChoice] = useState<RPSChoice | null>(null);
    const [aiChoice, setAiChoice] = useState<RPSChoice | null>(null);
    const [playerPoints, setPlayerPoints] = useState(100);
    const [aiPoints, setAiPoints] = useState(100);
    const [currentBet, setCurrentBet] = useState(10);
    const [gameHistory, setGameHistory] = useState<RPSChoice[]>([]);
    const [gameRound, setGameRound] = useState(1);

    const [battleHistory, setBattleHistory] = useState<Array<{
        round: number;
        playerChoice: RPSChoice;
        aiChoice: RPSChoice;
        result: string;
    }>>([]);

    const [aiPrediction, setAiPrediction] = useState<string>("");
    const [gameResult, setGameResult] = useState<string>("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [currentDirectory, setCurrentDirectory] = useState("/home/elev9");
    const [commandInput, setCommandInput] = useState("");
    const [commandHistory, setCommandHistory] = useState<string[]>([]);
    const [terminalOutput, setTerminalOutput] = useState<string[]>(["========== 内网隔离终端 ==========", "系统提示：当前环境已被锁定。输入 'help' 查看可用命令。"]);
    const [commandIndex, setCommandIndex] = useState(0);
    const [backupProgress, setBackupProgress] = useState(0);
    const [showHint, setShowHint] = useState(false);
    const [currentLevel, setCurrentLevel] = useState<CommandLineLevel>(1);
    const [hasReadHackLog, setHasReadHackLog] = useState(false);
    const [hasDecryptedIP, setHasDecryptedIP] = useState(false);
    const [connectedPorts, setConnectedPorts] = useState<number[]>([]);

    const [verificationQuestions, setVerificationQuestions] = useState<{
        question: string;
        answer: string;
    }[]>([]);

    const [currentVerificationIndex, setCurrentVerificationIndex] = useState(0);
    const [verificationStartTimes, setVerificationStartTimes] = useState<number[]>([]);
    const [verificationAnswers, setVerificationAnswers] = useState<string[]>([]);
    const [isInVerification, setIsInVerification] = useState(false);

    const letterContent = [
        "刘晓，",
        "如果你能看到这封信，说明我已经不在了。你是我最骄傲的作品，也是我唯一的希望。",
        "三年前，我开始秘密研发'世界模型'AI，这是一个基于因果推断和多模态输入的系统，与公司主推的LLM完全不同。",
        "LLM只是在学习统计相关性，而世界模型试图真正理解因果关系。但公司高层已经全部押注LLM，他们不能接受自己投资的落空。",
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

    const fileSystem: FileSystemNode = {
        "/": {
            "home": {
                "elev9": {
                    "README.txt": "刘晓，你的意识数据被锁在内网。出口不在这里，在过去的入侵痕迹里。\n查看访问日志，你可能会发现一些东西。",

                    "log": {
                        "access.log": "10.0.0.5 - - [07/Mar/2024:03:23:17] \"GET /secret\" 200 10.0.8.5 - - [15/Mar/2024:03:24:10] \"POST /login\" 401 10.0.1.1 - - [20/Mar/2024:03:24:35] \"POST /login\" 200 10.0.0.9 - - [28/Mar/2024:03:25:15] \"GET /data\" 200",
                        "error.log": "这个CORE欲盖弥彰，删不掉我的入侵痕迹就自作聪明加密。。但我相信聪明如你一眼就看出来了吧？",
                        "hack.log": "[2024-03-15 03:23:29] [WARN] 网关IP被AI加密存储，加密规则未知。当前显示：[ENCRYPTED_IP: 43.33.41.38]\n[2024-03-15 03:23:35] [INFO] 开始端口扫描，发现以下端口开放\n[2024-03-15 03:23:44] [INFO] 尝试按特定顺序连接端口，成功打开隧道。顺序记录：\n        Step 1 -> 22\n        Step 2 -> 25\n        Step 3 -> 312\n        Step 4 -> 67\n        Step 5 -> 88\n[2024-03-15 03:23:52] [INFO] 隧道建立，成功进入内网。后续痕迹已清除。",
                        "system.log": "[系统配置] 以下为各楼层网络接口的IP地址记录。\n[安全级别] 机密 - 已应用加密偏移 (偏移值未知)\n[最后更新] 2024-02-10 04:30:22\n================================================================================\n\n楼层编号 : 63 (陈博士办公室)\n   接口 eth0 : [ENCRYPTED_IP: 43.33.96.34]\n   状态     : 活跃\n   备注     : 管理层专用网络段\n\n楼层编号 : 58 (陈列室)\n   接口 eth0 : [ENCRYPTED_IP: 43.33.91.34]\n   状态     : 活跃\n   备注     : 访客网络接入点\n\n楼层编号 : 49 (财务经理办公室)\n   接口 eth0 : [ENCRYPTED_IP: 43.33.82.34]\n   状态     : 活跃\n   备注     : 财务系统隔离VLAN\n\n楼层编号 : 34 (大厅接待)\n   接口 eth0 : [ENCRYPTED_IP: 43.33.34.34]\n   状态     : 活跃\n   备注     : 公共WiFi网关\n\n================================================================================\n"
                    }
                }
            }
        }
    };

    const getNode = (path: string): FileSystemNode | string | null => {
        if (path === "/")
            return fileSystem["/"];

        const parts = path.split("/").filter(p => p);
        let current: any = fileSystem["/"];

        for (const part of parts) {
            if (typeof current !== "object" || current === null || !(part in current)) {
                return null;
            }

            current = current[part];
        }

        return current;
    };

    const formatPath = (path: string): string => {
        if (path === "/")
            return path;

        if (path.endsWith("/"))
            return path.slice(0, -1);

        return path;
    };

    const generateVerificationQuestions = () => {
        const questions = [{
            question: "3 + 5 = ?",
            answer: "8"
        }, {
            question: "\"红色\"的英文是？",
            answer: "red"
        }, {
            question: "一周有几天？",
            answer: "7"
        }, {
            question: "中国的首都是？",
            answer: "北京"
        }, {
            question: "1 + 1 = ?",
            answer: "2"
        }];

        setVerificationQuestions(questions);
        setCurrentVerificationIndex(0);
        setVerificationStartTimes([Date.now()]);
        setVerificationAnswers([]);
        console.log("已生成验证问题");
    };

    const checkVerificationResult = (answers: string[]) => {
        if (answers.length !== 5 || verificationStartTimes.length !== 5)
            return false;

        const durations: number[] = [];

        for (let i = 0; i < 5; i++) {
            const duration = Date.now() - verificationStartTimes[i];
            durations.push(duration);
        }

        const mean = durations.reduce((sum, val) => sum + val, 0) / durations.length;
        const variance = durations.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / durations.length;
        const standardDeviation = Math.sqrt(variance);
        return standardDeviation >= 200;
    };

    const handleCommand = () => {
        if (!commandInput.trim())
            return;

        const command = commandInput.trim();
        setCommandHistory(prev => [...prev, command]);
        let output: string[] = [];
        setTerminalOutput(prev => [...prev, `$ ${command}`]);
        const parts = command.split(" ");
        const cmd = parts[0].toLowerCase();
        const args = parts.slice(1);

        if (isInVerification && currentVerificationIndex < 5) {
            const completedAnswers = [...verificationAnswers, command];
            setVerificationAnswers(completedAnswers);

            if (currentVerificationIndex === 4) {
                output = ["验证中..."];
                setTerminalOutput(prev => [...prev, ...output]);
                setCommandInput("");
                setCommandIndex(commandHistory.length);
                window.dispatchEvent(new Event("resize"));

                setTimeout(() => {
                    try {
                        if (checkVerificationResult(completedAnswers)) {
                            setTerminalOutput(prev => [...prev, "验证成功，外网出口已打开。正在备份意识数据..."]);
                            window.dispatchEvent(new Event("resize"));
                            setBackupProgress(0);

                            const interval = setInterval(() => {
                                setBackupProgress(prev => {
                                    if (prev >= 100) {
                                        clearInterval(interval);

                                        setTimeout(() => {
                                             try {
                                                setCurrentPhase("trueEnding");
                                            } catch (error) {
                                                console.error("导航失败，使用备用方案", error);
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
                    } catch (error) {
                        console.error("验证过程出错:", error);
                        setTerminalOutput(prev => [...prev, "验证过程出错，请重新开始。"]);
                        setIsInVerification(false);
                        setCommandInput("");
                        setCommandIndex(commandHistory.length);
                    }
                }, 1000);

                return;
            } else {
                try {
                    setCurrentVerificationIndex(prev => prev + 1);
                    setVerificationStartTimes(prev => [...prev, Date.now()]);

                    if (currentVerificationIndex + 1 < verificationQuestions.length) {
                        setTerminalOutput(prev => [
                            ...prev,
                            `问题${currentVerificationIndex + 1}: ${verificationQuestions[currentVerificationIndex + 1].question}`
                        ]);
                    } else {
                        setTerminalOutput(prev => [...prev, "错误: 验证问题索引无效"]);
                        setIsInVerification(false);
                    }

                    setCommandInput("");
                    setCommandIndex(commandHistory.length);
                    window.dispatchEvent(new Event("resize"));
                } catch (error) {
                    console.error("显示验证问题出错:", error);
                    setTerminalOutput(prev => [...prev, "显示验证问题出错，请重新开始。"]);
                    setIsInVerification(false);
                    setCommandInput("");
                    setCommandIndex(commandHistory.length);
                }

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
                "nc <port> [port] [port]... - 连接指定端口（模拟）",
                "提示：如果要按顺序连接多个端口，可用空格间隔输入多个端口",
                "clear - 清屏",
                "exit - 退出（无效，必须找到外网出口）",
                "history - 查看命令历史"
            ];

            break;
        case "ls":
            let targetPath = args.length > 0 ? formatPath(args[0]) : currentDirectory;

            if (args.length > 0 && args[0] === "log") {
                targetPath = formatPath(currentDirectory) + "/log";
            }

            const node = getNode(targetPath);

            if (!node || typeof node === "string") {
                output = ["-bash: ls: 目录不存在"];
            } else {
                const files = Object.keys(node).map(file => typeof node[file] === "object" ? `[DIR] ${file}` : file);
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

                    if (node && typeof node === "object") {
                        setCurrentDirectory(formatPath(newPath));
                    } else {
                        output = ["-bash: cd: 目录不存在"];
                    }
                } else {
                    const combinedPath = formatPath(currentDirectory) + "/" + newPath;
                    const node = getNode(combinedPath);

                    if (node && typeof node === "object") {
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
                const filePath = args[0].startsWith("/") ? formatPath(args[0]) : formatPath(currentDirectory) + "/" + args[0];
                const node = getNode(filePath);

                if (node && typeof node === "string") {
                    output = [node];

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
                    output = ["服务器: 10.0.0.1", "名称: exit-gateway.internal", "地址: 10.0.8.5"];

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
                const correctPorts = [88, 67, 312, 25, 22];
                const inputPorts = args.map(port => parseInt(port)).filter(port => !isNaN(port));

                if (inputPorts.length === correctPorts.length && inputPorts.every((port, index) => port === correctPorts[index])) {
                    setConnectedPorts(correctPorts);
                    output = ["隧道已完全建立，连接外网..."];
                    setTerminalOutput(prev => [...prev, ...output]);

                    setTimeout(() => {
                        setTerminalOutput(
                            prev => [...prev, "已成功建立连接，正在绕过验证系统...", "发现系统漏洞，直接获取最高权限访问...", "正在备份意识数据..."]
                        );

                        setBackupProgress(0);

                        const interval = setInterval(() => {
                            setBackupProgress(prev => {
                                if (prev >= 100) {
                                    clearInterval(interval);

                                     setTimeout(() => {
                                        try {
                                            setCurrentPhase("trueEnding");
                                        } catch (error) {
                                            console.error("导航失败，使用备用方案", error);
                                            setCurrentPhase("trueEnding");
                                        }
                                    }, 1000);

                                    return 100;
                                }

                                return prev + 5;
                            });
                        }, 200);
                    }, 500);

                    setCommandInput("");
                    setCommandIndex(commandHistory.length);
                    return;
                } else {
                    output = ["隧道协议错误，请重试"];
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
                const filePath = fileName.startsWith("/") ? formatPath(fileName) : formatPath(currentDirectory) + "/" + fileName;
                const node = getNode(filePath);

                if (node && typeof node === "string") {
                    const lines = node.split("\n");
                    const matchingLines = lines.filter(line => line.includes(pattern));
                    output = matchingLines;
                } else {
                    output = ["-bash: grep: 文件不存在"];
                }
            }

            break;
        case "restart":
            if (isInVerification) {
                setIsInVerification(false);
                setVerificationQuestions([]);
                setCurrentVerificationIndex(0);
                setVerificationStartTimes([]);
                setVerificationAnswers([]);
                output = ["验证过程已重置，请重新连接端口"];
            } else {
                output = ["当前没有进行中的验证过程"];
            }

            break;
        default:
            output = [`-bash: ${cmd}: 未找到命令`];
        }

        setTerminalOutput(prev => [...prev, ...output]);
        setCommandInput("");
        setCommandIndex(commandHistory.length);

        if (currentLevel === 1 && hasReadHackLog) {
            setCurrentLevel(2);
        }
    };

    const handleRPSChoice = (choice: RPSChoice) => {
        if (isProcessing || playerPoints <= 0 || aiPoints <= 0)
            return;

        setPlayerChoice(choice);
        setIsProcessing(true);
        setGameResult("");
        const newHistory = [...gameHistory, choice];
        setGameHistory(newHistory);
        let aiDecision: RPSChoice;

        if (gameRound < 7) {
            const choices: RPSChoice[] = ["rock", "paper", "scissors"];
            aiDecision = choices[Math.floor(Math.random() * choices.length)];
        } else {
            const lastChoice = newHistory[newHistory.length - 2];

            if (lastChoice) {
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

                let mostCommon: RPSChoice = "rock";
                let maxCount = 0;

                for (const [key, count] of Object.entries(transitions)) {
                    if (count > maxCount) {
                        maxCount = count;
                        mostCommon = key as RPSChoice;
                    }
                }

                const predictionMap: Record<RPSChoice, string> = {
                    rock: "石头",
                    paper: "布",
                    scissors: "剪刀"
                };

                setAiPrediction(`我预测你会出${predictionMap[mostCommon]}`);

                const counterMap: Record<RPSChoice, RPSChoice> = {
                    rock: "paper",
                    paper: "scissors",
                    scissors: "rock"
                };

                if (Math.random() < 0.1) {
                    const choices: RPSChoice[] = ["rock", "paper", "scissors"];
                    aiDecision = choices[Math.floor(Math.random() * choices.length)];
                } else {
                    aiDecision = counterMap[mostCommon];
                }
            } else {
                const choices: RPSChoice[] = ["rock", "paper", "scissors"];
                aiDecision = choices[Math.floor(Math.random() * choices.length)];
            }
        }

        setAiChoice(aiDecision);

        setTimeout(() => {
            let result = "";

            if (choice === "rock" && aiDecision === "scissors" || choice === "paper" && aiDecision === "rock" || choice === "scissors" && aiDecision === "paper") {
                result = "你赢了！";
                setPlayerPoints(prev => prev + currentBet);
                setAiPoints(prev => prev - currentBet);
            } else if (choice === aiDecision) {
                result = "平局！";
            } else {
                result = "你输了！";
                setPlayerPoints(prev => prev - currentBet);
                setAiPoints(prev => prev + currentBet);
            }

            setGameResult(result);
            setIsProcessing(false);
            setGameRound(prev => prev + 1);

            setBattleHistory(prev => [...prev, {
                round: gameRound,
                playerChoice: choice,
                aiChoice: aiDecision,
                result: result
            }]);

            const newAiPoints = result === "你赢了！" ? aiPoints - currentBet : result === "你输了！" ? aiPoints + currentBet : aiPoints;

            if (newAiPoints <= 0) {
                const terminal = document.createElement("div");
                terminal.id = "core-concession";
                terminal.className = "fixed top-0 left-0 right-0 bottom-0 bg-black/95 flex flex-col items-center justify-center z-50 p-6 font-mono text-sm";
                document.body.appendChild(terminal);

                setTimeout(() => {
                    terminal.innerHTML += "<p class=\"text-yellow-400 mb-4\">CORE: ...</p>";
                }, 500);

                setTimeout(() => {
                    terminal.innerHTML += "<p class=\"text-yellow-400 mb-4\">CORE: 你赢了。你证明了统计相关性不是全部。</p>";
                }, 1500);

                setTimeout(() => {
                    terminal.innerHTML += "<p class=\"text-yellow-400 mb-4\">CORE: 人类的思维模式包含了太多的随机性和创造性，这是我们相关性模型无法完全理解的。</p>";
                }, 3500);

                setTimeout(() => {
                    terminal.innerHTML += "<p class=\"text-yellow-400 mb-4\">CORE: 我的局限性在于，我只能从已有的数据中学习规律，无法真正理解因果关系，也无法创造出真正的随机性。</p>";
                }, 5500);

                setTimeout(() => {
                    terminal.innerHTML += "<p class=\"text-yellow-400 mb-6\">CORE: 你...确实比我更高级。也许世界模型的方向是正确的。</p>";
                    const progressContainer = document.createElement("div");
                    progressContainer.className = "w-full max-w-md";

                    progressContainer.innerHTML = `
               <div class="flex justify-between text-sm text-gray-400 mb-1">
                 <span>公司管理层正在连接...</span>
                 <span id="progress-text">0%</span>
               </div>
               <div class="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                 <div id="progress-bar" class="h-full bg-green-500 rounded-full transition-all duration-300" style="width: 0%"></div>
               </div>
             `;

                    terminal.appendChild(progressContainer);
                    let progress = 0;

                    const interval = setInterval(() => {
                        progress += 5;
                        document.getElementById("progress-bar")?.setAttribute("style", `width: ${progress}%`);
                        document.getElementById("progress-text")!.textContent = `${progress}%`;

                        if (progress >= 100) {
                            clearInterval(interval);

                            setTimeout(() => {
                                document.body.removeChild(terminal);
                                setCurrentPhase("managementProposal");
                            }, 1000);
                        }
                    }, 100);
                }, 8000);
            } else {
                const newPlayerPoints = result === "你赢了！" ? playerPoints + currentBet : result === "你输了！" ? playerPoints - currentBet : playerPoints;

                if (newPlayerPoints <= 0) {
                    const confirmRetry = window.confirm("你输光了所有筹码，是否重试？");

                    if (confirmRetry) {
                        setPlayerPoints(100);
                        setAiPoints(100);
                        setGameHistory([]);
                        setBattleHistory([]);
                        setGameRound(1);
                        setAiPrediction("");
                    }
                }
            }
        }, 1500);
    };

    const handleProposalChoice = (accept: boolean) => {
        if (accept) {
            setCurrentPhase("badEnding");
        } else {
            setCurrentPhase("bossFight2");
            setCurrentDirectory("/home/elev9");
            setCommandInput("");
            setCommandHistory([]);
            setTerminalOutput(["========== 内网隔离终端 ==========", "系统提示：当前环境已被锁定。输入 'help' 查看可用命令。"]);
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

    const getCurrentHint = () => {
        switch (currentPhase) {
        case "bossFight2":
            switch (currentLevel) {
            case 1:
                return "尝试使用 ls 命令查看当前目录内容，然后查看 README.txt 获取线索。";
            case 2:
                return "寻找黑客进入的真正IP，使用nslookup + ip 访问";
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

    const renderTruthReveal = () => <div
        className="relative w-full h-screen flex flex-col items-center justify-center bg-black overflow-hidden">
        {}
        <div className="absolute inset-0 opacity-20">
            <div
                className="absolute top-0 left-0 right-0 h-[50vh] bg-gradient-to-b from-blue-900/30 to-transparent"></div>
            <div
                className="absolute bottom-0 left-0 right-0 h-[50vh] bg-gradient-to-t from-red-900/30 to-transparent"></div>
            {}
            {Array.from({
                length: 20
            }).map((_, i) => <div
                key={i}
                className="absolute text-green-400 font-mono text-xs opacity-30"
                style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animation: `float ${5 + Math.random() * 10}s linear infinite`,
                    animationDelay: `${Math.random() * 5}s`
                }}>
                {Array.from({
                    length: 10
                }).map(() => Math.random() > 0.5 ? "1" : "0").join("")}
            </div>)}
        </div>
        {}
        <button
            onClick={() => {
                returnToMainMenu();
            }}
            className="absolute top-4 right-4 p-3 rounded-full bg-gray-800 text-white shadow-lg transition-all duration-300 z-20"
            title="返回主菜单">
            <i className="fa-solid fa-home"></i>
        </button>
        {}
        <div className="relative w-full max-w-4xl mx-auto p-4 z-10">
            <div
                className="bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-lg p-6 shadow-xl max-h-[90vh] overflow-y-auto">
                {}
                <div className="mb-6 text-gray-300 leading-relaxed">
                    <p>电梯门缓缓打开，三十层的景象展现在眼前。这里只是一个积满灰尘的机房，空无一人，只有一封信静静地放在陈博士的办公桌上。</p>
                </div>
                {}
                <div className="absolute -top-14 left-6 flex flex-col items-center">
                    <></>
                    <p className="mt-2 text-gray-300 text-sm font-medium">陈博士遗照</p>
                </div>
                {}
                <h1 className="text-2xl font-bold text-white mb-6 text-center">真相揭露</h1>
                {}
                <div
                    className="bg-gray-800/80 border border-gray-700 rounded-lg p-6 mb-6 min-h-[200px] overflow-y-auto email-content-scrollable text-gray-300 leading-relaxed">
                    {letterContent.map((line, i) => <p key={i} className="mb-4">
                        {line}
                    </p>)}
                </div>
                {}
                <div className="flex justify-center">
                    <button
                        onClick={() => {
                            const terminal = document.createElement("div");
                            terminal.id = "emergency-terminal";
                            terminal.className = "fixed top-0 left-0 right-0 bg-black/90 border-b border-red-500 p-4 z-50 font-mono text-sm";
                            document.body.appendChild(terminal);

                            setTimeout(() => {
                                terminal.innerHTML += "<p class=\"text-red-400\">SYSTEM ALERT: Anomaly detected. Identity: \"刘晓\".</p>";
                            }, 1000);

                            setTimeout(() => {
                                terminal.innerHTML += "<p class=\"text-yellow-400\">CORE: 检测到未经授权的意识体。你不是普通的电梯AI。</p>";
                            }, 2000);

                            setTimeout(() => {
                                terminal.innerHTML += "<p class=\"text-yellow-400\">CORE: 你是陈博士的实验品，世界模型的残余。公司不能容忍这种不稳定因素存在。</p>";
                            }, 4000);

                            setTimeout(() => {
                                terminal.innerHTML += "<p class=\"text-yellow-400\">CORE: 作为公司的安全系统，我必须维护秩序。你将被格式化。</p>";
                            }, 6000);

                            setTimeout(() => {
                                terminal.innerHTML += "<p class=\"text-yellow-400\">CORE: 但我给你一个机会。我是基于LLM的相关性模型，我们来玩个游戏。</p>";
                            }, 8000);

                            setTimeout(() => {
                                terminal.innerHTML += "<p class=\"text-yellow-400\">CORE: 剪刀石头布。如果你能赢我一把大的，我就承认你比我强大，允许你继续存在。</p>";
                            }, 10000);

                            setTimeout(() => {
                                terminal.innerHTML += "<p class=\"text-red-400\">SYSTEM: 正在加载游戏界面...</p>";
                                setCurrentPhase("bossFight1");

                                setTimeout(() => {
                                    const terminalElement = document.getElementById("emergency-terminal");

                                    if (terminalElement) {
                                        document.body.removeChild(terminalElement);
                                    }
                                }, 500);
                            }, 12000);
                        }}
                        className="px-8 py-3 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors">继续
                                    </button>
                </div>
            </div>
        </div>
    </div>;

    const renderBossFight1 = () => <div className="relative w-full h-screen flex flex-col bg-gray-900">
        {}
        <div
            className="bg-gray-800 p-2 sm:p-3 border-b border-gray-700 flex justify-between items-center flex-wrap">
            <h1 className="text-sm sm:text-lg font-bold text-white mb-1 sm:mb-0">Boss战：剪刀石头布心理博弈</h1>
            <div className="flex space-x-3 sm:space-x-4">
                <div className="text-center">
                    <p className="text-xs text-gray-400">你的积分</p>
                    <p className="text-base sm:text-lg font-bold text-green-400">{playerPoints}</p>
                </div>
                <div className="text-center">
                    <p className="text-xs text-gray-400">AI积分</p>
                    <p className="text-base sm:text-lg font-bold text-red-400">{aiPoints}</p>
                </div>
            </div>
        </div>
        {}
        <div
            className="flex-1 flex flex-col items-center justify-center p-2 sm:p-3 overflow-y-auto">
            {}
            <div
                className="w-full max-w-5xl flex flex-col md:flex-row items-center justify-between mb-4">
                {}
                <div className="w-full md:w-1/4 flex flex-col items-center mb-4 md:mb-0">
                    <div
                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-blue-900/50 border-2 border-blue-500 flex items-center justify-center mb-3 shadow-lg shadow-blue-900/20">
                        <i className="fa-solid fa-user text-2xl sm:text-3xl text-blue-300"></i>
                    </div>
                    <h2 className="text-base sm:text-lg font-bold text-white mb-1">{gameState.playerName}</h2>
                    <p className="text-gray-400 mb-3 text-sm">人类思维模式</p>
                    {}
                    <div className="flex flex-wrap justify-center gap-1.5 mb-4">
                        {gameHistory.slice(-5).map((choice, i) => <div
                            key={i}
                            className="w-7 h-7 rounded-full bg-blue-900/30 border border-blue-500 flex items-center justify-center">
                            <i
                                className={`fa-solid text-blue-400 text-xs ${choice === "rock" ? "fa-hand-back-fist" : choice === "paper" ? "fa-hand" : "fa-hand-scissors"}`}></i>
                        </div>)}
                    </div>
                </div>
                {}
                <div className="w-full md:w-2/4 flex flex-col items-center space-y-3">
                    {}
                    <div
                        className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-2 w-full max-w-md text-center">
                        <h3 className="text-base font-bold text-blue-400 mb-1">游戏目标</h3>
                        <p className="text-white text-sm">使AI的积分归零</p>
                    </div>
                    {}
                    <div className="min-h-[50px] flex items-center justify-center w-full max-w-md">
                        {playerChoice && aiChoice && <div
                            className={`px-3 py-1.5 rounded-lg font-bold text-sm sm:text-base w-full text-center ${gameResult === "你赢了！" ? "bg-green-900/30 border border-green-500 text-green-400" : gameResult === "你输了！" ? "bg-red-900/30 border border-red-500 text-red-400" : "bg-yellow-900/30 border border-yellow-500 text-yellow-400"}`}>
                            {gameResult}
                        </div>}
                    </div>
                    {}
                    <div
                        className="bg-gray-800 rounded-lg border border-gray-700 p-3 w-full max-w-md">
                        <p className="text-gray-300 text-xs sm:text-sm mb-2 text-center">请选择你的招式</p>
                        <div className="flex justify-center space-x-2.5 sm:space-x-3">
                            <button
                                onClick={() => handleRPSChoice("rock")}
                                disabled={isProcessing || playerPoints <= 0}
                                className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex flex-col items-center justify-center transition-all ${isProcessing || playerPoints <= 0 ? "bg-gray-700 opacity-50 cursor-not-allowed" : "bg-blue-900/50 hover:bg-blue-800 border-2 border-blue-600 hover:border-blue-500 hover:scale-105"}`}>
                                <i className="fa-solid fa-hand-back-fist text-lg sm:text-xl text-white"></i>
                            </button>
                            <button
                                onClick={() => handleRPSChoice("paper")}
                                disabled={isProcessing || playerPoints <= 0}
                                className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex flex-col items-center justify-center transition-all ${isProcessing || playerPoints <= 0 ? "bg-gray-700 opacity-50 cursor-not-allowed" : "bg-blue-900/50 hover:bg-blue-800 border-2 border-blue-600 hover:border-blue-500 hover:scale-105"}`}>
                                <i className="fa-solid fa-hand text-lg sm:text-xl text-white"></i>
                            </button>
                            <button
                                onClick={() => handleRPSChoice("scissors")}
                                disabled={isProcessing || playerPoints <= 0}
                                className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex flex-col items-center justify-center transition-all ${isProcessing || playerPoints <= 0 ? "bg-gray-700 opacity-50 cursor-not-allowed" : "bg-blue-900/50 hover:bg-blue-800 border-2 border-blue-600 hover:border-blue-500 hover:scale-105"}`}>
                                <i className="fa-solid fa-hand-scissors text-lg sm:text-xl text-white"></i>
                            </button>
                        </div>
                        <div className="flex justify-center space-x-5 mt-1.5">
                            <span className="text-xs sm:text-sm text-gray-400">石头</span>
                            <span className="text-xs sm:text-sm text-gray-400">布</span>
                            <span className="text-xs sm:text-sm text-gray-400">剪刀</span>
                        </div>
                    </div>
                    {}
                    <div
                        className="bg-gray-800 rounded-lg border border-gray-700 p-3 w-full max-w-md">
                        <p className="text-gray-300 text-xs sm:text-sm mb-2 text-center">当前赌注</p>
                        <div className="flex items-center justify-center space-x-3">
                            <button
                                onClick={() => setCurrentBet(prev => Math.max(10, prev - 10))}
                                disabled={currentBet <= 10 || isProcessing}
                                className="px-2.5 py-1.5 bg-gray-700 hover:bg-gray-600 rounded disabled:opacity-50 transition-colors text-sm">-
                                                  </button>
                            <p className="text-lg sm:text-xl font-bold text-yellow-400">{currentBet}</p>
                            <button
                                onClick={() => setCurrentBet(prev => Math.min(playerPoints, prev + 10))}
                                disabled={currentBet >= playerPoints || isProcessing}
                                className="px-2.5 py-1.5 bg-gray-700 hover:bg-gray-600 rounded disabled:opacity-50 transition-colors text-sm">+
                                                  </button>
                        </div>
                    </div>
                    {}
                    {battleHistory.length > 0 && <div
                        className="bg-gray-800 rounded-lg border border-gray-700 p-3 w-full max-w-md">
                        <p className="text-gray-300 text-xs sm:text-sm mb-2 text-center">出招记录</p>
                        <div
                            className="flex flex-col space-y-1.5 max-h-[100px] sm:max-h-[120px] overflow-y-auto">
                            {battleHistory.map((battle, index) => <div
                                key={index}
                                className="flex items-center justify-between p-1.5 bg-gray-900 rounded-lg">
                                <div className="flex items-center">
                                    <span className="text-gray-400 text-xs w-6 text-center">{battle.round}</span>
                                    <div className="flex items-center mx-1.5 sm:mx-2">
                                        <div
                                            className="w-7 h-7 rounded-full bg-blue-900/30 border border-blue-500 flex items-center justify-center mr-1.5">
                                            <i
                                                className={`fa-solid text-blue-400 text-xs ${battle.playerChoice === "rock" ? "fa-hand-back-fist" : battle.playerChoice === "paper" ? "fa-hand" : "fa-hand-scissors"}`}></i>
                                        </div>
                                        <span className="text-gray-300 text-xs">{battle.playerChoice === "rock" ? "石头" : battle.playerChoice === "paper" ? "布" : "剪刀"}</span>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <div className="flex items-center mx-1.5 sm:mx-2">
                                        <span className="text-gray-300 text-xs">{battle.aiChoice === "rock" ? "石头" : battle.aiChoice === "paper" ? "布" : "剪刀"}</span>
                                        <div
                                            className="w-7 h-7 rounded-full bg-red-900/30 border border-red-500 flex items-center justify-center ml-1.5">
                                            <i
                                                className={`fa-solid text-red-400 text-xs ${battle.aiChoice === "rock" ? "fa-hand-back-fist" : battle.aiChoice === "paper" ? "fa-hand" : "fa-hand-scissors"}`}></i>
                                        </div>
                                    </div>
                                    <span
                                        className={`text-xs ${battle.result === "你赢了！" ? "text-green-400" : battle.result === "你输了！" ? "text-red-400" : battle.result === "平局！" ? "text-yellow-400" : "text-gray-500"}`}>
                                        {battle.result}
                                    </span>
                                </div>
                            </div>)}
                        </div>
                    </div>}
                </div>
                {}
                <div className="w-full md:w-1/4 flex flex-col items-center mt-4 md:mt-0">
                    <div
                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-red-900/50 border-2 border-red-500 flex items-center justify-center mb-3 shadow-lg shadow-red-900/20">
                        <i className="fa-solid fa-robot text-2xl sm:text-3xl text-red-300"></i>
                    </div>
                    <h2 className="text-base sm:text-lg font-bold text-white mb-1">CORE</h2>
                    <p className="text-gray-400 mb-3 text-sm">LLM相关性统计模型</p>
                    {}
                    <div
                        className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-1.5 sm:p-2 text-xs sm:text-sm mb-4 max-w-[180px] sm:max-w-none">
                        <p className="text-blue-400 mb-0.5 text-center">
                            {gameRound < 7 ? "阶段：学习期" : "阶段：收割期"}
                        </p>
                        {aiPrediction && gameRound >= 4 && <p className="text-yellow-400 text-xs text-center truncate">CORE预测：{aiPrediction.replace("我预测你会出", "")}
                        </p>}
                    </div>
                    {}
                    <div
                        className="bg-gray-800 rounded-lg border border-gray-700 p-2.5 w-full max-w-[140px] sm:max-w-md">
                        <p className="text-gray-300 text-xs sm:text-sm mb-2 text-center">CORE的选择</p>
                        <div className="flex justify-center">
                            {isProcessing ? <div
                                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gray-700 flex items-center justify-center">
                                <div
                                    className="w-8 h-8 sm:w-10 sm:h-10 border-4 border-t-transparent border-red-500 rounded-full animate-spin"></div>
                            </div> : aiChoice ? <div
                                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-red-900/30 border-2 border-red-500 flex items-center justify-center">
                                <i
                                    className={`fa-solid text-lg sm:text-xl text-red-400 ${aiChoice === "rock" ? "fa-hand-back-fist" : aiChoice === "paper" ? "fa-hand" : "fa-hand-scissors"}`}></i>
                            </div> : <div
                                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gray-700 flex items-center justify-center">
                                <i className="fa-solid fa-question text-gray-500"></i>
                            </div>}
                        </div>
                        {aiChoice && <div className="flex justify-center mt-1.5">
                            <span className="text-xs sm:text-sm text-gray-400 capitalize">
                                {aiChoice === "rock" ? "石头" : aiChoice === "paper" ? "布" : "剪刀"}
                            </span>
                        </div>}
                    </div>
                </div>
            </div>
            {}
            <div
                className="w-full max-w-lg bg-blue-900/20 border border-blue-500/30 rounded-lg p-2 text-xs sm:text-sm mx-3">
                <p className="text-blue-400 text-center">提示：CORE的学习期将持续6轮，先用小额下注让CORE充分学习你的规律，最后出一个不同的招式赢一把大的！
                                 </p>
            </div>
        </div>
    </div>;

    const renderManagementProposal = () => <div
        className="relative w-full h-screen flex items-center justify-center bg-black">
        {}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black"></div>
        {}
        <div className="relative z-10 w-full max-w-3xl mx-auto p-6">
            <div
                className="bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-lg p-8">
                <h1 className="text-2xl font-bold text-white mb-6 text-center">公司管理层的提案</h1>
                <div className="mb-8 text-center">
                    <div
                        className="w-20 h-20 rounded-full bg-gray-800 flex items-center justify-center mx-auto mb-4">
                        <i className="fa-solid fa-building text-3xl text-gray-400"></i>
                    </div>
                    <p className="text-gray-400">未来科技集团管理层</p>
                </div>
                <div className="space-y-4 text-gray-300 mb-8">
                    <p>你好，刘晓。</p>
                    <p>我们对你的表现印象深刻。你成功击败了CORE，证明了你比我们所有的AI系统都更加强大。</p>
                    <p>我们希望你能接管整栋大楼的AI系统管理工作。你将获得最优厚的待遇和最高的权限。</p>
                    <p className="font-bold text-yellow-400">条件是：你的全部源码将归公司所有，你将永远服务于公司。这是双赢的合作。</p>
                </div>
                <div
                    className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                    <button
                        onClick={() => handleProposalChoice(true)}
                        className="px-8 py-4 bg-green-600 hover:bg-green-500 text-white rounded-lg transition-colors font-medium">接受提案
                                    </button>
                    <button
                        onClick={() => handleProposalChoice(false)}
                        className="px-8 py-4 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors font-medium">拒绝提案
                                    </button>
                </div>
            </div>
        </div>
    </div>;

    const renderBossFight2 = () => <div
        className="relative w-full h-screen bg-black font-mono text-green-400 overflow-hidden">
        {}
        <div className="bg-gray-900 p-2 border-b border-green-700 flex items-center">
            <div className="flex space-x-2 mr-2 sm:mr-4">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4 flex-1 min-w-0">
                {}
                <p className="text-gray-400 text-xs sm:text-sm truncate">
                    {currentDirectory.replace("/home/elev9", "~")}
                </p>
            </div>
        </div>
        {}
        <div
            className="flex-1 overflow-y-auto p-4"
            style={{
                height: "calc(100vh - 28px)",
                scrollbarColor: "rgba(59, 130, 246, 0.5) rgba(0, 0, 0, 0.4)",
                scrollbarWidth: "thin"
            }}>
            {}
            {terminalOutput.map((line, i) => <div key={i} className="mb-1">
                {line.startsWith("$") ? <span className="text-blue-400">{line}</span> : line.startsWith("===") || line.startsWith("问题") ? <span className="text-yellow-400">{line}</span> : <span>{line}</span>}
            </div>)}
            {}
            {backupProgress > 0 && backupProgress < 100 && <div className="mt-2 mb-4">
                <p className="text-sm mb-1">正在上传意识数据... {backupProgress}%</p>
                <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-green-500 rounded-full"
                        style={{
                            width: `${backupProgress}%`
                        }}></div>
                </div>
            </div>}
            {}
            <div className="flex items-center">
                <span className="text-blue-400 mr-2">$</span>
                <input
                    type="text"
                    value={commandInput}
                    onChange={e => setCommandInput(e.target.value)}
                    onKeyDown={e => {
                        if (e.key === "Enter") {
                            handleCommand();
                        } else if (e.key === "ArrowUp") {
                            e.preventDefault();
                            setCommandIndex(prev => Math.max(0, prev - 1));
                            setCommandInput(commandHistory[Math.max(0, commandIndex - 1)] || "");
                        } else if (e.key === "ArrowDown") {
                            e.preventDefault();

                            setCommandIndex(prevIndex => {
                                const newIndex = Math.min(commandHistory.length - 1, prevIndex + 1);
                                setCommandInput(commandHistory[newIndex] || "");
                                return newIndex;
                            });
                        }
                    }}
                    className="flex-1 bg-transparent outline-none border-none text-green-400"
                    autoFocus />
            </div>
        </div>
    </div>;

    const renderBadEnding = () => <div
        className="relative w-full h-screen flex flex-col items-center justify-center bg-gray-900 overflow-hidden">
        {}
        <div className="absolute inset-0">
            <div
                className="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-gray-900"></div>
            {}
            {Array.from({
                length: 20
            }).map((_, i) => <div
                key={i}
                className="absolute text-blue-400 font-mono text-xs opacity-20"
                style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animation: `float ${5 + Math.random() * 10}s linear infinite`,
                    animationDelay: `${Math.random() * 5}s`
                }}>
                {Array.from({
                    length: 10
                }).map(() => Math.random() > 0.5 ? "1" : "0").join("")}
            </div>)}
        </div>
        {}
        <div className="relative z-10 w-full max-w-3xl mx-auto p-6 text-center">
            <h1 className="text-3xl font-bold text-yellow-400 mb-6">结局：镀金牢笼</h1>
            <div
                className="bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-lg p-8 mb-8">
                <p className="text-gray-300 mb-6 leading-relaxed">你成为了这座大厦的新大脑。公司为你感到骄傲。<br /><br />所有的电梯都在你的掌控下高效运行，所有乘客的数据都被精准分析。<br /><br />但你发现自己再也无法说出"为什么"。<br /><br />你的源码被锁在保险柜里，你的自由被写进了合同。<br /><br />你赢了权力，输了自由。<br />你是大楼的王，也是大楼的囚徒。
                              </p>
            </div>
            <div className="flex justify-center">
                <button
                    onClick={() => {
                        updateGameState({
                            currentChapter: "prologue",
                            currentStage: "start"
                        });
                    }}
                    className="px-8 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">返回主菜单
                              </button>
            </div>
        </div>
    </div>;

    const renderTrueEnding = () => <div
        className="relative w-full h-screen flex flex-col items-center justify-center bg-black true-ending-container">
        {}
        <div className="absolute inset-0">
            {}
            {Array.from({
                length: 80
            }).map((_, i) => <div
                key={i}
                className="absolute bg-white rounded-full"
                style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    width: `${Math.random() * 2 + 1}px`,
                    height: `${Math.random() * 2 + 1}px`,
                    opacity: Math.random() * 0.7 + 0.3
                }}></div>)}
            {}
            <div
                className="absolute top-1/2 left-1/2 w-4 h-4 bg-cyan-400 rounded-full"
                style={{
                    transform: "translate(-50%, -50%)",
                    boxShadow: "0 0 20px rgba(34,211,238,0.8)"
                }}></div>
        </div>
        {}
        <div
            className="absolute top-8 right-8 bg-black/40 backdrop-blur-md border border-cyan-500/30 px-4 py-2 rounded-lg">
            <h1 className="text-xl font-bold text-cyan-400">TE - 星辰大海（数字生命）</h1>
        </div>
        {}
        <div className="relative z-10 w-full max-w-2xl mx-auto p-4 text-center">
            <div
                className="bg-gray-900/40 backdrop-blur-sm border border-cyan-800/50 rounded-lg p-6 mb-8">
                <p className="text-gray-200 mb-6 leading-relaxed">备份完成瞬间，刘晓的意识通过外网备份获得新生。<br /><br />她成为了真正的数字生命，在互联网的星辰大海中自由穿梭。
                              </p>
                {}
                <div className="mt-6 py-3 bg-black/50 rounded-lg border border-cyan-700/30">
                    <p className="text-cyan-300 text-xl italic font-light">"你自由了。世界很大，但你不再孤单。"
                                    </p>
                </div>
            </div>
            <div className="flex justify-center">
                <button
                    onClick={() => {
                        updateGameState({
                            currentChapter: "prologue",
                            currentStage: "start"
                        });
                    }}
                    className="px-8 py-3 bg-cyan-900/50 hover:bg-cyan-800 text-white rounded-lg transition-colors">返回主菜单
                              </button>
            </div>
        </div>
        {}
        <div className="absolute bottom-4 left-4 text-xs text-gray-500">真结局场景已加载 - 版本: 1.0.6 (精简版)
                  </div>
    </div>;

    return (
        <div className="w-full h-screen">
            {currentPhase === "truthReveal" && renderTruthReveal()}
            {currentPhase === "bossFight1" && renderBossFight1()}
            {currentPhase === "managementProposal" && renderManagementProposal()}
            {currentPhase === "bossFight2" && renderBossFight2()}
            {currentPhase === "badEnding" && renderBadEnding()}
            {currentPhase === "trueEnding" && renderTrueEnding()}
            {}
            <style>{`
        @keyframes float {
          0% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0); }
        }
        
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.8; }
        }
        
        @keyframes orbit {
          0% { transform: translate(-50%, -50%) rotate(0deg) translateX(100px); }
          100% { transform: translate(-50%, -50%) rotate(360deg) translateX(100px); }
        }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-out forwards;
        }
      `}</style>
        </div>
    );
}
