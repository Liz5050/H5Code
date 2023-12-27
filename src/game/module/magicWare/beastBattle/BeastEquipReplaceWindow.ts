class BeastEquipReplaceWindow extends BaseWindow {
    private controller: fairygui.Controller;
    private replaceList: List;
    private lotteryBtn: fairygui.GButton;

    private beastHold: any;

    public constructor() {
        super(PackNameEnum.BeastBattle, "BeastEquipReplaceWindow");
    }

    public initOptUI(): void {
        this.controller = this.getController("c1");
        this.replaceList = new List(this.getGObject("list_replace").asList);
        this.lotteryBtn = this.getGObject("btn_lottery").asButton;
		this.lotteryBtn.addClickListener(this.clickLotteryBtn, this);
    }

    public updateAll(data?: any): void {
        this.beastHold = data;
        let item:ItemData;
        if(data.itemCode_I){
            item = new ItemData(data);
        }
        let holeId: number = this.beastHold.holeData.holeId;
        let colorEx: number = data.holeData.colorEx ? data.holeData.colorEx : 0;
        let itemDatas: ItemData[] = CacheManager.pack.propCache.getBeastEquips(data.holeData.color, colorEx, data.holeData.star, data.holeData.type);
        itemDatas.sort(comp);
        
        function comp(a: ItemData, b: ItemData): number {
            var ret: number = 0;
            var scroeA: number = WeaponUtil.getCombat(WeaponUtil.getBeastEquipAttrDict(a));
            var scroeB: number = WeaponUtil.getCombat(WeaponUtil.getBeastEquipAttrDict(b));
            if (scroeA > scroeB) {
                ret = -1; //评分高的在前面
            } else if (scroeA < scroeB) {
                ret = 1;
            }
            return ret;
        }
        
        let listData: any[] = [];
        let dressScore: number = 0;
        if (item) {
            listData.push({item: item, beastCode: data.holeData.code, isDressed: true, holeId: holeId});
            dressScore = WeaponUtil.getCombat(WeaponUtil.getBeastEquipAttrDict(item)) * CacheManager.role.roles.length;
        }
        for (let i: number = 0; i < itemDatas.length; i++) {
            listData.push({item: itemDatas[i], beastCode: data.holeData.code, dressScore: dressScore});
        }

        this.replaceList.setVirtual(listData);
        if (listData.length > 0) {
            this.replaceList.scrollToView(0);
        }

        if(listData.length > 0){
			this.controller.selectedIndex = 0;
		}else{
			this.controller.selectedIndex = 1;
		}
    }

    /**点击打开符文塔 */
	private clickLotteryBtn(): void{
		EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Boss, { "tabType": PanelTabType.SecretBoss });
		this.hide();
	}

}