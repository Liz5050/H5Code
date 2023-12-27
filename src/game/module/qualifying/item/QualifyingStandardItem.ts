class QualifyingStandardItem extends ListRenderer {
    private c1: fairygui.Controller;//0未领取1已领取
    private itemList: List;
    private standardTxt: fairygui.GRichTextField;
    private getBtn: fairygui.GButton;

    public constructor() {
        super();
    }

    protected constructFromXML(xml: any): void {
        super.constructFromXML(xml);
        this.c1 = this.getController('c1');
        this.itemList = new List(this.getChild("list_item").asList);

        this.standardTxt = this.getChild("txt_standard").asRichTextField;
        this.getBtn = this.getChild('btn_get').asButton;
        this.getBtn.addClickListener(this.onClick, this);

    }

    public setData(data: any, index: number): void {
        this._data = data;
        this.itemIndex = index;

        this.standardTxt.text = HtmlUtil.colorSubstitude(LangQualifying.LANG47, data.goalNum);
        this.itemList.data = RewardUtil.getStandeRewards(data.rewards);
    }

    public updateFlag(data:any):void {
        let gotList:number[] = data.goalGetList.data_I;
        if (gotList.indexOf(this._data.goalNum) != -1) {
            this.c1.selectedIndex = 2;
        } else if (data.goalNum_I >= this._data.goalNum) {
            this.c1.selectedIndex = 1;
        } else {
            this.c1.selectedIndex = 0;
        }
    }

    private onClick() {
        EventManager.dispatch(LocalEventEnum.QualifyingReqGetGoalReward, this._data.goalNum);
    }
}