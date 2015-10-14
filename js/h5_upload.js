(function(){

var oForm = document.getElementById('formId');
var oBtn = document.getElementById('btn');
var oDiv = document.getElementById('div');
var oImgList = document.getElementById('imgList');
var oTextInfo = document.getElementById('textInfo');
var progressBar = document.querySelector('progress');
var newImgs = [],tmpImgs = [],tmpK,tmpObj = {},tmpValue,_j;

// 压缩图片的canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext('2d');

// 瓦片canvas
var tCanvas = document.createElement("canvas");
var tctx = tCanvas.getContext('2d');
var scount = 0;

var maxSize = 200 * 1024;
// var maxSize = 200000;
document.querySelector('input[type="file"]') && document.querySelector('input[type="file"]').addEventListener('change',function(){		
	fileprocess(this.files,0);
},false);

function fileprocess(files,i){
	if(!files.length) return;
	var aFiles = Array.prototype.slice.call(files);			
	aFiles.forEach(function(file,j){
		if(!/\/(?:jpeg|png|gif|jpg)/i.test(file.type)) return;
	})
	if (scount>5)
	{
		return ;
	}
	if (i<6&&i<files.length)
	{
		startUpload(files[i], function(){fileprocess(files,i+1)});
	}
}

function startUpload(file, cb){
	var reader = new FileReader();
	reader.onload = function(){
		var base64Result = this.result;
		var img = new Image();
		img.src = base64Result;					
		if(base64Result.length < maxSize){
			upload(base64Result,file.type,file.name, cb)
			return;
		}

		if(img.complete){
			callback();
		}else{
			img.onload = callback;
		}
		
		function callback(){
			var data = compress(img);
			var name = file.name;
			name = name.substr(0,name.lastIndexOf('.') + 1) + 'jpg';
			upload(data,'image/jpeg',name, cb);
			img = null;
		}
	}
	reader.readAsDataURL(file);
}

function compress(img){
	// console.log(123)
	var initSize = img.src.length;

	var max = 1000;
	// console.log('old',img.height / img.width);
	if(img.width > max || img.height > max){
		var scale = img.height / img.width;	
		if(scale > 1){
			var height = max;
			var width = height / scale
		}else{
			var width = max;
			var height = width * scale;
		}
	}else{
		var width = img.width;
		var height = img.height;
	}			

	var ratio = 1;

	canvas.width = width;
	canvas.height = height;

	ctx.fillStyle = '#fff';
	ctx.fillRect(0,0,canvas.width,canvas.height);

	var count;
	if((count = width * height / 1000000) > 1){
		count = ~~(Math.sqrt(count)+1);

		var nw = ~~(width / count);
		var nh = ~~(height / count);

		tCanvas.width = nw;
		tCanvas.height = nh;

		for(var i = 0; i < count; i += 1){
			for(var j = 0;j < count; j += 1){
				tctx.drawImage(img,i * nw * ratio, j * nh * ratio, nw * ratio, nh * ratio,0,0,nw,nh);
				ctx.drawImage(tCanvas,i * nw, j * nh, nw, nh);
			}
		}
	}else{
		ctx.drawImage(img, 0, 0, width, height);
	}

	var ndata = canvas.toDataURL("image/jpeg",0.9);

	tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0;
	return ndata;
}

function upload(basestr,type,filename,callback){
	
	/*var text = window.atob(basestr.split(",")[1]);
	var buffer = new ArrayBuffer(text.length);
	var ubuffer = new Uint8Array(buffer);
	var pecent = 0, loop = null;

	for(var i = 0; i < text.length; i += 1){
		ubuffer[i] = text.charCodeAt(i);
	}

	var Builder = window.WebKitBlobBuilder || window.MozBlobBuilder;
	var blob;			
	if(Builder){
		var builder = new Builder();
		builder.append(buffer);
		blob = builder.getBlob(type,filename);
	}else{
		blob = new window.Blob([buffer],{type: type});
	}*/		
	//var xhr = new XMLHttpRequest();
	var formdata = new FormData();
	//var randName = 'rand' + Math.floor(Math.random()*10000) + '.' + filename;
	formdata.append("image",basestr);
	//doucment(JSON.stringify(formdata));
	$.ajax({
        url: '/dynamic/dynamic_upload?t=1',  //server script to process data
        type: 'POST',
        //Ajax事件
        //beforeSend: beforeSendHandler,
        success: function (oText){
			if (oText.status==200)
			{
				scount++;
				var aHtml = [],sHtml = '',oText;
				var height = $(window).width()*0.3;
				aHtml.push('<div class="img-list" ids="'+oText.data.imgid+'" style="height:'+height+'px"><img src="'+basestr+'" src_'+tmpK+'="'+oText.data.url+'" alt=""><div class="del-btn"><img src="http://myj.res.meizu.com/img/btn_close.gif"></div></div>')				
				sHtml = aHtml.join('');
				oImgList.innerHTML =  oImgList.innerHTML + sHtml;
				if (callback)
				{
					callback();
				}
			}
			else
			{
				alert(oText.message);
			}
		},
        error: function (re){
			alert(re.message);
		},
        // Form数据
        data: formdata,
        cache: false,
		dataType: 'json',
        contentType: false,
        processData: false
    });
}

// 切换选项卡tab
$("#tab").on('click','.tab',function(){
	var _index = $(this).index();

	if(!$('.tab-list').eq(_index).hasClass('hidden')){ return;}

	// 替换内容
	var _hide_index = _index == 1 ? 0 : 1;
	$('.tab-list').removeClass('hidden').eq(_hide_index).addClass('hidden');

	// 更改选项卡样式
	$("#tab .tab").removeClass('active').eq(_index).addClass('active');
});

// 删除图片
$('#imgList').on('click','.del-btn',function(){
	var _this = $(this);
	var imgid = _this.parent().attr('ids');

	$.ajax({
		type: 'GET',
		url: '/dynamic/del_file',
		data:{
			imgid: imgid
		},
		dataType: 'json',
		success: function(data){
			if(data.status == 200){
				alert('删除成功');
				_this.parent().remove();
			}else{
				alert(data.message);
			}
		}
	})
})

// 发布图文
$('.btn-image').on('click',function(){

	var content = $('#txt').val();
	var aId = [],sId;
	if(!content){
		alert('文字不可为空');
		return false;
	}

	if($('.img-list').length > 0){
		$('.img-list').each(function(){
			aId.push($(this).attr('ids'));
		})
		sId = aId.join(',');		
	}else{
		alert('请上传图片');
		return false;
	}
	
	$.ajax({
		type: 'POST',
		url: '/dynamic/add_dynamic',
		data:{
			img_id_str 	: sId,
			content		: content,
			use_location: 1
		},
		dataType: 'json',
		success: function(data){
			if(data.status == 200){
				alert('发布成功');
				$('#txt').val('');
				$('#imgList').text('');
			}else{
				alert(data.message);
			}
		}
	})
})

// 发布视频
$('.btn-video').on('click',function(){
	// console.log('视频')
	var name = $('#video_name').val();
	var url = $('#video_link').val();
	if(!name || !url){
		alert('视频名称与地址都不可为空！');
		return;
	}
	$.ajax({
		type: 'POST',
		url: '/video/add_video',
		data:{
			link_url : url,
			name 	 : name
		},
		dataType: 'json',
		success: function(data){
			if(data.status == 200){
				alert('提交成功');
				$('#video_name').val('');
				$('#video_link').val('');
			}else{
				alert(data.message);
			}
		}
	})
})

})();