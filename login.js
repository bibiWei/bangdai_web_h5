mui.init({

});

login = {

	// 事件注册
	event: function() {
		$("#qqLogin").on("click", login.service.qqLogin);
		$("#loginBtn").on("click", login.service.doLogin);
	},

	// 表单验证
	validate: function() {
		var regNumber = /\d+/; //验证0-9的任意数字最少出现1次。
		var regString = /[a-zA-Z]+/; //验证大小写26个字母任意字母最少出现1次。
		var passwd = $("#password").val();
		if($("#userCode").val() == "") {
			mui.toast("您输入的账号或手机号为空");
			return false;
		}
		if($("#password").val() == "") {
			mui.toast("您输入的密码为空");
			return false;
		}
//		if($("#password").val().length < 8) {
//			mui.toast("密码位数至少8位哦！");
//			return false;
//		}
		if($("#password").val().length > 16) {
			mui.toast("密码位数最多16位哦！");
			return false;
		}
		//验证第三个字符串
//		if(!(regNumber.test(passwd) && regString.test(passwd))) {
//			mui.toast("密码必须要包含字母和数字哦！");
//			return false;
//		}
		return true;
	},

	service: {

		qqLogin: function() {

		},

		doLogin: function() {
			debugger
			if(!login.validate()) {
				return false;
			}

			var data = {
				userCode: $("#userCode").val(),
				password: $("#password").val(),
			}
			apiHelper.post(CONSTANT.baseUrl + "/login", JSON.stringify(data), function(flag, data) {
				if(data.status == AJAX_SECCUSS) {
					alert("登录成功");
					localStorage.setItem("token",data.result.token);
					localStorage.setItem("userVo",data.result.userVo);
					window.location.href = "index.html";
					
				} else {
					mui.toast(data.msg);
				}
			}, null, AJAX_BODY);
		}
	},

	dao: {},
	init: function() {
		login.event();
	},
}
login.init();

var auths = {};

function plusReady() {
	// 获取登录认证通道
	plus.oauth.getServices(function(services) {
		var content = document.getElementById('dcontent');
		var info = document.getElementById("info");
		var txt = "登录认证通道信息：";
		for(var i in services) {
			var service = services[i];
			console.log(service.id + ": " + service.authResult + ", " + service.userInfo);
			auths[service.id] = service;
			txt += "id:" + service.id + ", ";
			txt += "description:" + service.description + ", ";
			var de = document.createElement('div');
			de.setAttribute('class', 'button');
			de.setAttribute('onclick', 'login(this.id)');
			de.id = service.id;
			de.innerText = service.description + "登录";
			oauth.appendChild(de);
		}
		info.innerText = txt;
	}, function(e) {
		outLine("获取登录认证失败：" + e.message);
	});
}
document.addEventListener('plusready', plusReady, false);
// 登录认证
function login(id) {
	outSet("----- 登录认证 -----");
	var auth = auths[id];
	if(auth) {
		var w = null;
		if(plus.os.name == "Android") {
			w = plus.nativeUI.showWaiting();
		}
		document.addEventListener("pause", function() {
			setTimeout(function() {
				w && w.close();
				w = null;
			}, 2000);
		}, false);
		auth.login(function() {
			w && w.close();
			w = null;
			outLine("登录认证成功：");
			outLine(JSON.stringify(auth.authResult));
			userinfo(auth);
		}, function(e) {
			w && w.close();
			w = null;
			outLine("登录认证失败：");
			outLine("[" + e.code + "]：" + e.message);
			plus.nativeUI.alert("详情错误信息请参考授权登录(OAuth)规范文档：http://www.html5plus.org/#specification#/specification/OAuth.html", null, "登录失败[" + e.code + "]：" + e.message);
		});
	} else {
		outLine("无效的登录认证通道！");
		plus.nativeUI.alert("无效的登录认证通道！", null, "登录");
	}
}
// 获取用户信息
function userinfo(a) {
	outLine("----- 获取用户信息 -----");
	a.getUserInfo(function() {
		outLine("获取用户信息成功：");
		outLine(JSON.stringify(a.userInfo));
		var nickname = a.userInfo.nickname || a.userInfo.name || a.userInfo.miliaoNick;
		plus.nativeUI.alert("欢迎“" + nickname + "”登录！");
	}, function(e) {
		outLine("获取用户信息失败：");
		outLine("[" + e.code + "]：" + e.message);
		plus.nativeUI.alert("获取用户信息失败！", null, "登录");
	});
}
// 注销登录
function logoutAll() {
	outSet("----- 注销登录认证 -----");
	for(var i in auths) {
		logout(auths[i]);
	}
}

function logout(auth) {
	auth.logout(function() {
		outLine("注销\"" + auth.description + "\"成功");
	}, function(e) {
		outLine("注销\"" + auth.description + "\"失败：" + e.message);
	});
}