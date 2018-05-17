var id = URL.getRequest().id;

(function($) {
	$.init();
})(mui);
assess = {
	// 事件注册
	event: function() {
		$("#assessBtn").on("tap", assess.service.doAssesss);
	},

	// 表单验证
	validate: function() {
		if(starIndex === -1){
			mui.alert("请您完成评价");
			return false;
		}
		return true;
	},

	service: {
		doAssesss: function() {
			if(!assess.validate()) {
				return false;
			}
			var data = {
				type:ACCESS_BUYING,
				orderId:id,
				star:starIndex,
				accessment:$("#accessment").val()
			}
			apiHelper.post(CONSTANT.baseUrl + "/api/order/assess", JSON.stringify(data), function(flag, data) {
				if(data.status == AJAX_SECCUSS) {
					mui.alert('发布成功', function() {
						window.location.href = "../../../view/order/buying/buyingOrderSuc.html" + "?id=" + id;
					});
				} else {
					mui.toast(data.msg);
				}
			}, null, AJAX_BODY);
		},

	},
	dao: {},
	init: function() {
		assess.event();
	},
}
assess.init();