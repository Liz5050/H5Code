/**
 * 必杀系统 碎片兑换
 */

class UniqueSkillChipExchangeWindow extends BaseWindow{
	private seniorChipItem: BaseItem;
	private juniorChipItem: BaseItem;
	private seniorChipTxt: fairygui.GTextField;
	private juniorChipTxt: fairygui.GTextField;
	private numberInput: NumberInput;
	private transitionBtn: fairygui.GButton;
	private oneKeyBtn: fairygui.GButton;

	public constructor() {
		super(PackNameEnum.UniqueSkill, "WindowChipExchange");
	}

	public initOptUI():void{
		this.seniorChipItem = <BaseItem>this.getGObject("highChipItem");
		this.juniorChipItem = <BaseItem>this.getGObject("lowChipItem");
		this.seniorChipTxt = this.getGObject("txt_highChip").asTextField;
		this.juniorChipTxt = this.getGObject("txt_lowChip").asTextField;
		this.numberInput = <NumberInput>this.getGObject("numberInput");
		this.transitionBtn = this.getGObject("btn_transition").asButton;
		this.oneKeyBtn = this.getGObject("btn_onKeyTransition").asButton;

		this.numberInput.setKeyBoard(false);
		this.numberInput.setChangeFun(this.inputTxtChange,this);
		this.numberInput.minTipStr = "";
		this.numberInput.maxTipStr = "高级必杀精华不足";

		this.transitionBtn.addClickListener(this.clickTransitionBtn, this);
		this.oneKeyBtn.addClickListener(this.clickoneKeyBtn, this);
	}

	public updateAll(): void{
		this.updateItem();
	}

	public moneyUpdate(): void{
		this.numberInput.max = CacheManager.role.getMoney(EPriceUnit.EPriceUnitKillFragmentSenior);
		this.seniorChipItem.updateNum(`${CacheManager.role.getMoney(EPriceUnit.EPriceUnitKillFragmentSenior)}`);
		if(CacheManager.role.getMoney(EPriceUnit.EPriceUnitKillFragmentSenior) == 0){
			this.numberInput.value = 0;
			this.inputTxtChange();
		}
	}

	/**点击转换 */
	private clickTransitionBtn(): void{
		if(this.numberInput.value == 0){
			Tip.addTip("高级必杀精华不足");
		}else{
			ProxyManager.uniqueSkill.exchangeKillFragment(this.numberInput.value);
		}
	}

	/**点击一键转换 */
	private clickoneKeyBtn(): void{
		if(CacheManager.role.getMoney(EPriceUnit.EPriceUnitKillFragmentSenior) == 0){
			Tip.addTip("高级必杀精华不足");
		}else{
			ProxyManager.uniqueSkill.exchangeKillFragment(CacheManager.role.getMoney(EPriceUnit.EPriceUnitKillFragmentSenior));
		}
	}

	private inputTxtChange(): void{
		this.juniorChipItem.updateNum(`${this.numberInput.value*100}`);
	}

	private updateItem(): void{
		this.seniorChipItem.itemData = new ItemData(ItemCodeConst.KillFragmentSenior);
		this.seniorChipItem.updateNum(`${CacheManager.role.getMoney(EPriceUnit.EPriceUnitKillFragmentSenior)}`);
		this.seniorChipItem.txtName.visible = false;
		this.seniorChipItem.touchable = false;
		this.juniorChipItem.itemData = new ItemData(ItemCodeConst.KillFragmentJunior);
		this.juniorChipItem.updateNum(`0`);
		this.juniorChipItem.txtName.visible = false;
		this.juniorChipItem.touchable = false;

		this.seniorChipTxt.color = Color.ItemColorHex[this.seniorChipItem.itemData.getColor()];
		this.juniorChipTxt.color = Color.ItemColorHex[this.juniorChipItem.itemData.getColor()];

		this.numberInput.max = CacheManager.role.getMoney(EPriceUnit.EPriceUnitKillFragmentSenior);
		this.numberInput.min = 0;
		this.numberInput.value = 0;
		this.inputTxtChange();
	}
}