/**
 * 秘境界面
 * @author zhh
 * @time 2018-09-03 16:19:34
 */
class SkillCheatsPanel extends BaseTabView{
 
    private _roleIndex: number = RoleIndexEnum.Role_index0;
    private loaderBg:GLoader;      
    private loaderIco:GLoader;      
    //private imgFail:fairygui.GImage;
    private btnEmbed:fairygui.GButton;
    private btnPath:fairygui.GButton;
    private btnReplace:fairygui.GButton;
    private btnPreview:fairygui.GButton;
    private btnAdd:fairygui.GButton;
    private txtFight:fairygui.GTextField;
    private smallImgs:fairygui.GImage[];
    private bigImgs:fairygui.GImage[];
    //private failAni:fairygui.Transition;
    private itemList:CheatsItem[];
    private curItem:ItemData;
    private isInAni:boolean = false;
    private effCnt:fairygui.GComponent;
    private redCnt:fairygui.GComponent;
    private btnEff:UIMovieClip;
    //private guideCom:fairygui.GComponent;
    //private arrowAni:fairygui.Transition;
    private cnt:fairygui.GComponent;
    private guideEff:UIMovieClip;

	public constructor() {
		super();
	}

	protected initOptUI():void{
        //---- script make start ----       
        //this.failAni = this.getTransition("t0");        
        this.loaderBg = <GLoader>this.getGObject("loader_bg");
        this.loaderIco = <GLoader>this.getGObject("loader_ico");
        this.effCnt = this.getGObject("eff_cnt").asCom;
        this.redCnt = this.getGObject("red_cnt").asCom;
        this.bigImgs = [];
        this.smallImgs = [];
        for(let i:number=0;i<SkillCheatsCache.TOTAL_POS;i++){
            this.bigImgs.push(this.getGObject(`img_big${i}`).asImage);
            let smallImg:fairygui.GImage = this.getGObject(`img_small${i}`).asImage;
            smallImg.visible = false;
            this.smallImgs.push(smallImg);
        }        
        //this.imgFail = this.getGObject("img_fail").asImage;
        //this.imgFail.visible = false;
        this.btnEmbed = this.getGObject("btn_embed").asButton;
        this.btnPath = this.getGObject("btn_path").asButton;
        this.btnReplace = this.getGObject("btn_replace").asButton;
        this.btnPreview = this.getGObject("btn_preview").asButton;
        this.btnAdd = this.getGObject("btn_add").asButton;
        let fightPanel:fairygui.GComponent = this.getGObject("fight_panel").asCom;
        this.txtFight = fightPanel.getChild("txt_fight").asTextField;

        this.cnt = this.getGObject("cnt").asCom;
        //this.guideCom = this.getGObject("guide_com").asCom;
        //this.arrowAni = this.guideCom.getTransition("t0");

        this.btnEmbed.addClickListener(this.onGUIBtnClick, this);
        this.btnReplace.addClickListener(this.onGUIBtnClick, this);
        this.btnPreview.addClickListener(this.onGUIBtnClick, this);
        this.btnAdd.addClickListener(this.onGUIBtnClick, this);
        this.btnPath.addClickListener(this.onGUIBtnClick, this);
        this.loaderIco.addClickListener(this.onGUIBtnClick, this);

        this.itemList = [];
        for(let i:number = 0;i<SkillCheatsCache.TOTAL_POS;i++){
            let item:CheatsItem = <CheatsItem>this.getGObject(`item${i}`);
            this.itemList.push(item);
            item.addClickListener(this.onClickItem,this);
        }        
        //---- script make end ----
        this.loaderBg.load(URLManager.getModuleImgUrl("cheats_bg.jpg",PackNameEnum.Skill));
        this.setArrowState(false);
	}
    
	public updateAll(data?:any):void{    
        if(this.isInAni){
            return;
        }
        this.updateItem();
        this.txtFight.text =""+CacheManager.cheats.getTotalFight(this._roleIndex);
        this.updateIco();
        CommonUtils.setBtnTips(this.redCnt,CacheManager.cheats.checkRoleTips(this._roleIndex),0,0,true);
        if(data && data.addItem){
            //this.addCheatEmbedItem(data.addItem,true);        
            this.setArrowState(true);    
        } 
	}
    /** */
    public addCheatEmbedItem(itemData:ItemData,isFromPack:boolean=false):void{
        this.curItem = itemData;
        this.updateIco();
        if(this.curItem){
            this.handlerBtnEff(true);
        }
        this.setArrowState(isFromPack);
    }

    private handlerBtnEff(isAdd:boolean):void{
        App.DisplayUtils.addBtnEffect(this.btnEmbed,isAdd);
        /*
        if(isAdd){
            if(!this.btnEff){
                this.btnEff = UIMovieManager.get(PackNameEnum.MCOneKey);
            }
            this.btnEff.frame = 0;
            this.btnEff.playing = true;
            this.effCnt.addChild(this.btnEff);
        }else{
            if(this.btnEff){
                this.btnEff.destroy();
                this.btnEff = null;
            }
        }
        */
    }

    private setArrowState(isShow:boolean):void{
        this.cnt.visible = isShow;
        if(isShow){
            if(!this.guideEff){
                this.guideEff = UIMovieManager.get(PackNameEnum.MCGuideClick);
            }
            this.cnt.addChild(this.guideEff);
            this.guideEff.playing = true;
            this.guideEff.frame = 0;
            this.guideEff.x = 0;
            this.guideEff.y = 0;
        }else{
            if(this.guideEff){
                this.guideEff.removeFromParent();
                this.guideEff = null;
            }
        }
        
    }

    /**
     * 镶嵌结构返回更新
     * S2C_SMosaicCheatsRet
     */
    public updateByEmbed(data:any):void{
        // data.retCode  0成功 -1失败
        this.isInAni = true;
        let isSuccess:boolean = data.retCode==0;
        this.playRoundAni(data.posIdx,isSuccess);     

    }
    private curSmallAniStep:number = 0;
    /**播放转圈动画 */
    private playRoundAni(endPos:number,isSuccess:boolean):void{
        let totalMs:number = 3000;
        let total:number = SkillCheatsCache.TOTAL_POS*3+endPos;
        let stepMs:number = Math.floor(totalMs/total);
        this.curSmallAniStep = -1;
        this.hideAllSmall();
        App.TimerManager.remove(this.onStepAni,this);
        App.TimerManager.doTimer(stepMs,total,this.onStepAni,this,()=>{
            let fn:Function = isSuccess?this.onSucceeAniComp:this.onFailAniComp;
            App.TimerManager.doDelay(300,fn,this);         
        },this);
        this.onStepAni();
    }
    //成功特效
    private onSucceeAniComp():void{
        let item:CheatsItem = this.setRoundEndState();
        if(item){
            item.playEffect(true);
        }
        this.onResultAniComp();
    }
    //失败的特定动画
    private onFailAniComp():void{
        let item:CheatsItem = this.setRoundEndState();
        if(item){
            item.playFailAni(true);
        }
        this.onResultAniComp();
    }

    private setRoundEndState():CheatsItem{
        let idx:number = this.curSmallAniStep%SkillCheatsCache.TOTAL_POS;
        //this.smallImgs[idx].visible = false;
        let item:CheatsItem = this.itemList[idx];
        return item;
    }

    private onStepAni():void{
        let idx:number = 0;
        if(this.curSmallAniStep>-1){
            idx = this.curSmallAniStep%SkillCheatsCache.TOTAL_POS;
            this.smallImgs[idx].visible = false;
        }        
        this.curSmallAniStep++;
        idx = this.curSmallAniStep%SkillCheatsCache.TOTAL_POS;
        this.smallImgs[idx].visible = true;

    }
    /**成功或者失败动画完成 */
    private onResultAniComp():void{
        this.isInAni = false;        
        //this.imgFail.visible = false;
        this.updateAll();
    }

    private updateIco():void{       
        if(this.curItem){
            let url:string = ConfigManager.cheats.getCheatUrl(this.curItem);
            this.loaderIco.load(url);
            this.btnAdd.visible = false;            
        }else{
           this.loaderIco.clear(); 
           this.btnAdd.visible = true;
        }
    }    
    private updateItem():void{
        for(let i:number = 0;i<this.itemList.length;i++){
            let item:CheatsItem = this.itemList[i];
            item.setData({pos:i,roleIndex:this._roleIndex},i);
            let img:fairygui.GImage = this.bigImgs[i];
            img.visible = CacheManager.cheats.isPosEmbeld(this._roleIndex,i);
        }
    }
    /**停止所有动画 */
    private stopAllAni():void{
        App.TimerManager.remove(this.onStepAni,this);
        let item:CheatsItem = this.setRoundEndState();
        if(item){
            item.playEffect(false);
            item.playFailAni(false);
        }
    }

    private onClickItem(e:egret.TouchEvent):void{
        let item:CheatsItem = e.target;
        if(item){
            let data:any = item.getData();
            if(data){
                let code:number = CacheManager.cheats.getPosItemCode(data.roleIndex,data.pos);
                if(code>0){
                    EventManager.dispatch(LocalEventEnum.CheatsItemTips,{item:new ItemData(code),roleIndex:this._roleIndex});
                }                
            }
        }
    }
    protected onGUIBtnClick(e:egret.TouchEvent):void{
        var btn: any = e.target;
        switch (btn) {
            case this.btnEmbed:
                this.setArrowState(false);
                if(this.curItem){
                    let tips:string = App.StringUtils.substitude(LangSkill.LANG11,this.curItem.getName(false))+HtmlUtil.brText+HtmlUtil.html(LangSkill.LANG12,Color.Color_2);
                    Alert.alert(tips,()=>{
                        EventManager.dispatch(LocalEventEnum.CheatsReqEmbed,this._roleIndex,this.curItem.getCode());
                        this.curItem = null;
                        this.updateIco();
                        this.handlerBtnEff(false);                        
                    },this);                    
                }else{
                    EventManager.dispatch(LocalEventEnum.CheatsShowSelectwWin,{roleIndex:this._roleIndex});
                }
                break;
            case this.btnReplace:
                EventManager.dispatch(LocalEventEnum.CheatsShowExchangewWin);
                break;
            case this.btnPreview:
                EventManager.dispatch(LocalEventEnum.CheatsShowPreviewWin,{roleIndex:this._roleIndex});
                break;
            case this.btnAdd:
            case this.loaderIco:
                EventManager.dispatch(LocalEventEnum.CheatsShowSelectwWin,{roleIndex:this._roleIndex});
                break;
            case this.btnPath:
                HomeUtil.open(ModuleEnum.PropGet,false,{itemCode:ItemCodeConst.showCheats});
                break;
        }
    }
    private hideAllSmall():void{
        for(let i:number = 0;i<this.smallImgs.length;i++){
            this.smallImgs[i].visible = false;
        }
    }
    public set roleIndex(roleIndex: number) {
		this._roleIndex = roleIndex;
        this.stopAllAni();
		this.updateAll();
	}

	public get roleIndex(): number {
		return this._roleIndex;
	}
    public hide():void {
        super.hide();
        this.isInAni = false;
        this.handlerBtnEff(false);
        this.setArrowState(false);
        this.stopAllAni();
        this.hideAllSmall();
    }

}