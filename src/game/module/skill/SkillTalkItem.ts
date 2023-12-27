class SkillTalkItem extends fairygui.GComponent {
    private contentTxt: fairygui.GRichTextField;
    public constructor(){
        super();
    }

    protected constructFromXML(xml: any): void {
        super.constructFromXML(xml);
        this.contentTxt = this.getChild("txt_content").asRichTextField;
    }

    public set content(value:string) {
        this.contentTxt.text = value;
    }
}