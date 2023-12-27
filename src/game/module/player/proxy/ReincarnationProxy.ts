class ReincarnationProxy extends BaseProxy {
	public constructor() {
		super();
	}

	/**请求转生 */
	public reincarnationRequest():void {
		this.send("ECmdGameUpgradRoleState",{});
	}

	/**角色等级降1级获取修为 */
	public useRoleExp():void {
		this.send("ECmdGameUseRoleExp",{});
	}

	/**等级兑换 */
	public roleLevelExp():void{
		this.send("ECmdGameAcceptLevelRoleExp",{});
	}

	/**关卡兑换 */
	public checkPointExp():void{
		this.send("ECmdGameAcceptCheckPointRoleExp",{});
	}

}