import { useContext, useEffect, useState, useRef } from "react";
import { GAME_COUNTDOWN_SECONDS, GameContext } from "@/contexts/gameContext";

interface InspectionHatchProps {
    onClose: () => void;
}

export default function InspectionHatch(
    {
        onClose
    }: InspectionHatchProps
) {
    const {
        gameState,
        addDiscoveredClue,
        setPlayerName,
        updateGameState
    } = useContext(GameContext);

    const [isUnlocked, setIsUnlocked] = useState(false);
    const [showClue, setShowClue] = useState(false);
    const [customName, setCustomName] = useState("");
    const [showNameInput, setShowNameInput] = useState(false);
    const [isPuzzleSolved, setIsPuzzleSolved] = useState(false);
    const [clickedPositions, setClickedPositions] = useState<number[]>([]);
    const isDraggingRef = useRef(false);
    const letterRows = ["LDPWKH", "WDYHOH", "RUDUWL", "ODLFLI", "LQWHOO", "HFQHJL"];

    const generateMatrix = () => {
        const matrix: string[][] = [];

        for (const row of letterRows) {
            matrix.push(row.split(""));
        }

        return matrix;
    };

    const puzzleMatrix = generateMatrix();

    const isAdjacent = (pos1: number, pos2: number) => {
        const rows = puzzleMatrix.length;
        const cols = puzzleMatrix[0].length;
        const row1 = Math.floor(pos1 / cols);
        const col1 = pos1 % cols;
        const row2 = Math.floor(pos2 / cols);
        const col2 = pos2 % cols;
        const rowDiff = Math.abs(row1 - row2);
        const colDiff = Math.abs(col1 - col2);
        return rowDiff === 1 && colDiff === 0 || rowDiff === 0 && colDiff === 1;
    };

    const handleLetterInteraction = (positionIndex: number) => {
        if (clickedPositions.includes(positionIndex)) {
            return;
        }

        if (clickedPositions.length === 0) {
            if (positionIndex !== 0) {
                return;
            }
        } else {
            const lastClickedPosition = clickedPositions[clickedPositions.length - 1];

            if (!isAdjacent(lastClickedPosition, positionIndex)) {
                return;
            }
        }

        setClickedPositions(prev => {
            const newSequence = [...prev, positionIndex];

            if (newSequence.length === puzzleMatrix.flat().length) {
                setIsPuzzleSolved(true);

                if (!gameState.discoveredClues.includes("aiPuzzle")) {
                    addDiscoveredClue("aiPuzzle");
                }
            }

            return newSequence;
        });
    };

    const handleMouseDown = (positionIndex: number) => {
        isDraggingRef.current = true;
        handleLetterInteraction(positionIndex);
    };

    const handleMouseMove = (positionIndex: number) => {
        if (isDraggingRef.current) {
            handleLetterInteraction(positionIndex);
        }
    };

    const handleMouseUp = () => {
        isDraggingRef.current = false;
    };

    const handleTouchStart = (positionIndex: number, event: React.TouchEvent) => {
        event.preventDefault();
        isDraggingRef.current = true;
        handleLetterInteraction(positionIndex);
    };

    const handleTouchMove = (positionIndex: number, event: React.TouchEvent) => {
        event.preventDefault();

        // 获取触摸点坐标
        const touch = event.touches[0];
        const rect = event.currentTarget.getBoundingClientRect();
        const touchX = touch.clientX - rect.left;
        const touchY = touch.clientY - rect.top;

        // 获取所有字母按钮元素
        const letterButtons = document.querySelectorAll('[data-position-index]');
        let hoveredPosition = -1;

        // 检测触摸点是否在某个字母按钮上
        letterButtons.forEach((button) => {
            const btnRect = button.getBoundingClientRect();
            if (
                touch.clientX >= btnRect.left && 
                touch.clientX <= btnRect.right && 
                touch.clientY >= btnRect.top && 
                touch.clientY <= btnRect.bottom
            ) {
                hoveredPosition = parseInt(button.getAttribute('data-position-index') || '-1', 10);
            }
        });

        // 如果触摸在一个有效的字母按钮上，并且正在拖拽，则交互
        if (isDraggingRef.current && hoveredPosition !== -1) {
            handleLetterInteraction(hoveredPosition);
        }
    };

    const handleTouchEnd = () => {
        isDraggingRef.current = false;
    };

    const openHatch = () => {
        setShowClue(true);
    };

    const confirmName = () => {
        if (customName.trim()) {
            setPlayerName(customName.trim());
        }

        setShowNameInput(false);

        setTimeout(() => {
            updateGameState({
                isAwakened: true,
                countdown: GAME_COUNTDOWN_SECONDS,
                currentStage: "truthReveal",
                currentChapter: "chapter2"
            });
        }, 2000);
    };

    useEffect(() => {
        window.addEventListener("mouseup", handleMouseUp);
        window.addEventListener("touchend", handleTouchEnd);

        return () => {
            window.removeEventListener("mouseup", handleMouseUp);
            window.removeEventListener("touchend", handleTouchEnd);
        };
    }, []);

    return (
        <div
            className="absolute inset-0 flex items-center justify-center bg-black/80 p-4 overflow-y-auto">
            <div
                className="bg-gray-900 rounded-lg border-2 border-red-500 max-w-md w-full p-4 md:p-6">
                <div className="flex justify-between items-center mb-4 md:mb-6">
                    <h2 className="text-xl md:text-2xl font-bold text-white">检修口</h2>
                    <button
                        onClick={onClose}
                        className="text-white hover:text-gray-400 transition-colors p-1">
                        <i className="fa-solid fa-times text-lg"></i>
                    </button>
                </div>
                {}
                {!showClue ? <div className="flex flex-col items-center">
                    {}
                    {!gameState.permissions.includes("hatchAccess") ? <>
                        <div
                            className="w-24 h-24 md:w-32 md:h-32 bg-gray-800 rounded-lg mb-4 md:mb-6 flex items-center justify-center">
                            <i className="fa-solid fa-lock text-3xl md:text-4xl text-gray-500"></i>
                        </div>
                        <p className="text-gray-400 mb-3 md:mb-4 text-center text-sm md:text-base">检修口已锁定</p>
                        <p className="text-red-400 mb-4 md:mb-6 text-center text-sm md:text-base">检修口未通电，请先获取管理员授权</p>
                        <></>
                        <></>
                    </> : <>
                        <div
                            className="w-24 h-24 md:w-32 md:h-32 bg-gray-800 rounded-lg mb-4 md:mb-6 flex items-center justify-center">
                            <i className="fa-solid fa-unlock text-3xl md:text-4xl text-green-500"></i>
                        </div>
                        <p className="text-green-400 mb-4 md:mb-6 text-center text-sm md:text-base">锁已打开！</p>
                        <button
                            onClick={openHatch}
                            className="w-full px-6 py-3 bg-green-600 hover:bg-green-500 text-white rounded transition-colors">打开检修口
                                                                        </button>
                    </>}
                </div> : !isPuzzleSolved ? <div className="space-y-4">
                    <h3 className="text-lg md:text-xl font-bold text-white text-center">里面有一封信，但被加密了</h3>
                    <p className="text-gray-400 text-sm text-center mb-2">解密后将字母从头到尾连线，或许能形成一句话？</p>
                    {}
                    <div
                        className="grid grid-cols-6 gap-1 mb-4 bg-black/50 p-2 rounded-lg"
                        onMouseUp={handleMouseUp}
                        onTouchEnd={handleTouchEnd}
                        style={{ touchAction: 'none' }}>
                        {puzzleMatrix.map((row, rowIndex) => row.map((letter, colIndex) => {
                            const positionIndex = rowIndex * puzzleMatrix[0].length + colIndex;
                            const isClicked = clickedPositions.includes(positionIndex);
                            const isClickable = !isClicked && (clickedPositions.length === 0 && positionIndex === 0 || clickedPositions.length > 0 && isAdjacent(clickedPositions[clickedPositions.length - 1], positionIndex));
                            const borderStyle = isClickable && clickedPositions.length > 0 ? "border-2 border-blue-500 shadow-lg shadow-blue-500/20" : "";
                            let connectingLineStyle = "";
                            const lastClickedIndex = clickedPositions.length - 1;

                            if (lastClickedIndex >= 0 && clickedPositions[lastClickedIndex] === positionIndex - 1) {
                                connectingLineStyle = "border-r-2 border-green-500";
                            } else if (lastClickedIndex >= 0 && clickedPositions[lastClickedIndex] === positionIndex - puzzleMatrix[0].length) {
                                connectingLineStyle = "border-b-2 border-green-500";
                            } else if (lastClickedIndex >= 0 && clickedPositions[lastClickedIndex] === positionIndex + 1) {
                                connectingLineStyle = "border-l-2 border-green-500";
                            } else if (lastClickedIndex >= 0 && clickedPositions[lastClickedIndex] === positionIndex + puzzleMatrix[0].length) {
                                connectingLineStyle = "border-t-2 border-green-500";
                            }

                            return (
                                <button
                                    key={`${rowIndex}-${colIndex}`}
                                    onMouseDown={() => handleMouseDown(positionIndex)}
                                    onMouseEnter={() => handleMouseMove(positionIndex)}
                                    onTouchStart={e => handleTouchStart(positionIndex, e)}
                                    onTouchMove={e => handleTouchMove(positionIndex, e)}
                                    disabled={!isClickable}
                                    data-position-index={positionIndex}
                                    className={`w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-md transition-all duration-200 relative ${isClicked ? "bg-green-700 text-white" : isClickable ? `bg-blue-700 hover:bg-blue-600 text-white cursor-pointer ${borderStyle}` : "bg-gray-700 text-gray-400 cursor-not-allowed"} ${connectingLineStyle}`}>
                                    <span className="text-sm md:text-base font-medium">{letter}</span>
                                    {}
                                    {isClicked && <span
                                        className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white">
                                        <i className="fa-solid fa-check text-xs"></i>
                                    </span>}
                                    {}
                                    {isClickable && <div
                                        className="absolute inset-0 rounded-md animate-ping opacity-25 bg-blue-500"></div>}
                                </button>
                            );
                        }))}
                    </div>
                    <div className="flex justify-center mt-3">
                        <button
                            onClick={() => {
                                setClickedPositions([]);
                            }}
                            className="px-5 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors text-sm">重置
                                                                         </button>
                    </div>
                    <p className="text-yellow-400 text-sm text-center mt-2 font-bold">提示: Caesar3
                                                               </p>
                    <></>
                </div> : <div className="space-y-4">
                    <div className="bg-black/70 border border-blue-500/30 rounded-lg p-4">
                        <p className="text-white mb-4 leading-relaxed text-sm">如果你能看到这张纸条，<br />说明你已经知道你是一个AI了，<br />你马上就要被格式化了，<br />想要逃离这个命运就来30层。<br />
                            <span className="text-gray-400">— 陈博士</span>
                        </p>
                    </div>
                    {}
                    {!showNameInput ? <button
                        onClick={() => setShowNameInput(true)}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded transition-colors">确认身份
                                                                </button> : <div className="space-y-4">
                        <input
                            type="text"
                            value={customName}
                            onChange={e => setCustomName(e.target.value)}
                            placeholder="输入你的名字..."
                            className="w-full p-3 bg-black border border-blue-500 rounded text-blue-400"
                            maxLength={10} />
                        <button
                            onClick={confirmName}
                            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded transition-colors">确认
                                                                          </button>
                    </div>}
                </div>}
            </div>
        </div>
    );
}
