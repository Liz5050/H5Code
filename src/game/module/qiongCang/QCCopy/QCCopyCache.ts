/**穹苍幻境数据 */
class QCCopyCache implements ICache{
	/**我通关副本层数据 */
	private _floorList:any[];
	public constructor() {
		this._floorList = [];
	}

	/**服务器下推列表 */
	public setFloorList(data:any,isUpd:boolean):void{
		if(isUpd){
			this.updateOne(data);
		}else if(data.msgs && data.msgs.data){
			// SQiongCangMsg 
			this._floorList = data.msgs.data;
		}
		App.ArrayUtils.sortOn(this._floorList,"floor_I",true);
	}

	public get floorList():any[]{
		return this._floorList;
	}
	/**
	 * 判断某层是否领取了S评价奖励
	 */
	public isFloorGet(floor:boolean):boolean{
		let flag:boolean = false;
		for(let info of this._floorList){
			if(info.floor_I==floor && this.isMaxStar(info)){ //三星通关
				flag = true;
				break;
			}
		}
		return flag;
	}

	public isMaxStar(floorInfo:any):boolean{
		return floorInfo && floorInfo.star_I==3;
	}

	public checkTips():boolean{
		let ln:number = CacheManager.copy.getEnterLeftNum(CopyEnum.CopyQC);
		return ln>0; 
	}

	/**SQiongCangMsg */
	private updateOne(msg:any):void{
		for(let i:number=0;i<this._floorList.length;i++){
			let info:any = this._floorList[i];
			if(info.floor_I == msg.floor_I){
				this._floorList[i] = msg;
				return;
			}
		}		
		this._floorList.push(msg);
	}

	public clear():void{
		this._floorList = [];
	}
}