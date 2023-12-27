class TaskProxy extends BaseProxy {
	public constructor() {
		super();
	}

	/**
	 * 领取任务
	 * @param choose 选择（物品、阵营、答案等）,不需要选择填0
	 */
	public getTask(npcId: number, taskCode: number, choose: number = 0, roleIdx: number = 0): void {
		this.send("ECmdGameGetTask", { "npc": npcId, "taskCode": taskCode, "choose": choose, "roleIdx": roleIdx });
	}

	/**
	 * 提交任务
	 * @param choose 选择（物品、阵营、答案等）,不需要选择填0
	 */
	public endTask(npcId: number, taskCode: number, choose: number = 0): void {
		if(!CacheManager.role.checkPointShow) {
			let code:number = ConfigManager.const.getConstValue("ShowCheckPointTaskCode");
			CacheManager.role.checkPointShow = code == taskCode; 
		}
		this.send("ECmdGameEndTask", { "npc": npcId, "taskCode": taskCode, "choose": choose });
	}

	/**
	 * 获取NPC身上的任务
	 */
	public getNpcTask(npcId: number): void {
		this.send("ECmdGameNpcTask", { "npc": npcId });
	}

	/**
	 * 与Npc对话
	 * @param sProcesscode 任务内容SProcess里面的code
	 */
	public talkToNpc(npcId: number, taskCode: number, sProcesscode: number): void {
		this.send("ECmdGameTalkToNpc", { "npc": npcId, "taskCode": taskCode, "code": sProcesscode });
	}

	/**
	 * 接循环任务
	 */
	public getRingTask(taskGroup: number): void {
		this.send("ECmdGameGetMgRingTask", { "taskGroup": taskGroup });
	}

	/**
	 * 提交循环任务
	 */
	public endRingTask(taskCode: number): void {
		this.send("ECmdGameEndMgRingTask", { "taskCode": taskCode });
	}

	/**
	 * 提交杀怪掉落物品任务
	 */
	public endKillBossDropTask(taskCode: number): void {
		this.send("ECmdGameGetEndKillBossDropItemTask", { "taskCode": taskCode });
	}

	/**
	 * 上交装备
	 */
	public handEquip(uid: string): void {
		this.send("ECmdGameTaskHandEquip", { "uid": uid });
	}
}