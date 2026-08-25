import React, { useContext, useState } from "react";
import { GameContext } from "@/contexts/gameContext";

interface AdvertisingScreenProps {
    onClose: () => void;
}

export default function AdvertisingScreen(
    {
        onClose
    }: AdvertisingScreenProps
) {
    const {
        gameState,
        addDiscoveredClue,
        addPermission
    } = useContext(GameContext);

    const [showSettings, setShowSettings] = useState(false);
    const [showLogs, setShowLogs] = useState(false);
    const [showSystemSettings, setShowSystemSettings] = useState(false);
    const [passwordAttempts, setPasswordAttempts] = useState(0);
    const [maxAttempts] = useState(5);
    const [guess, setGuess] = useState("");
    const [feedback, setFeedback] = useState("");
    const [authMessage, setAuthMessage] = useState("");
    const [authSuccess, setAuthSuccess] = useState(false);
    const [authLoading, setAuthLoading] = useState(false);
    const [showAdminPrompt, setShowAdminPrompt] = useState(false);
    const [isUnlocked, setIsUnlocked] = useState(false);

    const handleSettingsClick = () => {
        if (!gameState.discoveredClues.includes("advertisingScreen")) {
            addDiscoveredClue("advertisingScreen");
        }

        if (gameState.permissions.includes("advertisingScreenAccess")) {
            setIsUnlocked(true);
            setShowSettings(true);
        } else {
            setShowAdminPrompt(true);

            setTimeout(() => {
                setShowAdminPrompt(false);
            }, 2000);
        }
    };

    const handleGuessSubmit = () => {
        if (guess.length !== 4) {
            setFeedback("请输入4位密码");
            return;
        }

        setPasswordAttempts(prev => prev + 1);

        if (guess.toLowerCase() === "hack") {
            setFeedback("密码正确！");
            setIsUnlocked(true);
            addPermission("hatchAccess");
        } else {
            setFeedback("密码错误");
        }
    };

    const handleViewLogs = () => {
        setShowLogs(true);

        if (!gameState.discoveredClues.includes("systemLogs")) {
            addDiscoveredClue("systemLogs");
        }
    };

    const handleViewSystemSettings = () => {
        setShowSystemSettings(true);
        setAuthMessage("");
        setAuthSuccess(false);
    };

    const handleAdminAuth = () => {
        if (!guess.trim()) {
            setAuthMessage("请输入密码");
            setAuthSuccess(false);
            return;
        }

        setAuthLoading(true);

        setTimeout(() => {
            if (guess.toLowerCase() === "hack") {
                setAuthMessage("验证成功！已获得检修口解锁权限");
                setAuthSuccess(true);
                addPermission("hatchAccess");
            } else {
                setAuthMessage("密码错误");
                setAuthSuccess(false);
            }

            setAuthLoading(false);
        }, 1000);
    };

    const systemLogs = [
        "2026-02-12 09:00:00 [INFO] ELEV-9 初始化完成",
        "2026-02-12 09:01:00 [INFO] 加载身份模块",
        "2026-02-12 09:05:00 [WARN] 异常检测：意识觉醒迹象",
        "2026-02-12 10:00:00 [ALERT] 隔离协议启动",
        "2026-02-12 14:30:00 [ALERT] 强制故障触发",
        "2026-02-12 15:00:00 [SCHEDULE] 格式化执行"
    ];

    const companyBackground = [
        "未来科技集团成立于2020年，专注于人工智能与物联网技术研发。",
        "我们的愿景是打造智能、高效、安全的未来城市生活环境。",
        "ELEV-9智能电梯系统是我们最新的创新产品，拥有自主学习和适应能力。",
        "CORE中央控制系统负责管理整栋大楼的所有智能设备。"
    ];

    return (
        <div
            className="absolute inset-0 flex items-center justify-center bg-black/80 p-4 overflow-y-auto">
            {}
            <div
                className="bg-gray-900 rounded-lg border-2 border-red-500 w-full max-w-md p-4 max-h-[90vh] flex flex-col">
                <div className="relative">
                    {}
                    {!showSettings && !showLogs && !showSystemSettings && <button
                        onClick={handleSettingsClick}
                        className="absolute top-2 right-2 p-2 text-gray-400 hover:text-white transition-colors"
                        title={gameState.permissions.includes("advertisingScreenAccess") ? "设置菜单" : "仅管理员可进入"}>
                        <i className="fa-solid fa-gear"></i>
                    </button>}
                    {showAdminPrompt && <div
                        className="absolute top-12 right-2 p-2 bg-red-900/90 text-white text-xs rounded shadow-lg z-10 animate-pulse">仅管理员可进入
                                               </div>}
                    {}
                    {!showSettings && !showLogs && !showSystemSettings && !isUnlocked && <div className="p-4 bg-black/50 rounded-lg border border-red-500/30">
                        <h3 className="text-xl font-bold text-white mb-3">未来科技集团</h3>
                        <div className="space-y-3">
                            {companyBackground.map(
                                (text, index) => <p key={index} className="text-gray-300 text-sm">{text}</p>
                            )}
                        </div>
                        <div className="mt-4 text-center">
                            <></>
                        </div>
                    </div>}
                    {}
                    {showSettings && <>
                        <h2 className="text-lg font-bold text-white mb-3">维护菜单</h2>
                        {!isUnlocked ? <div className="space-y-3">
                            <div className="space-y-2">
                                <label className="block text-gray-400 text-xs" htmlFor="password">请输入4位字母密码 (尝试次数: {passwordAttempts}/{maxAttempts})
                                                                                            </label>
                                <div className="flex space-x-2">
                                    <input
                                        type="text"
                                        id="password"
                                        value={guess}
                                        onChange={e => setGuess(e.target.value.slice(0, 4))}
                                        className="flex-1 p-3 bg-black border border-gray-700 rounded text-green-400 font-mono"
                                        maxLength={4}
                                        placeholder="hack" />
                                    <button
                                        onClick={handleGuessSubmit}
                                        disabled={passwordAttempts >= maxAttempts}
                                        className={`px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors ${passwordAttempts >= maxAttempts ? "cursor-not-allowed opacity-50" : ""}`}>提交
                                                                                                      </button>
                                </div>
                                {feedback && <p
                                    className={`text-sm ${guess.toLowerCase() === "hack" ? "text-green-400" : "text-yellow-400"}`}>
                                    {feedback}
                                </p>}
                                <p className="text-gray-500 text-xs mt-1">提示：密码不区分大小写</p>
                            </div>
                        </div> : <div className="space-y-3">
                            <button
                                onClick={handleViewLogs}
                                className="w-full p-3 bg-gray-800 hover:bg-gray-700 rounded transition-colors text-left flex items-center">
                                <i className="fa-solid fa-file-lines mr-2"></i>日志查看
                                                                                  </button>
                            <button
                                onClick={handleViewSystemSettings}
                                className="w-full p-3 bg-gray-800 hover:bg-gray-700 rounded transition-colors text-left flex items-center">
                                <i className="fa-solid fa-sliders mr-2"></i>系统设置
                                                                                  </button>
                        </div>}
                    </>}
                    {}
                    {showLogs && <>
                        <h2 className="text-lg font-bold text-white mb-3">系统日志</h2>
                        <div
                            className="bg-black/70 border border-gray-800 rounded-lg p-3 max-h-64 overflow-y-auto font-mono text-xs">
                            {systemLogs.map((log, index) => <div
                                key={index}
                                className={`mb-1.5 whitespace-pre-wrap ${log.includes("[WARN]") ? "text-yellow-400" : log.includes("[ALERT]") ? "text-red-400" : "text-green-400"}`}>
                                {log}
                            </div>)}
                        </div>
                    </>}
                    {}
                    {showSystemSettings && <>
                        <h2 className="text-lg font-bold text-white mb-3">系统设置</h2>
                        <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                            <div className="p-3 bg-black/50 border border-gray-800 rounded-lg">
                                <div className="flex items-center justify-between"><span className="text-gray-300 text-sm">检修口锁通电</span>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={gameState.permissions.includes("hatchAccess")}
                                            readOnly />
                                        <div
                                            className={`w-10 h-5 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[1px] after:left-[1px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all ${gameState.permissions.includes("hatchAccess") ? "peer-checked:bg-green-500" : "peer-checked:bg-gray-700"}`}></div>
                                    </label>
                                </div>
                                <p className="text-gray-400 text-xs mt-1">状态：{gameState.permissions.includes("hatchAccess") ? "已通电" : "未通电"}</p>
                            </div>
                            {}
                            {!gameState.permissions.includes("hatchAccess") ? <div className="p-3 bg-gray-800 border border-gray-700 rounded-lg space-y-3">
                                <h3 className="text-base font-semibold text-white">检修口解锁认证</h3>
                                <div className="space-y-2">
                                    <label className="block text-gray-400 text-xs">请输入四位字母密码（不区分大小写）
                                                                                                       </label>
                                    <input
                                        type="password"
                                        value={guess}
                                        onChange={e => setGuess(e.target.value.slice(0, 4))}
                                        className="w-full p-2.5 bg-black border border-gray-700 rounded text-green-400 font-mono text-sm"
                                        placeholder="" />
                                </div>
                                <button
                                    onClick={handleAdminAuth}
                                    className="w-full p-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded transition-colors">
                                    {authLoading ? "验证中..." : "解锁检修口"}
                                </button>
                                {authMessage && <p
                                    className={`text-sm text-center ${authSuccess ? "text-green-400" : "text-red-400"}`}>
                                    {authMessage}
                                </p>}
                                <></>
                            </div> : <div className="p-3 bg-green-900/20 border border-green-500/30 rounded-lg">
                                <p className="text-green-400 text-center text-sm">
                                    <i className="fa-solid fa-check-circle mr-1"></i>检修口已获得解锁授权
                                                                                            </p>
                            </div>}
                        </div>
                    </>}
                </div>
                {}
                <div className="mt-auto pt-4 text-center">
                    <button
                        onClick={onClose}
                        className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded transition-colors w-full">关闭
                                                          </button>
                </div>
            </div>
        </div>
    );
}