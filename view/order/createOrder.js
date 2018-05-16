var id = URL.getRequest().buyingId;
var departureCity = decodeURI(URL.getRequest().departureCity);
var departureCountry = decodeURI(URL.getRequest().departureCountry);
var arrivalCity = decodeURI(URL.getRequest().arrivalCity);
var arrivalCountry = decodeURI(URL.getRequest().arrivalCountry);
var deadline = decodeURI(URL.getRequest().deadline);
var weight = decodeURI(URL.getRequest().weight);
var price = decodeURI(URL.getRequest().price);

(function($) {
	$.init();
})(mui);
createOrder = {
	// 事件注册
	event: function() {
		$("#createOrderBtn").on('tap', createOrder.service.doCreate);
	},

	// 表单验证
	validate: function() {
		return true;
	},

	service: {
		orderInfo: function() {
			$("#departureCity").text(departureCity);
			$("#departureCountry").text(departureCountry);
			$("#arrivalCity").text(arrivalCity);
			$("#arrivalCountry").text(arrivalCountry);
			$("#deadline").text(deadline);
			$("#weight").text(weight);
			$("#price").text(price);
			var userInfo = JSON.parse(localStorage.getItem("userVo"));
			$("#nickName").text(userInfo.nickName);
			$("#negotiatePrice").text(price);
		},

		doCreate: function() {
			var data = {
				reqBringId: parseInt(id),
				helpBringId:1,
				type:"手机",
				negotiatePrice: $("#negotiatePrice").text(),
				weight: weight,
				receiver:$("#receiver").text(),
				arrivalAddr:$("#arrivalAddr").text(),
				phone:$("#phone").text()
			}
			apiHelper.post(CONSTANT.baseUrl + "/api/order/new", JSON.stringify(data), function(flag, data) {
				if(data.status == AJAX_SECCUSS) {
					window.location.href = "../../view/buying/buyingList.html"
				} else {
					mui.toast(data.msg);
				}
			}, null, AJAX_BODY);
		}

	},
	dao: {},
	init: function() {
		createOrder.event();
		createOrder.service.orderInfo();
	},
}
createOrder.init();