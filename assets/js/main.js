// JavaScript Document
var game;

//新建一600px宽、450px高的游戏实例
//Game对象用于管理启动、创建子系统、运行逻辑、渲染
//第三个参数表示要使用的渲染器
//第四个参数表示父级DOM元素
game=new Phaser.Game(600,450,Phaser.AUTO,'');

//添加菜单状态
//第一个参数表示如何调用状态
//第二个参数是一个包含状态功能所需方法的对象
game.state.add('Menu',Menu);

//添加游戏状态
game.state.add('Game',Game);

//添加游戏结束状态
game.state.add('Game_Over',Game_Over);

game.state.start('Menu');