KJT.component.formManage_Checkreport=(function($,window,undefined){

	var obj=function(option){
		this.init(option);
	};

	obj.prototype={
		constructor:obj,
		numbLimit:10,
		numbSkip:0,
		init:function(option){
			//面包屑导航
			this.$ktj_breadcrumb=option.$ktj_breadcrumb;
			this.$ktj_breadcrumb0=option.$ktj_breadcrumb0;
			this.$reportTable=option.$reportTable;
			this.$kjt_noReport=option.$kjt_noReport;
			this.getId();
			this.requestCount();
		},
		//获取url中的id
		getId:function(){
			
			var dataId=window.location.href.split('?id=')[1];
			var dataId0=window.location.href.split('?id=')[2];
			this.dataId=dataId;
			if(window.location.href.split('?id=').length==3){
				//帖子详情面包屑
				this.$ktj_breadcrumb0.attr("href","#formManage_Checkforum?id="+dataId0);
				this.$ktj_breadcrumb.attr("href","#formManage_Checkreport?id="+this.dataId+"?id="+dataId0);
			}else{
				//帖子详情面包屑
				this.$ktj_breadcrumb0.attr("href","#formManage_Checkforum?id="+this.dataId);
				this.$ktj_breadcrumb.attr("href","#formManage_Checkreport?id="+this.dataId);
			}
			//举报信息面包屑
		},
		initPager:function(numb){
			var _this=this;
			//pager已经在index.html引过直接直接复制就行，参数自己改一下by朱陈超
			ZCC.component.Page({
					num:numb,				//页码数
					startnum:1,				//指定页码
					elem:this.$Pager,
					callback:function(n){	//回调函数
						console.log(n);
						_this.numbSkip=_this.numbLimit*(n-1);
						_this.requestData(_this.numbLimit*(n-1));
					}
			});
		},
		requestCount:function(){
			this.loading();
			var _this=this;
			$.ajax({
			  "url": "https://d.apicloud.com/mcm/api/Report/count",
			  "data":{
			  	"filter":{
			  		"where":{"ID":this.dataId}
			  	}
			  },
			  "cache": false,
			  "headers": apiHeader,
			  "type": "GET",
			}).success(function (data, status, header) {
			  console.log(JSON.stringify(data));
			  var page=Math.ceil(data.count/(_this.numbLimit));
			  console.log("page:"+page);
			  _this.initPager(page);
			  _this.requestData();//请求表格数据
			}).fail(function (header, status, errorThrown) {
			  //fail body
			});
			
		},
		requestData:function(skipNumb){
			this.loading();
			if(skipNumb==undefined){skipNumb=this.numbSkip};
			console.log("skip:"+skipNumb);
			var _this=this;
			$.ajax({
				"url": "https://d.apicloud.com/mcm/api/Report",
				"data":{
			  		"filter": {
					    "where": {"ID":this.dataId},
					    "skip": skipNumb,
				    	"limit": _this.numbLimit,
				    	"fields":["User","createdAt","Type","Content"],
				    	"include":"UserPointer",
				    	"includefilter":{"User":{"fields":"Name"}}
					}
				},
				"cache": false,
				"headers": apiHeader,
				"type": "GET"
			}).success(function (data, status, header) {
				console.log(data);
				_this.strDOM(data);
			}).fail(function (header, status, errorThrown) {
				console.log(JSON.stringify(header));
			  //fail body
			});
		},
		strDOM:function(retArray){
			if(retArray.length==0){this.$kjt_noReport.html('<div style="padding-left:20px;font-size: 24px;">无举报信息！</div>');this.loaded();return;}
			var str="";
			for(var i=0;i<retArray.length;i++){
				str+=this.strLink(retArray[i],i+1);
			}

			this.$reportTable.html(str);
			this.loaded();
			return true;
		},
		//DOM
		strLink:function(ret,i){
			var strBox=new Array();
			var crtAt=ret.createdAt.split('T')[0];
			console.log(crtAt);
			strBox=[
				'<tr>',
				    '<th>'+i+'</th>',
	                '<th>'+ret.User.Name+'</th>',
	                '<th>'+crtAt+'</th>',
	                '<th>'+ret.Type+'</th>',
	                '<th>'+ret.Content+'</th>',
            	'</tr>',
			]
			return strBox.join("");
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
	};

	return obj;

})(jQuery,this);
