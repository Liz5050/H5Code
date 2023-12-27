/**部件弹窗各个属性的视图 */
class ForgeImmAttrBaseView extends BaseView {
	protected baseItem:BaseItem;
	protected listAttr:List;
	protected _isItemOk:boolean;
	protected costItem:ItemData;
	protected costStr:string = "";
	protected _isMax:boolean;
	public constructor(view:fairygui.GComponent) {
		super(view);
	}

	protected initOptUI():void{
		let gobj:fairygui.GObject = this.getGObject("baseItem");
		if(gobj){
			this.baseItem = <BaseItem>gobj;			
			this.baseItem.bgUrl = URLManager.getPackResUrl(PackNameEnum.ForgeImmortals,"itemGrid");		}
		this.listAttr = new List(this.getGObject("list_attr").asList)
	}

	public updateAll(data?:any):void{
		this.updateAttrList(data);
		let curPosLv:number = CacheManager.forgeImmortals.getImmortalLevel(data.roleIndex,data.info.position);
		//"cultivateType,position,level"
		let nextInfo:any = ConfigManager.cultivate.getByPk(`${ECultivateType.ECultivateTypeImmortals},${data.info.position},${curPosLv+1}`);
		if(nextInfo){
			this._isMax = false;			
		}else{
			this._isMax = true;
			nextInfo = data.info; 
		}
		let needNum:number = nextInfo.itemNum;
		let hasNum:number = CacheManager.pack.propCache.getItemCountByCode2(nextInfo.itemCode);
		this.costItem = new ItemData(nextInfo.itemCode);
		this._isItemOk = hasNum>=needNum;
		let clr:string = this._isItemOk?Color.GreenCommon:Color.RedCommon;
		this.costStr = HtmlUtil.html(hasNum+"/"+needNum,clr);
		if(this.baseItem){
			this.baseItem.itemData = this.costItem;
			this.baseItem.colorLoader.visible = false;
			this.baseItem.bgLoader.visible = true;
			this.baseItem.setNameText(HtmlUtil.html(this.costItem.getName(),Color.Color_7));			
			this.baseItem.updateNum(this.costStr);
		}	
		
	}
	protected updateAttrList(data:any):void{
		let attrDict:any = WeaponUtil.getAttrDict(data.info.attr);
		let attrs:any[] = CacheManager.forgeImmortals.attrDictToArr(attrDict);
		this.listAttr.setVirtual(attrs);
	}
	public get isItemOk():boolean{
		return this._isItemOk;
	}
	public get isMax():boolean{
		return this._isMax;
	}

	public getCostItem():ItemData{
		return this.costItem;
	}

}