class ToolTipEquip4 extends ToolTipBase{
    private c1:fairygui.Controller;
    protected baseItem: BaseItem;
    private txt_name :fairygui.GTextField;
    private txt_lvl : fairygui.GTextField;
    private txt_num : fairygui.GTextField;
    private list_star : fairygui.GList;
    private txt_attr : fairygui.GRichTextField;
    private txt_fight : fairygui.GTextField;
    private txt_skill : fairygui.GRichTextField;
    private star_num : number;
    private weight : number[] = [2, 5, 1, 0];
    private color =["绿色","蓝色","紫色","橙色","红色"];
    protected itemData: ItemData;
    private warehouseScoreCom:WarehouseExchangeCom;
    public constructor() {
		    super(PackNameEnum.Common, "ToolTipEquip4");
	  }

    public initUI(): void {
        super.initUI();
        this.c1 = this.getController("c1");
        this.baseItem = <BaseItem>this.getChild("loader_item");
        this.txt_name = this.getGObject("txt_name").asTextField;
        this.txt_lvl = this.getGObject("txt_lvl").asTextField;
        this.txt_num = this.getGObject("txt_num").asTextField;
        this.list_star = this.getGObject("list_star").asList;
        this.txt_attr = this.getGObject("txt_attr").asRichTextField;
        this.txt_fight = this.getGObject("txt_fight").asTextField;
        this.txt_skill = this.getGObject("txt_skill").asRichTextField;
        this.warehouseScoreCom = this.getChild("com_exchange") as WarehouseExchangeCom;
	  }



    public setToolTipData(toolTipData:ToolTipData){
        super.setToolTipData(toolTipData);
        this.c1.selectedIndex = 0;
        if (toolTipData) {
		    this.itemData = <ItemData>toolTipData.data;
            if(toolTipData.source == ToolTipSouceEnum.GuildScoreWarehouse) {
				this.c1.selectedIndex = 1;
				this.warehouseScoreCom.setData(this.itemData);
			}
		    if (ItemsUtil.isTrueItemData(this.itemData)) {
		        let itemInfo: any = this.itemData.getItemInfo();
		        this.updateInfo(itemInfo);		
                if(this.itemData.getItemAmount()) {
                    this.txt_num.text = this.itemData.getItemAmount().toString();
                }
                else {
                    this.txt_num.text = "0";
                }
                this.txt_lvl.text = "1级";//WeaponUtil.getEquipLevelText(this.itemData, true);//等级
            }
        }
    }

    protected updateInfo(itemInfo: any):void{
        this.txt_name.text = itemInfo.name;
        this.txt_name.color = Color.ItemColor[itemInfo.color];
        if(itemInfo.color <=2) {
            this.starListAddItem(3);
        }
        else {
            this.starListAddItem(5);
        }
        this.setStarListNum(itemInfo.newItemLevel);
        this.getFightCombat(itemInfo);
        this.setAttrStr(itemInfo);
        this.baseItem.isShowCareerIco = false;
		this.baseItem.isShowName = false;
		this.baseItem.itemData = this.itemData;
        this.baseItem.numTxt.text = "";
        this.setSkill(itemInfo);
	  }

    private starListAddItem(num : number): void {
        this.star_num = num;
	  	  this.list_star.removeChildrenToPool();
		    for (let i = 0; i < num; i++) {
                  let item: fairygui.GComponent = this.list_star.addItemFromPool().asCom;
		    }
	}

    public setStarListNum(num: number): void {
		    for (let i = 0; i < this.star_num; i++) {
			      let item: fairygui.GComponent = this.list_star.getChildAt(i).asCom;
			      let controller: fairygui.Controller = item.getController("c1");
			      controller.selectedIndex = i < num ? 1 : 0;
		    }
    }

    public setAttrStr(itemInfo: any) {
        this.txt_attr.text = "";
        let str : string = "";
        if(itemInfo.baseLife) {
            str += "<font color =" + Color.Color_7 + ">生命</font> <font color = 0x09C735>  + "+itemInfo.baseLife+"</font>\n";
        }
        if(itemInfo.basePass) {
            str += "<font color =" + Color.Color_7 + ">破甲</font> <font color = 0x09C735>  + "+ itemInfo.basePass  + "</font>\n";
        }
        if(itemInfo.basePhysicalAttack) {
            str += "<font color =" + Color.Color_7 + ">攻击</font> <font color = 0x09C735>  + " +itemInfo.basePhysicalAttack + "</font>\n";
        }
        if(itemInfo.basePhysicalDefense) {
            str += "<font color =" + Color.Color_7  + ">防御</font> <font color = 0x09C735>  + "+ itemInfo.basePhysicalDefense +"</font>\n";
        }
        if(itemInfo.baseAttrList) {
            str += "<font color =" + Color.Color_7 + ">" +GameDef.EJewelName[itemInfo.baseAttrList.split("#")[0].split(",")[0]][0] +"</font> <font color = 0x09C735>  + " + itemInfo.baseAttrList.split("#")[0].split(",")[1] +"</font>\n";
        }
        this.txt_attr.text = str;
    }

    public getFightCombat(itemInfo: any) {

        if(itemInfo) {
            var attr = {1:0,2:0,3:0,4:0};
            if(itemInfo) {
                if(itemInfo.basePhysicalAttack) {
                    attr[1] += itemInfo.basePhysicalAttack;
                }
                if(itemInfo.basePass) {
                    attr[3] += itemInfo.basePass;
                }
                if(itemInfo.baseLife) {
                    attr[2] += itemInfo.baseLife;
                }
                if(itemInfo.basePhysicalDefense) {
                    attr[4] += itemInfo.basePhysicalDefense;
                }
            }
            var ex : string = itemInfo.baseAttrList;
            var exnum : number = 0;
            var fightvalue = 0;

            if(ex) {
                exnum = Number(ex.split("#")[0].split(",")[1]);        
                var pos = Number(ex.split("#")[0].split(",")[0]);
                fightvalue = WeaponUtil.getCombat(attr) + Math.ceil(exnum * this.weight[(pos - 23)]);
            }
            else {
                fightvalue = WeaponUtil.getCombat(attr);
            }
            
            

            this.txt_fight.text = "战斗力：" + fightvalue;
        }
    }

    public setSkill(itemInfo : any) {
        var suitCfg = ConfigManager.cultivateSuit.getCurSuitInfoByCurLevelHeart(ECultivateType.ECultivateTypeHeartMethod, itemInfo.equipType , itemInfo.color - 1);
        if(suitCfg) {
            let arr:string[] = CommonUtils.configStrToArr(suitCfg.effectStr,false);		
			      arr = arr[0].split(",");		
            var effectCfg = ConfigManager.cultivateEffect.getByPk(arr[0]+","+(itemInfo.color-1));
            if(effectCfg) {
                var skillCfg = ConfigManager.skill.getSkill(effectCfg.addSkillId);
                if(skillCfg) {
                    var name = skillCfg.skillName + skillCfg.skillLevel + "重 (" + this.color[itemInfo.color - 1] +"五件激活)" ;
                    name = "<font color="+Color.getItemColr(itemInfo.color) + ">" + name + "</font>\n";
                    this.txt_skill.text = name + skillCfg.skillDescription;
                }
            }
        }
    }

    

}