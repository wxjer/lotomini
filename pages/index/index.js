// pages/explore/index.js
const utils = require('../../utils/util.js');
const Upyun = require('../../utils/upyun-wxapp-sdk')
const API_URLS = require('../../utils/api')
const upyun = new Upyun({
  bucket: 'avatarforbark',
  operator: 'loto',
  getSignatureUrl: API_URLS.getSignatureUrl
})
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    content: '',
    avatarUrl: '',
    songId: '',
    songUrl: '',
    songType:'',
    otherSchema: '',
    pushKey: '',
    timeMode: '',
    pushTime: '',
    weekTime: '',
    monthTime: '',
    fileList: [],
    cityText: '浪味仙',
    cityValue: [],
    citys: [{
      label: '成都市',
      value: '成都市'
    }, ],
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
    wx.showToast({
      title: '还没开发，下版再做咯',
      icon: 'success',
      duration: 1000
    })
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
    this.setData({
      fileList: [...fileList, ...files], // 此时设置了 fileList 之后才会展示选择的图片
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

    upyun.upload({
      localPath: file.url,
      remotePath: '/avatar/upload_{random32}{.suffix}',
      success: (res) => {
        console.log('uploadImage res is:', res)
        if (res.statusCode == 200) {
          wx.showToast({
            title: '上传成功',
            icon: 'success',
            duration: 1000
          })
          const {
            url
          } = JSON.parse(res.data)
          this.setData({
            avatarUrl: API_URLS.CDN_BASE_URL + url
          })
        } else {
          wx.showToast({
            title: '上传失败',
            icon: 'fail',
            duration: 1000
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
  handleRemove(e) {
    const {
      index
    } = e.detail;
    const {
      fileList
    } = this.data;

    fileList.splice(index, 1);
    this.setData({
      fileList,
    });
  },


  //上传图片结束



  //歌曲
  onSongUrlPasted(e) {
    const {value} = e.detail
    const songId = utils.extractIdFromUrl(value)
    if(songId){
      this.setData({
        songId:songId,
        songUrl: songType==1?API_URLS.MUSIC_163_LIST_URL+songId:API_URLS.MUSIC_163_SONG_URL+songId
      })
    }
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
      [`${key}Visible`]: false,
      [`${key}Text`]: value.join(' '),
    });
  },
  onPickerCancel(e) {
    const {
      key
    } = e.currentTarget.dataset;
    console.log(e, '取消');
    console.log('picker1 cancel:');
    this.setData({
      [`${key}Visible`]: false,
    });
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