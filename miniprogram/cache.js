// 缓存相关

function getCacheItem(key, options) {
  options = options || {};
  if (options.nocache) {
    console.log("nocache=true")
    return undefined;
  }

  var data = wx.getStorageSync(key);
  if (!data) {
    return undefined;
  }

  // 过期了
  if (new Date() > new Date(data.expire_date)) {
    console.log(`${key} expired.`);
    return undefined;
  }

  return data.item;
}

function setCacheItem(key, item, expire_hours, expire_minutes) {
  var expire_date = new Date();
  expire_date.setHours(expire_date.getHours() + expire_hours);
  expire_date.setMinutes(expire_date.getMinutes() + (expire_minutes || 0));
  var data = {
    item: item,
    expire_date: expire_date
  };

  wx.setStorageSync(key, data);
}

function getCacheDate(key) {
  var date = wx.getStorageSync(key);
  if (!date) {
    return undefined;
  }
  return new Date(date);
}

function setCacheDate(key, date) {
  if (!date) {
    date = new Date();
  }
  wx.setStorageSync(key, date);
}

// 缓存时长设置（单位默认为hours）
const cacheTime = {
  catAvatar: 6,  // 首页封面图
  catItem: 6,  // 猫猫信息
  commentCount: 2,  // 留言数量
  likeItem: 72,  // 点赞行为
  pageSetting: 1,  // 页面设置
  genealogyFCampus: 1,  // 首页校区过滤选项
  checkPhotoCampus: 24*7*31,  // 最后一次审核照片的校区
}

module.exports = {
  getCacheDate,
  setCacheDate,
  getCacheItem,
  setCacheItem,
  cacheTime
}