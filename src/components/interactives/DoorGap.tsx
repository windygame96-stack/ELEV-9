import { useContext, useState } from "react";
import { GameContext } from "@/contexts/gameContext";

interface DoorGapProps {
    onClose: () => void;
    isUsingFlashlight: boolean;
    toggleFlashlight: () => void;
}

export default function DoorGap(
    {
        onClose,
        isUsingFlashlight,
        toggleFlashlight
    }: DoorGapProps
) {
    const {
        gameState,
        addDiscoveredClue
    } = useContext(GameContext);

    const [hasDiscoveredSchedule, setHasDiscoveredSchedule] = useState(false);

    const discoverSchedule = () => {
        setHasDiscoveredSchedule(true);
        if (!gameState.discoveredClues.includes("scheduleDiscovered")) {
            addDiscoveredClue("scheduleDiscovered");
        }
    };

    return (
        <div
            className="absolute inset-0 flex items-center justify-center bg-black/80 p-4 z-50">
            <div
                className="bg-gray-900 rounded-lg border-2 border-red-500 max-w-2xl w-full max-h-[90vh] flex flex-col">
                <div
                    className="flex justify-between items-center p-4 md:p-6 border-b border-gray-800">
                    <h2 className="text-2xl font-bold text-white">电梯门缝</h2>
                    <button
                        onClick={onClose}
                        className="text-white hover:text-gray-400 transition-colors">
                        <i className="fa-solid fa-times"></i>
                    </button>
                </div>
                {gameState.inventory.includes("手机") && <button
                    onClick={toggleFlashlight}
                    className={`absolute bottom-4 left-4 p-3 rounded-full ${isUsingFlashlight ? "bg-yellow-500" : "bg-gray-700"} text-white shadow-lg transition-all duration-300 z-20`}
                    title={isUsingFlashlight ? "关闭手电筒" : "打开手电筒"}>
                    <i
                        className={`fa-solid ${isUsingFlashlight ? "fa-lightbulb" : "fa-lightbulb-slash"}`}></i>
                </button>}
                <div className="flex-1 min-h-0 overflow-y-auto p-4 md:p-6">
                    <div className="mb-6">
                        {!isUsingFlashlight ? <div
                            className="w-full h-48 bg-black rounded-lg flex items-center justify-center mb-4">
                            <p className="text-gray-500">黑漆漆一片，什么也看不见</p>
                        </div> : <div className={`w-full bg-black rounded-lg relative mb-4 ${hasDiscoveredSchedule ? "min-h-full" : "h-64 overflow-hidden"}`}>
                            <div
                                className="absolute inset-0 bg-cover bg-center"
                                style={{
                                    backgroundImage: "url(https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Corridor%20wall%20signs%2017th%20floor%20laboratory%20area&sign=e40b068cd915ce53b09bb4d1009c7db6)",
                                    opacity: 0.7
                                }} />
                             {!hasDiscoveredSchedule ? <button
                                onClick={discoverSchedule}
                                className="absolute top-4 right-4 p-2 bg-blue-900/50 border border-blue-500 rounded text-blue-300 text-sm">调查墙壁
                                                                                   </button> : <div
                                className="relative bg-black/75 p-3 md:p-5 flex items-start justify-center z-10 rounded-lg">
                                <div 
                                     className="w-full flex items-start justify-center">
                                      <div
                                          className="bg-gray-800/95 border border-yellow-500 rounded-lg p-4 md:p-6 w-full max-w-lg flex flex-col">
                                         <h3 className="text-yellow-400 font-bold mb-3 text-center text-base">日程排序逻辑题</h3>
                                         <p className="text-white text-sm mb-4">谁在什么时间去了几楼？</p>
                                         <div className="space-y-2 text-sm text-gray-300 mb-4">
                                             <p>人物：王淑兰、李小明、张三金</p>
                                             <p>职业：快递、经理、保洁</p>
                                             <p>时间：10 点、12 点、16 点</p>
                                             <p>楼层：5 楼、10 楼、15 楼</p>
                                         </div>
                                         <div className="space-y-1 text-xs text-gray-300 mb-4">
                                             <p>1. 快递来的最早，张三金来的最晚</p>
                                             <p>2. 王淑兰 12点不在10层停靠</p>
                                             <p>3. 李小明不是保洁，在15层停靠</p>
                                             <p>4. 经理下午会去10层</p>
                                         </div>
                                        <div className="rounded border border-yellow-500/30 bg-black/30 p-3">
                                            <p className="text-xs leading-relaxed text-yellow-200">
                                                纸上的答案不会停留在纸上。那排沉默的按钮，正等待一段由先后与去向组成的暗号。
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>}
                        </div>}
                        <div className="space-y-3">
                            {!isUsingFlashlight ? <p className="text-gray-400">太黑了，什么都看不见。也许你可以使用手电筒？</p> : <>
                                {!hasDiscoveredSchedule ? <>
                                    <p className="text-gray-300">你看到了17层走廊的墙壁。</p>
                                    <p className="text-gray-300">墙上贴着楼层号："17层 - 实验区域"。</p>
                                    <p className="text-yellow-400 text-sm">点击右上角的"调查墙壁"按钮查看更多信息</p>
                                </> : <>
                                    <p className="text-gray-300">墙上贴着一份员工日程表。</p>
                                </>}
                            </>}
                        </div>
                    </div>
                </div>
                <div className="p-4 md:p-6 border-t border-gray-800 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded transition-colors">关闭
                                                          </button>
                </div>
            </div>
        </div>
    );
}
