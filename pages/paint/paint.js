// pages/paint/paint.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    a : 1,
    preX:0,
    preY:0,
    points:[],
    curPointArray:[],
    curColor:"",
  },

  start: function(e) {
    var x = e.touches[0].x;
    var y = e.touches[0].y;
    // console.log("start x = " + x + " y = " + y );
    var point = [x, y];
    var curPointArr = [];
    curPointArr.push(point);
    // console.log(curPointArr);
    
    this.setData({
      preX : x,
      preY : y,
      curPointArray : curPointArr,
    })
  },

  move: function (e){
    var x = e.touches[0].x;
    var y = e.touches[0].y;
    // console.log("move x = " + x + " y = " + y);
    let ctx = wx.createCanvasContext('canvas');
    ctx.beginPath();
    ctx.setStrokeStyle(this.data.curColor);
    ctx.setLineCap('round')
    ctx.setLineJoin('round')
    ctx.setLineWidth(5)
    ctx.moveTo(this.data.preX, this.data.preY);
    ctx.lineTo(x,y);
    ctx.stroke();
    ctx.draw(true);

    var point = [x, y];
    var curPointArr = this.data.curPointArray;
    curPointArr.push(point);

    this.setData({
      preX: x,
      preY: y,
      curPointArray: curPointArr,
    })
  },

  end: function (e){
    // console.log(e);
    var curPointArr = this.data.curPointArray;
    var points = this.data.points;
    points.push(curPointArr);
    this.setData({
      points : points,
    })

    // console.log(points);
  },

  back: function(){

    let ctx = wx.createCanvasContext('canvas');
    ctx.draw();
    let points = this.data.points;
    console.log(points)
    points.pop();
    console.log(points)
    var x , y ;
    var preX , preY;

    

    for(var i in points){
      ctx.beginPath();
      ctx.setStrokeStyle(this.data.curColor);
      ctx.setLineCap('round')
      ctx.setLineJoin('round')
      ctx.setLineWidth(5)
      var arr = points[i];
      
      // console.log(arr);
      for(var j in arr){
        if(j==0){
          preX = arr[0][0];
          preY = arr[0][1];
          continue;
        }
        var point = arr[j];
        x = point[0];
        y = point[1];
        // console.log(point);
        ctx.moveTo(preX, preY);
        ctx.lineTo(x, y);
        ctx.stroke();
        preX = x;
        preY = y;
      }
      ctx.draw(true);
    }

    this.setData({
      points: points,
    })
  },

  clear: function(){
    let ctx = wx.createCanvasContext('canvas');
    ctx.draw();
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      curColor: "rgb(" + parseInt(Math.random() * 256) + "," + parseInt(Math.random() * 256) + "," + parseInt(Math.random() * 256) + ")"
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

  changeColor: function() {
    this.setData({
      curColor: "rgb(" + parseInt(Math.random() * 256) + "," + parseInt(Math.random() * 256) + "," + parseInt(Math.random() * 256) + ")"
    })
  },
})