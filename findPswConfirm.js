var phone = URL.getRequest().phone;
var code = URL.getRequest().code;

mui.init({

});

var phoneUsed = 0;

(function($) {
	$.init();
})(mui);

var issend = true;
findPswConfirm = {

	// 事件注册
	event: function() {

		$("#getCode").on("click", findPswConfirm.service.senmobile);

		$("#resetBtn").on("click", findPswConfirm.service.doUpdate);

	},

	// 表单验证
	validate: function() {
		var regNumber = /\d+/; //验证0-9的任意数字最少出现1次。
		var regString = /[a-zA-Z]+/; //验证大小写26个字母任意字母最少出现1次。
		var passwd = $("#passwd").val();

		if($("#code").val() == "") {
			mui.alert("请您输入验证码");
			return false;
		}
		if($("#passwd").val() == "") {
			mui.alert("请您输入新密码");
			return false;
		}
		if($("#confirmPsw").val() == "") {
			mui.alert("请您确认密码");
			return false;
		}
		if($("#passwd").val() != $("#confirmPsw").val()) {
			mui.alert("您两次输入的密码不一致");
		}
		return true;
	},

	service: {
		senmobile: function(t) {
			if(phoneUsed == 1) {
				return;
			}
			if(issend) {

				var get_code = document.getElementById('getCode');
				if(phone != "") {

					var p1 = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
					var me = false;
					if(p1.test(phone)) me = true;
					if(!me) {
						phone = '';
						mui.toast('请输入正确的手机号码');
						return false;
					} else {
						issend = false;
						var data = {
							phone: phone
						}
						apiHelper.post(CONSTANT.baseUrl + "/sendPhoneCode", data, function(flag, data) {
							if(data.status == AJAX_SECCUSS) {
								for(i = 1; i <= 60; i++) {
									window.setTimeout("findPswConfirm.service.update_a(" + i + "," + 60 + ")", i * 1000);
								}
							}
						});
					}
				} else {
					mui.toast('手机号码不能为空！', {
						verticalAlign: 'center'
					});
					return false;
				}
			}
		},

		update_a: function(num, t) {
			var get_code = document.getElementById('getCode');
			if(num == t) {
				get_code.innerHTML = " 重新发送 ";
				issend = true;
			} else {
				var printnr = t - num;
				issend = false;
				get_code.innerHTML = printnr + " 秒后重发";
			}
		},

		doUpdate: function() {
			if(!findPswConfirm.validate()) {
				return false;
			}
			var data = {
				phone: phone,
				smsCode: $("#code").val(),
				newPassword: $("#confirmPsw").val()
			}
			apiHelper.post(CONSTANT.baseUrl + "/resetPassword", data, function(flag, data) {
				if(data.status == AJAX_SECCUSS) {
					mui.alert('重置成功', function() {
						window.location.href = "uLogin.html"
					});
				} else {
					mui.toast('您输入的验证码有误');
				}
			});
		}

	},
	dao: {},
	init: function() {
		findPswConfirm.event();
	},
}
findPswConfirm.init();