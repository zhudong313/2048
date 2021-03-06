// JavaScript Document
var boxNode=document.getElementById("box");
var ulNode=boxNode.getElementsByTagName('ul')[0];
var spanWidth=100;
var spanBorder=5;

var arr=[];//记录每个格子是否有数字，有数字的话，记录是几
var spanArrAll=[];//记录span对应有位置的span节点
function startFun(){
	var frag=document.createDocumentFragment();
	var randomArr=[];
	for(var y=0,n=0;y<4;y++){
		arr[y]=[];//二维数组
		spanArrAll[y]=[];
		for(var x=0;x<4;x++,n++){
			arr[y][x]=false;//表示无数字
			spanArrAll[y][x]=null;
			
			var li=document.createElement('li');//创建画布的每个格子
			frag.appendChild(li);
			
			randomArr[n]=n;//创建[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
		}
	}
	boxNode.innerHTML='<ul></ul>';
	ulNode=boxNode.getElementsByTagName('ul')[0];
	ulNode.appendChild(frag);//创建画布
	
	if(window.localStorage){//如果存在本地数据就不重新开始
		if(localStorage.arr)
		{
			return;
		}
	}
	
	//开始随机的两个
	var spanArr=[];//记录随机的两个span
	for(var i=0;i<2;i++){
		var randomPos=Math.floor(Math.random()*randomArr.length);//随机从0-15抓取
		var randomVal=randomArr[randomPos];
		var spanX=randomVal%4;//将一维转二维x
		var spanY=Math.floor(randomVal/4);//将一维转二维y
		var span=document.createElement('span');//创建数字
		span.style.left=(spanWidth+spanBorder)*spanX+"px";//让数字对应到坐标
		span.style.top=(spanWidth+spanBorder)*spanY+"px";//让数字对应到坐标
		//span.x=spanX;
		//span.y=spanY;
		if(i==0)
		{
			span.innerHTML=2;
			arr[spanY][spanX]=2;
		}
		else{
			if(Math.round(Math.random())==1)
			{
				span.innerHTML=4;
				arr[spanY][spanX]=4;
				span.className="span4";
			}
			else{
				span.innerHTML=2;
				arr[spanY][spanX]=2;
			}	
		}
		
		spanArrAll[spanY][spanX]=span;
		spanArr[i]=span;
		frag.appendChild(span);
		randomArr.splice(randomPos,1);//防止重复抓取
	}
	
	boxNode.appendChild(frag);//随机生成两个数字
	
	window.setTimeout(function(){
		spanArr[0].style.transform="scale(1,1)";
		spanArr[1].style.transform="scale(1,1)";
	},0);
}

function localStorageFun(){//本地储存
	startFun();
	if(window.localStorage){
		if(localStorage.arr)
		{
			
			var localArr=eval("["+localStorage.arr+"]");
			//console.log(localArr);
			for(var i=0;i<localArr.length;i++){
				var iX=Math.floor(i%4);
				var iY=Math.floor(i/4);
				arr[iY][iX]=localArr[i];
			}
			
			var frag=document.createDocumentFragment();
			for(var y=0;y<4;y++){
				spanArrAll[y]=[];
				for(var x=0;x<4;x++){
					if(arr[y][x]!=false){
						var span=document.createElement("span");
						span.innerHTML=arr[y][x];
						span.style.left=(spanWidth+spanBorder)*x+"px";//让数字对应到坐标
						span.style.top=(spanWidth+spanBorder)*y+"px";//让数字对应到坐标
						span.style.transform="scale(1,1)";
						span.className="span"+arr[y][x];
						spanArrAll[y][x]=span;
						frag.appendChild(span);
					}
				}
			}
			boxNode.appendChild(frag);
		}

	}
	
}
localStorageFun();//开始游戏
var restartNode=document.getElementById('restart')
restartNode.onclick=function(){//重新开始游戏
	if(window.localStorage)
	{
		localStorage.removeItem("arr");//删除本地数据
	}
	localStorageFun();//开始游戏
};
if(window.addEventListener){//兼容移动端
	restartNode.addEventListener('touchstart',function(){//重新开始游戏
		if(window.localStorage)
		{
			localStorage.removeItem("arr");//删除本地数据
		}
		localStorageFun();//开始游戏
	});
}

//console.log(arr);
document.onkeydown=function(e){
	var event=window.event || e;
	var keyCode=event.keyCode || event.which;
	//alert(keyCode);//上:38;下:40;左：37；右39
	
	keyDownFun(keyCode);
}

if(document.addEventListener){//判断是否支持此方法
	var startX,startY,endX,endY;
	document.addEventListener("touchstart",function(event){
		event.preventDefault();// 阻止浏览器默认事件，重要
		//console.log(event,1);
		var touch = event.targetTouches[0];
		startX=touch.pageX;//手指所在的坐标x
		startY=touch.pageY;//手指所在的坐标y
	});
	document.addEventListener("touchmove",function(e){
												   
	});
	document.addEventListener("touchend",function(event){
		//console.log(event,2);
		var touch = event.changedTouches[0];
		endX=touch.pageX;//手指所在的坐标x
		endY=touch.pageY;//手指所在的坐标Y
		
		var x=Math.abs(startX-endX);
		var y=Math.abs(startY-endY);
		//上:38;下:40;左：37；右39
		if(x-y>0)
		{
			if(startX-endX>10){//向左
				keyDownFun(37);
			}
			else if(startX-endX<-10)//向右
			{
				keyDownFun(39);
			}
		}
		else{
			if(startY-endY>10){//向上
				keyDownFun(38);
			}
			else if(startY-endY<-10)//向下
			{
				keyDownFun(40);
			}
		}
	});
}

function keyDownFun(keyCode){
	if(keyCode>=37 && keyCode<=40)
	{
	
		var bool=false;//false表示没有移动；true表示移动了
		if(keyCode==38)//上
		{
			
			for(var y=0;y<4;y++){
				for(var x=0;x<4;x++){		
					if(arr[y][x]!=false)//存在的元素
					{
						var posArr=keyCodeUpFun(x,y);//做递归
						//console.log(y,x,spanArrAll);
						if(y==posArr[1] && x==posArr[0])//没移动
						{
							continue;//直接进入下一次循环
						}
						
						bool=true;
						spanArrAll[y][x].style.left=(spanWidth+spanBorder)*posArr[0]+"px";//让数字对应到坐标
						spanArrAll[y][x].style.top=(spanWidth+spanBorder)*posArr[1]+"px";//让数字对应到坐标
						
						if(spanArrAll[posArr[1]][posArr[0]]!=null)//将合并的上面那个删除
							spanArrAll[posArr[1]][posArr[0]].parentNode.removeChild(spanArrAll[posArr[1]][posArr[0]]);
						
						spanArrAll[posArr[1]][posArr[0]]=spanArrAll[y][x];
						spanArrAll[posArr[1]][posArr[0]].innerHTML=arr[posArr[1]][posArr[0]];//取对应数据的值赋予对应的节点
						spanArrAll[posArr[1]][posArr[0]].className="span"+arr[posArr[1]][posArr[0]];//给对应节点加样式
						
						spanArrAll[y][x]=null;
						
						//console.log(y,x);
					}
				}
			}
			
		}
		else if(keyCode==40){//下
				for(var y=3;y>=0;y--){
					for(var x=0;x<4;x++){	
						if(arr[y][x]!=false)//存在的元素
						{
							var posArr=keyCodeDownFun(x,y);//做递归
							//console.log(y,x,spanArrAll);
							if(y==posArr[1] && x==posArr[0])//没移动
							{
								continue;//直接进入下一次循环
							}
							
							bool=true;
							spanArrAll[y][x].style.left=(spanWidth+spanBorder)*posArr[0]+"px";//让数字对应到坐标
							spanArrAll[y][x].style.top=(spanWidth+spanBorder)*posArr[1]+"px";//让数字对应到坐标
							
							if(spanArrAll[posArr[1]][posArr[0]]!=null)//将合并的上面那个删除
								spanArrAll[posArr[1]][posArr[0]].parentNode.removeChild(spanArrAll[posArr[1]][posArr[0]]);
							
							spanArrAll[posArr[1]][posArr[0]]=spanArrAll[y][x];
							spanArrAll[posArr[1]][posArr[0]].innerHTML=arr[posArr[1]][posArr[0]];//取对应数据的值赋予对应的节点
							spanArrAll[posArr[1]][posArr[0]].className="span"+arr[posArr[1]][posArr[0]];//给对应节点加样式
							
							spanArrAll[y][x]=null;
							
							//console.log(y,x);
						}
					}
				}
		}
		else if(keyCode==37){//左
				for(var x=0;x<4;x++){
					for(var y=0;y<4;y++){		
						if(arr[y][x]!=false)//存在的元素
						{
							var posArr=keyCodeLeftFun(x,y);//做递归
							//console.log(y,x,spanArrAll);
							if(y==posArr[1] && x==posArr[0])//没移动
							{
								continue;//直接进入下一次循环
							}
							
							bool=true;
							spanArrAll[y][x].style.left=(spanWidth+spanBorder)*posArr[0]+"px";//让数字对应到坐标
							spanArrAll[y][x].style.top=(spanWidth+spanBorder)*posArr[1]+"px";//让数字对应到坐标
							
							if(spanArrAll[posArr[1]][posArr[0]]!=null)//将合并的上面那个删除
								spanArrAll[posArr[1]][posArr[0]].parentNode.removeChild(spanArrAll[posArr[1]][posArr[0]]);
							
							spanArrAll[posArr[1]][posArr[0]]=spanArrAll[y][x];
							spanArrAll[posArr[1]][posArr[0]].innerHTML=arr[posArr[1]][posArr[0]];//取对应数据的值赋予对应的节点
							spanArrAll[posArr[1]][posArr[0]].className="span"+arr[posArr[1]][posArr[0]];//给对应节点加样式
							
							spanArrAll[y][x]=null;
							
							//console.log(y,x);
						}
					}
				}
		}
		else if(keyCode==39){//右
				for(var x=3;x>=0;x--){
					for(var y=0;y<4;y++){	
						if(arr[y][x]!=false)//存在的元素
						{
							var posArr=keyCodeRightFun(x,y);//做递归
							//console.log(y,x,spanArrAll);
							if(y==posArr[1] && x==posArr[0])//没移动
							{
								continue;//直接进入下一次循环
							}
							
							bool=true;
							spanArrAll[y][x].style.left=(spanWidth+spanBorder)*posArr[0]+"px";//让数字对应到坐标
							spanArrAll[y][x].style.top=(spanWidth+spanBorder)*posArr[1]+"px";//让数字对应到坐标
							
							if(spanArrAll[posArr[1]][posArr[0]]!=null)//将合并的上面那个删除
								spanArrAll[posArr[1]][posArr[0]].parentNode.removeChild(spanArrAll[posArr[1]][posArr[0]]);
							
							spanArrAll[posArr[1]][posArr[0]]=spanArrAll[y][x];
							spanArrAll[posArr[1]][posArr[0]].innerHTML=arr[posArr[1]][posArr[0]];//取对应数据的值赋予对应的节点
							spanArrAll[posArr[1]][posArr[0]].className="span"+arr[posArr[1]][posArr[0]];//给对应节点加样式
							
							spanArrAll[y][x]=null;
							
							//console.log(y,x);
						}
					}
				}
		}
		
		createOne(bool);
	
	}
	
	if(window.localStorage){//本地储存
	 	localStorage.arr=arr.toString();
	}
	//console.log(arr);
}

function keyCodeUpFun(x,y){//上；只跟当前的前一个进行比较
	var xx=x,yy=y-1;//找之前的比较
	if(yy>=0)
	{
		if(arr[yy][xx]!=false && arr[yy][xx]==arr[y][x])//与之前相邻相等
		{
			arr[yy][xx]+=arr[yy][xx];
			arr[y][x]=false;
			return [xx,yy];//合并的直接返回
		}
		if(arr[yy][xx]!=false && arr[yy][xx]!=arr[y][x])//与之前相邻不相等
		{
			return [x,y];
		}
		else{//没有数
			arr[yy][xx]=arr[y][x];
			arr[y][x]=false;
			return keyCodeUpFun(xx,yy);
		}
	}
	else
	{
		return [x,y];
	}
}


function keyCodeDownFun(x,y){//下；只跟当前的前一个进行比较
	var xx=x,yy=y+1;//找之前的比较
	if(yy<4)
	{
		if(arr[yy][xx]!=false && arr[yy][xx]==arr[y][x])//与之前相邻相等
		{
			arr[yy][xx]+=arr[yy][xx];
			arr[y][x]=false;
			return [xx,yy];//合并的直接返回
		}
		if(arr[yy][xx]!=false && arr[yy][xx]!=arr[y][x])//与之前相邻不相等
		{
			return [x,y];
		}
		else{//没有数
			arr[yy][xx]=arr[y][x];
			arr[y][x]=false;
			return keyCodeDownFun(xx,yy);
		}
	}
	else
	{
		return [x,y];
	}
}


function keyCodeLeftFun(x,y){// 左；只跟当前的前一个进行比较
	var xx=x-1,yy=y;//找之前的比较
	if(x>=0)
	{
		if(arr[yy][xx]!=false && arr[yy][xx]==arr[y][x])//与之前相邻相等
		{
			arr[yy][xx]+=arr[yy][xx];
			arr[y][x]=false;
			return [xx,yy];//合并的直接返回
		}
		if(arr[yy][xx]!=false && arr[yy][xx]!=arr[y][x])//与之前相邻不相等
		{
			return [x,y];
		}
		else{//没有数
			arr[yy][xx]=arr[y][x];
			arr[y][x]=false;
			return keyCodeLeftFun(xx,yy);
		}
	}
	else
	{
		return [x,y];
	}
}

function keyCodeRightFun(x,y){// 左；只跟当前的前一个进行比较
	var xx=x+1,yy=y;//找之前的比较
	if(x<4)
	{
		if(arr[yy][xx]!=false && arr[yy][xx]==arr[y][x])//与之前相邻相等
		{
			arr[yy][xx]+=arr[yy][xx];
			arr[y][x]=false;
			return [xx,yy];//合并的直接返回
		}
		if(arr[yy][xx]!=false && arr[yy][xx]!=arr[y][x])//与之前相邻不相等
		{
			return [x,y];
		}
		else{//没有数
			arr[yy][xx]=arr[y][x];
			arr[y][x]=false;
			return keyCodeRightFun(xx,yy);
		}
	}
	else
	{
		return [x,y];
	}
}

function createOne(bool){//移动玩随机生成一个////bool的false表示没有移动；true表示移动了
	var lostNum=0;
	for(var i=0;i<arr.length*arr.length;i++){
		var iX=Math.floor(i%4);
		var iY=Math.floor(i/4);
		if(arr[iY][iX]!=false){
			lostNum++;
		}
	}
	//console.log(lostNum);
	if(lostNum==arr.length*arr.length){
		alert("您已经无路可走了！点击确定重新开始了");
		if(window.localStorage)
		{
			localStorage.removeItem("arr");//删除本地数据
		}
		localStorageFun();//开始游戏
		return 
	}
	
	if(!bool)
		return;

	var num=Math.floor(16*Math.random());//0-15;//随机得到一个数
	var x=num%4;//将一维转二维x
	var y=Math.floor(num/4);//将一维转二维y
	if(arr[y][x])//判断随机的这个存不存在
	{
		 createOne(bool);
	}
	else//不存在
	{
		var span=document.createElement("span");
		span.style.left=(spanWidth+spanBorder)*x+"px";//让数字对应到坐标
		span.style.top=(spanWidth+spanBorder)*y+"px";//让数字对应到坐标
		if(Math.round(Math.random())==1)
		{
			span.innerHTML=4;
			arr[y][x]=4;
			span.className="span4";
		}
		else{
			span.innerHTML=2;
			arr[y][x]=2;
		}
		spanArrAll[y][x]=span;
		
		boxNode.appendChild(span);//随机生成两个数字
	
		window.setTimeout(function(){
			span.style.transform="scale(1,1)";
		},0);
	}
}
