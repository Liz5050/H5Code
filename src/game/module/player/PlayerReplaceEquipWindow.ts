/**
 * 更换装备窗口
 * @author zhh
 * @time 2018-05-22 16:27:31
 */
class PlayerReplaceEquipWindow extends BaseWindow {
    private listReplace:List;

	public constructor() {
		super(PackNameEnum.Player,"WindowReplace");
        this.modal = true;
	}
	public initOptUI():void{
        //---- script make start ----
        this.listReplace = new List(this.getGObject("list_replace").asList);
        //---- script make end ----

	}

	public updateAll(data?:any):void{
		var item:ItemData = <ItemData>data.item;
        var roleIndex:number = data.roleIndex;//item.getRoleIndex(); 
        var dressPos:number = data.dressPos;//ItemsUtil.getEqiupPos(item);
               
        var itemDatas:ItemData[] = CacheManager.pack.backPackCache.getEquipByDressPos(dressPos,roleIndex);
        itemDatas.sort(comp);
        
        let hightEquips:ItemData[] = CacheManager.pack.backPackCache.getEquipByDressPos(dressPos,roleIndex,true);       
        hightEquips.sort(comp);
        function comp(a:ItemData,b:ItemData):number{
            var ret:number = 0;
            var scroeA:number = WeaponUtil.getScoreBase(a);
            var scroeB:number = WeaponUtil.getScoreBase(b);
            if(scroeA>scroeB){
                ret = -1; //评分高的在前面
            }else if(scroeA<scroeB){
                ret = 1;
            }
            return ret;
        }
        if(item){
            itemDatas.unshift(item);
        }
        if(hightEquips.length>0){
            itemDatas = itemDatas.concat(hightEquips);
        }        
        var listData:any[] = [];
        for(var i:number = 0; i<itemDatas.length;i++){
            listData.push({item:itemDatas[i],roleIndex:roleIndex})
        }
        this.listReplace.setVirtual(listData);
        if(listData.length>0){
            this.listReplace.scrollToView(0);
        }
	}


}