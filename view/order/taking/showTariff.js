var id = URL.getRequest().id;

(function($) {
	$.init();
})(mui);
showTariff = {
	// 事件注册
	event: function() {
		$("#saveTariffBtn").on('tap', showTariff.service.doTariffSave);
	},

	// 表单验证
	validate: function() {
		if($("#price").val() == "") {
			mui.alert("请您输入价格");
			return false;
		}
		return true;
	},

	service: {
		checkPrice: function() {
			$("#negotiatePrice").text($("#price").val());
		},
		doTariffSave: function() {
			if(!showTariff.validate()) {
				return false;
			}
			var data = {
				tariffPrice: $("#negotiatePrice").text(),
				orderId: id,
				picUrl: localStorage.getItem("tariff_photo"),
				remark: $("#remark").val()
			}
			apiHelper.post(CONSTANT.baseUrl + "/api/order/setTariff", JSON.stringify(data), function(flag, data) {
				if(data.status == AJAX_SECCUSS) {
					window.location.href = "SettingOrder.html" + "?id=" + id;
				} else {
					mui.toast(data.msg);
				}
			}, null, AJAX_BODY);

		},
	},
	dao: {},
	init: function() {
		showTariff.event();
	},
}
showTariff.init();