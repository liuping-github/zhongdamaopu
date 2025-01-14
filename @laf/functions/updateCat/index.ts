import cloud from '@/cloud-sdk'

exports.main = async function (ctx: FunctionContext) {
  // body, query 为请求参数, auth 是授权对象
  const { auth, body, query } = ctx

  if (body.deploy_test === true) {
    // 进行部署检查
    return;
  }

  const openid = auth.openid;

  const is_manager = await check_manager(2, openid);
  if (!is_manager) {
    return { msg: 'not a manager', result: false };
  }

  console.log(body);
  var cat = body.cat;
  const cat_id = body.cat_id;

  const db = cloud.database();
  if (cat_id) {
    // 是更新
    console.log("开始更新：" + cat_id);
    var cat_data = deepcopy(cat);
    return await db.collection('cat').doc(cat_id).update(cat_data);
  } else {
    // 是新猫
    console.log("开始添加新猫");
    const count = (await db.collection('cat').count()).total;

    var _no = 'c' + count;
    while (true) {
      var exist = (await db.collection('cat').where({_no: _no}).count()).total > 0;
      if (!exist) {
        break;
      }
      // 加上俩随机字符
      _no += random_string(2);
    }
    cat._no = _no;
    return await db.collection('cat').add(cat);
  }
}

function deepcopy(origin) {
  // not for modifying.
  const copyKeys = ['area', 'campus', 'characteristics',
    'colour', 'father', 'gender', 'mother', 'name', 'nickname', 'popularity', 'sterilized', 'adopt',
    'birthday', 'habit', 'tutorial', 'relation', 'to_star']
  var res = {};
  for (const key of copyKeys) {
    res[key] = origin[key];
  }
  return res;
}

function random_string(len) {
  var s = Math.random().toString(36);
  return s.substr(s.length - len);
}

// 权限检查
async function check_manager(level, openid) {  
  const isManager = await cloud.invoke('isManager', {
    auth: {
      openid: openid,
    },
    body: {
      req: level
    }
  });
  return isManager;
}
