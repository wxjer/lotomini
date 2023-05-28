// pages/explore/index.js
const utils = require('../../utils/util.js');
const Upyun = require('../../utils/upyun-wxapp-sdk')
const API = require('../../utils/api')
const app = getApp()
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
    hasClickAlbum: false,
    title: '',
    content: '',
    avatarUrl: '',
    songId: '',
    songUrl: '',
    songType: '',
    otherSchema: '',
    timeMode: '',
    pushTime: '',
    weekTime: '',
    monthTime: '',
    fileList: [],
    pushKeyTitle: '点击选择',
    cityValue: [],
    pushKey: app.globalData.userInfo.pushKey.map(item=>{
      return{
        value:item.key,
        label:item.title
      }
    }),
    mode: '',
    minute: '23:59',
    calendarVisible: false,
    selectedDate: '',
  },

  //标题
  onTitleInput(e) {
    var {
      value
    } = e.detail;
    this.setData({
      title: value
    })
  },
  //正文
  onContentInput(e) {
    var {
      value
    } = e.detail;
    this.setData({
      content: value
    })
  },
  //点击换行
  onAddEnterTap(e) {
    const {
      content
    } = this.data;
    const updatedValue = content + '%0a'
    this.setData({
      content: updatedValue
    })
  },
  //选择已上传图片
  onSelectAvatar(e) {
    if (utils.isStringValid(app.globalData.userInfo.openId)) {
      this.setData({
        hasClickAlbum:true
      })
      wx.navigateTo({
        url: '/pages/managephotos/index?type=choose',
      })
    }
  },

  //上传图片开始
  handleAdd(e) {
    const {
      fileList
    } = this.data;
    const {
      files
    } = e.detail;

    // 方法1：选择完所有图片之后，统一上传，因此选择完就直接展示
    const list = [...fileList, ...files]
    this.setData({
      fileList: list, // 此时设置了 fileList 之后才会展示选择的图片
    });

    files.forEach(file => this.onUpload(file))
  },



  onUpload(file) {
    const {
      fileList
    } = this.data;

    this.setData({
      fileList: [...fileList, {
        ...file,
        status: 'loading'
      }],
    });
    const {
      length
    } = fileList;
    console.log('upload_file' + file.url)
    upyun.upload({
      localPath: file.url,
      remotePath: '/avatar/upload_{random32}{.suffix}',
      success: (res) => {
        console.log('uploadImage res is:', res)
        if (res.statusCode == 200) {
          const {
            url
          } = JSON.parse(res.data)
          this.setData({
            avatarUrl: API.CDN_BASE_URL + url
          })
          this.insertPhoto(this.data.avatarUrl)
          app.globalData.choose=''
        } else {
          wx.showToast({
            title: '上传失败',
            icon: 'fail',
            duration: 1500
          })
        }

      },
      fail: function ({
        errMsg
      }) {
        console.log('uploadImage fail, errMsg is', errMsg)
      },
      onProcessUpdate
    })




    function onProcessUpdate(progress) {
      console.log('upload progress' + progress)
    }
  },

  insertPhoto(url) {
    wx.showLoading({
      title: '正在上传',
    })
    wx.request({
      url: API.API_URLS.addPhoto,
      data: {
        userID: app.globalData.userInfo.openId,
        photoURL: url
      },
      method: 'POST',
      success: (res) => {
        console.log(res)
        const {
          statusCode
        } = res
        if (statusCode == 200) {
          wx.showToast({
            title: '上传成功',
          })
        } else {
          wx.showToast({
            title: '上传url失败',
          })
        }
      },
      fail: (res) => {
        wx.showToast({
          title: '上传url失败',
        })
        console.log(res)
      },
      complete() {
        wx.hideLoading()
      }
    })
  },
  handleRemove(e) {
    this.setData({
      fileList: [],
      avatarUrl: ""
    })
  },
//onSongTypeChange
onSongTypeChange(e){
  console.log(e)
  const{value} = e.detail
  this.setData({
    songUrl: value == "1" ? API.MUSIC_163_LIST_URL + this.data.songId : API.MUSIC_163_SONG_URL + this.data.songId
  })
  console.log(this.data.songUrl)
},

  //上传图片结束



  //歌曲
  onSongUrlPasted(e) {
    const {
      value
    } = e.detail
    const songId = utils.extractIdFromUrl(value)
    if (songId) {
      this.setData({
        songId: songId,
        songUrl: songType == 1 ? API.MUSIC_163_LIST_URL + this.data.songId : API.MUSIC_163_SONG_URL + this.data.songId
      })
    }
  },

  //other
  onOtherPasted(){
    var {
      value
    } = e.detail;
    this.setData({
      otherSchema: value,
      songId:'',
      songUrl:''
    })
  },

  //push对象


  //日历
  handleCalendar() {
    this.setData({
      calendarVisible: true
    });
  },
  handleCalendarConfirm(e) {
    const {
      value
    } = e.detail;
    const format = (val) => {
      const date = new Date(val);
      return `${date.getMonth() + 1}-${date.getDate()}`;
    };

    this.setData({
      selectedDate: format(value),
    });
  },

  showTimePicker(e) {
    const {
      mode
    } = e.currentTarget.dataset;
    this.setData({
      mode,
      [`${mode}Visible`]: true,
    });
  },
  hideTimePicker() {
    const {
      mode
    } = this.data;
    this.setData({
      [`${mode}Visible`]: false,
    });
  },
  onTimePickerConfirm(e) {
    const {
      value
    } = e.detail;
    const {
      mode
    } = this.data;

    console.log('confim', value);

    this.setData({
      [mode]: value,
      [`${mode}Text`]: value,
    });

    this.hideTimePicker();
  },


  onCityPicker() {
    this.setData({
      cityVisible: true
    });
  },
  onPickerChange(e) {
    const {
      key
    } = e.currentTarget.dataset;
    const {
      value
    } = e.detail;

    console.log('picker change:', e.detail);
    this.setData({
      cityVisible: false,
    });
  },
  onPickerCancel(e) {
    const {
      key
    } = e.currentTarget.dataset;
    console.log(e, '取消');
    console.log('picker1 cancel:');
    this.setData({
      cityVisible: false,
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log('onLoad')
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    console.log('onReady')
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    console.log('onShow')
    if(this.data.hasClickAlbum){
      this.setData({
        hasClickAlbum:false
      })
      const chooseUrl = app.globalData.choose
      if(utils.isStringValid(chooseUrl))
      {
        if(this.data.avatarUrl !== chooseUrl)
        {
          this.setData({
            avatarUrl:chooseUrl,
            fileList: [{url:chooseUrl}],
          })
          console.log(this.data.fileList)
        }
      }
    }
    this.setData({
      pushKey: app.globalData.userInfo.pushKey.map(item=>{
        return{
          value:item.key,
          label:item.title
        }
      }),
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