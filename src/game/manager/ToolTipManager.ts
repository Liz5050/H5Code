class ToolTipManager {
	private static current: ToolTipBase;
	private static map: any = {};

	public static show(toolTipData: ToolTipData): ToolTipBase {
		ToolTipManager.hide();
		if (toolTipData) {
			if (ToolTipManager.map[toolTipData.type]) {
				ToolTipManager.current = ToolTipManager.map[toolTipData.type];
			} else {
				let toolTip: ToolTipBase = ToolTipManager.getToolTip(toolTipData.type);
				ToolTipManager.current = toolTip;
				ToolTipManager.map[toolTipData.type] = toolTip;
			}
			ToolTipManager.current.setToolTipData(toolTipData);
			ToolTipManager.current.modal = toolTipData.modal;
			ToolTipManager.current.x = toolTipData.x;
			ToolTipManager.current.y = toolTipData.y;
			ToolTipManager.current.show();
			if (toolTipData.isCenter) {
				ToolTipManager.current.center();
			}
			App.StageUtils.getStage().addEventListener(egret.Event.RESIZE, this.onStageResize, this);
			return ToolTipManager.current;
		}
		return null;
	}

	public static showByCode(codeOrItemDta:any,enableOpt:boolean = false,extData:any = null,source:ToolTipSouceEnum=ToolTipSouceEnum.None):void {
		let tipData:ToolTipData = new ToolTipData();
		tipData.isEnableOptList = enableOpt;
		let itemData:ItemData;
		if(typeof(codeOrItemDta)=="number"){
			itemData = new ItemData(codeOrItemDta);
		}else{
			itemData = <ItemData>codeOrItemDta;
		}
		tipData.data = itemData;
		tipData.extData = extData;
		tipData.type = ItemsUtil.getToolTipType(tipData.data);
		tipData.source = source;
		ToolTipManager.show(tipData);
	}

	public static hide(): void {
		if (ToolTipManager.current) {
			ToolTipManager.current.hide();			
		}
		App.StageUtils.getStage().addEventListener(egret.Event.RESIZE, this.onStageResize, this);
	}
	private static onStageResize(): void {
		if (ToolTipManager.current && ToolTipManager.current.toolTipData && ToolTipManager.current.toolTipData.isCenter) {
			ToolTipManager.current.center();
		}
	}
	private static tipInfoView: fairygui.GComponent;
	/**
	 * 在组件下方显示Tip
	 */
	public static showInfoTip(tip: string, target: fairygui.GComponent = null): void {
		if (ToolTipManager.tipInfoView == null) {
			ToolTipManager.tipInfoView = fairygui.UIPackage.createObject(PackNameEnum.Common, "ToolTipInfo").asCom;
		}
		ToolTipManager.tipInfoView.getChild("title").asTextField.text = tip;
		fairygui.GRoot.inst.showPopup(ToolTipManager.tipInfoView, target);
	}

	private static getToolTip(type: ToolTipTypeEnum): ToolTipBase {
		switch (type) {
			case ToolTipTypeEnum.HeartMethod:
				return new ToolTipEquip4();
			case ToolTipTypeEnum.Info:
				return new ToolTipInfo();
			case ToolTipTypeEnum.Target:
				return new ToolTipTarget();
			case ToolTipTypeEnum.Item:
				return new ToolTipItem();
			case ToolTipTypeEnum.Drug:
				return new ToolTipDrug();
			case ToolTipTypeEnum.Drug2:
				return new ToolTipDrug2();
			case ToolTipTypeEnum.Equip:
				return new ToolTipEquip();
			case ToolTipTypeEnum.EquipSpecial:
				return new ToolTipEquip2();
			case ToolTipTypeEnum.Equip3:
				return new ToolTipEquip3();
			case ToolTipTypeEnum.Spirit:
				return new ToolTipSpirit();
			case ToolTipTypeEnum.Mount:
				return null;
			case ToolTipTypeEnum.Skill:
				return new ToolTipSkill();
			case ToolTipTypeEnum.Stone:
				return new ToolTipStone();
			case ToolTipTypeEnum.Opt:
				return new ToolTipOpt();
			case ToolTipTypeEnum.ShopHeartLock:
				return new ShopToolTip();
			case ToolTipTypeEnum.Daily:
				return new ToolTipDaily();
			case ToolTipTypeEnum.Compose:
				return new ToolTipCompose();
			case ToolTipTypeEnum.HandInEquip:
				return new ToolTipHandInEquip();
			case ToolTipTypeEnum.Boss:
				return new BossTips();
			case ToolTipTypeEnum.GodWeaponPiece:
				return new ToolTipGodWPiece();
			case ToolTipTypeEnum.GodWeaponPieceAct:
				return new ToolTipGodWPieceAct();
			case ToolTipTypeEnum.Kill:
				return new ToolTipKill();
            case ToolTipTypeEnum.Rune:
                return new ToolTipRune();
            case ToolTipTypeEnum.Fashion:
                return new ToolTipFashion();
            case ToolTipTypeEnum.Illustrate:
            	return new ToolTipIllustrate();
			case ToolTipTypeEnum.GodWing:
				return new ToolTipGodWing();
			case ToolTipTypeEnum.ImmPiece:
				return new ToolTipImmItem();
			case ToolTipTypeEnum.AncientEquip:
				return new ToolTipAncientEquip();
			case ToolTipTypeEnum.PetEquip:
				return new ToolTipPetEquip();
			case ToolTipTypeEnum.TalentEquip:
				return new ToolTipEquip5();
			case ToolTipTypeEnum.ShapeChangeProp:
				return new ToolTipChangeProp();
			case ToolTipTypeEnum.CheatPreview:
				return new ToolTipCheatsPreviewItemTips();
			case ToolTipTypeEnum.RechargeFirstGift:
				return new ToolTipRechargeGift();
			case ToolTipTypeEnum.BeastEquip:
				return new ToolTipBeastEquip();
			case ToolTipTypeEnum.DonateProp:
				return new ToolTipDonateProp();
		}
	}
}