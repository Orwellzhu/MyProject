ZCC.component.activityPublic_Entered=(function($,window,undefined){
	var obj=function(option){
		this.init(option);
	}

	obj.prototype={
		constructor:obj,
		dataId:"",
		init:function(option){
			this.getId();
			this.$ContentWrapper=option.$ContentWrapper;
			this.requestData();
		},
		//获取url中的id
		getId:function(){
			var dataId=window.location.href.split('?id=')[1];
			this.dataId=dataId;
		},
		//请求数据
		requestData:function(){
			this.loading();
			var _this=this;
			$.ajax({
			  "url": "https://d.apicloud.com/mcm/api/Activities",
			  "cache": false,
			  "headers": apiHeader,
			  "type": "GET",
			  "data":{
			  	"filter":{
			  		"fields":["Attend"],
			  		"where":{"id":_this.dataId},
			  	}
			  }
			}).success(function (data, status, header) {
			  _this.strDOM(data[0]);
			}).fail(function (header, status, errorThrown) {
			  //fail body
			  alert(JSON.stringify(header));
			});
		},

		//查询头像
		requestHeadImg:function(ID,DOMpointer){
			var _this=this;
			$.ajax({
			  "url": "https://d.apicloud.com/mcm/api/MyUser",
			  "cache": false,
			  "headers": apiHeader,
			  "type": "GET",
			  "data":{
			  	"filter":{
			  		"fields":["HeadImgUrl"],
			  		"where":{"id":ID},
			  	}
			  }
			}).success(function (data, status, header) {
			  DOMpointer.attr("src",data[0].HeadImgUrl);
			}).fail(function (header, status, errorThrown) {
			  //fail body
			  alert(JSON.stringify(header));
			});
		},
		//DOM操作
		strDOM:function(retArray){
			var _this=this;
			for(var i=0;i<retArray.Attend.length;i++){
				this.$ContentWrapper.append(_this.strLink(retArray.Attend[i],i+1));
				var str="#ZIMG"+(i+1);
				this.requestHeadImg( retArray.Attend[i].id,$(str) );
			}
			this.loaded();
		},
		//字符串拼接
		strLink:function(ret,i){
			var aArray=['<div style="width: 33%;float: left;">',
						'<div class="ZCC-infobox ZCC-infobox-sm  ZCC-margint-10">',
								'<div class="ZCC-entered-imgBox">',
									'<img src="" id="ZIMG'+i+'">',
								'</div>',
								'<div  class="ZCC-entered-infoBox">',
									'<div class="input-group">',
									  '<span class="input-group-addon" >姓名</span>',
									  '<div class="form-control">'+ret.name+'</div>',
									'</div>',
									'<div class="input-group ZCC-margint-10">',
									  '<span class="input-group-addon" >账号</span>',
									  '<div class="form-control">'+ret.accountNumber+'</div>',
									'</div>',
									'<div class="input-group ZCC-margint-10">',
									  '<span class="input-group-addon" >扣扣</span>',
									  '<div class="form-control">'+ret.qq+'</div>',
									'</div>',
									'<div class="input-group ZCC-margint-10">',
									  '<span class="input-group-addon" >电话</span>',
									  '<div class="form-control">'+ret.telphone+'</div>',
									'</div>',
									'<div class="input-group ZCC-margint-10">',
									  '<span class="input-group-addon" >邮箱</span>',
									  '<div class="form-control">'+ret.email+'</div>',
									'</div>',
								'</div>',
						'</div>',
						'</div>'];
			return aArray.join("");

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
	}

	return obj;

})(jQuery,this);