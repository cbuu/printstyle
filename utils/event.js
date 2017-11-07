var funcMap = {}

var emiter = {}

emiter.on = (key,func)=>{
  funcMap[key] = func;
}

emiter.emit = (key,data)=>{
  var func = funcMap[key];
  func(data);
}

module.exports = emiter;