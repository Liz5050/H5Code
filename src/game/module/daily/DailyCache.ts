class DailyCache implements ICache {

	/**SSWordPool，保存了外形相关信息 */
	public _swordPool: any;
	/**SSWordPoolActivity */
	public swordPoolActivity: any;
	/**事件次数字典，键为event */
	private _eventTimeDict: any;
	/**未领取的历练值 */
	private _notGetScoreDict:any;

	public constructor() {
		this._eventTimeDict = {};
	}

	public set swordPool(swordPool: any) {
		this._swordPool = swordPool;
		this._eventTimeDict = StructUtil.dictIntIntToDict(swordPool.todayDict);
		this._notGetScoreDict = StructUtil.dictIntIntToDict(swordPool.notGetScoreDict);
	}

	public get swordPool(): any {
		return this._swordPool;
	}

	/**
	 * 更新事件次数 SSwordPoolEventUpdateInfos
	 */
	public updateEventTime(data: any): void {
		if(data.updateInfos && data.updateInfos.data){
			for(let i:number = 0;i<data.updateInfos.data.length;i++){
				let info:any = data.updateInfos.data[i];
				this._eventTimeDict[info.eventType_I] = info.cnt_I;//更新次数 
				this._notGetScoreDict[info.eventType_I] = info.notGetScore_I;//更新未领取的历练值
			}
		}		
	}

	/**
	 * 更新剑池经验
	 */
	public updateExp(sSeqAttributeUpdate: any): void {
		let code: number = sSeqAttributeUpdate.code_I;
		for (let attrUpdate of sSeqAttributeUpdate.updates.data) {
			let attr: number = attrUpdate.attribute;
			let valueNum: number = attrUpdate.value_I;
			let valueStrNum: number = Number(attrUpdate.valueStr_S);

			switch (attr) {
				case EEntityAttribute.EAttributeSwordPoolExp:
					this._swordPool.exp_I = valueNum;
					break;
				case EEntityAttribute.EAttributeSwordPoolExpAdd://剑池经验增加
					EventManager.dispatch(NetEventEnum.SwordPoolExpAdd, valueNum);
					break;
			}
		}
	}

	/**
	 * 获取事件当前次数
	 */
	public getEventTime(event: number): number {
		if (this._eventTimeDict[event] == null) {
			return 0;
		}
		return this._eventTimeDict[event];
	}

	/**
	 * 是否已完成
	 */
	public isEventComplete(event: number): boolean {
		let cfg: any = ConfigManager.swordPoolEvent.getByPk(event);
		return this.getEventTime(event) >= cfg.time;
	}
	/**是否有可领的历练值 */
	public isEventCanGet(event: number):boolean{
		let flag:boolean = false;
		if(this._notGetScoreDict){
			flag = this._notGetScoreDict[event]>0; 
		}
		return flag;
	}

	public getCanGetScore(event: number):number{
		if(this._notGetScoreDict && this._notGetScoreDict[event]){
			return this._notGetScoreDict[event]; 
		}
		return 0;
	}

	/**
	 * 是否已领取奖励
	 */
	public isGetReward(idx: number): boolean {
		if (this.swordPoolActivity != null) {
			return this.swordPoolActivity.hadGetList.data_I.indexOf(idx) != -1;
		}
		return false;
	}
	
	public getTodayTrainScore():number{
		let countExp_I:number = 0;
		if (this.swordPoolActivity != null) {
			countExp_I = this.swordPoolActivity.countExp_I;
		}
		return countExp_I;
	}

	/**
	 * 事件是否已开启
	 */
	public isEventOpen(event: number): boolean {
		let cfg: any = ConfigManager.swordPoolEvent.getByPk(event);
		if (cfg.openKey == null) {
			return true;
		}
		return ConfigManager.mgOpen.isOpenedByKey(cfg.openKey, false);
	}

	public checkTips():boolean{
		let flag:boolean = false;
		let isOpen:boolean = ConfigManager.mgOpen.isOpenedByKey(PanelTabType[PanelTabType.TrainDaily],false);
		if(isOpen){
			flag = this.isHasTrainScoreGet();
		}
		return flag;
	}

	/**是否有历练可领取 */
	public isHasTrainScoreGet():boolean{
		let b:boolean = false;
		if(this._notGetScoreDict){
			for(let key in this._notGetScoreDict){
				if(this._notGetScoreDict[key]>0){
					b = true;
					break;
				}
			}
		}
		return b;
	}

	public get swordPoolExp(): number {
		return this.swordPool.exp_I;
	}

	public get swordPoolLevel(): number {
		return this.swordPool.level_I;
	}

	public get swordPoolModelId(): number {
		return this.swordPool.useModelId_I;
	}

	public clear(): void {

	}
}