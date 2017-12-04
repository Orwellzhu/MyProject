ZCC.component.messageManage=(function($,window,undefined){
	var obj=function(option){
		this.init(option);
	};
	obj.prototype={
		constructor:obj,
		init:function(option){
			this.$ImgBox=option.$ImgBox;
			this.$Title=option.$Title;
			this.$SchPub=option.$SchPub;
			this.$dateBox=option.$dateBox;
			this.$Editor=option.$Editor;
			this.getId();    
			this.requestData();
 		},
	//获取url中的id
	getId:function(){
		var dataId=window.location.href.split('?id=')[1];
		this.dataId=dataId;
	},
	requestData:function(){
		this.loading();
		var _this=this;
		$.ajax({
            "url": "https://d.apicloud.com/mcm/api/OrganSchool",
            "cache": false,
            "headers": apiHeader,
            "data":{
            	"filter":{
            		"fields":["schTitle","schPub","schTime","schContent","schPic"],
            	     "where":{"id":_this.dataId},
            	     "order":["schTime DESC"]
            	 },
            },
             "type": "GET",
             }).success(function (data, status, header) {
  //success body
            console.log(data[0]);
            _this.strDOM(data[0]);  
             }).fail(function (header, status, errorThrown) {
  //fail body
          });
	},
    strDOM:function(ret){
    	if(ret.schPic!=null){
    		var _this=this;
    	_this.$ImgBox.attr("src",ret.schPic.url);
    };
    	this.$Title.val(ret.schTitle);
    	this.$dateBox.val(ret.schTime);
    	this.$SchPub.val(ret.schPub);
    	this.$Editor.html(ret.schContent);
    	this.loaded();
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
