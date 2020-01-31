var chessBoard=[];//存储棋盘上每一个交差点的落子情况
var me=true;//代表黑棋的颜色
var over=false;//代表棋是否结束
//赢法数组
var wins=[];

//赢法的统计数组
var myWin=[];
var computerWin=[];


//初始化棋盘为全没有落子
for(var i=0;i<9;i++)
{
	chessBoard[i]=[];
	for(var j=0;j<9;j++)
	{
		chessBoard[i][j]=0;//代表为空，没有落子
	}
}
//初始化赢法数组为空
for(var i=0;i<9;i++){
	wins[i]=[];
	for(var j=0;j<9;j++){
		wins[i][j]=[];
	}
}
var count=0;//法统计数组的计数器
// 纵向90°的赢法
for (var i = 0; i < 9; i++) {
    for (var j = 0; j < 5; j++) {
        for (var k = 0; k < 5; k++) {
            wins[i][j + k][count] = true;
        }
        count++;
    }
}

// 横向0°的赢法
for (var i = 0; i < 9; i++) {
    for (var j = 0; j < 5; j++) {
        for (var k = 0; k < 5; k++) {
            wins[j + k][i][count] = true;
        }
        count++;
    }
}
// 斜向135°的赢法
for (var i = 0; i < 5; i++) {
    for (var j = 0; j < 5; j++) {
        for (var k = 0; k < 5; k++) {
            wins[i + k][j + k][count] = true;
        }
        count++;
    }
}

// 斜向45°的赢法
for (var i = 0; i < 5; i++) {
    for (var j = 8; j > 3; j--) {
        for (var k = 0; k < 5; k++) {
            wins[i + k][j - k][count] = true;
        }
        count++;
    }
}

//console.log(count);

//初始化
for(var i=0;i<count;i++)
{
	myWin[i]=0;
	computerWin[i]=0;
}



var chess=document.getElementById("chess");
var context=chess.getContext('2d');

context.strokeStyle="#BFBFBF";//线的颜色


/*
画棋盘
*/
 for(var i=0;i<9;i++)
 {
 	 	
        context.moveTo(24 + i *50, 24);
        context.lineTo(24 + i *50, 426);
        context.stroke();        
       
        context.moveTo(24, 24 + i *50);
        context.lineTo(426, 24 + i * 50);
        context.stroke();
       
}


var oneStep=function(i,j,me)//i，j表示棋盘索引，me表示黑棋或白棋
{
//画棋子
context.beginPath();
context.arc(24+i*50,24+j*50,15,0,2*Math.PI);
context.closePath();
var gradient = context.createRadialGradient(24 + i * 50 + 2, 24 + j * 50 - 2, 13, 24 + i * 50 + 2, 24 + j * 50 - 2, 0);
if(me)//黑棋颜色
{
gradient.addColorStop(0,"#0A0A0A");
gradient.addColorStop(1,"#636766");
}
else{
gradient.addColorStop(0,"#D1D1D1");
gradient.addColorStop(1,"#F9F9F9");
}
context.fillStyle=gradient;
context.fill();
}


//鼠标点击落子
chess.onclick=function(e)
{
	if(over)
		{return;}
	if(!me)
	{
		return;
	}
	var x=e.offsetX;//坐标
	var y=e.offsetY;
	var i=Math.floor(x/50);//向下取整
	var j=Math.floor(y/50);
	if(chessBoard[i][j]==0)
{
	oneStep(i,j,me);
	chessBoard[i][j]=1;//黑棋为1
	
	for(var k=0;k<count;k++)
   {
		if(wins[i][j][k])
		{
			myWin[k]++;
			computerWin[k]=6;
			if (myWin[k] == 5)
			 {
			setTimeout(function(){
			window.alert("你赢了");
			},0);
			over = true;
		}
		}
	}
	if(!over)
	{	me=!me;//如果没有结束就计算机下棋
		computerAI();
	}
}

}

var computerAI=function()
{
 	var myScore=[];
 	var computerScore=[];
 	var max=0;//保存最高分数
 	var u=0,v=0;//保存最高分数点的坐标
 	for(var i=0;i<9;i++)//初始化
 	{
 		myScore[i]=[];
 		computerScore[i]=[];
 		for(var j=0;j<9;j++)
 		{
 			myScore[i][j]=0;
 			computerScore[i][j]=0;
 		}
 	}
 	// 通过赢法统计数组为两个二维数组分别计分
 	for(var i=0;i<9;i++)
 	{
 		for(var j=0;j<9;j++)
 		{
 			if(chessBoard[i][j]==0)
 			{
 				for(var k=0;k<count;k++)
 				{
 					if(wins[i][j][k])
 					{
 						if(myWin[k]==1)
 						{
 							myScore[i][j]+=200;
 						}else if(myWin[k]==2)
 						{
 							myScore[i][j]+=400;	
 						}else if(myWin[k]==3)
 						{
 							myScore[i][j]+=2000;	
 						}else if(myWin[k]==4)
 						{
 							myScore[i][j]+=10000;	
 						}

 						if(computerWin[k]==1)
 						{
 							computerScore[i][j]+=220;
 						}else if(computerScore[k]==2)
 						{
 							computerScore[i][j]+=420;
 						}else if(computerScore[k]==3)
 						{
 							computerScore[i][j]+=2100;
 						}else if(computerScore[k]==4)
 						{
 							computerScore[i][j]+=20000;
 						}
 					}
 				}
 				// 如果玩家(i,j)处比目前最优的分数大，则落子在(i,j)处

 				if(myScore[i][j]>max)
 				{
 					max=myScore[i][j];
 					u=i;
 					v=j;
 				}
 				// 如果玩家(i,j)处和目前最优分数一样大，则比较电脑在该位置和预落子的位置的分数
 				else if(myScore[i][j]==max){
 					if(computerScore[i][j]>computerScore[u][v]){
 						u=i;
 						v=j;
 					}
 				}
 				// 如果电脑(i,j)处比目前最优的分数大，则落子在(i,j)处
 				if(computerScore[i][j]>max)
 				{
 					max=computerScore[i][j];
 					u=i;
 					v=j;
 				}
// 如果电脑(i,j)处和目前最优分数一样大，则比较玩家在该位置和预落子的位置的分数
 				else if(computerScore[i][j]==max){
 					if(myScore[i][j]>myScore[u][v]){
 						u=i;
 						v=j;
 					}
 				}
 			}
 		}
 	}
 	oneStep(u,v,false);
 	chessBoard[u][v]=2;//表示计算机在此处落子
 	for(var k=0;k<count;k++)
   {
		if(wins[u][v][k])
		{
			computerWin[k]++;
			myWin[k]=6;
			if (computerWin[k] == 5)
			 {
			setTimeout(function(){
			window.alert("计算机赢了");
			},0);
			over = true;
		}
		}
	}
	if(!over)
	{	
		me=!me;
	}
}