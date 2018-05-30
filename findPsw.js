mui.init({

});

findPsw = {

	// 事件注册
	event: function() {
		$("#showAreaCodePicker").on("click", findPsw.service.showAreaCodePicker);
		$("#nextBtn").on("click",findPsw.service.showConfirm);
	},

	// 表单验证
	validate: function() {},

	service: {
		showAreaCodePicker: function() {
			var sexPicker = new mui.PopPicker();
			sexPicker.setData(areaData);
			sexPicker.show(function(items) {
				$("#showAreaCodePicker").val(items[0].text);
				$("#showAreaCodePicker").attr("countryCode", items[0].value);
			});
		},
		showConfirm:function(){
			if($("#showAreaCodePicker").attr("countryCode") == undefined){
				mui.alert("请您选择区号");
				return false;
			}
			if($("#phone").val() == ""){
				mui.alert("请您输入手机号");
				return false;
			}
			
			window.location.href = "findPswConfirm.html" + "?code=" + $("#showAreaCodePicker").attr("countryCode") + "&phone=" + $("#phone").val();
		}
	},
	dao: {},
	init: function() {
		findPsw.event();
	},
}
findPsw.init();