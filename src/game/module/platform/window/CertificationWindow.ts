class CertificationWindow extends BaseWindow {

    private nameInput: fairygui.GTextInput;
    private idInput: fairygui.GTextInput;
    private btn_comfirm : fairygui.GButton;

    public constructor() {
        super(PackNameEnum.MicroClient , "CertificationWindow");
    }
    
    public initOptUI() : void {
        this.nameInput = this.getGObject("input_name").asCom.getChild("title").asTextInput;
        this.idInput = this.getGObject("input_id").asCom.getChild("title").asTextInput;
        this.btn_comfirm = this.getGObject("btn_confirm").asButton;
        this.btn_comfirm.addClickListener(this.checkAndSendID, this);
        this.nameInput.promptText = "点击填写名字";
        this.idInput.promptText = "点击填写有效身份证";
    }




    public updateAll( data : any) {

    }   


    public checkAndSendID() : void {
        var reg = /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}[0-9Xx]$)/;
        if(!this.nameInput.text || this.nameInput.text == "") {
            Tip.showRollTip("请输入姓名");
            return;
        }
        else {
            if(App.StringUtils.getStringLength(this.nameInput.text)<2) {
                Tip.showRollTip("请输入真实姓名");
                return;
            }
            if(!App.StringUtils.isChineseAll(this.nameInput.text)) {
                Tip.showRollTip("请输入真实姓名");
                return;
            }
        }
        
        if(!this.idInput.text || this.idInput.text == "") {
            Tip.showRollTip("请输入身份证号码");
            return;
        }
        if(reg.test(this.idInput.text)) {
            //todo 发送验证
            EventManager.dispatch(LocalEventEnum.CertificationSend,this.nameInput.text,this.idInput.text);
        }
        else{
            Tip.showRollTip("请输入正确的身份证号码");
        }
    }
}