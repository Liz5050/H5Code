/**
 * 福利模块新版
 * @author Chris 18/7/18
 */
class Welfare2Module extends BaseTabModule {

    private btnLeft:fairygui.GButton;
	private btnRight:fairygui.GButton;

    private btnPos:egret.Point = new egret.Point(73, 16);
    public constructor() {
        super(ModuleEnum.Welfare2, PackNameEnum.Welfare2);
        this.indexTitle = false;
    }

    public initOptUI(): void {
        this.initTabInfo();
        this.tabViews = {};
        this._tabTypes = UIManager.ModuleTabTypes[this.moduleId];
        this.tabParent = this.getGObject("tabContainer").asCom;
        this.tabBtnList = new List(this.getGObject("list_tabBtn").asList);
        
        this.btnLeft = this.getGObject("btn_left").asButton;
		this.btnLeft.addClickListener(this.onBtnLeftClick, this);
		this.btnRight = this.getGObject("btn_right").asButton;
		this.btnRight.addClickListener(this.onBtnRightClick, this);

        this.tabBtnList.data = this._tabTypes;
        this.tabBtnList.list.addEventListener(fairygui.ItemEvent.CLICK,this.onSelectBtnChange,this);
        //this.tabBtnList.list.scrollPane.addEventListener(fairygui.ScrollPane.SCROLL, this.onTabListScroll, this);
		this.tabBtnList.list.scrollPane.addEventListener(fairygui.ScrollPane.SCROLL_END, this.onTabListScrollEnd, this);
        this.tabBtnList.setSrcollStatus(5,this.setBtnShow,this);

        for(let i:number = 0; i < this._tabTypes.length; i++) {
            this.checkTabVisible(this._tabTypes[i]);
        }
    }

    protected initTabInfo():void{
        this.className = {
            [PanelTabType.SignIn]:["SignInPanel",SignInPanel,PackNameEnum.WelfareSignIn],
            [PanelTabType.LoginReward]:["LoginRewardPanel",LoginRewardPanel,PackNameEnum.WelfareLoginReward],
            [PanelTabType.GoldCard]:["GoldCardPanel",GoldCardPanel,PackNameEnum.Welfare2GoldCard],
            [PanelTabType.PrivilegeCard]:["PrivilegePanel",PrivilegePanel,PackNameEnum.Welfare2PrivilegeCard],
            [PanelTabType.ExCdKey]:["ExchangeCdkeyPanel",ExchangeCdkeyPanel,PackNameEnum.Welfare2Cdkey],
            [PanelTabType.Notice]:["NoticePanel",NoticePanel,PackNameEnum.Welfare2],
            // [PanelTabType.OnlineReward]:["OnlineRewardPanel",OnlineRewardPanel,PackNameEnum.OnlineReward],
        };
    }
    private setBtnShow(status:number):void{
        let isMid:boolean = status==List.SCROLL_MIDDLE;
        this.btnLeft.visible = status==List.SCROLL_LEFT || isMid; 
        this.btnRight.visible = status==List.SCROLL_RIGHT || isMid; 
    }

    public updateAll(): void {
        this.checkLoginRewardPanel();
        this.updateBtnTips();
        // this.setBtnTips(PanelTabType.OnlineReward,CacheManager.welfare2.checkOnlineRewardTips(),this.btnPos);

        this.tabBtnList.scrollToView(0);
        //this.onTabListScroll();
        //this.setBtnShow()
		this.onTabListScrollEnd();
    }


    public updatePrivilegePanel():void {
        if (this.curIndex == this.tabTypes.indexOf(PanelTabType.PrivilegeCard))
            this.curPanel && this.curPanel.updateAll();
    }

    public updateSignInPanel(): void{
        if(this.curPanel instanceof SignInPanel){
            this.curPanel.refreshPanel();
        }
        this.updateBtnTips();
    }

    public updateLoginRewardPanel(): void{
        if(this.curPanel instanceof LoginRewardPanel){
            this.curPanel.updateAll();
        }
        this.updateBtnTips();
    }

    public updateBtnTips():void {
        this.setBtnTips(PanelTabType.PrivilegeCard, CacheManager.welfare2.privilegeRewardFlag, this.btnPos);
        this.setBtnTips(PanelTabType.SignIn, CacheManager.welfare2.checkSignTips(), this.btnPos);
        this.setBtnTips(PanelTabType.LoginReward, CacheManager.welfare2.checkLoginRewardTips(), this.btnPos);
    }

    private checkLoginRewardPanel(): void{
        if(!CacheManager.welfare2.isLoginRewardPanelShow()){
            if(this.tabViews[PanelTabType.LoginReward]) {
                this.setBtnTips(PanelTabType.LoginReward,false);
                this.tabViews[PanelTabType.LoginReward].destroy();
                this.tabViews[PanelTabType.LoginReward] = null;
                delete this.tabViews[PanelTabType.LoginReward];
            }
            
            let index:number = this._tabTypes.indexOf(PanelTabType.LoginReward);
            if(index != -1){
                this._tabTypes.splice(index,1);
                // this.className.splice(index,1);

                this.tabBtnList.data = this._tabTypes;
                this.setIndex(this._tabTypes[0]);
            }
        }
    }

    public updateOnlineTime():void {
        // if(this.isTypePanel(PanelTabType.OnlineReward)) {
        //     this.curPanel.updateOnlineTime();
        // }
        // this.setBtnTips(PanelTabType.OnlineReward,CacheManager.welfare2.checkOnlineRewardTips(),this.btnPos);
    }

    public hide():void {
        super.hide();
    }
    
    /*
    private onTabListScroll():void {
		let percX:number = this.tabBtnList.list.scrollPane.percX;

		if(percX == 0) {
			this.btnLeft.visible = false;
			this.btnRight.visible = true;
		}
		else if(percX == 1) {
			this.btnLeft.visible = true;
			this.btnRight.visible = false;
		}
		else {
			this.btnLeft.visible = true;
			this.btnRight.visible = true;
		}
	}
    */

	private onTabListScrollEnd():void {
		let leftTip:boolean = false;
		let rightTip:boolean = false;
		let firstIdx:number = this.tabBtnList.list.getFirstChildInView();
		let item:Welfare2ButtonItem;
		for(let i=0; i < this.tabBtnList.data.length; i++) {
			if(!this.tabBtnList.isChildInView(i)) {
				item = this.tabBtnList.list.getChildAt(this.tabBtnList.list.itemIndexToChildIndex(i)) as Welfare2ButtonItem;
				if(item && item.hasTip) {
					if(i <= firstIdx) {
						leftTip = true;
					}
					else {
						rightTip = true;
					}
				}
			}
		}
		CommonUtils.setBtnTips(this.btnLeft, leftTip);
		CommonUtils.setBtnTips(this.btnRight, rightTip, 0,0,false);
	}

    private onBtnLeftClick():void {
		let idx:number = this.tabBtnList.list.getFirstChildInView();
		idx -= 5;
		idx < 0 ? idx = 0 : null;
		
		this.tabBtnList.scrollToView(idx, true, true);

		App.TimerManager.doDelay(800, this.onTabListScrollEnd, this);
	}

	private onBtnRightClick():void {
		let idx:number = this.tabBtnList.list.getFirstChildInView();
		idx += 5;
		idx > this.tabBtnList.data.length-1 ? idx = this.tabBtnList.data.length-1 : null;
		
		this.tabBtnList.scrollToView(idx, true, true);

		App.TimerManager.doDelay(800, this.onTabListScrollEnd, this);
	}

}