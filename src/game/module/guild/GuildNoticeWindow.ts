/**
 * 仙盟公告
 */
class GuildNoticeWindow extends BaseWindow {
	private c1: fairygui.Controller;
	private contentInput: fairygui.GTextInput;
	private costTxt: fairygui.GRichTextField;
	private timeTxt: fairygui.GTextField;
	private content: string;
	private guildInfo: any;
	private maxSize: number = ConfigManager.const.getConstValue("GuildPurposeLimit");
	private cost: number = ConfigManager.const.getConstValue("GuildPurposeNoticeCost");
	private maxNoticeNum: number = ConfigManager.const.getConstValue("GuildPurposeNoticeNumPerWeek");
	private leftNoticeNum: number = 0;

	public constructor() {
		super(PackNameEnum.Guild, "WindowGuildNotice");
	}

	public initOptUI(): void {
		this.c1 = this.getController("c1");
		this.contentInput = this.getGObject("input_notice").asTextInput;
		this.contentInput.addEventListener(egret.Event.CHANGE, this.onContentChanged, this);
		this.costTxt = this.getGObject("txt_cost").asRichTextField;
		this.timeTxt = this.getGObject("txt_time").asTextField;
		this.getGObject("btn_save").addClickListener(this.clickSave, this);
		this.getGObject("btn_saveAndNotice").addClickListener(this.clickSaveAndNotice, this);

		this.costTxt.text = `发送一次消耗<font color="#01AB24">${this.cost}</font>元宝\n（优先消耗绑元）`;
	}

	public updateAll(): void {
		this.guildInfo = CacheManager.guild.guildInfo;
		this.leftNoticeNum = this.maxNoticeNum - CacheManager.guild.noticeNum;
		this.timeTxt.text = `${this.leftNoticeNum}/${this.maxNoticeNum}`;
		if (this.leftNoticeNum <= 0) {
			this.c1.selectedIndex = 1;
		} else {
			this.c1.selectedIndex = 0;
		}
		this.contentInput.text = (this.guildInfo.purpose_S as string).replace(/\\n/gi, "\n");
		this.onContentChanged();
	}

	private onContentChanged(): void {
		this.content = App.StringUtils.trimSpace(this.contentInput.text);
		if (App.StringUtils.getStringLength(this.content) > this.maxSize) {
			this.content = this.content.slice(0, this.maxSize)
			this.contentInput.text = this.content;
		}
	}

	private clickSave(): void {
		this.saveNotice(false);
	}

	private clickSaveAndNotice(): void {
		this.saveNotice(true);
	}

	private saveNotice(isNotice: boolean): void {
		if (App.StringUtils.getStringLength(this.content) == 0) {
			Tip.showTip("公告不能为空");
			return;
		}
		EventManager.dispatch(LocalEventEnum.GuildSaveNotice, { "content": this.content, "isNotice": isNotice, "isCost": this.leftNoticeNum <= 0 });
		this.hide();
	}
}