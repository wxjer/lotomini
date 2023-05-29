// pages/updateinfo/index.js

const app = getApp()
const API = require('../../utils/api');
const util = require('../../utils/util');
const Upyun = require('../../utils/upyun-wxapp-sdk')
const upyun = new Upyun({
  bucket: 'avatarforbark',
  operator: 'loto',
  getSignatureUrl: API.API_URLS.getUpyunSinature
})

Page({
  /**
   * 页面的初始数据
   */
  data: {
    nickName:'',
    avatar:app.globalData.userInfo.avatar
  },



  //js文件
  // 用户选择头像

  onChooseAvatar(e) {
    const {
      avatarUrl
    } = e.detail
    console.log(avatarUrl);
    this.setData({
      avatar: avatarUrl,
    })
    upyun.upload({
      localPath: avatarUrl,
      remotePath: '/avatar/upload_{random32}{.suffix}',
      success: (res) => {
        console.log('uploadImage res is:', res)
        if (res.statusCode == 200) {
          const {
            url
          } = JSON.parse(res.data)
          const avatarUrl= API.CDN_BASE_URL + url
          console.log(avatarUrl)
          this.updateUserAvatarUrl(avatarUrl)
        } 
      },
      fail: function ({
        errMsg
      }) {
        console.log('uploadImage fail, errMsg is', errMsg)
      },
      undefined
    });


    
  },

  updateUserAvatarUrl(avatarUrl){
    wx.request({
      url: API.API_URLS.createUser,
      data: {
        userID: app.globalData.userInfo.openId,
        avatar: avatarUrl,
      },
      method: 'POST',
      success: (res) => {
        console.log(res)
        const statusCode = res.statusCode
        if (statusCode == 200) {
          app.globalData.userInfo.avatar = avatarUrl
          wx.setStorageSync(API.STORAGE_TAG.avatar, avatarUrl)
        }
      },
    })
  },
  updateUserName(name){

    wx.request({
      url: API.API_URLS.createUser,
      data: {
        userID: app.globalData.userInfo.openId,
        nickname: name,
      },
      method: 'POST',
      success: (res) => {
        console.log(res)
        const statusCode = res.statusCode
        if (statusCode == 200) {
          app.globalData.userInfo.nickName = name
          wx.setStorageSync(API.STORAGE_TAG.nickName, name)
          this.setData({
            nickName:name
          })
          console.log(app.globalData.userInfo)
        }
      },
    })
  },

  formsubmit(e){
    const nickName = e.detail.value.nickname
    console.log("nickName", nickName)
 
    if(util.isStringValid(nickName)){
      this.updateUserName(nickName)
    }else{
      wx.showToast({
        title: '名字不能为空',
        icon:'error'
      })
    }

    // do something
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      nickName:app.globalData.userInfo.nickName
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    console.log('2'+app.globalData.userInfo)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})