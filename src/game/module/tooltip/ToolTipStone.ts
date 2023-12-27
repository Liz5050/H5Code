class ToolTipStone extends ToolTipBase {
	private btnList: fairygui.GList;
	private gemList: fairygui.GList;
	private itemDatas: Array<ItemData>;
	private equipUid: string;
	private pos: number;

	public constructor() {
		super(PackNameEnum.Common, "ToolTipStone");
	}

	public initUI(): void {
		super.initUI();
		this.btnList = this.getGObject("list_btn").asList;
		this.gemList = this.getGObject("list_gem").asList;
		this.gemList.addEventListener(fairygui.ItemEvent.CLICK, this.inlay, this);
		
	}

	public setToolTipData(toolTipData: ToolTipData) {
		super.setToolTipData(toolTipData);
		if(toolTipData){
			let data: any = toolTipData.data;
			// let itemDatas: Array<ItemData>;
			let itemTxt: string = "";
			this.equipUid = data["equipUid"];
			this.pos = data["pos"];
			this.itemDatas = [];
			this.btnList.removeChildrenToPool();
			this.gemList.removeChildrenToPool();
			if(data["code"] == 1){
				this.itemDatas = CacheManager.pack.backPackCache.getByCT(ECategory.ECategoryJewel, data["color"]);
				itemTxt = "镶嵌宝石";
			}
			else{
				let stoneItem: ItemData = new ItemData(data["code"]);
				this.itemDatas = CacheManager.pack.backPackCache.getByCTAndItemLv(stoneItem.getCategory(), stoneItem.getType(), stoneItem.getItemLevel());
				itemTxt = "替换宝石";
				let itemBtn: fairygui.GComponent = this.btnList.addItemFromPool().asCom;
				itemBtn.text = "卸下";
				itemBtn.addClickListener(this.clickGetoffBtn, this);
			}
			if(this.itemDatas.length > 0){
				this.sortItemDatas();
				for(let itemData of this.itemDatas){
					let item: fairygui.GComponent = this.gemList.addItemFromPool().asCom;
					let baseItem: BaseItem = <BaseItem>item.getChild("baseitem");
					let mosaicTxt: fairygui.GTextField = item.getChild("txt_mosaic").asTextField;
					let gemTxt: fairygui.GTextField = item.getChild("txt_gem").asTextField;
					baseItem.itemData = itemData;
					baseItem.touchable = false;
					mosaicTxt.text = itemTxt;
					gemTxt.text = GameDef.NumberName[itemData.getItemLevel()] + "级加基础属性";
				}
			}
			else{
				let item: fairygui.GComponent = this.gemList.addItemFromPool().asCom;
				let baseItem: BaseItem = <BaseItem>item.getChild("baseitem");
				let mosaicTxt: fairygui.GTextField = item.getChild("txt_mosaic").asTextField;
				let gemTxt: fairygui.GTextField = item.getChild("txt_gem").asTextField;
				baseItem.itemData = new ItemData(ConfigManager.item.selectMaxByCT(ECategory.ECategoryJewel, data["color"]).code);
				baseItem.touchable = false;
				mosaicTxt.text = data["code"] == 1 ? "前往商城可购买" : "替换宝石";
				gemTxt.text = "可镶嵌"+ (data["color"] == EProp.EPropJewelAdvance ? "红" : "蓝") +"宝石";
			}
			
		}
	}

	private inlay(e: any):void{
		if(this.itemDatas.length > 0){
			let baseItem: BaseItem = e.itemObject.getChild("baseitem");
			let itemData = baseItem.itemData;
			ProxyManager.refine.jewelEmbed(this.equipUid, this.pos, baseItem.itemData.getCode());
		}
		else{
			// Tip.showTip("商城功能尚未开放");
			EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Shop);
		}
		ToolTipManager.hide();
	}

	private clickGetoffBtn(): void{
		ProxyManager.refine.jewelGetOff(this.equipUid, this.pos);
		ToolTipManager.hide();
	}

	public sortItemDatas():void{
		if(this.itemDatas && this.itemDatas.length > 0){
			this.itemDatas.sort((a: any, b:any): number =>{
				return b.getItemLevel() - a.getItemLevel();
			});
		}
	}

	public center():void{
		let optListWidth:number = 130;
		let centerX:number = (fairygui.GRoot.inst.width - this.width + optListWidth)/2;
		let centerY:number = (fairygui.GRoot.inst.height - this.height)/2;
		this.setXY(centerX, centerY);
	}
}