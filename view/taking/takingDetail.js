(function($) {
	$.init();
})(mui);

takingDetail = {
	// 事件注册
	event: function() {},

	// 表单验证
	validate: function() {
		return true;
	},

	service: {

		takingDetail: function() {
			var data = {}
			apiHelper.post(CONSTANT.baseUrl + "/warehouseSourceInfo/detail/" + id, data, function(flag, data) {
				if(data.status == AJAX_SECCUSS) {
				}
			});
		}
	},
	dao: {},
	init: function() {
		takingDetail.event();
	},
}
takingDetail.init();