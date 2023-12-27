class AIBase {
	protected 	data: any;
	protected 	callBack: CallBack;
	protected 	frameCount:number;
	protected 	frameHold:number = 1;
	protected	delay:number = 0;
	private 	_aiType:AIType;
	protected   king:MainPlayer;

	public constructor(data: any) {
		this.data = data;
		this.delay = (data && data.delay) || 0;
		this.frameCount = 0;
		if(data != null){
			this.callBack = data.callBack;
		}
	}

	/**
	 * 检查是否已完成
	 * @param data 数据
	 * @returns true 已完成
	 */
	public isComplete(data?: any): boolean {
		return false;
	}

	/**
	 * 更新
	 * @param data 数据
	 * @returns true表示已完成
	 */
	public update(data?: any): boolean {
		
	    this.frameCount++;
		if(this.delay > this.frameCount * 17)
		{
			return false;
		}
		return this.frameCount == 1 || this.frameCount % this.frameHold == 0;
	}

	/**
	 * 执行完成后回调
	 */
	public onComplete(): void {
		if (this.callBack != null) {
			this.callBack.fun.call(this.callBack.caller);
		}
	}

    /**
     * 停止
     */
    public stop(): void {
    }

	/**
	 * 增加AI
	 */
	public addAI(type: AIType, data?: any): void {
		EventManager.dispatch(LocalEventEnum.AIAdd, { "type": type, "data": data });
	}

	public set aiType(type: AIType) {
		this._aiType = type;
	}

	public get aiType() : AIType {
		return this._aiType;
	}
}