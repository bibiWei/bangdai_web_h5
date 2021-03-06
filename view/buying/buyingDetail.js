var id = URL.getRequest().id;
var departureCity = decodeURI(URL.getRequest().departureCity);
var departureCountry = decodeURI(URL.getRequest().departureCountry);
var arrivalCity = decodeURI(URL.getRequest().arrivalCity);
var arrivalCountry = decodeURI(URL.getRequest().arrivalCountry);
var deadline = decodeURI(URL.getRequest().deadline);
var weight = decodeURI(URL.getRequest().weight);
var price = decodeURI(URL.getRequest().price);
var remarks = decodeURI(URL.getRequest().remarks);

(function($) {
	$.init();
})(mui);
buyingDetail = {
	// 事件注册
	event: function() {
		$("#addOrder").on("click", buyingDetail.service.addOrder);
		
		$("#buyingCheckList").on("tap",buyingDetail.service.showBuyingCheckList);

	},

	// 表单验证
	validate: function() {
		return true;
	},

	service: {
		
		showBuyingCheckList:function(){
			window.location.href = "checkBuying.html" + "?id=" + id;
		},
		buyingInfo: function() {
			$("#departureCity").text(departureCity);
			$("#departureCountry").text(departureCountry);
			$("#arrivalCity").text(arrivalCity);
			$("#arrivalCountry").text(arrivalCountry);
			$("#deadline").text(deadline);
			$("#weight").text(weight);
			$("#price").text(price);
			$("#remarks").text(remarks);
			var userInfo = JSON.parse(localStorage.getItem("userVo"));
			$("#nickName").text(userInfo.nickName);
		},
		addOrder: function() {
			window.location.href = "../../view/order/createOrder.html" + "?buyingId=" + id + "&departureCity=" + departureCity + "&departureCountry=" + departureCountry +
				"&arrivalCity=" + arrivalCity + "&arrivalCountry=" + arrivalCountry + "&deadline=" + deadline + "&weight=" + weight + "&price=" + price + "&remarks=" + remarks ;
		}
	},
	dao: {},
	init: function() {
		buyingDetail.event();
		buyingDetail.service.buyingInfo();
	},
}
buyingDetail.init();