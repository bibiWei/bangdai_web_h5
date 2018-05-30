var areaCode = URL.getRequest().areaCode;
var uPhone = URL.getRequest().uPhone;
var smsCode = URL.getRequest().smsCode;

var cityData3 = [];
mui.init({

});

var phoneUsed = 0;

(function($) {
	$.init();
})(mui);

var issend = true;
uRegisterConfirm = {

	// 事件注册
	event: function() {
		$("#registerBtn").on("click", uRegisterConfirm.service.doRegister);
	},

	// 表单验证
	validate: function() {
		var regNumber = /\d+/; //验证0-9的任意数字最少出现1次。
		var regString = /[a-zA-Z]+/; //验证大小写26个字母任意字母最少出现1次。
		var passwd = $("#passwd").val();

		if($("#nickName").val() === "") {
			mui.toast("您输入的昵称为空");
			return false;
		}

		if($("#passwd").val() === "") {
			mui.toast("您输入的密码为空");
			return false;
		}
		if($("#passwd").val().length < 8) {
			mui.toast("密码位数至少8位哦！");
			return false;
		}
		if($("#passwd").val().length > 16) {
			mui.toast("密码位数最多16位哦！");
			return false;
		}
		//验证第三个字符串
		if(!(regNumber.test(passwd) && regString.test(passwd))) {
			mui.toast("密码必须要包含字母和数字哦！");
			return false;
		}
		if($("#passwd").val() !== $("#checkPsw").val()) {
			mui.toast("您输入的两次密码不一致");
			return false;
		}
		return true;
	},
	service: {
		doRegister: function() {

			if(!uRegisterConfirm.validate()) {
				return false;
			}
			var data = {
				phone: uPhone,
				userCode: uPhone,
				nickName: $("#nickName").val(),
				countryCode: areaCode,
				password: $("#passwd").val(),
				clientId: "",
				picUrl: localStorage.getItem('register_user_photo')
			}
			apiHelper.post(CONSTANT.baseUrl + "/register" + "?smsCode=" + smsCode, JSON.stringify(data), function(flag, data) {
				if(data.status == AJAX_SECCUSS) {
					mui.alert('注册成功', function() {
						window.location.href = "uLogin.html"
					});

				} else {
					mui.toast(data.msg);
				}
			}, null, AJAX_BODY);
		}

	},

	dao: {},
	init: function() {
		uRegisterConfirm.event();
	},
}
uRegisterConfirm.init();