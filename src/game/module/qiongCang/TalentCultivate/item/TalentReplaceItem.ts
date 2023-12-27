class TalentReplaceItem extends ListRenderer{
	private c1:fairygui.Controller;
    private baseitem:BaseItem;
    private scoreTxt:fairygui.GTextField;
    private levelTxt:fairygui.GTextField;
    private attTxt:fairygui.GRichTextField;
    private addSkillTxt:fairygui.GTextField;
    private replaceBtn:fairygui.GButton;

	private itemData: ItemData;

	public constructor() {
		super();
		
	}
	protected constructFromXML(xml:any):void{			
		super.constructFromXML(xml);
        this.c1 = this.getController("c1");
        this.baseitem = <BaseItem>this.getChild("baseitem");
        this.baseitem.isShowCareerIco = false;
        this.baseitem.isSelectStatus = false;
        this.scoreTxt = this.getChild("txt_score").asTextField;
        this.levelTxt = this.getChild("txt_level").asTextField;
        this.attTxt = this.getChild("txt_att").asRichTextField;
        this.addSkillTxt = this.getChild("txt_addSKillLevel").asTextField;
        this.replaceBtn = this.getChild("btn_replace").asButton;

        this.replaceBtn.addClickListener(this.clickReplaceBtn, this);


	}
	public setData(data:any,index:number):void{
        this.itemData = <ItemData>data.item;
		this._data = data;
		this.itemIndex = index;
        
        this.baseitem.itemData =  this.itemData;       
        this.baseitem.setNameText( this.itemData.getName(true));        
        this.scoreTxt.text = "评分："+WeaponUtil.getScoreBase( this.itemData)+"";
        let dict: any = WeaponUtil.getBaseAttrDict( this.itemData);
        let dressPos:number = ItemsUtil.getEqiupPos( this.itemData);
        let roleIndex:number = data.roleIndex;
        let career: number = CacheManager.role.getRoleCareerByIndex(roleIndex);
        this.attTxt.text = WeaponUtil.getAttrAndCareerNameStr(dict, career, true, Color.Color_8, Color.Color_7, "+");
        
        let curDressEquip:ItemData = CacheManager.pack.rolePackCache.getDressEquipByPos(dressPos,roleIndex);
        let dressScore:number = CacheManager.pack.rolePackCache.getDressEquipScoreByPos(dressPos,roleIndex);
        let curScrore:number = WeaponUtil.getScoreBase( this.itemData);
		this.levelTxt.text = `圣物品级：<font color = ${Color.ItemColor[ this.itemData.getColor()]}>${GameDef.EColorTalentName[ this.itemData.getColor()]}</font>`;
                
        this.c1.selectedIndex = data.isDress ? 0 : 1;

        let talentSkillCfg1: any = ConfigManager.cultivateEffectType.getByPk(this.itemData.getEffect());
        let talentSkillCfg2: any = ConfigManager.cultivateEffectType.getByPk(this.itemData.getEffectEx());
        let talentSkillCfg3: any = ConfigManager.cultivateEffectType.getByPk(this.itemData.getEffectEx2());
        let talentName: string = "";
        if(talentSkillCfg1){
            talentName = `${talentSkillCfg1.name}`;
        }
        if(talentSkillCfg2){
            talentName += `、${talentSkillCfg2.name}`;
        }
        if(talentSkillCfg3){
            talentName += `、${talentSkillCfg3.name}`;
        }
        this.addSkillTxt.text = `装备该圣物可提升${talentName}等级`;

	}

	private clickReplaceBtn(): void{
		if(this._data.isReplace){
			ProxyManager.cultivate.talentEquipInlay(ECultivateType.ECultivateTypeTalent, this._data.pos, this._data.roleIndex, 1, this.itemData.getCode());
		}else{
			ProxyManager.cultivate.talentEquipInlay(ECultivateType.ECultivateTypeTalent, this._data.pos, this._data.roleIndex, 0, this.itemData.getCode());
		}
		EventManager.dispatch(LocalEventEnum.TalentReplaceWindowHide);
	}
}