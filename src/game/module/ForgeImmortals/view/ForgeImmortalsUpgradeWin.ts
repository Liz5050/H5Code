/**
 * 神兵物品升级
 * @author zhh
 * @time 2018-08-20 14:38:40
 */
class ForgeImmortalsUpgradeWin extends BaseWindow {
    private c1: fairygui.Controller;
    private loaderBg: GLoader;
    private loaderIco: GLoader;
    private imgLock: fairygui.GImage;
    private imgMax: fairygui.GImage;
    private txtItemName: fairygui.GTextField;
    private btnAct: fairygui.GButton;
    private curAttrView: ForgeImmAttrBaseView;
    private circleView: ForgeImmortalsCircleView;
    private attrComDict: any;
    private _data: any;
    private eff_mc: fairygui.GComponent;
    private breakMc: UIMovieClip;

    /**是否在线打开状态下刷新 */
    private _isOnlineUpdate: boolean = true;
    private _isInMotion:boolean = false;

    public constructor() {
        super(PackNameEnum.ForgeImmortals, "ForgeImmortalsUpgradeWin", ModuleEnum.ForgeImmUpgrade);

    }

    public initOptUI(): void {
        //---- script make start ----
        this.c1 = this.getController("c1");
        this.loaderBg = <GLoader>this.getGObject("loader_bg");
        this.loaderIco = <GLoader>this.getGObject("loader_ico");
        this.imgLock = this.getGObject("img_lock").asImage;
        this.imgMax = this.getGObject("img_max").asImage;
        this.txtItemName = this.getGObject("txt_item_name").asTextField;
        this.eff_mc = this.getGObject("eff_mc").asCom;
        this.btnAct = this.getGObject("btn_act").asButton;
        this.circleView = new ForgeImmortalsCircleView(this.getGObject("circle_com").asCom);
        this.btnAct.addClickListener(this.onGUIBtnClick, this);
        //---- script make end ----
        this.loaderBg.load(URLManager.getModuleImgUrl("immortals_bg.jpg", PackNameEnum.Forge));
        this.circleView.setMotionCall(this.playEff,this);

        GuideTargetManager.reg(GuideTargetName.ForgeImmortalsUpgradeWinActBtn, this.btnAct);
        // GuideTargetManager.reg(GuideTargetName.ForgeImmortalsUpgradeWinUpgradeBtn, this.btnAct);
    }

    public updateAll(data?: any): void {
        if(this._isInMotion){
            return;
        }
        this._data = data;
        let info: any = data.info;
        let itemCode: any = info.itemCode;
        let idx: number = 0;
        let lv: number = CacheManager.forgeImmortals.getImmortalLevel(data.roleIndex, info.position);
        if (!CacheManager.forgeImmortals.isPosAct(data.roleIndex, info.position)) {
            idx = 0;
        } else if (lv % ForgeImmortalsCache.BREAK_LV == 0) {
            idx = 2;
        } else {
            idx = 1;
        }

        this.c1.setSelectedIndex(idx);
        //this.titleIcon = "immortl_" + idx;
        this.btnAct.text = LangForge.L1[idx];
        this.title = LangForge.L1[idx];
        this.curAttrView = this.getAttrCom(idx);
        this.curAttrView.updateAll(data);
        this._isInMotion = this._data.isOnline && CacheManager.forgeImmortals.isBreakLv(lv); //在线升级突破
        delete this._data["isOnline"];        
        if (idx != 0) {
            let param:any = {};
            ObjectUtil.mergeObj(param,data,false);
            param.isOnlineMotion = this._isInMotion;
            this.circleView.updateAll(param);
        }
        let itemData: ItemData = new ItemData(data.info.itemCode);
        this.txtItemName.text = itemData.getName();
        this.loaderIco.load(itemData.getIconRes());
        this.imgMax.visible = this.curAttrView.isMax;
        this.btnAct.visible = !this.curAttrView.isMax;      
    }

    public playEff(): void {
        let info: any = this._data.info;
        let lv: number = CacheManager.forgeImmortals.getImmortalLevel(this._data.roleIndex, info.position);
        let isPlay: boolean = this._isOnlineUpdate && CacheManager.forgeImmortals.isBreakLv(lv);
        if (isPlay) {
            if (!this.breakMc) {
                this.breakMc = UIMovieManager.get(PackNameEnum.MCBreak);
            }
            this.eff_mc.addChild(this.breakMc);
            this.breakMc.playing = true;
            this.breakMc.setPlaySettings(0,-1, 1, -1, this.delEffMc, this);
        } else {
            // this.delEffMc();
        }

    }
    private delEffMc(): void {        
        if (this.breakMc) {
            egret.Tween.removeTweens(this.breakMc);
            egret.Tween.get(this.breakMc).to({ alpha: 0 }, 2000).call(() => {
                this._isInMotion = false;
                if (this.breakMc != null) {
                    this.breakMc.destroy();
                    this.breakMc = null;
                }
            }, this);
        }
    }
    public getData(): any {
        return this._data;
    }
    private getAttrCom(idx: number): ForgeImmAttrBaseView {
        if (!this.attrComDict) {
            this.attrComDict = {};
        }
        if (!this.attrComDict[idx]) {
            let key: string = "attr_com" + idx;
            switch (idx) {
                case 0:
                    this.attrComDict[idx] = new ForgeImmAttrBaseView(this.getGObject(key).asCom);
                    break;
                case 1:
                    this.attrComDict[idx] = new ForgeImmAttrSmeltView(this.getGObject(key).asCom);
                    break;
                case 2:
                    this.attrComDict[idx] = new ForgeImmAttrBreakView(this.getGObject(key).asCom);
                    break;
            }
        }

        return this.attrComDict[idx];
    }

    protected onGUIBtnClick(e: egret.TouchEvent): void {
        var btn: any = e.target;
        switch (btn) {
            case this.btnAct:
                this.handlerUpgrade();
                break;

        }
    }
    private handlerUpgrade():void{
        if(this._isInMotion){
            return;
        }
        let now:number = egret.getTimer();
        if(ForgeImmortalsCache.POS_UP_CD>now){
            return;
        }
        if (this.curAttrView.isItemOk) {
            let lv: number = CacheManager.forgeImmortals.getImmortalLevel(this._data.roleIndex, this._data.info.position);
            ProxyManager.cultivate.cultivateActive(ECultivateType.ECultivateTypeImmortals, this._data.info.position, lv + 1, this._data.roleIndex);
            ForgeImmortalsCache.POS_UP_CD = now+3000; //3秒点击cd 服务器返回后自动清楚cd
        } else {
            let costItem: ItemData = this.curAttrView.getCostItem();
            if (costItem) {
                EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.PropGet, { "itemCode": costItem.getCode() });
            }
            Tip.showLeftTip(LangForge.L4);
        }
    }
    public hide(param: any = null, callBack: CallBack = null): void {
        super.hide(param, callBack);
        this._isOnlineUpdate = false;
        this._isInMotion = false;
    }
    public onShow(param: any = null): void {
		super.onShow(param);
        this._isOnlineUpdate = true;
    }
}