/**
 * 运营礼包实名认证界面
 * @author zhh
 * @time 2018-11-23 16:02:59
 */
class OperatingSMPanel extends BaseTabView{
    private txtDesc:fairygui.GRichTextField;
    private btnOpt:fairygui.GButton;
    private listReward:List;
    private btnIcoLdr:GLoader;
    private nameInput: fairygui.GTextInput;
    private idInput: fairygui.GTextInput;

    private rewardType:number;

	public constructor() {
		super();
        this.rewardType = EShareRewardType.EShareRewardTypeShare;
	}

	protected initOptUI():void{
        //---- script make start ----
        this.txtDesc = this.getGObject("txt_desc").asRichTextField;
        this.btnOpt = this.getGObject("btn_opt").asButton;
        this.listReward = new List(this.getGObject("list_reward").asList);
        this.nameInput = this.getGObject("input_name").asCom.getChild("title").asTextInput;
        this.idInput = this.getGObject("input_id").asCom.getChild("title").asTextInput;
        this.btnIcoLdr = <GLoader>this.btnOpt.getChild("loader_icon");
        this.btnOpt.addClickListener(this.onGUIBtnClick, this);
        //---- script make end ----
        this.nameInput.promptText = "点击填写名字";
        this.idInput.promptText = "点击填写有效身份证";
        this.btnIcoLdr.load(URLManager.getModuleImgUrl(`certification.png`,PackNameEnum.Operating));
        var list = new Array<ItemData>();
        for(let i:number=1;i<=3;i++){
            var cfg = ConfigManager.const.getByPk("IssmReward" + i);            
            var item = new ItemData(cfg.constValue);
            item.itemAmount = cfg.constValueEx;
            list.push(item);
        }
        this.listReward.setVirtual(list);
	}

	public updateAll(data?:any):void{
        
	}

    protected onGUIBtnClick(e:egret.TouchEvent):void{
        this.checkAndSendID();
        
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
            HomeUtil.close(ModuleEnum.Operating);
        }
        else{
            Tip.showRollTip("请输入正确的身份证号码");
        }
    }
    /**
	 * 销毁函数
	 */
	public destroy():void{
		super.destroy();
	}

}