/**
 * 限时任务配置
 */
class TimeLimitTaskConfig {
	
	private _taskTypeConfig:BaseConfig;
	private _taskDetailsConfig:BaseConfig;

	public constructor() {
		this._taskTypeConfig = new BaseConfig("t_mg_time_limited_task_type", "code");
		this._taskDetailsConfig = new BaseConfig("t_mg_time_limited_task_details", "type,idx");
	}

	public getTaskType(code:number):any {
		let result = this._taskTypeConfig.getByPk(code);
		if(result) {
			return result;
		}
		return {code:1, duration:10000, suitLevel:1};
	}

	public getTaskDetails(type:number, idx:number):any {
		let result = this._taskDetailsConfig.getByPk(`${type},${idx}`);
		if(result) {
			return result;
		}
		let dit:any = {};
		dit[1] = "3,200000011,1";
		dit[2] = "3,200000012,1";
		dit[3] = "3,200000013,1";
		dit[4] = "3,200000014,1";
		dit[5] = "3,200000015,1";
		dit[6] = "3,200000016,1";
		dit[7] = "3,200000017,1";
		dit[8] = "3,200000018,1";
		return {title:`配置错误：${type},${idx}`, rewards:dit[idx], taskList:"300001"};
	}

	// /**
	//  * 获取章节配置
	//  * @param {number} state
	//  */
	// public getChapterData(state:number):Array<ChangeCareerChapterData> {
	// 	if (!this.chapterDict) {
	// 		this.makeChapterDict();
	// 	}
	// 	return this.chapterDict[state];
	// }

	// private makeChapterDict():void {
	// 	this.chapterDict = {};
	// 	let state:number;
	// 	let subState:number;

	// 	let dataDict:any = this.careerChapterCfg.getDict();
	// 	let data:any;
	// 	for (let key in dataDict) {
	// 		data = dataDict[key];
	// 		state = data.roleState || 0;
	// 		subState = data.roleSubState;
	// 		if (!subState) continue;
	// 		if (!this.chapterDict[state]) {
	// 			this.chapterDict[state] = [];
	// 		}
	// 		this.chapterDict[state].push(new ChangeCareerChapterData(data));
	// 	}
	// }
}