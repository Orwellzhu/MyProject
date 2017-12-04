
KJT.component.signCheck=(function($,window,undefined){

	//1.构造函数
	var obj = function(option){
		this.loading();
		this.init(option);
	}
	//2.方法
	obj.prototype={
		constructor:obj,
		//基本属性
		numbSkip:0,
		numbLimit:2,
		//构造函数
		init:function(option){
			this.$TableContentWrapper=option.$TableContentWrapper;
			this.$Pager=option.$Pager;
			
			this.requestCount();//请求数据条数
			this.requestData();//请求表格数据
		},
		//初始化页面条
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
		//请求数据条数
		requestCount:function(){
			this.loading();
			var _this=this;
			$.ajax({
			  "url": "https://d.apicloud.com/mcm/api/Activity/count",
			  // "data":{
			  // 	"filter":{
			  // 		"where":{"Type":1}
			  // 	}
			  // },
			  "cache": false,
			  "headers": apiHeader,
			  "type": "GET",
			}).success(function (data, status, header) {
			  console.log(JSON.stringify(data));
			  var page=Math.ceil(data.count/(_this.numbLimit));
			  console.log("page:"+page);
			  _this.initPager(page);
			}).fail(function (header, status, errorThrown) {
			  //fail body
			});
			
		},
		//请求表格数据
		requestData:function(skipNumb){
			this.loading();
			if(skipNumb==undefined){skipNumb=this.numbSkip};
			console.log("skip:"+skipNumb);
			var _this=this;
			$.ajax({
				"url": "https://d.apicloud.com/mcm/api/Activity",
				"data":{
			  		"filter": {
					    "skip": skipNumb,
				    	"limit": _this.numbLimit,
				    	"fields":["actName","actOrgan","actLoca","actBrief","actState","actTime"],
					}
				},
				"cache": false,
				"headers": apiHeader,
				"type": "GET"
			}).success(function (data, status, header) {
				console.log(JSON.stringify(data));
				_this.strDOM(data);
			}).fail(function (header, status, errorThrown) {
				console.log(JSON.stringify(header));
			  //fail body
			});
		},
		//DOM操作
		strDOM:function(retArray){
			var str="";
			for(var i=0;i<retArray.length;i++){
				str+=this.strLink(retArray[i],i+1);
			}

			this.$TableContentWrapper.html(str);
			this.loaded();
			return true;
		},
		//字符串拼接
		strLink:function(ret,id){
			var strBox=new Array();
			var actState0;
			if (ret.actState==0) {
				strBox=[
							'<tr>',
							    '<th>'+id+'</th>',
				                '<th>'+ret.actName+'</th>',
				                '<th>'+ret.actBrief+'</th>',
				                '<th>'+ret.actOrgan+'</th>',
				                '<th>'+ret.actTime+'</th>',
				                '<th>'+ret.actLoca+'</th>',
				                '<th><button type="button" class="btn btn-success">未开始</button></th>',
				                '<th>',			                	
				                	'<a href="#signCheck_Checkpeople"><button type="button" class="btn btn-primary btn-sm">查看签到结果</button></a>',
				                '</th>',
			            	'</tr>'
			            	];
			}else if(ret.actState==1){
				strBox=[
						'<tr>',
						    '<th>'+id+'</th>',
			                '<th>'+ret.actName+'</th>',
			                '<th>'+ret.actBrief+'</th>',
			                '<th>'+ret.actOrgan+'</th>',
			                '<th>'+ret.actTime+'</th>',
			                '<th>'+ret.actLoca+'</th>',
			                '<th><button type="button" class="btn btn-success">进行中</button></th>',
			                '<th>',			                	
			                	'<a href="#signCheck_Checkpeople"><button type="button" class="btn btn-primary btn-sm">查看签到结果</button></a>',
			                '</th>',
		            	'</tr>'
		            	];
				}else{
					strBox=[
						'<tr>',
						    '<th>'+id+'</th>',
			                '<th>'+ret.actName+'</th>',
			                '<th>'+ret.actBrief+'</th>',
			                '<th>'+ret.actOrgan+'</th>',
			                '<th>'+ret.actTime+'</th>',
			                '<th>'+ret.actLoca+'</th>',
			                '<th><button type="button" class="btn btn-success">已结束</button></th>',
			                '<th>',			                	
			                	'<a href="#signCheck_Checkpeople"><button type="button" class="btn btn-primary btn-sm">查看签到结果</button></a>',
			                '</th>',
		            	'</tr>'
		            	];
				}
			
			return strBox.join('');
		},
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
})(jQuery,this)