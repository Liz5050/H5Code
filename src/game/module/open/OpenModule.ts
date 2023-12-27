/**
 * 功能开启
 */
class OpenModule extends BaseWindow {
    private c1:fairygui.Controller;
    private bg1Loader: GLoader;
    private bg2Loader: GLoader;
    private loaderIco: GLoader;
    // private haloLoader: GLoader;
    private stageLoader: GLoader;
    private nameLoader: GLoader;
    private descLoader: GLoader;
    private mcStage: UIMovieClip;

    private modelContainer: ModelContainer;
    private modelBody: egret.DisplayObjectContainer;
    private iconLoader: GLoader;

    private cfg: any;
    private nameImg: string;
    private descImg: string;
    private modelId: number;
    private shape: EShape;
    private shapeNameDict: any;
    private timeout: number = 5000;
    /**飘到的目标图标 */
    private icoName:string;
    private openFlyKey:string;
    private mcTitle:MovieClip;

    public constructor(moduleId: ModuleEnum) {
        super(PackNameEnum.Open, "Main", moduleId,LayerManager.UI_Tips);
        this.isShowCloseObj = true;
        this.shapeNameDict = {
            "1": "mount",
            "2": "pet",
            "4": "wing",
            "5": "law",
            "9": "battle",   
            "10":"swordpool"
        }
    }

    public initOptUI(): void {
        this.c1 = this.getController("c1");
        this.bg1Loader = this.getGObject("loader_bg1") as GLoader;
        this.bg2Loader = this.getGObject("loader_bg2") as GLoader;
        // this.haloLoader = this.getGObject("loader_halo") as GLoader;
        this.stageLoader = this.getGObject("loader_stage") as GLoader;
        this.nameLoader = this.getGObject("loader_name") as GLoader;
        this.descLoader = this.getGObject("loader_desc") as GLoader;
        this.loaderIco = this.getGObject("loader_ico") as GLoader;

        this.modelContainer = new ModelContainer(this.getGObject("model_container").asCom, EShape.EShapePet);
        this.mcStage = UIMovieManager.get(PackNameEnum.MCStage, -350, -160);
        this.modelContainer.addChildAt(this.mcStage, 0);
        this.modelContainer.isShapeChangeMc = true;

        this.bg1Loader.load(URLManager.getModuleImgUrl("bg1.png", PackNameEnum.Open));
        this.bg2Loader.load(URLManager.getModuleImgUrl("bg2.png", PackNameEnum.Open));
        // this.haloLoader.load(URLManager.getModuleImgUrl("halo.png", PackNameEnum.Open));
        this.stageLoader.load(URLManager.getModuleImgUrl("bg_stage.png", PackNameEnum.Open));
    }

    public updateAll(data: any = null): void {
        this.cfg = data;
        if(data && data.isTitle){
            this.c1.setSelectedIndex(1);
            let cfg:any = data.cfg;
            this.modelContainer.setBodyVisible(true);
            this.modelContainer.updateModel(Number(cfg.icon), EShape.EShapeTitle);
            this.modelContainer.updatePosition(-10, 30);
            this.modelContainer.updateScale(1.5,1.5);
            return;
        }

        this.modelContainer.updateScale(1,1);
        this.c1.setSelectedIndex(0);        
        this.icoName = "";      
        this.openFlyKey = "";  
        this.shape = null;
        if (this.cfg != null && this.cfg.showModel != null) {                     

            let data: Array<string> = this.cfg.showModel.split("#");
            this.nameImg = data[0];
            this.descImg = data[1];
            this.modelId = Number(data[2]);
            let urlDesc:string = URLManager.getModuleImgUrl(`${this.descImg}.png`, PackNameEnum.Open);
            let urlName:string = URLManager.getModuleImgUrl(`${this.nameImg}.png`, PackNameEnum.Open);

            let toY: number = 0;
            if (this.nameImg.indexOf("pet") != -1) {
                this.shape = EShape.EShapePet;
                toY = 0;
            } else if (this.nameImg.indexOf("mount") != -1) {
                this.shape = EShape.EShapeMount;
                toY = 0;
            } else if (this.nameImg.indexOf("wing") != -1) {
                this.shape = EShape.EShapeWing;
                toY = 0;
            } else if (this.nameImg.indexOf("law") != -1) {
                this.shape = EShape.EShapeLaw;
                toY = 130;
            } else if (this.nameImg.indexOf("battle") != -1) {
                this.shape = EShape.EShapeBattle;
                toY = 65;
            } else if (this.nameImg.indexOf("swordpool") != -1) {
                this.shape = EShape.EShapeSwordPool;
                toY = 30;
            }else{
                this.icoName = this.nameImg.split("_")[0];
            }
            let cfgFunc:any = ConfigManager.mgOpen.getOpenFuncByKey(this.cfg.openId);
            if(this.modelId>0){ //有动态模型
                if(this.shape==null && cfgFunc.shapeType!=null){
                    let shapeType:string = cfgFunc.shapeType;
                    this.shape = EShape[shapeType];
                    toY = this.getShapePosY(this.shape);
                    this.openFlyKey = cfgFunc.openFlyKey; 
                }
                this.loaderIco.visible = false;
                this.modelContainer.setBodyVisible(true);
                this.modelContainer.updateModel(this.modelId, this.shape);
                this.modelContainer.updatePosition(0, toY);
            }else{
                //功能开启预告 加载静态图片                                                            
                this.openFlyKey = cfgFunc.openFlyKey;
                let info:any = GuideOpenUtils.getGuideInfo(cfgFunc,true);                
                this.loaderIco.visible = true;
                this.loaderIco.load(info.urlModel);
                this.modelContainer.setBodyVisible(false);
            }            
            this.nameLoader.load(urlName);
            if(this.descImg=="0"){
                this.descLoader.clear();
            }else{
                this.descLoader.load(urlDesc);
            }            
            
        }
        App.TimerManager.doDelay(this.timeout, this.doTimeout, this);
    }

    private getShapePosY(shape:number):number{ //新增大部分y坐标都是100
        let py:number = 0;
        switch(shape){
            case EShape.EDragonScale:                
                break;            
            default:
                py = 10;
        }
        return py; 
    }

    public isShowingData(cfg:any):boolean{
        return cfg.openId==this.cfg.openId;
    }
    protected onCloseHandler():void{
        super.onCloseHandler();
        if(this.cfg.isTitle && this.cfg.cfg){
            EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.FashionII,{tabType:PanelTabType.FashionTitle,titleCode:this.cfg.cfg.code});//ViewIndex.Two
        }
        
    }
    public onHide(data: any = null): void {
        super.onHide(data);        
        if(!this.cfg.isTitle){
            this.moveToShapeButton();
        }        
    }

    private moveToShapeButton(): void {
        if (this.iconLoader == null) {
            this.iconLoader = new GLoader();
            this.iconLoader.setSize(84, 104);
            this.iconLoader.setPivot(0.5, 0.5, true);
        }
        this.iconLoader.x = fairygui.GRoot.inst.width / 2;
        this.iconLoader.y = fairygui.GRoot.inst.height / 2;

        let icoBtnName:string = this.icoName?this.icoName:this.shapeNameDict[this.shape];
        if(!icoBtnName){
            return;
        }
        
        let mKey:string = this.openFlyKey?this.openFlyKey:"Shape";
        let isName:boolean = false;
        let cfgFunc:any = ConfigManager.mgOpen.getOpenFuncByKey(this.cfg.openId);
        let btnId:any = ModuleEnum[mKey];
        if(!ModuleEnum[mKey]){
            isName = true;
            btnId = mKey;
        }
        
        let shapeBtnPos: egret.Point = ControllerManager.home.getHomeBtnGlobalPos(btnId, isName, true,true);
        if (shapeBtnPos != null) {
            //有目标位置才显示飘的图标
            this.iconLoader.load(URLManager.getModuleImgUrl(icoBtnName + ".png", PackNameEnum.Open));
            LayerManager.UI_Tips.addChild(this.iconLoader);
            egret.Tween.removeTweens(this.iconLoader);

            let toX: number = shapeBtnPos.x + 50;
            let toY: number = shapeBtnPos.y + 50;
            egret.Tween.get(this.iconLoader).to({x: toX, y: toY}, 1000).call(() => {
                this.iconLoader.removeFromParent();
                App.TimerManager.remove(this.doTimeout, this);
                this.doActiveShape();
                EventManager.dispatch(LocalEventEnum.OpenCheckNext);
                if(this.cfg.openId==1){                    
                    EventManager.dispatch(LocalEventEnum.HomeHejiOpenEffect);                    
                }
            }, this);
        }
        this.doAfterClose();
    }

    private doTimeout(): void {
        EventManager.dispatch(UIEventEnum.ModuleClose, ModuleEnum.Open);
        this.moveToShapeButton();
    }

    /**
     * 关闭时激活外观
     */
    private doActiveShape(): void {
        if (this.shape != null) {
            if (this.shape == EShape.EShapeBattle || this.shape == EShape.EShapeSwordPool) {
                ProxyManager.shape.shapeActivate(this.shape);
            }
        }
    }

    private doAfterClose(): void {
        if (this.shape == EShape.EShapePet || this.shape == EShape.EShapeMount || this.shape == EShape.EShapeWing) {
            EventManager.dispatch(LocalEventEnum.CopyReqExit);
        }
    }
}