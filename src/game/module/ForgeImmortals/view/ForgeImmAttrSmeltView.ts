/**炼化属性面板 */
class ForgeImmAttrSmeltView extends ForgeImmAttrBaseView{
	private txtCost:fairygui.GTextField;
	private loaderIco:GLoader;
	public constructor(view:fairygui.GComponent) {
		super(view);
	}
	protected initOptUI():void{
		super.initOptUI();
		this.txtCost = this.getGObject("txt_cost").asTextField;
		this.loaderIco = <GLoader>this.getGObject("loader_ico");
		this.loaderIco.addClickListener(this.onClickIco,this);
	}
	public updateAll(data?:any):void{
		super.updateAll(data);		
		this.loaderIco.load(this.costItem.getIconRes());
		this.txtCost.text = this.costStr;
	}
	
	private onClickIco(e:any):void{
		ToolTipManager.showByCode(this.costItem.getCode());
	}
	protected updateAttrList(data:any):void{
		let attrs:any[] = ConfigManager.cltImmortal.getCompareAttrInfo(data.roleIndex,data.info);
		this.listAttr.setVirtual(attrs);
	}

}