(function($) {
	$.init();
})(mui);

var step = 5;
var startIndex = 1;
var endIndex = 5;

$("#takingList").on("tap", ".tap", function() {
	var id = $(this).data("id");
	var departureCity = $(this).attr("departureCity");
	var departureCountry = $(this).attr("departureCountry");
	var arrivalCity = $(this).attr("arrivalCity");
	var arrivalCountry = $(this).attr("arrivalCountry");
	var departureDate = $(this).attr("departureDate");
	var arrivalDate = $(this).attr("arrivalDate");
	var remarks = $(this).attr("remarks");
	window.location.href = "takingDetail.html" + "?id="+id+ "&departureCity=" + departureCity + "&departureCountry=" + departureCountry 
	+ "&arrivalCity=" + arrivalCity + "&arrivalCountry=" + arrivalCountry + "&departureDate=" + departureDate + "&arrivalDate=" + arrivalDate + "&remarks=" + remarks ;
});

mui.init({
	pullRefresh: {
		container: "#takingContainer", //待刷新区域标识，querySelector能定位的css选择器均可，比如：id、.class等
		up: {
			contentrefresh: '正在加载...', //可选，正在加载状态时，上拉加载控件上显示的标题内容
			contentnomore: '没有更多数据了', //可选，请求完毕若没有更多数据时显示的提醒内容；
			callback: function() {
				startIndex = startIndex + step;
				endIndex = endIndex + step;
				takingList.service.doQuery(startIndex, endIndex, QUERY_MODE_UP);
			}
		},
	}
});
takingList = {
	// 事件注册
	event: function() {
		$("#pushBuyingBtn").on("click", takingList.service.pushBuying);
		$("#pushTakingBtn").on("click", takingList.service.pushTaking);
	},

	// 表单验证
	validate: function() {
		return true;
	},

	service: {
		doQuery: function(startIndex, endIndex, type) {
			$("#takingList").empty();
			var $list = $("#takingList");
			var data = {
				pageNo: startIndex,
				pageSize: endIndex
			};
			apiHelper.get(CONSTANT.baseUrl + "/api/helpBring/list", data, function(flag, data) {
				if(data.status == AJAX_SECCUSS) {
					//清空原来加载的数据
					if(type === QUERY_MODE_UP) {
						if(endIndex >= data.result.totalNumber) {
							mui('#takingContainer').pullRefresh().endPullupToRefresh(true);
						} else {
							mui('#takingContainer').pullRefresh().endPullupToRefresh(false);
						}
					}
					//下拉刷新
					if(type === QUERY_MODE_DOWN) {
						//关闭，下拉刷新
						list.html("");

						mui('#takingContainer').pullRefresh().endPulldownToRefresh();
						//重置刷新
						mui('#takingContainer').pullRefresh().refresh(true);
					}
					takingList.service.doDraw($list, data.result.data);
				}
			});
		},
		doDraw: function(list, rows) {
			// 加载模板
			mui.get("takingList-tmpl.html", function(data) {
				var container = $("<div style=''></div>");
				container.html(data);
				$.each(rows, function(index, result) {

					var li = "";
					li = $("<div class='tap' id='line'></div>");
					li.attr("data-id",result.id);	
					li.attr("departureCountry",result.departureCountry);
					li.attr("departureCity",result.departureCity)
					li.attr("arrivalCity",result.arrivalCity);
					li.attr("arrivalCountry",result.arrivalCountry);
					li.attr("departureDate",result.departureDate.substring(0, 19));
					li.attr("arrivalDate",result.arrivalDate.substring(0, 19));
					li.attr("remarks",result.remarks);
					
					container.find("span[id=departureCity]").text(result.departureCity);
					container.find("span[id=departureCountry]").text(result.departureCountry);
					container.find("span[id=arrivalCity]").text(result.arrivalCity);
					container.find("span[id=arrivalCountry]").text(result.arrivalCountry);
					if(null !== result.departureDate) {
						container.find("span[id=departureDate]").text(result.departureDate.substring(0, 19));
					}
					if(null != result.arrivalDate) {
						container.find("span[id=arrivalDate]").text(result.arrivalDate.substring(0, 19));
					}
					// 模板渲染
					li.html(container.html());
					list.append(li);
				});
			}, "html");
		},

		showAdd: function() {
			$("#push").show();
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
		takingList.event();
		takingList.service.doQuery(startIndex, endIndex, QUERY_MODE_UP);
	},
}
takingList.init();