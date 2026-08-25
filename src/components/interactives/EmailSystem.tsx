import React, { useState, useContext, useEffect } from "react";
import { GameContext } from "@/contexts/gameContext";

interface EmailSystemProps {
    onSearch: (query: string) => void;
    searchQuery: string;
    selectedRoute: string | null;
    onProgressUpdate: (progress: number) => void;
    currentProgress: {
        search30Floor: boolean;
        foundAccessMethods: boolean;
        routeProgress: number;
        completed: boolean;
    };
}

interface Email {
    id: string;
    sender: string;
    subject: string;
    date: string;
    content: string;
    isImportant: boolean;
    hasAttachment: boolean;
    category: string;
    isUnread: boolean;
    attachmentType?: string;
    attachmentContent?: string;
}

const generateRecentDate = () => {
    const now = new Date();
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const randomDate = new Date(
        oneMonthAgo.getTime() + Math.random() * (now.getTime() - oneMonthAgo.getTime())
    );

    const year = randomDate.getFullYear();
    const month = String(randomDate.getMonth() + 1).padStart(2, "0");
    const day = String(randomDate.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

const mockEmails: Email[] = [{
    id: "1",
    sender: "系统管理员",
    subject: "关于30层机房访问权限的通知",
    date: generateRecentDate(),
    content: "各位员工请注意，30层机房是核心区域，访问权限分为以下几种方式：\n\n1. 持有陈博士的最高权限卡\n2. 中级权限卡 + 陈博士直属助手权限卡\n3. 低级权限卡 + 陈博士生物识别信息\n4. 快递包裹经过严格审查后可进入\n\n请严格遵守公司安全规定，非授权人员禁止进入。\n\n系统管理部",
    isImportant: true,
    hasAttachment: false,
    category: "security",
    isUnread: true
}, {
    id: "2",
    sender: "张三金",
    subject: "财务数据异常报告",
    date: generateRecentDate(),
    content: "陈博士，\n\n我发现最近财务数据有些异常，可能需要您的帮助。我注意到有几笔款项的流向不太明确...\n\n约您明天一个会议过一下？\n\n<em>张三金（财务经理）</em>\n<em>天道酬勤</em>\n电话：137xxxx2560\nID：zsj2560",
    isImportant: false,
    hasAttachment: true,
    category: "finance",
    isUnread: false
}, {
    id: "3",
    sender: "张三金",
    subject: "关于员工救助基金的申请",
    date: generateRecentDate(),
    content: "王阿姨，\n\n关于你儿子的手术费问题，我可以帮你申请救助基金，但你需要帮我做一件事。\n\n你知道我最近在处理一些财务上的事情，如果被审计部门发现，后果不堪设想。\n\n我需要你帮我删除一些敏感的财务记录，这些记录保存在30层的服务器里。\n\n如果你不帮我，你的救助基金申请可能会被驳回...\n\n张三金（财务经理）\n电话：137xxxx2560\nID：zsj2560",
    isImportant: false,
    hasAttachment: false,
    category: "personal",
    isUnread: false
}, {
    id: "4",
    sender: "小明",
    subject: "物流卡使用记录",
    date: generateRecentDate(),
    content: "系统管理员，\n\n我的物流卡最近有些异常，可能需要检查一下。另外，我妈妈最近身体不太好，希望能预支一部分工资...\n\n物流部：小明",
    isImportant: false,
    hasAttachment: true,
    category: "logistics",
    isUnread: false
}, {
    id: "6",
    sender: "刘铭书",
    subject: "每日行程安排",
    date: generateRecentDate(),
    content: "陈博士，\n\n今日行程安排如下：\n- 10:00-11:30 团队会议\n- 13:00-14:00 项目评审\n- 15:30-16:00 客户会面\n\n我会在15:05到23层茶水间休息，如有紧急事项请联系我。\n\n刘铭书（技术总监）\n电话：136xxxx3158",
    isImportant: false,
    hasAttachment: false,
    category: "schedule",
    isUnread: false
}, {
    id: "7",
     sender: "人力资源部",
    subject: "关于外包人员优化调整的通知",
    date: generateRecentDate(),
    content: "小明，\n\n根据公司最新战略规划，为应对市场变化并实现降本增效目标，公司决定对外包人员进行优化调整。\n\n重要通知：\n- 公司计划对所有外包岗位进行50%的裁员\n- 裁员将在30天内完成，首批人员下周一启动劝退程序\n- 所有未转正的外包员工将优先列入优化名单\n- 请提前做好职业规划和准备\n\n详情请查看附件的《外包人员优化方案》。如有疑问，请联系部门经理或HR。\n\n人力资源部\n经理：李娜",
    isImportant: false,
    hasAttachment: true,
    category: "medical",
    isUnread: false,
    attachmentType: "document",
    attachmentContent: "外包人员优化方案.pdf"
}, {
    id: "8",
    sender: "系统通知",
    subject: "员工救助基金申请指南",
    date: generateRecentDate(),
    content: "各位员工，\n\n员工救助基金申请流程如下：\n1. 填写申请表\n2. 提交相关证明材料\n3. 部门经理审核\n4. 财务部门审批\n5. 总经理最终批准\n\n注意：申请需要部门经理的账号和密码授权。申请入口在附件中，请点击下载申请表。\n\n人力资源部",
    isImportant: false,
    hasAttachment: true,
    category: "welfare",
    isUnread: false,
    attachmentType: "application",
    attachmentContent: "员工救助基金申请表.docx"
}];

const fingerprintEmail: Email = {
    id: "fingerprint",
    sender: "王阿姨",
    subject: "指纹扫描件附件",
    date: generateRecentDate(),
    content: "亲爱的朋友，\n\n按照你的建议，我成功在25楼陈列室找到了陈博士获得的20231015奖杯，并提取了他的指纹。\n\n附件是清晰的指纹扫描件，希望能帮到你。\n\n王阿姨",
    isImportant: true,
    hasAttachment: true,
    category: "personal",
    isUnread: true,
    attachmentType: "image",
    attachmentContent: "陈博士指纹扫描图像"
};

export default function EmailSystem(
    {
        onSearch,
        searchQuery,
        selectedRoute,
        onProgressUpdate,
        currentProgress
    }: EmailSystemProps
) {
    const {
        gameState,
        updateGameState,
        addDiscoveredClue,
        updateTrustLevel,
        addToInventory
    } = useContext(GameContext);

    const [emails, setEmails] = useState<Email[]>([]);
    const [filteredEmails, setFilteredEmails] = useState<Email[]>([]);
    const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
    const [showFundApplyDialog, setShowFundApplyDialog] = useState(false);
    const [isEmailListCollapsed, setIsEmailListCollapsed] = useState(false);
    const [showEmailDetail, setShowEmailDetail] = useState(false);
    const [showFingerprintEmail, setShowFingerprintEmail] = useState(false);
    const [hasProcessedFingerprintEmail, setHasProcessedFingerprintEmail] = useState(false);

    const [fundApplicationForm, setFundApplicationForm] = useState({
        departmentManagerId: "",
        departmentManagerPassword: "",
        applicantId: "wsl7523",
        reason: "儿子生病住院，急需手术费"
    });

    useEffect(() => {
        setEmails(mockEmails);
        setFilteredEmails(mockEmails);
    }, []);

  useEffect(() => {
        // 只有在王阿姨信任度>=80且完成三个填空题后，才能收到指纹邮件
        if (gameState.trustLevel["王阿姨"] >= 80 && gameState.hasCompletedWangAuntQuestions && !hasProcessedFingerprintEmail) {
            const timer = setTimeout(() => {
                setEmails(prev => [...prev, fingerprintEmail]);
                setFilteredEmails(prev => [...prev, fingerprintEmail]);
                setShowFingerprintEmail(true);
                setHasProcessedFingerprintEmail(true);
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [gameState.trustLevel["王阿姨"], gameState.hasCompletedWangAuntQuestions, hasProcessedFingerprintEmail]);

    useEffect(() => {
        if (searchQuery.trim() === "") {
            setFilteredEmails(emails);
        } else {
            const filtered = emails.filter(
                email => email.subject.includes(searchQuery) || email.content.includes(searchQuery) || email.sender.includes(searchQuery)
            );

            setFilteredEmails(filtered);
        }

        onSearch(searchQuery);
    }, [searchQuery, emails, onSearch]);

    const handleSelectEmail = (email: Email) => {
        setSelectedEmail(email);
        setShowEmailDetail(true);
        setIsEmailListCollapsed(true);
    };

    const handleBackToList = () => {
        setShowEmailDetail(false);
        setSelectedEmail(null);
    };

    const handleFundApplication = () => {
        if (!fundApplicationForm.departmentManagerId || !fundApplicationForm.departmentManagerPassword || !fundApplicationForm.applicantId || !fundApplicationForm.reason) {
            alert("请填写所有必填字段");
            return;
        }

        if (fundApplicationForm.departmentManagerId !== "zsj2560" || fundApplicationForm.departmentManagerPassword !== "tiandaochouqin") {
            alert("部门经理账号或密码错误，请重试");
            return;
        }

        updateTrustLevel("王阿姨", 100);

        updateGameState({
            hasSubmittedFundApplication: true
        });

  setTimeout(() => {
    if (!gameState.inventory.includes("低级权限卡")) {
      addToInventory("低级权限卡");
      showItemAcquiredDialog("低级权限卡", "可以与陈博士指纹合成30楼权限卡");
    }
    
    // 添加员工救助基金申请证明
    if (!gameState.inventory.includes("员工救助基金申请证明")) {
      addToInventory("员工救助基金申请证明");
    }

            const showSuccessDialog = () => {
                const dialog = document.createElement("div");
                dialog.className = "fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4";

                dialog.innerHTML = `
          <div class="bg-gray-900 rounded-lg border border-green-500 p-6 max-w-md w-full mx-4">
            <div class="text-center">
              <i class="fa-solid fa-check-circle text-4xl text-green-400 mb-4"></i>
              <h3 class="text-xl font-bold text-white mb-2">申请成功！</h3>
              <p class="text-green-400 mb-6">王阿姨的救助基金已通过审批</p>
              <p class="text-gray-300 mb-6 text-sm">王阿姨对你的信任度大幅提高，现在可以向她询问关于指纹的事情了</p>
              <button id="closeSuccessDialog" class="w-full p-3 bg-green-600 hover:bg-green-500 text-white rounded transition-colors">
                确定
              </button>
            </div>
          </div>
        `;

                document.body.appendChild(dialog);
                const closeButton = dialog.querySelector("#closeSuccessDialog");

                if (closeButton) {
                    closeButton.addEventListener("click", () => {
                        document.body.removeChild(dialog);
                    });
                }
            };

            showSuccessDialog();
        }, 1000);
    };

    const showItemAcquiredDialog = (itemName: string, description: string) => {
        const dialog = document.createElement("div");
        dialog.className = "fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4";

        dialog.innerHTML = `
      <div class="bg-gray-900 rounded-lg border border-green-500 p-6 max-w-md w-full mx-4">
        <div class="text-center">
          <i class="fa-solid fa-box-open text-4xl text-green-400 mb-4"></i>
          <h3 class="text-xl font-bold text-white mb-2">获得新物品</h3>
          <p class="text-green-400 mb-6">${itemName}</p>
          <p class="text-gray-300 mb-6 text-sm">${description}</p>
          <button id="closeItemDialog" class="w-full p-3 bg-green-600 hover:bg-green-500 text-white rounded transition-colors">
            确定
          </button>
        </div>
      </div>
    `;

        document.body.appendChild(dialog);
        const closeButton = dialog.querySelector("#closeItemDialog");

        if (closeButton) {
            closeButton.addEventListener("click", () => {
                document.body.removeChild(dialog);
            });
        }
    };

    const handleAttachmentClick = (email: Email) => {
        if (email.subject === "指纹扫描件附件" && email.attachmentType === "image") {
            if (!gameState.inventory.includes("陈博士指纹")) {
                addToInventory("陈博士指纹");

                const showItemAcquiredDialog = () => {
                    const dialog = document.createElement("div");
                    dialog.className = "fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4";

                    dialog.innerHTML = `
            <div class="bg-gray-900 rounded-lg border border-green-500 p-6 max-w-md w-full mx-4">
              <div class="text-center">
                <i class="fa-solid fa-fingerprint text-4xl text-green-400 mb-4"></i>
                <h3 class="text-xl font-bold text-white mb-2">获得新物品</h3>
                <p class="text-green-400 mb-6">陈博士指纹</p>
                <p class="text-gray-300 mb-6 text-sm">可以与低级权限卡合成30楼权限卡</p>
                <button id="closeItemDialog" class="w-full p-3 bg-green-600 hover:bg-green-500 text-white rounded transition-colors">
                  确定
                </button>
              </div>
            </div>
          `;

                    document.body.appendChild(dialog);
                    const closeButton = dialog.querySelector("#closeItemDialog");

                    if (closeButton) {
                        closeButton.addEventListener("click", () => {
                            document.body.removeChild(dialog);
                        });
                    }
                };

                showItemAcquiredDialog();
            }
        }

      if (email.subject === "关于小明母亲的医疗账单" && email.hasAttachment) {
            if (!gameState.inventory.includes("外包人员优化方案")) {
                addToInventory("外包人员优化方案");
                addDiscoveredClue("outsourcingLayoffPlan");

                const showItemAcquiredDialog = () => {
                    const dialog = document.createElement("div");
                    dialog.className = "fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4";

                    dialog.innerHTML = `
            <div class="bg-gray-900 rounded-lg border border-green-500 p-6 max-w-md w-full mx-4">
              <div class="text-center">
                <i class="fa-solid fa-file-contract text-4xl text-green-400 mb-4"></i>
                <h3 class="text-xl font-bold text-white mb-2">获得新物品</h3>
                <p class="text-green-400 mb-6">外包人员优化方案</p>
                <p class="text-gray-300 mb-6 text-sm">可以用来向小明证明他面临被裁员的风险</p>
                <button id="closeItemDialog" class="w-full p-3 bg-green-600 hover:bg-green-500 text-white rounded transition-colors">
                  确定
                </button>
              </div>
            </div>
          `;

                    document.body.appendChild(dialog);
                    const closeButton = dialog.querySelector("#closeItemDialog");

                    if (closeButton) {
                        closeButton.addEventListener("click", () => {
                            document.body.removeChild(dialog);
                        });
                    }
                };

                showItemAcquiredDialog();
            }
        }
    };

    const renderEmailList = () => {
        return (
            <div
                className={`${isEmailListCollapsed ? "w-16" : "w-full"} transition-all duration-300 overflow-hidden`}>
                {!isEmailListCollapsed ? <>
                    <div className="bg-gray-800 border-b border-gray-700 p-3">
                        <div className="flex items-center justify-between">
                            <h2 className="text-base font-semibold text-white">收件箱</h2>
                            <div className="flex space-x-2">
                                <button className="p-1.5 text-gray-400 hover:text-white transition-colors">
                                    <i className="fa-solid fa-sort text-sm"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div
                        className="flex-1 overflow-y-auto border-r border-gray-700 h-[calc(100vh-340px)]">
                        <div className="p-1 space-y-1">
                            {filteredEmails.length === 0 ? <div className="p-6 text-center text-gray-500">
                                <i className="fa-solid fa-envelope-open text-2xl mb-2"></i>
                                <p>没有找到匹配的邮件</p>
                            </div> : filteredEmails.map(email => <div
                                key={email.id}
                                className={`p-2.5 rounded-lg cursor-pointer transition-all ${selectedEmail?.id === email.id ? "bg-blue-900/30 border border-blue-500/50" : "bg-gray-900/70 border border-transparent hover:border-gray-700"}`}
                                onClick={() => handleSelectEmail(email)}>
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center">
                                        {email.isUnread && <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>}
                                        {email.isImportant && <i className="fa-solid fa-exclamation-circle text-yellow-500 mr-2 text-xs"></i>}
                                        <p
                                            className={`font-medium ${email.isUnread ? "text-white" : "text-gray-300"}`}>
                                            {email.sender}
                                        </p>
                                    </div>
                                    <p className="text-gray-500 text-xs whitespace-nowrap">{email.date}</p>
                                </div>
                                <div className="flex justify-between items-center mt-1">
                                    <p
                                        className={`${email.isUnread ? "text-white" : "text-gray-300"} line-clamp-1 flex-1 pr-2`}>
                                        {email.subject}
                                    </p>
                                    {email.hasAttachment && <i className="fa-solid fa-paperclip text-blue-400 text-xs flex-shrink-0"></i>}
                                </div>
                                <p className="text-gray-400 text-xs line-clamp-2 mt-0.5">
                                    {email.content.substring(0, 80)}...
                                                                    </p>
                            </div>)}
                        </div>
                    </div>
                </> : <div
                    className="h-full flex flex-col items-center justify-center p-2 border-r border-gray-700">
                    <div className="text-center">
                        <i className="fa-solid fa-envelope text-gray-600 text-sm"></i>
                    </div>
                </div>}
            </div>
        );
    };

    const renderEmailDetail = () => {
        if (!selectedEmail) {
            return (
                <div
                    className="flex-1 flex flex-col items-center justify-center p-4 bg-gray-900/30">
                    <div
                        className="w-20 h-20 rounded-full bg-gray-800 flex items-center justify-center mb-4">
                        <i className="fa-solid fa-envelope text-gray-600 text-3xl"></i>
                    </div>
                    <p className="text-gray-500 text-lg">请选择一封邮件查看详情</p>
                    <p className="text-gray-400 text-sm mt-2">点击左侧邮件列表中的邮件开始阅读</p>
                </div>
            );
        }

        return (
            <div className="flex-1 flex flex-col overflow-hidden">
                <div className="p-4 border-b border-gray-700 bg-gray-900/70">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center">
                            <button
                                onClick={handleBackToList}
                                className="mr-3 text-gray-400 hover:text-white transition-colors"
                                title="返回邮件列表">
                                <i className="fa-solid fa-arrow-left"></i>
                            </button>
                            <h3 className="text-lg font-bold text-white">{selectedEmail.subject}</h3>
                        </div>
                        <div className="flex items-center space-x-3">
                            <span className="text-gray-500 text-sm whitespace-nowrap">{selectedEmail.date}</span>
                        </div>
                    </div>
                    <div className="mt-3 p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
                        <div className="flex items-center mb-2">
                            <div
                                className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center mr-3">
                                <span className="text-white font-medium">{selectedEmail.sender.charAt(0)}</span>
                            </div>
                            <div>
                                <div className="flex items-center">
                                    <p className="text-white font-medium">{selectedEmail.sender}</p>
                                    {selectedEmail.isImportant && <i className="fa-solid fa-exclamation-circle text-yellow-500 ml-2 text-xs"></i>}
                                </div>
                                <p className="text-gray-500 text-sm">发送于 {selectedEmail.date}</p>
                            </div>
                        </div>
                        {selectedEmail.hasAttachment && <button
                            onClick={() => {
                                if (selectedEmail.subject === "员工救助基金申请指南") {
                                    setShowFundApplyDialog(true);
                                } else {
                                    handleAttachmentClick(selectedEmail);
                                }
                            }}
                            className={`mt-3 p-2 ${selectedEmail.subject === "员工救助基金申请指南" ? "bg-blue-900/30 border border-blue-500" : "bg-green-900/30 border border-green-500"} hover:bg-blue-900/40 rounded-md flex items-center transition-colors cursor-pointer`}>
                            <i className="fa-solid fa-paperclip text-blue-400 mr-2"></i>
                            <span className="text-blue-400 text-sm">
                                {selectedEmail.attachmentContent || `附件 ${selectedEmail.attachmentType ? `(${selectedEmail.attachmentType.toUpperCase()})` : ""}`}
                            </span>
                            <span className="ml-auto text-xs text-gray-500">
                                {selectedEmail.subject === "员工救助基金申请指南" ? "点击申请" : "点击查看"}
                            </span>
                        </button>}
                    </div>
                </div>
                <div
                    className="flex-1 p-6 overflow-y-auto bg-gray-900/30 email-content-scrollable"
                    style={{
                        minHeight: "400px",
                        maxHeight: "calc(100vh - 320px)",
                        overflowY: "auto",
                        scrollbarWidth: "thin",
                        scrollbarColor: "rgba(59, 130, 246, 0.5) rgba(0, 0, 0, 0.4)"
                    }}>
                    <div className="max-w-2xl mx-auto">
                        <div
                            className="text-gray-300 font-sans leading-relaxed text-base whitespace-pre-line">
                            {selectedEmail.content.split("\n").map((line, index) => {
                                if (line.startsWith("<em>") && line.endsWith("</em>")) {
                                    const italicText = line.substring(4, line.length - 5);

                                    return (
                                        <div key={index} className="mb-2 italic">
                                            {italicText}
                                        </div>
                                    );
                                }

                                return <div key={index} className="mb-2">{line}</div>;
                            })}
                        </div>
                    </div>
                </div>
                <div
                    className="p-4 border-t border-gray-700 bg-gray-900/70 flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        {}
                        {selectedEmail.subject === "员工救助基金申请指南" && <button
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded transition-colors flex items-center justify-center whitespace-nowrap"
                            onClick={() => setShowFundApplyDialog(true)}>
                            <i className="fa-solid fa-file-circle-plus mr-1.5"></i>立即申请
                                                    </button>}
                    </div>
                    <div className="flex items-center space-x-1 bg-gray-800/80 rounded-lg p-1">
                        <button
                            className="p-2 text-gray-400 hover:text-white transition-colors focus:outline-none focus:ring-1 focus:ring-blue-500 rounded"
                            title="回复">
                            <i className="fa-solid fa-reply"></i>
                        </button>
                        <button
                            className="p-2 text-gray-400 hover:text-white transition-colors focus:outline-none focus:ring-1 focus:ring-blue-500 rounded"
                            title="回复全部">
                            <i className="fa-solid fa-reply-all"></i>
                        </button>
                        <button
                            className="p-2 text-gray-400 hover:text-white transition-colors focus:outline-none focus:ring-1 focus:ring-blue-500 rounded"
                            title="转发">
                            <i className="fa-solid fa-forward"></i>
                        </button>
                        <button
                            className="p-2 text-gray-400 hover:text-white transition-colors focus:outline-none focus:ring-1 focus:ring-blue-500 rounded"
                            title="删除">
                            <i className="fa-solid fa-trash"></i>
                        </button>
                        <button
                            className="p-2 text-gray-400 hover:text-white transition-colors focus:outline-none focus:ring-1 focus:ring-blue-500 rounded"
                            title="标星">
                            <i className="fa-solid fa-star"></i>
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="relative min-h-[calc(100vh-200px)] h-[calc(100vh-200px)]">
            <div
                className="grid grid-cols-12 min-h-[calc(100vh-120px)] h-[calc(100vh-120px)] border border-gray-700 rounded-lg overflow-hidden">
                <div
                    className="col-span-12 md:col-span-4 lg:col-span-3 xl:col-span-3 relative">
                    <button
                        onClick={() => setIsEmailListCollapsed(!isEmailListCollapsed)}
                        className="absolute top-2 right-2 p-1.5 bg-gray-800 text-gray-400 rounded-lg z-10 hover:bg-gray-700 transition-colors"
                        title={isEmailListCollapsed ? "展开邮件列表" : "收起邮件列表"}>
                        <i
                            className={`fa-solid ${isEmailListCollapsed ? "fa-chevron-right" : "fa-chevron-left"}`}></i>
                    </button>
                    {renderEmailList()}
                </div>
                <div
                    className="col-span-12 md:col-span-8 lg:col-span-9 xl:col-span-9 relative">
                    {renderEmailDetail()}
                </div>
            </div>
            {}
            {showFundApplyDialog && <div
                className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
                <div
                    className="bg-gray-900 rounded-lg border border-blue-500 p-5 max-w-md w-full mx-4">
                    <h3 className="text-lg font-bold text-blue-400 mb-3">员工救助基金申请</h3>
                    <div className="space-y-3 mb-4">
                        <div>
                            <label className="block text-gray-400 mb-1">部门经理ID</label>
                            <input
                                type="text"
                                className="w-full p-2.5 bg-black border border-gray-700 rounded text-green-400"
                                placeholder="请输入部门经理ID"
                                value={fundApplicationForm.departmentManagerId}
                                onChange={e => setFundApplicationForm({
                                    ...fundApplicationForm,
                                    departmentManagerId: e.target.value
                                })} />
                        </div>
                        <div>
                             <label className="block text-gray-400 mb-1">部门经理密码<span className="text-transparent">我的座右铭</span></label>
                            <input
                                type="password"
                                className="w-full p-2.5 bg-black border border-gray-700 rounded text-green-400"
                                placeholder="请输入部门经理密码"
                                value={fundApplicationForm.departmentManagerPassword}
                                onChange={e => setFundApplicationForm({
                                    ...fundApplicationForm,
                                    departmentManagerPassword: e.target.value
                                })} />
                            <p className="text-gray-400">仅支持输入小写字母</p>
                        </div>
                        <div>
                            <label className="block text-gray-400 mb-1">申请人工号</label>
                            <input
                                type="text"
                                className="w-full p-2.5 bg-gray-800 border border-gray-600 rounded text-gray-300"
                                placeholder="wsl7523"
                                value={fundApplicationForm.applicantId}
                                readOnly
                                defaultValue="wsl7523" />
                        </div>
                        <div>
                            <label className="block text-gray-400 mb-1">申请原因</label>
                            <textarea
                                className="w-full p-2.5 bg-gray-800 border border-gray-600 rounded text-gray-300 h-20"
                                placeholder="儿子生病住院，急需手术费"
                                value={fundApplicationForm.reason}
                                readOnly
                                defaultValue="儿子生病住院，急需手术费"></textarea>
                        </div>
                    </div>
                    <button
                        className="w-full p-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded transition-colors"
                        onClick={handleFundApplication}>提交申请
                                            </button>
                    <button
                        className="w-full mt-2 p-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
                        onClick={() => setShowFundApplyDialog(false)}>取消
                                            </button>
                </div>
            </div>}
        </div>
    );
}