/**
 * 背包扩展数据处理
 */
class PackCapacityChangeCommand implements ICommand{
	public constructor() {
	}

	public onMessage(data:any, msgId:number):void{
		EventManager.dispatch(UIEventEnum.PackExtendHide);
		let packCache:PackBaseCache = CacheManager.pack.getPackCacheByPosType(data.posType_I);
		let value:number = data.newCapacity_I - packCache.capacity;
		packCache.capacity = data.newCapacity_I;
		// for(let i = 0; i < value; i++){
		// 	packCache.allItems.push(ItemDataEnum.empty);
		// }
		
		EventManager.dispatch(NetEventEnum.packPosTypeBagCapacityChange);
	}
}