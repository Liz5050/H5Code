class MapProposePanel extends fairygui.GComponent {
	private levelTxt: fairygui.GTextField;
	private defenseTxt: fairygui.GTextField;
	private descTxt: fairygui.GRichTextField;
	private propose: any;

	public constructor() {
		super();
	}

	public constructFromXML(xml: any): void {
		super.constructFromXML(xml);
		this.levelTxt = this.getChild("txt_level").asTextField;
		this.defenseTxt = this.getChild("txt_defense").asTextField;
		this.descTxt = this.getChild("txt_desc").asRichTextField;

		this.getChild("btn_go").addClickListener(this.goto, this);
	}

	public update(data: any): void {
		this.propose = data;
		if (data) {
			let proposeDefense:number = 0;
			let proposeLevel:number = 0;
			if(data.proposeDefense != null){
				proposeDefense = data.proposeDefense;
			}
			if(data.proposeLevel != null){
				proposeLevel = data.proposeLevel;
			}
			this.levelTxt.text = `推荐最低等级：${proposeLevel}`;
			this.defenseTxt.text = `推荐防御力：${proposeDefense}`;
			let roleDefense: number = (Number(CacheManager.role.fightAttr.physicalDefense_I) + Number(CacheManager.role.fightAttr.magicDefense_I));
			if(roleDefense >= proposeDefense){
				this.defenseTxt.color = 0x01AB24;
			}else{
				this.defenseTxt.color = 0xdf140f;
			}
			this.descTxt.text = data.desc;
		} else {
			this.levelTxt.text = "";
			this.defenseTxt.text = "";
			this.descTxt.text = "";
		}
	}

	private goto(e: any): void {
		EventManager.dispatch(LocalEventEnum.WorldMapGotoPropose, this.propose);
	}
}