class CampBattleRankItem extends ListRenderer {
	private c1:fairygui.Controller;
	private txt_rank:fairygui.GTextField;
	private txt_name:fairygui.GTextField;
	private txt_guild:fairygui.GTextField;
	private txt_score:fairygui.GTextField;
	public constructor() {
		super();
	}

	protected constructFromXML(xml: any): void {
		super.constructFromXML(xml);
		this.c1 = this.getController("c1");
		this.txt_rank = this.getChild("txt_rank").asTextField;
		this.txt_name = this.getChild("txt_name").asTextField;
		this.txt_guild = this.getChild("txt_guild").asTextField;
		this.txt_score = this.getChild("txt_score").asTextField;
	}

	public setData(data:any):void {
		this._data = data;
		this.txt_rank.text = "" + data.rank;
		this.c1.selectedIndex = data.rank > 3 ? 0 : data.rank;
		this.txt_name.text = ChatUtils.getPlayerName(data);
		this.txt_guild.text = data.guildName_S;
		this.txt_score.text = data.score_I + "";
	}
}