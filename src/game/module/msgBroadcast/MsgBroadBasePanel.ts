class MsgBroadBasePanel {	
	public static MAX_TWEEN:number = 2;
	/*
	public static SHOW_AREA_W:number = 560;
	public static POS_X:number = 35;
	public static POS_Y:number = 22;
	*/
	protected view: fairygui.GComponent;
	//protected txt_rollTip: fairygui.GTextField;
	protected img_bg: fairygui.GImage;
	protected  maskShape:fairygui.GGraph;
	protected runCount: number = 0;
	protected cell:ChatMsgCell;
	protected isTooWid:boolean;
	protected tweenTar:any;
	protected noticeData:any;
	protected isTrumpet:boolean;
	protected maskX:number = 35 
	protected maskY:number = 22;
	protected maskArea:number = 560;
	
	public constructor(view: fairygui.GComponent) {
		this.view = view;
		this.initUI();
	}
	protected initUI(): void {
		this.view.touchable = false;
		/*
		this.txt_rollTip = this.view.getChild("txt_rollTip").asTextField;
		this.txt_rollTip.autoSize = fairygui.AutoSizeType.Both;
		this.txt_rollTip.visible = false;
		*/
		this.img_bg = this.view.getChild("img_bg").asImage;
		this.view.setPivot(0.5, 0.5);
		this.maskShape = new fairygui.GGraph();
		this.maskShape.graphics.beginFill(0xff0000,1);
		this.maskShape.graphics.drawRect(this.maskX,this.maskY,this.maskArea,this.view.height);
		this.maskShape.graphics.endFill();
		this.view.addChild(this.maskShape);

		this.cell = new ChatMsgCell(0, "　　 　   ", 24, "#" + Color.White.toString(16),false,false);
		this.view.addChild(this.cell);
		
	}

	public update(data: any): void {
		this.noticeData = data;
		this.visible = true;
		this.runCount = 0;
		this.isTrumpet = this.noticeData.type_I == EChatType.EChatTypeTrumpet;
		if(this.isTrumpet){
			this.cell.setFontColor(Color.getRumor("7"));
			this.cell.setFontSize(22); //喇叭字体不一样
			this.cell.setStrokeColor(0x000000);
		}
		var smsg:SChatMsg = ChatUtils.noticeToChatMsg(data);
		this.cell.update(smsg);
		this.cell.x = this.maskX + (this.maskArea - this.cell.contentW) / 2;
		this.cell.y = this.maskY;		
		this.isTooWid = this.cell.x < this.maskX;
		this.tweenTar = this.view;		
		if(!this.cell.displayObject.mask){
			this.cell.displayObject.mask = this.maskShape.displayObject;
		}
		this.cell.displayObject.mask = this.maskShape.displayObject;		
		
	}
	
	/**
	 * 设置缓动效果
	 */
	public runTween(isIn:boolean):void{		
		this.roundTween();
	}


	protected roundTween():void{
		var inf:any = this.getRoundTweenProps();
		this.runCount++;
		this.startTween({x:inf.tx},inf.sec);
	}

	/**缩放动画 */
	protected scaleTween(isIn:boolean):void{
		var tarScale: number = isIn ? 1 : 0;
		var initScale: number = isIn ? 0 : 1;
		this.view.scaleX = this.view.scaleY = initScale;
		var duration: number = 200;
		this.runCount++;
		this.startTween({ scaleX: tarScale, scaleY: tarScale }, duration);
	}

	/**获取跑马灯的缓动属性 */
	protected getRoundTweenProps():any{		
		var tx:number = this.img_bg.x-this.cell.contentW;
		this.cell.x = this.img_bg.x + this.img_bg.width; 
		var sec:number = this.calSpeed(this.cell.x - tx); //100px/s
		return {sec:sec,tx:tx};
	}

	protected getRadioRoundProps():any{
		this.cell.x = this.maskX
		var dist:number = this.cell.contentW;
		var tx:number = this.cell.x - dist;
		var sec:number = this.calSpeed(dist); //100px/s
		return {sec:sec,tx:tx};
	}

	protected calSpeed(dist:number):number{
		var sec:number = dist/100; //100px/s
		sec*=1000;
		return sec;
	}

	/**跑下一个 跑马灯消息 */
	protected runNext(): void {
		/*
		改成 所有系统消息 立马更新到系统频道 2018年9月14日10:51:04
		if(!this.isTrumpet){ //个人喇叭不添加
			var msg:SChatMsg = ChatUtils.noticeToChatMsg(this.noticeData);
			if(msg.chatType_I!=EChatType.EChatTypeBattleFiled){ //战场消息(血战五洲),立马更新到显示了 不用重复更 
				EventManager.dispatch(LocalEventEnum.ChatAddChanelMsg,msg);
			}			
		}	
		*/
		
		this.runCount = 0;
		var nextData: any = this.getNextData();
		if (nextData) {
			this.update(nextData);
			this.runTween(true);
		} else {
			this.visible = false;
		}
		
	}
	protected startTween(toProps:any,douration:number):void{
		var callFn:Function = this.isNext()?this.runNext:this.onShowComplete; 
		TweenUtils.to(this.getTweenTar(),toProps,douration,callFn,this);
	}
	protected onShowComplete(): void { //出现的缓动结束
		this.runTween(true);
	}

	/**
	 * 场景广播消失的处理
	 */
	protected dealRadioTween():void{
		if (this.runCount < MsgBroadBasePanel.MAX_TWEEN) {			
			if (this.isTooWid) {				
				App.TimerManager.doDelay(1000, () => { //1秒后缩小隐藏				
					this.tweenTar = this.cell;
					this.roundTween();
				}, this);
			} else {
				App.TimerManager.doDelay(2000, () => { //2秒后缩小隐藏				
					this.runTween(false);
				}, this);

			}
		}

	}

	protected isNext():boolean{
		return this.runCount>=MsgBroadBasePanel.MAX_TWEEN;
	}
	protected getTweenTar():any{
		return this.tweenTar;
	}
	protected getNextData(): any {
		return null;
	}

	public set visible(value: boolean) {
		this.view.visible = value;
	}

	public get visible(): boolean {
		return this.view.visible;
	}

}