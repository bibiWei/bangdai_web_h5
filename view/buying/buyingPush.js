(function($) {
	$.init();
})(mui);

buyingPush = {
	// 事件注册
	event: function() {
		$("#showStartPicker").on("click", buyingPush.service.showStartPicker);
		$("#showEndPicker").on("click", buyingPush.service.showEndPicker);
		$("#endDatePicker").on("click", buyingPush.service.pickDate);
		$("#submitBtn").on("click", buyingPush.service.doPush);
	},

	// 表单验证
	validate: function() {
		if($("#startPlaceName").text() === "") {
			mui.toast("请您选择始发地");
			return false;
		}
		if($("#endPlaceName").text() === "") {
			mui.toast("请您选择目的地");
			return false;
		}
		if($("#endDate").text() === "") {
			mui.toast("请您选择截止时间");
			return false;
		}
		if($("#goodName").val() === "") {
			mui.toast("请您输入商品名称");
			return false;
		}
		if($("#goodWeigh").val() === "") {
			mui.toast("请您输入商品重量");
			return false;
		}
		if($("#price").val() === "") {
			mui.toast("请您输入求带价格");
			return false;
		}

		return true;
	},

	service: {
		showStartPicker: function() {
			var startPicker = new mui.PopPicker({
				layer: 2
			});
			startPicker.setData(staticAreaData);
			startPicker.show(function(items) {
				$("#showStartPicker").attr("data-province", items[0].text);
				$("#showStartPicker").attr("data-city", items[1].text);
				$("#startPlaceName").text(items[0].text + items[1].text);

			});
		},
		showEndPicker: function() {
			var endPicker = new mui.PopPicker({
				layer: 2
			});
			endPicker.setData(staticAreaData);
			endPicker.show(function(items) {
				$("#showEndPicker").attr("data-province", items[0].text);
				$("#showEndPicker").attr("data-city", items[1].text);
				$("#endPlaceName").text(items[0].text + items[1].text);
			});
		},
		pickDate: function() {　
			var dtPicker = new mui.DtPicker({
				"type": "date",
			});　　
			dtPicker.show(function(selectItems) {
				$("#endDate").text(selectItems);
			})
		},

		doPush: function() {
			if(!buyingPush.validate()) {
				return false;
			}
			var data = {
				departureCity: $("#showStartPicker").attr("data-city"),
				departureProvince: $("#showStartPicker").attr("data-province"),
				departureCountry: "中国",
				arrivalCity: $("#showEndPicker").attr("data-city"),
				arrivalProvince: $("#showEndPicker").attr("data-province"),
				arrivalCountry: "中国",
				deadline: $("#endDate").text(),
				price: $("#price").val(),
				weight: $("#goodWeigh").val(),
				matePicUrl: "",
				remarks: $("#remarks").val(),
			}
			apiHelper.post(CONSTANT.baseUrl + "/api/requestBring/add", JSON.stringify(data), function(flag, data) {
				if(data.status == AJAX_SECCUSS) {
					mui.alert('发布成功', function() {
						window.location.href = "../../view/buying/buyingList.html";
					});
				} else {
					mui.toast(data.msg);
				}
			}, null, AJAX_BODY);
		}
	},

	dao: {},
	init: function() {
		buyingPush.event();

	},
}
buyingPush.init();