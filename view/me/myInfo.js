

(function($) {
	$.init();
})(mui);
myInfo = {
	// 事件注册
	event: function() {
		$("#orderListBtn").on("click",myInfo.service.showMyOrder);
	},

	// 表单验证
	validate: function() {
		return true;
	},

	service: {
		showMyOrder:function(){
			window.location.href = "../../view/me/myOrderList.html"
		}
	},
	dao: {},
	init: function() {
		myInfo.event();

	},
}
myInfo.init();