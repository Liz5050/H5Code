/**
 * 副本item
 * @author zhh
 * @time 2018-05-24 20:02:21
 */
class CopyItem extends ListRenderer {
    public static NONE_DATA:number = 10241024;
    private c1:fairygui.Controller;
    private baseitem:BaseItem;
    private txtCopyname:fairygui.GTextField;
    private txtMonry:fairygui.GRichTextField;
    private txtNotOpen:fairygui.GRichTextField;
    private txtDeletegate:fairygui.GRichTextField;
    private txtDlgMax:fairygui.GRichTextField;
    private btnChanglle:fairygui.GButton;
    private btnQuickChallenge:fairygui.GButton;
    private loader_img:GLoader;
    private progressBar:UIProgressBar;
    private groupGold:fairygui.GGroup;
    private curProgress:number = 0;
    private MAX:number = 10;
    /**是否快速挑战 */
    private isQuick:boolean = false;
	public constructor() {
		super();
		
	}
	protected constructFromXML(xml:any):void{			
		super.constructFromXML(xml);
        //---- script make start ----
        this.c1 = this.getController("c1");
        this.baseitem = <BaseItem>this.getChild("baseitem");
        this.txtCopyname = this.getChild("txt_copyName").asTextField;
        this.txtMonry = this.getChild("txt_monry").asRichTextField;
        this.txtNotOpen = this.getChild("txt_notOpen").asRichTextField;
        this.txtDeletegate = this.getChild("txt_deletegate").asRichTextField;
        this.txtDlgMax = this.getChild("txt_dlg_max").asRichTextField;
        this.btnChanglle = this.getChild("btn_changlle").asButton;
        this.btnQuickChallenge = this.getChild("btn_quickChallenge").asButton;
        this.loader_img = <GLoader>this.getChild("loader_img");
        this.loader_img.touchable = false;
        this.progressBar = <UIProgressBar>this.getChild("progress_bar");
        this.progressBar.setStyle(URLManager.getPackResUrl(PackNameEnum.Common,"progressBar_4"),URLManager.getPackResUrl(PackNameEnum.Common,"bg_4"),164,20);
        this.progressBar.labelType = BarLabelType.None;
        this.groupGold = this.getChild("group_gold").asGroup; 
        this.btnChanglle.addClickListener(this.onGUIBtnClick, this);
        this.btnQuickChallenge.addClickListener(this.onGUIBtnClick, this);
        //---- script make end ----
        this.baseitem.isSelectStatus = false;

	}
	public setData(data:any,index:number):void{		
		this._data = data;
        if(this._data==CopyItem.NONE_DATA){
            this.setNoneStatus();
            return;
        }

		this.itemIndex = index;
        this.isQuick = false; //是否快速挑战
        //得到配置的 copyInfo 
        this.txtCopyname.text = this._data.name;        
        if(this.curProgress==0){
            this.setProBarShow(false);
        }
        let rewards:ItemData[] = RewardUtil.getStandeRewards(this._data.reward);
        var item:ItemData;
        if(rewards && rewards.length>0){
            item = rewards[0]; 
        }
        this.baseitem.itemData = item;
        this.baseitem.setNameText("");
        this.loader_img.load(URLManager.getModuleImgUrl("copy_"+this._data.code+".jpg",PackNameEnum.CopyHall));  
        let costGold: number = ConfigManager.mgDelegate.getCostGold(this._data.code);
        this.txtMonry.text = costGold + "";
        let text:string = CopyUtils.getMaterialsCopyUnOpenText(this._data);
        let isOpen:boolean = text=="";
        var cIdx:number = 0;
        if(isOpen){
            let totalNum:number = CacheManager.copy.getCopyNumByDay(this._data.code);            
            let leftNum:number = CacheManager.copy.getEnterLeftNum(this._data.code);
            let isCanDelegate:boolean = CacheManager.copy.isCanDelegate(this._data.code);
            let isPrivilegeCard:boolean = CacheManager.welfare2.isPrivilegeCard;//开通特权月卡可以扫荡
            let isNumOk:boolean = leftNum>0;
            if(isCanDelegate){
                if (totalNum>leftNum) {
                    cIdx = 1;
                    this.btnQuickChallenge.text = LangCopyHall.L21;
                } else {
                    cIdx = 4;//可扫荡 但是是首次挑战显示 快速挑战
                    this.btnQuickChallenge.text = LangCopyHall.L20;
                    this.isQuick = true; //是否快速挑战
                }
            }
            
            if(isNumOk){
                if(isCanDelegate){
                    if(isPrivilegeCard && leftNum==totalNum){ //月卡 并且还没挑战过
                        this.txtDeletegate.text = LangCopyHall.L27 + HtmlUtil.html("1次","#0DF14B");                         
                    }else{
                        this.txtDeletegate.text = LangCopyHall.L12 + HtmlUtil.html(leftNum + "次","#0DF14B");
                    }                   
                }else{
                    this.txtDeletegate.text = LangCopyHall.L27 + HtmlUtil.html("1次","#0DF14B");
                }
                
            }else{                
                let minLv:number = ConfigManager.vip.getAddCopyNumMiniVipLv(EVipAddType.EVipAddMaterialCopyNum);
                let nextAddInfo:any = ConfigManager.vip.getCopyNextAddInfo(EVipAddType.EVipAddMaterialCopyNum);
                let info:any = ConfigManager.vip.getVipAddDict(EVipAddType.EVipAddMaterialCopyNum);                
                if(CacheManager.vip.checkVipLevel(minLv)){                      
                    let maxAddLv:number = ConfigManager.vip.getCopyAddNumMaxVipLv(EVipAddType.EVipAddMaterialCopyNum);                        
                    if(!info[nextAddInfo.nextLv] || CacheManager.vip.vipLevel==maxAddLv){
                        this.txtDlgMax.text = LangCopyHall.L11;     
                        cIdx = 2;
                    }else{
                        this.txtDeletegate.text = App.StringUtils.substitude(LangCopyHall.L10,nextAddInfo.nextLv,nextAddInfo.addNum);
                        cIdx = 1;
                    }                           
                }else{
                    this.txtDeletegate.text = App.StringUtils.substitude(LangCopyHall.L10,minLv,info[minLv]);      
                }
                
            }       
            App.DisplayUtils.grayButton(this.btnChanglle,!isNumOk,!isNumOk);
            App.DisplayUtils.grayButton(this.btnQuickChallenge,!isNumOk,!isNumOk);
            this.btnChanglle.visible = !isCanDelegate;
            this.btnQuickChallenge.visible = isCanDelegate; 
            let btn:fairygui.GButton = this.btnChanglle.visible?this.btnChanglle:this.btnQuickChallenge;
            let isTips:boolean = !isCanDelegate && isNumOk;
            if(CacheManager.copy.isMaterialsCopyTipLevel){
                isTips = isNumOk && MoneyUtil.checkEnough(EPriceUnit.EPriceUnitGold, costGold, false);
            }
            CommonUtils.setBtnTips(btn,isTips);
            this.txtDeletegate.x = btn.x +(btn.width - this.txtDeletegate.width)/2; 
        }else{
            this.txtNotOpen.text = text;
            cIdx = 3;
        }        
        this.c1.setSelectedIndex(cIdx);
	}

    private setNoneStatus():void{
        this.baseitem.itemData = null;
        this.txtCopyname.text = LangCopyHall.L48;
        this.setProBarShow(false);  
        this.c1.setSelectedIndex(5);
        this.btnQuickChallenge.text = LangCopyHall.L51;
        this.loader_img.load(URLManager.getModuleImgUrl("copy_none.jpg",PackNameEnum.CopyHall));  
        this.baseitem.icoUrl = URLManager.getModuleImgUrl("copy_none_ico.png",PackNameEnum.CopyHall);
        App.DisplayUtils.grayButton(this.btnQuickChallenge,true,true);
    }

    protected onGUIBtnClick(e:egret.TouchEvent):void{
        var btn: any = e.target;
        switch (btn) {
            case this.btnChanglle:
                //进入副本挑战
                if(CopyUtils.isMaterialRoleState()){
                    EventManager.dispatch(LocalEventEnum.CopyDelegate,this._data.code,0,false);
                    //EventManager.dispatch(UIEventEnum.ModuleClose,ModuleEnum.CopyHall);
                }else{
                    EventManager.dispatch(LocalEventEnum.CopyReqEnter,this._data.code);
                }
                
                break;
            case this.btnQuickChallenge:
                //扫荡
                if(this.isQuick){ //快速挑战 不读条;2018年8月2日19:08:06 
                    EventManager.dispatch(LocalEventEnum.CopyDelegate,this._data.code,0,false);
                    //EventManager.dispatch(UIEventEnum.ModuleClose,ModuleEnum.CopyHall);
                    return;
                }
                if(CopyUtils.isCanDelegate(this._data.code)){
                    this.progressBar.setValue(0,this.MAX);
                    this.setProBarShow(true);                    
                    App.TimerManager.doTimer(100,0,this.doProgress,this);
                    this.doProgress();
                }                
                break;
        }
    }
  
    private setProBarShow(isShow:boolean):void{
        this.progressBar.visible = isShow;
        this.groupGold.visible = !isShow;
    }
    private doProgress():void{
        if(this.curProgress>=this.MAX){
             this.setProBarShow(false);
            App.TimerManager.remove(this.doProgress,this);
            this.curProgress = 0;
            EventManager.dispatch(LocalEventEnum.CopyDelegate,this._data.code,0,false);
        }
        this.curProgress++;
        this.progressBar.setValue(this.curProgress,this.MAX);
    }


}