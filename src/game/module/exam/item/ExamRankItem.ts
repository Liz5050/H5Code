class ExamRankItem extends ListRenderer {
	private nameTxt: fairygui.GRichTextField;
	private scoresTxt: fairygui.GRichTextField;

	public constructor() {
		super();
	}

	public constructFromXML(xml: any): void {
		super.constructFromXML(xml);
		this.nameTxt = this.getChild("txt_name").asRichTextField;
		this.scoresTxt = this.getChild("txt_scores").asRichTextField;
	}

	public setData(data: any, index: number): void {
		let color: string;
		if(index == 0){
			color = Color.Color_5;
		}else if(index == 1){
			color = Color.Color_2;
		}else{
			color = Color.Color_8;
		}
		this.nameTxt.text = `<font color = ${color}>${data.name_S}</font>`;
		this.scoresTxt.text = `<font color = ${color}>${data.score_I}</font>`;
	}
}