(function($) {
	$.init();
})(mui);

var step = 5;
var startIndex = 1;
var endIndex = 5;

$("#buyingList").on("tap", ".tap", function() {
	var id = $(this).data("id");
	

	
	var departureCity = $(this).attr("departureCity");
	var departureCountry = $(this).attr("departureCountry");
	var arrivalCity = $(this).attr("arrivalCity");
	var arrivalCountry = $(this).attr("arrivalCountry");
	var deadline = $(this).attr("deadline");
	var weight = $(this).attr("weight");
	var price = $(this).attr("price");

	window.location.href = "buyingDetail.html" + "?id=" + id + "&departureCity=" + departureCity  + "&departureCountry=" + departureCountry
	+ "&arrivalCity=" + arrivalCity + "&arrivalCountry=" + arrivalCountry + "&deadline=" + deadline + "&weight=" + weight + "&price=" + price;

});

$("#showAddBtnBuying").on("tap", "img", function(event) {

	buyingList.service.showPush();

});

$("#pushBuyingBtn").on("tap", "img", function() {
	buyingList.service.pushBuying();
});

$("#pushTakingBtn").on("tap", "img", function() {
	buyingList.service.pushTaking();
});

$("#closeBtn").on("tap", "img", function() {
	buyingList.service.closePush();
});

mui.init({
	pullRefresh: {
		container: "#buyingContainer", //待刷新区域标识，querySelector能定位的css选择器均可，比如：id、.class等
		up: {
			contentrefresh: '正在加载...', //可选，正在加载状态时，上拉加载控件上显示的标题内容
			contentnomore: '没有更多数据了', //可选，请求完毕若没有更多数据时显示的提醒内容；
			callback: function() {

				startIndex = startIndex + step;
				endIndex = endIndex + step;
				buyingList.service.doQuery(startIndex, endIndex, QUERY_MODE_UP);
			}
		},
	}
});
buyingList = {
	// 事件注册
	event: function() {

		$("#showMessge").on("click", buyingList.service.showMessage);
	},

	// 表单验证
	validate: function() {
		return true;
	},

	service: {

		doQuery: function(startIndex, endIndex, type) {
			$("#buyingList").empty();
			var $list = $("#buyingList");
			var data = {
				pageNo: startIndex,
				pageSize: endIndex
			};
			apiHelper.get(CONSTANT.baseUrl + "/api/requestBring/list", data, function(flag, data) {
				if(data.status == AJAX_SECCUSS) {
					//清空原来加载的数据
					if(type === QUERY_MODE_UP) {
						if(endIndex >= data.result.total) {
							mui('#buyingContainer').pullRefresh().endPullupToRefresh(true);
						} else {
							mui('#buyingContainer').pullRefresh().endPullupToRefresh(false);
						}
					}
					//下拉刷新
					if(type === QUERY_MODE_DOWN) {
						//关闭，下拉刷新
						list.html("");

						mui('#buyingContainer').pullRefresh().endPulldownToRefresh();
						//重置刷新
						mui('#buyingContainer').pullRefresh().refresh(true);
					}
					buyingList.service.doDraw($list, data.result.data);
				}
			});
		},
		doDraw: function(list, rows) {
			// 加载模板
			mui.get("buyingList-tmpl.html", function(data) {
				var container = $("<div style=''></div>");
				container.html(data);
				$.each(rows, function(index, result) {

					var li = "";
					li = $("<div class='tap' id='line'></div>");
					li.attr("data-id", result.id);

					li.attr("departureCity", result.departureCity);
					li.attr("departureCountry", result.departureCountry);
					li.attr("arrivalCity", result.arrivalCity);
					li.attr("arrivalCountry", result.arrivalCountry);
					li.attr("deadline", result.deadline.substring(0, 10));
					li.attr("weight", result.weight);
					li.attr("price", result.price);

					container.find("span[id=departureCity]").text(result.departureCity);
					container.find("span[id=departureCountry]").text(result.departureCountry);
					container.find("span[id=arrivalCity]").text(result.arrivalCity);
					container.find("span[id=arrivalCountry]").text(result.arrivalCountry);
					container.find("span[id=deadline]").text(result.deadline.substring(0, 10));
					container.find("span[id=weight]").text(result.weight);
					container.find("span[id=price]").text(result.price);
					// 模板渲染
					li.html(container.html());
					list.append(li);
				});
			}, "html");
		},

		showAdd: function() {
			$("#push").show();
		},
		showMessage: function() {
			window.location.href = "../../view/message/messageList.html";
		},
		pushBuying: function(event) {
			window.location.href = "../../view/buying/buyingPush.html";
			event.stopPropagation();
		},
		pushTaking: function(event) {
			window.location.href = "../../view/taking/takingPush.html";
			event.stopPropagation();
		},
		showPush: function() {

			$("#push").show();
		},
		closePush: function(event) {
			$("#push").hide();
			event.stopPropagation();
		},

	},

	dao: {},
	init: function() {
		buyingList.event();
		buyingList.service.doQuery(startIndex, endIndex, QUERY_MODE_UP);
	},
}
buyingList.init();