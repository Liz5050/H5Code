class ForgeCastingItem extends BaseView {
	private controller:fairygui.Controller;
	private txt_level:fairygui.GTextField;
	private loader:GLoader;
	private itemIndex:number;
	private equipType:EEquip;
	public constructor(component:fairygui.GComponent,itemIndex:number) {
		super(component);
		this.itemIndex = itemIndex;
	}

	public initOptUI():void {
		this.controller = this.getController("c1");
		this.txt_level = this.getGObject("txt_level").asTextField;
		this.loader = this.getGObject("loader") as GLoader;
	}

	public updateAll(type:EEquip):void {
		this.loader.load(URLManager.getPackResUrl(PackNameEnum.Forge,"img_equip_" + type));
	}

	public updateLevel(level:number):void {
		let itemLv:number = StrengthenExUtil.getItemStrengthenLevel(this.itemIndex,level,8);
		if(itemLv == 0) {
			this.txt_level.text = ""
		}
		else {
			this.txt_level.text = "" + itemLv;
		}
	}

	public set selected(value:boolean) {
		this.controller.selectedIndex = value ? 1 : 0;
	}
}