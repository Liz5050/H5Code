class PlayerRankView extends BaseView{
    private list_rank:List;

	public constructor(view:fairygui.GComponent) {
		super(view);
	}
	public initOptUI():void{
        this.list_rank = new List(this.getGObject("list_rank").asList);
	}
	public updateAll(data?:any):void {
		let ranks:any[] = CacheManager.guildBattle.playerRanks;
		if(ranks) {
			this.list_rank.setVirtual(ranks);
			if(ranks.length > 0) {
				this.list_rank.scrollToView(0);
			}
		}
	}
}