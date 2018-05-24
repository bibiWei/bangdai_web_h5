

$("#addressList").on("tap", ".tap", function() {
	var id = $(this).data("id");
	localStorage.setItem("checkAddress",$(this).attr("result"));
	window.location.href = "../../view/order/createOrder.html";
	


});

(function($) {
	$.init();
})(mui);
addressList = {
	// 事件注册
	event: function() {
		$("#addBtn").on("tap", addressList.service.addAddress);

	},

	// 表单验证
	validate: function() {
		return true;
	},

	service: {

		addAddress: function() {
			window.location.href = "addAddress.html";
		},

		getAddressList: function() {

			$("#addressList").empty();
			var $list = $("#addressList");
			var data = {

			};
			apiHelper.get(CONSTANT.baseUrl + "/api/contactAddress/list", data, function(flag, data) {
				if(data.status == AJAX_SECCUSS) {
					addressList.service.doDraw($list, data.result);
				}
			});
		},

		doDraw: function(list, rows) {
			// 加载模板
			mui.get("addressList-tmpl.html", function(data) {
				var container = $("<div style=''></div>");
				container.html(data);
				$.each(rows, function(index, result) {
					var li = "";
					li = $("<div class='tap' id='line'></div>");
					li.attr("data-id", result.id);
					li.attr("result", JSON.stringify(result));
			
					container.find("span[id=contactName]").text(result.contactName);
					container.find("span[id=phone]").text(result.phone);
					container.find("span[id=contactAddress]").text(result.contactAddress);
					li.html(container.html());
					list.append(li);
				});
			}, "html");
		},

	},
	dao: {},
	init: function() {
		addressList.event();
		addressList.service.getAddressList();
	},
}
addressList.init();