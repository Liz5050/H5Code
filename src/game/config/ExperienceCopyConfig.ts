class ExperienceCopyConfig extends BaseConfig {

	/**经验副本 关卡对应获得的修为 */
	//private checkpointExp:any;

	public constructor() {
		//经验副本获得的经验和修为都是根据关卡获得(2019年1月12日14:51:42 修改)
		super("t_mg_experience_copy_config","checkpoint"); //level,roleStatus
		//this.checkpointExp = {};
	}

	/*
	public parseByPk(sourceData: any, pk: string): any {
		let data = {};
		if (sourceData) {
			let key: string = "";
			let pks: Array<string> = pk.split(",");
			for (let d of sourceData) {
				key = "";
				if (pks.length > 1) {//组合主键
					for (let k of pks) {
						if (d[k]) {
							key += d[k] + this.sep;
						} else {
							key += 0 + this.sep;
						}
					}
				} else {
					key = d[pk] ? d[pk] : 0;
				}
				data[key] = this.transform(d, data);
				let checkpoint:number = d.checkpoint?d.checkpoint:0;
				let levelExp:number = d.levelExp?d.levelExp:0; 
				this.checkpointExp[checkpoint] = levelExp;
			}
		}
		return data;
	}
	*/
	
	/**
	 * 获取经验副本的经验
	 */
	public getCopyExp(checkpoint:number=-1):number{		
		if(checkpoint==-1){
			checkpoint = CacheManager.copy.getCopyProcess(CopyEnum.CopyCheckPoint);
		}
		var inf:any = this.getByPk(checkpoint);
		var exp:number = inf && inf.exp?inf.exp:0;
		return exp;
	}

	/**
	 * 获取经验副本的经验修为
	 * @param checkpoint 
	 */
	public getCopyLevelExp(checkpoint:number=-1):number{
		if(checkpoint==-1){
			checkpoint = CacheManager.copy.getCopyProcess(CopyEnum.CopyCheckPoint);
		}				
		var inf:any = this.getByPk(checkpoint);
		var exp:number = inf && inf.levelExp?inf.levelExp:0;
		return exp;
	}

	/**判断当前打经验副本是否可以获得修为 */
	public isHasLevelExp():boolean{
		return this.getCopyLevelExp()>0;
	}

}