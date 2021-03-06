(function($) {
	$.init();
})(mui);

takingPush = {
	// 事件注册
	event: function() {
		$("#showStartPicker").on("click", takingPush.service.showStartPicker);
		$("#showEndPicker").on("click", takingPush.service.showEndPicker);
		$("#showStartDatePicker").on("click", takingPush.service.pickStartDate);
		$("#showEndDatePicker").on("click", takingPush.service.pickEndDate);
		$("#submitBtn").on("click", takingPush.service.doPush);
		$("#showCurrencyPicker").on("click", takingPush.service.showCurrencyPicker);
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
		if($("#weight").val() === "") {
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

		showCurrencyPicker: function() {
			var sexPicker = new mui.PopPicker();
			sexPicker.setData([{
					value: '0',
					text: '人民币'
				}, {
					value: '1',
					text: '美元'
				},
				{
					value: '2',
					text: '欧元'
				},
				{
					value: '3',
					text: '日元'
				},
				{
					value: '3',
					text: '韩元'
				}
			]);
			sexPicker.show(function(items) {
				$("#currency").text(items[0].text);
				$("#showCurrencyPicker").attr("currencyId", items[0].value);
			});
		},

		showStartPicker: function() {
			var startPicker = new mui.PopPicker({
				layer: 2
			});
			startPicker.setData(staticAreaData);
			startPicker.show(function(items) {
				$("#showStartPicker").attr("data-province", items[0].text);
				$("#showStartPicker").attr("data-city", items[1].text);
				$("#startPlaceName").text(items[0].text +"/"+  items[1].text);

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
				$("#endPlaceName").text(items[0].text +"/"+ items[1].text);
			});
		},
		pickStartDate: function() {　
			var dtPicker = new mui.DtPicker({
				"type": "date",
			});　　
			dtPicker.show(function(selectItems) {
				$("#startDate").text(selectItems);
			})
		},

		pickEndDate: function() {　
			var dtPicker = new mui.DtPicker({
				"type": "date",
			});　　
			dtPicker.show(function(selectItems) {
				$("#endDate").text(selectItems);
			})
		},

		doPush: function() {
			if(!takingPush.validate()) {
				return false;
			}

			var data = {
				departureCity: $("#showStartPicker").attr("data-city"),
				departureProvince: $("#showStartPicker").attr("data-province"),
				departureCountry: "中国",
				arrivalCity: $("#showEndPicker").attr("data-city"),
				arrivalProvince: $("#showEndPicker").attr("data-province"),
				arrivalCountry: "中国",
				departureDate: $("#startDate").text(),
				arrivalDate: $("#endDate").text(),
				price: $("#price").val(),
				weight: $("#weight").val(),
				ticketPicUrl: localStorage.getItem("for_taking_good_photo"),
				remarks: $("#remarks").val(),
			}
			apiHelper.post(CONSTANT.baseUrl + "/api/helpBring/add", JSON.stringify(data), function(flag, data) {
				if(data.status == AJAX_SECCUSS) {
					mui.alert('发布成功', function() {
						window.location.href = "../../view/buying/takingList.html";
					});
				} else {
					mui.toast(data.msg);
				}
			}, null, AJAX_BODY);
		}
	},

	dao: {},
	init: function() {
		takingPush.event();

	},
}
takingPush.init();