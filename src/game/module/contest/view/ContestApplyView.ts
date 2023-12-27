class ContestApplyView extends fairygui.GComponent {
    private descTxt: fairygui.GRichTextField;
    private applyBtn: fairygui.GButton;
    private s0Btn: fairygui.GButton;
    private s1Btn: fairygui.GButton;
    private s2Btn: fairygui.GButton;
    private s0TimeTxt: fairygui.GTextField;
    private s1TimeTxt: fairygui.GTextField;
    private s2TimeTxt: fairygui.GTextField;

    public constructor() {
        super();
    }

    protected constructFromXML(xml: any): void {
        super.constructFromXML(xml);

        this.descTxt = this.getChild("txt_desc").asRichTextField;
        this.applyBtn = this.getChild("btn_apply").asButton;
        this.applyBtn.addClickListener(this.onClick, this);
        this.s0Btn = this.getChild("btn_s0").asButton;
        this.s1Btn = this.getChild("btn_s1").asButton;
        this.s2Btn = this.getChild("btn_s2").asButton;
        this.s0TimeTxt = this.getChild("txt_s0").asTextField;
        this.s1TimeTxt = this.getChild("txt_s1").asTextField;
        this.s2TimeTxt = this.getChild("txt_s2").asTextField;
        this.descTxt.text = HtmlUtil.colorSubstitude(LangContest.LANG9);
    }

    public update(data:any):void {
        App.DisplayUtils.grayButton(this.applyBtn, data.signUp_B, data.signUp_B);
    }

    private onClick() {
        EventManager.dispatch(LocalEventEnum.ContestReqSign);
    }
}