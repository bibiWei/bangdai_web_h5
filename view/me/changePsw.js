(function($) {
	$.init();
})(mui);
changePsw = {
	// 事件注册
	event: function() {
		$("#changeBtn").on("tap", changePsw.service.doChangePsw);
	},

	// 表单验证
	validate: function() {
		if($("#oldPsw").val() == "") {
			mui.alert("请您输入旧密码");
			return false;
		}
		if($("#newPsw").val() == "") {
			mui.alert("请您输入新密码");
			return false;
		}
		if($("#confirmPsw").val() == "") {
			mui.alert("请您再次输入新密码");
			return false;
		}
		if($("#confirmPsw").val() != $("#newPsw").val()) {
			mui.alert("您两次输入的密码不一致");
			return false;
		}
		return true;
	},

	service: {
		doChangePsw: function() {
			if(!changePsw.validate()) {
				return false;
			}
			var data = {
				oldPassword: $("#oldPsw").val(),
				newPassword: $("#confirmPsw").val()
			}
			apiHelper.post(CONSTANT.baseUrl + "/api/updPassword", data, function(flag, data) {
				if(data.status == AJAX_SECCUSS) {
					mui.alert('重置成功', function() {
					    window.location.href = "../../uLogin.html";
					});
				} else {
					mui.toast('您输入的验证码有误');
				}
			});
		}
	},
	dao: {},
	init: function() {
		changePsw.event();
	},
}
changePsw.init();