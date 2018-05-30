(function($) {
	$.init();
})(mui);

var step = 5;
var pageNo = 1;
var pageSize = 1;
var totalAmout = 0;

$("#myTakingList").on("tap", ".tap", function() {
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
				pageNo = pageNo + 1;
				myTakingList.service.doQuery(pageNo, pageSize, QUERY_MODE_UP);
			}
		},
	}
});
myTakingList = {
	// 事件注册
	event: function() {
		$("#pushBuyingBtn").on("click", myTakingList.service.pushBuying);
		$("#pushTakingBtn").on("click", myTakingList.service.pushTaking);
	},

	// 表单验证
	validate: function() {
		return true;
	},

	service: {
		doQuery: function(pageNo, pageSize, type) {
			var $list = $("#myTakingList");
			var data = {
				pageNo: pageNo,
				pageSize: pageSize
			};
			apiHelper.get(CONSTANT.baseUrl + "/api/helpBring/listAll", data, function(flag, data) {
				if(data.status == AJAX_SECCUSS) {
					//清空原来加载的数据
					if(type === QUERY_MODE_UP) {
						if(pageNo > data.result.pagination.total / pageSize) {
							mui('#takingContainer').pullRefresh().endPullupToRefresh(true);
						} else {
							mui('#takingContainer').pullRefresh().endPullupToRefresh(false);
							myTakingList.service.doDraw($list, data.result.data);
						}
					}
				}
			});
		},
		doDraw: function(list, rows) {
			// 加载模板
			mui.get("myTakingList-tmpl.html", function(data) {
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
					li.attr("departureDate",result.departureDate.substring(0, 10));
					li.attr("arrivalDate",result.arrivalDate.substring(0, 10));
					li.attr("remarks",result.remarks);
					container.find("span[id=departureCity]").text(result.departureCity);
					container.find("span[id=departureCountry]").text(result.departureCountry);
					container.find("span[id=arrivalCity]").text(result.arrivalCity);
					if(result.ticketVerified != 2){
						container.find("div[id=ticketVerified]").attr("hidden","hidden");
					}
					
					container.find("span[id=arrivalCountry]").text(result.arrivalCountry);
					container.find("span[id=price]").text(result.price);
					if(null !== result.departureDate) {
						container.find("span[id=departureDate]").text(result.departureDate.substring(0, 10));
					}
					if(null != result.arrivalDate) {
						container.find("span[id=arrivalDate]").text(result.arrivalDate.substring(0, 10));
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
		myTakingList.event();
		myTakingList.service.doQuery(pageNo, pageSize, QUERY_MODE_UP);
	},
}
myTakingList.init();