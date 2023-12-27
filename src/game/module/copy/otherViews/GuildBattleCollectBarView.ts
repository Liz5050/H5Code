class GuildBattleCollectBarView extends fairygui.GComponent {
	private txt_collecterName:fairygui.GTextField;
	private hpBar:UIProgressBar;
	private bar_buff:UIProgressBar;
	private loader_head:GLoader;

	private barInit:boolean = false;
	private collecting:boolean = false;

	private bossCfg:any;
	public constructor() {
		super();
	}

	protected constructFromXML(xml: any): void {
		super.constructFromXML(xml);
		let loaderPlayerHp:GLoader = this.getChild("loader_player") as GLoader;
		loaderPlayerHp.load(URLManager.getModuleImgUrl("boss_bg.png",PackNameEnum.SceneBossInfo));
		this.txt_collecterName = this.getChild("txt_collecterName").asTextField;
		this.txt_collecterName.text = "";
		this.hpBar = this.getChild("progressBar") as UIProgressBar;
		this.hpBar.labelType = BarLabelType.Percent;
		this.hpBar.labelSize = 20;

		this.bar_buff = this.getChild("bar_buff") as UIProgressBar;
		this.bar_buff.setStyle(URLManager.getPackResUrl(PackNameEnum.Common,"progressBar_3"),URLManager.getPackResUrl(PackNameEnum.Common,"bg_2"),0,0,4,6,UIProgressBarType.Mask);
		this.bar_buff.setValue(1,1);

		this.loader_head = this.getChild("loader_head") as GLoader;
	}

	private initBarAsset():void {
		if(CacheManager.guildBattle.position != EGuildBattlePosition.GuildBattle_2) return;
		if(!this.barInit) {
			//依赖FightPlayers资源，晚点初始化
			this.hpBar.setStyle(URLManager.getPackResUrl(PackNameEnum.FightPlayers,"bossBar_5"),"",0,0,0,0,UIProgressBarType.Mask);
			this.hpBar.setValue(1,1);
			this.barInit = true;
		}
	}

	public updateAll():void {
		this.visible = true;
		this.bossCfg = ConfigManager.guildBattle.getCollectBossCfg();
		if(this.bossCfg) {
			this.loader_head.load(URLManager.getIconUrl(this.bossCfg.avatarId,URLManager.AVATAR_ICON));
			// this.txt_level.text = "LV." + this.bossCfg.level;
			// this.txt_name.text = this.bossCfg.name;
		}
	}

	public updateCollectTime(data:any):void {
		this.txt_collecterName.text = data.name_S + "  采集中......";
		if(this.collecting) {
			return;
		}
		this.initBarAsset();	
		this.visible = true;
		if(this.bossCfg) {
			this.hpBar.removeEventListener(UIProgressBar.PROPGRESS_COMPLETE,this.onCompleteHandler,this);
			let duration: number = data.leftSec_I * 1000;
			let passTime:number = egret.getTimer() - data.updateTime;
			duration -= passTime;
			let max:number = this.bossCfg.maxMana * 1000;//bossCfg.maxMana
			this.hpBar.setValue(duration,max);

			this.hpBar.addEventListener(UIProgressBar.PROPGRESS_COMPLETE,this.onCompleteHandler,this);
			this.hpBar.setValue(0,max,true,true,duration);
			this.collecting = true;
		}
	}

	public updateShield(value:number,max:number):void {
		this.bar_buff.setValue(value,max);
	}

	/**终止采集 */
    public stopCollect():void {
		if(!this.collecting) {
			this.initBarAsset();
			return;
		}
		this.hpBar.removeEventListener(UIProgressBar.PROPGRESS_COMPLETE,this.onCompleteHandler,this);
		this.hpBar.setValue(1,1);
		this.bar_buff.setValue(1,1);
		this.collecting = false;
		this.txt_collecterName.text = "";
    }

	/**采集完成 */
    private onCompleteHandler(evt:egret.Event):void {
        this.hideCollect();
    } 

	/**隐藏采集 */
    public hideCollect():void {
		this.stopCollect();
		this.visible = false;
    }
}