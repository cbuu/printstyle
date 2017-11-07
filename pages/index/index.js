//index.js
//获取应用实例
const app = getApp()
const api = require('../../network/network')
const emiter = require('../../utils/event.js')

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    messages:[],
    users:[],
    send_message:"",
    phoneWidth: 0,
  },

  onShareAppMessage : function(options){
    return {
      title : "邀请好友加入",
      path  : "/pages/room/room?id=" + this.data.rid,
      success : (res) => {
        console.log("share success ");
      },
      fail   : (res)=> {
        console.log("share fail ");
      }
    }
  },

  onLoad: function (res) {

    this.initEmiter();

    api.onMessage((res) => {
      console.log(res);
      var obj = JSON.parse(res.data);
      emiter.emit(obj.api, obj.data);
    })

    var rid = wx.getStorageSync('rid');
    var that = this;

    //获取屏幕的宽度
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          phoneWidth: res.windowWidth,
        })
      }
    })

    if (app.globalData.userInfo) {
      console.log("has userInfo")
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
      api.emit('hello',rid);
    } else{
      console.log("don`t has userInfo")
      app.userInfoReadyCallback = () => {
        this.setData({
          userInfo: app.globalData.userInfo,
          hasUserInfo: true
        })
        api.emit('hello',rid);
      }
    }


    this.initUsers();
    this.timer = setInterval(this.text_move, 16);
    

  },

  initEmiter : function(){
    var that = this;

    emiter.on('msg',(data)=>{
      var messages = that.data.messages;
      var message = {
        color: "green",
        left: that.data.phoneWidth,
        text: data,
      }
      if (messages.length > 0) {
        var last = messages[messages.length - 1];
        if (last.left > that.data.phoneWidth - 100) {
          message.left = last.left + 100;
        }
      }

      messages.push(message);
      that.setData({
        messages: messages,
      })
    })


    emiter.on('room',(data)=>{
      console.log(data);
      var room = data;
      app.globalData.room = room;
      wx.setStorageSync('rid', room.id)
    })

  },

  initUsers: function(){
    var users = [];
    for(var i=0;i<8;i++){

      var user = {
        id : i,
        isEmpty : true,
        avatar : "",
      }
      users.push(user);
    }
    this.setData({
      users : users
    })
  },

  invite : function(){
    
  },

  sit : function(e) {
    console.log(e.target.id);
    var token = wx.getStorageSync(token);
    var sitInfo = {
      id : e.target.id,
      rid : app.globalData.room.id,
      token : token,
    }
    api.emit("sit",sitInfo)
  },

  up :function(e){
    console.log(e.target.id);
  },

  startGame : function () {
    wx.reLaunch({
      url: '../paint/paint',
    })

  },

  send : function () {
    api.emit('msg',this.data.send_message);
  },

  bind_blur: function(e){
    this.setData({
      send_message : e.detail.value,
    })
  },

  text_move : function(){
    var messages = this.data.messages;
    var l = this.data.messages.length;
    
    for(var i=0;i<l;i++){
      var message = messages[i];
      var move = message.left -2;
      message.left = move;
      if(move < -100){
        messages.shift();
        i--;
        l--;
        if(messages.length == 0){
          this.setData({
            messages : messages
          })
          return;
        }
      }
    }
    this.setData({
      messages: messages
    })
  },
})
