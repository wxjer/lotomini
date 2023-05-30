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
    disabled: true,
    hasClickAlbum: false,
    title: '',
    content: '',
    avatarUrl: '',
    songId: '',
    songUrl: '',
    songType: '0',
    otherSchema: '',
    timeMode: 'everyday',
    timeModeNumber:"0",
    pushTime: '',
    weekTime: [],
    monthTime: '',
    fileList: [],
    pushKeyTitle: '点击选择',
    choosenPushKey: '',
    cityValue: [],
    pushKey: app.globalData.userInfo.pushKey.map(item => {
      return {
        value: item.key,
        label: item.title
      }
    }),
    mode: '',
    repeat: '',
    calendarVisible: false,
    selectedDate: '',
    pushData: {},
    dataIsOk: false
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
        hasClickAlbum: true
      })
      wx.navigateTo({
        url: '/pages/managephotos/index?type=choose',
      })
    }else{
      wx.showToast({
        icon:'error',
        title: '先登录',
      })
    }
  },

  //上传图片开始
  handleAdd(e) {

    if (!utils.isStringValid(app.globalData.userInfo.openId)) {
      wx.showToast({
        icon:'error',
        title: '先登录',
      })
      return;
    }

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
          app.globalData.choose = ''
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
  onSongTypeChange(e) {
    console.log(e)
    const {
      value
    } = e.detail
    this.setData({
      songUrl: value == "1" ? API.MUSIC_163_LIST_URL + this.data.songId : API.MUSIC_163_SONG_URL + this.data.songId,
      otherSchema: ''
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
        songUrl: this.data.songType == '1' ? (API.MUSIC_163_LIST_URL + songId ): (API.MUSIC_163_SONG_URL + songId),
        otherSchema: ''
      })
    } else {
      wx.showToast({
        icon: 'none',
        title: '数字吖',
      })
      this.setData({
        songId: ''
      })
    }
    console.log(this.data.songUrl)
  },

  //other
  onOtherPasted(e) {
    var {
      value
    } = e.detail;
    this.setData({
      otherSchema: value,
      songId: '',
      songUrl: ''
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
      return `${date.getDate()}`;
    };

    const selectedDate = format(value)
    this.setData({
      selectedDate: selectedDate,
      monthTime: selectedDate,
      disabled:true,
      timeModeNumber:"2"
    });
    this.getRepeatText()
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
      pushTime: value,
      [`${mode}Text`]: value,
    });
    this.getRepeatText();
    this.hideTimePicker();
  },

  //生成重复解释文本
  getRepeatText() {
    var reapeat = '';
    switch (this.data.timeMode) {
      case 'everyday':
        reapeat = '每天' + this.data.pushTime
        break;
      case 'everyweek':
        var result = "";
        for (var i = 0; i < this.data.weekTime.length; i++) {
          result += this.data.weekTime[i] + "、";
        }
        result = result.slice(0, -1);
        reapeat = '每周' + result + ' ' + this.data.pushTime
        break;
      case 'everymonth':
        reapeat = '每月' + this.data.monthTime + this.data.pushTime
        break;
      case 'single':
        reapeat = this.data.pushTime + '执行一次'
        break;
      default:
        break;
    }
    this.setData({
      repeat: reapeat
    })
  },

  onCityPicker() {
    if(utils.isStringValid(app.globalData.userInfo.openId))
    {
      this.setData({
        cityVisible: true
      });
    }else{
      wx.showToast({
        title: '先登录',
        icon:'error'
      })
    }

  },
  onPickerChange(e) {
    const {
      value
    } = e.detail;
    const {
      label
    } = e.detail;
    console.log('picker change:', e);
    this.setData({
      pushKeyTitle: label[0],
      choosenPushKey: value[0],
      cityVisible: false,
    });
  },
  onPickerCancel(e) {
    const {
      key
    } = e.currentTarget.dataset;
    this.setData({
      cityVisible: false,
    });
  },


  //点击timeMode
  onTimeModeChange(e) {
    const {
      value
    } = e.detail
    this.setData({
      timeModeNumber:value
    })
    switch (value) {
      case '0':
        this.setData({
          timeMode: 'everyday',
          disabled: true
        })
        this.getRepeatText()
        break;
      case '1':
        this.setData({
          timeMode: 'everyweek',
          disabled: false
        })
        this.getRepeatText()
        break;
      case '2':
        this.setData({
          timeMode: 'everymonth',
          disabled: true,
          calendarVisible: true
        })
        this.getRepeatText()
        break;
      case '3':
        this.setData({
          timeMode: 'single',
          disabled: true
        })
        this.getRepeatText()
        break;
      default:
        break;
    }
  },

  //立即发送
  handlePush() {
    this.handleData()
    if (!this.data.dataIsOk) {
      return;
    }
    wx.showLoading({
      title: '发送中...',
    })
    wx.request({
      url: API.API_URLS.sendPush,
      data: {
        pushUrl: this.data.pushData.pushUrl,
        userID: app.globalData.userInfo.openId
      },
      method: 'POST',
      success: (res) => {
        console.log(res)
        const {
          statusCode
        } = res
        if (statusCode == 200) {
          wx.showToast({
            title: '发送成功',
          })
        } else {
          wx.showToast({
            icon: 'error',
            title: '失败:' + statusCode,
          })
        }
      },
      fail: (res) => {
        console.log(res)
        wx.showLoading({
          icon: 'error',
          title: '发送失败',
        })
      },
      complete: () => {
        wx.hideLoading()
      }
    })
    this.setData({
      dataIsOk: false
    })
  },
  handleData() {
    //check
    const data = {}
    var pushUrl = API.PUSH_BASE_URL
    if (utils.isStringValid(this.data.choosenPushKey)) {
      data.pushKey = this.data.choosenPushKey
      data.pushPerson = this.data.pushKeyTitle
      pushUrl += data.pushKey
    } else {
      wx.showToast({
        icon: 'none',
        title: '发给谁?',
      })
      return
    }
    
    if (utils.isStringValid(this.data.title)) {
      const encodedTitle = encodeURIComponent(this.data.title);
      data.title = encodedTitle
      pushUrl += '/' + data.title
    }
    if (!utils.isStringValid(this.data.content)) {
      wx.showToast({
        icon: 'none',
        title: '填下正文',
      })
      return;
    } else {
      const content = this.data.content.trim().replace(/\%0a/g,'\n')
      console.log(content)
      data.content =  encodeURIComponent(content);
      pushUrl += '/' + data.content
    }
    data.avatarUrl = this.data.avatarUrl.trim()
    var isFirstParam = true
    if (utils.isStringValid(data.avatarUrl)) {
      const temp = isFirstParam ? '?' : '&'
      pushUrl += temp + 'icon=' + data.avatarUrl
      isFirstParam = false
    }
    data.songUrl = this.data.songUrl.trim()
    if (utils.isStringValid(data.songUrl)) {
      const temp = isFirstParam ? '?' : '&'
      pushUrl += temp + 'url=' + data.songUrl
      isFirstParam = false
    }
    data.other = this.data.otherSchema.trim()
    if (utils.isStringValid(data.other)) {
      const temp = isFirstParam ? '?' : '&'
      pushUrl += temp + 'url=' + data.other
      isFirstParam = false
    }
    data.pushUrl = pushUrl
    console.log(data)
    this.setData({
      pushData: data,
      dataIsOk: true
    })
  },
  handleSave() {
    this.handleData();
    if (!this.data.dataIsOk) {
      return;
    }
    this.setData({
      pushData: {
        timeMode: this.data.timeMode
      }
    })
    if (utils.isStringValid(this.data.pushTime)) {
      this.setData({
        pushData: {
          pushTime: this.data.pushTime
        }
      })
    } else {
      wx.showToast({
        icon: 'none',
        title: '啥时发?',
      })
      return
    }

    if (this.data.timeMode === 'everyweek' && this.data.weekTime.length == 0) {
      wx.showToast({
        icon: 'none',
        title: '每周哪天?',
      })
      return
    }
    this.setData({
      pushData: {
        weekTime: this.data.weekTime
      }
    })
    if (this.data.timeMode === 'everymonth' && !utils.isStringValid(this.data.monthTime)) {
      wx.showToast({
        icon: 'none',
        title: '每月哪天?',
      })
      return
    }
    this.setData({
      pushData: {
        monthTime: this.data.monthTime
      }
    })
    this.handleSendPlan()
  },
  //保存计划
  handleSendPlan() {
    console.log(this.data.pushData)
    wx.showToast({
      title: '别急，没开发',
    })
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
    console.log(app.globalData)
    if (this.data.hasClickAlbum) {
      this.setData({
        hasClickAlbum: false
      })
      const chooseUrl = app.globalData.choose
      console.log(chooseUrl)
      if (utils.isStringValid(chooseUrl)) {
        if (this.data.avatarUrl !== chooseUrl) {
          this.setData({
            avatarUrl: chooseUrl,
            fileList: [{
              url: chooseUrl
            }],
          })
          console.log(this.data.fileList)
        }
      }
    }
    this.setData({
      pushKey: app.globalData.userInfo.pushKey.map(item => {
        return {
          value: item.key,
          label: item.title
        }
      }),
    })
    if(app.globalData.hasChangePushKey){
      this.setData({
        pushKeyTitle:'点击选择',
        choosenPushKey:''
      })
      app.globalData.hasChangePushKey = false
    }
  },



  //onChangeWeek
  onChangeWeek(e) {
    const {
      value
    } = e.detail
    var intArray = value.map(Number);
    intArray.sort();
    var otherArray = ["一", "二", "三", "四", "五", "六", "日"];
    var newArray = intArray.map(function (index) {
      return otherArray[index];
    });
    console.log(newArray)

    this.setData({
      weekTime: newArray
    })
    this.getRepeatText()
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