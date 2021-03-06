// joke.js

var service = require("../../utils/service.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    types: [
      {
        "type": 10,
        "name": "图片"
      },
      {
        "type": 29,
        "name": "段子"
      },
      {
        "type": 31,
        "name": "声音"
      },
      {
        "type": 41,
        "name": "视频"
      },
    ],
    currentType: 10,
    jokeList: [],
    pageIndex: 1,
    showLoading: true,
    hasMore: true,
    currentVoiceUrl: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadData()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.audioCtx = wx.createAudioContext("myAudio")
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.loadData()
  },

  /**
   * 加载数据
   */
  loadData: function () {
    var that = this
    service.getJokeList(this.data.pageIndex, this.data.currentType, function (res) {
      var jokes = that.data.jokeList.concat(res)
      var hasMore = res.length > 0
      var pageIndex = (res.length > 0) ? ++that.data.pageIndex : that.data.pageIndex
      that.setData({
        jokeList: jokes,
        pageIndex: pageIndex,
        showLoading: false,
        hasMore: hasMore
      })
    })
  },

  /**
   * 点击类别按钮切换数据
   */
  typeButtonTap: function (e) {
    var dataType = e.currentTarget.dataset.type
    if (dataType == this.data.currentType) {
      return
    }
    this.setData({
      currentType: dataType,
      jokeList: [],
      pageIndex: 1,
      showLoading: true,
      hasMore: true
    })
    this.loadData()
  },

  /**
   * 点击图片查看大图
   */
  imageTapAction: function (e) {
    var imageUrl = e.currentTarget.dataset.url
    wx.previewImage({
      urls: [imageUrl],
    })
  },

  /**
   * 点击声音图片
   */
  voiceImageTap: function (e) {
    var imageUrl = e.currentTarget.dataset.url
    wx.previewImage({
      urls: [imageUrl],
    })
  },

  /**
   * 点击播放声音
   */
  playAudioTap: function (e) {
    var voiceUrl = e.currentTarget.dataset.url
    if (voiceUrl == this.data.currentVoiceUrl) {
      this.audioCtx.pause()
      return
    }
    wx.showLoading({
      title: '加载中...',
    })
    this.audioCtx.setSrc(voiceUrl)
    this.audioCtx.play()
    this.setData({ currentVoiceUrl: voiceUrl })
  },

  /**
   * 音频开始播放
   */
  audioPlayStart: function () {
    wx.hideLoading()
  },

  /**
   * 音频播放暂停
   */
  audioPlayPause: function () {
    this.setData({ currentVoiceUrl: null })
  },

  /**
   * 音频播放结束
   */
  audioPlayEnd: function () {
    this.setData({ currentVoiceUrl: null })
  }

})