(function($) {
	$.init();
})(mui);
doCash = {
	// 事件注册
	event: function() {
		$("#doWithDrawBtn").on("tap", doCash.service.doWithDraw);
	},

	// 表单验证
	validate: function() {
		return true;
	},

	service: {
		doWithDraw: function() {
			var data = {
				payeeAccount: localStorage.getItem("payeeAccount"),
				payeeRealName: localStorage.getItem("payeeRealName"),
				amount: 0.01,
				type: 1,
			}
			apiHelper.post(CONSTANT.baseUrl + "/api/withdraw/req", JSON.stringify(data), function(flag, data) {
				if(data.status == AJAX_SECCUSS) {
				  window.location.href = "cashSuccess.html"
				} else {
					mui.toast(data.msg);
				}
			}, null, AJAX_BODY);
		}
	},

	dao: {},
	init: function() {
		doCash.event();
	},
}
doCash.init();