/**
 * 仙盟技能（心法）列表项
 */
class GuildSkillItem extends ListRenderer {
	private c1: fairygui.Controller;
	private iconLoader: GLoader;
	private attrTypeNameTxt: fairygui.GTextField;
	private levelTxt: fairygui.GTextField;
	private nameTxt: fairygui.GTextField;
	private addValueTxt: fairygui.GTextField;
	private nextNameTxt: fairygui.GTextField;
	private nextValueTxt: fairygui.GTextField;
	private currentNameTxt: fairygui.GTextField;
	private currentValueTxt: fairygui.GTextField;
	private costTxt: fairygui.GTextField;
	private openTxt: fairygui.GTextField;

	private cfg: any;
	private nextCfg: any;
	private level: number;
	private isCanUpgrade: boolean;
	private isOpen: boolean;
	private isLevelMax: boolean;

	public constructor() {
		super();
	}

	protected constructFromXML(xml: any): void {
		super.constructFromXML(xml);
		this.c1 = this.getController("c1");
		this.iconLoader = <GLoader>this.getChild("loader_icon");
		this.attrTypeNameTxt = this.getChild("txt_attrTypeName").asTextField;
		this.levelTxt = this.getChild("txt_Level").asTextField;
		this.nameTxt = this.getChild("txt_name").asTextField;
		this.addValueTxt = this.getChild("txt_addValue").asTextField;
		this.nextNameTxt = this.getChild("txt_nextName").asTextField;
		this.nextValueTxt = this.getChild("txt_nextValue").asTextField;

		this.currentNameTxt = this.getChild("txt_currentName").asTextField;
		this.currentValueTxt = this.getChild("txt_currentValue").asTextField;
		this.costTxt = this.getChild("txt_cost").asTextField;
		this.openTxt = this.getChild("txt_open").asTextField;

		this.getChild("btn_upgrade").addClickListener(this.upgrade, this);
	}

	public setData(data: any): void {
		this._data = data;
		if (data != null) {
			let attrType: number = data.attrType;
			let name: string = GameDef.EJewelName[attrType][0];
			let baseName: string = name;
			if (attrType < EJewel.EJewelWuxingAttack) {
				baseName = "基础" + name;
			}
			this.level = CacheManager.guild.getVienLevel(attrType);
			let openLevel: number = 0;
			if (data.openLevel != null) {
				openLevel = data.openLevel;
			}
			this.isOpen = CacheManager.role.getRoleLevel() >= openLevel;
			this.c1.selectedIndex = this.isOpen ? 1 : 0;
			this.iconLoader.grayed = !this.isOpen;
			if (!this.isOpen) {
				this.openTxt.text = `${openLevel}级开启`;
			}

			this.attrTypeNameTxt.text = name;
			this.nameTxt.text = baseName;
			this.nextNameTxt.text = baseName;
			this.currentNameTxt.text = baseName;
			this.iconLoader.url = URLManager.getIconUrl(attrType + "", URLManager.GUILD_VEIN_ICON);

			this.cfg = ConfigManager.guildVein.getByPKParams(attrType, this.level);
			this.nextCfg = ConfigManager.guildVein.getNextVein(attrType, this.level);
			this.levelTxt.text = `Lv.${this.level}`;

			let attrRate: number = this.cfg.attrRate;
			let attrValue: number = this.cfg.attrValue;
			if (attrRate == null && attrValue == null) {
				this.addValueTxt.text = `+0`;
			} else {
				if (attrRate != null) {
					this.addValueTxt.text = `+${attrRate / 100}%`;
				} else {
					this.addValueTxt.text = `+${attrValue}`;
				}
			}
			this.isLevelMax = this.nextCfg == null;
			if (this.isLevelMax) {//已到最高等级
				this.nextValueTxt.visible = false;
				this.nextNameTxt.text = "已达到最高等级";
			} else {
				this.nextValueTxt.visible = true;
				let nextAttrRate: number = this.nextCfg.attrRate;
				let nextAttrValue: number = this.nextCfg.attrValue;
				if (nextAttrRate == null && nextAttrValue == null) {
					this.nextValueTxt.text = `+0`;
				} else {
					if (nextAttrRate != null) {
						this.nextValueTxt.text = `+${nextAttrRate / 100}%`;
					} else {
						this.nextValueTxt.text = `+${nextAttrValue}`;
					}
				}
			}

			let currentValue:number= 0;
			if(attrType >= EJewel.EJewelJouk){
				currentValue = CacheManager.role.getFightAttr(attrType);
			}else{
				currentValue = CacheManager.guild.roleBaseAttrDict[attrType];
			}

			this.currentValueTxt.text = currentValue.toString();

			if (this.isLevelMax) {
				this.costTxt.text = CacheManager.guild.playerGuildInfo.contribution_I + "/已满级";
				this.costTxt.color = 0xFFFFFF;
			} else {
				this.isCanUpgrade = CacheManager.guild.playerGuildInfo.contribution_I >= this.cfg.costContribution;
				this.costTxt.text = CacheManager.guild.playerGuildInfo.contribution_I + "/" + this.cfg.costContribution;
				this.costTxt.color = this.isCanUpgrade ? 0xFFFFFF : 0xFF0000;
			}
		}
	}

	private upgrade(): void {
		if (!this.isOpen) {
			Tip.showTip(this.openTxt.text);
			return;
		}
		if (this.isLevelMax) {
			Tip.showTip("已达到最高等级");
			return;
		}
		if (!this.isCanUpgrade) {
			Tip.showTip("仙盟贡献不足，无法升级");
			return;
		}
		EventManager.dispatch(LocalEventEnum.GuildVeinUpgrade, { "level": this.level, "attrType": this._data.attrType })
	}
}