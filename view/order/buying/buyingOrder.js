var id = URL.getRequest().id;

(function($) {
	$.init();
})(mui);
buyingOrder = {
	// 事件注册
	event: function() {
		$("#confirmBtn").on('tap', buyingOrder.service.uglBtn);
		$("#setTariffBtn").on('tap', buyingOrder.service.showTariff);
		$("#setPostageBtn").on('tap', buyingOrder.service.showPostage);
	},

	// 表单验证
	validate: function() {
		return true;
	},

	service: {
		uglBtn: function() {
			mui.alert("进行争议");
		},
		orderInfo: function() {
			var orderInfo = JSON.parse(localStorage.getItem("buyingOrder-info"));
			$("#receiver").text(orderInfo.receiver);
			$("#phone").text(orderInfo.phone);
			$("#arrivalAddr").text(orderInfo.arrivalAddr);
			$("#type").text(orderInfo.type);
			$("#weight").text(orderInfo.weight);
			$("#negotiatePrice").text(orderInfo.negotiatePrice);
			$("#totalPrice").text(orderInfo.totalPrice);
			$("#price").text(orderInfo.helpBringVo.price);
			$("#departureCity").text(orderInfo.helpBringVo.departureCity);
			$("#departureCountry").text(orderInfo.helpBringVo.departureCountry);
			$("#arrivalCity").text(orderInfo.helpBringVo.arrivalCity);
			$("#arrivalCountry").text(orderInfo.helpBringVo.arrivalCountry);

			if(orderInfo.orderTariffVo != null) {
				$("#tariffPrice").text(orderInfo.orderTariffVo.tariffPrice);
				$("#tpicUrl").attr("src", orderInfo.orderTariffVo.picUrl);
				$a("#tremarks").text(orderInfo.orderTariffVo.remarks);
				$("#totalTprice").text(orderInfo.orderTariffVo.tariffPrice + "元");
			}else{
				$("#setTariffBtn").hide();
			}
			if(orderInfo.orderPostageVo != null) {
				$("#logisticsPrice").text(orderInfo.orderPostageVo.logisticsPrice);
				$("#ppicUrl").attr("src", orderInfo.orderPostageVo.picUrl);
				$("#premarks").text(orderInfo.orderPostageVo.remarks);
				$("#totalTprice").text(orderInfo.orderPostageVo.logisticsPrice + "元");
			}else{
				$("#setPostageBtn").hide();
			}
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
		},
		showTariff: function() {
			//window.location.href = "showTariff.html" + "?id=" + id;
		},
		showPostage: function() {
			//window.location.href = "showPostage.html" + "?id=" + id;
		}
	},
	dao: {},
	init: function() {
		buyingOrder.event();
		buyingOrder.service.orderInfo();
	},
}
buyingOrder.init();