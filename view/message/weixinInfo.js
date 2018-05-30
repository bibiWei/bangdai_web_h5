
var isAccessFormalEnv = true; //是否访问正式环境
var isLogOn = true; //是否开启sdk在控制台打印日志

var sdkAppID = 1400059049;
var accountType = 24414;

var identifier = JSON.parse(localStorage.getItem("userVo")).userCode + JSON.parse(localStorage.getItem("userVo")).type;
var userSig = localStorage.getItem("wxchatId");
//当前用户身份
var loginInfo = {
  'sdkAppID': sdkAppID, //用户所属应用id,必填
  'identifier': identifier, //当前用户ID,必须是否字符串类型，必填
  'accountType': accountType, //用户所属应用帐号类型，必填
  'userSig': userSig, //当前用户身份凭证，必须是字符串类型，必填
  'identifierNick': null, //当前用户昵称，不用填写，登录接口会返回用户的昵称，如果没有设置，则返回用户的id
  'headurl': 'img/me.jpg' //当前用户默认头像，选填，如果设置过头像，则可以通过拉取个人资料接口来得到头像信息
};

//监听连接状态回调变化事件
var onConnNotify = function(resp) {
  var info;
  switch (resp.ErrorCode) {
    case webim.CONNECTION_STATUS.ON:
      webim.Log.warn('建立连接成功: ' + resp.ErrorInfo);
      break;
    case webim.CONNECTION_STATUS.OFF:
      info = '连接已断开，无法收到新消息，请检查下你的网络是否正常: ' + resp.ErrorInfo;
      // alert(info);
      webim.Log.warn(info);
      break;
    case webim.CONNECTION_STATUS.RECONNECT:
      info = '连接状态恢复正常: ' + resp.ErrorInfo;
      // alert(info);
      webim.Log.warn(info);
      break;
    default:
      webim.Log.error('未知连接状态: =' + resp.ErrorInfo);
      break;
  }
};



//监听事件
var listeners = {
  "onConnNotify": onConnNotify,//监听连接状态回调变化事件,必填,

};

var options = {
  'isAccessFormalEnv': isAccessFormalEnv, //是否访问正式环境，默认访问正式，选填
  'isLogOn': isLogOn //是否开启控制台打印日志,默认开启，选填
};