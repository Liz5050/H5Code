/**
 * 传世装备tips
 * @author zhh
 * @time 2018-08-27 20:38:27
 */
class ToolTipAncientEquip extends ToolTipBase {
    private cOpt:fairygui.Controller;
    private windowItemtip:fairygui.GImage;
    private txtFight:fairygui.GTextField;
    private txtBase:fairygui.GRichTextField;
    private txtName:fairygui.GRichTextField;
    private txtRebirthTime:fairygui.GRichTextField;
    private txtCareer:fairygui.GRichTextField;
    private txtType:fairygui.GRichTextField;
    private txtScore:fairygui.GRichTextField;
    private itemData:ItemData;
    private baseItem:BaseItem;
    protected extData: any;
	protected toolTipSource: ToolTipSouceEnum = ToolTipSouceEnum.None;

	public constructor() {
		super(PackNameEnum.Common, "ToolTipAncientEquip");
	}

	public initUI(): void {
		super.initUI();
        //---- script make start ----
        this.cOpt = this.getController("c_opt");
        this.windowItemtip = this.getGObject("window_itemtip").asImage;
        this.txtBase = this.getGObject("txt_base").asRichTextField;
        this.txtName = this.getGObject("txt_name").asRichTextField;
        this.txtRebirthTime = this.getGObject("txt_rebirthTime").asRichTextField;
        this.txtCareer = this.getGObject("txt_career").asRichTextField;
        this.txtType = this.getGObject("txt_type").asRichTextField;
        this.txtScore = this.getGObject("txt_score").asRichTextField;
        let panel_fight: fairygui.GComponent = this.getChild("panel_fight").asCom;
		this.txtFight = panel_fight.getChild("txt_fight").asTextField;
        this.baseItem = <BaseItem>this.getGObject("loader_item");
        this.baseItem.isShowName = false;
        //---- script make end ----

	}

	public setToolTipData(toolTipData: ToolTipData) {
		super.setToolTipData(toolTipData);		
		this.toolTipSource = toolTipData.source;
		this.extData = toolTipData.extData;
		if (toolTipData) {
			this.itemData = <ItemData>toolTipData.data;
            this.baseItem.itemData = this.itemData; 
			if (ItemsUtil.isTrueItemData(this.itemData)) {
				let itemInfo: any = this.itemData.getItemInfo();
				this.updateInfo(itemInfo);				
			}
		}		
	}
    protected updateInfo(itemInfo: any):void{

		var name: string = this.itemData.getName(true);
		this.txtName.text = name;
		
		let career: number = this.itemData.getCareer();
		this.txtRebirthTime.text = WeaponUtil.getEquipLevelText(this.itemData, false);//等级
		this.txtCareer.text = "混元";//职业
		// let careerColor: number = 0xFFFFFF;
		// this.txtCareer.color = careerColor;
        let pos:number = itemInfo.effect;
		this.txtType.text = WeaponUtil.getWeaponTypeName(pos); //部位
        
        let posLv:number = 1;
		let isAncient:boolean = this.toolTipSource==ToolTipSouceEnum.AncientEquip;
		let roleIndex:number = 0;
        if(isAncient){
            roleIndex = this.extData.roleIndex;
            posLv = CacheManager.ancientEquip.getPosLevel(roleIndex,pos);
        }        
        posLv = Math.max(posLv,1); 
        //"cultivateType,position,level"
        let cfg:any = ConfigManager.cultivate.getByPk(`${ECultivateType.ECultivateTypeForeverEquip},${pos},${posLv}`);
        let attr:any = WeaponUtil.getAttrDict(cfg.attr);
        let attrEx:any = WeaponUtil.getAttrDict(cfg.attrEx);
        let html:string = "";
        html+=WeaponUtil.getAttrText2(attr,true,Color.Color_8,Color.Color_7,true,false,true)+HtmlUtil.brText;
        html+=this.getAttrTitle("特殊属性");
        html+=WeaponUtil.getAttrText2(attrEx,true,Color.Color_6,Color.Color_7,true,true,true,"")+HtmlUtil.brText;
        
		let isSKill:boolean = CacheManager.ancientEquip.isSkillEquip(pos);
		if(isSKill){                
            posLv = Math.max(posLv,1);
            let info:any = ConfigManager.cultivate.getByPk(`${ECultivateType.ECultivateTypeForeverEquip},${pos},${posLv}`);
            if(info.effectStr){
				let effectArr:string[] = info.effectStr.split("#");
				if(effectArr.length>0 && effectArr[0]){
					let effecInfoArr:string[] = effectArr[0].split(",");					
					let cfgLv:number = Math.max(posLv,1);
					let effectInfo:any = ConfigManager.cultivateEffect.getByPk(`${Number(effecInfoArr[0])},${cfgLv}`);
					if(effectInfo.addSkillId){
						let skillInfo:any = ConfigManager.skill.getByPk(effectInfo.addSkillId);
						html+=this.getAttrTitle("附加技能");
						html+=HtmlUtil.html(skillInfo.skillName,"#ed4230",true);
						html+=skillInfo.skillDescription;						        
					}
				}
            }
                            
        }

        this.txtBase.text = html;

		this.txtScore.text = "评分："+WeaponUtil.getCombat(attr);
		let fight:number = 0;
		let totalAttr:any = {};			
		ObjectUtil.mergeObj(totalAttr,attr);
		ObjectUtil.mergeObj(totalAttr,attrEx);
		
		if(isAncient){
			let isAct:boolean = CacheManager.ancientEquip.isPosAct(roleIndex,pos);
			if(isAct){
				fight = WeaponUtil.getCombat(totalAttr,roleIndex);
			}			
		}else{
			fight = WeaponUtil.getCombat(totalAttr,roleIndex);
		}
		this.txtFight.text = fight+"";
		this._view.setSize(this._view.width,this.windowItemtip.y+this.windowItemtip.height+35)
	}

    private getFmtAttrDictHtml(dict: any,colorStr:string): string {
		var attr: string = "";
		for (let key in dict) {
			if (Number(dict[key]) > 0) {
				attr += this.getAttrHtml(Number(key), dict[key],colorStr);
			}
		}
		return attr;
	}
	private getAttrHtml(attrType: number, attrValue: any,colorStr:string): string {
		if (WeaponUtil.isPercentageAttr(Number(attrType))) {//有些属性是万分比
			attrValue = `${Number(attrValue) / 100}%`;
		}
		var attr: string = HtmlUtil.html(`${GameDef.EJewelName[attrType][0]}：+${attrValue}`,colorStr, true);
		return attr;
	}
    private getAttrTitle(title: string,clr:string="#FEA700"): string {
		return `<font color='${clr}'>${title}</font>\n`;
	}
	
}