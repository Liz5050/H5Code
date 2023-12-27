/**选中boss显示的血条信息 */
class RpgBossInfView extends BaseContentView {
	private static NAME_FIX: string = "bossBar_";
	private static BAR_W:number = 383;
	private static BAR_H:number = 19;

	private hpGroup:fairygui.GGroup;
	protected loader_bosshead: GLoader;
	protected txt_bossname: fairygui.GRichTextField;
	protected txt_bosshealth: fairygui.GTextField;
	protected txt_bosslevel: fairygui.GTextField;
	private barContainer:fairygui.GComponent;
	/**所有血条皮肤 */
	protected lifBarImgs: fairygui.GImage[];
	protected curLifeBar: fairygui.GImage;
	protected curLifeBarBg: fairygui.GImage;
	// private loaderBg:GLoader;

	protected isReset: Boolean = true;
	/**血条总数 */
	protected barTotal: number = 0;
	/**当前显示第几层的血条 */
	protected curBarIdx: number = -1;
	/**每层血条的最大值 */
	protected lifeAvgMax: number = 0;
	private curImgIdx:number = 0;

	protected lastEntityInfo: any;
	protected entityInfo: any;
	protected maskRect: egret.Rectangle;
	protected maskRectBg: egret.Rectangle;
	protected isChangeBoss:boolean;	
	protected barStyleTotal:number = 0; //最大样式数量

	private buffBar:UIProgressBar;
	private _bossConfig: any;

	private totalTime:number;
	private leftTime:number = -1;
	private curTime:number;
	private isShowBuffTip:boolean = false;
    private c1: fairygui.Controller;
    private rewardBtn: fairygui.GButton;
    private copyView:BaseCopyPanel;
	public constructor() {
		super(PackNameEnum.SceneBossInfo, "BossInfo", null, LayerManager.UI_Home);
		this.lifBarImgs = [];
		this.isCenter = true;
		
	}
	
	public initUI():void{
		super.initUI();
		if (this.view) {
			this.view.setSize(fairygui.GRoot.inst.width, fairygui.GRoot.inst.height);
			this.view.addRelation(fairygui.GRoot.inst, fairygui.RelationType.Size);
		}
	}

	protected addListenerOnShow(): void {
        //for override
        this.addListen1(LocalEventEnum.SwitchBossLifeBarVisible,this.onBossLifeBarVisibleChange,this);
    }

	private onBossLifeBarVisibleChange():void  {
		if(CacheManager.copy.isInCopyByType(ECopyType.ECopyCheckPoint)) {
			this.visible = CacheManager.checkPoint.isShowBossLife;
		}
		else {
			this.visible = true;
		}
	}

	/**计算血条的样式 */
	protected calBarCount():void{
		this.barStyleTotal = 1;
		var nameFix: string = RpgBossInfView.NAME_FIX;
		var barImg:fairygui.GImage = fairygui.UIPackage.createObject(PackNameEnum.SceneBossInfo,nameFix+this.barStyleTotal).asImage;
		while(barImg){
			this.barStyleTotal++;
			var gObj:fairygui.GObject = fairygui.UIPackage.createObject(PackNameEnum.SceneBossInfo,nameFix+this.barStyleTotal);
			if(gObj){
				barImg =gObj.asImage; 
			}else{
				barImg = null;
			}
		}
		this.barStyleTotal--;
	}
	protected constructFromXML(xml: any): void {
		super.constructFromXML(xml);
	}

	public initOptUI(): void {
		this.txt_bossname = this.getGObject("txt_bossname").asRichTextField;
		this.txt_bosslevel = this.getGObject("txt_bosslevel").asTextField;
		this.txt_bosshealth = this.getGObject("txt_bosshealth").asTextField;
		this.loader_bosshead = <GLoader>this.getGObject("loader_bosshead");
		// this.loaderBg = <GLoader>this.getGObject("loader_bg");
		this.barContainer = this.getGObject("barContainer").asCom;
		this.buffBar = this.getGObject("bar_buff") as UIProgressBar;
		this.buffBar.setStyle(URLManager.getCommonIcon("progressBar_3"),URLManager.getCommonIcon("bg_2"),346,18,5,6,UIProgressBarType.Mask);
		this.buffBar.setValue(1,1);
		this.buffBar.visible = false;
		// this.loaderBg.load(URLManager.getPackResUrl(PackNameEnum.SceneBossInfo,"boss_bg1"));
		
		this.hpGroup = this.getGObject("hpGroup").asGroup;

        this.c1 = this.getController("c1");
        this.rewardBtn = this.getGObject("btn_bossReward").asButton;
        this.rewardBtn.addClickListener(this.onClickReward, this);
    }

	public updateAll(data:any): void {
		this.parent.setChildIndex(this,0);
		this.lastEntityInfo = this.entityInfo;
		this.entityInfo = data;
		if(!this.entityInfo || Number(this.entityInfo.life_L64) <= 0) {
			this.hide();
			return;
		}
		let isCheckPoint:boolean = CacheManager.copy.isInCopyByType(ECopyType.ECopyCheckPoint);
		this.onBossLifeBarVisibleChange();
		
		if(this.isShow){			
			if(this.barStyleTotal==0){
				this.calBarCount();
			}			
			this.isChangeBoss = !this.entityInfo || !this.lastEntityInfo || 
			(this.entityInfo && this.lastEntityInfo && this.entityInfo.code_I != this.lastEntityInfo.code_I);
			if (this.isChangeBoss) {
				this.updateBossInf();
			}
			this.updateLifeBars();
			this.updateInvincible();
			this.updateLifeShield();
			this.updateCopyView();
		}

		if(CacheManager.copy.isInCopy) {
			if(CacheManager.copy.isInCopyByType(ECopyType.ECopyMgNewGuildWar) || isCheckPoint) {
				this.hpGroup.y = 150;
			}
			else {
				this.hpGroup.y = 0;
			}
		}
		else {
			this.hpGroup.y = 100;
		}
	}

	public onShow(data?:any): void {
		super.onShow(data);
	}

	public get entityId():any {
		if(!this.entityInfo) return null;
		return this.entityInfo.entityId;
	}
	public updateLifeShield():void{
		//更新生命护盾
		if(!this.buffBar) {
			return;
		}
		if(CacheManager.copy.isInCopyByType(ECopyType.ECopyMgSecretBoss)){
			let maxLifeShield_I:number = this.entityInfo.maxLifeShield_I?this.entityInfo.maxLifeShield_I:0;
			let lifeShield:number = this.entityInfo.lifeShield?this.entityInfo.lifeShield:0;
			this.buffBar.visible = maxLifeShield_I > 0 && lifeShield > 0 && lifeShield < maxLifeShield_I;
			if(this.buffBar.visible){
				this.buffBar.setValue(maxLifeShield_I-lifeShield,maxLifeShield_I);
				// this.loaderBg.load(URLManager.getPackResUrl(PackNameEnum.SceneBossInfo,"boss_bg2"));
			}		
		// else {
		// 	this.loaderBg.load(URLManager.getPackResUrl(PackNameEnum.SceneBossInfo,"boss_bg1"));
		// }	
		}
		this.showBuffTip();
	}
	public updateInvincible():void {
		if(!this.buffBar || CacheManager.copy.isInCopyByType(ECopyType.ECopyMgSecretBoss)) { //秘境boss的进度条是另外的逻辑
			return;
		}
		if(this.leftTime > 0) {
			//buff更新的时候，已经添加了buff进度，避免重复计算，导致buff进度显示存在时间误差
			//如果buff持续时间就是会动态变，这里需要删除这个处理
			return;
		}
		let buffs:number[] = this.entityInfo.buffers.data_I;
		for(let i:number = 0; i < buffs.length; i++) {
			let buffCfg:any = ConfigManager.state.getByPk(buffs[i]);
			if(buffCfg && (buffCfg.type == EStateType.EStateInvincible || buffCfg.type == EStateType.EStateLifeShield)) {
				let startTime:number = Number(this.entityInfo.buffersBeginDt.data_I[i]);
				let endTime:number = Number(this.entityInfo.buffersEndDt.data_I[i]);
				this.leftTime = endTime - CacheManager.serverTime.getServerTime();
				this.totalTime = endTime - startTime;
				if(this.leftTime < 0) {
					this.removeBuffTimer();
				}
				else if(!this.buffBar.visible) {
					if(!App.TimerManager.isExists(this.buffTimerUpdate,this)) {
						this.buffBar.setValue(this.leftTime,this.totalTime);
						this.buffBar.visible = true;
						// this.loaderBg.load(URLManager.getPackResUrl(PackNameEnum.SceneBossInfo,"boss_bg2"));
						this.curTime = egret.getTimer();
						App.TimerManager.doTimer(1000,0,this.buffTimerUpdate,this);
					}
				}
				break;
			}
		}
		if(this.leftTime == -1 && this.buffBar.visible) {
			this.buffBar.visible = false;
			// this.loaderBg.load(URLManager.getPackResUrl(PackNameEnum.SceneBossInfo,"boss_bg1"));
			this.buffBar.setValue(1,1);
		}
		this.showBuffTip();
		// console.log("触发无敌盾",Number(this.entityInfo.life_L64),Number(this.entityInfo.maxLife_L64));
		
	}

	/**移除无敌buff显示 */
	public removeInvincible():void {
		if(this.buffBar) {
			this.buffBar.visible = false;
			this.buffBar.setValue(1,1);
		}
	}
	private showBuffTip():void{
		if(!this.isShowBuffTip && this.buffBar.visible){			
			this.isShowBuffTip = true;
			EventManager.dispatch(LocalEventEnum.ShowBroadTopTip,LangCopyHall.L24);
		}
		
	}
	private buffTimerUpdate():void {
		let time:number = egret.getTimer();
		this.leftTime -= Math.round((time - this.curTime)/1000);
		this.curTime = time;
		if(this.leftTime < 0) {
			this.removeBuffTimer();
			return;
		}
		this.buffBar.setValue(this.leftTime,this.totalTime);
	}

	private removeBuffTimer():void {
		App.TimerManager.remove(this.buffTimerUpdate,this);
		this.buffBar.visible = false;
		// this.loaderBg.load(URLManager.getPackResUrl(PackNameEnum.SceneBossInfo,"boss_bg1"));
		this.buffBar.setValue(1,1);
		this.leftTime = -1;
	}

	private updateBossInf(): void {
		this._bossConfig = ConfigManager.boss.getByPk(this.entityInfo.code_I);
		if(App.GlobalData.IsDebug) {
			this.txt_bossname.text = this._bossConfig.name + "code:" +  this._bossConfig.code;
		}
		else {
			this.txt_bossname.text = this._bossConfig.name;
		}
		this.txt_bosslevel.text = ConfigManager.boss.getBossLevelStr(this._bossConfig);
		if(this._bossConfig.showLevel) {
			this.txt_bosslevel.text = "  " + this.txt_bosslevel.text;
		}
		this.loader_bosshead.load(URLManager.getIconUrl(this._bossConfig.avatarId,URLManager.AVATAR_ICON));
		this.getBarStyle();
	}

	private getBarStyle():void{
		this.clearBars();
		var nameFix: string = RpgBossInfView.NAME_FIX;		
		var barImg: fairygui.GImage;
		var barImgBg: fairygui.GImage;
		this.barTotal = this._bossConfig.bloodNum;
		var idx: number = this.barTotal;
		while (idx>0) {			
			var styId:number = idx%this.barStyleTotal;
			styId==0?styId = this.barStyleTotal:null; 
			barImg = fairygui.UIPackage.createObject(PackNameEnum.SceneBossInfo,nameFix+styId).asImage;						
			barImgBg = fairygui.UIPackage.createObject(PackNameEnum.SceneBossInfo,nameFix+styId+"_bg").asImage;			
			this.pushBar(barImgBg);		
			this.pushBar(barImg);			
			if (!this.maskRect) {
				var gap:number = 4;
				this.maskRect = new egret.Rectangle(-gap/2, -gap/2, barImg.width + gap, barImg.height + gap);
				this.maskRectBg = new egret.Rectangle(-gap/2, -gap/2, barImgBg.width + gap, barImgBg.height + gap);
			}
			idx--;			
		}		
		this.lifBarImgs = this.lifBarImgs.reverse();		
		this.view.setChildIndex(this.txt_bosshealth,this.view.numChildren-1);		
	}
	private pushBar(barImg: fairygui.GImage):void{		
		barImg.setPivot(0,0);
		barImg.x = 0; //202
		barImg.y = 0; //123
		barImg.setSize(RpgBossInfView.BAR_W,RpgBossInfView.BAR_H);
		//this.view.addChild(barImg);
		this.barContainer.addChild(barImg);
		this.lifBarImgs.push(barImg);
	}
	public updateLifeBars(): void {
		let _maxLife: number = Number(this.entityInfo.maxLife_L64);
		this.lifeAvgMax = Math.floor(_maxLife / this.barTotal);
		let _curLife: number = Number(this.entityInfo.life_L64); //剩余血量
		let dieLife: number = _maxLife - _curLife;
		var curIdx: number = this.barTotal - Math.floor(_curLife / this.lifeAvgMax) - 1;
		curIdx = Math.max(curIdx, 0);
		this.setBarVisible(curIdx);		
		this.setPercent(dieLife,_maxLife);
	}
	
	private setBarVisible(curIdx:number):void{
		var len: number = this.lifBarImgs.length;	
		if (this.curBarIdx != curIdx || !this.curLifeBar || this.isChangeBoss) { //层数改变			
			this.curBarIdx = curIdx;			
			var tempIdx:number = curIdx*2;
			for (var i: number = 0; i < len; i++) {
				this.lifBarImgs[i].visible =  i>=tempIdx;
				this.lifBarImgs[i].displayObject.mask = null;
			}			
			this.curLifeBar = this.lifBarImgs[tempIdx];
			this.curLifeBarBg = this.lifBarImgs[tempIdx+1];
			this.curLifeBar.visible = true;
			this.curLifeBarBg.visible = true;
		}
		let lftBar:number = this.barTotal - this.curBarIdx;		
		let txt:string = "X"+lftBar;
		// console.log("BOSS血量数据更新 -BOSS血条视图：",lftBar,Number(this.entityInfo.life_L64),Number(this.entityInfo.maxLife_L64));
		if(CopyUtils.isPerBossCopy()){
			this.txt_bosshealth.align = fairygui.AlignType.Center;		
			let percent:number = Math.floor(lftBar/this.barTotal*100);	
			txt = percent+"%";
		}else{
			this.txt_bosshealth.align = fairygui.AlignType.Right;			
		}
		this.txt_bosshealth.text = txt;
	}

	private setPercent(dieLife:number,maxLife:number):void{
		var len: number = this.barTotal;
		let curBarLife: number = 0;
		var curMaxLife: number = this.lifeAvgMax;
		if (this.curBarIdx == len - 1) {
			curMaxLife += maxLife % this.barTotal;
		}	
		curBarLife = dieLife - this.curBarIdx * this.lifeAvgMax;
		var p:number = 1 - curBarLife / curMaxLife;
		var maskW: number = Math.floor(p * this.curLifeBar.width);
		this.maskRect.width = maskW;
		this.curLifeBar.displayObject.mask = this.maskRect;
		this.curLifeBarBg.displayObject.mask = this.maskRectBg;
		if(this.maskRectBg){
			egret.Tween.removeTweens(this.maskRectBg);
		}		
		var t:egret.Tween = egret.Tween.get(this.maskRectBg,{onChange:()=>{
			this.curLifeBarBg.displayObject.mask = this.maskRectBg;
		},onChangeObj:this});
		t.to({width:maskW},300);
		
	}
	private clearBars():void{
		while(this.lifBarImgs.length){
			var img:fairygui.GImage = this.lifBarImgs.splice(0,1)[0];
			if(img.parent){
				img.parent.removeChild(img);
			}
		}
	}

	private updateCopyView():void {
		if(!CacheManager.copy.isInCopy) return;
		this.copyView = <BaseCopyPanel>ControllerManager.copy.getView();
		if (this.copyView && this.copyView.isShow) {
			this.setRewardBtnShow(this.copyView.isShowBossReward);
		}
	}

	private onClickReward():void {

		if(CacheManager.copy.isInCopyByType(ECopyType.ECopyMgCrossGuildBossIntruder)){ //神兽入侵
			let bossCode:number = CacheManager.crossBoss.curCrossGuildBoss; //获得当前进入的bossCode
			if(bossCode){
				let arg:any = {type:CrossBossGuildRewardWin.TYPE_REWARD,from:CrossBossGuildRewardWin.FROM_SCENE,codeOrInfo:bossCode};
            	EventManager.dispatch(LocalEventEnum.CrossBossGuildRewardWin,arg);
			}			
			return;
		}
        if (this.copyView && this.copyView.isShow) {
            this.copyView.onOpenRewardHandler();
        }

    }

    public setRewardBtnShow(value):void {
		this.c1.selectedIndex = value ? 1 : 0;
	}

	public hide(): void {
		super.hide();
		this.isReset = true;
		this.curLifeBar = null;
		this.curBarIdx = -1;
		this.curImgIdx = 0;
		this.entityInfo = null;
		this.lastEntityInfo = null;
		this.loader_bosshead.clear();
		this.clearBars();
		if(this.maskRect){
			egret.Tween.removeTweens(this.maskRect);
		}		
		this.removeBuffTimer();
		this.isShowBuffTip = false;
		this.setRewardBtnShow(false);
	}

}