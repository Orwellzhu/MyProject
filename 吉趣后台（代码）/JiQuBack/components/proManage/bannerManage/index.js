ZCC.component.bannerManage=(function($,window,undefined){
	var obj=function(option){
		this.init(option);
	}

	obj.prototype={
		constructor:obj,
		init:function(option){
			this.loading();
			this.$BannerWrapper=option.$BannerWrapper;
			this.requestData();
			console.log("log");
		},
		//请求数据
		requestData:function(){
			var _this=this;
			$.ajax({
			  "url": "https://d.apicloud.com/mcm/api/Banner",
			  "cache": false,
			  "headers":apiHeader,
			  "data":{
					"filter": {
	    				"fields": ["id","ImgUrl"],
	    				"where": {"Title": "Banner"}
	    			}
			  },
			  "type": "GET"
			}).success(function (data, status, header) {
				console.log(data);
				_this.strDOM(data);
			}).fail(function (header, status, errorThrown) {
			});
		},
		//DOM操作，添加数据
		strDOM:function(retArray){
			var str="";
			if (retArray.length<6) {
				str=this.strLink({},2);
				this.$BannerWrapper.prepend(str);
			}
			for(var i=0;i<retArray.length;i++){
				str=this.strLink(retArray[i],1);
				this.$BannerWrapper.prepend(str);
			}
			this.loaded();

		},
		//字符串拼接
		strLink:function(ret,type){

			var strArray=[];
			if(type==1){
				strArray=['<div class="col-lg-4">'
							,'<div class="ZCC-bannerbox">'
								,'<a href="#bannerManage_Revise?id='+ret.id+'"><div class="ZCC-add"></div></a>'
								,'<div class="ZCC-picbox"><img src="'+ret.ImgUrl+'"></div>'
							,'</div>'
						,'</div>']
			}
			else if(type==2){
				strArray=['<div class="col-lg-4">'
					,'<div class="ZCC-bannerbox">'
						,'<a href="#bannerManage_Edit"><div class="ZCC-picbox ZCC-picbox-last"></div></a>'
					,'</div>'
				,'</div>']
			}
			return strArray.join("");
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

	return obj
})(jQuery,this)