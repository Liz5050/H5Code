class ExpPositionRankItemMini extends ListRenderer {
	private c1:fairygui.Controller;
	private txt_playerName:fairygui.GTextField;
	private txt_exp:fairygui.GTextField;
	public constructor() {
		super();
	}

	protected constructFromXML(xml: any): void {
		super.constructFromXML(xml);
		this.c1 = this.getController("c1");
		this.txt_playerName = this.getChild("txt_playerName").asTextField;
		this.txt_exp = this.getChild("txt_exp").asTextField;
	}

	public setData(data:any,index:number):void {
		this._data = data;
		this.c1.selectedIndex = index;
		if(!data) {
			this.txt_playerName.text = LangArena.L41;
			this.txt_exp.text = "0";
		}
		else {
			this.txt_playerName.text = ChatUtils.getPlayerName(data);
			this.txt_exp.text = Number(data.exp_L64) + "";
		}
	}
}