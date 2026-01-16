/***********************
 * 抖音优化 - 自定义过滤函数
 * 规则类型：标签（videoTag）
 * 返回值：true = 屏蔽，false = 不屏蔽
 ***********************/

/* ===== 配置区：只维护这里 ===== */
const FILTER_RULES = {
    movie: {
        enable: true,
        name: "影视",
        block: "影视|影视解说|电影解说|影视剪辑|电影剪辑|电视解说|电视剧剪辑|电影|电视剧|综艺|混剪",
        allow: "音乐"
    },

    carton: {
        enable: true,
        name: "二次元",
        block: "二次元|二次元内容|动漫IP",
        allow: "动漫"
    },

    car: {
        enable: true,
        name: "汽车",
        block: "汽车|玩车|汽车随拍|赛车",
        allow: ""
    },

    news: {
        enable: true,
        name: "时政新闻",
        block: "时政社会|军事|武器装备|时政新闻|国际新闻|社会新闻|交通事故|外交|民生|财经|财经新闻|国际宏观经济|军事新闻",
        allow: ""
    },

    game: {
        enable: true,
        name: "游戏",
        block: "游戏|竞技游戏|休闲类|体育类|模拟养成|角色扮演|王者荣耀|巅峰赛",
        allow: ""
    },

    people: {
        enable: true,
        name: "人文社科",
        block: "人文社科|人文艺术|历史|人文综合|读书文学|历史|科普|冷知识|天文科普|个人管理|情感心理|人激情刚",
        allow: ""
    },

    popular: {
        enable: true,
        name: "科普",
        block: "科普|科学实验|科学探索|科学",
        allow: ""
    },

    sport: {
        enable:true,
        name: "体育",
        block: "体育|球类项目|乒乓球|篮球|足球|跑步|健身|樊振东|德甲|萨尔布吕肯|英超|CBA|NBA|解说|抖音精选",
        allow: ""
    },

    technology: {
        enable: true,
        name: "科技",
        block: "科技|行业资讯|互联网资讯电脑|显卡|DIY|diy",
        allow: ""
    },

    uid: {
        enable: true,
        name: "用户UID",
        block: "64434077728|2886694623255479|7563189818068190265|7571962718610342949|2977095914109566|7517949259888641082|1042780029724461|3780562232309539|99242229120",
        allow: ""
    }
};

/* ===== 逻辑区：一般不要改 ===== */
const tags = data.transformAwemeInfo.videoTag;

// videoTag 异常直接放行
if (!Array.isArray(tags) || tags.length === 0) {
    return false;
}

// 遍历所有规则分类
for (const key in FILTER_RULES) {
    const rule = FILTER_RULES[key];

    // 分类开关
    if (!rule.enable) continue;

    const blockReg = rule.block
        ? new RegExp(`(${rule.block})`)
        : null;

    const allowReg = rule.allow
        ? new RegExp(`(${rule.allow})`)
        : null;

    // 遍历该视频的所有标签
    for (const tag of tags) {
        if (typeof tag !== "string") continue;

        // 白名单优先（命中即跳过该分类）
        if (allowReg && allowReg.test(tag)) break;

        // 黑名单命中 → 屏蔽
        if (blockReg && blockReg.test(tag)) {
            // 如需调试，可打开下面这行
            this.log.info(`屏蔽【${rule.name}】`, tag);
            return true;
        }
    }
}

// 所有规则均未命中
return false;
