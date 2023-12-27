class CrossStairRankItem extends ListRenderer {
	private c1:fairygui.Controller;
	private txt_rank:fairygui.GTextField;
	private txt_name:fairygui.GTextField;
	private txt_floor:fairygui.GTextField;
	private txt_vip:fairygui.GTextField;
	public constructor() {
		super();
	}

	protected constructFromXML(xml:any):void {			
		super.constructFromXML(xml);
		this.c1 = this.getController("c1");
		this.txt_rank = this.getChild("txt_rank").asTextField;
		this.txt_name = this.getChild("txt_name").asTextField;
		this.txt_floor = this.getChild("txt_floor").asTextField;
		this.txt_vip = this.getChild("txt_vip").asTextField;
	}

	public setData(data:any,index:number):void {
		this._data = data;
		let rank:number = index + 1;
		if(rank > 3) {
			this.c1.selectedIndex = 0;
		}
		else {
			this.c1.selectedIndex = rank;
		}
		this.txt_rank.text = rank + "";
		
		this.txt_name.text = ChatUtils.getPlayerName(data);
		if(data.floor_I >= 9) {
			this.txt_floor.text = LangArena.L51;
		}
		else {
			this.txt_floor.text = App.StringUtils.substitude(LangArena.L44,data.floor_I + 1);
		}
		// App.DateUtils.formatDate(data.toTopDt_DT,DateUtils.FORMAT_HH_MM_SS);
		this.txt_vip.text = data.vipLevel_I > 0 ? "V" : "";// + data.vipLevel_I
	}
}