class WindowGuildBattleResult extends BaseWindow {
	private loaderBg:GLoader;
    private loader_title:GLoader;
    private txt_ownerGuild:fairygui.GRichTextField;
    private txt_myScore:fairygui.GRichTextField;
    private txt_myRank:fairygui.GRichTextField;
    private txt_guildScore:fairygui.GRichTextField;
    private txt_guildRank:fairygui.GRichTextField;
    private list_socreReward:List;
    private list_guildReward:List;
	public constructor() {
		super(PackNameEnum.CopyResult,"WindowGuildBattleResult");
		this.isShowCloseObj = true;
	}

	public initOptUI():void {
		this.loaderBg = <GLoader>this.frame.getChild("loader_result_Bg");
		this.loaderBg.load(URLManager.getModuleImgUrl("copy_result_win.png",PackNameEnum.Copy));
        this.loader_title = <GLoader>this.getGObject("loader_title");
		this.loader_title.load(URLManager.getModuleImgUrl("winTitle.png",PackNameEnum.GuildBattle));
        this.txt_ownerGuild = this.getGObject("txt_ownerGuild").asRichTextField;
        this.txt_myScore = this.getGObject("txt_myScore").asRichTextField;
        this.txt_myRank = this.getGObject("txt_myRank").asRichTextField;
        this.txt_guildScore = this.getGObject("txt_guildScore").asRichTextField;
        this.txt_guildRank = this.getGObject("txt_guildRank").asRichTextField;
        this.list_socreReward = new List(this.getGObject("list_socreReward").asList);
        this.list_guildReward = new List(this.getGObject("list_guildReward").asList);
	}

	public updateAll(data?:any):void{
		this.txt_ownerGuild.text = "占领仙盟：" + HtmlUtil.html(data.winGuildName_S,Color.Color_2);
		this.txt_myScore.text = "个人积分：" + HtmlUtil.html(data.score_I + "",Color.BASIC_COLOR_9);
		this.txt_myRank.text = "个人排名：" + (data.rank_I <= 0 ? "未上榜" : HtmlUtil.html("第" + data.rank_I + "名",Color.BASIC_COLOR_9));
		this.txt_guildScore.text = "仙盟积分：" + HtmlUtil.html(data.guildScore_I + "",Color.BASIC_COLOR_9);
		this.txt_guildRank.text = "仙盟排名：" + (data.guildRank_I <= 0 ? "未上榜" : HtmlUtil.html("第" + data.guildRank_I + "名",Color.BASIC_COLOR_9));
		this.list_socreReward.data = ConfigManager.guildBattle.getHadGetScoreRewardCfgs();
		let rankReward:any = ConfigManager.guildBattle.getRankRewardCfg(data.guildRank_I,EMgNewGuildWarRank.EMgNewGuildWarRankGuild);
		if(rankReward) {
			let items:ItemData[] = [];
			let rewardStr:string[] = rankReward.rewardStr.split("#");
			for(let i:number = 0; i < rewardStr.length; i++) {
				if(rewardStr[i] == "") continue;
				items.push(RewardUtil.getReward(rewardStr[i]));
			}
			this.list_guildReward.data = items;
		}
	}
}