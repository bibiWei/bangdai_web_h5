var pageNo = 1;
var pageSize = 10;
var endIndex = 5;

$("#buying").on("tap", ".pruduct", function() {
	var id = $(this).parent().parent().parent().data("id");
	var status = $(this).parent().parent().parent().attr("status");
	localStorage.setItem("buyingOrder-info", $(this).parent().parent().parent().attr("result"));

	if(status == ORDER_START) {
		window.location.href = "../order/taking/takingConfirmOrder.html" + "?id=" + id;
	} else if(status == ORDER_CONFRM) {
		window.location.href = "../order/buying/buyingOrder.html" + "?id=" + id;
	}else if (status == ORDER_SUC){
		window.location.href = "../order/buying/buyingOrderSuc.html" + "?id=" + id;
	}
});

$("#taking").on("tap", ".pruduct", function() {

	var id = $(this).parent().parent().parent().parent().data("id");
	var status = $(this).parent().parent().parent().parent().attr("status");
	localStorage.setItem("takingOrder-info", $(this).parent().parent().parent().parent().attr("result"));

	if(status == ORDER_START) {
		window.location.href = "../order/taking/takingConfirmOrder.html" + "?id=" + id;
	} else if(status == ORDER_CONFRM) {
		window.location.href = "../order/taking/SettingOrder.html" + "?id=" + id;
	}

});

mui.init({
	pullRefresh: {
		container: '#pullrefresh',
		up: {
			contentrefresh: '正在加载...',
			callback: pullupRefresh
		}
	}
});

function pullupRefresh() {
	setTimeout(function() {
		messageList.service.doQuery();
	}, 500);
}

(function($) {
	$.init();
})(mui);
myOrderList = {
	// 事件注册
	event: function() {
		$("#takingOrder").on("tap", myOrderList.service.showTakingOrder);
		$("#buyingOrder").on("tap", myOrderList.service.showBuyingOrder);
	},

	// 表单验证
	validate: function() {
		return true;
	},

	service: {
		getTakingOrderList: function() {
			var type = QUERY_MODE_UP;
			$("#taking").empty();
			var $list = $("#taking");
			var data = {
				pageNo: pageNo,
				pageSize: pageSize
			};
			apiHelper.get(CONSTANT.baseUrl + "/api/order/listHelpOrders", data, function(flag, data) {
				if(data.status == AJAX_SECCUSS) {
					if(type === QUERY_MODE_UP) {
						if(endIndex >= data.result.total) {
							mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
						} else {
							mui('#pullrefresh').pullRefresh().endPullupToRefresh(false);
						}
					}
					//下拉刷新
					if(type === QUERY_MODE_DOWN) {
						//关闭，下拉刷新
						list.html("");

						mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
						//重置刷新
						mui('#pullrefresh').pullRefresh().refresh(true);
					}
					myOrderList.service.doDrawTaking($list, data.result);
				}
			});
		},

		getBuyingOrderList: function() {
			var type = QUERY_MODE_UP;
			$("#buying").empty();
			var $list = $("#buying");
			var data = {
				pageNo: pageNo,
				pageSize: pageSize
			};
			apiHelper.get(CONSTANT.baseUrl + "/api/order/listReqOrders", data, function(flag, data) {
				if(data.status == AJAX_SECCUSS) {
					if(type === QUERY_MODE_UP) {
						if(endIndex >= data.result.total) {
							mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
						} else {
							mui('#pullrefresh').pullRefresh().endPullupToRefresh(false);
						}
					}
					//下拉刷新
					if(type === QUERY_MODE_DOWN) {
						//关闭，下拉刷新
						list.html("");

						mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
						//重置刷新
						mui('#pullrefresh').pullRefresh().refresh(true);
					}
					myOrderList.service.doDrawBuying($list, data.result);
				}
			});
		},

		doDrawTaking: function(list, rows) {
			mui.get("myOrderListT-tmpl.html", function(data) {
				var container = $("<div style=''></div>");
				container.html(data);
				$.each(rows, function(index, result) {
					var li = "";
					li = $("<div class='tap' id='line'></div>");
					li.attr("data-id", result.id);
					li.attr("result", JSON.stringify(result));
					li.attr("status", result.status);
					container.find("div[id=productId]").attr("data-id", result.id);
					container.find("span[id=departureCity]").text(result.reqBringVo.departureCity);
					container.find("span[id=departureCountry]").text(result.reqBringVo.departureCountry);
					container.find("span[id=arrivalCity]").text(result.reqBringVo.arrivalCity);
					container.find("span[id=arrivalCountry]").text(result.reqBringVo.arrivalCountry);
					container.find("span[id=deadline]").text(result.reqBringVo.deadline.substring(0, 10));
					container.find("span[id=price]").text(result.reqBringVo.price);
					container.find("span[id=weight]").text(result.reqBringVo.weight);
					container.find("span[id=type]").text(result.type);
					container.find("span[id=negotiatePrice]").text(result.negotiatePrice);

					if(result.status == ORDER_START) {
						container.find("span[id=status]").text("待确认");
					} else if(result.status == ORDER_CONFRM) {
						container.find("span[id=status]").text("已确认");
					}
					container.find("span[id=departureCity-d]").text(result.reqBringVo.departureCity);
					container.find("span[id=departureCountry-d]").text(result.reqBringVo.departureCountry);
					container.find("span[id=arrivalCity-d]").text(result.reqBringVo.arrivalCity);
					container.find("span[id=arrivalCountry-d]").text(result.reqBringVo.arrivalCountry);
					// 模板渲染
					li.html(container.html());
					list.append(li);
				});
			}, "html");
		},

		doDrawBuying: function(list, rows) {
			// 加载模板
			mui.get("myOrderListB-tmpl.html", function(data) {
				var container = $("<div style=''></div>");
				container.html(data);
				$.each(rows, function(index, result) {
					var li = "";
					li = $("<div class='tap' id='line'></div>");
					li.attr("data-id", result.id);
					li.attr("result", JSON.stringify(result));
					li.attr("status", result.status);
					container.find("span[id=departureCity]").text(result.helpBringVo.departureCity);
					container.find("span[id=departureCountry]").text(result.helpBringVo.departureCountry);
					container.find("span[id=arrivalCity]").text(result.helpBringVo.arrivalCity);
					container.find("span[id=arrivalCountry]").text(result.helpBringVo.arrivalCountry);
					container.find("span[id=weight]").text(result.helpBringVo.weight);
					container.find("span[id=price]").text(result.helpBringVo.price);
					container.find("span[id=type]").text(result.type);
					container.find("span[id=negotiatePrice]").text(result.negotiatePrice);

					if(result.status == ORDER_START) {
						container.find("span[id=status]").text("待确认");
					} else if(result.status == ORDER_CONFRM) {
						container.find("span[id=status]").text("待支付");
					}
					container.find("span[id=departureCity-d]").text(result.helpBringVo.departureCity);
					container.find("span[id=departureCountry-d]").text(result.helpBringVo.departureCountry);
					container.find("span[id=arrivalCity-d]").text(result.helpBringVo.arrivalCity);
					container.find("span[id=arrivalCountry-d]").text(result.helpBringVo.arrivalCountry);
					// 模板渲染
					li.html(container.html());
					list.append(li);
				});
			}, "html");
		},

		showTakingOrder: function() {
			$("#taking").show();
			$("#buying").hide();
			myOrderList.service.getTakingOrderList();
		},
		showBuyingOrder: function() {
			$("#taking").hide();
			$("#buying").show();
			myOrderList.service.getBuyingOrderList();
		}
	},
	dao: {},
	init: function() {
		myOrderList.event();
		myOrderList.service.getBuyingOrderList();
	},
}
myOrderList.init();