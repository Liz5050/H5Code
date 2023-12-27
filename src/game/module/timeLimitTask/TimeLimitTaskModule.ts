/**
 * 限时任务模块
 */
class TimeLimitTaskModule extends BaseModule {
	
	private _chipItems:any;

	private _baguaEffects:Array<UIMovieClip> = [];
	private _descLoader:GLoader;

	private _leftTime:number = 0;
	private _txtCountDown:fairygui.GRichTextField;

	private _progressBar:ProgressBar1;

	private _txtDesc1:fairygui.GRichTextField;
	private _txtDesc2:fairygui.GRichTextField;
	private _txtDesc3:fairygui.GRichTextField;

	private _btnLookUp:fairygui.GButton;

	private _coundownFlag:boolean = false;
	private _updateFlag:boolean = false;

	private _curCode:number = -1;

	private _list:List;

	public constructor() {
		super(ModuleEnum.TimeLimitTask, PackNameEnum.TimeLimitTask);
	}

	public initOptUI(): void {
		this._chipItems = {}
		for (let i = 1; i < 9; i++) {
			let chip: GLoader = this.getGObject(`loader_img${i}`) as GLoader;
			chip.addClickListener(this.clickChip, this);
			this._chipItems[`chip_${i}`] = chip;
		}

		this._progressBar = this.getGObject("progressBar") as ProgressBar1;


		this._descLoader = this.getGObject("loader_desc") as GLoader;

		let subg:GLoader = this.getGObject("loader_subg") as GLoader;
		subg.load(URLManager.getModuleImgUrl("title_cd_subg.png", PackNameEnum.TimeLimitTask));

		this._txtCountDown = this.getGObject("txt_countdown").asRichTextField;

		this._txtDesc1 = this.getGObject("txt_desc1").asRichTextField;
		this._txtDesc2 = this.getGObject("txt_desc2").asRichTextField;
		this._txtDesc3 = this.getGObject("txt_desc3").asRichTextField;

		this._list = new List(this.getGObject("list").asList);
		
		this._btnLookUp = this.getGObject("btn_lookup").asButton;
		this._btnLookUp.addClickListener(this.onGotoBtnClick, this);
	}

	private clickChip(e:egret.TouchEvent): void{
		for (let i = 1; i < 9; i++){
			let loader: GLoader = <GLoader>this._chipItems[`chip_${i}`];
			let bitmap:egret.Bitmap = <egret.Bitmap>loader.content;
			let isHit:boolean = false;
			if(bitmap){
				isHit = bitmap.hitTestPoint(e.stageX, e.stageY, true);
			}
			if(isHit){
				let level:number = CacheManager.timeLimitTask.suitLevel;
				let chipData: any = ConfigManager.cultivate.getByPk(`${ECultivateType.ECultivateTypeKill},${i},${level}`);//类型，位置，等级
				this.openTips(false, chipData);
				break;
			}
		}
	}

	private openTips(isActived: boolean, chipData: any): void{
		let itemData: ItemData = new ItemData(chipData.itemCode);
		let toolTipData: ToolTipData;
		let extData: any = {};
		if(isActived){
			extData = {"onUpgrade": true};
		}else{
			extData = {"onActive": true};
		}
		if (itemData) {
			toolTipData = new ToolTipData();
			toolTipData.data = itemData;
			toolTipData.extData = extData;
			toolTipData.type = ItemsUtil.getToolTipType(itemData);
			ToolTipManager.show(toolTipData);
		}
	}

	private onGotoBtnClick():void {
		EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Player, { "tabType": PanelTabType.UniqueSkill }, ViewIndex.Two);
	}

	private updateChips():void {
		for (let i = 1; i < 9; i++) {
			let loader: GLoader = <GLoader>this._chipItems[`chip_${i}`];
			let level:number = CacheManager.timeLimitTask.suitLevel;
			let got:boolean = CacheManager.timeLimitTask.hadGotRewards(i);
			if(!got){
				loader.load(URLManager.getModuleImgUrl(`img_${level}_${i}.png`, PackNameEnum.UniqueSkill));
			}else{
				loader.clear();
			}
		}
	}

	public updateLookUpBtnTips():void {
		CommonUtils.setBtnTips(this._btnLookUp, CacheManager.uniqueSkill.checkBtnTip());
	}

	private updateEffect():void {
		if(CacheManager.timeLimitTask.curProgress > 0) {
			this.removeEffect();
		}
		else {
			this.addEffect();
		}
	}

	private addEffect():void {
		if(this._baguaEffects.length > 0) {
			return;
		}

		let com:fairygui.GComponent = this.getGObject("effect_con").asCom;

		let x:number = com.width/2;
		let y:number = com.height/2 + 8;

		for(let i=1; i<9; i++) {
			let effect:UIMovieClip = UIMovieManager.get(PackNameEnum.MCBaGuaPai, x, y, 1, 1);
			effect.setSize(770, 770);
			effect.setPivot(0.5, 0.5, true);
			effect.rotation = -180 + 45*i;
			effect.frame = 0;
			effect.visible = true;
			effect.playing = true;
			com.addChild(effect);

			this._baguaEffects.push(effect);
		}
	}

	private removeEffect():void {
		if(this._baguaEffects.length > 0) {
			for(let eff of this._baguaEffects) {
				UIMovieManager.push(eff);
			}
			UIMovieManager.clear(PackNameEnum.MCBaGuaPai);
			this._baguaEffects = [];
		}
	}

	private updateProgress():void {
		this._progressBar.setValue(CacheManager.timeLimitTask.curProgress, CacheManager.timeLimitTask.maxProgress);
	}

	private updateEffectDesc(): void {
		let level:number = CacheManager.timeLimitTask.suitLevel;

		let data: any = ConfigManager.cultivateSuit.getByPk(`${ECultivateType.ECultivateTypeKill},0,${level},3`);
		this._txtDesc1.text = `   <font color='#fea700'>集齐3块印记</font>\n<font size=20>${data.effectDesc}</font>`;

		data = ConfigManager.cultivateSuit.getByPk(`${ECultivateType.ECultivateTypeKill},0,${level},5`);
		this._txtDesc2.text = `   <font color='#fea700'>集齐5块印记</font>\n<font size=20>${data.effectDesc}</font>`;

		data = ConfigManager.cultivateSuit.getByPk(`${ECultivateType.ECultivateTypeKill},0,${level},8`);
		this._txtDesc3.text = `   <font color='#fea700'>集齐8块印记</font>\n<font size=20>${data.effectDesc}</font>`;
	}

	private doUpdateTaskItems(): void {
		this._updateFlag = false;

		this._list.data = CacheManager.timeLimitTask.taskInfoList;
	}

	private doUpdateTaskItem(): void {
		
	}

	public updateAll(): void {
		if(!this._updateFlag) {
			App.TimerManager.doDelay(10, this.doUpdateTaskItems, this);
			this._updateFlag = true;
		}

		let code:number = CacheManager.timeLimitTask.code;
		this._curCode = code;
		if (code > 0) this._descLoader.load(URLManager.getModuleImgUrl("effect_desc_" + code + ".png", PackNameEnum.TimeLimitTask));

		this.updateEffect();
		this.updateProgress();
		this.updateEffectDesc();
		this.updateCountDown();
		this.updateChips();
		this.updateLookUpBtnTips();
	}

	private updateCountDown(): void {

		let endTimestamp:number = CacheManager.timeLimitTask.endTimestamp;

		// var str = App.DateUtils.formatDate(endTimestamp, "yyyy-mm-dd hh:MM:ss");
		// var ddd = App.DateUtils.formatDate(CacheManager.serverTime.getServerTime(), "yyyy-mm-dd hh:MM:ss");
		// Log.trace(Log.GAME, "当前时间：", ddd, "结束时间：", str);
		
		this._leftTime = endTimestamp - CacheManager.serverTime.getServerTime();
		this.updateCountDownTxt();
		this.starTimer();
	}

	private updateCountDownTxt(): void {
		if(this._leftTime < 0) {
			this._leftTime = 0;
		}
		this._txtCountDown.text = "<font color='#f2e1c0'>任务剩余时间：</font>" + App.DateUtils.getTimeStrBySeconds(this._leftTime, "{2}:{1}:{0}", false, true);
	}

	private onTimerUpdate():void {
		
		this._leftTime -= 1;
		this.updateCountDownTxt();

		if(this._leftTime <= 0) {
			this.stopTimer();
		}
	}

	private starTimer():void {
		if(!this._coundownFlag) {
			this._coundownFlag = true;
			App.TimerManager.doTimer(1000, 0, this.onTimerUpdate, this);
		}
		this.onTimerUpdate();
	}

	private stopTimer():void {
		if(this._coundownFlag) {
			this._coundownFlag = false
			App.TimerManager.remove(this.onTimerUpdate, this);
		}
	}

	private onTaskUpdateHandler(data:any):void {
		this._list.updateListItem(data.index_I-1, data);
		
		this.updateEffect();
		this.updateProgress();

		if(data.status_I == ETaskStatus.ETaskStatusHadEnd) {
			this.flyBaGuaPai(data.index_I);
			this.updateChips(); //需要在flyBaGuaPai之后执行
		}
	}

	private flyBaGuaPai(index:number):void {
		let loader:GLoader = <GLoader>this._chipItems[`chip_${index}`];

		let flyLoader:GLoader = ObjectPool.pop("GLoader");
		let point:egret.Point = loader.localToGlobal();
		flyLoader.x = point.x;
		flyLoader.y = point.y;
		flyLoader.width = loader.width;
		flyLoader.height = loader.height;
		flyLoader.touchable = false;
		flyLoader.fill = fairygui.LoaderFillType.Scale;

		let level:number = CacheManager.timeLimitTask.suitLevel;
		flyLoader.load(URLManager.getModuleImgUrl(`img_${level}_${index}.png`, PackNameEnum.UniqueSkill));

		LayerManager.UI_Tips.addChild(flyLoader);

		let packPos:egret.Point = ControllerManager.home.getHomeBtnGlobalPos(ModuleEnum.Pack, false, true);
		egret.Tween.get(flyLoader).to({x:point.x-15, y:point.y}, 100)
			.to({x:point.x+30, y:point.y}, 90)
			.to({x:point.x-30, y:point.y}, 80)
			.to({x:point.x+30, y:point.y}, 70)
			.to({x:point.x-30, y:point.y}, 60)
			.to({x:point.x+30, y:point.y}, 50)
			.to({x:point.x-15, y:point.y}, 40)
			.to({x:point.x, y:point.y}, 200)
			.to({x:packPos.x+25, y:packPos.y+20, scaleX:0.4, scaleY:0.4 }, 1000, egret.Ease.sineOut)
			.to({alpha:0}, 200)
			.call(function () {
			flyLoader.destroy();
		});
	}

	private onTaskUpdateAllHandler():void {
		if(this._curCode != -1 && this._curCode != CacheManager.timeLimitTask.code) {
			//延时切换
			App.TimerManager.doDelay(2000, () => {
				if(this.isShow) {
					this.updateAll();
				}
			}, this);
		}
		else {
			this.updateAll();
		}
	}

	public onShow(): void {
		super.onShow();
	}

	/**模块显示时开启的监听 */
	protected addListenerOnShow(): void {
		this.addListen1(LocalEventEnum.TimeLimitTaskUpdate, this.onTaskUpdateHandler, this);
		this.addListen1(LocalEventEnum.TimeLimitTaskUpdateAll, this.onTaskUpdateAllHandler, this);
	}

	public onHide(): void {
		super.onHide();

		if(this._updateFlag) {
			App.TimerManager.remove(this.doUpdateTaskItems, this);
			this._updateFlag = false;
		}

	}

}