window.$=HTMLElement.prototype.$=function(selector){
	var r=(this==window?document:this).querySelectorAll(selector);
	return r.length==0?null:
		     r.length==1?r[0]:
		                 r;
} 
HTMLElement.prototype.on=function(ename,fun){
	this.addEventListener(ename,fun);
}
NodeList.prototype.each=function(callback){
	for(var i=0;i<this.length;i++){
		callback(this[i]);
	}
}
$(".app_jd,.service").each(function(elem){
	elem.on("mouseover",showSub);
	elem.on("mouseout",hideSub);
});
/*顶部菜单*/
//定义函数showSub
	//在当前元素下找到id以_items结尾的元素，设置其显示
	function showSub(){
		this.$("[id$='_items']").style.display="block";
		//查找当前元素下的直接子元素a，清除其class为hover
		this.$("b+a").className="hover";
	}
//定义函数hideSub
	//在当前元素下找到id以_items结尾的元素，设置其隐藏
	function hideSub(){
		this.$("[id$='_items']").style.display="none";
		this.$("b+a").className="";
	}

//为class为app_jd的元素，绑定鼠标进入事件showSub：
//$(".app_jd").on("mouseover",showSub);
//为class为app_jd的元素，绑定鼠标移除事件hideSub：
//$(".app_jd").on("mouseout",hideSub);
//为class为service的元素，绑定鼠标进入事件showSub：
//$(".service").on("mouseover",showSub);
//为class为service的元素，绑定鼠标移除事件hideSub：
//$(".service").on("mouseout",hideSub);

/*全部商品分类*/
//为id为category的元素绑定鼠标进入事件：
	$("#category").on("mouseover",function(){
		$("#cate_box").style.display="block";
	})
	$("#category").on("mouseout",function(){
		$("#cate_box").style.display="none";
	})
	$("#cate_box").on("mouseover",function(e){
		var target=e.target;
		if(target!=this){
			while(target.parentNode!=this){
				target=target.parentNode;
			}
			target.$(".sub_cate_box").style.display="block";
			target.firstElementChild.className="hover";
		}
	})
	$("#cate_box").on("mouseout",function(e){
		var target=e.target;
		if(target!=this){
			while(target.parentNode!=this){
				target=target.parentNode;
			}
			target.$(".sub_cate_box").style.display="none";
			target.firstElementChild.className="";
		}
	})

/*标签页*/
//为id为product_detail下的class为main_tabs的元素绑定鼠标单击事件
$("#product_detail .main_tabs").on("click",function(e){
	var target=e.target;
	if(target!=this){
		if(target.nodeName=="A"){
			target=target.parentNode
		}
		if(target.className!="current"){
			$("#product_detail .main_tabs .current").className="";
			target.className="current";
			var show=$("#product_detail .show");
			show!=null&&(show.className="");
			if(target.dataset.i!=-1){
				$("#product_detail [id^=product_]")[target.dataset.i].className="show";
			}
		}
	}
})

/*放大镜*/
var zoom={
	OFFSET:0,//保存起始的left值
	LIWIDTH:0,//保存每个li的宽度
	moved:0,//保存已经左移的li个数
	MSIZE:0,//保存MASK的大小
	MAX:0,//保存mask可用的最大top和left
	init:function(){
		//查找id为icon_list的ul，获得其计算后的样式中的left，保存在OFFSET中
		//查找id为icon_list下的第一个li，获得其计算后的样式中width，保存在LIWIDTH中
		this.OFFSET=parseFloat(getComputedStyle($("#icon_list")).left);
		this.LIWIDTH=parseFloat(getComputedStyle($("#icon_list li:first-Child")).width);
		this.MSIZE=parseFloat(getComputedStyle($("#mask")).width);
		var width=parseFloat(getComputedStyle($("#superMask")).width);
		this.MAX=width-this.MSIZE;
		//查找id为preview下的h1下的直接子元素a，调用each方法
		$("#preview h1>a").each(function(elem){
			elem.on("click",this.move.bind(this))
		}.bind(this));
		//为icon_list绑定鼠标进入事件
		$("#icon_list").on("mouseover",this.changeMimg);
		//为id为superMask的元素绑定鼠标进入事件：
			//让id为mask的元素显示
		//为id为superMask的元素绑定鼠标溢出事件：
			//让id为mask的元素隐藏
		$("#superMask").on("mouseover",function(){
			$("#mask").style.display="block";
			//获得id为mImg的src
			var src=$("#mImg").src;
			//设置id为largeDiv的元素的背景图片
			var i=src.lastIndexOf(".");
			$("#largeDiv").style.backgroundImage="url("+src.slice(0,i-1)+"l"+src.slice(i)+")";
			$("#largeDiv").style.display="block";
		})
		$("#superMask").on("mouseout",function(){
			$("#mask").style.display="none";
			$("#largeDiv").style.display="none";
		})
		//为superMask绑定鼠标移动事件maskMove
		$("#superMask").on("mousemove",this.maskMove.bind(this));
	},
	changeMimg:function(e){
		var target=e.target;
		if(target.nodeName=="IMG"){
			var i=target.src.lastIndexOf(".");
			$("#mImg").src=target.src.slice(0,i).concat("-m").concat(target.src.slice(i));
		}
	},
	maskMove:function(e){
		//获得鼠标相对于父元素的x坐标和y坐标
		//计算top，left
		//设置id为mask的元素的top和left
		var x=e.offsetX;
		var y=e.offsetY;
		var top=y-this.MSIZE/2;
		top=top<0?0:
		top>this.MAX?this.MAX:top;
		var left=x-this.MSIZE/2;
		left=left<0?0:
		left>this.MAX?this.MAX:left;
		$("#mask").style.top=top+"px";
		$("#mask").style.left=left+"px";
		//修改id为largeDiv的元素的背景位置：-left*2 -top*2
		$("#largeDiv").style.backgroundPosition=left*(-16/7)+"px"+" "+top*(-16/7)+"px";
	},
	move:function(e){
		//获得target
		var target=e.target;
		//将moved+
			//如果target的class中有forward?1:-1
		//找到id为icon_list的ul的left为：-(LIWDTH*moved+OFFSET)
		if(target.className.indexOf("disabled")==-1){
			this.moved+=(target.className.indexOf("forward")!=-1?1:-1)
			$("#icon_list").style.left=-this.LIWIDTH*this.moved+this.OFFSET+"px";
		}
		this.checkA();
	},
	checkA:function(){
		//如果moved为0
			//backward禁用
		//否则，如果li的总数-moved==5
			//forword禁用
		//否则
			//都启用
		if(this.moved==0){
			$("[class^='backward']").className="backward_disabled";
		}else if(($("#icon_list li").length-this.moved)==5){
			$("[class^='forward']").className="forward_disabled";
		}else{
			$("[class^='backward']").className="backward";
			$("[class^='forward']").className="forward";
		}
	}
}
zoom.init();