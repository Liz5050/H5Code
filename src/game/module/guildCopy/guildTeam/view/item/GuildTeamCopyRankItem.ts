class GuildTeamCopyRankItem extends ListRenderer {
	private c1:fairygui.Controller;
	private txt_rank:fairygui.GTextField;
	private txt_guildName:fairygui.GTextField;
	private txt_score:fairygui.GTextField;
	public constructor() {
		super();
	}

	protected constructFromXML(xml:any):void{			
		super.constructFromXML(xml);
		this.c1 = this.getController("c1");
		this.txt_rank = this.getChild("txt_rank").asTextField;
		this.txt_guildName = this.getChild("txt_guildName").asTextField;
		this.txt_score = this.getChild("txt_score").asTextField;
	}

	public setData(data:any,index:number):void {
		this._data = data;
		let rank:number = index + 1;
		if(rank <= 3) {
			this.c1.selectedIndex = rank;
		}
		else {
			this.c1.selectedIndex = 0;
		}
		this.txt_rank.text = rank + "";
		this.txt_guildName.text = data.guildName_S;
		this.txt_score.text = "" + data.score_I;
	}
}