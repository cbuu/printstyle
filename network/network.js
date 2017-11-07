var network = {}

network.isConnected = false

network.connect = () => {
  
  wx.connectSocket({
    url: 'ws://127.0.0.1:3000',
  })
  wx.onSocketOpen(function (res) {
    console.log('WebSocket连接已打开！')
    network.isConnected = true;
  })

  
}

network.onMessage = (cb) => {
  wx.onSocketMessage((res) => {
    cb(res);
  })
}

network.emit = (api,data, cb) => {

  if (network.isConnected) {
    var msg = {
      api : api,
      data : data,
    }
    wx.sendSocketMessage({
      data: JSON.stringify(msg)
    })
  }
}

module.exports = network