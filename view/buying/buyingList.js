(function($) {
	$.init();
})(mui);
buyingList = {
	// 事件注册
	event: function() {
	},

	// 表单验证
	validate: function() {
		return true;
	},

	service: {
	},

	dao: {},
	init: function() {
		buyingList.event();

	},
}
buyingList.init();