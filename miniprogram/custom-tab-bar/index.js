import { getGlobalSettings, getCurrentPath, toSettings } from "../page";
import { checkCanFullTabBar } from "../user";
import tab from "./tab";

function getTabBarList() {
  console.log(tab);
  var list = [];
  for (var key in tab) {
    list.push(tab[key]);
  }
  return list;
}

Component({
  data: {
    list: getTabBarList(),
    activePath: null
  },
  async created() {
    const settings = await getGlobalSettings("tabBar");
    if (settings == undefined) {
      console.log("no settings");
      toSettings("缺失tabBar设置，已填入默认值，请检查后保存。");
      return;
    }
    const { minTab, fullTab } = settings;
    console.log("tabBar", minTab, fullTab);
    // 根据用户类型来确定底Tab
    var order = minTab;
    if (await checkCanFullTabBar()) {
      order = fullTab;
    }

    if (!order) {
      toSettings("缺失tabBar设置，已填入默认值，请检查后保存。");
      return;
    }
    
    // 重新排序list
    var newList = [];
    for (const key of order.trim().split(",")) {
      const item = tab[key.trim()];
      if (!item) {
        continue;
      }
      newList.push(item);
    }
    this.setData({
      list: newList,
      showTabBar: true,
    });
  },
  attached() {
    var obj = this.createSelectorQuery();
    obj.select('.tab-bar').boundingClientRect(function (rect) {
      console.log('获取tabBar元素的高度', rect.height);
      wx.setStorageSync('tabBarHeight', rect.height)     // 将获取到的高度设置缓存，以便之后使用
    }).exec();
  },
  methods: {
    switchTab(e) {
      const {path} = e.currentTarget.dataset;
      if (path == this.data.activePath) {
        return;
      }

      const url = `/${path}`;
      console.log(url);
      wx.switchTab({url});
    },
  }
})