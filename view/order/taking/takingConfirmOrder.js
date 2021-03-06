var id = URL.getRequest().id;

(function($) {
	$.init();
})(mui);
takingConfirmOrder = {
	// 事件注册
	event: function() {
		$("#confirmBtn").on('tap', takingConfirmOrder.service.confirmOrder);
		$("#cancleBtn").on('tap', takingConfirmOrder.service.cancleBtn);

	},

	// 表单验证
	validate: function() {
		return true;
	},

	service: {
		orderInfo: function() {
			var orderInfo = JSON.parse(localStorage.getItem("takingOrder-info"));
			$("#receiver").text(orderInfo.receiver);
			$("#phone").text(orderInfo.phone);
			$("#arrivalAddr").text(orderInfo.arrivalAddr);
			$("#type").text(orderInfo.type);
			$("#weight").text(orderInfo.weight);
			$("#negotiatePrice").text(orderInfo.negotiatePrice);
			$("#totalPrice").text(orderInfo.totalPrice);
			$("#price").text(orderInfo.reqBringVo.price);
			$("#departureCity").text(orderInfo.reqBringVo.departureCity);
			$("#departureCountry").text(orderInfo.reqBringVo.departureCountry);
			$("#arrivalCity").text(orderInfo.reqBringVo.arrivalCity);
			$("#arrivalCountry").text(orderInfo.reqBringVo.arrivalCountry);

		},

		confirmOrder: function() {
			var data = {
				orderId: id
			};
			apiHelper.post(CONSTANT.baseUrl + "/api/order/confirm", data, function(flag, data) {
				if(data.status == AJAX_SECCUSS) {
					mui.alert('确认订单成功', function() {
						window.location.href = "../../../view/me/myOrderList.html";
					});
				}
			});
		},
		cancleBtn: function() {
			var data = {
				orderId: id
			};
			apiHelper.post(CONSTANT.baseUrl + "/api/order/cancel" + id, data, function(flag, data) {
				if(data.status == AJAX_SECCUSS) {
					mui.alert('取消订单成功', function() {
						window.location.href = "../../../view/me/myOrderList.html";
					});
				}
			});
		}
	},
	dao: {},
	init: function() {
		takingConfirmOrder.event();
		takingConfirmOrder.service.orderInfo();
	},
}
takingConfirmOrder.init();