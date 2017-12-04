ZCC.component.userReport=(function($,window,undefined){

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
		numbLimit:10,
		//构造函数
		init:function(option){
			this.$TableContentWrapper=option.$TableContentWrapper;
			this.$Pager=option.$Pager;
			this.datePrototype();//给DATE对象添加方法，除非需要处理CreateAt方法，否则不用写
			this.requestCount();//请求数据条数
			this.requestData();//请求表格数据
			this.bindDelEvent();//绑定删除按钮的事件
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
						_this.requestData();
					}
			});
		},
		//请求数据条数
		requestCount:function(){
			var _this=this;
			$.ajax({
			  "url": "https://d.apicloud.com/mcm/api/Contact/count",
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
			var _this=this;
			$.ajax({
				"url": "https://d.apicloud.com/mcm/api/Contact",
				"data":{
			  		"filter": {
					    "where": {},
					    "skip": _this.skipNumb,
				    	"limit": _this.numbLimit,
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
			var time = new Date(ret.createdAt).Format("yyyy-MM-dd hh:mm:ss");
			strBox=['<tr>'
		                ,'<th>'+id+'</th>'
		                ,'<th>'+ret.Content+'</th>'
		                ,'<th>'+ret.Mean+'</th>'
		                ,'<th>'+time+'</th>'
		                ,'<th>-</th>'
		                ,'<th>'
		                //老师的跳转：'<a href="#modarc?id='+ arr[i].id +'">修改</a>　<a href="javascript:;" class="delbtn" data-id="'+ arr[i].id +'">删除</a>'
		                	,'<button type="button" class="btn btn-danger btn-sm delbtn" data-id="'+ ret.id +'">删除</button>'
		                ,'</th>'
		            ,'</tr>'];
			return strBox.join('');
		},
		//删除反馈
		delOneData:function(id){
			var _this=this;
			_this.loading();
			$.ajax({
				"type": "POST",
				"url": "https://d.apicloud.com/mcm/api/Contact/" + id,
				"data": {
					"_method": "DELETE"
				},
				"cache": false,
				"headers": apiHeader
			}).done(function(data, status, header){
				//$this.parents('tr').remove();
				_this.requestData();
				_this.loaded();
			}).fail(function(err){});
		},
		// 给按钮绑定删除事件 
		bindDelEvent:function(){
			var _this=this;//obj指针
			this.$TableContentWrapper.off('click.zcc').on('click.zcc', 'tr > th > .delbtn', function(ev){
				ev.stopPropagation();
				var $this = $(this);//被点击的元素
				var isDel = confirm('确认删除吗？');
				if (isDel){
					_this.delOneData($this.attr('data-id'));
				}
			});
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
		//其他方法1：将createAt转换成string
		datePrototype:function(){

			Date.prototype.Format = function (fmt) { //author: meizz 
			    var o = {
			        "M+": this.getMonth() + 1, //月份 
			        "d+": this.getDate(), //日 
			        "h+": this.getHours(), //小时 
			        "m+": this.getMinutes(), //分 
			        "s+": this.getSeconds(), //秒 
			        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
			        "S": this.getMilliseconds() //毫秒 
			    };
			    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
			    for (var k in o)
			    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
			    return fmt;
			}
		}
	}
	return obj;
})(jQuery,this)