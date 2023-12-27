/**
 * 勋章UI界面
 * @author zhh
 * @time 2018-07-27 14:40:39
 */
class TrainMedalPanel extends BaseTabView{
    private loaderIco:GLoader;
    private txtStage:fairygui.GTextField;
    private txtNameCur:fairygui.GTextField;
    private txtNameNext:fairygui.GTextField;
    private txtAttrCur:fairygui.GRichTextField;
    private txtAttrNext:fairygui.GRichTextField;
    private btnUpgrade:fairygui.GButton;
    private listStar:List;
    private listItem:List;
    private mcSuccess:UIMovieClip;
    private mcUpStar:UIMovieClip;
    private strengthType:number; //强化类型
    private curStrengthInfo:any; //当前强化信息配置
    private c1:fairygui.Controller;
    private modelContainer:fairygui.GComponent;

	public constructor() {
		super();
	}

	protected initOptUI():void{
        //---- script make start ----
        this.c1 = this.getController("c1");
        this.loaderIco = <GLoader>this.getGObject("loader_ico");
        this.txtStage = this.getGObject("txt_stage").asTextField;
        this.txtNameCur = this.getGObject("txt_name_cur").asTextField;
        this.txtNameNext = this.getGObject("txt_name_next").asTextField;
        this.txtAttrCur = this.getGObject("txt_attr_cur").asRichTextField;
        this.txtAttrNext = this.getGObject("txt_attr_next").asRichTextField;
        this.btnUpgrade = this.getGObject("btn_upgrade").asButton;
        this.modelContainer = this.getGObject("model_container").asCom;
        this.listStar = new List(this.getGObject("list_star").asList);
        this.listItem = new List(this.getGObject("list_item").asList);

        this.btnUpgrade.addClickListener(this.onGUIBtnClick, this);
        this.listItem.list.addEventListener(fairygui.ItemEvent.CLICK,this.onGUIListSelect,this);
        //---- script make end ----
        this.strengthType = EStrengthenExType.EStrengthenExTypeMedal;        
        
	}

	public updateAll(data?:any):void{        
        let curLv:number =  CacheManager.medal.curLevel;
        let isStarUp:boolean = false;
        let isStageUp:boolean = false;
        let oldInfo:any = this.curStrengthInfo; 
        this.curStrengthInfo = ConfigManager.mgStrengthenEx.getByTypeAndLevel(this.strengthType,curLv);
        this.updateStarList();        
        let curStage:number = ObjectUtil.getConfigVal(this.curStrengthInfo,"stage");
        let curStar:number = ObjectUtil.getConfigVal(this.curStrengthInfo,"star");
        if(oldInfo){
            let oldStage:number = ObjectUtil.getConfigVal(oldInfo,"stage");
            let oldStar:number = ObjectUtil.getConfigVal(oldInfo,"star");
            isStageUp = curStage > oldStage;
            isStarUp = curStar > oldStar;
        }
        this.txtStage.text =  FuiUtil.getStageStr(curStage)+"阶";//App.StringUtils.substitude(LangTrain.L1,CommonUtils.getNumName(curStage));
        this.loaderIco.load(ConfigManager.medal.getStageIcoUrl(curStage));
        let nextInfo:any =  ConfigManager.mgStrengthenEx.getByTypeAndLevel(this.strengthType,curLv+1);
        let idx:number = 0;
        if(!nextInfo){ //满阶了
            nextInfo = this.curStrengthInfo;
            idx = 1;
        }else{
            let curAttrStr:string = WeaponUtil.getAttrText(WeaponUtil.getAttrArray(this.curStrengthInfo.attrList),false,null,null,true,false);
            this.txtAttrCur.text = curAttrStr;
        }
        let nextAttrStr:string = WeaponUtil.getAttrText(WeaponUtil.getAttrArray(nextInfo.attrList),true,Color.Color_6,Color.Color_6,true,false);
        this.txtAttrNext.text = nextAttrStr; 
        let starStr:string = this.curStrengthInfo.star ? this.curStrengthInfo.star + "星" : "";
        this.txtNameCur.text = this.curStrengthInfo.showName + starStr;
        starStr = nextInfo.star ? nextInfo.star + "星" : "";
        this.txtNameNext.text = nextInfo.showName + starStr;
        this.c1.setSelectedIndex(idx);
        this.listItem.setVirtual(CacheManager.medal.upgradeStrenthenTypes);
        if(isStageUp){
            this.playSuccessMc();
        }
        if(isStarUp){
            this.playStarMc(curStar);
        }
        
	}

    private updateStarList():void{
        let curStar:number = ObjectUtil.getConfigVal(this.curStrengthInfo,"star");
        let maxStar:number = 10;
        let starInfos:any[] = [];
        for(let i:number = 0;i<maxStar;i++){
            starInfos.push(i<curStar);
        }
        this.listStar.setVirtual(starInfos);
        
    }

    /**
	 * 播放成功特效
	 */
	private playSuccessMc(): void {
		if (this.mcSuccess == null) {
			this.mcSuccess = UIMovieManager.get(PackNameEnum.MCSuccessAdd);
		}
		this.mcSuccess.x = 104;
		this.mcSuccess.y = 20;
        this.mcSuccess.playing = true;
        this.mcSuccess.frame = 0;
		this.modelContainer.addChild(this.mcSuccess);
		this.mcSuccess.alpha = 1;
		egret.Tween.removeTweens(this.mcSuccess);
		this.mcSuccess.setPlaySettings(0, -1, 1, -1, function (): void {
			egret.Tween.get(this.mcSuccess).to({ alpha: 0 }, 2000).call(() => {
				UIMovieManager.push(this.mcSuccess);
				this.mcSuccess = null;
			})
		}, this);
		
	}

	/**升星 */
    
	private playStarMc(star:number): void {
		if (this.mcUpStar == null) {
			this.mcUpStar = UIMovieManager.get(PackNameEnum.MCStar);
			this.mcUpStar.x = -232;
			this.mcUpStar.y = -232;
		}
        this.mcUpStar.frame = 0;
        this.mcUpStar.playing = true;
		let index: number;
		if (star == 0) {
			index = 9;
		} else {
			index = star - 1;
		}
		let starItem: StarItem = <StarItem>this.listStar.list.getChildAt(index);
		starItem.addChild(this.mcUpStar);
		this.mcUpStar.setPlaySettings(0, -1, 1, -1, function (): void {
			UIMovieManager.push(this.mcUpStar);
			this.mcUpStar = null;
		}, this);
		
	}
    
    protected onGUIBtnClick(e:egret.TouchEvent):void{
        var btn: any = e.target;
        switch (btn) {
            case this.btnUpgrade:
                if(CacheManager.medal.isCanUpgrade(true)){
                    App.SoundManager.playEffect(SoundName.Effect_SkillUpgrade);
                    EventManager.dispatch(LocalEventEnum.PlayerStrengthExUpgrade,EStrengthenExType.EStrengthenExTypeMedal, -1);
                }             
                break;

        }
    }
    protected onGUIListSelect(e:fairygui.ItemEvent):void{
        var item:ListRenderer = <ListRenderer>e.itemObject;
        if(item){
            let type:number = Number(item.getData());
            let openInfo:any[] = ConfigManager.medal.getTypeOpenInfo(type);
            HomeUtil.open(openInfo[0],false,{tabType:openInfo[1]},ViewIndex.Two);
        }
               
    }
 
	
    /**
	 * 销毁函数
	 */
	public destroy():void{
		super.destroy();
	}

}