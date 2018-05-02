(function($) {
	$.init();
})(mui);

var step = 5;
var startIndex = 0;
var endIndex = 5;

$("#circleList").on("tap", ".tap", function() {
	var id = $(this).data("id");
	window.location.href = "circleInfo.html" + "?id=" + id;
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
				circleList.service.doQuery(startIndex, endIndex, QUERY_MODE_UP);
			}
		},
	}
});
circleList = {
	// 事件注册
	event: function() {

	},

	// 表单验证
	validate: function() {
		return true;
	},

	service: {
		doQuery: function(startIndex, endIndex, type) {
			$("#circleList").empty();
			var $list = $("#circleList");
			var data = {
				pageNo:1,
				pageSize:PAGE_SIZE
			};
			apiHelper.get(CONSTANT.baseUrl + "/api/message/list", data, function(flag, data) {
				if(data.status == AJAX_SECCUSS) {
					//清空原来加载的数据
					if(type === QUERY_MODE_UP) {
						if(endIndex >= data.result.totalNumber) {
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
					circleList.service.doDraw($list, data.result.data);
				}
			});
		},
		doDraw: function(list, rows) {
			// 加载模板
			mui.get("circleList-tmpl.html", function(data) {
				var container = $("<div style=''></div>");
				container.html(data);
				$.each(rows, function(index, result) {
					var li = "";
					li = $("<div class='tap' id='line'></div>");
					li.attr("data-id", result.id);
					if(null !== result.picUrlList){
						container.find("img[id=picUrl]").attr("src",result.picUrlList[0]);
					}else{
						container.find("img[id=picUrl]").attr("../../images/circle/pic.jpeg");
					}	
					container.find("p[id=title]").text(result.title);
					container.find("p[id=msg]").text(result.msg);
					container.find("p[id=issuer]").text(result.issuer);
					container.find("p[id=issueDate]").text(result.issueDate);

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
		circleList.event();
		circleList.service.doQuery(startIndex, endIndex, QUERY_MODE_UP);
	},
}
circleList.init();