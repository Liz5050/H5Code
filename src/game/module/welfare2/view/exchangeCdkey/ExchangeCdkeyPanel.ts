/**
 * 激活码
 * @author zhh
 * @time 2018-08-14 11:48:25
 */
class ExchangeCdkeyPanel extends BaseTabView{
    private loaderBg:GLoader;
    private txtInput:fairygui.GTextField;
    private btnGet:fairygui.GButton;
    private clickCd:number = 0;
	public constructor() {
		super();
	}

	protected initOptUI():void{
        //---- script make start ----
        this.loaderBg = <GLoader>this.getGObject("loader_bg");
        this.txtInput = this.getGObject("txt_input").asTextField;
        this.btnGet = this.getGObject("btn_get").asButton;
        this.txtInput.addEventListener(egret.Event.CHANGE,this.onInputChange,this);	
        this.btnGet.addClickListener(this.onGUIBtnClick, this);
        //---- script make end ----
        //this.loaderBg.load(URLManager.getModuleImgUrl("cdkeybg.jpg",PackNameEnum.Welfare2));

	}
	public updateAll(data?:any):void{
	}
    private onInputChange(e:any):void{
        this.clickCd = 0;
    }
    protected onGUIBtnClick(e:egret.TouchEvent):void{
        var btn: any = e.target;
        switch (btn) {
            case this.btnGet:
                let reg:RegExp = /^[a-z0-9]+$/ig;                
                //let reg:RegExp = /[^\w\/]+/ig;                
                if(reg.test(this.txtInput.text)){
                    let nowTick:number = egret.getTimer();
                    if(this.clickCd>nowTick){
                        Tip.showLeftTip("正在验证激活码，请稍候");
                        return;
                    }
                    this.clickCd = nowTick+3000; //cd三秒
                    let data:any = {};
                    data.sid = Sdk.player_data.server_id;  //服id
                    data.pwd = this.txtInput.text;  //媒体卡号
                    data.player_id = CacheManager.role.entityInfo.entityId.id_I;  //玩家角色ID
                    Sdk.exchangeCdkey(data);
                }else{
                    Tip.showLeftTip("请输入有效的激活码");
                }
                break;

        }
    }
 	
    /**
	 * 销毁函数
	 */
	public destroy():void{
		super.destroy();
        this.clickCd = 0;
	}

}