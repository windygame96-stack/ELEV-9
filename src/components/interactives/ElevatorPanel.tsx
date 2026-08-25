import { useContext, useState, useEffect } from "react";
import { GameContext } from "@/contexts/gameContext";

interface ElevatorPanelProps {
    onClose: () => void;
}

export default function ElevatorPanel(
    {
        onClose
    }: ElevatorPanelProps
) {
    const {
        gameState,
        addDiscoveredClue,
        addPermission
    } = useContext(GameContext);

    const [pressedButton, setPressedButton] = useState<number | null>(null);
    const [hasDiscoveredClue, setHasDiscoveredClue] = useState(false);
    const [buttonPressSequence, setButtonPressSequence] = useState<string>("");
    const [hasUnlockedAdvertisingScreen, setHasUnlockedAdvertisingScreen] = useState(false);
    const [showEmergencyButton, setShowEmergencyButton] = useState(false);
    const floors = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
    const correctSequence = "12161051015";
    const emergencyMessages = ["...滋滋...", "异常1000", "隔离0001", "清理0011", "检修1011"];
    const [emergencyMessageIndex, setEmergencyMessageIndex] = useState(0);
    const [showEmergencyMessage, setShowEmergencyMessage] = useState(false);

    const handleButtonPress = (floor: number) => {
        setPressedButton(floor);
        setButtonPressSequence(prev => prev + floor.toString());

        setTimeout(() => {
            setPressedButton(null);
        }, 500);

        if (floor === 17 && !hasDiscoveredClue) {
            addDiscoveredClue("elevatorPanelClue");
            setHasDiscoveredClue(true);
            setShowEmergencyButton(true);
        }

        if (buttonPressSequence + floor.toString() === correctSequence && !hasUnlockedAdvertisingScreen) {
            setHasUnlockedAdvertisingScreen(true);
            addPermission("advertisingScreenAccess");
            addDiscoveredClue("elevatorPanelSolved");
        }
    };

    const handleEmergencyButtonPress = () => {
        setShowEmergencyMessage(true);

        const interval = setInterval(() => {
            setEmergencyMessageIndex(prev => {
                if (prev >= emergencyMessages.length - 1) {
                    clearInterval(interval);
                    setTimeout(() => setShowEmergencyMessage(false), 1000);
                    return 0;
                }

                return prev + 1;
            });
        }, 1000);
    };

    useEffect(() => {
        if (gameState.permissions.includes("elevatorPanelAccess")) {
            setShowEmergencyButton(true);
        }
    }, [gameState.permissions]);

    return (
        <div
            className="absolute inset-0 flex items-center justify-center bg-black/80 p-4">
            <div
                className="bg-gray-900 rounded-lg border-2 border-red-500 max-w-md w-full p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white">电梯控制面板</h2>
                    <button
                        onClick={onClose}
                        className="text-white hover:text-gray-400 transition-colors">
                        <i className="fa-solid fa-times"></i>
                    </button>
                </div>
                {}
                <div className="flex justify-center mb-8">
                    <button
                        onClick={handleEmergencyButtonPress}
                        className="w-32 h-16 bg-red-600 hover:bg-red-500 text-white rounded-lg border-2 border-red-400 flex items-center justify-center shadow-lg shadow-red-900/60 transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
                        title="紧急呼叫按钮">
                        <i className="fa-solid fa-phone text-xl mr-2"></i>
                        <span className="text-lg font-bold">紧急呼叫</span>
                    </button>
                </div>
                {showEmergencyMessage && <div
                    className="p-3 bg-black/70 border border-yellow-500/30 rounded-lg text-center mb-4">
                    <p className="text-yellow-400 font-mono">{emergencyMessages[emergencyMessageIndex]}</p>
                </div>}
                {}
                {showEmergencyMessage && <></>}
                {}
                <div className="mb-4 p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                    <p className="text-blue-300 text-sm">广告屏后台模式启动方法：输入电梯管理员一天的工作流程
                                                                                  </p>
                    {hasUnlockedAdvertisingScreen && <p className="text-green-400 text-xs mt-1">
                        <i className="fa-solid fa-check-circle mr-1"></i>广告屏幕已解锁后台模式
                                                                                    </p>}
                </div>
                {}
                <div className="grid grid-cols-5 gap-1 mb-6">
                    {floors.map(floor => <button
                        key={floor}
                        onClick={() => handleButtonPress(floor)}
                        className={`relative flex flex-col items-center transition-all ${pressedButton === floor ? "opacity-70 scale-110" : "hover:scale-105 hover:border-yellow-500"}`}
                        title={floor === 17 ? "当前楼层，试试看按下它" : `楼层 ${floor}`}>
                        <div
                            className={`w-8 h-8 flex items-center justify-center rounded-full border-2 ${pressedButton === floor ? "bg-red-600 border-red-400" : floor === 17 ? "bg-gray-700 border-yellow-500" : "bg-gray-800 border-gray-700"}`}>
                            <span
                                className={`text-xs ${pressedButton === floor ? "text-white" : floor === 17 ? "text-yellow-400" : "text-gray-400"}`}>
                                {floor}
                            </span>
                        </div>
                        <div
                            className={`w-3 h-3 mt-1 rounded-full ${pressedButton === floor ? "bg-red-500" : floor === 17 ? "bg-yellow-500" : "bg-gray-700"}`}></div>
                    </button>)}
                </div>
                {}
                <div className="text-center">
                    <></>
                    {hasDiscoveredClue ? <></> : <></>}
                </div>
            </div>
        </div>
    );
}