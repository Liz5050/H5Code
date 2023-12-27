/**
 * 诛仙塔抽奖
 * @author zhh
 * @time 2018-09-11 10:53:12
 */
class TowerTurntableModule extends BaseModule {

    private addRota:number = 36;
    private addStepMs:number = 40; //后面两圈每次增加的转速
    private stepMs:number = 20; //计时器速度;固定值
    private speedTotalRound:number = 35;//计时器减速转开始的次数（固定伐值）
    private addSpeedTotalRound:number = 35; //计时器减速转开始的次数(动态伐值)
    private totalRound:number = 40; //默认计时器执行次数

    private loaderBg:GLoader;    
    private txtTime:fairygui.GRichTextField;
    private imgPoint:fairygui.GImage;
    private selectImgs:fairygui.GImage[];
    private getImgs:fairygui.GImage[];
    private maskImgs:fairygui.GImage[];
    private rewardItems:BaseItem[];
    private btnStart:fairygui.GButton;
    private isInAni:boolean;
    private curTotal:number = 0;
    private curAniType:number = 0;
    
    private isLast:boolean;

	public constructor() {
		super(ModuleEnum.TowerTurntable,PackNameEnum.TowerTurntable);        
	}

	public initOptUI():void{
        //---- script make start ----     
        this.rewardItems =[];
        this.selectImgs = [];
        this.getImgs = [];
        this.maskImgs = [];
        for(let i:number=0;i<10;i++){
            let item:BaseItem = <BaseItem>this.getGObject("baseItem_"+i);
            //item.isShowName = false;
            this.rewardItems.push(item);
            let img:fairygui.GImage = this.getGObject("img_select"+i).asImage;
            img.visible = false;
            this.selectImgs.push(img);
            img = this.getGObject("img_get"+i).asImage;
            this.getImgs.push(img);
            img = this.getGObject("img_mask"+i).asImage;
            img.visible = false;
            this.maskImgs.push(img);
        }
        this.loaderBg = <GLoader>this.getGObject("loader_bg");       
        this.txtTime = this.getGObject("txt_time").asRichTextField;
        this.imgPoint = this.getGObject("img_point").asImage;
        this.btnStart = this.getGObject("btn_start").asButton;
        this.btnStart.addClickListener(this.onClickStart,this);
        //---- script make end ----
        this.loaderBg.load(URLManager.getModuleImgUrl("turnable_bg.png",PackNameEnum.CopyTower));
       
	}

	public updateAll(data?:any):void{
        if(this.isInAni){
            return;
        }
        let ts:string = HtmlUtil.html(""+CacheManager.towerTurnable.lotteryTime,"#0df14b");
        this.txtTime.text = App.StringUtils.substitude(LangCopyHall.L29,ts);               
        this.updateItems();       
	}

    public setImgShow(idx:number,show:boolean):void{
        if(this.selectImgs[idx]){
            this.selectImgs[idx].visible = false;
        }        

    }

    public playAni(data:any):void{
        this.curAniType = data.type;
        let tempAdd:number = data.index-1;
        this.curTotal = this.totalRound+tempAdd;//计时器执行次数
        let r:number = this.imgPoint.rotation%360;
        r = this.imgPoint.rotation==0?0:(10 - Math.floor(r/this.addRota)); //已有旋转的
        this.curTotal = this.curTotal + r;
        this.addSpeedTotalRound=this.speedTotalRound+Math.floor(r/2)+Math.floor(tempAdd/2);
        let totalMs:number = 4000;
        let stepMs:number = Math.floor(totalMs/this.curTotal);// 4秒完成
        stepMs = this.getNormalNum(stepMs);
        this._curSpeedMs = Math.max((stepMs - this.stepMs*2),this.stepMs);
        let round:number = this.addSpeedTotalRound; //快速转的
        let tn:number = (totalMs - round*this._curSpeedMs)/(this.curTotal-round);
        this.addStepMs =Math.min(this.getNormalNum((Math.floor(tn)-this._curSpeedMs)),180);
        this.stopAni();
        this.isInAni = true;        
        this._c = 0;
        this._curTickMs = 0;        
        this._curRotation = this.imgPoint.rotation;
        App.TimerManager.doTimer(this.stepMs,0,this.onTimerRun,this);
    }

    private getNormalNum(n:number):number{
        return n-n%this.stepMs;
    }

    private _c:number = 0;
    private _curRotation:number = 0;
    private _curSpeedMs:number = 0;
    private _curTickMs:number = 0;

    private onTimerRun():void{        
        this._curTickMs+=this.stepMs;
        if(this._curTickMs%this._curSpeedMs==0){
            this._c++;
            let idx:number = Math.floor(this._curRotation/this.addRota);    
            this.setImgShow(idx,false); 
            this._curRotation += this.addRota;
            this._curRotation%=360;
            idx = Math.floor(this._curRotation/this.addRota);    
            this.setImgShow(idx,true);             
            this.imgPoint.rotation = this._curRotation;
            if(this._c==this.addSpeedTotalRound){
                this._curSpeedMs+=this.addStepMs;
            }
            if(this._c==this.curTotal){
                this.onAniComp();
            }
        }      
        
    }

    private onAniComp():void{
        this.stopAni();
        let idx:number = Math.floor(this._curRotation/this.addRota); 
        let item:BaseItem = this.rewardItems[idx];
        let delay:number = 500;
        let code:number = item.itemData?item.itemData.getCode():0;
        if(code>0){ 
            let gp:egret.Point = item.getIcoPos();
            egret.setTimeout(()=>{
                //Tip.addTip({x:gp.x,y:gp.y,itemCode:code},TipType.PropIcon); 
                MoveMotionUtil.itemMoveToBag([code],0,LayerManager.UI_Cultivate, gp.x, gp.y);
        },this,delay*2);              
        }            
        //最后一个奖励被领取,1秒后才刷新新一轮的奖励
        if(this.isLast){
            egret.setTimeout(this.updateAll,this,delay*2);
        }else{
            egret.setTimeout(this.updateAll,this,300); //其余情况延时0.3秒 再刷新
        }
        
    }

    private stopAni():void{
        this.isInAni = false;
        App.TimerManager.remove(this.onTimerRun,this);
    }

    private resetView():void{
        this.imgPoint.rotation = 0;
        this.isInAni = false;
        this.isLast = false;
        this.setAllImgShow(false); 
        this.setImgShow(0,true);
        this.stopAni();
    }

    private updateItems():void{
        let rewards:any = ConfigManager.lotteryShow.getItemsByLotteryType(LotteryCategoryEnum.LotteryTower);
        for(let i:number=0;i<this.rewardItems.length;i++){
            if(rewards && rewards[i]){
                let itemData:ItemData = new ItemData(rewards[i].item);
                itemData.itemAmount = rewards[i].num;
                this.rewardItems[i].itemData = itemData;
            }else{
                this.rewardItems[i].itemData = null;
            }
            let isGet:boolean = CacheManager.towerTurnable.isGetReward(i+1);
            this.getImgs[i].visible = isGet;
            this.maskImgs[i].visible = isGet;
        }
    }
    private setAllImgShow(show:boolean):void{
        for(let i:number=0;i<this.selectImgs.length;i++){
            this.setImgShow(i,show);
        }
    }
    private onClickStart(e:egret.TouchEvent):void{
        if(!CacheManager.towerTurnable.isHasLotteryTimes()){
            Tip.showLeftTip(LangCopyHall.L33);
            return;
        }
        if(!this.isInAni){
            this.isLast = CacheManager.towerTurnable.isLastLottery;
            EventManager.dispatch(LocalEventEnum.CopyTowerReqLottery,CacheManager.towerTurnable.lotteryType);
        }
            
    }
    public hide(param: any = null, callBack: CallBack = null):void{
        super.hide(param,callBack);
        this.resetView();
    }

}