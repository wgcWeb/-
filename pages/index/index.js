// pages/index.js
import request from "../../utils/request"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerList: [],
    recommendList: [],
    topList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    // 导航栏信息
    let bannerData = await request('/banner', {type: 2})
    this.setData({
      bannerList : bannerData.banners
    })

    // 推荐歌曲信息
    let recommendListData = await request('/personalized', {limit: 10})
    this.setData({
      recommendList : recommendListData.result
    })
    // 排行榜信息
    // 总榜单
    let topListDataAll = await request('/toplist')
    let idList = ['19723756','3779629','2884035','3778678','991319590']
    // 飙升榜
    let topListData1 = await request('/top/list', {id: 19723756})
    // 新歌榜
    let topListData2 = await request('/top/list', {id: 3779629})
    // 原创榜
    let topListData3 = await request('/top/list', {id: 2884035})
    // 热歌榜
    let topListData4 = await request('/top/list', {id: 3778678})
    // 云音乐说唱榜
    let topListData5 = await request('/top/list', {id: 991319590})
    let topListData = []
    topListData.push(topListData1.playlist,topListData2.playlist,topListData3.playlist,topListData4.playlist,topListData5.playlist)
    this.setData({
      topList : topListData
    })
  },

  // 跳转到每日推荐
  handleToRecommend(){
    wx.navigateTo({
      url: '/pages/recommendSong/recommendSong'
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