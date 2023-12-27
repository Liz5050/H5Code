class ToolTipBeastEquip extends ToolTipBase {
    
    protected txt_star : fairygui.GRichTextField;
    protected txt_base : fairygui.GRichTextField;
    protected txt_name : fairygui.GRichTextField;
    protected baseItem : BaseItem;
    protected txt_rebirthTime :  fairygui.GRichTextField;
    protected txt_career : fairygui.GRichTextField;
    protected txt_type : fairygui.GRichTextField;
    protected fightPanel : FightPanel;
    protected txt_score : fairygui.GRichTextField;
    protected itemData : any;
    protected btn_replace : fairygui.GButton;

    public constructor() {
		super(PackNameEnum.Common, "ToolTipBeastEquip");
	}

    public initUI(): void {
		super.initUI();
        this.txt_star = this.getGObject("txt_star").asRichTextField;
        this.txt_base = this.getGObject("txt_base").asRichTextField;
        this.txt_name = this.getGObject("txt_name").asRichTextField;
        this.baseItem = <BaseItem>this.getChild("loader_item"); 
        this.txt_rebirthTime = this.getGObject("txt_rebirthTime").asRichTextField;
        this.txt_career = this.getGObject("txt_career").asRichTextField;
        this.txt_type = this.getGObject("txt_type").asRichTextField;
        this.fightPanel = <FightPanel>this.getChild("panel_fight");
        this.txt_score = this.getGObject("txt_score").asRichTextField;
        this.btn_replace = this.getGObject("replace").asButton;
        this.btn_replace.addClickListener(this.clickReplace, this);
    }

    protected updateInfo(itemInfo: any):void{
        var name: string = this.itemData.getName(true);
		this.txt_name.text = name;
        this.txt_rebirthTime.text = ItemsUtil.getBeastColor(this.itemData.getCode());
        this.txt_career.text = "神兽";
        this.txt_type.text = GameDef.EBeastEquipType[this.itemData.getType()];
        var attrstr = "";
        var strLevel = 0;
       
        //强化属性
        if(this.itemData.getItemExtInfo()){
			strLevel = this.itemData.getItemExtInfo().strLevel;			
		}
        var baseAttrDict = WeaponUtil.getBaseAttrDict(this.itemData, true);
        var strAttrDict: any;
        if(strLevel) {
            strAttrDict = ConfigManager.mgBeastStrengthen.getStrAttrDict(this.itemData.getType(), strLevel);
            
            var attr: string = "";
            for (let key in baseAttrDict) { 

                var nameStr = "";
                var valueStr = "";

                valueStr = baseAttrDict[key];
                if(strAttrDict && strAttrDict[key]) {
                    valueStr += HtmlUtil.html(`     +${strAttrDict[key]}`,Color.Color_6);
                }
                nameStr = `${GameDef.EJewelName[key][0]}：`;
                attr += nameStr + valueStr + HtmlUtil.brText;
            }
            this.txt_base.text = attr;
        }
        else {
            this.txt_base.text = WeaponUtil.getBaseAttr(this.itemData, false, -1, Color.Color_7, Color.Color_8);
        }

        var starAttr : any = ConfigManager.mgBeastEquip.getStarAttrDict(this.itemData.getEffect());
        if(starAttr){
            var starStr ="";
             for (let key in starAttr) { 
                 var nameStr = "";
                var valueStr = "";
                valueStr = "+" + starAttr[key];
                nameStr = `${GameDef.EJewelName[key][0]} `;
                nameStr = HtmlUtil.html(nameStr, Color.Color_7);
                valueStr = HtmlUtil.html(valueStr, Color.Color_6);
                starStr += nameStr + valueStr + HtmlUtil.brText;
            }
            this.txt_star.text = starStr; 
        }

        ObjectUtil.mergeObj(baseAttrDict, strAttrDict);
        ObjectUtil.mergeObj(baseAttrDict, starAttr);

        this.fightPanel.updateValue(WeaponUtil.getCombat(baseAttrDict)*CacheManager.role.roles.length );
        this.txt_score.text = "评分：" + (WeaponUtil.getCombat(baseAttrDict))*CacheManager.role.roles.length  + "";
    }

    public setToolTipData(toolTipData: ToolTipData) {
		super.setToolTipData(toolTipData);
		//this.toolTipSource = toolTipData.source;
        if (toolTipData) {
			this.itemData = <ItemData>toolTipData.data;
            if (ItemsUtil.isTrueItemData(this.itemData)) {
				let itemInfo: any = this.itemData.getItemInfo();
				this.updateInfo(itemInfo);	
                this.baseItem.isShowCareerIco = false;
			    this.baseItem.isShowName = false;
			    this.baseItem.itemData = this.itemData;			
			}
            this.enableOptList(toolTipData.isEnableOptList);
        }
    }

    public enableOptList(enable:boolean):void{
		this.btn_replace.visible = this.toolTipData.extData == "equip";
	}

    
    public clickReplace() {
		var cfg = ConfigManager.mgShapeEquip.getByItemCode(this.itemData.getCode());
		var equipData = {"dressPos": cfg.type,  "roleIndex":this.toolTipData.roleIndex, "shape":cfg.shape};
		EventManager.dispatch(UIEventEnum.ShapeEquipReplaceOpen,equipData);
		this.hide();
	}



}