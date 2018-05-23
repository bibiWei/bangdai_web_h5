var id = URL.getRequest().id;

(function($) {
	$.init();
})(mui);

$("#matchBuyingList").on("tap", "#orderBbtn", function() {
	var helpBringId = $(this).parent().parent().parent().parent().data("id");
	window.location.href = "../../view/order/createOrder.html" + "?reqBringId=" + id + "&helpBringId=" + helpBringId +
		"&departureCity=" + $("#departureCity").text() + "&departureCountry=" + $("#departureCountry").text() +
		"&arrivalCity=" + $("#arrivalCity").text() + "&arrivalCountry=" + $("#arrivalCountry").text() +
		"&deadline=" + $("#deadline").text() + "&price=" + $("#price").text();
});

checkTaking = {
	// 事件注册
	event: function() {

	},

	// 表单验证
	validate: function() {
		return true;
	},

	service: {

		buyingInfo: function() {
			var data = {
				helpBringId: id,
			};
			apiHelper.get(CONSTANT.baseUrl + "/api/helpBring/detail", data, function(flag, data) {
				if(data.status == AJAX_SECCUSS) {
					$("#departureCity").text(data.result.departureCity);
					$("#departureCountry").text(data.result.departureCountry);
					$("#arrivalCity").text(data.result.arrivalCity);
					$("#arrivalCountry").text(data.result.arrivalCountry);
					$("#departureDate").text(data.result.departureDate.substring(0, 10));
					$("#arrivalDate").text(data.result.arrivalDate.substring(0, 10));
					$("#mateType").text(data.result.mateType);
					$("#price").text(data.result.price);
					if(data.result.matchedReqBringList.length != 0) {
						$("#matchBuyingList").empty();
						var $list = $("#matchBuyingList");
						checkTaking.service.doDraw($list, data.result.matchedReqBringList);
					}
				}
			});
		},

		doDraw: function(list, rows) {
			// 加载模板
			mui.get("checkTaking-tmpl.html", function(data) {
				var container = $("<div style=''></div>");
				container.html(data);
				$.each(rows, function(index, result) {
					var li = "";
					li = $("<div class='tap' id='line'></div>");
					li.attr("data-id", result.id);
					container.find("span[id=userName]").text(result.userName);
					container.find("span[id=departureCity]").text(result.departureCity);
					container.find("span[id=departureCountry]").text(result.departureCountry);
					container.find("span[id=arrivalCity]").text(result.arrivalCity);
					container.find("span[id=arrivalCountry]").text(result.arrivalCountry);
					container.find("span[id=deadline]").text(result.deadline.substring(0, 10));
					container.find("span[id=weight]").text(result.weight);
					container.find("span[id=mateType]").text(result.mateType);
					container.find("span[id=price]").text(result.price);
					// 模板渲染
					li.html(container.html());
					list.append(li);
				});
			}, "html");
		},

	},
	dao: {},
	init: function() {
		checkTaking.event();
		checkTaking.service.buyingInfo();
	},
}
checkTaking.init();