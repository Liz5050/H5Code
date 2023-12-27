/**
 * 日常外形配置
 */
class SwordPoolConfig extends BaseConfig {
	private _modelArray: Array<any>;
	private modelDict: any;

	public constructor() {
		super("t_mg_sword_pool", "level");
	}

	public get modelArray(): Array<any> {
		if (this.modelDict == null) {
			this.modelDict = {};
			this._modelArray = [];
			let dict: any = this.getDict();
			let value: any;
			for (let key in dict) {
				value = dict[key];
				if (this.modelDict[value.modelId] == null) {
					this.modelDict[value.modelId] = value;
				}
			}
			for (let key in this.modelDict) {
				this._modelArray.push(this.modelDict[key]);
			}
			this._modelArray.sort((a: any, b: any): number => {
				return a.modelId - b.modelId;
			});
		}
		return this._modelArray;
	}

	/**
	 * 根据模型获取最低剑池信息
	 */
	public getNextByModelId(modelId: number): any {
		let index: number = this.modelArray.indexOf(modelId);
		if (index == this.modelArray.length - 1) {
			return null;
		}
		return this.modelArray[index + 1];
	}

	/**
	 * 根据模型获取最低剑池信息
	 */
	public getPreByModelId(modelId: number): any {
		let index: number = this.modelArray.indexOf(modelId);
		if (index == 0) {
			return null;
		}
		return this.modelArray[index - 1];
	}
}