/**
 * 天赋装备
 */

class TalentReplaceWindow extends BaseWindow {
    private replaceList:List;

    private itemData: ItemData;
    private roleIndex: number;
    private pos: number;

	public constructor() {
		super(PackNameEnum.TalentCultivate,"TalentReplaceWindow");
        this.modal = true;
	}
	public initOptUI():void{
        this.replaceList = new List(this.getGObject("list_replace").asList);
	}

	public updateAll(data?:any):void{
		this.itemData = new ItemData(data.code);
        this.roleIndex = data.roleIndex;
        this.pos = data.pos;
		this.updateTalent();
	}

    public updateTalent(): void{
        let career: number = CareerUtil.getBaseCareer(CacheManager.role.getRoleCareerByIndex(this.roleIndex));
        let itemDatas:ItemData[] = CacheManager.pack.propCache.getTalentEquipByCareer(career);
        itemDatas.sort(comp);
        function comp(a:ItemData,b:ItemData):number{
            let scroeA:number = WeaponUtil.getScoreBase(a);
            let scroeB:number = WeaponUtil.getScoreBase(b);
            if(scroeA > scroeB){
                return -1; //评分高的在前面
            }else if(scroeA < scroeB){
                return 1;
            }
            return 0;
        }

        let equipDatas:any[] = [];
		let isReplace: boolean = false;
        if(ItemsUtil.isTrueItemData(this.itemData)){
			isReplace = true;
            equipDatas.push({"item":this.itemData, "roleIndex":this.roleIndex ,"pos": this.pos, "isDress": true, "isReplace": isReplace});
        }
        for(let i = 0; i<itemDatas.length;i++){
            equipDatas.push({"item":itemDatas[i], "roleIndex":this.roleIndex ,"pos": this.pos, "isDress": false, "isReplace": isReplace})
        }
        this.replaceList.setVirtual(equipDatas);
        if(equipDatas.length>0){
            this.replaceList.scrollToView(0);
        }
    }
}