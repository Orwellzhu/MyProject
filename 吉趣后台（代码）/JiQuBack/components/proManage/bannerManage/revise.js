ZCC.component.bannerManage_Revise=(function($,window,undefined){
	var obj=function(option){
		this.init(option);
	}

	obj.prototype={
		constructor:obj,
		//id
		imgId:"",
		imgUrl:"",
		//上传数据
		UpContent:"",
		UpTitle:"",
		BannerID:"",
		init:function(option){
			this.$upTitle=option.$upTitle;
			this.$Editor=option.$Editor;
			this.$BottomButton=option.$BottomButton;
			this.$ImgButton=option.$ImgButton;
			this.$ImgBox=option.$ImgBox;
			this.getId();
			this.reflash();
			this.bindEvent();
		},
		//获取url中的id
		getId:function(){
			var dataId=window.location.href.split('?id=')[1];
			this.BannerID=dataId;
		},
		//刷新页面
		reflash:function(){
			var _this=this;
			_this.loading();
			$.ajax({
			      "url": "https://d.apicloud.com/mcm/api/Banner/"+_this.BannerID,
			      "type": "GET",
			      "cache": false,
			      "headers":apiHeader,
			}).done(function (data, status, header) {
		    	_this.loaded();
		    	//清空属性
				_this.imgId=data.ImgId;
				_this.imgUrl=data.ImgUrl;
				_this.UpContent=data.Content;
				_this.UpTitle=data.Other[0];

				//情况DOM内容
				_this.$upTitle.val(_this.UpTitle);
				_this.$Editor.html(_this.UpContent);
				_this.$ImgBox.attr("src",_this.imgUrl);
			}).fail(function (header, status, errorThrown) {
			});

		},
		//获取输入的标题、日期、编辑器内容
		getDate:function(){
			this.UpTitle=this.$upTitle.val();
			this.UpContent=this.$Editor.html();
			if(this.UpTitle&&this.UpContent&&this.imgId){
				return true
			}else{
				return false;
			}
		},
		//更改title
		changeHeader:function(){
			var _this=this;
			var text=$(".aui-title").html(_this.UpTitle);
		},
		//递交
		submitBanner:function(){
			var _this=this;
			_this.changeHeader();
			if(_this.getDate()){
				_this.loading();
				$.ajax({
				      "url": "https://d.apicloud.com/mcm/api/Banner/"+_this.BannerID,
				      "type": "POST",
				      "cache": false,
				      "headers":apiHeader,
				      "data": 
				    	{
				    		"ImgUrl":_this.imgUrl,
				    		"ImgId":_this.imgId,
				    		"Title":"Banner",
				    		"Content":_this.UpContent,
				    		"Other":[_this.UpTitle],
				    		"_method":"PUT"
				    	}
				}).done(function (data, status, header) {
			    	_this.loaded();
			    	_this.layuiAlert("修改成功");
				}).fail(function (header, status, errorThrown) {
				});
			}else{
				this.layuiAlert("输入信息不完整");
			}
		},
		//绑定事件
		bindEvent:function(){
			this.uploadPic();
			this.bindAbandonButton();
			this.bindPublicButton();
			this.bindRestoreButton();
		},
		//绑定放弃发布按钮
		bindRestoreButton:function(){
			var _this=this;
			this.$BottomButton.children(".btn-default").on("click.ZCC",function(){
				var index=layer.open({
				  title: '吉趣',
				  btn: ['确定', '取消'],
				  content: "确认是否还原（您的修改将不被保存）",
				  btnAlign: 'c',
				  yes:function(){//第一个按钮的回调函数
				  	console.log("yes");
				  	_this.reflash();
				  	layer.close(index);			//关闭指定弹窗
				  },
				  btn2:function(){},
				  cancel: function(){}
				});  
			});	
		},
		//绑定放弃发布按钮
		bindAbandonButton:function(){
			var _this=this;
			this.$BottomButton.children(".btn-danger").on("click.ZCC",function(){
				var index=layer.open({
				  title: '吉趣',
				  btn: ['确定', '取消'],
				  content: "确认是否删除草稿",
				  btnAlign: 'c',
				  yes:function(){//第一个按钮的回调函数
				  	console.log("yes");
				  	//删除图片
				  	_this.deletPic();
				  	//删除文章
				  	_this.deletBanner();
				  	window.history.back(-1);	//返回上级页面
				  	layer.close(index);			//关闭指定弹窗
				  },
				  btn2:function(){},
				  cancel: function(){}
				});  
			});	
		},
		//绑定发布文章按钮
		bindPublicButton:function(){
			var _this=this;
			var a=this.$BottomButton.children(".btn-primary").on("click.ZCC",function(){
				var index=layer.open({
				  title: '吉趣',
				  btn: ['确定', '取消'],
				  content: "确认是否发布(发布后将立刻显示)",
				  btnAlign: 'c',
				  yes:function(){//第一个按钮的回调函数
				  	_this.submitBanner();		//递交
				  	layer.close(index);			//关闭指定弹窗
				  },
				  btn2:function(){},
				  cancel: function(){}
				});  
			});
		},
		//绑定上传图片
		uploadPic:function(){
			var _this=this;
			var uploader = WebUploader.create({
			    // swf文件路径
			    swf:'components/webuploader/Uploader.swf',
			    // 文件接收服务端。
			    server: 'http://d.apicloud.com/mcm/api/file',
			    // 选择文件的按钮。可选。
			    // 内部根据当前运行是创建，可能是input元素，也可能是flash.
			    pick: _this.$ImgButton,
			    // 不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
			    resize: false,
			    auto: true,
			    accept: {
			        title: 'Images',
			        extensions: 'gif,jpg,jpeg,bmp,png',
			        mimeTypes: 'image/*'
			    }
			});
			uploader.on("fileQueued", function (file) {
				_this.loading();
			    uploader.option('formData', {
			        filename: file.name,
			        type: file.type
			    });
		        uploader.makeThumb( file, function( error, src ) {
			        if ( error ) {
			        	//上传图片出错
			            _this.uploadImgFail();
			            return;
			        }
			        _this.$ImgBox.attr('src', src);
			    },1000,1000);
			});
			//文件上传成功
			uploader.on('uploadSuccess', function (file, res) {
			    if (res && res.id) {
			        _this.uploadImgSuccess(res.id,res.url);
			        $.ajax({
					      "url": "https://d.apicloud.com/mcm/api/Banner/"+_this.BannerID,
					      "type": "POST",
					      "cache": false,
					      "headers":apiHeader,
					      "data": 
					    	{
					    		"ImgUrl":_this.imgUrl,
					    		"ImgId":_this.imgId,
					    		"_method":"PUT"
					    	}
					}).done(function (data, status, header) {
					}).fail(function (header, status, errorThrown) {
					});
			    } else if (res &&res.status == 0) {
			        _this.uploadImgFail();
			    } else {
			        _this.uploadImgFail();
			    }
			});
			//文件上传失败
			uploader.on('uploadError', function (file, reason) {
			    alert("失败")
			});
			//上传完成，不管成功失败
			uploader.on('uploadComplete', function (file) {
			    uploader.removeFile(file);
			    _this.loaded();
			});
			uploader.on('uploadBeforeSend', function (block, data, headers) {
			    headers["X-APICloud-AppKey"] = window.apiHeader['X-APICloud-AppKey'];
			    headers["X-APICloud-AppId"] = window.apiHeader['X-APICloud-AppId'];
			    _this.deletPic();//删除前一张照片
			});
			//上传中
			uploader.on('uploadProgress',function(file,percentage){
			});
		},
		//图片上传失败
		uploadImgFail:function(){
			//清楚img标签里面的图片
			var _this=this;
			_this.$ImgBox.attr('src', "");
			//弹出提示框
			_this.layuiAlert("图片上传失败,请重新上传");
			_this.imgId=""; 
		},
		//图片上传成功
		uploadImgSuccess:function(id,url){
			this.imgId=id;
			this.imgUrl=url;			
		},
		//删除原有的图片防止数据库冗余
		deletPic:function(){
			//如果之前上传过图片
			if(this.imgId){
				$.ajax({
				  "url": "https://d.apicloud.com/mcm/api/file/"+this.imgId,
				  "cache": false,
				  "headers":apiHeader,
				  "data": {
				    "_method": "DELETE"
				  },
				  "type": "POST"
				}).success(function (data, status, header) {
					console.log("DeleteSuccess:"+JSON.stringify(data));
				}).fail(function (header, status, errorThrown) {
					console.log("DeleteFailure:"+JSON.stringify(header));
				})
			}
		},
		//删除banner
		deletBanner:function(){
			if(this.BannerID){
				var _this=this;
				$.ajax({
				  "url": "https://d.apicloud.com/mcm/api/Banner/"+_this.BannerID,
				  "cache": false,
				  "headers":apiHeader,
				  "data": {
				    "_method": "DELETE"
				  },
				  "type": "POST"
				}).success(function (data, status, header) {
					console.log("DeleteSuccess:"+JSON.stringify(data));
				}).fail(function (header, status, errorThrown) {
					console.log("DeleteFailure:"+JSON.stringify(header));
				});
			}
		},
		// 加载中
		loading:function(){
			this.layerIndex = layer.load(1, {
			  shade: [0.3,'#000'] //0.1透明度的白色背景
			});
		},
		// 加载完毕
		loaded:function(){
			layer.close(this.layerIndex);
		},
		layuiAlert:function(Content){
			var index=layer.open({
			  title: '吉趣',
			  content: Content,
			  btnAlign: 'c',
			  yes:function(index, layero){
			  	layer.close(index);	
			  },
			  cancel: function(){
			  	layer.close(index);	
			  }
			});  
		},

	}

	return obj

})(jQuery,this);