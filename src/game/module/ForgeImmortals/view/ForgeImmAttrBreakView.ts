/**突破属性面板 */
class ForgeImmAttrBreakView extends ForgeImmAttrBaseView {
	private txtCurLv:fairygui.GTextField;
	private txtNextLv:fairygui.GTextField;
	private imgArrow:fairygui.GImage;
	public constructor(view:fairygui.GComponent) {
		super(view);
	}
	protected initOptUI():void{
		super.initOptUI();
		this.txtCurLv = this.getGObject("txt_curLv").asTextField;
		this.txtNextLv = this.getGObject("txt_nextLv").asTextField;
		this.imgArrow = this.getGObject("img_arrow").asImage;
	}
	public updateAll(data?:any):void{
		super.updateAll(data);
		let lv:number = CacheManager.forgeImmortals.getImmortalLevel(data.roleIndex,data.info.position);
		//"cultivateType,position,level"
		this.txtCurLv.text = lv+"";
		this.txtNextLv.visible = !this._isMax;
		this.imgArrow.visible = !this._isMax;
		if(!this._isMax){
			this.txtNextLv.text = (lv+ForgeImmortalsCache.BREAK_LV)+""; 
		}
		
	}
	protected updateAttrList(data:any):void{
		let attrs:any[] = ConfigManager.cltImmortal.getCompareAttrInfo(data.roleIndex,data.info);
		this.listAttr.setVirtual(attrs);
	}
}