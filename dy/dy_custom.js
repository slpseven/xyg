/* ======================================
 * 命中次数统计（挂在 this.log）
 * ====================================== */
function hitCount(log, group, key) {
    log.__HIT__ = log.__HIT__ || {};
    log.__HIT__[group] = log.__HIT__[group] || {};

    log.__HIT__[group][key] = (log.__HIT__[group][key] || 0) + 1;
    return log.__HIT__[group][key];
}

/* ===== 配置区 ===== */
const RULES = {
    force: {
        enable: true,
        name: "直播/广告",
    },

    videoTag: {
        enable: true,
        name: "视频标签",
        reg: "影视|二次元|汽车|科技|人文社科|时政社会|科普|游戏|财经|个人管理|综艺|明星八卦|美食|医疗健康|体育|萌宠|随拍|居家|剧情演绎|校园教育"
    },

    nickname: {
        enable: true,
        name: "作者昵称",
        reg: "小萝卜👑卡梅隆|栗子说漫|DOUBLE德博声学|微风追剧|港事港你知|大内护胃队|粤讲粤开心|医问到底|阿羽和猫猫们|鼓東家|荒野减速带|小新综艺|天天亿个小动漫|不善言辞陶叨叨|张老八呀|痞欠|就是酥梨!|DJ阿智|FM520|忆枫动漫|张小张YiFan|楠哥动画|砖二虎|李乃剧场|小小慕白|莉莉说漫|虾仁不吃虾|销冠老刘|工作几年就迷路|王雨桐（全网唯一|奋斗影视|小涵动漫屋|蜜桃雪梨八卦猪|鸽鸽追剧|熊太老师reaction|红红火火红太狼|爱看美剧的🌟钱万万的钱|汉咖|办公室啃大瓜|阿虎影视|Bingo的音乐废料场|歌手于航|娱乐世界|车欣欣|猫meme小小故事|军武知识局|李大刚|张小张YiFan|沙雕网友咸叽叽"
    },

    textExtra: {
        enable: true,
        name: "话题",
        reg: "抖音商场|抖音精选",
        blockIfEmpty: true
    }
};

/* ===== 数据准备 ===== */
const info = data?.transformAwemeInfo || {};

/* ======================================
 * 0️⃣ 强制过滤：直播 / 广告（已统计）
 * ====================================== */
if (RULES.force.enable) {
    if (info.isLive === true) {
        const count = hitCount(this.log, "force", "直播");
        this.log.info(
            "屏蔽【直播内容】",
            `isLive = true（已屏蔽 ${count} 次）`
        );
        return true;
    }

    if (info.isAds === true) {
        const count = hitCount(this.log, "force", "广告");
        this.log.info(
            "屏蔽【广告内容】",
            `isAds = true（已屏蔽 ${count} 次）`
        );
        return true;
    }
}

/* ======================================
 * 1️⃣ videoTag 过滤（含空值）
 * ====================================== */
if (RULES.videoTag.enable) {
    const videoTag = info.videoTag;

    if (!Array.isArray(videoTag) || videoTag.length === 0) {
        const count = hitCount(this.log, "videoTag", "EMPTY");
        this.log.info(
            `屏蔽【${RULES.videoTag.name}】`,
            `videoTag 为空（已屏蔽 ${count} 次）`
        );
        return true;
    }

    const reg = new RegExp(`(${RULES.videoTag.reg})`);
    for (const tag of videoTag) {
        if (typeof tag === "string" && reg.test(tag)) {
            const count = hitCount(this.log, "videoTag", tag);
            this.log.info(
                `屏蔽【${RULES.videoTag.name}】`,
                `${tag}（已屏蔽 ${count} 次）`
            );
            return true;
        }
    }
}

/* ======================================
 * 2️⃣ 作者 nickname 过滤
 * ====================================== */
if (RULES.nickname.enable) {
    const nickname = info.author?.nickname;

    if (typeof nickname === "string") {
        const reg = new RegExp(`(${RULES.nickname.reg})`);

        if (reg.test(nickname)) {
            const count = hitCount(this.log, "nickname", nickname);
            this.log.info(
                `屏蔽【${RULES.nickname.name}】`,
                `${nickname}（已屏蔽 ${count} 次）`
            );
            return true;
        }
    }
}

/* ======================================
 * 3️⃣ 话题 textExtra 过滤
 * ====================================== */
if (RULES.textExtra.enable) {
    const textExtra = info.textExtra;

    if (
        RULES.textExtra.blockIfEmpty &&
        (!Array.isArray(textExtra) || textExtra.length === 0)
    ) {
        const count = hitCount(this.log, "textExtra", "EMPTY");
        this.log.info(
            `屏蔽【${RULES.textExtra.name}】`,
            `textExtra 为空（已屏蔽 ${count} 次）`
        );
        return true;
    }

    if (Array.isArray(textExtra) && textExtra.length > 0) {
        const reg = new RegExp(`(${RULES.textExtra.reg})`);

        for (const item of textExtra) {
            const text = item?.text || item?.hashtag_name;
            if (typeof text !== "string") continue;

            if (reg.test(text)) {
                const count = hitCount(this.log, "textExtra", text);
                this.log.info(
                    `屏蔽【${RULES.textExtra.name}】`,
                    `${text}（已屏蔽 ${count} 次）`
                );
                return true;
            }
        }
    }
}

/* ===== 未命中任何规则 ===== */
return false;
