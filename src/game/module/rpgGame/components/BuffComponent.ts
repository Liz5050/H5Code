class BuffComponent extends Component
{
	private gBuffList:{[stateId:number]:Effect} = {};
	// private gShowBuff:Effect;
	private stateId:number = -1;
	public constructor() 
	{
		super();
	}

	public start():void
	{
		super.start();
		this.updateModelHeight();
	}

	public updateBuff(stateId:number,type:EBufferOp):void
	{
		if(type == EBufferOp.EBufferOpAdd)
		{
			this.addBuff(stateId);
		}
		else if(type == EBufferOp.EBufferOpRemove)
		{
			this.removeBuff(stateId);
		}
	}

	public updateModelHeight():void {
		if(!this.entity || !this.entity.entityInfo || !this.entity.avatar) {
			this.removeAllBuff();
			return;
		}
		let entityInfo:EntityInfo = this.entity.entityInfo;
		let buffIds:number[] = entityInfo.buffers.data_I;
		let serverTime:number = CacheManager.serverTime.getServerTime();
		for(let i:number = 0; i < buffIds.length; i++) {
			let endDt:number = Number(entityInfo.buffersEndDt.data_I[i]);
			if(serverTime < endDt) {
				this.addBuff(buffIds[i]);
			}
		}
	}

	private updatePos(buff:Effect):void {
        if (this.stateId == 2004) return;
		let _head:HeadComponent = this.entity.getComponent(ComponentType.Head) as HeadComponent;
		if(_head) {
			let toX: number = 0;
			let toY: number = -_head.modelHeight;
			
			if (this.stateId == 20110801 || this.stateId == 20110802 || this.stateId == 20110803) {//解救特效
				toY = 0;
				if (this.entity.entityInfo.code_I == 1200019) {//云魅仙鹿特殊处理
					toX = -20;
					toY = -40;
				}
			}
			buff.x = toX;
			buff.y = toY;
		}
	}

	private addBuff(stateId:number):void
	{
		if(!this.entity || !this.entity.avatar) return;
		this.stateId = stateId;
		let _stateCfg:any = ConfigManager.state.getByPk(stateId);
		if(_stateCfg)
		{
			if (_stateCfg.stateModel)
			{
				let buffEffect:Effect = this.gBuffList[stateId];
                if(!buffEffect)
                {
                    buffEffect = ObjectPool.pop("Effect");
					buffEffect.playSimpleEffect(_stateCfg.stateModel,this.entity);
					this.gBuffList[stateId] = buffEffect;
                }
				this.updatePos(buffEffect);
			}
            SkillUtil.playBuffName(_stateCfg, this.entity);
		}
	}

	private removeBuff(stateId:number):void
	{
		if(this.gBuffList[stateId])
		{
			this.gBuffList[stateId].destroy();
			delete this.gBuffList[stateId];
		}
	}

	private removeAllBuff():void {
		for(let id in this.gBuffList)
		{
			this.gBuffList[id].destroy();
			this.gBuffList[id] = null;
		}
		this.gBuffList = {};
	}

	public stop():void
	{
		super.stop();
		this.removeAllBuff();
		this.stateId = -1;
	}
}