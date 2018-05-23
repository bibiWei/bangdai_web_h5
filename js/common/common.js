var AJAX_SECCUSS = 1;
var AJAX_BODY = 'application/json';
var AJAX_PARAM = 'application/x-www-form-urlencoded;charset=UTF-8'

var SYS_USER = 1;
var WX_USER = 2;
var QQ_USER = 3;
var WB_USER = 4;

var QUERY_MODE_DOWN = 1;
var QUERY_MODE_UP = 2;

var PAGE_SIZE = "5";


var ORDER_START = 1;
var ORDER_CONFRM = 2;
var ORDER_PAY = 3;
var ORDER_WAITING_PRO = 4;
var ORDER_SUC = 5;

var ACCESS_TAKING = 1;
var ACCESS_BUYING = 2;


var ORDER_TOTAL = 1;
var ORDER_T = 2;
var ORDER_U = 3;


var CONSTANT = {
	token: "token",
	auth: "auth",

	baseUrl: 'http://39.105.65.35:8082/papi',

	pageSize: 10,
	//订单列表显示5条
	orderListPageSize: 5,
	success: '0000',
	pic_url: "https://b2cdemo.oss-cn-beijing.aliyuncs.com/"

}
//ios混合开发专用
window.NativeBridge = function(name, message) {
	var iosDevice = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
	if(iosDevice) {
		// Apple
		if(this.hasOwnProperty(name)) {
			eval("window." + name + "(message)")
		} else {
			if(message == null) {
				message = ''
			}
			eval("webkit.messageHandlers." + name + ".postMessage(message)")
		}
	}
}
//store方法
var storeHelper = {
	isSupported: (function() {
		try {
			if(!('localStorage' in window && window['localStorage'])) {
				return false
			}
			localStorage.setItem('~_~', 1);
			localStorage.removeItem('~_~');
		} catch(err) {
			return false;
		}
		return true;
	})(),
	getItem: function(key) {
		try {
			return localStorage.getItem(key);
		} catch(e) {}
	},
	setItem: function(key, val) {
		try {
			localStorage.setItem(key, val);
		} catch(e) {}
	},
	removeItem: function(key) {
		try {
			localStorage.removeItem(key);
		} catch(e) {}
	}
}

/**
 * ajax方法
 */
var apiHelper = {
	getOpts: function(api, data, method, callback, timeout, contentType) {
		var heardMap = {};
		heardMap["Authorization"] = localStorage.getItem("token");
		return {
			url: api,
			data: data,
			type: method,
			dataType: "json",
			contentType: contentType || "application/x-www-form-urlencoded;charset=UTF-8",
			timeout: timeout || 30000,
			headers:heardMap,
			success: function(d) {
				if(callback) {
					callback(true, d);
				}
			},
			error: function(d) {
				if(d.status == 0) return false;
				if(callback) {
					callback(false, d);
				}
			}
		};
	},

	get: function(api, data, callback, timeout, contentType) {
		if($.isFunction(data))
			callback = data, data = null;
		return $.ajax(this.getOpts(api, data, "GET", callback, timeout, contentType));
	},

	post: function(api, data, callback, timeout, contentType) {
	

		return $.ajax(this.getOpts(api, data, "POST", callback, timeout, contentType));
	},

	postWithSychronize: function(api, data, callback, timeout, contentType) {
		var token = storeHelper.getItem(CONSTANT.token);
		if(token) {
			data.token = storeHelper.getItem(CONSTANT.token);
		}
		var options = this.getOpts(api, data, "POST", callback, timeout, contentType);
		options.async = false;
		return $.ajax(options);
	}
};

var dateUtil = {
	pad: function(value) {
		return("0" + value).substr(-2);
	},
	dateFormatter: function(date, format) {
		// get date
		date = (typeof(date) === "number" ? new Date(date) : date);

		var _year = date.getFullYear(),
			_month = date.getMonth() + 1,
			_date = date.getDate(),
			_hour = date.getHours(),
			_minute = date.getMinutes(),
			_second = date.getSeconds();

		// generate number
		var pairs = {
			yyyy: _year,
			m: _month,
			mm: this.pad(_month),
			d: _date,
			dd: this.pad(_date),
			H: _hour,
			HH: this.pad(_hour),
			M: _minute,
			MM: this.pad(_minute),
			S: _second,
			SS: this.pad(_second)
		};

		// format date
		return format.replace(/yyyy|mm?|dd?|HH?|MM?|SS?/g, function(matched) {
			return pairs[matched];
		});
	},
	strAdd: function(interval, indate, offset, infmt) {
		infmt = infmt || "%Y%M%d";
		var fmtDate = this.str2Date(indate, infmt);
		return this.dateAdd(interval, fmtDate, offset);
	},
	str2Date: function(date, p) {
		p = p || '%Y-%M-%d %h:%m:%s';
		p = p.replace(/\-/g, '\\-');
		p = p.replace(/\|/g, '\\|');
		p = p.replace(/\./g, '\\.');
		p = p.replace(/\+/g, '\\+');
		p = p.replace('%Y', '(\\d{4})');
		p = p.replace('%M', '(\\d{1,2})');
		p = p.replace('%d', '(\\d{1,2})');
		p = p.replace('%h', '(\\d{1,2})');
		p = p.replace('%m', '(\\d{1,2})');
		p = p.replace('%s', '(\\d{1,2})');

		var regExp = new RegExp('^' + p + '$'),
			group = regExp.exec(date),
			Y = (group[1] || 0) - 0,
			M = (group[2] || 1) - 1,
			d = (group[3] || 0) - 0,
			h = (group[4] || 0) - 0,
			m = (group[5] || 0) - 0,
			s = (group[6] || 0) - 0;

		return new Date(Y, M, d, h, m, s);
	},
	date2Str: function(date, p, isFill) {
		var Y = date.getFullYear(),
			M = date.getMonth() + 1,
			d = date.getDate(),
			h = date.getHours(),
			m = date.getMinutes(),
			s = date.getSeconds();
		if(isFill) {
			M = (M < 10) ? ('0' + M) : M;
			d = (d < 10) ? ('0' + d) : d;
			h = (h < 10) ? ('0' + h) : h;
			m = (m < 10) ? ('0' + m) : m;
			s = (s < 10) ? ('0' + s) : s;
		}
		p = p || '%Y-%M-%d %h:%m:%s';
		p = p.replace(/%Y/g, Y).replace(/%M/g, M).replace(/%d/g, d).replace(/%h/g, h).replace(/%m/g, m).replace(/%s/g, s);
		return p;
	},
	dateAdd: function(interval, indate, offset) {
		switch(interval) {
			case 'y':
				indate.setFullYear(indate.getFullYear() + offset);
				break;
			case 'q':
				indate.setMonth(indate.getMonth() + (offset * 3));
				break;
			case 'n':
				indate.setMonth(indate.getMonth() + offset);
				break;
			case 'd':
				indate.setDate(indate.getDate() + offset);
				break;
			case 'w':
				indate.setDate(indate.getDate() + (offset * 7));
				break;
			case 'h':
				indate.setHours(indate.getHours() + offset);
				break;
			case 'm':
				indate.setMinutes(indate.getMinutes() + offset);
				break;
			case 's':
				indate.setSeconds(indate.getSeconds() + offset);
				break;
			case 'i':
				indate.setMilliseconds(indate.getMilliseconds() + offset);
				break;
			default:
				indate.setMilliseconds(indate.getMilliseconds() + offset);
				break;
		}
		return indate;
	}
}

var URL = {
	getRequest: function() {
		var searchString = window.location.search.substring(1),
			params = searchString.split("&"),
			hash = {};

		if(searchString == "") return {};
		for(var i = 0; i < params.length; i++) {
			// 获取等号位置
			var pos = params[i].indexOf('=');
			if(pos == -1) {
				continue;
			}
			// 获取name 和 value
			var paraName = params[i].substring(0, pos),
				paraValue = params[i].substring(pos + 1);
			hash[paraName] = paraValue;
		}
		return hash;
	},
	isApp: function() {
		var u = URL.getRequest().fromType + '';
		if(u != null && u.indexOf('app') != -1) {
			return true;
		} else {
			return false;
		}
	},
	isAndroid: function() {
		var u = URL.getRequest().fromType;
		if(u != null && u == 'app_android') {
			return true;
		} else {
			return false;
		}
	},
	isIos: function() {
		var u = URL.getRequest().fromType;
		if(u != null && u == 'app_ios') {
			return true;
		} else {
			return false;
		}
	},
	isFirstPresc: function() {
		var u = URL.getRequest().firstPrescr;
		if(u != null && u == 'true') {
			return true;
		} else {
			return false;
		}
	}

}

var order = {
	getOrderStatus: function(status) {
		var statusTxt = "";
		switch(status) {
			case 1:
				statusTxt = "下单未支付";
				break;
			case 2:
				statusTxt = "已支付待发货";
				break;
			case 3:
				statusTxt = "已发货待确认";
				break;
			case 4:
				statusTxt = "交易成功";
				break;
			case -1:
				statusTxt = "用户取消订单";
				break;
			case -2:
				statusTxt = "订单超时";
				break;
			case 11:
				statusTxt = "用户申请退货";
				break;
			case 12:
				statusTxt = "退货申请已受理等待退款";
				break;
			case 13:
				statusTxt = "退款完成";
				break;
			case 14:
				statusTxt = "拒绝退款";
				break;
			default:
				statusTxt = "未知";
		}
		return statusTxt;
	}
}

var commonHanlder = {
	handlerAjaxError: function(errorcode, errormsg) {
		var showerrorcode = !errorcode ? false : true;
		var showerrormsg = !errormsg ? false : true;
		var msg = ((showerrormsg || showerrorcode) ? "-" : "") + (!showerrormsg ? "" : errormsg) + (!showerrorcode ? "" : ("[" + errorcode + "]"));
		mui.alert("系统错误" + (msg) + ",请您稍后重试或重新登录重试此功能");
		return false;
	}

}