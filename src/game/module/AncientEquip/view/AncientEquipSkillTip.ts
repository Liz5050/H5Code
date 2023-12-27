/**
 * 传世技能图标tips
 * @author zhh
 * @time 2018-08-28 21:07:28
 */
class AncientEquipSkillTip extends BaseWindow {
    private baseItem:BaseItem;
    private windowItemtip:fairygui.GImage;
    private txtTip:fairygui.GObject;
    private txtDesc:fairygui.GRichTextField;
    private txtName:fairygui.GRichTextField;

	public constructor() {
		super(PackNameEnum.AncientEquip,"AncientEquipSkillTip")

	}
	public initOptUI():void{
        //---- script make start ----
        this.baseItem = <BaseItem>this.getGObject("baseItem");
        this.windowItemtip = this.getGObject("window_itemtip").asImage;
        this.txtTip = this.getGObject("txt_tip");
        this.txtDesc = this.getGObject("txt_desc").asRichTextField;
        this.txtName = this.getGObject("txt_name").asRichTextField;

        //---- script make end ----
        this.baseItem.isShowName = false;
	}

	public updateAll(data?:any):void{
		let skillCfg:any = data;
        let iconUrl:string = URLManager.getIconUrl(skillCfg.skillIcon, URLManager.SKIL_ICON);
        this.baseItem.itemData = null;
        this.baseItem.icoUrl = iconUrl;
        this.txtName.text = skillCfg.skillName;
        this.txtDesc.text = skillCfg.skillDescription;
        this.view.setSize(this.view.width,this.txtTip.y+this.txtTip.height);
	}


}