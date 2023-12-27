/**常量配置 */
class ConstConfig extends BaseConfig {
	private ChatIntervalTime:string = "ChatIntervalTime";
	private static OpenNewRealRoleCareer:string = "OpenNewRealRoleCareer";
	/**仙盟最大日志 */
	private static GuildLogMaxNum:string = "GuildLogMaxNum";
	

	private realRoleCareer:number[];
	private _guildLogMaxNum:number = -1;
	private _spiritRewardItem:ItemData;
	private _persoalBossDelegateState:number = 0;  
	public constructor() {
		super("t_const", "constName");
	}

	public getConstValue(constName: string): number {
		let constValue: number = 0;
		let cfg: any = this.getDict()[constName];
		if (cfg["constValue"] != null) {
			constValue = cfg["constValue"];
		}
		return constValue;
	}

	/**
	 * 三个角色职业
	 */
	public getRealRoleCareers():number[]{
		if(!this.realRoleCareer){
			this.realRoleCareer = [];
			for(var i:number = 1;i<=3;i++){
				let key:string = ConstConfig.OpenNewRealRoleCareer+i;
				this.realRoleCareer.push(this.getConstValue(key));
			}
		}
		return this.realRoleCareer;
	}
	/**
	 * 根据职业获取职业下标
	 */
	public getRoleIndex(career:number):number{
		var careers:number[] = this.getRealRoleCareers();
		return careers.indexOf(career);
	}

	public get guildLogMaxNum():number{
		if(this._guildLogMaxNum==-1){
			let info:any = this.getByPk("GuildLogMaxNum");
			this._guildLogMaxNum = info.constValue;
		}
		return this._guildLogMaxNum;
	}
	/**聊天发送消息间隔 */
	public getChatIntervalTime():number{
		return this.getConstValue(this.ChatIntervalTime);
	}

	public getSpiritCopyCost(mutiple:number):number{
		let t:number = 0;
		let info:any = this.getByPk("SpiritCopyCostGold");
		if(info){
			if(mutiple==2){
				t = info.constValue?info.constValue:0;
			}else if(mutiple==3){
				t = info.constValueEx?info.constValueEx:0;
			}
		}
		return t;
	}
	/**获取法宝副本1倍奖励的物品 */
	public getSpiritCopyReward():ItemData{
		if(!this._spiritRewardItem){
			let info:any = ConfigManager.const.getByPk('SpiritCopyRewards');
			this._spiritRewardItem = new ItemData(info.constValue);
			this._spiritRewardItem.itemAmount = info.constValueEx;
		}		
		return this._spiritRewardItem;
	}

	/**个人boss可扫荡的转生数 */
	public get perBossDlgState():number{
		if(this._persoalBossDelegateState==0){
			this._persoalBossDelegateState = this.getConstValue('PersoalBossDelegateState');
		}
		return this._persoalBossDelegateState;
	}  

	/**快速使用没达到关卡限制 */
	public isItemQuickCpLimit():boolean{
		let floor:number = CacheManager.copy.getCopyProcess(CopyEnum.CopyCheckPoint);
		let limit:number = this.getConstValue("CheckPointLimit");
		return floor<limit;
	}

	public isGodWeaponQuickUse():boolean{
		let floor:number = CacheManager.copy.getCopyProcess(CopyEnum.CopyCheckPoint);
		let constName:string = "CheckPointLimit";
		let limit: number = 0;
		let cfg: any = this.getDict()[constName];
		if (cfg["constValueEx"] != null) {
			limit = cfg["constValueEx"];
		}				
		return floor>limit;
	}

}