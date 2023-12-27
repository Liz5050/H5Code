class GuildTeamCopyRankWindow extends BaseWindow {
	private list_rank:List;
	private txt_myGuildRank:fairygui.GRichTextField;
	private txt_score:fairygui.GTextField;
	public constructor() {
		super(PackNameEnum.GuildCopy,"GuildTeamCopyRankWindow");
	}

	public initOptUI():void {
		this.list_rank = new List(this.getGObject("list_rank").asList);
		this.txt_myGuildRank = this.getGObject("txt_myGuildRank").asRichTextField;
		this.txt_score = this.getGObject("txt_score").asTextField;
	}

	public updateAll():void {
		ProxyManager.team2.getGuildTeamRankInfo();
		this.updateRankInfo();
	}

	public updateRankInfo():void {
		let rankInfos:any[] = CacheManager.guildCopy.rankInfos;
		this.list_rank.data = rankInfos;
		let myGuildRank:number = CacheManager.guildCopy.myGuildRank;
		if(!myGuildRank) {
			this.txt_myGuildRank.text = "我的仙盟排名：" + HtmlUtil.html("未上榜",Color.Color_4);
			this.txt_score.text = "";
		}
		else {
			this.txt_myGuildRank.text = "我的仙盟排名：" + HtmlUtil.html("" + myGuildRank,Color.Color_6);
			this.txt_score.text = rankInfos[myGuildRank - 1].score_I;
		}
	}
}