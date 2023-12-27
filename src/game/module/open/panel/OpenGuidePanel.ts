/**
 * 功能开启指引台
 * @author zhh
 * @time 2018-06-13 15:54:41
 */
class OpenGuidePanel extends BaseContentView {
    private loaderModel:GLoader;
    private loaderName:GLoader;
    private txtDesc:fairygui.GTextField;
    private txtProcess:fairygui.GRichTextField;
    private _data:any;
    private c1:fairygui.Controller;
    private cnt:fairygui.GComponent;
    private modeShow:ModelShow;
    private _isShow2: boolean;

	public constructor(par:fairygui.GComponent) {
		super(PackNameEnum.GuildePanel,"GuidePanel",null,par);
	}
	public initOptUI():void{
        //---- script make start ----
        this.c1 = this.getController("c1");
        this.loaderModel = <GLoader>this.getGObject("loader_model");
        this.loaderName = <GLoader>this.getGObject("loader_name");
        this.txtDesc = this.getGObject("txt_desc").asTextField;
        this.txtProcess = this.getGObject("txt_process").asRichTextField;
        this.cnt = this.getGObject("cnt").asCom;
        //---- script make end ----
        this.addClickListener(this.onClickSelf,this);

        this.loaderModel.touchable = false;
	}

	public updateAll(data?:any):void{
        this._data = data;
        let info:any = GuideOpenUtils.getGuideInfo(data,false);
        if(this.showModel(this._data)){
            this.loaderModel.clear();
        }else{
            this.loaderModel.load(info.urlModel); 
        }        
        this.loaderName.load(info.urlName);        		
        info.desc1?this.txtProcess.text = info.desc1:null;
        this.txtDesc.text = this._data.openContentNarrow;

        this.loaderModel.x = 7; 
        this.loaderModel.y = 31;
        if(this._data.openId==92){
            this.loaderModel.x = -12; 
            this.loaderModel.y = 16;
        }

	}

    public goTween(isShow:boolean): void {
		if(this._isShow2 == isShow) return;
		this._isShow2 = isShow;
		let _posX: number;
		if (this._isShow2) {
			_posX = 0;
		} 
		else {
			_posX = -this.width;
		}
		egret.Tween.removeTweens(this);
		egret.Tween.get(this).to({ x: _posX }, 400, egret.Ease.backInOut);
	}

    private showModel(cfg:any):boolean{
        //cfg t_mg_open_function的配置
        let flag:boolean = false;
        let idx:number = 0;
        /*        
        let testInfo:any = ConfigManager.client.getTestGuide();
        cfg.shapeType = testInfo.shape; 
        cfg.modelId = testInfo.id;
        let s:number = testInfo.s1;
        */

        if(cfg.shapeType){
            this.cnt.visible = true;
            let shapeType:string = cfg.shapeType;
            let idxName:string = this.c1.getPageIdByName(shapeType);
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
            let scale:number = cfg.modelScale!=null?cfg.modelScale/100:1;
            this.modeShow.scaleX = this.modeShow.scaleY = scale;
            flag = true;
        }else{
            this.cnt.visible = false;            
        }
        this.c1.setSelectedIndex(idx);
        return flag;
    }

    /**判断当前功能是否开启 */
    public checkCurOk():boolean{
        let cfg:any = ConfigManager.mgOpen.getByPk(this._data.openId);
        return ConfigManager.mgOpen.isOpenedByKey(cfg.openKey,false);
    }   
    public get curData():any{
        return this._data;
    }
    /**是否显示激活界面 */
    public isCurShowAct():boolean{
        return this._data && this._data.showAct;
    }

    private onClickSelf(e:any):void{
        let data:any = this._data.openData?this._data.openData:this._data;
        EventManager.dispatch(LocalEventEnum.OpenShowDetailPanel,data);

    }

}