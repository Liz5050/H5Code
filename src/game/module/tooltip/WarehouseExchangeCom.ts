class WarehouseExchangeCom extends fairygui.GComponent {
	private txt_score:fairygui.GTextField;
	private number_input:NumberInput;
	private btn_exchange:fairygui.GButton;

	private itemData:ItemData;
	private needScore:number;
	public constructor() {
		super();
	}

	protected constructFromXML(xml:any):void{			
		super.constructFromXML(xml);
		this.txt_score = this.getChild("txt_score").asTextField;
		this.number_input = this.getChild("number_input") as NumberInput;
		this.number_input.showExBtn = true;
		this.number_input.setChangeFun(this.inputTxtChange,this);

		this.btn_exchange = this.getChild("btn_exchange").asButton;
		this.btn_exchange.addClickListener(this.onExchangeHandler,this);
	}

	public setData(itemData:ItemData):void {
		this.itemData = itemData;
		let maxNum:number = this.itemData.getItemAmount();
		this.number_input.max = maxNum;
		this.number_input.value = 1;
		this.inputTxtChange();
	}

	private onExchangeHandler():void {
		let score:number = CacheManager.guildNew.warehouseScore;
		if(this.needScore > score) {
			Tip.showTip(LangGuildNew.L21);
			return;
		}
		ProxyManager.guild.exchangeItem(this.itemData.getUid(),this.number_input.value);
		ToolTipManager.hide();
	}

	private inputTxtChange():void {
		let itemInfo:any = this.itemData.getItemInfo();
		let credit:number = itemInfo.credit > 0 ? itemInfo.credit : 0;
		this.needScore = credit * this.number_input.value;
		let color:number = 0xeee43f;
		if(this.needScore > CacheManager.guildNew.warehouseScore) {
			color = Color.Red2;
		}
		this.txt_score.text = this.needScore + "";
		this.txt_score.color = color;
	}
}