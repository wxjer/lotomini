
Component({
  data: {
    value: 'index',
    list: [{
      icon: 'internet',
      value: 'index',
      label: '叭叭',
    },{
      icon: 'time',
      value: 'explore',
      label: '旺旺',
    }, {
      icon: 'user',
      value: 'my',
      label: '呱呱'
    }]
  },
  lifetimes: {
    ready() {
      const pages = getCurrentPages();
      const curPage = pages[pages.length - 1];
      if (curPage) {
        const nameRe = /pages\/(\w+)\/index/.exec(curPage.route);
        if (nameRe[1]) {
          this.setData({
            value: nameRe[1]
          })
        }
      }
    }
  },
  methods: {
    handleChange(e) {
      const { value } = e.detail;

      // this.setData({ value });
      wx.switchTab({
        url: `/pages/${value}/index`,
      })
    }
  }
})
