// getPhotoRank 本月图片排行榜

import cloud from '@/cloud-sdk';
const db = cloud.database();
const _ = db.command;
const MAX_LIMIT = 100;

exports.main = async function (ctx: FunctionContext) {
  // body, query 为请求参数, auth 是授权对象
  const { auth, body, query } = ctx

  // 只取这个月的
  const today = new Date(), y = today.getFullYear(), m = today.getMonth();
  const firstDay = new Date(y, m, 1);
  const qf = { mdate: _.gt(firstDay), verified: true };
  
  // 先取出集合记录总数
  const countResult = await db.collection('photo').where(qf).count();
  const total = countResult.total;
  console.log("count result", countResult);

  // 计算需分几次取
  const batchTimes = Math.ceil(total / 100);
  // 承载所有读操作的 promise 的数组
  const photos = []
  for (let i = 0; i < batchTimes; i++) {
    const promise = db.collection('photo').where(qf).skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
    photos.push(promise)
  }
  // 等待所有
  const all_promise = (await Promise.all(photos));
  if (!all_promise.length) {
    console.log("本月还没有照片，直接退出");
    return { all_photos: [], stat: {} };
  }

  // 否则就进行统计
  const all_photos = all_promise.reduce((acc, cur) => ({
    data: acc.data.concat(cur.data),
    errMsg: acc.errMsg,
  }));

  const stat = getStat(all_photos.data);
  await db.collection('photo_rank').add({ stat, mdate: today })
  return { all_photos: all_photos, stat: stat };
}

function getStat(all_photos) {
  var stat = {};
  for (const ph of all_photos) {
    const key = ph._openid;
    if (!key || !ph.userInfo) {
      // 系统直接写入的
      continue;
    }

    // 否则就计数
    if (stat[key] === undefined) {
      console.log(ph.userInfo);
      stat[key] = {
        userInfo: ph.userInfo,
        count: 1
      }
    } else {
      stat[key].count ++;
      if (ph.userInfo) {
        stat[key].userInfo = ph.userInfo;
      }
    }
  }
  return stat;
}

