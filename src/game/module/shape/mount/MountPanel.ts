/**
 * 坐骑
 */
class MountPanel extends ShapeBasePanel {

    public constructor() {
        super();
        this.eShape = EShape.EShapeMount;
    }

    public initOptUI(): void {
        super.initOptUI();
        GuideTargetManager.reg(GuideTargetName.MountPanelOnekeyBtn, this.onekeyBtn);
    }

    protected clickActiveBtn(): void {
        if(this.isOpen(true)) {
            ProxyManager.shape.shapeActivate(this.eShape, this.roleIndex);
        }
    }

    public updateModel(): void{
        let curModelId: number;
        if(this.curCfg){
            curModelId = this.curCfg.modelId;
        }else{
            let cfg: any = ConfigManager.mgShape.getByShapeAndLevel(this.eShape, 0);
            curModelId = cfg.modelId;
        }
        this.model.setData(curModelId);
        this.nameLoader.load(URLManager.getModuleImgUrl(curModelId + ".png", PackNameEnum.Mount));
    }

    /**
     * 更新道具
     */
    public updateProp(): void {
        super.updateProp();
        CommonUtils.setBtnTips(this.changeBtn, CacheManager.mountChange.checkTips(this.roleIndex));

        // this.updateLucky();
        // this.updateOneKeyBtn();
    }

    protected clickChangeBtn(): void{
        EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.MountChange, { "roleIndex": this.roleIndex });
        this.stopOneKey();
    }

    // private updateActiveText() : void {
    //     this.activeTxt.text = CacheManager.mount.getActiveStr(this.roleIndex);
    // }

     public getShapeCache() : ShapeBaseCache {
        return CacheManager.mount;
    }
}