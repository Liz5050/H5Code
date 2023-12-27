/**
 * 创建仙盟
 */
class GuildCreateWindow extends BaseWindow {
	private flagList: List;
	private nameInput: fairygui.GTextInput;
	private coinTxt: fairygui.GTextField;
	private coinStatusTxt: fairygui.GRichTextField;
	private propTxt: fairygui.GTextField;
	private propStatusTxt: fairygui.GRichTextField;
	private guildName: string;
	private propItemData: ItemData;
	private isMeetCondition: boolean;

	public constructor() {
		super(PackNameEnum.Guild, "WindowGuildCreate");
	}

	public initOptUI(): void {
		this.coinTxt = this.getGObject("txt_coin").asTextField;
		this.coinStatusTxt = this.getGObject("txt_coin_status").asRichTextField;
		this.propTxt = this.getGObject("txt_prop").asRichTextField;
		this.propStatusTxt = this.getGObject("txt_prop_status").asRichTextField;
		this.flagList = new List(this.getGObject("list_flag").asList);
		this.nameInput = this.getGObject("input_name").asTextInput;
		this.nameInput.addEventListener(egret.Event.CHANGE, this.onNameChanged, this);
		this.getGObject("btn_propGet").addClickListener(this.clickGet, this);
		this.getGObject("btn_propBuy").addClickListener(this.clickBuy, this);
		this.getGObject("btn_create").addClickListener(this.clickCreate, this);
	}

	public updateAll(): void {
		this.flagList.data = [1, 2, 3, 4];
		this.checkCondition();
	}

	/**
	 * 条件检测
	 */
	public checkCondition(): void {
		let moneyCfg: any = ConfigManager.const.getByPk("GuildCreateOptionMPNeedMoney");
		let price: number = moneyCfg.constValue;
		let priceUnit: number = moneyCfg.constValueEx;
		let propCfg: any = ConfigManager.const.getByPk("GuildCreateOptionMPNeedProp");
		let itemCode: number = propCfg.constValue;
		let propNum: number = propCfg.constValueEx;
		//条件检测
		this.coinTxt.text = `${price}${GameDef.EPriceUnitName[priceUnit]}`;
		this.propItemData = new ItemData(itemCode);
		this.propTxt.text = `${propNum}个${this.propItemData.getName(true)}`;
		let isMoneyOk: boolean = MoneyUtil.checkEnough(priceUnit, price, false);
		if (isMoneyOk) {
			this.coinStatusTxt.text = `<font color="#01AB24">(已达成)</font>`;
		} else {
			this.coinStatusTxt.text = `<font color="#DF140F">(未达成)</font>`;
		}
		let propCount: number = CacheManager.pack.backPackCache.getItemCountByCode(itemCode);
		let isPropOk: boolean = propCount >= propNum;
		if (isPropOk) {
			this.propStatusTxt.text = `<font color="#01AB24">(已达成)</font>`;
		} else {
			this.propStatusTxt.text = `<font color="#DF140F">(未达成)</font>`;
		}

		this.isMeetCondition = isMoneyOk && isPropOk;
	}

	private onNameChanged(): void {
		let size: number = 7;
		let tmp: string = App.StringUtils.trimSpace(this.nameInput.text);
		if (App.StringUtils.getStringLength(tmp) > 7) {
			this.nameInput.text = this.guildName.slice(0, 8);
		}
		this.guildName = this.nameInput.text;
	}

	/**
	 * 获取道具
	 */
	private clickGet(): void {
		EventManager.dispatch(UIEventEnum.GuildPropGetWindownOpen);
	}

	private clickBuy(): void {
		EventManager.dispatch(UIEventEnum.ShopBuyOpen, this.propItemData);
	}

	private clickCreate(): void {
		if (!this.isMeetCondition) {
			Tip.showTip("条件未达成");
			return;
		}
		if (this.flagList.selectedIndex == -1) {
			Tip.showTip("请选择旗帜");
			return;
		}
		if (App.StringUtils.getStringLength(this.guildName) == 0) {
			Tip.showTip("仙盟名称不能为空");
			return;
		}
		EventManager.dispatch(LocalEventEnum.GuildCreate, { "name": this.guildName, "flag": this.flagList.selectedData });
		this.hide();
	}
}