//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    messages:[],
    users:[],
    send_message:"",
    phoneWidth: 0,
  },

  onLoad: function () {
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
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else{
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        console.log(res);
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    }


    this.initUsers();
    this.timer = setInterval(this.text_move, 20);
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

  },

  startGame : function () {
    wx.reLaunch({
      url: '../paint/paint',
    })

  },

  send : function () {
    var messages = this.data.messages;
    var message = {
      color: "green",
      left: this.data.phoneWidth,
      text: this.data.send_message,
    }
    if(messages.length >0){
      var last = messages[messages.length - 1];
      message.left = last.left + 100;
    }
    
    messages.push(message);
    this.setData({
      messages : messages,
    })
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
