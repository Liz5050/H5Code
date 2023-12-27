class MiningRecordItem extends ListRenderer {
    private timeTxt: fairygui.GTextField;
    private recordTxt: fairygui.GRichTextField;
    private revengeBtn: fairygui.GButton;
    private c1: fairygui.Controller;
    private c2: fairygui.Controller;
    public constructor() {
        super();
    }

    protected constructFromXML(xml: any): void {
        super.constructFromXML(xml);
        this.c1 = this.getController('c1');
        this.c2 = this.getController('c2');
        this.timeTxt = this.getChild("txt_time").asTextField;
        this.recordTxt = this.getChild("txt_record").asRichTextField;
        this.revengeBtn = this.getChild("btn_revenge").asButton;
    }

//     message SPlayerMiningRecord
//     optional int32 index_I = 1;
//     optional SEntityId operEntityId = 2;
//     optional string operName_S = 3;
//     optional int32 operType_I = 4;
//     optional int32 operMiner_I = 5;
//     optional int32 value_I = 6;
//     optional int32 valueEx_I = 7;
//     optional int32 operDt_DT = 8;
    public setData(data: any, index: number): void {
        this._data = data;
        this.timeTxt.text = App.DateUtils.formatDate(data.operDt_DT, DateUtils.FORMAT_Y_M_D_HH_MM_SS);
        this.recordTxt.text = MiningCache.makeRecord(data);
        if (data.operType_I == EMiningOperate.EMiningOperateRobbed) {
            if (data.valueEx_I == 0) {//对于被掠夺生效： 0:未复仇， 1：已复仇
                this.revengeBtn.text = LangMining.LANG25;
                this.revengeBtn.addClickListener(this.onClickRevenge, this);
                this.c1.selectedIndex = data.value_I == 1 ? 1 : 0;
                this.c2.selectedIndex = 0;
            } else {
                this.revengeBtn.text = LangMining.LANG26;
                this.revengeBtn.removeClickListener(this.onClickRevenge, this);
                this.c1.selectedIndex = 0;
                this.c2.selectedIndex = 1;
            }
        } else {
            this.c1.selectedIndex = 0;
            this.c2.selectedIndex = 0;
        }
    }

    private onClickRevenge() {
        EventManager.dispatch(UIEventEnum.OpenMiningRevenge, this._data);
    }
}