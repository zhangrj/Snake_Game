// JavaScript Document
//设置为全局变量，以便更新功能能够随时更新这些变量
var snake,apple,squareSize,score,speed,
	updateDelay,direction,new_direction,
	addNew,cursors,scoreTextValue,speedTextValue,
	textStyle_Key,textStyle_Value;

var Game={
	
	preload:function(){
		//加载游戏所需资源
		//贪吃蛇与食物
		game.load.image('snake','./assets/images/snake.png');
		game.load.image('apple','./assets/images/apple.png');
	},
	
	create:function(){
		//游戏开始时初始化这些变量
		snake=[]; //数组作为队列使用，保存贪吃蛇的身体部分
		apple={}; //食物对象
		squareSize=15; //方块的边长，使用的图像的15*15像素
		score=0; //当前得分
		speed=0; //游戏速度
		updateDelay=0; //控制刷新速度的变量
		direction='right'; //当前运动方向
		new_direction=null; //存储新下一步方向的缓存变量
		addNew=false; //食物是否被吃掉
		
		//设置一个控制键盘输入的Phaser控制器
		cursors=game.input.keyboard.createCursorKeys();
		
		//设置游戏背景色
		game.stage.backgroundColor="#061f27";
		
		//生成初始贪吃蛇，10个方块长
		//从X=150，Y=150的位置开始添加，每次迭代增加横坐标
		for(var i=0;i<10;i++){
			snake[i]=game.add.sprite(150+i*squareSize,150,'snake');
		}
		
		//生成第一个食物
		this.generateApple();
		
		//在界面顶部添加文字
		//“得分”、“速度”、“操作说明”文字样式
		textStyle_Key={
			font:"bold 14px sans-serif",
			fill:"#46c0f9",
			align:"center"
		};
		//对应数值的文字样式
		textStyle_Value={
			font:"bold 18px sans-serif",
			fill:"#fff",
			align:"center"
		};
		game.add.text(30,20,"得分",textStyle_Key);
		scoreTextValue=game.add.text(90,18,score.toString(),textStyle_Value);
		
		game.add.text(160,20,"操作：上下左右控制方向",textStyle_Key);
		
		game.add.text(500,20,"速度",textStyle_Key);
		speedTextValue=game.add.text(558,18,speed.toString(),textStyle_Value);
	},
	
	update:function(){
		//update()函数将会被高频率（60fps左右）调用来刷新界面
		//处理方向键，并且不允许违规操作
		if(cursors.right.isDown && direction!='left'){
			new_direction='right';
		}
		else if(cursors.left.isDown && direction!='right'){
			new_direction='left';
		}
		else if(cursors.up.isDown && direction!='down'){
			new_direction='up';
		}
		else if(cursors.down.isDown && direction!='up'){
			new_direction='down';
		}
		
		//计算当前游戏速度的公式
		//得分越高，速度越快，最高为10
		speed=Math.min(10,Math.floor(score/5));
		
		//更新屏幕上的数值
		speedTextValue.text=''+speed;
		
		//初始的刷新速率为60fps左右
		//需要降速以使物体可控
		updateDelay++;
		
		//只有当计数器的值等于（10-speed）时，才会触发游戏事件
		//速度越快，计数值越快达到指定值
		//贪吃蛇也就移动的越快
	    if(updateDelay%(10-speed)==0){
			//移动
			var firstCell=snake[snake.length-1],
				//删除数组第一项并返回该项
				//即删除蛇尾
				lastCell=snake.shift(), 
				oldLastCellx=lastCell.x,
				oldLastCelly=lastCell.y;
			
			//如果游戏者从键盘选择了新的方向
			if(new_direction){
				direction=new_direction;
				new_direction=null;
			}
			
			//根据方向更改最后一个单元格相对于蛇头的坐标
			if(direction=='right'){
				lastCell.x=firstCell.x+15;
				lastCell.y=firstCell.y;
			}
			else if(direction=='left'){
				lastCell.x=firstCell.x-15;
				lastCell.y=firstCell.y;
			}
			else if(direction=='up'){
				lastCell.x=firstCell.x;
				lastCell.y=firstCell.y-15;
			}
			else if(direction=='down'){
				lastCell.x=firstCell.x;
				lastCell.y=firstCell.y+15;
			}
			
			//将最后一个单元格即蛇尾添加到队列末端即蛇头
			//并将其作为新的舌头
			snake.push(lastCell);
			firstCell=lastCell;
			//结束移动
			
			//如果吃掉食物则增长蛇的长度
			//在原先蛇尾处添加一块即可，坐标已在上面给出
			if(addNew){
				snake.unshift(game.add.sprite(oldLastCellx,oldLastCelly,'snake'));
				addNew=false;
			}
			
			//检测是否与食物碰撞
			this.appleCollision();
			
			//检测自身是否发生碰撞
			this.selfCollision(firstCell);
			
			//检测是否与墙壁发生碰撞
			this.wallCollision(firstCell);
		}
	},
	
	generateApple:function(){
		//在界面中随机位置绘制食物
		//X在0-585之间（39*15）
		//Y在0-435之间（29*15）
		//floor()方法返回小于等于x的最大整数
		var randomX=Math.floor(Math.random()*40)*squareSize,
			randomY=Math.floor(Math.random()*30)*squareSize;
		apple=game.add.sprite(randomX,randomY,'apple');
	},
	
	appleCollision:function(){
		//检测食物是否与蛇身有重叠
		//如果食物产生在蛇身上
		for(var i=0;i<snake.length;i++){
			if(snake[i].x==apple.x && snake[i].y==apple.y){
				
				//下次蛇移动时，长度加一
				addNew=true;
				
				//销毁食物
				apple.destroy();
				
				//重新生成食物
				this.generateApple();
				
				//分数加一
				score++;
				
				//刷新分数面板
				scoreTextValue.text=score.toString();
			}
		}
	},
	
	selfCollision:function(head){
		//检测蛇头是否与蛇身发生重叠
		for(var i=0;i<snake.length-1;i++){
			if(head.x==snake[i].x && head.y==snake[i].y){
				//游戏结束
				game.state.start('Game_Over');
			}
		}
	},
	
	wallCollision:function(head){
		//检测蛇头是否与界面边界发生碰撞
		if(head.x>=600 || head.x<0 || head.y>=450 || head.y<0){
			//游戏结束
			game.state.start('Game_Over');
		}
	}
};