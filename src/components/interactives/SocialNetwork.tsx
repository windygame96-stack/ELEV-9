import { useState } from "react";

interface SocialNetworkProps {
  onClose: () => void;
}

// 用户数据接口
interface UserProfile {
  id: string;
  name: string;
  nickname: string;
  avatar: string;
  department: string;
  position: string;
  bio: string;
  posts: Post[];
}

// 帖子数据接口
interface Post {
  id: string;
  content: string;
  date: string;
  likes: number;
  comments: number;
  isPinned?: boolean;
  type: "education" | "career" | "personal" | "promotion";
}

// 模拟用户数据
const users: UserProfile[] = [
   {
    id: "zsj2560",
    name: "张三金",
    nickname: "财务经理",
    avatar: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Manager%20middle-aged%20man%20smart%20professional%20business%20suit&sign=7af039b56ac26eb97fe8bb358a1ec770",
    department: "财务部",
    position: "财务经理",
    bio: "负责公司财务管理工作，多年财务经验。座右铭：天道酬勤",
    posts: [
      {
        id: "z1",
        content: "今天完成了季度财务报表，一切正常！",
        date: "2026-02-10",
        likes: 15,
        comments: 3,
        type: "career"
      },
      {
        id: "z2",
        content: "周末去爬山了，风景不错！",
        date: "2026-02-05",
        likes: 8,
        comments: 2,
        type: "personal"
      }
    ]
  },
  {
    id: "wang_shulan",
    name: "王淑兰",
    nickname: "王阿姨",
    avatar: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Elderly%20woman%20smiling%20kind%20cleaner%20uniform&sign=a5248cc3b0272af57450f5dc2f507441",
    department: "后勤部",
    position: "清洁工",
    bio: "负责公司清洁工作，喜欢帮助他人",
    posts: [
      {
        id: "w1",
        content: "今天把办公室打扫得干干净净，大家工作也会更舒服吧！",
        date: "2026-02-11",
        likes: 20,
        comments: 5,
        type: "career"
      },
      {
        id: "w2",
        content: "谢谢大家对我的关心，儿子的手术很成功！",
        date: "2026-02-08",
        likes: 25,
        comments: 8,
        type: "personal"
      }
    ]
  },
  {
    id: "li_xiaoming",
    name: "李小明",
    nickname: "小明",
    avatar: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Delivery%20boy%20young%20man%20smiling%20uniform&sign=24389f1682acc4b04757c22037f56f04",
    department: "物流部",
    position: "快递员",
    bio: "负责公司快递收发，喜欢运动和科技",
    posts: [
      {
        id: "l1",
        content: "今天送了好多快递，腿都酸了，不过很充实！",
        date: "2026-02-09",
        likes: 12,
        comments: 3,
        type: "career"
      },
      {
        id: "l2",
        content: "新买的运动鞋到了，明天去跑步！",
        date: "2026-02-04",
        likes: 6,
        comments: 1,
        type: "personal"
      }
    ]
  },
   {
    id: "liu_mingshu",
    name: "刘铭书",
    nickname: "技术总监",
    avatar: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=AI%20scientist%20middle-aged%20man%20smart%20glasses%20laboratory&sign=8002452123e2dcb8e091972ca13c02be",
    department: "研发部",
    position: "技术总监",
    bio: "陈博士的直属助手，负责核心技术研发，AI领域专家",
    posts: [
      {
        id: "lm1",
        content: "今日晋升为技术总监！感谢陈博士和团队的信任，我将继续努力带领团队创造更多创新成果！",
        date: "2025-10-15",
        likes: 56,
        comments: 23,
        isPinned: true,
        type: "promotion"
      },
      {
        id: "lm2",
        content: "清华大学计算机系博士毕业，开始新的征程！",
        date: "2015-07-01",
        likes: 42,
        comments: 18,
        type: "education"
      },
      {
        id: "lm3",
        content: "加入未来科技集团，成为陈博士的助手，开始AI技术研发之旅",
        date: "2018-03-12",
        likes: 35,
        comments: 12,
        type: "career"
      },
      {
        id: "lm4",
        content: "与陈博士共同研发的创新AI技术获得国际人工智能大会金奖！这是团队共同努力的结果！",
        date: "2023-05-15",
        likes: 128,
        comments: 46,
        type: "career"
      }
    ]
  }
];

export default function SocialNetwork({ onClose }: SocialNetworkProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [showHomepage, setShowHomepage] = useState(true);

  // 处理搜索
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    
    const results = users.filter(user => 
      user.name.includes(searchQuery) || 
      user.nickname.includes(searchQuery)
    );
    
    setSearchResults(results);
    setSelectedUser(null);
    setShowHomepage(false);
  };

  // 查看用户主页
  const viewUserProfile = (user: UserProfile) => {
    setSelectedUser(user);
    setShowHomepage(false);
  };

  // 返回搜索结果
  const backToSearchResults = () => {
    setSelectedUser(null);
    setShowHomepage(false);
  };

  // 返回首页
  const backToHomepage = () => {
    setSearchQuery("");
    setSearchResults([]);
    setSelectedUser(null);
    setShowHomepage(true);
  };

  // 获取帖子类型图标
  const getPostTypeIcon = (type: string) => {
    switch (type) {
      case "education":
        return "fa-graduation-cap text-blue-500";
      case "career":
        return "fa-briefcase text-green-500";
      case "personal":
        return "fa-heart text-red-500";
      case "promotion":
        return "fa-arrow-trend-up text-purple-500";
      default:
        return "fa-file text-gray-500";
    }
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/80 p-4 overflow-y-auto">
      <div className="bg-gray-900 rounded-lg border-2 border-blue-500 w-full max-w-6xl max-h-[90vh] flex flex-col">
        {/* 顶部导航栏 */}
        <div className="bg-gradient-to-r from-blue-800 to-indigo-900 text-white p-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mr-3">
              <i className="fa-solid fa-user-group text-blue-800 text-xl"></i>
            </div>
            <h1 className="text-xl font-bold">天天网</h1>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-white hover:bg-blue-600 rounded-full transition-colors"
            aria-label="关闭"
          >
            <i className="fa-solid fa-times"></i>
          </button>
        </div>
        
        {/* 搜索栏 */}
        <div className="bg-gray-800 border-b border-gray-700 p-4">
          <form onSubmit={handleSearch} className="flex max-w-2xl mx-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索同事（张三金、王淑兰、李小明、刘铭书）"
              className="flex-1 p-2.5 bg-gray-900 border border-gray-700 rounded-l-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-r-lg transition-colors"
            >
              <i className="fa-solid fa-search mr-1"></i> 搜索
            </button>
          </form>
        </div>
        
        {/* 主要内容区域 */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* 首页内容 */}
          {showHomepage && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-white mb-2">欢迎来到天天网</h2>
                <p className="text-gray-400">连接同事，分享生活</p>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-xl font-bold text-white mb-4 text-center">热门人物</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {users.map(user => (
                    <div 
                      key={user.id}
                      className="bg-gray-900 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-800 transition-colors"
                      onClick={() => viewUserProfile(user)}
                    >
                      <div className="w-20 h-20 mx-auto mb-3 rounded-full overflow-hidden border-2 border-blue-500">
                        <img 
                          src={user.avatar} 
                          alt={user.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h4 className="font-bold text-white">{user.name}</h4>
                      <p className="text-gray-400 text-sm">{user.nickname}</p>
                      <p className="text-gray-500 text-xs mt-1">{user.department} · {user.position}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {/* 搜索结果 */}
          {!showHomepage && !selectedUser && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">搜索结果</h2>
                <button 
                  onClick={backToHomepage}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm"
                >
                  <i className="fa-solid fa-arrow-left mr-1"></i> 返回首页
                </button>
              </div>
              
              {searchResults.length > 0 ? (
                <div className="space-y-3">
                  {searchResults.map(user => (
                    <div 
                      key={user.id}
                      className="bg-gray-800 rounded-lg p-4 flex items-center cursor-pointer hover:bg-gray-700 transition-colors"
                      onClick={() => viewUserProfile(user)}
                    >
                      <div className="w-14 h-14 rounded-full overflow-hidden mr-4 border-2 border-blue-500">
                        <img 
                          src={user.avatar} 
                          alt={user.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center">
                          <h3 className="font-bold text-white mr-2">{user.name}</h3>
                          {user.nickname && (
                            <span className="text-sm text-gray-400">({user.nickname})</span>
                          )}
                        </div>
                        <p className="text-gray-500 text-sm">{user.department} · {user.position}</p>
                      </div>
                      <button className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded transition-colors text-sm">
                        查看主页
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-800 rounded-lg p-8 text-center">
                  <i className="fa-solid fa-user-slash text-4xl text-gray-600 mb-3"></i>
                  <p className="text-gray-400">未找到相关用户</p>
                  <p className="text-gray-500 text-sm mt-2">请尝试其他关键词</p>
                </div>
              )}
            </div>
          )}
          
          {/* 用户主页 */}
          {selectedUser && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between">
                <button 
                  onClick={backToSearchResults}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm mb-2 md:mb-0"
                >
                  <i className="fa-solid fa-arrow-left mr-1"></i> 返回搜索结果
                </button>
                <div className="flex space-x-2">
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors text-sm">
                    <i className="fa-solid fa-user-plus mr-1"></i> 加好友
                  </button>
                  <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm">
                    <i className="fa-solid fa-envelope mr-1"></i> 发消息
                  </button>
                </div>
              </div>
              
              {/* 用户信息 */}
              <div className="bg-gradient-to-r from-blue-900/50 to-indigo-900/50 rounded-lg p-6 border border-blue-800/50">
                <div className="flex flex-col md:flex-row items-center md:items-start">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white mb-4 md:mb-0 md:mr-6">
                    <img 
                      src={selectedUser.avatar} 
                      alt={selectedUser.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-center md:text-left">
                    <h2 className="text-2xl font-bold text-white mb-1">{selectedUser.name}</h2>
                    {selectedUser.nickname && (
                      <p className="text-lg text-blue-400 mb-2">{selectedUser.nickname}</p>
                    )}
                    <p className="text-gray-300 mb-1">{selectedUser.department} · {selectedUser.position}</p>
                    <p className="text-gray-400">{selectedUser.bio}</p>
                  </div>
                </div>
              </div>
              
              {/* 帖子列表 */}
              <div>
                <h3 className="text-xl font-bold text-white mb-4">个人动态</h3>
                <div className="space-y-4">
                  {selectedUser.posts
                    .sort((a, b) => {
                      // 置顶的帖子排在最前面
                      if (a.isPinned && !b.isPinned) return -1;
                      if (!a.isPinned && b.isPinned) return 1;
                      // 其他按日期降序排列
                      return new Date(b.date).getTime() - new Date(a.date).getTime();
                    })
                    .map(post => (
                      <div 
                        key={post.id}
                        className={`bg-gray-800 rounded-lg p-4 border-l-4 ${
                          post.isPinned ? 'border-yellow-500' : 'border-gray-700'
                        }`}
                      >
                        {post.isPinned && (
                          <div className="flex items-center mb-2">
                            <span className="inline-block px-2 py-0.5 bg-yellow-900 text-yellow-300 text-xs rounded mr-2">置顶</span>
                            <i className={`fa-solid ${getPostTypeIcon(post.type)}`}></i>
                          </div>
                        )}
                        <p className="text-white mb-3">{post.content}</p>
                        <div className="flex justify-between items-center">
                          <p className="text-gray-500 text-sm">{post.date}</p>
                          <div className="flex space-x-4">
                            <button className="text-gray-400 hover:text-blue-400 flex items-center transition-colors">
                              <i className="fa-solid fa-thumbs-up mr-1"></i> {post.likes}
                            </button>
                            <button className="text-gray-400 hover:text-blue-400 flex items-center transition-colors">
                              <i className="fa-solid fa-comment mr-1"></i> {post.comments}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* 页脚 */}
        <div className="bg-gray-800 border-t border-gray-700 p-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-2 md:mb-0">
              <p className="text-sm text-gray-500">© 2026 天天网. 保留所有权利.</p>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-500 hover:text-white transition-colors">
                <i className="fa-solid fa-circle-info"></i>
              </a>
              <a href="#" className="text-gray-500 hover:text-white transition-colors">
                <i className="fa-solid fa-gear"></i>
              </a>
              <a href="#" className="text-gray-500 hover:text-white transition-colors">
                <i className="fa-solid fa-question-circle"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}