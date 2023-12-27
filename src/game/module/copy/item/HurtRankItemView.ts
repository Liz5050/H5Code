class HurtRankItemView extends ListRenderer {
	private txt_name:fairygui.GTextField;
	private txt_score:fairygui.GTextField;
	public constructor() {
		super();
	}

	protected constructFromXML(xml: any): void {
		super.constructFromXML(xml);
		this.txt_name = this.getChild("txt_name").asTextField;
		this.txt_score = this.getChild("txt_score").asTextField;
	}

	public setData(data:any):void {
		this.txt_name.text = data.name_S + "："; 
		this.txt_score.text = App.MathUtils.formatNum64(Number(data.hurt_L64),false);
	}
}