/**
 * 功能开启引导详情界面
 * @author zhh
 * @time 2018-06-13 17:31:37
 */
class OpenGuideDetailPanel extends BaseWindow {
    private c1:fairygui.Controller;
    private c2:fairygui.Controller;
    private loaderIcon:GLoader;
    private loaderBg:GLoader;
    private loaderName:GLoader;
    private txtDesc2:fairygui.GRichTextField;
    private txtDesc1:fairygui.GRichTextField;
    private _data:any;
    private cnt:fairygui.GComponent;
    private modeShow:ModelShow;

	public constructor() {
		super(PackNameEnum.OpenPanel,"OpenPanel");
        this.isCenter = true;
        this.modal = true;
        this.isPopup = true;
	}
	public initOptUI():void{
        //---- script make start ----
        this.c1 = this.getController("c1");
        this.c2 = this.getController("c2");
        this.loaderIcon = <GLoader>this.getGObject("loader_icon");
        this.loaderBg = <GLoader>this.getGObject("loader_bg");
        this.loaderName = <GLoader>this.getGObject("loader_name");
        this.txtDesc2 = this.getGObject("txt_desc2").asRichTextField;
        this.txtDesc1 = this.getGObject("txt_desc1").asRichTextField;    
        this.cnt = this.getGObject("cnt").asCom;     
        //---- script make end ----
        this.title = "功能预告";   
        this.loaderBg.load(URLManager.getModuleImgUrl("bg.png",PackNameEnum.OpenPanel));
	}

	public updateAll(data?:any):void{
        this._data = data;
        let info:any = GuideOpenUtils.getGuideInfo(data,true);        
        this.txtDesc1.text = this._data.openContent; 
        this.txtDesc2.text = info.desc1;        
        if(this.showModel(this._data)){
            this.loaderIcon.clear();
        }else{
            this.loaderIcon.load(info.urlModel);
        }
        
        this.loaderName.load(info.urlName);          
        this.c1.setSelectedIndex(0);   
        if(this._data.openId==92){
            this.c1.setSelectedIndex(1);   
        }
        
	}
    private showModel(cfg:any):boolean{
        //cfg t_mg_open_function的配置
        let flag:boolean = false;

        /*
        let testInfo:any = ConfigManager.client.getTestGuide();
        cfg.shapeType = testInfo.shape; 
        cfg.modelId = testInfo.id; 
        let s:number = testInfo.s2;
        */

        let idx:number = 0;
        if(cfg.shapeType){
            this.cnt.visible = true;
            let shapeType:string = cfg.shapeType;
            let idxName:string = this.c2.getPageIdByName(shapeType);
            if(idxName!=null){
               idx = Number(idxName);
            }
            let shape:number = EShape[shapeType];
            let modelId:number=cfg.modelId;
            if(!this.modeShow){
                this.modeShow = new ModelShow(shape);
            }
            this.cnt.displayListContainer.addChild(this.modeShow);
            this.modeShow.setShowType(shape);
            this.modeShow.setData(modelId);
            let scale:number = cfg.modelScale2!=null?cfg.modelScale2/100:1;
            this.modeShow.scaleX = this.modeShow.scaleY = scale;
            flag = true;
        }else{
            this.cnt.visible = false;            
        }
        this.c2.setSelectedIndex(idx);
        return flag;
    }
    private onClickCheckPoint(e:any):void{
        let isGodWp:boolean = this._data.type==EGuidePanel.GodWeapon;
        if(isGodWp){
            EventManager.dispatch(LocalEventEnum.EnterPointChallenge);
        }
        this.hide();
    }

}