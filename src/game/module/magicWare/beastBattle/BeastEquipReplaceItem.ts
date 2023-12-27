class BeastEquipReplaceItem extends ListRenderer {
    private baseitem: BaseItem;
    private btnReplace: fairygui.GButton;
    private btnUndress: fairygui.GButton;
    private c1: fairygui.Controller;
    private txtLevel: fairygui.GRichTextField;
    private attrTxt: fairygui.GRichTextField;
    private strAttrTxt: fairygui.GTextField;
    private txtScore: fairygui.GTextField;
    private type: number;
    private code: number;
    private shape: EShape;

    public constructor() {
        super();
    }

    protected constructFromXML(xml: any): void {
        super.constructFromXML(xml);
        //---- script make start ----
        this.c1 = this.getController("c1");
        this.baseitem = <BaseItem>this.getChild("baseitem");
        // this.baseitem.isShowCareerIco = false;
        this.baseitem.isSelectStatus = false;
        this.txtScore = this.getChild("txt_score").asTextField;
        this.txtLevel = this.getChild("txt_level").asRichTextField;
        //this.txtName = this.getChild("txt_name").asRichTextField;
        this.attrTxt = this.getChild("txt_att").asRichTextField;
        this.strAttrTxt = this.getChild("txt_strAttr").asTextField;
        this.btnReplace = this.getChild("btn_replace").asButton;
        this.btnUndress = this.getChild("btn_undress").asButton;

        this.btnReplace.addClickListener(this.onGUIBtnClick, this);
        this.btnUndress.addClickListener(this.onGUIBtnClick, this);
        //---- script make end ----
    }


    protected onGUIBtnClick(e: egret.TouchEvent): void {
        let btn: any = e.target;
        switch (btn) {
            case this.btnReplace:
                EventManager.dispatch(LocalEventEnum.BeastBattleDressEquip, { "code": this._data.beastCode, "uid": this._data.item.getUid() });
                break;
            case this.btnUndress:
                if(CacheManager.beastBattle.isBeckonByCode(this._data.beastCode)){
                    Alert.alert(LangBeast.LANG10, this.unDressEquip, this);
                }else{
                    this.unDressEquip();
                }
                break;
        }
    }

    private unDressEquip(): void{
        EventManager.dispatch(LocalEventEnum.BeastBattleUndressEquip, { "code": this._data.beastCode, "holeId": this._data.holeId });
    }

    public setData(data: any, index: number): void {
        let itemData: ItemData = <ItemData>data.item;
        this._data = data;
        this.itemIndex = index;

        this.baseitem.itemData = itemData;
        this.baseitem.setNameText(itemData.getName(true));
        this.baseitem.numTxt.visible = false;
        let curScrore: number = 0;
        let dict: any = WeaponUtil.getBeastEquipAttrDict(itemData);
        // let clr: any = "#c8b185";
        // let str: string = WeaponUtil.getAttrText2(dict, false, clr, null, true, false);
        // this.attrTxt.text = str;
        curScrore = WeaponUtil.getCombat(dict) * CacheManager.role.roles.length;
        this.txtScore.text = `评分：${curScrore}`;

        let dressScore: number = data.dressScore;
        let idx = 0;
        this.txtLevel.text = "品质：" + ItemsUtil.getBeastColor(itemData.getCode());
        if (!data.isDressed) {
            if (curScrore > dressScore) {
                let isReferrer: boolean = (dressScore > 0 && index == 1) || index == 0;
                idx = isReferrer ? 3 : 2;
            } else {
                idx = 1;
            }
        }
        this.c1.setSelectedIndex(idx);

        let strLevel: number;
		let baseAttrDict: any;
		let starAttrDict: any;
		let strAttrDict: any = {};
		let attrDict: any = {}
		if(ItemsUtil.isTrueItemData(itemData)){
			baseAttrDict = WeaponUtil.getBaseAttrDict(itemData);
			starAttrDict = ConfigManager.mgBeastEquip.getStarAttrDict(itemData.getEffect());
			if(itemData.getItemExtInfo().strLevel){
				strLevel = itemData.getItemExtInfo().strLevel;
				strAttrDict = ConfigManager.mgBeastStrengthen.getStrAttrDict(itemData.getType(), strLevel);
			}
			
			for(let key in baseAttrDict){
				if(!attrDict[key]){
					attrDict[key] = 0;
				}
				attrDict[key] += Number(baseAttrDict[key]);
				attrDict[key] += Number(starAttrDict[key]);
			}
            // let dict: any = ObjectUtil.mergeObj(baseAttrDict, starAttrDict, true);
            this.attrTxt.text = WeaponUtil.getAttrText2(attrDict, false, null, null, true, false);
            this.strAttrTxt.text = WeaponUtil.getAttrText2(strAttrDict, false, null, null, true, true, false, "");
		}
    }

}