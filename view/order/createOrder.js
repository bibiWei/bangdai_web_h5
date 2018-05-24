var id = URL.getRequest().buyingId;
var departureCity = decodeURI(URL.getRequest().departureCity);
var departureCountry = decodeURI(URL.getRequest().departureCountry);
var arrivalCity = decodeURI(URL.getRequest().arrivalCity);
var arrivalCountry = decodeURI(URL.getRequest().arrivalCountry);
var deadline = decodeURI(URL.getRequest().deadline);
var weight = decodeURI(URL.getRequest().weight);
var price = decodeURI(URL.getRequest().price);

var reqBringId = URL.getRequest().reqBringId;
var helpBringId = URL.getRequest().helpBringId;

(function($) {
	$.init();
})(mui);
createOrder = {
	// 事件注册
	event: function() {
		$("#createOrderBtn").on('tap', createOrder.service.doCreateOrder);
		$("#addressShow").on('tap', createOrder.service.doAddressShow);
	},

	// 表单验证
	validate: function() {
		return true;
	},

	service: {
		orderInfo: function() {
			var addressInfo = JSON.parse(localStorage.getItem("checkAddress"));

			if(addressInfo != null) {

				$("#receiver").text(addressInfo.contactName);
				$("#arrivalAddr").text(addressInfo.contactAddress);
				$("#phone").text(addressInfo.phone);
			}
			$("#departureCity").text(departureCity);
			$("#departureCountry").text(departureCountry);
			$("#arrivalCity").text(arrivalCity);
			$("#arrivalCountry").text(arrivalCountry);
			$("#deadline").text(deadline);
			if(weight == "undefined") {
				weight = '';
			}
			$("#weight").text(weight);
			$("#price").text(price);
			var userInfo = JSON.parse(localStorage.getItem("userVo"));
			$("#nickName").text(userInfo.nickName);
			$("#negotiatePrice").text(price);

		},

		doCreateOrder: function() {
			if(id == "undefined") {
				createOrder.service.doCreate();
			} else {
				createOrder.service.doCheckCreate();
			}
		},

		doAddressShow: function() {
			window.location.href = "../../view/me/addressList.html"
		},

		doCheckCreate: function() {
			var data = {
				helpBringId: parseInt(helpBringId),
				reqBringId: parseInt(reqBringId),
				type: "手机",
				negotiatePrice: $("#negotiatePrice").text(),
				weight: weight,
				receiver: $("#receiver").text(),
				arrivalAddr: $("#arrivalAddr").text(),
				phone: $("#phone").text()
			};
			apiHelper.post(CONSTANT.baseUrl + "/api/order/new", JSON.stringify(data), function(flag, data) {
				if(data.status == AJAX_SECCUSS) {
					window.location.href = "../../view/buying/buyingList.html"
				} else {
					mui.toast(data.msg);
				}
			}, null, AJAX_BODY);
		},

		doCreate: function() {
			var data = {
				helpBringId: parseInt(id),
				type: "手机",
				negotiatePrice: $("#negotiatePrice").text(),
				weight: weight,
				receiver: $("#receiver").text(),
				arrivalAddr: $("#arrivalAddr").text(),
				phone: $("#phone").text()
			};
			apiHelper.post(CONSTANT.baseUrl + "/api/order/newByHelpBring", JSON.stringify(data), function(flag, data) {
				if(data.status == AJAX_SECCUSS) {
					window.location.href = "../../view/buying/buyingList.html"
				} else {
					mui.toast(data.msg);
				}
			}, null, AJAX_BODY);
		},
		checkPrice: function() {
			$("#negotiatePrice").text($("#price").val());
		}
	},
	dao: {},
	init: function() {
		createOrder.event();
		createOrder.service.orderInfo();
	},
}
createOrder.init();