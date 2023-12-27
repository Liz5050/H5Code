/**
 * 通用激活界面
 * @author zhh
 * @time 2018-06-14 11:19:01
 */
class ActivationPanel extends BaseWindow {
    private bgLoader: GLoader;
    private frameLoader: GLoader;
    private frameLoader2: GLoader;
    private frameLoader3: GLoader;
    private titleLoader: GLoader;
    private loaderModel: GLoader;
    private loaderName: GLoader;
    private nameTxt: fairygui.GTextField;
    private nameCom: fairygui.GComponent;
    private modelCom: fairygui.GComponent;
    /**模型展示 */
    private modelContainer: fairygui.GComponent;
    private modelBody: egret.DisplayObjectContainer;
    private model: ModelShow;
    private successMc: UIMovieClip;
    private lightMc: UIMovieClip;
    private _data: any;
    private textName: fairygui.GTextField;
    private textFight : fairygui.GTextField;
    private c1 : fairygui.Controller;
    private mc : UIMovieClip;
    private effectSlot : fairygui.GComponent;
    private mcStage: UIMovieClip;
    private isIllu : boolean;


    public constructor() {
        super(PackNameEnum.Activation, "ActivationPanel", ModuleEnum.Activation, LayerManager.UI_Main);
        this.modal = true;
        this.isPopup = true;
        this.isCenter = true;
        this.isCloseOnClick = true;
        this.modalAlpha = 0.9;
        this.isAnimateShow = false;
        this.isIllu = false;
    }

    public initOptUI(): void {
        this.nameCom = this.getGObject("com_name").asCom;
        this.modelCom = this.getGObject("com_model").asCom;
        this.bgLoader = <GLoader>this.getGObject("loader_bg");
        this.titleLoader = <GLoader>this.getGObject("loader_title");
        this.frameLoader = <GLoader>this.modelCom.getChild("loader_frame");
        this.frameLoader2 = <GLoader>this.modelCom.getChild("loader_frame2");
        this.effectSlot = this.modelCom.getChild("effectSlot").asCom;
        this.frameLoader3 = <GLoader>this.modelCom.getChild("loader_frame3");
        this.loaderModel = <GLoader>this.modelCom.getChild("loader_model");
        this.loaderName = <GLoader>this.nameCom.getChild("loader_name");
        this.textName = this.modelCom.getChild("txt_name").asTextField;
        this.textFight = this.modelCom.getChild("txt_fight").asTextField;
        this.c1 = this.modelCom.getController("c1");
        this.nameTxt = this.nameCom.getChild("txt_name").asTextField;

        this.modelContainer = this.modelCom.getChild("model_container").asCom;
        this.model = new ModelShow(EShape.EShapeWing);
        this.modelBody = ObjectPool.pop("egret.DisplayObjectContainer");
        this.modelBody.addChild(this.model);
        // this.modelBody.x = 280;
        this.modelBody.y = 50;
        (this.modelContainer.displayObject as egret.DisplayObjectContainer).addChild(this.modelBody);

        this.bgLoader.load(URLManager.getModuleImgUrl("bg.png", PackNameEnum.Activation));
        this.titleLoader.load(URLManager.getModuleImgUrl("title.png", PackNameEnum.Activation));
    }

    public updateAll(data?: any): void {
        this.isIllu = false;
        this._data = data;
        this.loaderName.clear();
        this.loaderModel.clear();
        this.frameLoader.clear();
        this.nameTxt.text = "";
        this.model.setData(0);
        if (data.urlName) {
            this.loaderName.load(data.urlName);
        }

        if (data.urlModel) {
            this.loaderModel.load(data.urlModel);
        }

        if (data.urlFrame) {
            this.frameLoader.load(data.urlFrame);
        }
        if(data.urlFrame2) {
            this.frameLoader2.load(data.urlFrame2);
            this.isIllu = true;
            this.frameLoader2.visible = true;
            //this.addEffect();
        }


        if(data.urlFrame3) {
            this.frameLoader3.load(data.urlFrame3);
        }
        if(data.nameColor) {
            this.textName.color = data.nameColor;
        }

        if (data.name) {
            this.nameTxt.text = data.name;
            this.textName.text = data.name;
        }
        if(data.fight) {
            this.textFight.text = data.fight;
            this.c1.setSelectedIndex(1);
        }
        else {
            this.c1.setSelectedIndex(0);
        }
        if (data.model) {
            if (data.modelType != null) {
                this.model.setShowType(data.modelType);
                if (data.modelType == EShape.EDragonScale) {
                    this.modelBody.y = 0;
                } else {

                    this.modelBody.y = 50;
                }
            }
            this.model.setData(data.model);
        } else {
            this.model.setShowType(EShape.EShapeWing);
        }
        this.model.visible = data.model != null;
        this.playTransition();
    }

    public onShow(data?: any): void {
        super.onShow(data);
        // this.playMc();
    }

    private playMc(): void {
        if (this.successMc == null) {
            this.successMc = UIMovieManager.get(PackNameEnum.MCActivation, 80, -185);
        }
        this.successMc.setPlaySettings(0, -1, 1, -1, function () {
            this.successMc.playing = false;
        }, this);
        this.successMc.playing = true;
        this.addChild(this.successMc);

        if (this.lightMc == null) {
            this.lightMc = UIMovieManager.get(PackNameEnum.MCLight, 92, 76);
        }
        this.addChild(this.lightMc);
        this.lightMc.setPlaySettings(0, -1, -1, -1);
        this.lightMc.playing = true;
    }

    public onHide(data?: any): void {
        super.onHide(data);
        // if (this.successMc != null) {
        //     this.successMc.removeFromParent();
        //     this.successMc.playing = false;
        // }
        // if (this.lightMc != null) {
        //     this.lightMc.removeFromParent();
        //     this.lightMc.playing = false;
        // }
        if (this._data.isOpenMedal) {
            HomeUtil.open(ModuleEnum.Train, false, { tabType: PanelTabType.TrainMedal });
        }
        this.removeEffect();
        this.removeStageEffect();
        EventManager.dispatch(UIEventEnum.TempCardCheckWinClose);
    }

    /**
     * 播放动画效果
     */
    private playTransition(): void {
        this.titleLoader.y = 26;
        this.bgLoader.y = 0;
        this.nameCom.setScale(0, 0);
        this.modelCom.setScale(0, 0);
        this.titleLoader.setScale(0,0);

        egret.Tween.get(this.bgLoader).to({ y: 150 }, 150).call(()=>{
            egret.Tween.get(this.bgLoader).to({ y: 115 }, 50).call(()=>{
                egret.Tween.get(this.titleLoader).to({ y: 66 }, 300);
                egret.Tween.get(this.titleLoader).to({ scaleX: 1, scaleY: 1  }, 300);
                egret.Tween.get(this.modelCom).to({ scaleX: 1, scaleY: 1 }, 300).call(()=>{
                   this.nameCom.setScale(1, 1);
                   if(this.isIllu) {
                        this.addEffect();
                   }
                })
                this.addStageEffect();
            },this);
            
        },this);
    }


    private addEffect () {
		if (this.mc == null){
			this.mc = UIMovieManager.get(PackNameEnum.MCIlltrainActive, -30, -7);
			this.mc.playing = true;
			this.mc.frame = 0;
		}
        this.effectSlot.addChild(this.mc);
	}

	private removeEffect() {
		if (this.mc) {
            UIMovieManager.push(this.mc);
            this.mc = null;
        }
	}

    private addStageEffect() {
        if (this.mcStage == null){
			this.mcStage = UIMovieManager.get(PackNameEnum.MCStage, -7, 227);
			this.mcStage.playing = true;
			this.mcStage.frame = 0;
		}
        this.addChild(this.mcStage);
    }

	private removeStageEffect() {
        if(this.mcStage) {
            UIMovieManager.push(this.mcStage);
            this.mcStage = null;
        }
    }

}