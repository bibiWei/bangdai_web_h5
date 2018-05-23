var id = URL.getRequest().id;
var departureCity = decodeURI(URL.getRequest().departureCity);
var departureCountry = decodeURI(URL.getRequest().departureCountry);
var arrivalCity = decodeURI(URL.getRequest().arrivalCity);
var arrivalCountry = decodeURI(URL.getRequest().arrivalCountry);
var departureDate = decodeURI(URL.getRequest().departureDate);
var arrivalDate = decodeURI(URL.getRequest().arrivalDate);
var remarks = decodeURI(URL.getRequest().remarks);

(function($) {
	$.init();
})(mui);

takingDetail = {
	// 事件注册
	event: function() {
		$("#showBuyingList").on("tap", takingDetail.service.showBuyingList);
	},

	// 表单验证
	validate: function() {
		return true;
	},

	service: {

		showBuyingList:function(){
			window.location.href = "checkTaking.html" +"?id=" + id;
		},
		takingInfo: function() {
			$("#departureCity").text(departureCity);
			$("#departureCountry").text(departureCountry);
			$("#arrivalCity").text(arrivalCity);
			$("#arrivalCountry").text(arrivalCountry);
			$("#departureDate").text(departureDate);
			$("#arrivalDate").text(arrivalDate);
			$("#remarks").text(remarks);
			var userInfo = JSON.parse(localStorage.getItem("userVo"));
			$("#nickName").text(userInfo.nickName);
		}
	},
	dao: {},
	init: function() {
		takingDetail.event();
		takingDetail.service.takingInfo();
	},
}
takingDetail.init();