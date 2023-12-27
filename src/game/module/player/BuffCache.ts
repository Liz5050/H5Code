/**
 * 主角buff
 */
class BuffCache {

	/**疲劳buffid */
	public static TIRE_BUFF_ID:number = 57000001;
    /**{roleIndex : {buffid : buff}} */
	private buffers = {}
	/**保存buff类型的buff数量 {roleIndex : {bufftype : num}}*/
	private bufferTypeDict = {}
	/**疲劳buff信息 {num:,dt:} */
	public bossTireBuf:any;
	public constructor() {
		this.bossTireBuf = {num:0,dt:0};
	}

	/**
	 * 获取需要显示的buff
	 */
	public getShowBuffs(roleIndex:number = 0): Array<any> {
        let buffers = {};
        let bufferGroupIndex = {};
        let buff: any;
        let i: number = 0;
		let roleBuffers:any = this.buffers[roleIndex];
		for (let id in roleBuffers) {
			buff = roleBuffers[id];
			if (buff && buff.bufferInfo.icon.length > 0 && buff.bufferInfo.icon != "0") {//存在且配置了图标
				//buff组处理，同一组buff，只显示序号最小
				let group: number = buff.bufferInfo.group;
				if (group > 0) {
					if (bufferGroupIndex[group]) {
						let index: number = bufferGroupIndex[group];
						if (buffers[index].bufferInfo.stateId > buff.bufferInfo.stateId) {
							buffers[index] = buff;
						}
					} else {
						i++;
						bufferGroupIndex[group] = i;
						buffers[i] = buff;
					}
				} else {
					i++;
					buffers[i] = buff;
				}
			}
		}

		let buffs: Array<any> = [];
		for (let key in buffers) {
			buffs.push(buffers[key]);
		}
		//添加boss疲劳特殊buff
        let tireBuf:any = this.getTireBuff();
		if(tireBuf){
			buffs.push(tireBuf);
		}
		return buffs;
	}

	public updateBuff(bufferMsg: any) {
		let updateType: number = bufferMsg.updateType_I;
		let roleIndex: number = bufferMsg.index_I;
		if (!this.buffers[roleIndex]) {
			this.buffers[roleIndex] = {};
            this.bufferTypeDict[roleIndex] = {};
		}

		let bufferId = 0;
		let bufferInfo = null;
		let roleBuffers:any = this.buffers[roleIndex];
		let roleBufferTypeDic:any = this.bufferTypeDict[roleIndex];
		let entity:RpgGameObject = CacheManager.king.getRoleEntity(roleIndex);
		for (let b of bufferMsg.buffers.data) {
			bufferId = b.code_I;
			
			if (updateType == 1) {//add
				bufferInfo = ConfigManager.state.getByPk(bufferId);
				if (!bufferInfo) {
					continue;
				}
                roleBuffers[bufferId] = { "sBuffer": b, "bufferInfo": bufferInfo };
				if (roleBufferTypeDic[bufferInfo.type]) {
                    roleBufferTypeDic[bufferInfo.type] += 1;
				} else {
                    roleBufferTypeDic[bufferInfo.type] = 1;
				}
			}
			else if (updateType == 2) {//update
				if (roleBuffers[bufferId]) {
                    roleBuffers[bufferId].sBuffer = b;
				}

			} else if (updateType == 3) {//remove
				bufferInfo = ConfigManager.state.getByPk(bufferId);
				if (!bufferInfo) {
					continue;
				}
                roleBuffers[bufferId] = null;
				if (roleBufferTypeDic[bufferInfo.type]) {
                    roleBufferTypeDic[bufferInfo.type] -= 1;
					if (roleBufferTypeDic[bufferInfo.type] < 0) {
                        roleBufferTypeDic[bufferInfo.type] = 0;
					}
				}
			}
			let info:any = {buffId:bufferId, type:updateType};
            entity && entity.updateBuff(info);
			if(CacheManager.copy.isInCopyByType(ECopyType.ECopyMgNormalDefense)){ //目前就守卫神剑用到
				info.roleIndex = roleIndex;
				EventManager.dispatch(NetEventEnum.RoleBuffUpdate,info);
			}
			
		}
	}

	public getTireBuff():any{
		if(this.bossTireBuf && this.bossTireBuf.num>0){
            let inf:any = this.addBuffById(BuffCache.TIRE_BUFF_ID,{endDt_DT:this.bossTireBuf.dt});
			inf.num = this.bossTireBuf.num;
			return inf;
		}
		return null;
	}
	public addBuffById(buffId:number,sBuffer:any):any{
		let buf:any = {"sBuffer": sBuffer, "bufferInfo": ConfigManager.state.getByPk(buffId)};
		return buf;
	}
	public isHasBuffById(buffId:number, roleIndex:number = 0):boolean{
		return this.buffers[roleIndex] && this.buffers[roleIndex][buffId];
	}

	public isHasBuffByType(type:number, roleIndex:number = 0):boolean{
		let roleBufferTypeDic:any = this.bufferTypeDict[roleIndex];
        let n:number = roleBufferTypeDic && roleBufferTypeDic[type]?roleBufferTypeDic[type]:0;
		return n>0;
	}

	public setBossTireBuf(data:any):void{

		this.bossTireBuf.num = data.val_I;
		this.bossTireBuf.dt = data.dateVal_DT;
	}

	/**疲劳buff满5层 */
	public isTireFull():boolean{
		return this.bossTireBuf && this.bossTireBuf.num>=5;
	}

    /**是否有中断攻击的buff */
	public hasInterruptAttackBuff(roleIndex:number):boolean {
		return this.isHasBuffByType(EStateType.EStateGiddiness, roleIndex);
	}

    /**是否有中断移动的buff */
	public hasInterruptMoveBuff(roleIndex:number):boolean {
		return this.isHasBuffByType(EStateType.EStateGiddiness, roleIndex);
	}

	public getBuffers(): any {
		return this.buffers;
	}

	

}