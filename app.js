//app.js
const config = require('./config');
const api = require('./network/network.js')
const host = config.host;

App({
  onLaunch: function () {

    api.connect();  
    wx.checkSession({
      success:()=>{
        console.log('check session success')
        
        var token = wx.getStorageSync("token");
        var user = wx.getStorageSync("user");
        console.log(token);
        console.log(user);
        this.globalData.userInfo =  {
          openId : user.openId,
          nickName : user.name,
          avatarUrl : user.avatar,
        }
        if (this.userInfoReadyCallback) {
          this.userInfoReadyCallback()
        }
      },
      fail:()=>{
        console.log('check session fail')
        wx.login({
          success: res => {
            // 发送 res.code 到后台换取 openId, sessionKey, unionId
            wx.getUserInfo({
              success: (info) => {
                console.log(info)
                if (res.code) {
                  //发起网络请求
                  wx.request({
                    url: `${host}/login`,
                    data: {
                      code: res.code,
                      encryptedData: info.encryptedData,
                      iv: info.iv
                    },
                    success: function (res) {
                      console.log(res.data);
                      wx.setStorageSync('token', res.data.token);
                      wx.setStorageSync('user', res.data.user);
                      let user = res.data.user;
                      this.globalData.userInfo = {
                        openId: user.openId,
                        nickName: user.name,
                        avatarUrl: user.avatar,
                      }

                      if (this.userInfoReadyCallback){
                        this.userInfoReadyCallback()
                      }
                    },
                  })
                } else {
                  console.log('获取用户登录态失败！' + res.errMsg)
                }
              },
            })

          }
        })
      }
    })
  },
  globalData: {
    userInfo: null,
    room:null,
  }
})