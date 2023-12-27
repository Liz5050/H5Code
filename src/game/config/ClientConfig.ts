/**
 * 客户端配置
 */
class ClientConfig {
	private dataDict: any;
    public constructor() {
        this.getDict();
    }

	/**
	 * 获取需要加载的特殊地图ID
	 */
	public getSpecialMapIds(): Array<number> {
		return this.getByKey("specialMapIds");
	}

	/**
	 * 获取需要手动操作的地图ID
	 */
	public getHandOperationMapIds(): Array<number> {
		return this.getByKey("handOperationMapIds");
	}


	public getByKey(key: string): any {
		return this.getDict()[key];
	}

	/**
	 * 获取任务对话
	 */
	public getTaskTalk(taskCode: number, status: ETaskStatus): string {
		return this.getByKey("task_talk")[taskCode + "_" + status];
	}

	/**
	 * 任务等级不匹配特殊提示
	 */
	public getTaskLevelNotMatchTip(taskCode: number): string {
		return this.getByKey("task_level_not_match_tip")[taskCode];
	}

	/**
	 * 跳跃是否启用朝向配置
	 */
	public getJumpDirConfig(): boolean {
		return this.getByKey("JumpDirConfig");
	}

	/**
	 * 跳跃是否启用朝向配置
	 */
	public getPreloadEnabled(): number {
		return this.getByKey("preload_enabled");
	}
	
	/*
	public getTestGuide():any{
		let testGuilde:string = this.getByKey("testGuilde");
		let arr:string[] = testGuilde.split(",");
		return {shape:arr[0],id:Number(arr[1]),s1:Number(arr[2]),s2:Number(arr[3])};
	}

	public getTestOpen():any{
		let openId:string = this.getByKey("testOpen");
		let cfg:any = ConfigManager.mgOpen.getByPk(Number(openId));
		return cfg;
	}
	*/
	
	/**
	 * 获取在加载页需要提前加载的资源
	 */
	public getWelcomePreload(sex_I: string): Array<string> {
		return this.getByKey("welcome_preload")[sex_I];
	}

	/**
	 * 获取等级升级时需要提前加载的资源
	 */
	public getLevelPreload(level:string, sex_I: string): Array<string> {
		if (this.getByKey("level_preload")[level] == null
			|| this.getByKey("level_preload")[level][sex_I] == null) {
				return [];
		}
		return this.getByKey("level_preload")[level][sex_I];
	}

	/**
	 * 获取完成任务时需要提前加载的资源
	 */
	public getTaskPreload(task:string, sex_I: string): Array<string> {
		if (this.getByKey("task_preload")[task] == null
			|| this.getByKey("task_preload")[task][sex_I] == null) {
				return [];
		}
		return this.getByKey("task_preload")[task][sex_I];
	}

	/**获取场景背景音乐 */
	public getSceneMusic(mapId:number):string
	{
		let _data:any = this.getByKey("bgMusic")[mapId];
		// if(!_data && CacheManager.copy.isInCopy) return "200000.mp3";
		if(!_data) return "100000.mp3";
		return _data["name"];
	}

	/**
	 * 获取角色时装资源id
	 * @param id
	 * @param career 基础职业
	 */
	public getPlayerFashionId(id:number,career:number):number {
		let baseCareer:number = CareerUtil.getBaseCareer(career);
		let res:any = this.getByKey("fashion")[id];
		if(!id || !res) {
			if (baseCareer == 1) {
				return 10100;
			} 
			else {
				return 10200;
			}
		}
		return res[baseCareer];
	}

	/**
	 * 开服冲榜
	 * 获取页签的进阶提升
	 */
	public getRankUpgrade(toplist: number): Array<any>{
		if(this.getByKey("open_server_rank_rush")[toplist] != null){
			return this.getByKey("open_server_rank_rush")[toplist];
		}
		return [];
	}

	/**
	 * 神秘商店
	 * 极品装备预览
	 */
	public getMysteryShopBestEquip(): Array<number>{
		if(this.getByKey("mysteryShop_best_equip") != null){
			return this.getByKey("mysteryShop_best_equip");
		}
		return [];
	}

	/**获取怪物称号id */
    public getBossTitle(bossCode: number): number {
    	let dict: any = this.getByKey("bossTitle");
    	if (dict != null) {
    		return dict[bossCode];
		}
        return 0;
    }
	
	private getDict(): any {
		if (this.dataDict == null) {
			this.dataDict = ConfigManager.Data["client_config"];
		}
		return this.dataDict;
	}
}