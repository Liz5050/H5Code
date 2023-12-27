class SearchFriendWindow extends BaseWindow{
	private nameInput: NumberInput;
	private addBtn: fairygui.GButton;

	private inputName: string;

	public constructor() {
		super(PackNameEnum.Friend, "SearchFriend");
	}

	public initOptUI(): void{
		this.nameInput = <NumberInput>this.getGObject("input_name");
		this.addBtn = this.getGObject("btn_add").asButton;

		this.nameInput.addEventListener(egret.Event.CHANGE, this.onChanged, this);
		this.addBtn.addClickListener(this.clickAddBtn, this);
	}

	public updateAll(): void{
		this.nameInput.text = "";
		this.onChanged();
	}

	private onChanged(): void {
        this.inputName = this.nameInput.text;
    }

	private clickAddBtn(): void{
		if(this.inputName == ""){
			Tip.showTip("请输入要添加好友的名字");
			return;
		}else if (App.StringUtils.getStringLength(this.inputName) > 7 || this.inputName.indexOf(" ") != -1 || ConfigManager.chatFilter.isHasSensitive(name)) {
			Tip.showTip("名称不能超过7个字，不能包含空格和敏感词");
            return;
		}else if(this.inputName == CacheManager.role.player.name_S){
			Tip.showTip("不能添加自己为好友");
			return;
		}else if(CacheManager.friend.isMaxFriend()){
			Tip.showTip("你的好友数量已达上限");
			return;
		}
		this.hide();
		ProxyManager.friend.friendApply(this.inputName);
	}
}