class GuildRankItemView extends ListRenderer {
    private txt_rank:fairygui.GTextField;
    private txt_guildName:fairygui.GTextField;
    private txt_playerName:fairygui.GTextField;
    private txt_score:fairygui.GTextField;
	public constructor() {
		super();
		
	}
    
	protected constructFromXML(xml:any):void{			
		super.constructFromXML(xml);
        this.txt_rank = this.getChild("txt_rank").asTextField;
        this.txt_guildName = this.getChild("txt_guildName").asTextField;
        this.txt_playerName = this.getChild("txt_playerName").asTextField;
        this.txt_score = this.getChild("txt_score").asTextField;
	}

	public setData(data:any,index:number):void{		
		this._data = data;
		this.itemIndex = index;
		this.txt_rank.text = "" + data.rank_I;
		this.txt_guildName.text = data.guildName_S;
		this.txt_playerName.text = data.name_S;
		this.txt_score.text = "" + data.score_I;
	}
}