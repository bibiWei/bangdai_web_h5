mui.init({

});

var phoneUsed = 0;

(function($) {
	$.init();
})(mui);

var issend = true;
uRegister = {

	// 事件注册
	event: function() {

		$("#showAreaCodePicker").on("click", uRegister.service.showAreaCodePicker);

		$("#getCode").on("click", uRegister.service.senmobile);

		$("#registerBtn").on("click", uRegister.service.doRegister);

	},

	// 表单验证
	validate: function() {
		var regNumber = /\d+/; //验证0-9的任意数字最少出现1次。
		var regString = /[a-zA-Z]+/; //验证大小写26个字母任意字母最少出现1次。
		var passwd = $("#passwd").val();

		if($("#showAreaCodePicker").val() === "") {
			mui.toast("您输入的区号为空");
			return false;
		}
		if($("#uPhone").val() === "") {
			mui.toast("您输入的手机号为空");
			return false;
		}
		if($("#code").val() === "") {
			mui.toast("您输入的验证码为空");
			return false;
		}
		if($("#userRes").is(':checked') === false) {
			mui.toast("请您勾选用户协议");
			return false;
		}
		return true;
	},

	service: {
		showAreaCodePicker: function() {
			var sexPicker = new mui.PopPicker();
			sexPicker.setData(areaData);
			sexPicker.show(function(items) {
				$("#showAreaCodePicker").val(items[0].text);
				$("#showAreaCodePicker").attr("countryCode", items[0].value);
			});
		},

		senmobile: function(t) {
			if(phoneUsed == 1) {
				return;
			}
			if(issend) {
				var phoneObj = document.getElementById('uPhone');
				var get_code = document.getElementById('getCode');
				if(phoneObj.value != "") {
					var phoneVal = phoneObj.value;
					var p1 = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
					var me = false;
					if(p1.test(phoneVal)) me = true;
					if(!me) {
						phoneObj.value = '';
						mui.toast('请输入正确的手机号码');
						phoneObj.focus();
						return false;
					} else {
						issend = false;
						var data = {
							phone: phoneVal
						}
						apiHelper.post(CONSTANT.baseUrl + "/sendPhoneCode", data, function(flag, data) {
							if(data.status == AJAX_SECCUSS) {
								for(i = 1; i <= 60; i++) {
									window.setTimeout("uRegister.service.update_a(" + i + "," + 60 + ")", i * 1000);
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

		doRegister: function() {
			if(!uRegister.validate()) {
				return false;
			}
			var data = {
				phone: $("#uPhone").val(),
				code: $("#code").val()
			}
			apiHelper.post(CONSTANT.baseUrl + "/validateCode", data, function(flag, data) {
				if(data.status == AJAX_SECCUSS) {
					window.location.href = "uRegisterConfirm.html" + "?areaCode=" + $("#showAreaCodePicker").attr("countryCode") + "&uPhone=" + $("#uPhone").val() + "&smsCode=" + $("#code").val();
				} else {
					mui.toast('您输入的验证码有误');
				}
			}, null);
		}

	},
	dao: {},
	init: function() {
		uRegister.event();

	},
}
uRegister.init();