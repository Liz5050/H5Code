class AI {
	private static aiList: Array<AIBase> = [];
	private static rootAI:AIBase;

	public static addAI(type: AIType, data?: any): AIBase {
		let ai: AIBase = AI.genAI(type, data);
		if (ai != null) {
			ai.aiType = type;
			// AI.dispathAutoPath(ai,false);
			AI.aiList.push(ai);
		}
		return ai;
	}

	public static removeAI(aiType: AIType): void {
		if (AI.rootAI && AI.rootAI.aiType == aiType)
		{
			AI.stop();
			return;
        }
        AI.removeAIByType(aiType);
	}

	public static removeAIByType(aiType: AIType):void{
		let ai: AIBase;
		let flag:boolean = true;
        for (let i = AI.aiList.length - 1; i >= 0; i--) {
            ai = AI.aiList[i];
            if (ai.aiType == aiType) {
				flag = true;
                AI.aiList.splice(i, 1);
                break;
            }
        }
		
	}

	/**
	 * 重新开始新的AI
	 */
	public static start(type: AIType, data?: any): void {
		AI.stop();
		AI.rootAI = AI.addAI(type, data);
	}

	/**
	 * 停止
	 */
	public static stop(): void {
		/*while(AI.aiList.length){
			var ai:AIBase = AI.aiList.splice(0,1)[0];
			AI.dispathAutoPath(ai,true);
		}*/
        AI.aiList.length = 0;
        AI.rootAI && AI.rootAI.stop();
		AI.rootAI = null;
        if (CacheManager.king.isAutoFighting)
        {
            CacheManager.king.isAutoFighting = false;
            EventManager.dispatch(LocalEventEnum.AutoFightChange);
            Log.trace(Log.RPG, "AI-Stop=>挂机停止了0");
        }
	}

	public static get aiListLength(): number {
		return AI.aiList.length;
	}

	public static get aiListArr(): Array<AIBase> {
		return AI.aiList;
	}

	public static get jumpOverGoOnAI(): boolean {
		let value: boolean = false;
		for (let ai of AI.aiList) {
			switch (ai.aiType) {
				case AIType.MoveToNpc:
				case AIType.Collect:
				case AIType.AutoFight:
					return true;
			}
		}
		return false;
	}

	/**
	 * 从最后一个开始执行，执行完成后删除
	 */
	public static run(...params): void {
		for (let i = 0; i < AI.aiList.length; i++) {
			let ai = AI.aiList[i];
			if (i == AI.aiList.length - 1) {
				if (ai.update() && AI.aiList[i] == ai) {
					AI.aiList.splice(i, 1);
				}
			}
		}
	}

	public static stopFightAI():void {
		for (let i = AI.aiList.length - 1; i >= 0; i--) {
			if(AI.aiList[i].aiType == AIType.AutoFight) {
				AI.aiList.splice(i, 1)[0].stop();
			}
		}
	}

	public static get canAddAIPickUp():boolean {
		if(CacheManager.copy.isInCopyByType(ECopyType.ECopyWorldBoss)) return false;//限时世界boss中不能添加拾取AI
		if(!AI.aiList || AI.aiList.length == 0) return true;
		return AI.aiList[AI.aiList.length - 1].aiType != AIType.PickUp;
	}

	private static genAI(type: AIType, data?: any): AIBase {
		let ai: AIBase;
		switch (type) {
			case AIType.Move:
				ai = new AIMove(data);
				break;
			case AIType.Route:
				ai = new AIRoute(data);
				break;
			case AIType.MoveToNpc:
				ai = new AIMoveToNpc(data);
				break;
			case AIType.ClickEntity:
				ai = new AIClickEntity(data);
				break;
			case AIType.Collect:
				ai = new AICollect(data);
				break;
			case AIType.AutoFight:
				ai = new AIAutoFight(data);
				break;
			case AIType.RouteBossHook:
				ai = new AIRouteBossHook(data);
				break;
			case AIType.PickUp:
				if(CacheManager.map.isPickUpAll()) {
					break;
				}
				ai = new AIPickUp(data);
				break;
			case AIType.MoveToMonster:
				ai = new AIMoveToMonster(data);
				break;
			case AIType.MoveToPassPoint:
				ai = new AIMoveToPassPoint(data);
				break;
			case AIType.MoveToMiner:
				ai = new AIMoveToMiner(data);
				break;
			case AIType.MoveToExpPos:
				ai = new AIMoveToExpPostion(data);
				break;
			case AIType.MoveToDrop:
				ai = new AIMoveToDrop(data);
				break;
		}
		return ai;
	}

	/**派发自动寻路事件 */
	private static dispathAutoPath(ai:AIBase,isEnd:boolean):void{
		if(ai.aiType==AIType.Move){
			EventManager.dispatch(LocalEventEnum.AIAutoPath,isEnd);
		}
	}

}