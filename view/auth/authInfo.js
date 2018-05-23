var ID_CONFIRM = 1;
var POS_CONFIRM = 2;
var FOR_CONFIRM = 3;

mui.init({
	gestureConfig: {
		longtap: true, //默认为false
	}
});

(function($) {
	$.init();
})(mui);

authInfo = {
	event: function() {
		$("#idConfirm").on("click", authInfo.service.doIdConfirm);
		$("#posConfirm").on("click", authInfo.service.doPosConfirm);
		$("#forConfirm").on("click", authInfo.service.doForConfirm);
		$("#registerIdBtn").on("click", authInfo.service.doRegisterId);
		$("#registerPosBtn").on("click", authInfo.service.doRegisterPos);
		$("#showIdSexPicker").on("click", authInfo.service.showIdSexPicker);
		$("#showHsSexPicker").on("click", authInfo.service.showHsSexPicker);

	},

	service: {

		doUserInfo: function() {
			var userInfo = JSON.parse(localStorage.getItem("userVo"));
			$("#nickName").text(userInfo.nickName);
			$("#phone").text(userInfo.phone);
		},

		showIdSexPicker: function() {
			var sexPicker = new mui.PopPicker();
			sexPicker.setData([{
				value: '1',
				text: '男'
			}, {
				value: '0',
				text: '女'
			}]);
			sexPicker.show(function(items) {
				$("#idSexPicker").val(items[0].text);
				$("#showIdSexPicker").attr("sex", items[0].value);
			});
		},

		showHsSexPicker: function() {
			var sexPicker = new mui.PopPicker();
			sexPicker.setData([{
				value: '1',
				text: '男'
			}, {
				value: '0',
				text: '女'
			}]);
			sexPicker.show(function(items) {
				$("#hsSexPicker").val(items[0].text);
				$("#showHsSexPicker").attr("sex", items[0].value);
			});
		},
		doRegisterId: function() {
			if($("#idNum").val() === "") {
				mui.toast("请您输入身份证号");
				return false;
			}
			if($("#idName").val() === "") {
				mui.toast("请您输入姓名");
				return false;
			}
			if($("#idAge").val() === "") {
				mui.toast("请您输入年龄");
				return false;
			}
			var data = {
				name: $("#idName").val(),
				gender: "男",
				age: $("#idAge").val(),
				certNo: $("#idNum").val(),
				certType: ID_CONFIRM,
				certPicUrl: localStorage.getItem("id_photo")
			}
			apiHelper.post(CONSTANT.baseUrl + "/api/auth/add", JSON.stringify(data), function(flag, data) {
				if(data.status == AJAX_SECCUSS) {
					mui.alert('注册成功', function() {
						window.location.href = "../../view/buying/buyingList.html";
					});
				} else {
					mui.toast(data.msg);
				}
			}, null, AJAX_BODY);
		},

		doRegisterPos: function() {
			if($("#posNum").val() === "") {
				mui.toast("请您输入身份证号");
				return false;
			}
			if($("#posName").val() === "") {
				mui.toast("请您输入姓名");
				return false;
			}
			if($("#posAge").val() === "") {
				mui.toast("请您输入年龄");
				return false;
			}
			var data = {
				name: $("#posName").val(),
				gender: "男",
				age: $("#posAge").val(),
				certNo: $("#posNum").val(),
				certType: POS_CONFIRM,
				certPicUrl: localStorage.getItem("pos_photo")
			}
			apiHelper.post(CONSTANT.baseUrl + "/api/auth/add", JSON.stringify(data), function(flag, data) {
				if(data.status == AJAX_SECCUSS) {
					mui.alert('注册成功', function() {
						window.location.href = "../../view/buying/buyingList.html";
					});
				} else {
					mui.toast(data.msg);
				}
			}, null, AJAX_BODY);
		},

		doIdConfirm: function() {
			$("#idCard").show();
			$("#hsCard").hide();
			$("#wjCard").hide();
			uploaderID.init();

		},
		doPosConfirm: function() {
			$("#idCard").hide();
			$("#hsCard").show();
			$("#wjCard").hide();
			uploaderPos.init();
		},
		doForConfirm: function() {
			$("#idCard").hide();
			$("#hsCard").hide();
			$("#wjCard").show();
			uploaderForId.init();
			uploaderFor.init();
		},

		getAuthInfo: function() {
			var data = {
				authId:2
			};
			apiHelper.get(CONSTANT.baseUrl + "/api/auth/detail" , data, function(flag, data) {
				if(data.status == AJAX_SECCUSS) {
					debugger;
					if(data.result == ""){
						return;
					}
					if(data.result.certType == ID_CONFIRM){
						$("#idNum").val(data.result.certNo);
						$("#idName").val(data.result.name);
						$("#idSexPicker").val(data.result.gender);
						$("#idAge").val(data.result.age);
					}else if(data.result.certType == POS_CONFIRM){
						
					}else{
						
					}
				}
			});

		}

	},

	dao: {},

	init: function() {
		authInfo.event();
		$("#idCard").show();
		$("#hsCard").hide();
		$("#wjCard").hide();
		uploaderID.init();
		authInfo.service.doUserInfo();
		authInfo.service.getAuthInfo();
	}
}

mui.ready(function() {

});
authInfo.init();