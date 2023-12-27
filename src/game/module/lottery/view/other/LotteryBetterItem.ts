class LotteryBetterItem extends fairygui.GComponent {
	private c1:fairygui.Controller;
	private baseItem:BaseItem;
	private mc1:UIMovieClip;
	private mc2:UIMovieClip;
	public constructor() {
		super();
	}

	protected constructFromXML(xml:any):void {
		super.constructFromXML(xml);
		this.c1 = this.getController("c1");
		this.baseItem = this.getChild("baseItem") as BaseItem;
		this.mc1 = UIMovieManager.get(PackNameEnum.MCCheckPointTxt);
		this.mc1.x = -110;
        this.mc1.y = -124;
		this.addChild(this.mc1);
		this.mc1.playing = false;
		this.mc1.visible = false;

		this.mc2 = UIMovieManager.get(PackNameEnum.MCCheckPointTxt);
		this.mc2.x = -10;
        this.mc2.y = 23;
		this.addChild(this.mc2);
		this.mc2.playing = false;
		this.mc2.visible = false;
		this.mc1.scaleX = this.mc1.scaleY = this.mc2.scaleX = this.mc2.scaleY = 0.5;
	}

	public setData(itemData:ItemData):void {
		this.c1.selectedIndex = 1;
		this.baseItem.itemData = itemData;
	}

	public playEffect():void {
		this.mc1.setPlaySettings(0,-1,1,-1,()=>{
			this.mc1.playing = false;
			this.mc1.visible = false;
		},this);
		this.mc2.setPlaySettings(0,-1,1,-1,()=>{
			this.mc2.playing = false;
			this.mc2.visible = false;
		},this);
		this.mc1.playing = true;
		this.mc1.visible = true;

		this.mc2.playing = true;
		this.mc2.visible = true;
	}

	public stopEffect():void {
		this.c1.selectedIndex = 0;
		this.mc1.playing = false;
		this.mc1.visible = false;

		this.mc2.playing = false;
		this.mc2.visible = false;
	}
}