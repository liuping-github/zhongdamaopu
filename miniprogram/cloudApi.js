// 存放所有需要调用云函数的接口

import { cloud } from "./cloudAccess";

function getDate(date) {
  date = date ? new Date(date): new Date();
  return {
    "$date": new Date()
  }
}

async function curdOp(options) {
  return await cloud.callFunction({
    name: "curdOp",
    data: options
  });
}

async function userOp(options) {
  return await cloud.callFunction({
    name: "userOp",
    data: options
  });
}

async function sendMsgV2(options) {
  return await cloud.callFunction({
    name: "sendMsgV2",
    data: options
  });
}

async function getMpCode(options) {
  return await cloud.callFunction({
    name: "getMpCode",
    data: options
  });
}

async function managePhoto(options) {
  return await cloud.callFunction({
    name: "managePhoto",
    data: options
  });
}

async function globalLock(options) {
  return await cloud.callFunction({
    name: "globalLock",
    data: options
  });
}

async function getAllSci(options) {
  return await cloud.callFunction({
    name: "getAllSci",
    data: options
  });
}

async function updateCat(options) {
  return await cloud.callFunction({
    name: "updateCat",
    data: options
  });
}

// 内容安全检查
async function contentSafeCheck(content, nickName) {
  const label_type = {
    100: "正常",
    10001: "广告",
    20001: "时政",
    20002: "色情",
    20003: "辱骂",
    20006: "违法犯罪",
    20008: "欺诈",
    20012: "低俗",
    20013: "版权",
    21000: "其他",
  }
  // 违规检测并提交
  var res = (await cloud.callFunction({
    name: 'commentCheck',
    data: {
      content: content,
      nickname: nickName,
    },
  })).result;
  // 检测接口的返回
  console.log("contentSafeCheck", res);
  if (res.errCode != 0 && res.errcode != 0) {
    const label_code = res.result.label;
    const label = label_type[label_code];
    return {
      title: "内容检测未通过",
      content: `涉及[${label_code}]${label}内容，请修改嗷~~`,
      showCancel: false,
    };
  }
  return;
}

module.exports = {
  curdOp,
  userOp,
  sendMsgV2,
  getMpCode,
  managePhoto,
  globalLock,
  getAllSci,
  contentSafeCheck,
  updateCat,
  getDate
};
