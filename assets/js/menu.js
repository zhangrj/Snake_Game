// JavaScript Document
var Menu={
	
	preload:function(){
		//加载图像以便于在其上添加游戏精灵
		//第一个参数表示图像名称
		//第二个参数表示文件路径
		game.load.image('menu','./assets/images/menu.png');
	},
	
	create:function(){
		//添加一个游戏精灵，此处添加的精灵为游戏logo
		//参数以此为：X,Y,图像名称（见上）
		//this.add.sprite(0,0,'menu');
		
		//开始屏幕
		//menu图像作为按钮用来启动游戏
		this.add.button(0,0,'menu',this.startGame,this);
	},
	
	startGame:function(){
		//转换状态为游戏状态
		this.state.start('Game');
	}
	
};