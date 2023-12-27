class NoBilityCache implements ICache {
	public static MAX_NAME_STAGE:number = 7;
	private _maxLevel:number = 0;
	public constructor() {

	}

	/**当前爵位等级 */
	public get curLevel():number{
		let level:number = 1;
		let info:any = CacheManager.role.getPlayerStrengthenExtInfo(EStrengthenExType.EStrengthenExTypeLord);
		if(info){ //SStrengthenExInfo
			level = info.level; 
		}
		return level;
	}
	
	public get warfare():number{
		let warfare:number = 0;
		let info:any = CacheManager.role.getPlayerStrengthenExtInfo(EStrengthenExType.EStrengthenExTypeLord);
		if(info){ //SStrengthenExInfo
			warfare = info.warfare; 
		}
		return warfare;
	}

	public get maxLevel():number{
		if(this._maxLevel==0){
			this._maxLevel = ConfigManager.mgStrengthenEx.getMaxLevel(EStrengthenExType.EStrengthenExTypeLord);
		}
		return this._maxLevel;
	}

	public getStageIcoId(stage:number):number{
        let icoStage:number = Math.min(stage,NoBilityCache.MAX_NAME_STAGE);
		return icoStage;
    }

	public getStageIcoUrl(stage:number):string{
		let icoStage:number = this.getStageIcoId(stage);
		return URLManager.getNobilityIco(icoStage)
	}

	public getMinUnGetLevel():number{
		let level:number = 0;
		let info:any = CacheManager.role.getPlayerStrengthenExtInfo(EStrengthenExType.EStrengthenExTypeLord);
		if(info && info.getRewardLevelList){ //SStrengthenExInfo
			let unGetLevels:number[] = info.getRewardLevelList.data_I;//现在返回的是当前已经领取的最大等级	
			level = unGetLevels.length>0?unGetLevels[0]:0;
			let curLv:number = this.curLevel;
			let minLv:number = 0;
			while(curLv>level){
				let cfgInfo:any = ConfigManager.mgStrengthenEx.getByTypeAndLevel(EStrengthenExType.EStrengthenExTypeLord,curLv);
				if(cfgInfo && cfgInfo.getReward){
					minLv = curLv; 
				}
				curLv--;
			}
			level = minLv;
			
		}		
		return level;
	}
	
	/**
	 * 根据爵位等级获取名字
	 *  */
	public getNameByLv(level:number,isHtml:boolean=true,isLbl:boolean=true):string{
		let name:string = "";
		let stage:number=-1;
		let info:any = ConfigManager.mgStrengthenEx.getByTypeAndLevel(EStrengthenExType.EStrengthenExTypeLord,level);
		if(info){
			stage = info.stage; 
		}
		if(stage>-1 && stage<=LangTrain.LA1.length){
			let idx:number = stage-1;
			idx = Math.max(0,idx);
			name = LangTrain.LA1[idx];
			if(isLbl){
				name = `[${name}]`;
			}
			if(isHtml){
				name = HtmlUtil.html(name,Color.getNobilityColor(stage));
			}
		}
		return name;
	}

	/**
	 * 是否满级
	 */
	public get isMax():boolean{
		return this.curLevel>=this.maxLevel;
	}
	/**是否红点 */
	public checkTips():boolean{
		let isOpen:boolean = ConfigManager.mgOpen.isOpenedByKey(PanelTabType[PanelTabType.TrainNobility],false);
		let flag:boolean = false;
		if(isOpen){
			flag = this.isCanUpgrade();
			if(!flag){
				flag = this.isTrainScoreReward();
			}
			if(!flag){
				flag = this.isHasLevelReward();
			}
		}
		return flag;
	}
	/**
	 * 是否可晋升爵位
	 */
	public isCanUpgrade(isTips:boolean=false):boolean{
		let flag:boolean = false;
		let myMoney:number = CacheManager.role.getMoney(EPriceUnit.EPriceUnitTrainScore);
		if(!CacheManager.nobility.isMax){
			let curInfo:any = ConfigManager.mgStrengthenEx.getByTypeAndLevel(EStrengthenExType.EStrengthenExTypeLord,this.curLevel);
			flag = myMoney>=curInfo.useMoneyNum;
		}
		if(!flag && isTips){
			Tip.showLeftTip(LangTrain.L4);
		}
		return flag;
	}
	/**
	 * 是否历练度奖励
	 */
	public isTrainScoreReward():boolean{
		let flag:boolean = false;
		
		let sortEvents:any[] = ConfigManager.swordPoolActivity.getSortedActivities();
        for(let i:number=0;i<sortEvents.length;i++){
			let info:any = sortEvents[i];           
            if(this.isTrainScore(info)){
				flag = true;
				break;
			}
        }
		return flag;
	}
	/**
	 * 判断某个历练度 是否有奖励
	 */
	public isTrainScore(info:any):boolean{
		let todayScore:number = CacheManager.daily.getTodayTrainScore();
		return !CacheManager.daily.isGetReward(info.idx) && todayScore>=info.needExp
	}
	/**
	 * 是否官印奖励
	 */
	public isHasLevelReward():boolean{
		let flag:boolean = false;
		let unGetLv:number = this.getMinUnGetLevel();
		flag = unGetLv>0;		
		return flag; 
	}
	/**是否已领取官印(不判断是否达到领取条件的 只关注未领取的列表) */
	public isGetLevelReward(level:number):boolean{
		let flag:boolean = false;
		let info:any = CacheManager.role.getPlayerStrengthenExtInfo(EStrengthenExType.EStrengthenExTypeLord);
		if(info && level<=this.curLevel){ 
			let unGetLevels:number[] = info.getRewardLevelList.data_I;	//现在返回的是当前已经领取的最大等级	
			flag = unGetLevels.length>0 && unGetLevels[0]>=level;
		}
		return flag;
	}

	/**是否有前缀名 */
	public isHasFixName(curStage:number):boolean{
		return curStage>=NoBilityCache.MAX_NAME_STAGE;
	}

	public clear():void{

	}
}