class ExChangeWindow extends BaseWindow {
    
    private baseItem : BaseItem;
    private nameTxt : fairygui.GRichTextField;
    private desTxt : fairygui.GRichTextField;;
    private buyBtn : fairygui.GButton;  

    private priceTxt : fairygui.GTextField;
    private totalPriceTxt : fairygui.GTextField;
    private txt_limit : fairygui.GRichTextField;
    protected number_input:NumberInput;
    private needScore : number;
    private mySco:number
    private info :ActivityRewardInfo;
    private leftNum : number;

    public constructor() {
		super(PackNameEnum.ActivityScore,"ExChangeWindow")
	}

    public initOptUI():void{
        this.baseItem = <BaseItem>this.getGObject("baseItem");
        this.baseItem.isShowName = false;
		this.baseItem.touchable = false;
		this.baseItem.enableToolTip = false;

        this.number_input = this.getGObject("number_input") as NumberInput;
		this.number_input.showExBtn = true;
		this.number_input.setChangeFun(this.inputTxtChange,this);

        this.nameTxt = this.getGObject("nameTxt").asRichTextField;
        this.desTxt = this.getGObject("desTxt").asRichTextField;

        this.buyBtn = this.getGObject("buyBtn").asButton;


        this.priceTxt = this.getGObject("priceTxt").asTextField;
        this.totalPriceTxt = this.getGObject("totalPriceTxt").asTextField;
        this.txt_limit = this.getGObject("txt_limit").asRichTextField;

        this.buyBtn.addClickListener(this.clickExChange, this);

	}

    public updateAll(data : any) {
        this.info = data;
        let itemdata = this.info.getItemDatas()[0];
        this.baseItem.setData(itemdata);
        this.nameTxt.text = itemdata.getName(true);
        this.desTxt.text = itemdata.getDesc();
        this.mySco = CacheManager.activity.myBossScore;
        this.needScore = this.info.conds[0];//所需积分
        let excCount:number = this.info.conds[1];//可兑换次数
        let excNum:number = CacheManager.activity.getBossExcNum(this.info.index);
        this.leftNum = Math.max(excCount-excNum,0);
        let isUnLimit:boolean = excCount==-1;
        this.priceTxt.text = this.needScore.toString();
        this.number_input.value = Math.floor(this.mySco / this.needScore);
       
        if(isUnLimit) {
            this.txt_limit.text = `无限制`;
            this.leftNum = 9999;
        }
        else {
            if(this.leftNum > 0) {
                this.txt_limit.text = `限兑：剩余<font color = ${Color.Color_6}>${this.leftNum}</font>份`;  
            }
            else {
                this.txt_limit.text = `限兑：剩余<font color = ${Color.Color_4}>${this.leftNum}</font>份`;  
            }
        }
        if(this.number_input.value > this.leftNum) {
            this.number_input.value = this.leftNum;
        }
        this.totalPriceTxt.text = (this.number_input.value * this.needScore).toString();
        this.inputTxtChange();
    }

    protected inputTxtChange():void {
        let price:number = this.needScore * this.number_input.value;
        if(price > this.mySco) {
            Tip.showLeftTip("已经是最大数量");
            this.number_input.value = Math.floor(this.mySco/this.needScore);
            return;
        }
        if(this.number_input.value > this.leftNum) {
            Tip.showLeftTip("已经是最大数量");
            this.number_input.value = this.leftNum;
            return;
        }
		//let price:number = this.needScore * this.number_input.value;
		if(price > this.mySco) {
			this.totalPriceTxt.color = Color.Red;
		}
		else {
			this.totalPriceTxt.color = 0xFF7610;
		}
		this.totalPriceTxt.text = price + "";
	}

    private clickExChange() {
        let price:number = this.needScore * this.number_input.value;
        if(price > this.mySco) {
            Tip.showLeftTip("积分不足，无法兑换");
            return ;
        }
        if(this.number_input.value > this.leftNum) {
            Tip.showLeftTip("超过限购数量，无法兑换");
            return ;
        }
        EventManager.dispatch(LocalEventEnum.ActivityGetReward,this.info.code,this.info.index,this.number_input.value);
        this.hide();
    }



    


}