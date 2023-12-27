class ExamRankWinItem extends ListRenderer {
	private iconLoader: GLoader;
	private vipTxt: fairygui.GTextField;
	private nameTxt: fairygui.GTextField;
	private scoresTxt: fairygui.GTextField;
	private rankTxt: fairygui.GTextField;
	private rank: number;

	public constructor() {
		super();

	}
	protected constructFromXML(xml: any): void {
		super.constructFromXML(xml);
		this.iconLoader = <GLoader>this.getChild("loader_icon");
		this.vipTxt = this.getChild("txt_vip").asTextField;
		this.nameTxt = this.getChild("txt_name").asTextField;
		this.scoresTxt = this.getChild("txt_scores").asTextField;
		this.rankTxt = this.getChild("txt_rank").asTextField;


	}
	public setData(data: any, index: number): void {
		this._data = data;
		this.itemIndex = index;
		this.rank = index + 1;
		this.nameTxt.text = data.name_S;
		this.rankTxt.text = `${this.rank}`;
		this.scoresTxt.text = `${this._data.score_I}分`;
		this.vipTxt.visible = this._data.vip_I > 0;
		this.vipTxt.text = `V`; //${this._data.vip_I}

		let isTop: boolean = this.rank <= 3;
		if (isTop) {
			this.iconLoader.load(URLManager.getPackResUrl(PackNameEnum.Common, `rank${this.rank}`));
		} else {
			this.iconLoader.clear();
		}
		this.rankTxt.visible = !isTop;

	}
}