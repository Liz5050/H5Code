class BaseIcon extends fairygui.GComponent {
	protected iconImg:GLoader;

	protected imgTip:BaseIconTip;

	protected _iconResId:number;

	protected _isOpen:boolean;
	protected _openCfg:any;
	protected _hasHide:any;

	protected mc:UIMovieClip;
	protected iconTxt:fairygui.GTextField;
	protected leftTime:number = 0;
	protected curTime:number;
	protected endTimeStr:string = "";
	public constructor(iconId:number) {
		super();
		this._iconResId = iconId;
		this._isOpen = ConfigManager.mgOpen.isOpenedByKey(IconResId[iconId],false);
		this._openCfg = ConfigManager.mgOpen.getByOpenKey(IconResId[iconId]);
		this._hasHide = false;
		this.initView();
	}

	protected initView():void {
		this.iconImg = ObjectPool.pop("GLoader");
		// this.iconImg.fill = fairygui.LoaderFillType.ScaleFree;
		// this.iconImg.autoSize = false;
		// this.iconImg.addEventListener(GLoader.RES_READY,this.onIconReadyHandler,this);
		this.iconImg.load(this.iconUrl);
		this.iconImg.setPivot(0.5,0.5,false);
		this.addChild(this.iconImg);

		this.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.onIconTouchBeginHandler,this);
		this.addEventListener(egret.TouchEvent.TOUCH_END,this.onIconClickHandler,this);
		this.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE,this.onIconOutSideHandler,this);	
	}

	//图标添加到显示列表后调用一次
	public updateAll():void {
	}

	public setIconImg(iconId : number) {
		this.iconImg.load(URLManager.getPackResUrl(PackNameEnum.HomeIcon, iconId.toString()));
	}


	private onIconOutSideHandler(evt:egret.TouchEvent):void {
		this.changeScale(1);
	}

	private onIconTouchBeginHandler(evt:egret.TouchEvent):void {
		this.changeScale(1.05);
	}

	protected onIconClickHandler(evt:egret.TouchEvent):void {
		this.changeScale(1);	
	}

	// private onIconReadyHandler():void {
	// 	this.iconImg.setPivot(0.5,0.5,true);
	// 	let width:number = this.iconImg.texture.textureWidth;
	// 	let height:number = this.iconImg.texture.textureHeight;
	// 	this.iconImg.width = width;
	// 	this.iconImg.height = height;
	// 	this.iconImg.x = width/2;
	// 	this.iconImg.y = height/2;
	// }

	protected changeScale(scale:number):void {
		egret.Tween.removeTweens(this.iconImg);
		egret.Tween.get(this.iconImg).to({scaleX:scale,scaleY:scale},50);
	}

	public get iconResId():number {
		return this._iconResId;
	}

	public get sortId():number {
		return HomeUtil.getSortId(this.iconResId);
	}

	public setIconSize(width:number,height:number):void {
		this.width = width;
		this.height = height;
		this.iconImg.width = width;
		this.iconImg.height = height;
		//setPivot(0.5,0.5,false)
		//由于设置了轴心，没有应用于锚点，设置宽高后图标会向两边扩展撑大，导致左上角（原点）发生向左上偏移宽高的一半，重设坐标就正常了
		this.iconImg.x = 0;
		this.iconImg.y = 0;
	}

	public checkHasHide() : boolean{
		return this._hasHide;
	}

	/**
	 * 对应功能是否开启
	 */
	public get isOpen():boolean {
		return this._isOpen;
	}

	/**
	 * 获取图标对应的功能开启配置
	 */
	public get openCfg():any {
		return this._openCfg;
	}

	public showEffect():void {
		if(!this.mc) {
			this.mc = UIMovieManager.get(PackNameEnum.MCHomeIcon);
			this.mc.setScale(0.97, 0.97);	
			this.mc.x = - this.width / 2 + 17;
			this.mc.y = - this.height / 2 + 20;
			this.addChild(this.mc);
		}
	}

	public removeEffect():void {
		if(this.mc) {
			this.mc.destroy();
			this.mc = null;
		}
	}

	public setTime(time:number):void {
		this.leftTime = time;
		if(!this.iconTxt) {
			this.endTimeStr = HomeUtil.getIconTimeEndStr(this.iconResId);
			this.setText("");
		}
		if(this.leftTime > 0) {
			this.setText(App.DateUtils.getTimeStrBySeconds(this.leftTime,"{2}:{1}:{0}",false,true));
			if(!App.TimerManager.isExists(this.onTimerUpdate,this)) {
				this.curTime = egret.getTimer();
				App.TimerManager.doTimer(1000,0,this.onTimerUpdate,this);
			}
		}
		else {
			this.iconTxt.text = this.endTimeStr;
		}
	}

    public setText(str:string, textColor:number = Color.Green2):void {
		if(!this.iconTxt) {
			this.iconTxt = new fairygui.GTextField();
			this.iconTxt.fontSize = 20;
			this.iconTxt.color = textColor;
			this.iconTxt.y = this.height - 10;
			this.iconTxt.width = this.width;
			this.iconTxt.align = fairygui.AlignType.Center;
			this.iconTxt.autoSize = fairygui.AutoSizeType.None;
			this.iconTxt.stroke = 1;
			this.iconTxt.strokeColor = 0x0;
			this.addChild(this.iconTxt);
		}
		this.iconTxt.text = str;
	}

	protected onTimerUpdate():void {
		let time:number = egret.getTimer();
		this.leftTime -= Math.round((time - this.curTime) / 1000);
		this.curTime = time;
		if(this.leftTime < 0) {
			App.TimerManager.remove(this.onTimerUpdate,this);
			this.iconTxt.text = this.endTimeStr;
			//倒计时结束不移除的图标代表开启活动了
			//倒计时结束移除图标，这里设置一次红点没有影响
			CommonUtils.setBtnTips(this,true);
			return;
		}
		this.iconTxt.text = App.DateUtils.getTimeStrBySeconds(this.leftTime,"{2}:{1}:{0}",false,true);
	}

	public showImgTip():void {
		if(!this.parent){
			return;
		}
		if(!this.imgTip) {
			this.imgTip = new BaseIconTip(this.parent);			
		}
		let param:any = {iconResId:this._iconResId,onImgLoadCb:this.onImgTipReadyHandler,cbObj:this};
		this.imgTip.show(param);
	}

	private onImgTipReadyHandler():void {
		if(this.imgTip) {			
			this.imgTip.setPivot(0, 0.18, true);
			let icoW:number = this.width;
			this.imgTip.x = this.x + icoW - 8; 
			this.imgTip.y = this.y + this.height/4;			
		}
	}

	public hideImgTip():void {
		if(this.imgTip) {
			this.imgTip.destroy();
			this.imgTip = null;
			this._hasHide = true;
		}
	}

	public isImgTipShow() : boolean {
		if(this.imgTip) {
			return true;
		}
		return false;
	}

	public destroy():void {
		this._isOpen = false;
		this._openCfg = null;
		this._iconResId = -1;
		this.iconImg.destroy();
		this.iconImg = null;
		this.hideImgTip();
		if(this.iconTxt) {
			this.iconTxt.removeFromParent();
			this.iconTxt = null;
		}
		if(this.mc) {
			this.mc.destroy();
			this.mc = null;
		}
		App.TimerManager.remove(this.onTimerUpdate,this);
		this.removeEventListener(egret.TouchEvent.TOUCH_BEGIN,this.onIconTouchBeginHandler,this);
		this.removeEventListener(egret.TouchEvent.TOUCH_END,this.onIconClickHandler,this);
		this.removeEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE,this.onIconOutSideHandler,this);
	}

	protected get iconUrl():string {
		// return URLManager.getModuleImgUrl("icon/" + this._iconResId + ".png",PackNameEnum.Home);
		return URLManager.getPackResUrl(PackNameEnum.HomeIcon, this._iconResId.toString());
	}
	

}