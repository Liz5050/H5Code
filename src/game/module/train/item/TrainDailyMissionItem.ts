/**
 * 日常任务item
 * @author zhh
 * @time 2019-03-12 20:25:21
 */
class TrainDailyMissionItem extends ListRenderer {
    private c1:fairygui.Controller;
    private c2:fairygui.Controller;
    private loaderIco:GLoader;
    private txtCount:fairygui.GRichTextField;
    private txtDesc:fairygui.GRichTextField;
    private txtValue:fairygui.GRichTextField;
    private txtTips:fairygui.GTextField;
    private btnOption:fairygui.GButton;
    private btnGet:fairygui.GButton;


	public constructor() {
		super();
		
	}
	protected constructFromXML(xml:any):void{			
		super.constructFromXML(xml);
        //---- script make start ----
        this.c1 = this.getController("c1");
        this.c2 = this.getController("c2");
        this.loaderIco = <GLoader>this.getChild("loader_ico");
        this.txtCount = this.getChild("txt_count").asRichTextField;
        this.txtDesc = this.getChild("txt_desc").asRichTextField;
        this.txtValue = this.getChild("txt_value").asRichTextField;
        this.txtTips = this.getChild("txt_tips").asTextField;
        this.btnOption = this.getChild("btn_option").asButton;
        this.btnGet = this.getChild("btn_get").asButton;

        this.btnOption.addClickListener(this.onGUIBtnClick, this);
        this.btnGet.addClickListener(this.onGUIBtnClick, this);
        //---- script make end ----


	}
	public setData(data:any,index:number):void{		
		this._data = data;
		this.itemIndex = index;
        
        let time:number = ObjectUtil.getConfigVal(this._data,"time",0); //总次数
        let event:number = ObjectUtil.getConfigVal(this._data,"event",0);
        let isCan:boolean = CacheManager.daily.isEventCanGet(event);
        this.loaderIco.load(URLManager.getModuleImgUrl(`daily/event_${event}.png`,PackNameEnum.Train));
        let finishTime:number = CacheManager.daily.getEventTime(event);
        let isFinish:boolean = finishTime>=time;
        let countStr:string = finishTime+"/"+time;
        if(isFinish || isCan){
            countStr = HtmlUtil.html(countStr,Color.Color_6);
        }
        this.txtCount.text = App.StringUtils.substitude(LangTrain.L18,countStr);

        this.txtDesc.text = this._data.name;
        let exp:number = ObjectUtil.getConfigVal(this._data,"exp",0); //单次历练值
        let gotScore:number = exp*finishTime-CacheManager.daily.getCanGetScore(event); //已领取的历练值
        let total:number = exp*time;//总历练值
        //clr = gotScore>=total?Color.Color_6:Color.Color_4; //领完才是绿色
        this.txtValue.text = App.StringUtils.substitude(LangTrain.L19,gotScore+"/"+total);        
        this.setItemShowStatus(event,isCan);
        
        if(event == ESWordPoolEvent.ESWordPoolEventCopyMgCheckPoint) {//关卡
            GuideTargetManager.reg(GuideTargetName.TrainDailyMissionPanelCheckPointOptionBtn, this.btnGet);
        }
	}   
    private setItemShowStatus(event:number,isCan:boolean):void{        
        let idx:number = 0;        
        let isComp:boolean = CacheManager.daily.isEventComplete(event);
        CommonUtils.setBtnTips(this.btnGet,isCan);
        if(isCan){//可领取
            idx = 1;
        }else if(isComp){//已完成
            if(event==ESWordPoolEvent.ESWordPoolEventCopyMgCheckPoint){
                idx = 5;
            }else{
                idx = 3;
            }            
        }else if(!CacheManager.daily.isEventOpen(event)){ //为开启
            idx = 4;
            this.txtTips.text = this._data.notOpenStr;
        }
        this.c2.setSelectedIndex(idx);
        let isRcm:boolean = ConfigManager.swordPoolEvent.isCurRecommendGroup(this._data); //该组推荐 都还没完成并且是未完成中组别最大的
        if(!isCan && isRcm){
            idx = 1;
        }else{
            idx = 0;
        }
        this.c1.setSelectedIndex(idx);
    }
    protected onGUIBtnClick(e:egret.TouchEvent):void{        
        var btn: any = e.target;
        let event:number = ObjectUtil.getConfigVal(this._data,"event",0);
        switch (btn) {
            case this.btnOption:                
                EventManager.dispatch(LocalEventEnum.DailyGotoEvent,event);
                break;
            case this.btnGet:
                //领取奖励
                this.dealGetReward();
                break;
        }
    }

    private dealGetReward():void{
        let event:number = ObjectUtil.getConfigVal(this._data,"event",0);
        let cx:number = this.btnGet.x+this.btnGet.width/2;
        let cy:number = this.btnGet.y+this.btnGet.height/2;
        let pt:egret.Point = this.localToGlobal(cx,cy,RpgGameUtils.point);
        EventManager.dispatch(LocalEventEnum.TrainGetDailyScore,{eventType:event,gx:pt.x,gy:pt.y});
    }

}