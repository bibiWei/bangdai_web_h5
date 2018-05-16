

(function($) {
	$.init();
})(mui);
common = {
	// 事件注册
	event: function() {
		$("#takingNav").on("tap",common.service.showTakingList);
		$("#buyingNav").on("tap",common.service.showBuyingList);
		$("#circleNav").on("tap",common.service.showCircleList);
		$("#mineNav").on("tap",common.service.showMineList);
	},

	// 表单验证
	validate: function() {
		return true;
	},

	service: {
		showBuyingList:function(){
			window.location.href = "../../view/buying/buyingList.html"
		},
		showTakingList:function(){
			window.location.href = "../../view/taking/takingList.html"
		},
		showCircleList:function(){
			window.location.href = "../../view/circle/circleList.html"
		},
		showMineList:function(){
			window.location.href = "../../view/me/center.html"
		}
		
	},
	dao: {},
	init: function() {
		common.event();

	},
}
common.init();