import request from '../../utils/request'
import moment from 'moment'
// 获取全局实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlay: false, //是否播放音乐
    song: {}, //歌曲详情对象
    musicId: '', //音乐id
    musicLink: '', //音乐的链接
    currentTime: '00:00', //实时时间
    durationTime: '00:00', //总时长
    currentWidth: 0, //实时进度条的宽度
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let musicId = options.musicId
    this.setData({
      musicId
    })
    // 获取音乐详情
    this.getMusicInfo(musicId)

    // 判断当前页面音乐是否在播放
    if (app.globalData.isMusicPlay && app.globalData.musicId === musicId) {
      // 修改当前页面音乐播放状态为true
      this.setData({
        isPlay: true
      })
    }else{
      this.handleMusicPlay()
    }

    // 创建控制音乐播放的实例
    this.backgroundAudioManager = wx.getBackgroundAudioManager()
    // 监听音乐播放/暂停/停止
    this.backgroundAudioManager.onPlay(() => {
      this.changePlayState(true)
      app.globalData.musicId = musicId
    })
    this.backgroundAudioManager.onPause(() => {
      this.changePlayState(false)
    })
    this.backgroundAudioManager.onStop(() => {
      this.changePlayState(false)
    })
    // 监听音乐播放自然结束
    this.backgroundAudioManager.onEnded(() => {
      this.handleSwitchNext()
    })
    // 监听音乐实时播放的进度
    this.backgroundAudioManager.onTimeUpdate(() => {
      // 格式化实时的时间
      let currentTime = moment(this.backgroundAudioManager.currentTime * 1000).format('mm:ss')
      let currentWidth = this.backgroundAudioManager.currentTime/this.backgroundAudioManager.duration*450
      console.log(currentWidth);
      this.setData({
        currentTime,
        currentWidth
      })
    })
  },

  // 修改播放状态的功能函数
  changePlayState(isPlay) {
    this.setData({
      isPlay
    })
    // 修改全局音乐播放状态
    app.globalData.isMusicPlay = isPlay
  },

  // 获取音乐详情的功能函数
  async getMusicInfo(musicId) {
    let songData = await request('/song/detail', { ids: musicId })
    // 总时长毫秒转化
    let durationTime = moment(songData.songs[0].dt).format('mm:ss')
    this.setData({
      song: songData.songs[0],
      // durationTime
    })
    // 动态修改窗口标题
    wx.setNavigationBarTitle({
      title: this.data.song.name,
    })
  },

  // 点击播放/暂停的回调
  handleMusicPlay() {
    let isPlay = !this.data.isPlay
    let { musicId, musicLink } = this.data
    this.musicControl(isPlay, musicId, musicLink)
  },

  // 控制音乐播放/暂停的功能函数
  async musicControl(isPlay, musicId, musicLink) {
    if (isPlay) { //音乐播放
      let musicLinkData = ''
      if(!musicLink){
        // 获取音乐播放链接
        musicLinkData = await request('/song/url', { id: musicId })
        musicLink = musicLinkData.data[0].url
        this.setData({
          musicLink
        })
      }
      this.backgroundAudioManager.src = musicLink
      this.backgroundAudioManager.title = this.data.song.name
    } else { //暂停播放
      this.backgroundAudioManager.pause()
    }
  },

  // 点击切换的回调上一首
  handleSwitchPre() {
    let songlist = app.globalData.songList
    let musicIndex = 0
    songlist.forEach((item, index) => {
      if (item.id == this.data.musicId) {
        musicIndex = index
      }
    })
    if (musicIndex === 0) {
      wx.showToast({
        title: '前面没有歌曲了',
      })
      return
    }
    let preId = app.globalData.songList[musicIndex - 1].id
    wx.redirectTo({
      url: '/pages/songDetail/songDetail?musicId=' + preId
    })
  },
  // 点击切换的回调下一首
  handleSwitchNext() {
    let songlist = app.globalData.songList
    let musicIndex = 0
    songlist.forEach((item, index) => {
      if (item.id == this.data.musicId) {
        musicIndex = index
      }
    })
    if (musicIndex === songlist.length-1) {
      wx.showToast({
        title: '后面没有歌曲了',
      })
      return
    }
    let nextId = app.globalData.songList[musicIndex + 1].id
    wx.redirectTo({
      url: '/pages/songDetail/songDetail?musicId=' + nextId
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})