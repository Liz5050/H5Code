class MonthCardExpCom extends fairygui.GComponent {

    private text_leftTime : fairygui.GRichTextField;
    private card_icon : GLoader;
    private c1 : fairygui.Controller;
    private showStartTime : number;


    public constructor() {
		super();
	}


    protected constructFromXML(xml:any):void{			
		super.constructFromXML(xml);
        this.text_leftTime = this.getChild("leftTime").asRichTextField;
        this.card_icon = <GLoader>this.getChild("monthCard");
        this.card_icon.addClickListener(this.clickIcon, this);
        this.card_icon.touchable = true;
        this.c1 = this.getController("c1");
        this.c1.setSelectedIndex(0);
        this.showStartTime = -1;
	}

        
    private count(onlyShowDay:boolean = false) {
        let lefttime:number = CacheManager.welfare2.privilegeCardLeftTime;
        if (lefttime <= 0) {
            this.timer(false);
            this.visible = false;
            this.timer(false);
            //this.updateAll();
            return;
        }
        //this.leftDay = App.DateUtils.getDay(CacheManager.welfare2.privilegeCardLeftTime);
        let format:string = DateUtils.FORMAT_1;
        if (onlyShowDay && (typeof onlyShowDay) == "boolean") format = DateUtils.FORMAT_3;
        this.text_leftTime.text = App.StringUtils.substitude(LangWelfare.LANG10
            , App.DateUtils.getTimeStrBySeconds(lefttime, format));
        if(this.showStartTime > 0) {
            if(Date.now() - this.showStartTime >= 10000) {
                this.c1.selectedIndex = 0;  
                this.showStartTime = -1; 
            }
        }
    }

    private timer(value: boolean) {
        if (value) {
            App.TimerManager.doTimer(1000, 0, this.count, this);
        } else {
            App.TimerManager.remove(this.count, this);
        }
    }

    public updateCardInfo(show : boolean) {
        this.timer(show);
    }

    public clickIcon() {
        if(this.c1.selectedIndex == 0) {
            this.c1.selectedIndex = 1;
            this.showStartTime = Date.now();
        }
        else {
            this.c1.selectedIndex = 0;  
            this.showStartTime = -1; 
        }
    }




	
}