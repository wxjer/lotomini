// logs.js


// 获取应用实例
const app = getApp()
const API = require('../../utils/api');
const util = require('../../utils/util');

Page({
  data: {
    userInfo: {
      avatarUrl: util.isStringValid(app.globalData.userInfo.avatar) ? app.globalData.userInfo.avatar: API.CDN_BASE_URL + '/avatar/100.png',
      nickName: util.isStringValid(app.globalData.userInfo.nickName) ? app.globalData.userInfo.nickName:'点击登录',
      openId:util.isStringValid(app.globalData.userInfo.openId) ? app.globalData.userInfo.openId:'',
    },
    hasUserInfo: util.isStringValid(app.globalData.userInfo.openId) ? true:false,
    enable: false,
    loadingProps: {
      size: '50rpx',
    },
  },

  //下拉刷新
  onRefresh() {
    this.setData({
      enable: true
    });
    if(hasUserInfo)
    {
      this.requestUserInfo()
    }else{
      setTimeout(() => {
        this.setData({
          enable: false
        });
      }, 1500);
      this.handleTapUserInfo();
    }
  },

  //请求getUser接口
  requestUserInfo(){
    wx.request({
      url: API.API_URLS.getUserProfile,
      data: {
        userID: this.data.userInfo.openId
      },
      method:'GET',
      success: function(res) {
          const{ avatar, nickname, pushKey, config,photoUrls} = res.data
          this.setData({
            userInfo:{avatarUrl:avatar, nickName:nickname}
          })
          if(util.isStringValid(pushKey))
          {
              wx.setStorage(API.STORAGE_TAG.pushKeyJson,pushKey)
              const pushKeys = JSON.parse(pushKey)
              app.globalData.userInfo.pushKey=pushKeys
          }
          if(photoUrls){
            wx.setStorage(API.STORAGE_TAG.photosJson, JSON.stringify(photoUrls))
          }
          app.globalData.userInfo={ avatarUrl:avatar, nickName:nickname, config,photos:photoUrls}

      },
      fail: function(err) {
         wx.showToast({
           title: '刷新失败',
         })
      }
    })
  },

  showWxLoading(title) {
    wx.showLoading({
      title: title,
    })
  },
  hideWxLoading() {
    wx.hideLoading()
  },



  handleTapUserInfo() {
    if (!this.data.hasUserInfo) {
      wx.login({
        success: (res) => {
          if (res.code) {
            // 登录成功，获取到了登录凭证 code
            const code = res.code;
            // 可以将 code 发送给后端服务器进行登录验证或获取用户信息等操作
            console.log('Login success, code:', code);
            this.handleUserCode(code)
          } else {
            // 登录失败
            this.showWxLoading('登录失败')
            console.error('Login failed:', res.errMsg);
          }
        },
        fail:  (err)=>{
          this.showToast('登录失败')
          console.error('Failed to call login API:', err);
        }
      });
    }
  },
  handleUserCode(code) {
    this.showWxLoading('正在登陆')
    wx.request({
      url: API.API_URLS.getUserLogin, // 请求的URL
      method: 'GET', // 请求方法
      data: {
        code: code,
      }, // 请求参数
      success: (res) => {
        // 请求成功的回调函数
        console.log(res.data); // 打印响应数据
        const {
          id,nickname,avatar,pushKey,config,photoUrls
        } = res.data;
        wx.setStorageSync(API.STORAGE_TAG.openId, id)
        app.globalData.userInfo.openId = id;
        if(util.isStringValid(nickname)&&util.isStringValid(avatar))
        {
          wx.setStorage(API.STORAGE_TAG.nickName, nickname)
          wx.setStorage(API.STORAGE_TAG.avatar, avatar)
          wx.setStorage(API.STORAGE_TAG.pushKeyJson, pushKey)
          wx.setStorage(API.STORAGE_TAG.config, config)
          wx.setStorageSync(API.STORAGE_TAG.photosJson, JSON.stringify(photoUrls))

          app.globalData.userInfo.nickName = nickname;
          app.globalData.userInfo.avatar = avatar;
          app.globalData.userInfo.config = config;
          app.globalData.userInfo.photos = photoUrls;
          if(util.isStringValid(pushKey))
          {
              const pushKey = JSON.parse(pushKeyJson);
              app.globalData.userInfo.pushKey = pushKey
          }
        }else{
          this.getUserInfoAndProfile()
        }
      },
      fail: (error) => {
        // 请求失败的回调函数
        this.hideWxLoading()
        wx.showToast({
          title: '登录失败',
        })
        console.log(error);
      }
    });
  },

  getUserInfoAndProfile() {
    wx.getUserInfo({
      withCredentials: true,
      success: (res) => {
        console.log(res)
        const userInfo = res.userInfo;
        const nickName = userInfo.nickName;
        const avatarUrl = userInfo.avatarUrl;
        wx.setStorageSync(API.STORAGE_TAG.nickName, nickName)
        wx.setStorageSync(API.STORAGE_TAG.avatar, avatarUrl)
        app.globalData.userInfo.nickName = nickName;
        app.globalData.userInfo.avatar = avatarUrl;
        this.setData({
          userInfo: {
            nickName: nickName,
            avatarUrl: avatarUrl
          },
          hasUserInfo:true
        })
        wx.request({
          url: API.API_URLS.createUser,
          data:{
            nickname:nickName,
            avatar:avatarUrl,
            userID:app.globalData.userInfo.openId
          },
          method:'POST',
          success:(res)=>{
              console.log(res)
          },
          fail:(res)=>{
              console.log(res)
          }

        })
      },
      fail: (res) => {
        console.error('Failed to get user info:', err);
      },

      complete: (res) => {
        console.log('complete')
        this.hideWxLoading()
      },
    })
  },

  //点击
  onTapKey(){
    if(this.data.hasUserInfo)
    {
      wx.navigateTo({
        url: '/pages/configkey/index',
      })
    }else{
      wx.showToast({
        title: '请先登录',
      })
    }

  },
  onTapAlbum(){
   if(this.data.hasUserInfo)
   {
    wx.navigateTo({
      url: '/pages/managephotos/index',
    })
   }else{
    wx.showToast({
      title: '请先登录',
    })
   }
  },
  onTapAlbumStorage(){
    wx.showToast({
      title: '还没开发呢',
    })
  },

  // 事件处理函数
  bindViewTap() {

  },
  onReady() {
  },


})