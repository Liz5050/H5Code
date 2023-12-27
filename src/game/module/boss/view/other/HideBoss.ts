/**
 * 隐藏boss按钮
 * @author zhh
 * @time 2018-11-27 15:43:06
 */
class HideBoss extends BaseContentView {
    private loaderIco:GLoader;
    private txtTime:fairygui.GTextField;
	private btnBoss:fairygui.GButton;
	private handler:number = 0;
	private cnt:fairygui.GComponent;
	private curBoss:any;	
	//private bossList:any[];
	private mc:UIMovieClip;

	public constructor() {
		super(PackNameEnum.HideBoss,"HideBoss");		
	}
	public initOptUI():void{
        //---- script make start ----
        this.cnt = this.getGObject("cnt").asCom;
        this.txtTime = this.getGObject("txt_time").asTextField;		
		this.btnBoss = this.getGObject("btn_boss").asButton;
		this.loaderIco = <GLoader>this.btnBoss.getChild("loader_ico");
        
		//---- script make end ----
		this.btnBoss.addClickListener(this.onClickBtn,this);
		
		//设置为满屏
		if (this.view) {
			this.view.setSize(fairygui.GRoot.inst.width, fairygui.GRoot.inst.height);
			this.view.addRelation(fairygui.GRoot.inst, fairygui.RelationType.Size);
		}
	}

	public updateAll(data?:any):void{
		this.clearTimer();
		this.handler = egret.setInterval(this.onTimer,this,1000);
		this.onTimer();
		this.updateBossInfo();
		this.showMc(true);
		
	}
	private showMc(isShow:boolean):void{
		if(isShow){
			if(!this.mc){
				this.mc = UIMovieManager.get(PackNameEnum.MCHideBoss);
				this.cnt.addChild(this.mc);
			}
			this.mc.frame = 0;
			this.mc.playing = true;
		}else if(this.mc){
			this.mc.destroy();
			this.mc = null;
		}
		
	}
	private clearTimer():void{
		if(this.handler>0){
			egret.clearInterval(this.handler);
			this.handler = 0;
		} 
	}

	private onTimer():void{
		let sec:number = CacheManager.bossNew.hideBossDt - CacheManager.serverTime.getServerTime();
		this.txtTime.text = App.DateUtils.formatSeconds(sec,DateUtils.FORMAT_SECONDS_3);
		if(sec<=0){
			this.hide();
		}
	}

	private onClickBtn():void{
		if(CacheManager.copy.isInCopy){
			Tip.showRollTip(LangBoss.L24);
			return;
		}
		if(this.curBoss){
			EventManager.dispatch(LocalEventEnum.BossHideBossInfoWin,this.curBoss);			
		}		
	}

	public updateBossInfo():void{
		/*
		this.bossList = ConfigManager.mgGameBoss.getByCopyType(ECopyType.ECopyMgHideBoss);
		App.ArrayUtils.sortOn(this.bossList,"roleState",true);
		for(let i:number=0;i<this.bossList.length;i++){
			let info:any = this.bossList[i];
			if(CacheManager.bossNew.getBossIsOpened(info.bossCode)){
				this.curBoss = info;
				break;
			}
		}
		*/
		this.curBoss = ConfigManager.mgGameBoss.getByCopyCode(CacheManager.bossNew.hideBossCopyCode)[0];
		if(this.curBoss){
			let bossConfig:any = ConfigManager.boss.getByPk(this.curBoss.bossCode);
			let url:string = URLManager.getIconUrl(bossConfig.avatarId + "",URLManager.AVATAR_ICON);
			this.loaderIco.load(url);
		}
		
	}

	public hide(param: any = null, callBack: CallBack = null):void{
		super.hide(param,callBack);
		this.clearTimer();
		this.curBoss=null;
		this.showMc(false);
	}

}