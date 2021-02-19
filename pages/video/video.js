import request from "../../utils/request"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentId: '',
    videoGroupList: [], //导航标签数据
    videoList: [], //视频列表数据
    videoId: '', //视频id
    videoUpdateTime: [], //记录video播放的时长
    isTriggered: false, //标识下拉刷新是否被触发
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取导航数据
    this.getVideoGroupListData()
  },

  // 获取导航数据
  async getVideoGroupListData(){
    let videoGroupListData = await request('/video/group/list')
    this.setData({
      videoGroupList: videoGroupListData.data.slice(0, 14),
      currentId: videoGroupListData.data[0].id
    })
    // 获取视频列表数据
    this.getVideoList(this.data.currentId)
  },

  async getVideoList(currentId){
    if(!currentId){ //currentId为空不发请求
      return;
    }
    let videoListData = await request('/video/group', {id: currentId})
    console.log(videoListData);
    // 关闭消息提示框
    wx.hideLoading()
    let index = 0
    let videoList = videoListData.datas.map(item=>{
      item.id = index++
      return item
    })
    this.setData({
      videoList,
      isTriggered: false //关闭下拉刷新
    })
  },
  
  // 导航栏切换选中样式
  handlechange(e){
    console.log(e);
    let currentId = e.currentTarget.id
    this.setData({
      currentId: currentId*1,
      videoList: []
    })
    // 显示正在加载
    wx.showLoading({
      title: '正在加载'
    })
    // 动态获取当前导航对应的视频数据
    this.getVideoList(this.data.currentId)
  },

  // 点击播放/继续播放的回调
  handlePlay(e){
    let vid = e.currentTarget.id
    // 关闭上一个播放视频
    // this.vid !== vid && this.videoContext && this.videoContext.stop()
    // this.vid = vid
    this.setData({
      videoId: vid
    })
    // 创建控制video标签的实例对象
    this.videoContext = wx.createVideoContext(vid)
    // 
    let {videoUpdateTime} = this.data
    let videoItem = videoUpdateTime.find(item => item.vid === vid)
    if(videoItem){
      this.videoContext.seek(videoItem.currentTime)
    }
    this.videoContext.play()
  },

  // 监听视频播放进度的回调
  handleTimeUpdate(e){
    let videoTimeObj = {vid: e.currentTarget.id, currentTime: e.detail.currentTime}
    let {videoUpdateTime} = this.data
    let videoItem = videoUpdateTime.find(item => item.vid === videoTimeObj.vid)
    if(videoItem){
      videoItem.currentTime = e.detail.currentTime
    }else{
      videoUpdateTime.push(videoTimeObj)
    }
    this.setData({
      videoUpdateTime
    })
  },

  // 视频播放结束调用
  handleEnded(e){
    let {videoUpdateTime} = this.data
    let index = videoUpdateTime.findIndex(item => item.vid === e.currentTarget.id)
    videoUpdateTime.splice(index, 1)
    this.setData({
      videoUpdateTime
    })
  },

  // 下拉刷新回调
  handleRefresher(){
    this.getVideoList(this.data.currentId)
  },

  // 上拉触底
  handleToLower(){
    console.log('上拉触底');
  },

  // 用户点击右上角分享
  onShareAppMessage({from}){
    if(from === 'button'){
      return {
        title: '来自button的转发',
        page: '/pages/video/video',
        imageUrl: ''
      }
    }else{
      return {
        title: '来自menu的转发',
        page: '/pages/video/video',
        imageUrl: ''
      }
    }
  },

  // 跳转到搜索页
  handleSearchSong(){
    wx.navigateTo({
      url: '/pages/search/search'
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: async function () {
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