// logs.js


// 获取应用实例
const app = getApp()
const API = require('../../utils/api')
const that = this;
Page({
  data: {
    userInfo: {
      avatarUrl: API.CDN_BASE_URL + '/avatar/100.png',
      nickName: '点击登录',
      openId:'',
    },
    hasUserInfo: false,
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
    setTimeout(() => {
      this.setData({
        enable: false
      });
    }, 1500);
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
          this.showWxLoading('登录失败')
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
          openid
        } = res.data;
        wx.setStorageSync(API.STORAGE_TAG.openId, openid)
        this.getUserInfoAndProfile()
      },
      fail: (error) => {
        // 请求失败的回调函数
        this.hideWxLoading()
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
        this.setData({
          userInfo: {
            nickName: nickName,
            avatarUrl: avatarUrl
          },
          hasUserInfo:true
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

  // 事件处理函数
  bindViewTap() {

  },
  onReady() {
    const nickName = wx.getStorageSync(API.STORAGE_TAG.nickName);
    const openId = wx.getStorageSync(API.STORAGE_TAG.openId);
    const avatarUrl = wx.getStorageSync(API.STORAGE_TAG.avatar);
    console.log(openId)
    if(openId!=''||openId!=undefined)
    {
      this.setData({
        userInfo:{nickName,openId,avatarUrl},
        hasUserInfo:true
      })
    }
  },


})