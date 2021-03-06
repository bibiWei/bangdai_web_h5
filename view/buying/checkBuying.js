var id = URL.getRequest().id;



(function($) {
	$.init();
})(mui);

$("#matchTakingList").on("tap", "#orderBbtn", function() {
	var helpBringId = $(this).parent().parent().parent().parent().data("id");
	window.location.href = "../../view/order/createOrder.html" + "?reqBringId=" + id + "&helpBringId=" + helpBringId
	+"&departureCity=" + $("#departureCity").text() +"&departureCountry=" + $("#departureCountry").text() + 
	"&arrivalCity=" + $("#arrivalCity").text() + "&arrivalCountry=" + $("#arrivalCountry").text() +
	"&deadline=" +  $("#deadline").text() + "&price=" + $("#price").text();	
});

checkBuying = {
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
				reqBringId: id,
			};
			apiHelper.get(CONSTANT.baseUrl + "/api/requestBring/detail", data, function(flag, data) {
				if(data.status == AJAX_SECCUSS) {
					$("#departureCity").text(data.result.departureCity);
					$("#departureCountry").text(data.result.departureCountry);
					$("#arrivalCity").text(data.result.arrivalCity);
					$("#arrivalCountry").text(data.result.arrivalCountry);
					$("#deadline").text(data.result.deadline.substring(0, 10));
					$("#mateType").text(data.result.mateType);
					$("#price").text(data.result.price);
					if(data.result.matchedHelpBringList.length != 0) {
						$("#matchTakingList").empty();
						var $list = $("#matchTakingList");
						checkBuying.service.doDraw($list, data.result.matchedHelpBringList);
					}
				}
			});
		},

		doDraw: function(list, rows) {
			// 加载模板
			mui.get("checkBuying-tmpl.html", function(data) {
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
					container.find("span[id=departureDate]").text(result.departureDate.substring(0,10));
					container.find("span[id=arrivalDate]").text(result.arrivalDate.substring(0,10));
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
		checkBuying.event();
		checkBuying.service.buyingInfo();
	},
}
checkBuying.init();