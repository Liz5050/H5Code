/**
 * 邮件详情窗口
 */

class MailWindow extends BaseWindow{
	// private bindNumTxt: fairygui.GTextField;
	// private numTxt: fairygui.GTextField;
	private nameTxt: fairygui.GTextField;
	private titleTxt: fairygui.GTextField;
	private descTxt: fairygui.GRichTextField;
	private statusController: fairygui.Controller;
	private mailList:List;
	private itemDatas: Array<ItemData>;
	private _data: any;

	private lastTime: number = 0;

	public constructor() {
		super(PackNameEnum.Mail, "WindowMailContent");
	}

	public initOptUI(): void{
		// this.bindNumTxt = this.getGObject("txt_bindNum").asTextField;
		// this.numTxt = this.getGObject("txt_Num").asTextField;
		this.nameTxt = this.getGObject("txt_name").asTextField;
		this.titleTxt = this.getGObject("txt_title").asTextField;
		this.statusController = this.getController("c1");
		this.mailList = new List(this.getGObject("list_mail").asList);
		this.mailList.list.addEventListener(fairygui.ItemEvent.CLICK, this.onClickItem, this);
		this.getGObject("btn_delete").addClickListener(this.clickDeleteBtn, this);
		this.getGObject("btn_receive").addClickListener(this.clickReceiveBtn, this);

		let mailTxt: fairygui.GComponent =  this.getGObject("mailTxt").asCom;
		this.descTxt = mailTxt.getChild("txt_desc").asRichTextField;
		this.descTxt.addEventListener(egret.TextEvent.LINK, this.onClickLink, this);
	}

	public updateAll(): void{

	}

	private onClickLink(TextEvent: egret.TextEvent): void{
		// TextEvent.text
		switch(TextEvent.text){
			case PanelTabType[PanelTabType.TrainGodWeapon]://神器
				EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Skill, { "tabType": PanelTabType.TrainGodWeapon });
				break;
			case PanelTabType[PanelTabType.CopyHallDaily]://经验副本
				EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.CopyHall, { "tabType": PanelTabType.CopyHallDaily });
				break;
			case PanelTabType[PanelTabType.CopyHallTower]://诛仙塔副本
				EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.CopyHall, { "tabType": PanelTabType.CopyHallTower });
				break;
			case ModuleEnum[ModuleEnum.Recharge]://充值
				EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Recharge);
				HomeUtil.openRecharge();
				break;
			case ModuleEnum[ModuleEnum.OpenRole]://开启角色
				// EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.OpenRole);
				HomeUtil.openRecharge();
				break;
			case PanelTabType[PanelTabType.RoleState]://转生系统
				EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Player, { "tabType": PanelTabType.RoleState });
				break;
			case PanelTabType[PanelTabType.KingBattle]://王者争霸
				EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Arena, { "tabType": PanelTabType.KingBattle });
				break;
			case PanelTabType[PanelTabType.SecretBoss]://秘境BOSS
				EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Boss, { "tabType": PanelTabType.SecretBoss });
				break;
			case PanelTabType[PanelTabType.UniqueSkill]://必杀
				EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Player, { "tabType": PanelTabType.UniqueSkill });
				break;
			case IconResId[IconResId.ActivityOpenServer]://开服活动
				HomeUtil.openByIconId(IconResId.ActivityOpenServer);
				break;
			case ModuleEnum[ModuleEnum.GuildNew]://仙盟
				EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.GuildNew);
				break;
			case PanelTabType[PanelTabType.WorldBoss]://挑战boss
				EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Boss, { "tabType": PanelTabType.WorldBoss });
				break;
		}
		this.hide();
	}

	/**删除邮件 */
	private clickDeleteBtn(): void{
		if(this._data.hadAttachment_I == EMailAttach.EMailAttachYes){
			Tip.showTip("有附件的邮件无法删除");
			return;
		}
		let ids: Array<any> = [];
		ids.push(this._data.mailId_L64);
		ProxyManager.mail.removeMail({"data_L64": ids});
		this.hide();
	}

	/**领取附件 */
	private clickReceiveBtn(): void{
		if(Date.now() - this.lastTime < 1000){
			return;
		}
		this.lastTime = Date.now();
		if(this._data.hadAttachment_I == EMailAttach.EMailAttachYes){
			let ids: Array<any> = [];
			ids.push(this._data.mailId_L64);
			ProxyManager.mail.batchMailAttachment({"data_L64": ids});
		}
		else{
			Tip.showTip("没有可领取的附件");
		}
		
	}

	/**更新邮件详情 */
	public updateDetail(data: any): void{
		this._data = data;
		// this.bindNumTxt.text = "0";
		// this.numTxt.text = "0";
		this.nameTxt.text = data.fromPlayerName_S;
		this.titleTxt.text = data.title_S;
		// this.descTxt.text = data.content_S.replace(/<br>/g, "\n");
		this.descTxt.text = HtmlUtil.br(data.content_S);
		// if(data.hadAttachment_I == EMailAttach.EMailAttachYes){
		// 	// this.bindNumTxt.text = data.attachmentGoldBind_I;
		// 	this.numTxt.text = data.attachmentGold_I;
		// }
		this.itemDatas = this.getItemData(data.playerItems.data, data.hadAttachment_I);
		this.mailList.setVirtual(this.itemDatas, this.setItemRenderer, this);
		if(data.playerItems.data.length > 0){
			this.statusController.selectedIndex = 0;
		}else{
			this.statusController.selectedIndex = 1;
		}
		this.mailList.bouncebackEffect = this.mailList.list.numItems > 5;

	}

	public updateAttachment(mailId: number): void{
		if(Number(this._data.mailId_L64) == mailId){
			this._data.hadAttachment_I = EMailAttach.EMailAttachHadGet;
			this.updateDetail(this._data);
		}
	}

	/**邮件中附件的物品 */
	public getItemData(datas: Array<any>, attachment: number): Array<ItemData>{
		let itemDatas: Array<any> = [];
		if(datas.length > 0 && attachment == EMailAttach.EMailAttachYes){
			for(let data of datas){
				itemDatas.push(new ItemData(data));
			}
		}
		if(itemDatas.length < 5){
			let length: number = itemDatas.length;
			for(let i = 0; i < 5 - length; i++){
				itemDatas.push(ItemDataEnum.empty);
			}
		}
		return itemDatas;
	}

	private setItemRenderer(index: number, item: BaseItem): void {		
		item.isShowName = false;
		item.itemData = this.itemDatas[index];
	}

	/**点击物品项 */
	private onClickItem(e: fairygui.ItemEvent): void {
		let baseItem: BaseItem = <BaseItem>e.itemObject;
		if (!baseItem.itemData) {
			this.mailList.selectedIndex = -1;
		}
	}
}