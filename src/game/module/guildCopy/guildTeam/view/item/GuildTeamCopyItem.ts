class GuildTeamCopyItem extends ListRenderer {
	private loader_modeTxt:GLoader;
	private loader_head:GLoader;
	private txt_fight:fairygui.GTextField;
	private list_item:List;
	public constructor() {
		super();
	}

	protected constructFromXML(xml:any):void{			
		super.constructFromXML(xml);
		this.loader_modeTxt = this.getChild("loader_modeTxt") as GLoader;
		this.loader_head = this.getChild("loader_head") as GLoader;
		this.txt_fight = this.getChild("txt_fight").asTextField;
		this.list_item = new List(this.getChild("list_item").asList);
	}

	public setData(data:any):void {
		this._data = data;
		let mode:number = Math.ceil(data.code / 10000);
		this.loader_modeTxt.load(URLManager.getPackResUrl(PackNameEnum.GuildCopy,"mode_" + mode));
		this.list_item.data = RewardUtil.getStandeRewards(data.reward);
		let myFight:number = CacheManager.role.combatCapabilities;
		let safeFight:number = data.warfare > 0 ? data.warfare : 0;
		if(myFight >= safeFight) {
			this.txt_fight.color = Color.Green2;
		}
		else {
			this.txt_fight.color = Color.Red2;
		}
		this.txt_fight.text = "推荐战力：" + App.MathUtils.formatNum(safeFight);

		let strategyInf:any[] = ConfigManager.copyLegend.getCopyBossList(data.code);
        if (strategyInf && strategyInf.length) {
            let bossInf:any = ConfigManager.boss.getByPk(strategyInf[strategyInf.length - 1].bossCode);
            if (bossInf) {
                let modelId:string = ConfigManager.boss.getAvatarId(bossInf.code);
                this.loader_head.load(URLManager.getIconUrl(modelId, URLManager.AVATAR_ICON));
            }
        }
	}
}