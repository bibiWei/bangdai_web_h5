mui.init({

});

findPsw = {

	// 事件注册
	event: function() {
		$("#showAreaCodePicker").on("click", findPsw.service.showAreaCodePicker);
	},

	// 表单验证
	validate: function() {},

	service: {
		showAreaCodePicker: function() {
			var sexPicker = new mui.PopPicker();
			sexPicker.setData(areaData);
			sexPicker.show(function(items) {
				$("#showAreaCodePicker").val(items[0].text);
				$("#showAreaCodePicker").attr("countryCode", items[0].value);
			});
		},
	},
	dao: {},
	init: function() {
		findPsw.event();
	},
}
findPsw.init();