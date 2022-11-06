

import cloud from '@/cloud-sdk'

exports.main = async function (ctx: FunctionContext) {
  // body, query 为请求参数, auth 是授权对象
  var { auth, body, query } = ctx

  // 数据库操作
  const db = cloud.database()
    if (body.deploy_test === true) {
    // 进行部署检查
    return;
    }
  // console.log(ctx);

  var openid = auth?.openid;
  if (openid == undefined) {
    console.log("undefined user, code", body.wx_code);
    openid = (await cloud.invoke("login", { body: {code: body.wx_code} })).openid;
  }

  if (!openid) {
    return {};
  }
  
  // 获取当前操作是干啥子的
  const op = body.op;
  switch(op) {
    case 'get': {
      // 获取用户，如果没有就新建一个
      const user = (await db.collection('user').where({ 'openid': openid }).get()).data[0];
      if (user) {
        return user;
      }
      await db.collection('user').add({ 'openid': openid });
      return (await db.collection('user').where({ 'openid': openid }).get()).data[0];
    }
    case 'update': {
      const targetUser = (await db.collection('user').where({ 'openid': openid }).get()).data[0];
      if (targetUser.openid != openid) {
        return "Err, can only update your own info.";
      }
      var user = body.user;
      const _id = user._id;
      delete user._id; // 因为数据库不能更新_id
      delete user.openid; // 这个键唯一
      await db.collection('user').doc(_id).update( user );
      return (await db.collection('user').where({ 'openid': openid }).get()).data[0];
    }
    case 'updateRole': {
      var user = body.user;
      await db.collection('user').where({ 'openid': openid }).update( user );
    }
    default: {
      return "unknown op: " + op;
    }
  }
}

