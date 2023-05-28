// pages/configkey/index.js
const app = getApp()
const API = require('../../utils/api')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    keyArray: [...app.globalData.userInfo.pushKey],
    openId: app.globalData.userInfo.openId,
    rightIcon: [{
        icon: 'edit',
        className: 'btn edit-btn',
      },
      {
        icon: 'delete',
        className: 'btn delete-btn',
      },
    ],
  },

  //点击操作
  onActionClick(event) {

    const {
      icon
    } = event.detail
    const {
      item
    } = event.currentTarget.dataset
    console.log(icon, item)

    if (icon == 'edit') {
      const url = `/pages/addkey/index?type=edit&key=${item.key}&title=${item.title}`
      wx.navigateTo({
        url: url
      })
    } else {
      wx.showModal({
        title: '啊这',
        content: '确定要删除吗?',
        success: (res) => {
          if (res.confirm) {
            this.deleteKey(item)
          }
        }
      })

    }

  },

  //删除key
  deleteKey(d) {
    wx.showLoading({
      title: '正在删除',
    })
    const pushKey = this.data.keyArray.filter(item => item.key != d.key && item.title != d.title)
    console.log(pushKey)
    wx.request({
      url: API.API_URLS.createUser,
      data: {
        userID: this.data.openId,
        pushKey: JSON.stringify(pushKey),
      },
      method: 'POST',
      success: (res) => {
        const statusCode = res.statusCode
        if (statusCode == 200) {
          wx.showToast({
            title: '删除成功',
          })
          this.setData({
            keyArray: pushKey
          })
          app.globalData.userInfo.pushKey = pushKey
          wx.setStorageSync(API.STORAGE_TAG.pushKeyJson, JSON.stringify(pushKey))
        } else {
          wx.showToast({
            title: '删除失败:' + statusCode,
            icon: 'error'
          })
        }
      },
      fail: (res) => {
        const {
          statusCode
        } = res
        wx.showToast({
          title: '删除失败:' + statusCode,
          icon: 'error'
        })
      },
      complete() {
        wx.hideLoading()
      }
    })
  },


  //添加
  onTapAdd() {
    console.log('click')
    wx.navigateTo({
      url: '/pages/addkey/index',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

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
    this.setData({
      keyArray: [...app.globalData.userInfo.pushKey],
    })
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