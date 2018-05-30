(function($) {
	$.init();
})(mui);
center = {
	// 事件注册
	event: function() {
		$("#changePsw").on("tap", center.service.showChangePsw);
		$("#logoutBtn").on("tap", center.service.doLogout);
	},

	// 表单验证
	validate: function() {
		return true;
	},

	service: {
		showChangePsw: function() {
			window.location.href = "changePsw.html"
		},
		doLogout: function() {
			var data = {};
			apiHelper.post(CONSTANT.baseUrl + "/api/logout", data, function(flag, data) {
				if(data.status == AJAX_SECCUSS) {
					debugger;
					localStorage.removeItem("token");
					window.location.href = "../../uLogin.html";
				}
			});
		}
	},
	dao: {},
	init: function() {
		center.event();
	},
}
center.init();