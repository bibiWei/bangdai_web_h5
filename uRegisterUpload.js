var accessid = 'LTAImzbZN1i8405z';
var accesskey = '4bR3jvuWNYsLNN78MuuHD3ds7qNPVv';
var host = 'http://huanqiuyidai.oss-cn-beijing.aliyuncs.com';

g_dirname = ''
g_object_name = ''
g_object_name_type = 'random_name'
now = timestamp = Date.parse(new Date()) / 1000;

var policyText = {
	"expiration": "2020-01-01T12:00:00.000Z", //设置该Policy的失效时间，超过这个失效时间之后，就没有办法通过这个policy上传文件了
	"conditions": [
		["content-length-range", 0, 1048576000] // 设置上传文件的大小限制
	]
};

var policyBase64 = Base64.encode(JSON.stringify(policyText))
message = policyBase64
var bytes = Crypto.HMAC(Crypto.SHA1, message, accesskey, {
	asBytes: true
});
var signature = Crypto.util.bytesToBase64(bytes);

function check_object_radio() {
}

function get_dirname() {
	dir = document.getElementById("previewImg").value;
	if(dir != '' && dir.indexOf('/') != dir.length - 1) {
		dir = dir + '/'
	}
	//alert(dir)
	g_dirname = dir
}

function random_string(len) {　　
	len = len || 32;　　
	var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';　　
	var maxPos = chars.length;　　
	var pwd = '';　　
	for(i = 0; i < len; i++) {　　
		pwd += chars.charAt(Math.floor(Math.random() * maxPos));
	}
	return pwd;
}

function get_suffix(filename) {
	pos = filename.lastIndexOf('.')
	suffix = ''
	if(pos != -1) {
		suffix = filename.substring(pos)
	}
	return suffix;
}

function calculate_object_name(filename) {
	if(g_object_name_type == 'local_name') {
		g_object_name += "${filename}"
	} else if(g_object_name_type == 'random_name') {
		suffix = get_suffix(filename)
		g_object_name = g_dirname + random_string(10) + suffix
	}
	return ''
}

function get_uploaded_object_name(filename) {
	if(g_object_name_type == 'local_name') {
		tmp_name = g_object_name
		tmp_name = tmp_name.replace("${filename}", filename);
		return tmp_name
	} else if(g_object_name_type == 'random_name') {
		return g_object_name
	}
}

function set_upload_param(up, filename, ret) {
	g_object_name = g_dirname;
	if(filename != '') {
		suffix = get_suffix(filename)
		calculate_object_name(filename)
	}
	localStorage.setItem("register_user_photo",host + "/" + g_object_name);
	new_multipart_params = {
		'key': g_object_name,
		'policy': policyBase64,
		'OSSAccessKeyId': accessid,
		'success_action_status': '200', //让服务端返回200,不然，默认会返回204
		'signature': signature,
	};

	up.setOption({
		'url': host,
		'multipart_params': new_multipart_params
	});

	up.start();
}

var uploaderRegister = new plupload.Uploader({
	runtimes: 'html5,flash,silverlight,html4',
	browse_button: 'preview',
	//multi_selection: false,
	container: document.getElementById('container'),
	flash_swf_url: '../../plugin/lib/plupload-2.1.2/js/Moxie.swf',
	silverlight_xap_url: '../../plugin/lib/plupload-2.1.2/js/Moxie.xap',
	url: 'http://oss.aliyuncs.com',
	init: {
		PostInit: function() {
			set_upload_param(uploaderRegister, '', false);
			return false;
		},

		FilesAdded: function(up, files) {
			previewImage(files);
		},

		BeforeUpload: function(up, file) {
			check_object_radio();
			get_dirname();
			set_upload_param(up, file.name, true);
		},

		UploadProgress: function(up, file) {

		},

		FileUploaded: function(up, file, info) {
			if(info.status == 200) {
				mui.toast("上传图片成功");
			} else {
				mui.toast("上传图片失败");
			}
		},
		Error: function(up, err) {
			document.getElementById('console').appendChild(document.createTextNode("\nError xml:" + err.response));
		}
	}
});

uploaderRegister.init();
