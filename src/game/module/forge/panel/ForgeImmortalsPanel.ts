/**
 * 神兵界面
 * @author zhh
 * @time 2018-08-17 11:19:10
 */
class ForgeImmortalsPanel extends ForgeBaseTabPanel {
    private loaderBg: GLoader;
    private txtDesc: fairygui.GTextField;
    private btnRight: fairygui.GButton;
    private btnLeft: fairygui.GButton;
    private listAttr: List;
    private listWeapon: List;
    private weapons: number[];
    private _fight: number = 0;
    private roleWeaponInfoDict: any;
    private pageSize: number = 2;
    public constructor() {
        super();
    }

    protected initOptUI(): void {
        //---- script make start ----
        this.loaderBg = <GLoader>this.getGObject("loader_bg");
        this.loaderBg.load(URLManager.getModuleImgUrl("bg.jpg", PackNameEnum.Forge));
        this.txtDesc = this.getGObject("txt_desc").asTextField;
        this.btnRight = this.getGObject("btn_right").asButton;
        this.btnLeft = this.getGObject("btn_left").asButton;
        this.listAttr = new List(this.getGObject("list_attr").asList);
        this.listWeapon = new List(this.getGObject("list_weapon").asList);

        this.btnRight.addClickListener(this.onGUIBtnClick, this);
        this.btnLeft.addClickListener(this.onGUIBtnClick, this);
        this.listWeapon.list.addEventListener(fairygui.ItemEvent.CLICK, this.onClickWeapon, this);
        this.listWeapon.setSrcollStatus(this.pageSize,this.handlerBtnShow,this);
        //this.listWeapon.list.scrollPane.addEventListener(fairygui.ScrollPane.SCROLL_END, this.onWeaponScrollEnd, this);
        //---- script make end ----
        this.weapons = ConfigManager.cultivate.getSubTypes(ECultivateType.ECultivateTypeImmortals);

    }

    public updateAll(data?: any): void {
        if (this._roleIndex != null) {
            this.updateProp();
            let totalDict: any = CacheManager.forgeImmortals.getActTotalAttrDict(this._roleIndex);
            this._fight = WeaponUtil.getCombat(totalDict);
            let attrs: any[] = CacheManager.forgeImmortals.attrDictToArr(totalDict);
            if (attrs.length == 0) { //没有激活任何属性
                let subType: number = this.weapons[0];
                let immortalInfo: any = CacheManager.forgeImmortals.getSuitInfo(this.roleIndex, subType, ForgeImmortalsCache.IMMINFO_SUIT_LV);
                totalDict = WeaponUtil.getAttrDict(immortalInfo.attr);
                attrs = CacheManager.forgeImmortals.attrDictToArr(totalDict);
            }
            this.listAttr.setVirtual(attrs);
            //this.handlerBtnShow();
        }
    }

    public updateProp(): void {
        let infos: any[] = this.getRoleInfos();
        if (infos) {
            this.listWeapon.data = infos;
            //this.listWeapon.setVirtual(infos);
        }

        /**指引注册 */
        let forgeImmortalsItem: ForgeImmortalsItem;
        let data: any;
        for(let item of this.listWeapon.list._children){
            forgeImmortalsItem = item as ForgeImmortalsItem;
            data = forgeImmortalsItem.getData();
            if(CacheManager.forgeImmortals.isSubTypePosCanUp(data.roleIndex,data.subType, ForgeImmortalsCache.SUB_TYPE_POS_CAN_UP2)){
                GuideTargetManager.reg(GuideTargetName.ForgeImmortalsPanelForgeImmortalsItemAct, item);
                break;
            }
        }
        for(let item of this.listWeapon.list._children){
            forgeImmortalsItem = item as ForgeImmortalsItem;
            data = forgeImmortalsItem.getData();
            if(CacheManager.forgeImmortals.isSubTypePosCanUp(data.roleIndex,data.subType, ForgeImmortalsCache.SUB_TYPE_POS_CAN_UP1)){
                GuideTargetManager.reg(GuideTargetName.ForgeImmortalsPanelForgeImmortalsItemUp, item);
                break;
            }
        }
    }

    public get fight(): number {
        return this._fight;
    }

    private getRoleInfos(): any[] {
        if (!this.roleWeaponInfoDict) {
            this.roleWeaponInfoDict = {};
        }
        if (this._roleIndex != null) {
            if (!this.roleWeaponInfoDict[this._roleIndex]) {
                let infos: any[] = [];
                for (let i: number = 0; i < this.weapons.length; i++) {
                    infos.push({ roleIndex: this._roleIndex, subType: this.weapons[i] });
                }
                this.roleWeaponInfoDict[this._roleIndex] = infos;
            }

        }
        return this.roleWeaponInfoDict[this._roleIndex];
    }

    protected onGUIBtnClick(e: egret.TouchEvent): void {
        var btn: any = e.target;
        switch (btn) {
            case this.btnRight:
                this.listWeapon.changPage(true);
                //this.changePage(1);
                break;
            case this.btnLeft:
                //this.changePage(-1);
                this.listWeapon.changPage(false);
                break;
        }
    }
    /*
    private changePage(dir: number): void {
        let total: number = this.listWeapon.data.length - 1;
        let idx: number = this.listWeapon.list.getFirstChildInView();
        idx += dir * this.pageSize;
        idx = Math.min(idx, total);
        idx = Math.max(idx, 0);
        this.listWeapon.scrollToView(idx,false,true);
        //this.handlerBtnShow();
    }
    */
    private onWeaponScrollEnd(e: any): void {
        //this.handlerBtnShow();
    }
    private handlerBtnShow(status:number): void {       
        let isMid:boolean = status==List.SCROLL_MIDDLE;
        this.btnLeft.visible = status==List.SCROLL_LEFT || isMid; 
        this.btnRight.visible = status==List.SCROLL_RIGHT || isMid;
        this.checkLeftRightTips();
    }

    private checkLeftRightTips():void{
        let idx: number = this.listWeapon.list.getFirstChildInView();
        if(this.btnRight.visible){
            CommonUtils.setBtnTips(this.btnRight,this.checkPageTip(idx+this.pageSize,this.listWeapon.data.length),0,0);		
        }
        if(this.btnLeft.visible){
            CommonUtils.setBtnTips(this.btnLeft,this.checkPageTip(idx-this.pageSize,idx));	
        }
    }

    private checkPageTip(startIdx:number,endIdx:number):boolean{
        let isTip:boolean = false;
        startIdx = Math.max(startIdx,0);
        endIdx = Math.min(endIdx,this.listWeapon.data.length);
        for(let i:number = startIdx;i<endIdx;i++){
            let data:any = this.listWeapon.data[i];
            if(data && CacheManager.forgeImmortals.checkSubTypeTips(data.roleIndex,data.subType)){
                isTip = true;
                break;
            }
        }
        return isTip;
    }

    private onClickWeapon(e: fairygui.ItemEvent): void {
        let item: ForgeImmortalsItem = <ForgeImmortalsItem>e.itemObject;
        HomeUtil.open(ModuleEnum.ForgeImmortals, false, item.getData());
    }

    /**
	 * 销毁函数
	 */
    public destroy(): void {
        super.destroy();
    }

}