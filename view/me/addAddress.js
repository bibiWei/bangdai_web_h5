(function($) {
	$.init();
})(mui);
addAddress = {
	// 事件注册
	event: function() {
		$("#showStartPicker").on("tap", addAddress.service.showStartPicker);
		$("#saveBtn").on("tap", addAddress.service.doSave);
	},

	// 表单验证
	validate: function() {
		return true;
	},

	service: {

		doSave: function() {
			var data = {
				phone: $("#phone").val(),
				contactName: $("#contactName").val(),
				contactAddress: $("#startPlaceName").text() + $("#detail").val()
			};
			apiHelper.post(CONSTANT.baseUrl + "/api/contactAddress/add", JSON.stringify(data), function(flag, data) {
				if(data.status == AJAX_SECCUSS) {
					mui.alert('添加成功', function() {
						window.location.href = "addressList.html";
					});
				} else {
					mui.toast(data.msg);
				}
			}, null, AJAX_BODY);
		},

		showStartPicker: function() {
			var startPicker = new mui.PopPicker({
				layer: 2
			});
			startPicker.setData(staticAreaData);
			startPicker.show(function(items) {
				$("#showStartPicker").attr("data-province", items[0].text);
				$("#showStartPicker").attr("data-city", items[1].text);
				$("#startPlaceName").text(items[0].text + items[1].text);

			});
		},
	},
	dao: {},
	init: function() {
		addAddress.event();
	},
}
addAddress.init();