class TimeLimitTaskCache implements ICache{
	
		// message STimeLimitedTaskInfo
	// {
	//	 optional int32 code_I = 1;
	//	 optional int32 index_I = 2;
	//	 optional int32 status_I = 3;
	//	 optional int32 process_I = 4;
	//	 optional int32 target_I = 5;
				// int code;		//限时任务类型 code
				// int index;		//限时任务索引
				// int status;		//限时任务状态，见 ETaskStatus
				// int process;		//任务进度
				// int target;		//任务目标
	// };
	// message SeqTimeLimitedTaskInfo
	// {
	//	 repeated STimeLimitedTaskInfo data = 1;
	// };
	// message S2C_SPlayerTimeLimitedTaskInfo {
		// optional int32 code = 1;			//当前限时任务类型 code
		// optional int32 startTimestamp = 2;		//限时任务开始时间戳
		// optional Protocol_Game.SeqTimeLimitedTaskInfo taskInfoList = 3;	//限时任务信息列表
		// optional bool createFlag = 4;		//创建标志
		// optional int32 allTaskExpired = 5;		//所有限时任务已过时标志（0：未过时）
	// };
	// message S2C_SPlayerTimeLimitedTaskInfoUpdate {
	//	 optional SeqTimeLimitedTaskInfo updateTaskInfoList = 1;	
	// };

	//当前限时任务类型 code
	private _code:number = 0; 

	private _needShowIcon:boolean = false;

	//限时任务结束时间戳
	private _endTimestamp:number = 0; 

	//限时任务信息列表 SeqTimeLimitedTaskInfo
	private _taskInfoList:Array<any> = []; 

	private _suitLevel:number = 1;
	
	public constructor() {
		
	}

	public needShowIcon():boolean {
		return this._needShowIcon;
	}

	public get endTimestamp():number {
		return this._endTimestamp;
	}

	//距离当前阶段结束时间
	public get leftTime():number {
		let left:number = this._endTimestamp - CacheManager.serverTime.getServerTime();
		if(left < 0) {
			return 0;
		}
		return left;
	}

	public checkTips():boolean {
		let data:any;
		for (var i: number = 0; i < this._taskInfoList.length; i++) {
  			data = this._taskInfoList[i];
			if (data.status_I == ETaskStatus.ETaskStatusHadCompleted) {
				return true;
			}
		}
		return false;
	}

	public setTimeLimitTaskInfo(info:any) {
		this._code = info.code;

		if(info.allTaskExpired == 0 || info.allTaskExpired == null) {
			this._needShowIcon = true;
		}
		else {
			this._needShowIcon = false;
		}
		
		this._taskInfoList = info.taskInfoList.data;

		let config:any = ConfigManager.timeLimitTask.getTaskType(this._code);

		this._suitLevel = config.suitLevel;
		this._endTimestamp = info.startTimestamp + config.duration;

		EventManager.dispatch(LocalEventEnum.TimeLimitTaskUpdateAll);
	}


	public updateTimeLimitTaskList(info:any) {
		let infoList:Array<any> = info.updateTaskInfoList.data;

		let data:any;
		for (let uData of infoList) {
			for (var i: number = 0; i < this._taskInfoList.length; i++) {
	  			data = this._taskInfoList[i];
				if (data.code_I == uData.code_I && data.index_I == uData.index_I) {
					this._taskInfoList[i] = uData;
					EventManager.dispatch(LocalEventEnum.TimeLimitTaskUpdate, uData);
					break;
				}
			}
		}
	}

	public get taskInfoList(): Array<any> {

		if(this._taskInfoList.length == 0) {
			let list:Array<any> = [];

			for (let i=1; i<9; i++) {

				list.push({"code_I":1, "index_I":i, "status_I":2, "process_I":i, "target_I":8});

			}

			return list;
		}

		return this._taskInfoList;
	}

	public hadGotRewards(index:number):boolean {
		let data:any = this._taskInfoList[index-1];
		if(data) {
			return data.status_I == ETaskStatus.ETaskStatusHadEnd;
		}
		return false;
	}

	public get code():number {
		return this._code;
	}

	public get suitLevel():number {
		return this._suitLevel;
	}

	public get curProgress():number {
		let cur:number = 0;
		for(let data of this._taskInfoList) {
			if(data.status_I == ETaskStatus.ETaskStatusHadEnd) {
				cur += 1;
			}
		}
		return cur;
	}

	public get maxProgress():number {
		if(this._taskInfoList.length == 0) {
			return 8;
		}
		return this._taskInfoList.length;
	}
	
	public clear(): void{
		
	}
}