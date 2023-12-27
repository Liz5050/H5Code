/**
 * 神器界面
 * @author zhh
 * @time 2018-06-11 16:03:48
 */
class GodWeaponPanel extends BaseTabView {
    private c1: fairygui.Controller;
    private txtName: fairygui.GTextField;
    private txtDesc: fairygui.GRichTextField;
    private txtFight: fairygui.GTextField;
    private btnAttr: fairygui.GButton;
    private btnLeft: fairygui.GButton;
    private btnRight: fairygui.GButton;
    private btnActivation: fairygui.GButton;
    private loader_act: GLoader;
    private loader_bg: GLoader;
    private loader_head: GLoader; //领悟
    private loader_skill: GLoader; //技能名字
    private loader_spe: GLoader; //特殊
    private listPiece: List;
    private godWeaponContainer: fairygui.GComponent;
    private t2:fairygui.Transition;

    private godWPModel: GodWeaponModelView;
    private godWeaponInfos: any[];
    private curSelectIndex: number = 0;
    private maxIndex: number;
    private minIndex: number;
    private curInfo: any;
    private isUpdate: boolean;

    public constructor() {
        super();
    }

    public initOptUI(): void {
        //---- script make start ----
        this.c1 = this.getController("c1");
        this.t2 = this.getTransition("t2");
        this.txtName = this.getGObject("txt_name").asTextField;
        this.txtDesc = this.getGObject("txt_desc").asRichTextField;
        this.btnAttr = this.getGObject("btn_attr").asButton;
        this.btnLeft = this.getGObject("btn_left").asButton;
        this.btnRight = this.getGObject("btn_right").asButton;
        let panel_fight: fairygui.GComponent = this.getGObject("panel_fight").asCom;
        this.txtFight = panel_fight.getChild("txt_fight").asTextField;
        this.btnActivation = this.getGObject("btn_activation").asButton;
        this.listPiece = new List(this.getGObject("list_piece").asList);
        this.godWeaponContainer = this.getGObject("godWeaponContainer").asCom;
        this.loader_act = <GLoader>this.getGObject("loader_act");
        this.loader_head = <GLoader>this.getGObject("loader_head");
        this.loader_skill = <GLoader>this.getGObject("loader_skill");
        this.loader_spe = <GLoader>this.getGObject("loader_spe");
        this.loader_bg = <GLoader>this.getGObject("loader_bg");
        this.loader_bg.load(URLManager.getModuleImgUrl("bg0.jpg", PackNameEnum.MagicWare));
        this.loader_head.load(URLManager.getModuleImgUrl(`godWeapon/tipText/tip_head.png`,PackNameEnum.Train));
        
        this.btnAttr.addClickListener(this.onGUIBtnClick, this);
        this.btnLeft.addClickListener(this.onGUIBtnClick, this);
        this.btnRight.addClickListener(this.onGUIBtnClick, this);
        this.btnActivation.addClickListener(this.onGUIBtnClick, this);
        this.listPiece.list.addEventListener(fairygui.ItemEvent.CLICK, this.onClickPiece, this);
        //---- script make end ----

        this.godWeaponInfos = ConfigManager.godWeapon.getGodWPList();
        this.minIndex = 0;
        this.godWPModel = new GodWeaponModelView(this.godWeaponContainer);

        GuideTargetManager.reg(GuideTargetName.TrainActiveBtn, this.btnActivation);
    }

    public updateAll(data?: any): void {
        
        let isActWP:boolean = this.curInfo && CacheManager.godWeapon.isGodWPAct(this.curInfo.code); //激活神器
        if (!this.isUpdate || isActWP) { // 
            let curIndx: number = this.setMaxAndCurIndex();
            if(!this.isUpdate){
                this.curSelectIndex = curIndx; //初次打开 
            }            
        }
        if(this.isUpdate) {
            this.curSelectIndex = this.setMaxAndCurIndexInUpdate();
        }

        this.curInfo = this.godWeaponInfos[this.curSelectIndex];
        this.maxIndex = Math.max(1, this.maxIndex);
        this.maxIndex = Math.min(this.godWeaponInfos.length - 1, this.maxIndex);
        this.updateCurInfo();
        this.setPageBtn();
        this.isUpdate = true;
    }   
    public hide():void {
		super.hide();
        this.isUpdate = false;
	}
    private setMaxAndCurIndex(): number {
        let count: number = 0;
        let curidx: number = 0;
        let maxNotAct: number = 2;
        for (let i: number = 0; i < this.godWeaponInfos.length; i++) {
            let info: any = this.godWeaponInfos[i];
            if (!CacheManager.godWeapon.isGodWPAct(info.code)) {
                count++;
                if (count == maxNotAct) {
                    this.maxIndex = i;
                    break;
                } else if (count == 1) {
                    curidx = i;
                }
            }
        }
        if (count < maxNotAct) { //全部都激活了
            this.maxIndex = this.godWeaponInfos.length - 1;
        }
        return curidx;
    }

    private setMaxAndCurIndexInUpdate(): number {
        let count: number = 0;
        let curidx: number = 0;
        let maxNotAct: number = 2;
        for (let i: number = 0; i < this.godWeaponInfos.length; i++) {
            let info: any = this.godWeaponInfos[i];
            if (!CacheManager.godWeapon.isGodWPAct(info.code)) {
                count++;
                if (count == maxNotAct) {
                    this.maxIndex = i;
                    break;
                } else if (count == 1) {
                    curidx = i;
                }
            }
        }
        var info = this.godWeaponInfos[curidx];
        let b = CacheManager.godWeapon.isHasPieceCanAct(info.code) ||  CacheManager.godWeapon.isGodWPAct(info.code) || CacheManager.godWeapon. getActPieces(info.code).length > 0;
        if (count < maxNotAct)
        {//全部激活了
            this.maxIndex = this.godWeaponInfos.length - 1;
        }
        else {
            if(!b && curidx > 0) {
                curidx --;
            } 
        }


        return curidx;
    }


    private updateCurInfo(): void {
        //显示图片,还没有资源        
        this.txtName.text = this.curInfo.name;
        this.txtDesc.text = this.curInfo.weaponDesc;
        this.txtFight.text = CacheManager.godWeapon.getGodWPFightVal(this.curInfo.code)+"";//CacheManager.godWeapon.getActWPTotalFight() + "";
        //更新碎片列表
        let pieces: any[] = ConfigManager.godWeapon.getPieceList(this.curInfo.code);
        App.ArrayUtils.sortOn(pieces, "piece");
        let col:number = Math.ceil(pieces.length/2);
        col = Math.max(col,2);
        this.listPiece.list.columnCount = col;
        this.listPiece.list.lineCount = 2;
        this.listPiece.list.columnGap = col>3?16:60;
        this.listPiece.setVirtual(pieces);
        this.listPiece.list.setBoundsChangedFlag();
        this.listPiece.list.refreshVirtualList();

        let isAct: boolean = CacheManager.godWeapon.isGodWPAct(this.curInfo.code);
        let idx: number = 0;
        this.loader_act.visible = isAct;
        this.t2.stop();
        if (isAct) {
            idx = 1;
            let url: string = ConfigManager.godWeapon.getWeaponUrl(this.curInfo);
            this.loader_act.load(url);
            this.godWPModel.hide();            
        } else {  //未激活            
            if (CacheManager.godWeapon.isGodWPCanAct(this.curInfo.code)) {
                idx = 2;
            } else {
                idx = 0;
            }            
            this.godWPModel.showByPkgContent(this.curInfo,new CallBack(()=>{
                this.t2.play(null,null,null,-1);            
            },this),ConfigManager.godWeapon.getPkgName(this.curInfo.code),ConfigManager.godWeapon.getComName());
        }
        let isSpec:boolean = ConfigManager.godWeapon.isSpecial(this.curInfo.code);
        this.loader_head.visible = this.loader_skill.visible =  !isSpec;
        this.loader_spe.visible = isSpec;
        let tipsUrl:string = ConfigManager.godWeapon.getGodWeaponTipsUrl(this.curInfo.code);
        if(isSpec){
            this.loader_spe.load(tipsUrl);
        }else{
            this.loader_skill.load(tipsUrl);
        }
        this.c1.setSelectedIndex(idx);
        //注册碎片
        for (let i: number = 0; i < this.listPiece.list._children.length; i++) {
            GuideTargetManager.reg(GuideTargetName.TrainPiece + (i + 1), this.listPiece.list._children[i]);
        }
        egret.setTimeout(() => {
            EventManager.dispatch(UIEventEnum.ViewOpened, this["__class__"], false);
        }, this, 200);
        

    }

    private changeInf(isNext: boolean): void {
        if (isNext) {
            this.curSelectIndex++;
            this.curSelectIndex = Math.min(this.curSelectIndex, this.maxIndex);
        } else {
            this.curSelectIndex--;
            this.curSelectIndex = Math.max(this.minIndex, this.curSelectIndex);
        }
        this.curInfo = this.godWeaponInfos[this.curSelectIndex];
        this.updateCurInfo();
        this.setPageBtn();
    }
    private setPageBtn(): void {
        this.btnLeft.visible = this.curSelectIndex != this.minIndex;
        this.btnRight.visible = this.curSelectIndex != this.maxIndex;
    }
    private onClickPiece(e: fairygui.ItemEvent): void {
        let item: GodWeaponPieceItem = <GodWeaponPieceItem>e.itemObject;
        if(item.isCanAct) {
            EventManager.dispatch(LocalEventEnum.TrainActGodWeaponPiece, item.toolTipData.data.code, item.toolTipData.data.piece);
        } else {
            ToolTipManager.show(item.toolTipData);
        }
    }
    
    protected onGUIBtnClick(e: egret.TouchEvent): void {
        var btn: any = e.target;
        switch (btn) {
            case this.btnAttr:
                EventManager.dispatch(LocalEventEnum.TrainGodWPAttrDetail);
                break;
            case this.btnLeft:
                this.changeInf(false);
                break;
            case this.btnRight:
                this.changeInf(true);
                break;
            case this.btnActivation:
                if (this.curInfo) {
                    EventManager.dispatch(LocalEventEnum.TrainActGodWeapon, this.curInfo.code);
                }
                break;

        }
    }
    /**
	 * 销毁函数
	 */
    public destroy(): void {
        this.isUpdate = false;
    }

}