class GuildRankView extends BaseView{
	private loader_bg:GLoader;
    private txt_ownerGuild:fairygui.GTextField;
    private list_rank:List;

	public constructor(view:fairygui.GComponent) {
		super(view);
	}
	
	public initOptUI():void{
		this.loader_bg = this.getGObject("loader_bg") as GLoader;
		this.loader_bg.load(URLManager.getModuleImgUrl("rankBg.jpg",PackNameEnum.GuildBattle));
        this.txt_ownerGuild = this.getGObject("txt_ownerGuild").asTextField;
        this.list_rank = new List(this.getGObject("list_rank").asList);
	}

	public updateAll(data?:any):void{
		let ranks:any[] = CacheManager.guildBattle.guildRanks;
		this.list_rank.data = ranks;
		if(ranks && ranks.length > 0) {
			this.list_rank.scrollToView(0);
		}
		let winerInfo:any = CacheManager.guildBattle.winerInfo;
		if(winerInfo) {
			this.txt_ownerGuild.text = winerInfo.winGuildName_S;
		}
		else {
			this.txt_ownerGuild.text = "虚位以待";
		}
	}
}