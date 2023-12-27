/**
 * 传世装备
 * @author zhh
 * @time 2018-08-24 11:31:46
 */
class AncientEquipModule extends BaseModule {
    private baseitem0:AncientEquipItem;
    private baseitem1:AncientEquipItem;
    private baseitem2:AncientEquipItem;
    private baseitem3:AncientEquipItem;
    private baseitem4:AncientEquipItem;
    private baseitem5:AncientEquipItem;
    private baseitem6:AncientEquipItem;
    private baseitem7:AncientEquipItem;
    private loaderBg:GLoader;
    private loaderEquip:GLoader;
    private loaderIco:GLoader;
    private txtTitle:fairygui.GRichTextField;
    private txtDesc:fairygui.GRichTextField;
    private txtCost:fairygui.GRichTextField;
    private txtFight:fairygui.GTextField;
    private btnAction:fairygui.GButton;
    private btnCompose:fairygui.GButton;
    private btnSuit:fairygui.GButton;
    private suitIcoLdr:GLoader;
    private listAttr:List;
    private curSelectItem:AncientEquipItem;
    private itemLists:AncientEquipItem[];
    private rolePanel:RoleItemPanel;
    private skillItem:AncientSkillItem;
    private curMaterialItem:ItemData;
    private isItemOk:boolean = false;
    private isCurAct:boolean = false;
    private curSelectIdx:number = -1;
    private curNeedCode:number=0;
    private c1:fairygui.Controller;
    private mcContainer:fairygui.GComponent;
    private equipContainer:fairygui.GComponent;
    private mcOnekey:UIMovieClip;
    private lastRoleIndex:number = 0;
    private equipModel:ModelShow;
	public constructor() {
		super(ModuleEnum.AncientEquip,PackNameEnum.AncientEquip);		
	}
	public initOptUI():void{
        
        //---- script make start ----
        this.c1 = this.getController("c1");
        this.baseitem0 = <AncientEquipItem>this.getGObject("baseItem_0");
        this.baseitem1 = <AncientEquipItem>this.getGObject("baseItem_1");
        this.baseitem2 = <AncientEquipItem>this.getGObject("baseItem_2");
        this.baseitem3 = <AncientEquipItem>this.getGObject("baseItem_3");
        this.baseitem4 = <AncientEquipItem>this.getGObject("baseItem_4");
        this.baseitem5 = <AncientEquipItem>this.getGObject("baseItem_5");
        this.baseitem6 = <AncientEquipItem>this.getGObject("baseItem_6");
        this.baseitem7 = <AncientEquipItem>this.getGObject("baseItem_7");

        this.skillItem = <AncientSkillItem>this.getGObject("skill_item");
        

        this.rolePanel = <RoleItemPanel>this.getGObject("panel_roleItem");
        this.mcContainer = this.getGObject("mc_container").asCom;
        this.equipContainer = this.getGObject("equip_container").asCom;
        this.loaderBg = <GLoader>this.getGObject("loader_bg");
        this.loaderBg.load(URLManager.getModuleImgUrl("bg1.jpg",PackNameEnum.AncientEquip));

        this.loaderEquip = <GLoader>this.getGObject("loader_equip");
        this.loaderIco = <GLoader>this.getGObject("loader_ico");
        this.txtTitle = this.getGObject("txt_title").asRichTextField;
        this.txtDesc = this.getGObject("txt_desc").asRichTextField;
        this.txtCost = this.getGObject("txt_cost").asRichTextField;
        let fightPanel:fairygui.GComponent = this.getGObject("fightPanel").asCom;
        this.txtFight = fightPanel.getChild("txt_fight").asTextField;
        this.btnAction = this.getGObject("btn_action").asButton;
        this.btnCompose = this.getGObject("btn_compose").asButton;
        this.btnSuit = this.getGObject("btn_suit").asButton;
        this.listAttr = new List(this.getGObject("list_attr").asList);
        this.suitIcoLdr = <GLoader>this.btnSuit.getChild("icon"); 
        this.btnAction.addClickListener(this.onGUIBtnClick, this);
        this.btnSuit.addClickListener(this.onGUIBtnClick, this);
        this.btnCompose.addClickListener(this.onGUIBtnClick, this);
        this.loaderIco.addClickListener(this.onGUIBtnClick, this);
        this.skillItem.addClickListener(this.onGUIBtnClick, this);
        this.itemLists = [];
        for(let i:number=0;i<CacheManager.ancientEquip.dressEquipsType.length;i++){
            let item:AncientEquipItem = (<AncientEquipItem>this['baseitem'+i]);
            item.addClickListener(this.onClickItem,this);
            this.itemLists.push(item);
        }
        //---- script make end ----
        this.rolePanel.setSelectChangedFun(this.onRoleChange,this);
        this.equipModel = new ModelShow(EShape.EAncientEquip);
        this.equipContainer.displayListContainer.addChild(this.equipModel);
	}

	public updateAll(data?:any):void{
        this.rolePanel.updateRoles(this.lastRoleIndex);
        this.updateRoleData();
        
	}

    private updateRoleData():void{        
        this.rolePanel.checkRoleTipsByFn(this.checkRoleTip,this);
        this.updatePosItem();        
        let idx:number = Math.max(this.curSelectIdx,0);        
        this.changeSelect(this.itemLists[idx],true);
    }  

    private addEffect(isAdd:boolean):void{
        if(isAdd){
            if(!this.mcOnekey){
                this.mcOnekey = UIMovieManager.get(PackNameEnum.MCOneKey);
            }
            this.mcOnekey.scaleX = this.mcOnekey.scaleY = 0.55;
            this.mcOnekey.x = this.mcOnekey.y = 0;
            this.mcContainer.addChild(this.mcOnekey);
            
        }else{
            if(this.mcOnekey){
                this.mcOnekey.destroy();
                this.mcOnekey = null;
            }
        }
    }
    /**
     * 检查角色红点
     */
    private checkRoleTip(roleIndex:number):boolean{
        return CacheManager.ancientEquip.checkRoleTips(roleIndex);
    }

    private updatePosItem():void{
        let dressEquipsType:number[] = CacheManager.ancientEquip.dressEquipsType;
        let posItems:any[] = CacheManager.ancientEquip.getPosItemInfo();
        for(let i:number = 0;i<dressEquipsType.length;i++){
            let data:any = {};
            ObjectUtil.mergeObj(data,posItems[i],false);
            data.roleIndex = this.rolePanel.selectedIndex;
            this.itemLists[i].setData(data,i);
            this.itemLists[i].checkTips();
        }
    }

    private changeSelect(item:AncientEquipItem,isForce:boolean):void{
        if(!item){
            return;
        }
        
        if(this.curSelectItem!=item || isForce){
            if(this.curSelectItem){
                this.curSelectItem.setSelect(false);
            }
            this.curSelectItem = item;
            this.curSelectItem.setSelect(true);
            let data:any = this.curSelectItem.getData();
            let itemData:ItemData = data.item; 
            //let url:string = URLManager.getModuleImgUrl(`equip/${itemData.getCode()}.png`,PackNameEnum.AncientEquip);
            //this.loaderEquip.load(url);
            this.equipModel.setData(itemData.getCode());

            let pos:number = data.type;
            this.curSelectIdx = CacheManager.ancientEquip.dressEquipsType.indexOf(pos);
        
            let lv:any = CacheManager.ancientEquip.getPosLevel(this.rolePanel.selectedIndex,pos);
            let nextCfg:any = ConfigManager.cultivate.getByPk(`${ECultivateType.ECultivateTypeForeverEquip},${pos},${lv+1}`);
            let idx2:number = 0;
            if(nextCfg){
                let hasNum:number = CacheManager.pack.propCache.getItemCountByCode2(nextCfg.itemCode);                
                this.isItemOk = hasNum>=nextCfg.itemNum;
                let clr:string = this.isItemOk?Color.Color_6:Color.Color_4;
                this.txtCost.text = HtmlUtil.html(hasNum+"/"+nextCfg.itemNum,clr);
            }else{
                //满级
                idx2 = 1;
                this.isItemOk = true;
                this.txtCost.text = "已满级";
                nextCfg = ConfigManager.cultivate.getByPk(`${ECultivateType.ECultivateTypeForeverEquip},${pos},${lv}`);
            }
            this.c1.setSelectedIndex(idx2);
            this.curNeedCode = nextCfg.itemCode;
            this.curMaterialItem = new ItemData(nextCfg.itemCode);
            this.curMaterialItem.itemAmount = nextCfg.itemNum;
            this.loaderIco.load(this.curMaterialItem.getIconRes());
            
            let curCfg:any;
            if(lv>0){
                curCfg = ConfigManager.cultivate.getByPk(`${ECultivateType.ECultivateTypeForeverEquip},${pos},${lv}`);
            }else{
                curCfg = nextCfg;
            }
            let attrs:any = WeaponUtil.getAttrArray(curCfg.attr);
            this.listAttr.setVirtual(attrs);

            let addAttr:number[] = CacheManager.ancientEquip.getPosAddEquipAttr(this.rolePanel.selectedIndex,pos,false);
            let valStr:string = "+";
            if(WeaponUtil.isPercentageAttr(addAttr[0])){
                 valStr += `${addAttr[1] / 100}%`;
            }else{
                valStr += `${addAttr[1]}`;
            }    
            let desc:string = CommonUtils.getAttrName(addAttr[0]) + "   "+HtmlUtil.html(valStr,Color.Color_8);
            this.txtDesc.text = desc; //App.StringUtils.substitude(LangAncientEquip.L1,WeaponUtil.getWeaponTypeName(pos),HtmlUtil.html("+5%","#0df14b"));

            let isAct:boolean = CacheManager.ancientEquip.isPosAct(this.rolePanel.selectedIndex,pos);
            this.isCurAct = isAct; 
            let idx:number = 0;         
            if(isAct){ //分解
                idx = 1;
                this.addEffect(CacheManager.ancientEquip.isRoleCanTransfer(this.rolePanel.selectedIndex,2));
            }else{
                //合成
                this.addEffect(CacheManager.ancientEquip.isRoleCanTransfer(this.rolePanel.selectedIndex,1));
            }
            this.btnAction.text = LangAncientEquip.L2[idx];
            this.btnCompose.text = `<u>${LangAncientEquip.L3[idx]}</u>`;
            this.txtFight.text = ""+CacheManager.ancientEquip.getRoleFight(this.rolePanel.selectedIndex);
            this.txtTitle.text = CacheManager.ancientEquip.getNameFix(lv)+itemData.getName(false);
            let suitLv:number = CacheManager.ancientEquip.getSuitLv(this.rolePanel.selectedIndex,true);
            this.btnSuit.grayed = suitLv<=0;
            suitLv = Math.max(suitLv,1);            
            this.suitIcoLdr.load(URLManager.getModuleImgUrl("level_"+suitLv+".png",PackNameEnum.AncientEquip));
            this.updateSkill(lv,pos);

        }
    }
    private updateSkill(lv:number,pos):void{
        let isSKill:boolean = CacheManager.ancientEquip.isSkillEquip(pos);
        this.skillItem.visible = isSKill;
        this.skillItem.grayed = lv==0; 
        if(isSKill){                
            lv = Math.max(lv,1);
            let info:any = ConfigManager.cultivate.getByPk(`${ECultivateType.ECultivateTypeForeverEquip},${pos},${lv}`);
            if(!info.effectStr){
                return;
            }
            let effectArr:string[] = info.effectStr.split("#");
            if(effectArr.length>0 && effectArr[0]){
                let effecInfoArr:string[] = effectArr[0].split(",");
                
                let cfgLv:number = Math.max(lv,1);
                let effectInfo:any = ConfigManager.cultivateEffect.getByPk(`${Number(effecInfoArr[0])},${cfgLv}`);
                if(effectInfo.addSkillId){
                    let skillInfo:any = ConfigManager.skill.getByPk(effectInfo.addSkillId);                    
                    this.skillItem.setData(skillInfo,0);
                }
            }                
        }
    }
    private onRoleChange(selectedIndex:number,selectedData:any):void{
        this.lastRoleIndex = selectedIndex;
        this.updateRoleData();
    }
    
    private onClickItem(e:egret.TouchEvent):void{        
        let item:AncientEquipItem = <AncientEquipItem>e.target;
        if(this.curSelectItem==item && item){
            let data:any = item.getData();
            ToolTipManager.showByCode(data.item,false,{roleIndex:this.rolePanel.selectedIndex},ToolTipSouceEnum.AncientEquip);
        }
        this.changeSelect(item,false);
        
    }

    protected onGUIBtnClick(e:egret.TouchEvent):void{
        var btn: any = e.target;
        switch (btn) {
            case this.btnAction:
                if(this.curSelectItem){
                    let data:any = this.curSelectItem.getData();
                    if(this.isItemOk){                        
                        let lv:any = CacheManager.ancientEquip.getPosLevel(this.rolePanel.selectedIndex,data.type);
                        if(lv>0){ //升级
                            Tip.showLeftTip(LangAncientEquip.L8);
                        }else{//激活
                            Tip.showLeftTip(LangAncientEquip.L11);
                            App.SoundManager.playEffect(SoundName.Effect_SkillUpgrade);
                        }
                        ProxyManager.cultivate.cultivateActive(ECultivateType.ECultivateTypeForeverEquip,data.type,lv+1,this.rolePanel.selectedIndex);
                        
                    }else{
                        let propGetCfg:any = ConfigManager.propGet.getByPk(this.curNeedCode);
                        if(propGetCfg){
                            EventManager.dispatch(LocalEventEnum.AncientEquipShowGainWin,{itemCode:this.curNeedCode,posType:data.type});
                        }else{
                            Tip.showLeftTip(LangAncientEquip.L6);
                        }                        
                    }                    
                }                
                break;
            case this.btnSuit:
                EventManager.dispatch(LocalEventEnum.AncientEquipShowSuitTip,{roleIndex:this.rolePanel.selectedIndex});
                break;
            case this.btnCompose:
                if(this.curSelectItem){
                    let data:any = this.curSelectItem.getData();
                    if(this.isCurAct){
                        EventManager.dispatch(LocalEventEnum.AncientEquipShowSmeltWin,data);
                    }else{
                        EventManager.dispatch(LocalEventEnum.AncientEquipShowComposeWin,data);
                    }                    
                }                
                break;
            case this.loaderIco:
                if(this.curMaterialItem){
                    ToolTipManager.showByCode(this.curMaterialItem.getCode());
                }
                break;
            case this.skillItem:
                EventManager.dispatch(LocalEventEnum.AncientEquipShowSkillTip,this.skillItem.getData());
                break;

        }
    }
    public hide(param: any = null, callBack: CallBack = null):void {
		super.hide(param,callBack);
        this.curSelectIdx = 0;
        this.lastRoleIndex = 0;
    }

}