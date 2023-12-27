class TipRollItem extends fairygui.GComponent {
	private static ITEM_LIST:TipRollItem[] = [];
	public static getItem():TipRollItem {
		return TipRollItem.ITEM_LIST.pop() || FuiUtil.createComponent(PackNameEnum.Common,"TipRollItem") as TipRollItem;//new TipRollItem();
	}

	private txtTips:fairygui.GRichTextField;
	private itemBg:fairygui.GImage;
	
	public firstFlyPosY:number;
	public lastFlyPosY:number;
	public constructor() {
		super();
		this.touchable = false;
	}

	protected constructFromXML(xml:any):void {			
		super.constructFromXML(xml);
		this.txtTips = this.getChild("txt_tips").asRichTextField;
		this.itemBg = this.getChild("img_item").asImage;
	}

	public setText(tips:string):void {
		this.txtTips.text = tips;
	}

	public resetItem():void {
		this.removeFromParent();
		this.txtTips.text = "";
		TipRollItem.ITEM_LIST.push(this);
	}
}