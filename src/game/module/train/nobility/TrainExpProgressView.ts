class TrainExpProgressView extends BaseView{
	private progressBarExp:UIProgressBar;
	private btnTrainexp1:fairygui.GButton;

	private coms:TrainExpRewardCom[];
	private _isDelay:boolean = false;

	public constructor(view: fairygui.GComponent) {
		super(view);		
	}
	protected initOptUI(): void{
		this.btnTrainexp1 = this.getGObject("btn_trainExp1").asButton;
		this.progressBarExp = <UIProgressBar>this.getGObject("progressBarExp");
        this.progressBarExp.setStyle(URLManager.getPackResUrl(PackNameEnum.Common,"progressBar_4"),URLManager.getPackResUrl(PackNameEnum.Common,"bg_5"),523,26);
        this.progressBarExp.labelType = BarLabelType.None;
		this.coms = [];
		for(let i:number = 0;i<3;i++){
			this.coms.push(new TrainExpRewardCom(this.getGObject("train_expCom"+i).asCom));
		}
		
	}

	public updateAll(data?:any):void{
		if(this._isDelay){
			return;
		}
		if(data && data.delayScore){
			this._isDelay = true;
			egret.setTimeout(this.updateTrainScoreReward,this,2000);
		}else{
			this.updateTrainScoreReward();
		}		
	}

	private updateTrainScoreReward():void{
		this._isDelay = false;
        let todayScore:number = CacheManager.daily.getTodayTrainScore();
        this.progressBarExp.setValue(todayScore,ConfigManager.swordPoolActivity.getTotalExp());
        let sortEvents:any[] = ConfigManager.swordPoolActivity.getSortedActivities();
        for(let i:number=0;i<sortEvents.length;i++){           
			if(i<this.coms.length){
				let com:TrainExpRewardCom = this.coms[i];
            	com.updateAll(sortEvents[i]);
			}            
        }
        this.btnTrainexp1.text = ""+todayScore;
    }
	
	public getEffectPoint():egret.Point{
		let cx:number = this.btnTrainexp1.x;// + this.btnTrainexp1.width/2;
		let cy:number =  this.btnTrainexp1.y + this.btnTrainexp1.height/2;
		let pt:egret.Point = this.view.localToGlobal(cx,cy,RpgGameUtils.point);
		return pt;
	}

	public cancleDelay():void{
		this._isDelay = false;
	}

}