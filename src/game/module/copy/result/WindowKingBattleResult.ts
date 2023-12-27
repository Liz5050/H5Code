class WindowKingBattleResult extends BaseWindow {
	private topBg:GLoader;
	private effectBg1:GLoader;
	private effectBg2:GLoader;
	private bgLoader:GLoader;
	private stageIcon:KingBattleStageIconView;
	private itemList:List;
	private starsImg:fairygui.GImage[];
	private startNullImgs:fairygui.GImage[];
	private mcStar:UIMovieClip;
	private timeTxt:fairygui.GRichTextField;
	private mcUpgrade:UIMovieClip;
	private startTxt:fairygui.GTextField;

	private leftTime:number = 0;
	private curTime:number;

	private timeOutIdx:number = -1;
	private timeOutIdx2:number = -1;
	private curInfo:any;
	private curLvCfg:any;
	private isWin:boolean;
	private c1:fairygui.Controller;

	public constructor() {
		super(PackNameEnum.CopyResult,"WindowKingBattleResult");
	}

	public initOptUI():void {
		this.topBg = <GLoader>this.getGObject("topBg");
		this.bgLoader = this.frame.getChild("loader_result_Bg") as GLoader;
		this.c1 = this.frame.getController("c1");
		this.itemList = new List(this.getGObject("itemList").asList);
		this.effectBg1 = <GLoader>this.getGObject("effectBg_1");
		this.effectBg2 = <GLoader>this.getGObject("effectBg_2");
		this.stageIcon = new KingBattleStageIconView(this.getGObject("stageIcon").asCom);
		this.starsImg = [];
		this.startNullImgs = [];
		for(let i:number = 1; i < 6; i++) {
			let img:fairygui.GImage = this.getGObject("star_" + i).asImage;
			this.starsImg.push(img);
			img.visible = false;

			img = this.getGObject("star_null_" + i).asImage;
			img.visible = false;
			this.startNullImgs.push(img);
		}
		this.closeObj.visible = true;

		// this.mcStar = this.getGObject("mc_star").asMovieClip;
		this.mcStar = UIMovieManager.get(PackNameEnum.MCStar);
		this.addChild(this.mcStar);
		this.mcStar.visible = false;
		this.mcStar.playing = false;

		this.mcUpgrade = UIMovieManager.get(PackNameEnum.MCKingBattleUpgrade);
		this.addChild(this.mcUpgrade);
		this.mcUpgrade.setDouble();
		this.mcUpgrade.x = 80;
		this.mcUpgrade.y = 130;
		this.mcUpgrade.visible = false;
		this.mcUpgrade.playing = false;

		this.timeTxt = this.getGObject("timeTxt").asRichTextField;
		this.startTxt = this.getGObject("n6").asTextField;

		this.topBg.load(URLManager.getModuleImgUrl("kingBattleResultBg.png",PackNameEnum.Copy));
		this.effectBg1.load(URLManager.getModuleImgUrl("KingBattleResultEffect.png",PackNameEnum.Copy));
		this.effectBg2.load(URLManager.getModuleImgUrl("KingBattleResultEffect.png",PackNameEnum.Copy));
	}

	public updateAll(data?:any):void {
		this.isWin = data.success_B;
		if(data.success_B) {
			this.bgLoader.load(URLManager.getModuleImgUrl("copy_result_win.png",PackNameEnum.Copy));
			this.topBg.grayed = false;
			this.c1.setSelectedIndex(0);
		}
		else {
			this.bgLoader.load(URLManager.getModuleImgUrl("copy_result_fail.png",PackNameEnum.Copy));
			this.topBg.grayed = true;
			this.c1.setSelectedIndex(1);
		}
		let items:ItemData[] = [];
		let rewards:any[] = data.rewards.data;
		for(let i:number = 0; i < rewards.length; i++) {
			let str:string = rewards[i].type_I + "," + rewards[i].code_I + "," + Number(rewards[i].num_L64);
			let item:ItemData = RewardUtil.getReward(str);
			items.push(item);
		}
		this.itemList.data = items;
		this.updateKingBattle();

		if(this.leftTime == 0) {
			this.curTime = egret.getTimer();
            let copyCfg:any = ConfigManager.copy.getByPk(CopyEnum.CopyKingBattle);
			this.leftTime = CopyUtils.getCopyResultSec(copyCfg, this.isWin);
			this.timeTxt.text = "(" + HtmlUtil.html(this.leftTime + "秒",Color.Green) + "后自动关闭)";
			App.TimerManager.doTimer(1000,0,this.onTimerHandler,this);
		}

		this.effectBg1.rotation = -180;
		this.effectBg2.rotation = 180;
		egret.Tween.get(this.effectBg1,{loop:true}).to({rotation:180},4000);
		egret.Tween.get(this.effectBg2,{loop:true}).to({rotation:-180},5000);
	}

	private onTimerHandler():void {
		let time:number = egret.getTimer();
		this.leftTime -= Math.round((time - this.curTime)/1000);
		this.curTime = time;
		if(this.leftTime <= 0) {
			this.hide();
			return;
		}
		this.timeTxt.text = "(" + HtmlUtil.html(this.leftTime + "秒",Color.Green) + "后自动关闭)";
	}

	private removeTimer():void {
		this.leftTime = 0;
		App.TimerManager.remove(this.onTimerHandler,this);
	}

	public updateKingBattle():void {
		let changeStar:number = CacheManager.arena.changeStar;
		this.curInfo = CacheManager.arena.selfBattleInfo;
		this.curLvCfg = ConfigManager.mgKingStife.getByPk(this.curInfo.level_I);
		this.startTxt.visible = this.curLvCfg.level < 106;
		for(let i:number = 0; i < this.starsImg.length; i++) {
			let showState:boolean = this.curLvCfg.star > 0 && (this.curLvCfg.star - changeStar) > i && this.curLvCfg.stage < 5;
			this.starsImg[i].visible = showState;
			this.startNullImgs[i].visible = i < this.curLvCfg.tolStar && this.curLvCfg.stage < 5;
		}
		if(this.timeOutIdx != -1) {
			egret.clearTimeout(this.timeOutIdx);
			this.timeOutIdx = -1;
		}
		if(this.timeOutIdx2 != -1) {
			egret.clearTimeout(this.timeOutIdx2);
			this.timeOutIdx2 = -1;
		}
		if(changeStar > 0) {
			// this.stageIcon.load(URLManager.getModuleImgUrl("kingBattle/stageIcon_" + this.curLvCfg.stage + ".png",PackNameEnum.Arena));
			CacheManager.arena.changeStar = 0;
			this.stageIcon.setLevel(this.curInfo.level_I);
			this.timeOutIdx = egret.setTimeout(function (){
				this.timeOutIdx = -1;
				this.playStar(changeStar);
			},this,800);
		}
		else {
			if(this.isWin) {
				this.stageIcon.setLevel(CacheManager.arena.oldLevel);
				if(CacheManager.arena.isUpgradeLv) {
					this.timeOutIdx2 = egret.setTimeout(function (){
						this.timeOutIdx2 = -1;
						this.playUpgrade();
					},this,1000);
				}
			}
			else {
				//失败
				// this.stageIcon.load(URLManager.getModuleImgUrl("kingBattle/stageIcon_" + this.curLvCfg.stage + ".png",PackNameEnum.Arena));
				this.stageIcon.setLevel(this.curInfo.level_I);
			}
		}
	}

	private playUpgrade():void {
		this.mcUpgrade.setPlaySettings(0,-1,1,-1,function(){
			// this.stageIcon.load(URLManager.getModuleImgUrl("kingBattle/stageIcon_" + this.curLvCfg.stage + ".png",PackNameEnum.Arena));
			this.stageIcon.setLevel(this.curInfo.level_I);
			this.mcUpgrade.visible = false;
		},this);
		this.mcUpgrade.visible = true;
		this.mcUpgrade.playing = true;
	}

	private playStar(num:number):void {
		if(num <= 0) {
			return;
		}
		let curStar:fairygui.GImage;
		for(let i:number = 0; i < this.starsImg.length; i++) {
			if(!this.starsImg[i].visible) {
				curStar = this.starsImg[i];
				break;
			}
		}
		this.mcStar.x = curStar.x - 233;
		this.mcStar.y = curStar.y - 234;
		this.mcStar.visible = true;
		this.mcStar.setPlaySettings(0,-1,1,-1,function() {
			this.mcStar.visible = false;
			curStar.visible = true;
			num --;
			this.playStar(num);
		},this);
		this.mcStar.playing = true;
	}

	public hide():void {
		CacheManager.arena.changeStar = 0;
		if(this.timeOutIdx != -1) {
			egret.clearTimeout(this.timeOutIdx);
			this.timeOutIdx = -1;
		}
		if(this.timeOutIdx2 != -1) {
			egret.clearTimeout(this.timeOutIdx2);
			this.timeOutIdx2 = -1;
		}
		egret.Tween.removeTweens(this.effectBg1);
		egret.Tween.removeTweens(this.effectBg2);
		this.mcStar.playing = false;
		this.mcStar.visible = false;
		this.mcUpgrade.visible = false;
		this.mcUpgrade.playing = false;
		super.hide();
		this.removeTimer();
		if(App.Socket.isConnecting() && CacheManager.copy.isInCopyByType(ECopyType.ECopyMgKingStife)) {
			EventManager.dispatch(LocalEventEnum.CopyReqExit);
			if(!UIManager.isOpenView()) {
				HomeUtil.open(ModuleEnum.Arena, false, {tabType:PanelTabType.KingBattle});
			}
		}
	}
}