//手机号码验证
jQuery.validator.addMethod("mobile", function(value, element) {
	var length = value.length;
	var mobile = /^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
	return this.optional(element) || (length == 11 && mobile.test(value));
}, "请填写正确的手机号码");

// 电话号码验证
jQuery.validator.addMethod("phone", function(value, element) {
	var tel = /^\d{3,4}-\d{7,9}$/;
	return this.optional(element) || (tel.test(value));
}, "电话号码格式错误");

//电话区号验证
jQuery.validator.addMethod("phoneCode", function(value, element) {
	var tel = /^[0-9]{3,4}$/;
	return this.optional(element) || (tel.test(value));
}, "区号错误");

//电话号码验证
jQuery.validator.addMethod("phoneNum", function(value, element) {
	var tel = /^[0-9]{7,9}$/;
	return this.optional(element) || (tel.test(value));
}, "电话号码格式错误");

// 邮政编码验证
jQuery.validator.addMethod("zip", function(value, element) {
	var tel = /^[0-9]{6}$/;
	return this.optional(element) || (tel.test(value));
}, "邮政编码格式错误");

// QQ号码验证
jQuery.validator.addMethod("qq", function(value, element) {
	var tel = /^[1-9]\d{4,16}$/;
	return this.optional(element) || (tel.test(value));
}, "QQ号码格式错误");

// IP地址验证
jQuery.validator.addMethod("ip", function(value, element) {
	var ip = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
	return this.optional(element) || (ip.test(value) && (RegExp.$1 < 256 && RegExp.$2 < 256 && RegExp.$3 < 256 && RegExp.$4 < 256));
}, "Ip地址格式错误");

// 字母和数字的验证
jQuery.validator.addMethod("chrnum", function(value, element) {
	var chrnum = /^([a-zA-Z0-9]+)$/;
	return this.optional(element) || (chrnum.test(value));
}, "只能输入数字和字母(字符A-Z, a-z, 0-9)");

// 中文的验证
jQuery.validator.addMethod("chinese", function(value, element) {
	var chinese = /^[\u4e00-\u9fa5]+$/;
	return this.optional(element) || (chinese.test(value));
}, "只能输入中文");

// 字符验证
jQuery.validator.addMethod("stringCheck", function(value, element) {
	return this.optional(element) || /^[\u0391-\uFFE5\w]+$/.test(value);
}, "只能包括中文字、英文字母、数字和下划线");

//身份证验证方法
function isIdCardNo(num) {
	var len = num.length, re;
	if (len == 15)
		re = new RegExp(/^(\d{6})()?(\d{2})(\d{2})(\d{2})(\d{3})$/);
	else if (len == 18)
		re = new RegExp(/^(\d{6})()?(\d{4})(\d{2})(\d{2})(\d{3})(\d)$/);
	else {
		// alert("请输入15或18位身份证号,您输入的是 "+len+ "位");
		return false;
	}
	var a = num.match(re);
	if (a != null) {
		if (len == 15) {
			var D = new Date("19" + a[3] + "/" + a[4] + "/" + a[5]);
			var B = D.getYear() == a[3] && (D.getMonth() + 1) == a[4]
					&& D.getDate() == a[5];
		} else {
			var D = new Date(a[3] + "/" + a[4] + "/" + a[5]);
			var B = D.getFullYear() == a[3] && (D.getMonth() + 1) == a[4]
					&& D.getDate() == a[5];
		}
		if (!B) {
			// alert("输入的身份证号 "+ a[0] +" 里出生日期不对！");
			return false;
		}
	}
	return true;
}

// 身份证号码验证
jQuery.validator.addMethod("isIdCardNo", function(value, element) {
	return this.optional(element) || isIdCardNo(value);
}, "请填写正确的身份证号码");

// 护照号码验证
jQuery.validator.addMethod("isPassportNo", function(value, element) {
	var passPortNo=/^1[45][0-9]{7}|G[0-9]{8}|P[0-9]{7}|S[0-9]{7,8}|D[0-9]+$/;
	return this.optional(element) || passPortNo.test(value);
}, "请正确输入您的护照号码");

//日期比较
jQuery.validator.addMethod("dateCompare", function(value, element, param) {
	var startDate = $(param).val();
	var endDate = value;
	return this.optional(element) || startDate.replace("-", "") <= endDate.replace("-", "");
}, "结束日期必须大于开始日期!");

//日期比较
jQuery.validator.addMethod("dateCompares", function(value, element, param) {
	var startDate = $(param).val();
	var endDate = value;
	startDate = startDate.replaceAll("-", "");
	startDate = startDate.replace(":", "");
	endDate = endDate.replaceAll("-", "");
	endDate = endDate.replace(":", "");
	return this.optional(element) || startDate <= endDate;
}, "结束日期必须大于开始日期!");

//数值比较
jQuery.validator.addMethod("valueCompare", function(value, element, param) {
	var startValue = $(param).val();
	var endValue = value;
	return this.optional(element) || startValue <= endValue;
}, "");


//数值相等比较。
jQuery.validator.addMethod("equal", function(value, element, paramValue) {
	return parseFloat(value) == parseFloat(paramValue);
}, "数值不等于{0}");

// 数字校验（正数） wenyadd 2014-04-27
jQuery.validator.addMethod("isNumberh", function(value, element) {
	var zfnum = /^[0-9]+(\.[0-9]{0,2})?$/;
	return this.optional(element) || (zfnum.test(value));
}, "请正确输入正数");

//数值比较,超过最大值出警告。
jQuery.validator.addMethod("valueCompareToMax", function(value, element, param) {
	var startValue = $(param).val();
	var endValue = value;
	return this.optional(element) || parseFloat(startValue) >= parseFloat(endValue);
}, "");

//数值比较,小于等于最小值出警告。
jQuery.validator.addMethod("valueCompareToMin", function(value, element, param) {
	return this.optional(element) || parseFloat(value) > parseFloat(param);
}, "");

//一致性验证。
jQuery.validator.addMethod("same", function(value, element, param) {
	return value == $(param).val();
}, "");

//银行帐号验证。
jQuery.validator.addMethod("creditCard", function(value, element, param) {
	var reg = /^(\d{16}|\d{19})$/;
	return this.optional(element) || (reg.test(value));	
}, "卡号格式错误");
