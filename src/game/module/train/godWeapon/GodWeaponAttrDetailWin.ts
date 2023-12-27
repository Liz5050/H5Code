/**
 * 神器总属性预览窗口
 * @author zhh
 * @time 2018-06-11 18:06:33
 */
class GodWeaponAttrDetailWin extends BaseContentView {
    private windowItemtip:fairygui.GImage;
    private txtBase:fairygui.GTextField;

	public constructor() {
		super(PackNameEnum.TrainGodWeaponPanel,"DetailedAttr");
		this.modal = true;
		this.isCenter = true;
		this.isPopup = true;
	}
	public initOptUI():void{
        //---- script make start ----
        this.windowItemtip = this.getGObject("window_itemtip").asImage;
        this.txtBase = this.getGObject("txt_base").asTextField;
        //---- script make end ----

	}

	public updateAll(data?:any):void{
		this.txtBase.text = CacheManager.godWeapon.getGodWPTotalAttrText();
	}

}