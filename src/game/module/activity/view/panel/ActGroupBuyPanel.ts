/**
 * 首充团购活动界面
 * @author zhh
 * @time 2018-11-05 15:01:38
 */
class ActGroupBuyPanel extends ActivityBaseTabPanel{
    private bgTop:GLoader;
    private txtMoney:fairygui.GTextField;
    private btnGo:fairygui.GButton;
    private listCate:List;
    private listReward:List;
    private curIndex:number = 0;

	public constructor(view: fairygui.GComponent, controller: fairygui.Controller, index:number) {
		super();
        this.activityType = ESpecialConditonType.ESpecialConditionTypeRechargeGroup;
        this.timeTitleStr = HtmlUtil.html("重置倒计时：",Color.Color_8);
	}

	public initOptUI():void{
        super.initOptUI();
        //---- script make start ----
        this.bgTop = <GLoader>this.getGObject("bg_top");
        this.txtMoney = this.getGObject("txt_money").asTextField;
        this.btnGo = this.getGObject("btn_go").asButton;
        this.listCate = new List(this.getGObject("list_cate").asList);
        this.listReward = new List(this.getGObject("list_reward").asList);

        this.btnGo.addClickListener(this.onGUIBtnClick, this);
        this.listCate.list.addEventListener(fairygui.ItemEvent.CLICK,this.onSelectCate,this);
        //---- script make end ----


	}
    
	public updateAll():void{
        super.updateAll();
        if(!this.activityInfo){
            return;
        }
        this.updateIndex();
        if(this.curIndex<=0){
            return;
        }        
        this.updateList();     
	}

    private updateList():void{        

        this.txtMoney.text = "今日充值："+CacheManager.recharge.rechargeGroupNum+"";
        let cates:number[] = ConfigManager.mgRecharge.getIndexGroups(this.curIndex);
        let cateInfos:any[] = [];
        for(let i:number = 0;i<cates.length;i++){
            cateInfos.push({groupNum:cates[i],index:this.curIndex});
        }
        this.listCate.setVirtual(cateInfos);     
        this.listCate.selectedIndex==-1?this.listCate.selectedIndex = 0:null;
        this.selectCateReward(this.listCate.selectedData.groupNum);
    }

    public updateActicityInfo(info:ActivityInfo):void {
		super.updateActicityInfo(info);
        this.updateAll();
	}
    /**
	 * 已领奖信息更新
	 */
	public updateRewardGetInfo():void {
        this.updateList();
	}

    private updateIndex():boolean{
        let flag:boolean = false;
        if(this.activityInfo){
            let idx:number = CacheManager.activity.getGroupBuyIndexByInfo(this.activityInfo);
            flag = idx>0 && this.curIndex!=idx;
            this.curIndex = idx;
        }        
        return flag;
    }

    private selectCateReward(groupNum:number):void{
        let infos:any[] = ConfigManager.mgRecharge.getGroupBuyInfos(this.curIndex,groupNum);
        infos.sort(function (a:any,b:any):number{
            let getA:boolean = CacheManager.recharge.isGroupBuyGet(a.id);
            let getB:boolean = CacheManager.recharge.isGroupBuyGet(b.id);
            if(getA && !getB){
                return 1;
            }else if(!getA && getB){
                return -1;
            }
            return 0;
        });
        this.listReward.setVirtual(infos);
    }

    private onSelectCate(e:fairygui.ItemEvent):void{
        //选中团购大类
        this.selectCateReward(this.listCate.selectedData.groupNum);   
    }

    protected onGUIBtnClick(e:egret.TouchEvent):void{
        var btn: any = e.target;
        switch (btn) {
            case this.btnGo:
                HomeUtil.openRecharge();
                break;

        }
    }

    public hide():void{
        super.hide();
    }

}