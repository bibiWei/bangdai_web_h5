var id = URL.getRequest().id;

(function($) {
	$.init();
})(mui);
buyingOrderSuc = {
	// 事件注册
	event: function() {
		$("#assessBtn").on("tap",buyingOrderSuc.service.showAssess);
	},

	// 表单验证
	validate: function() {
		return true;
	},

	service: {
		showAssess:function(){
			debugger;
			window.location.href = "../../../view/order/buying/assess.html" +"?id=" + id;
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
			}
			if(orderInfo.orderPostageVo != null) {
				$("#logisticsPrice").text(orderInfo.orderPostageVo.logisticsPrice);
				$("#ppicUrl").attr("src", orderInfo.orderPostageVo.picUrl);
				$("#premarks").text(orderInfo.orderPostageVo.remarks);
				$("#totalTprice").text(orderInfo.orderPostageVo.logisticsPrice + "元");
			}
		},

	},
	dao: {},
	init: function() {
		buyingOrderSuc.event();
		buyingOrderSuc.service.orderInfo();
	},
}
buyingOrderSuc.init();