// JavaScript Document
var Game_Over={
	
	preload:function(){
		//加载游戏结束图像
		game.load.image('gameover','./assets/images/gameover.png');
	},
	
	create:function(){
		//创建一个按钮以重启游戏
		this.add.button(0,0,'gameover',this.startGame,this);
		
		//添加文字，显示最终游戏结果
		game.add.text(235,310,"最终得分",{font:"bold 16px sans-serif",fill:"#46c0f9",align:"center"});
		game.add.text(350,308,score.toString(),{font:"bold 20px sans-serif",fill:"#fff",align:"center"});
		game.add.text(235,350,"单击以重新开始游戏",{font:"bold 16px sans-serif",fill:"#46c0f9",align:"center"});
	},
	
	startGame:function(){
		//回到游戏状态
		this.state.start('Game');
	}
};