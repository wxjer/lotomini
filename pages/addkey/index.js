// pages/addkey/index.js
const API = require('../../utils/api');
const util = require('../../utils/util');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title:'',
    key:'',
    openId:app.globalData.userInfo.openId,
    type:'',
    originKey:'',
    originTitle:'',
  },

  onTitleChange(e){
    const {value} = e.detail;
    this.setData({
      title:value
    })
  },
  onKeyChange(e){
    const {value} = e.detail;
    this.setData({
      key:value
    })
  },

  onTapSave(){
    const {key,title} = this.data
    if(util.isStringValid(key)&&util.isStringValid(title)){

      if(this.data.type == 'edit')
      {
          const pushKey = app.globalData.userInfo.pushKey;
          const tempIsChange = pushKey.filter(item=> item.key == key && item.title==title)
          console.log(tempIsChange)
          if(tempIsChange[0])
          {
            //没修改
            wx.navigateBack()
          }else{

            const pushKey = app.globalData.userInfo.pushKey.filter(item=> item.key != this.data.originKey && item.title!=this.data.originTitle)
            pushKey.push({title,key})
            const pushKeyJson =  JSON.stringify(pushKey)
            console.log(pushKeyJson)
            wx.request({
              url: API.API_URLS.createUser,
              data:{
                userID:this.data.openId,
                pushKey:pushKeyJson
              },
              method:'POST',
              success:(res)=>{
                  console.log(res)
                  const {statusCode} = res
                  if(statusCode == 200)
                  {
                    wx.showToast({
                      title: '编辑成功',
                    })
                    wx.setStorageSync(API.STORAGE_TAG.pushKeyJson,pushKeyJson)
                    app.globalData.userInfo.pushKey=pushKey
                  }else{
                    wx.showToast({
                      title: '编辑失败',
                      icon:'error'
                    })
                  }
              },
              fail:(res)=>{
                console.log(res)
              }
            })
          }
      }else{
        const pushKey = [...app.globalData.userInfo.pushKey];
        pushKey.push({title,key})
         const pushKeyJson =  JSON.stringify(pushKey)
         console.log(pushKeyJson)
         wx.request({
           url: API.API_URLS.createUser,
           data:{
             userID:this.data.openId,
             pushKey:pushKeyJson
           },
           method:'POST',
           success:(res)=>{
               console.log(res)
               const {statusCode} = res
               if(statusCode == 200)
               {
                 wx.showToast({
                   title: '添加成功',
                 })
                 wx.setStorageSync(API.STORAGE_TAG.pushKeyJson,pushKeyJson)
                 app.globalData.userInfo.pushKey.push({title,key})
                 if(this.data.type!='edit')
                 {
                   this.setData({
                     key:'',
                     value:''
                   })
                 }
               }else{
                 wx.showToast({
                   title: '添加失败',
                   icon:'error'
                 })
               }
           },
           fail:(res)=>{
             console.log(res)
           }
         })
      }

       
    }else{
      wx.showToast({
        title: '麻烦填写完整',
        icon: 'error',
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
      const type = options.type;
      if(util.isStringValid(type))
      {
        const key = options.key;
        const title = options.title;
        wx.setNavigationBarTitle({
          title: '编辑key',
        })
        this.setData({
          key:key,
          title:title,
          type:type,
          originKey:key,
          originTitle:title
        })
      }
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