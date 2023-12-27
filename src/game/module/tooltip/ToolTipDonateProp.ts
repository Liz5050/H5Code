class ToolTipDonateProp extends ToolTipBase {
	private c1:fairygui.Controller;
	private baseItem:BaseItem;
	private txt_name:fairygui.GRichTextField;
	private txt_count:fairygui.GRichTextField;
	private txt_level:fairygui.GRichTextField;
	private txt_score:fairygui.GRichTextField;
	private txt_des:fairygui.GRichTextField;
	private txt_totalScore:fairygui.GTextField;

	private number_input:NumberInput;

	private btn_donate:fairygui.GButton;
	private btn_use:fairygui.GButton;

	private uid: string;
	private itemCode:number;
	private itemData:ItemData;
	public constructor() {
		super(PackNameEnum.Common, "ToolTipDonateProp");
	}

	public initUI(): void {
		super.initUI();
		this.c1 = this.getController("c1");
		this.baseItem = <BaseItem>this.getGObject("baseItem");
		this.baseItem.touchable = false;
		this.baseItem.isShowName = false;
		this.number_input = this.getGObject("number_input") as NumberInput;
		this.number_input.showExBtn = true;
		this.number_input.setChangeFun(this.inputTxtChange,this);
		this.txt_name = this.getGObject("txt_name").asRichTextField;
		this.txt_count = this.getGObject("txt_count").asRichTextField;
		this.txt_level = this.getGObject("txt_level").asRichTextField;
		this.txt_score = this.getGObject("txt_score").asRichTextField;
		this.txt_totalScore = this.getGObject("txt_totalScore").asTextField;

		this.txt_des = this.getGObject("txt_des").asRichTextField;
		this.btn_use = this.getGObject("btn_use").asButton;
		this.btn_use.addClickListener(this.useItem, this);

		this.btn_donate = this.getGObject("btn_donate").asButton;
		this.btn_donate.addClickListener(this.onDonateHandler,this);
	}

	public setToolTipData(toolTipData: ToolTipData) {
		super.setToolTipData(toolTipData);
		if (toolTipData) {
			this.itemData = <ItemData>toolTipData.data;
			let itemInfo:any = this.itemData.getItemInfo();
			let maxNum:number = this.itemData.getItemAmount();
			this.uid = this.itemData.getUid();
			this.itemCode = this.itemData.getCode();
			this.baseItem.itemData = this.itemData;

			let usage: string = this.itemData.getUsageDesc();
			usage = usage != undefined ? "\n\n" + HtmlUtil.br(this.itemData.getUsageDesc()) : "";
			this.txt_des.text = this.itemData.getDesc() + usage;
			this.txt_des["renderNow"]();

			this.txt_name.text = this.itemData.getName(true);
			
			this.txt_count.text = HtmlUtil.colorSubstitude(LangCommon.L21,maxNum);
			this.txt_level.text = HtmlUtil.colorSubstitude(LangCommon.L22,this.itemData.getLevel());
			this.txt_score.text = HtmlUtil.colorSubstitude(LangCommon.L23,itemInfo.credit);

			this.number_input.max = maxNum;
			this.number_input.value = maxNum;
			this.txt_totalScore.text = (itemInfo.credit * this.number_input.value) + "";

			if(toolTipData.source != ToolTipSouceEnum.Pack) {
				this.c1.selectedIndex = 0;
			}
			else {
				this.c1.selectedIndex = 1;
			}
		}	
	}

	private useItem():void {
		let value: number = this.number_input.value;
		ProxyManager.pack.useItem(this.uid, value, []);
		this.hide();
	}

	private onDonateHandler():void {
		if(!CacheManager.guildNew.isJoinedGuild()) {
			Tip.showTip(LangGuildNew.L12);
			return;
		}
		ProxyManager.guild.donateItem(this.itemCode,this.uid,this.number_input.value);
		this.hide();
	}

	private inputTxtChange():void {
		let itemInfo:any = this.itemData.getItemInfo();
		this.txt_totalScore.text = (itemInfo.credit * this.number_input.value) + "";
	}
}