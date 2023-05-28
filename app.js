// app.js

const API = require('./utils/api.js')
const utils = require('./utils/util')
App({
  onLaunch() {
    const updateManager = wx.getUpdateManager()

    updateManager.onCheckForUpdate(function (res) {
      // console.log(res.hasUpdate)
    })

    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success(res) {
          if (res.confirm) {
            updateManager.applyUpdate()
          }
        }
      })
    })

    const storageTags = {
      nickName: API.STORAGE_TAG.nickName,
      openId: API.STORAGE_TAG.openId,
      avatar: API.STORAGE_TAG.avatar,
      pushKeyJson: API.STORAGE_TAG.pushKeyJson,
      config: API.STORAGE_TAG.config
    };
    
    const globalUserInfo = this.globalData.userInfo;
    
    Object.keys(storageTags).forEach(key => {
      const value = wx.getStorageSync(storageTags[key]);
      if (utils.isStringValid(value)) {
        globalUserInfo[key] = value;
      }
    });
    const pushKey = JSON.parse(this.globalData.userInfo.pushKeyJson)
    this.globalData.userInfo.pushKey = pushKey
    console.log(this.globalData)
  },
  globalData: {
    userInfo: {
      nickName:'',
      avatar:'',
      openId:'',
      pushKey:[],
      config:'',
      photos:[],
      pushKeyJson:''
    }
  }
})
