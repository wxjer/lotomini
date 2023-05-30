// pages/managephotos/index.js
import ActionSheet from 'tdesign-miniprogram/action-sheet/index';
const API = require('../../utils/api')
const app = getApp()
const utils = require('../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type:'',
    viewer_visible: false,
    showIndex: false,
    closeBtn: true,
    deleteBtn: true,
    initial_index: 0,
    image_props: {
      mode: 'aspectFill'
    },
    border: {
      // color:'#f5f5f5',
    },
    list: ['https://img2.5bug.cn/avatar/3.png', 'https://img2.5bug.cn/avatar/13.png', 'https://img2.5bug.cn/avatar/23.png', 'https://img2.5bug.cn/avatar/33.png', 'https://img2.5bug.cn/avatar/43.png', 'https://img2.5bug.cn/avatar/53.png', 'https://img2.5bug.cn/avatar/63.png', 'https://img2.5bug.cn/avatar/73.png', 'https://img2.5bug.cn/avatar/83.png', 'https://img2.5bug.cn/avatar/93.png', 'https://img2.5bug.cn/avatar/103.png', 'https://img2.5bug.cn/avatar/113.png']
  },

  //click
  clickImg(e) {
    console.log(e)
    const {
      id
    } = e.target.dataset

    if(this.data.type=='choose'){
      const url = this.data.list[id]
      app.globalData.choose = url
      wx.navigateBack()
    }else{
      this.setData({
        initial_index: id,
        viewer_visible: true
      })
    }


  },
  onChange(e) {
    const {
      index
    } = e.detail;
    console.log('change', index);
  },
  onClose(e) {
    const {
      trigger
    } = e.detail;
    console.log(trigger);
    this.setData({
      viewer_visible: false,
    });
  },
  onDelete(e) {
    const {
      index
    } = e.detail;
    console.log('删除' + index)
    ActionSheet.show({
      context: this,
      selector: '#t-action-sheet',
      description: '要删除这张照片吗？',
      items: [{
        label: '删除',
        color: '#d54941',
      }, ],
    });
  },

  onSelected(e) {
    const {
      index
    } = e.detail
    console.log('删除的' + index);
    this.deletePhoto(index)
  },

  deletePhoto(index) {
    wx.showLoading({
      title: '正在删除',
    })
    wx.request({
      url: API.API_URLS.deletePhoto,
      data: {
        userID: app.globalData.userInfo.openId,
        photoURL: this.data.list[index]
      },
      method: 'POST',
      success: (res) => {
        console.log(res)
        const statusCode = res.statusCode
        if (statusCode == 200) {
          wx.showToast({
            title: '删除成功',
          })
          console.log(this.data.list)
          this.data.list.splice(index, 1)
          console.log(this.data.list)
          this.setData({
            list: this.data.list
          })
          app.globalData.userInfo.photos = this.data.list
          if (this.data.list&&this.data.list.length>0) {
            if (index == 0) {
              this.setData({
                initial_index: 1
              })
            } else {
              this.setData({
                initial_index: this.data.initial_index - 1
              })
            }
          } else {
            this.setData({
              viewer_visible: false
            })
          }
        } else {
          wx.showToast({
            title: '删除失败' + statusCode,
          })
        }
      },
      fail: (res) => {
        wx.showToast({
          title: '删除失败' + res.statusCode,
        })
      },
      complete() {
        wx.hideLoading()
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options)
    const type = options.type;
    if(utils.isStringValid(type))
    {
      wx.setNavigationBarTitle({
        title: '选择图片',
      })
      this.setData({
        type:type,
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

    wx.showLoading({
      title: '获取相册',
    })
    wx.request({
      url: API.API_URLS.getAllPhotos,
      data: {
        userID: app.globalData.userInfo.openId
      },
      method: 'GET',
      success: (res) => {
        console.log(res)
        const {
          statusCode
        } = res
        if (statusCode == 200) {
          const {
            data
          } = res
          if (data) {
            this.setData({
              list: data.map(item => item.photoUrl)
            })
            app.globalData.userInfo.photos = this.data.list
            wx.setStorageSync(API.API_URLS.photosJson, JSON.stringify(this.data.list))
          }
        } else {
          this.setData({
            list: app.globalData.userInfo.photos
          })
        }

      },
      fail: (res) => {
        wx.showToast({
          title: 'error',
        })
      },
      complete: () => {
        wx.hideLoading()
      }
    })

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

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