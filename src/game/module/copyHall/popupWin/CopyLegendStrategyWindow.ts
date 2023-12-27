class CopyLegendStrategyWindow extends BaseWindow {
    private itemList: List;
    public constructor() {
        super(PackNameEnum.Common, "LegendStrategyWindow");
    }

    public initOptUI(): void {
        this.itemList = new List(this.getGObject("list_item").asList);
    }

    public updateAll(data: any = null): void {
        let copyCode:number = data as number;
        let copy:any = ConfigManager.copy.getByPk(copyCode);
        this.title = copy.name;
        let infs:any[] = ConfigManager.copyLegend.getListByCode(copyCode);
        this.itemList.data = infs;
    }

}