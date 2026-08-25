import { useState, useEffect } from "react";

interface CompanyWebsiteProps {
    onClose: () => void;
}

export default function CompanyWebsite(
    {
        onClose
    }: CompanyWebsiteProps
) {
    const [activeTab, setActiveTab] = useState("home");
    const [currentYear, setCurrentYear] = useState(2026);

    const companyIntro = [
        "未来科技集团成立于2020年，是一家专注于人工智能与物联网技术研发的创新型科技企业。",
        "我们的使命是通过前沿科技改变人类生活，构建智能、高效、安全的未来城市生态系统。",
        "目前，我们的业务涵盖智能楼宇管理、人工智能助手、物联网设备研发等多个领域，服务全球超过1000家企业客户。",
        "未来科技集团拥有一支由顶尖科学家、工程师组成的研发团队，其中包括人工智能领域权威陈博士领衔的核心技术团队。"
    ];

    const teamMembers = [{
        name: "陈博士",
        position: "创始人兼首席科学家",
        bio: "人工智能领域权威专家，曾在麻省理工学院担任研究员，拥有20年AI研发经验。",
        image: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=AI%20scientist%20middle-aged%20man%20glasses%20professional%20laboratory%20background&sign=e69384cd30ff8b51028a8f16f6134995"
    }, {
        name: "刘铭书",
        position: "技术总监",
        bio: "陈博士的直属助手，负责核心技术研发，毕业于清华大学计算机系，AI领域专家。",
        image: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=AI%20engineer%20middle-aged%20man%20professional%20smart%20laboratory%20background&sign=0797886c51d44fcafc440b6c97c2bfbf"
    }, {
        name: "张伟",
        position: "产品总监",
        bio: "负责产品战略规划与设计，拥有丰富的智能硬件产品经验。",
        image: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Product%20manager%20young%20man%20professional%20smart%20business%20background&sign=102e323997c0fb10f62c62497bf85d98"
    }, {
        name: "李婷",
        position: "市场总监",
        bio: "负责公司市场战略与品牌建设，曾服务于多家知名科技企业。",
        image: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Marketing%20director%20young%20woman%20professional%20smart%20business%20background&sign=3a54085be7b71ac6e0d2ab0eb2dc0842"
    }];

    useEffect(() => {
        const counters = document.querySelectorAll(".counter");

        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute("data-target") || "0");
            let count = 0;
            const increment = target / 30;

            const updateCount = () => {
                if (count < target) {
                    count += increment;
                    counter.textContent = Math.ceil(count).toString();
                    setTimeout(updateCount, 30);
                } else {
                    counter.textContent = target.toString();
                }
            };

            updateCount();
        });
    }, [currentYear]);

    return (
        <div
            className="absolute inset-0 flex items-center justify-center bg-black/80 p-4 overflow-y-auto">
            <div
                className="bg-white rounded-lg shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col">
                <div
                    className="bg-gradient-to-r from-blue-900 to-blue-700 text-white p-4 flex justify-between items-center">
                    <div className="flex items-center">
                        <div
                            className="w-10 h-10 rounded-full bg-white flex items-center justify-center mr-3">
                            <i className="fa-solid fa-microchip text-blue-800 text-xl"></i>
                        </div>
                        <h1 className="text-xl font-bold">未来科技集团</h1>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-white hover:bg-blue-600 rounded-full transition-colors"
                        aria-label="关闭">
                        <i className="fa-solid fa-times"></i>
                    </button>
                </div>
                <div className="bg-gray-100 border-b border-gray-200">
                    <div className="flex overflow-x-auto">
                        <button
                            className={`px-6 py-3 text-sm font-medium transition-colors ${activeTab === "home" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600 hover:text-blue-600"}`}
                            onClick={() => setActiveTab("home")}>首页
                                                    </button>
                        <button
                            className={`px-6 py-3 text-sm font-medium transition-colors ${activeTab === "team" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600 hover:text-blue-600"}`}
                            onClick={() => setActiveTab("team")}>核心团队
                                                    </button>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                    {activeTab === "home" && <div className="space-y-8">
                        <div className="relative rounded-xl overflow-hidden">
                            <div
                                className="absolute inset-0 bg-gradient-to-r from-blue-900 to-blue-700 opacity-90"></div>
                            <img
                                src="https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Future%20technology%20building%20modern%20architecture%20smart%20city%20concept&sign=cc26917a24e87794bc46a7a28b46986d"
                                alt="未来科技集团总部"
                                className="w-full h-64 object-cover" />
                            <div
                                className="absolute inset-0 flex flex-col justify-center items-center text-white p-6 text-center">
                                <h2 className="text-3xl font-bold mb-3">构建智能未来</h2>
                                <p className="text-xl mb-6">引领人工智能与物联网技术创新</p>
                                <button
                                    className="px-6 py-3 bg-white text-blue-800 font-medium rounded-full hover:bg-blue-50 transition-colors">了解更多
                                                                    </button>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div
                                className="bg-blue-50 rounded-lg p-6 text-center transform transition-transform hover:scale-105">
                                <div className="text-4xl font-bold text-blue-600 mb-2">
                                    <span className="counter" data-target="10">0</span>+
                                                                    </div>
                                <p className="text-gray-600">国家发明专利</p>
                            </div>
                            <div
                                className="bg-blue-50 rounded-lg p-6 text-center transform transition-transform hover:scale-105">
                                <div className="text-4xl font-bold text-blue-600 mb-2">
                                    <span className="counter" data-target="50">0</span>+
                                                                    </div>
                                <p className="text-gray-600">全球合作伙伴</p>
                            </div>
                            <div
                                className="bg-blue-50 rounded-lg p-6 text-center transform transition-transform hover:scale-105">
                                <div className="text-4xl font-bold text-blue-600 mb-2">
                                    <span className="counter" data-target="200">0</span>+
                                                                    </div>
                                <p className="text-gray-600">专业技术人员</p>
                            </div>
                        </div>
                     
                     {/* 重大事件栏位 */}
                     <div className="mt-12">
                       <h2 className="text-2xl font-bold text-gray-800 mb-6">重大事件</h2>
                       <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 transform hover:shadow-xl transition-all duration-300">
                         <div className="md:flex">
                           <div className="md:w-1/3">
                             <img
                               src="https://space.coze.cn/api/coze_space/gen_image?image_size=portrait_4_3&prompt=Scientist%20holding%20gold%20trophy%20international%20AI%20conference%20happy%20smile&sign=5ca4af898a6bfc4ca48382f730b62f89"
                               alt="陈博士获得国际人工智能大会金奖"
                               className="h-48 md:h-full w-full object-cover"
                             />
                           </div>
                           <div className="p-6 md:w-2/3">
                             <div className="flex items-center text-blue-600 font-medium mb-2">
                               <i className="fa-solid fa-calendar-alt mr-2"></i>
                               <span>2023年10月15日</span>
                             </div>
                             <h3 className="text-xl font-bold text-gray-800 mb-3">陈博士带领团队获得国际人工智能大会金奖</h3>
                             <p className="text-gray-600 mb-4">
                               未来科技集团创始人兼首席科学家陈博士带领核心技术团队在国际人工智能大会上凭借创新性的"世界模型"AI技术获得金奖。这一技术突破标志着公司在人工智能领域的领先地位，为未来智能城市建设奠定了坚实基础。
                             </p>
                             <div className="flex items-center text-sm text-gray-500">
                               <i className="fa-solid fa-user mr-2"></i>
                               <span>集团新闻中心</span>
                             </div>
                           </div>
                         </div>
                       </div>
                     </div>
                    </div>}
                    {activeTab === "team" && <div className="space-y-8">
                        <h2 className="text-2xl font-bold text-gray-800">核心团队</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {teamMembers.map((member, index) => <div
                                key={index}
                                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
                                <div className="relative h-64 overflow-hidden">
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className="w-full h-full object-cover" />
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-bold mb-1 text-gray-800">{member.name}</h3>
                                    <p className="text-blue-600 mb-3">{member.position}</p>
                                    {}
                                    {member.name === "刘铭书" && <></>}
                                    <p className="text-gray-600 text-sm">{member.bio}</p>
                                </div>
                            </div>)}
                        </div>
                    </div>}
                </div>
                <div className="bg-gray-100 border-t border-gray-200 p-4">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="mb-4 md:mb-0">
                            <p className="text-sm text-gray-600">© 2026 未来科技集团. 保留所有权利.</p>
                        </div>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                                <i className="fa-brands fa-facebook"></i>
                            </a>
                            <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                                <i className="fa-brands fa-twitter"></i>
                            </a>
                            <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                                <i className="fa-brands fa-linkedin"></i>
                            </a>
                            <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                                <i className="fa-brands fa-instagram"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}