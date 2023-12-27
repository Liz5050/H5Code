/**
 * 守护仙盟
 * @author zhh
 * @time 2019-01-08 15:56:48
 */
class GuildDefendPanel extends BaseCopyPanel {
    private c1:fairygui.Controller;
    private c2:fairygui.Controller;
    private c3:fairygui.Controller;
    private txtTime1:fairygui.GTextField;
    private txtTime2:fairygui.GTextField;
    private txtPro:fairygui.GTextField;
    private txtExp:fairygui.GTextField;
    private txtTravel:fairygui.GTextField;
    private txtCoin:fairygui.GTextField;
    private txtTar:fairygui.GTextField;
    private txtMyRank:fairygui.GTextField;
    private txtMyScore:fairygui.GTextField;
    private btnExit:fairygui.GButton;
    private listRank:List;
    private listTarget:List;
    private listAtk:List;

    private _timerId:number = 0;
    private rankData:any[];
    private _waveTipHandler:number = 0;
    private _curRingMsg:number;
    private guideTips:fairygui.GComponent[];
    private _isClick:boolean;
    private guideTip3:fairygui.GComponent;

	public constructor(copyInf:any) {
		super(copyInf,"GuildDefendPanel",PackNameEnum.Copy2);
        this.exitTips = LangCopyHall.L47;
	}
	public initOptUI(): void {
        super.initOptUI();
        //---- script make start ----
        this.c1 = this.getController("c1");
        this.c2 = this.getController("c2");
        this.c3 = this.getController("c3");
        this.txtTime1 = this.getGObject("txt_time1").asTextField;
        this.txtTime2 = this.getGObject("txt_time2").asTextField;
        this.txtPro = this.getGObject("txt_pro").asTextField;
        this.txtExp = this.getGObject("txt_exp").asTextField;
        this.txtTravel = this.getGObject("txt_travel").asTextField;
        this.txtCoin = this.getGObject("txt_coin").asTextField;
        this.txtTar = this.getGObject("txt_tar").asTextField;
        this.txtMyRank = this.getGObject("txt_myRank").asTextField;
        this.txtMyScore = this.getGObject("txt_myScore").asTextField;
        this.btnExit = this.getGObject("btn_exit").asButton;
        this.listRank = new List(this.getGObject("list_rank").asList);
        this.listTarget = new List(this.getGObject("list_target").asList);
        this.listAtk = new List(this.getGObject("list_atk").asList);
        this.guideTips = [];
        for(let i:number = 0;i<2;i++){
            let tip:fairygui.GComponent = this.getGObject("guideTip"+(i+1)).asCom;            
            this.guideTips.push(tip);
        }
        this.guideTip3 = this.getGObject("guideTip3").asCom;          
        this.guideTip3.visible = false;
        //this.listRank.list.addEventListener(fairygui.ItemEvent.CLICK,this.onGUIListSelect,this);
        this.listTarget.list.addEventListener(fairygui.ItemEvent.CLICK,this.onGUIListSelect,this);
        this.listAtk.list.addEventListener(fairygui.ItemEvent.CLICK,this.onGUIListSelect,this);
        //---- script make end ----
        this.c1.setSelectedIndex(0);
       
	}

	public updateAll(data?:any):void{
		let curRing:number = 0;
        let maxRing:number = 1;
        if(CacheManager.copy.copyRingInf){
            curRing = CacheManager.copy.copyRingInf.curRing;
            maxRing = CacheManager.copy.copyRingInf.maxRing;
        }
        this.txtPro.text = HtmlUtil.colorSubstitude(LangCopyHall.L42,`${curRing}/${maxRing}`);
        if(CacheManager.guildDefend.isInTravel()){
            //赏灯阶段
            let boxInfo:any = CacheManager.guildDefend.boxInfo;
            this.txtTravel.text = HtmlUtil.colorSubstitude(LangCopyHall.L44,boxInfo?boxInfo.leftNum_I+"/"+boxInfo.totalNum_I:'0/0');
            this.c2.setSelectedIndex(1);
            this.txtTime1.text = LangCopyHall.L46;
            this.txtTime2.text = LangCopyHall.L46;
        }else{
            this.c2.setSelectedIndex(0);
            let exp:string = CacheManager.guildDefend.scopyInfo?App.MathUtils.formatNum2(CacheManager.guildDefend.scopyInfo.exp_L64):"0";
            this.txtExp.text = exp;//HtmlUtil.colorSubstitude(LangCopyHall.L43,exp);
            let coin:string = CacheManager.guildDefend.scopyInfo?App.MathUtils.formatNum2(CacheManager.guildDefend.scopyInfo.coin_L64):"0";
            this.txtCoin.text = coin;
        }
        this.updateRank();
        this.updateDefender();
        this.showGuide();
        this.updateAtkBoss();
	}

    public showGuide():void{
        let en:number = CacheManager.copy.getEnterNum(CopyEnum.GuildDefend);
        let isShow:boolean = en==1;
        for(let i:number=0;i<this.guideTips.length;i++){
            let tip:fairygui.GComponent = this.guideTips[i];
            tip.visible = isShow && !this._isClick;           
        }

    }

    public showGuideTips():void{
        if(!CacheManager.guildDefend.isGodDefendTip){            
            this.guideTip3.visible = true;
            egret.setTimeout(()=>{ //10秒消失
                CacheManager.guildDefend.isGodDefendTip = true;
                this.guideTip3.visible = false;
            },this,10000);
        }else{
            this.guideTip3.visible = false;
        }
    }

    public updateAtkBoss():void{
        if(CacheManager.guildDefend.bossEntity){
            this.c3.setSelectedIndex(0);
            this.listAtk.setVirtual([CacheManager.guildDefend.bossEntity]);
        }else{
            this.c3.setSelectedIndex(1);
        }
    }

    public updateRank():void{
        if(CacheManager.guildDefend.rankInfo){
            let datas:any[] = CacheManager.guildDefend.rankInfo.ranks.data;
            datas = datas.slice(0,3);
            this.listRank.setVirtual(datas);
            this.txtMyRank.text = CacheManager.guildDefend.rankInfo.myRank_I+"";
            this.txtMyScore.text = CacheManager.guildDefend.rankInfo.myPoints_L64+"";
        }
    }

    public updateDefender():void{
        if(CacheManager.guildDefend.defenderCodes){
            this.listTarget.setVirtual(CacheManager.guildDefend.defenderCodes);
        }else{
            this.listTarget.setVirtual([]);
        }
    }

    public updateDefByCode(code:number):void{
        let dIdx:number = CacheManager.guildDefend.defenderCodes.indexOf(code);
        let cIdx:number = this.listTarget.list.itemIndexToChildIndex(dIdx);
        let item:GuildDefendItem = <GuildDefendItem>this.listTarget.list.getChildAt(cIdx);
        if(item){
            item.setData(code,dIdx);
        }
    }

    /**副本开启、副本退出、副本环数倒计时提示 */
	public showTipsView(show: boolean): void {
		if (this.tipsView) {
			this.tipsView.visible = show;
		}
	}

    public extendPanel(flag: boolean): void {		
		
	}
    
    /**
	 * 设置副本内中下位置的倒计时提示
	 */
	public setTimeTipsText(text: string,type:number): void {
		
		if(this.loaderDesc){
            let imgName:string;
            switch(type){              
                case CopyEnum.TIME_TYPE3:
                    imgName = "sec_desc3_1.png";
                    if (this.txt_tips) {
                        this.txt_tips.text = text;
                    }
                    break;              
            }
            if(imgName){
                this.loaderDesc.load(URLManager.getModuleImgUrl(imgName,PackNameEnum.Copy));
            }else{
                this.loaderDesc.clear();
                if (this.txt_tips) {
                    this.txt_tips.text = "";
                }
            }
			
		}
	}

    private onHideWaveTip():void{
        TweenUtils.to(this.tipsView,{alpha:0},200,()=>{
            this.showTipsView(false);
            this.tipsView.alpha = 1;
        },this)
        
    }
    private clearWaveTips():void{
        if(this._waveTipHandler>0){
            egret.clearTimeout(this._waveTipHandler);
        }
    }
  
    public onTimer(): void {
        if(CacheManager.guildDefend.isInTravel()){ //阶段2
            return;
        }
        //更新突袭怪的刷新时间
        if(CacheManager.guildDefend.scopyInfo){
            let leftSec:number = CacheManager.guildDefend.scopyInfo.specialBossTime_DT - CacheManager.serverTime.getServerTime();
            if(leftSec>=0){
                this.txtTime2.text = App.DateUtils.getTimeStrBySeconds(leftSec,DateUtils.FORMAT_5);
            }else{
                //this.txtTime2.text = "";
                this.txtTime2.text = LangCopyHall.L46;
            }            
        }else{
            this.txtTime2.text = "";
        }
        
        let now:number = egret.getTimer();
        let sec:number = Math.floor((CacheManager.guildDefend.nextWaveDt-now)/1000);
        if(sec>0){
            this.txtTime1.text = App.DateUtils.getTimeStrBySeconds(sec,DateUtils.FORMAT_5);            
        }else{            
            this.txtTime1.text = LangCopyHall.L45;
        }
                
	}  

    protected onGUIListSelect(e:fairygui.ItemEvent):void{
        var item:ListRenderer = <ListRenderer>e.itemObject;
        if(!item){
            return;
        }

        var list: any = e.target;
        switch (list) {
            case this.listAtk.list:
                let entityInfo:any = item.getData();
                if(entityInfo.code_I){
                    //EventManager.dispatch(LocalEventEnum.CopyGuildDefendStop);
                    EventManager.dispatch(LocalEventEnum.AutoStartFight,{bossCode:entityInfo.code_I,searchDisBossDead:GuildDefendCache.searchDis});    
                                    
                }
                break;            
            case this.listTarget.list:
                let bossCode:number = item.getData();
                // let entity:RpgGameObject = CacheManager.map.getEntityByBossCode(bossCode);        
                // if(entity){
                    
                // }   
                let idx:number = CacheManager.guildDefend.defenderCodes.indexOf(bossCode);
                this._isClick = true;
                this.showGuide();
                if(CacheManager.guildDefend.isGodDefend(bossCode)){
                    CacheManager.guildDefend.isGodDefendTip = true;
                    this.showGuideTips()
                }
                CacheManager.king.stopKingEntity();       
                let wp:any = CacheManager.guildDefend.getWaitPoint(bossCode);             
                let data:any = { "mapId":CacheManager.map.mapId, "x": wp.waitPointX, "y": wp.waitPointY };
                let param:any = {hookData:wp};
                ObjectUtil.copyProToRef(data,param,true);
                param.bossCode = -1;
                EventManager.dispatch(LocalEventEnum.AIStart, { "type": AIType.RouteBossHook, "data":param});       
                //EventManager.dispatch(LocalEventEnum.CopyGuildDefendStop);     
                break;

        }               
    }

    private delayFight():void{
        egret.setTimeout(()=>{
            //EventManager.dispatch(LocalEventEnum.CopyGuildDefendStart);
        },this,1000);
    }

    public hide(param: any = null, callBack: CallBack = null):void{
        super.hide(param,callBack);
        this.c1.setSelectedIndex(0);
        this._curRingMsg = 0;
        this.txtExp.text = "";
        this.txtPro.text = "0/0";
        if(this.guideTip3.visible){
            CacheManager.guildDefend.isGodDefendTip = true;
        }
        this.guideTip3.visible = false;
    }

    public onShow(data?:any):void{
        super.onShow(data);
        this.c1.setSelectedIndex(0);        
        //this.delayFight();
        egret.setTimeout(()=>{
            this.updateDefender();
        },this,300);
    }

}