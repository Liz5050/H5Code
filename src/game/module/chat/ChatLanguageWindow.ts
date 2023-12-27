class ChatLanguageWindow extends BaseWindow {
	private _data:any;
	private txt_level:fairygui.GTextInput;
	private btn_keep:fairygui.GButton;

	public constructor() {
		super(PackNameEnum.Chat,"WindowChatLanguage");
	}

	public initOptUI():void{
		this.txt_level = this.getGObject("txt_level").asTextInput;
		this.txt_level.maxLength = ChatEnum.CHAT_PHRASE_LEN;
		this.btn_keep = this.getGObject("btn_keep").asButton;

		this.btn_keep.addClickListener(this.onClickBtn,this);
	}

	public updateAll(data:any):void{
		this._data = data;
		this.txt_level.text = this._data.phrase_S; 
	}
	
	private onClickBtn(e:any):void{
		if(this.txt_level.text.length>ChatEnum.CHAT_PHRASE_LEN){
			Tip.showTip(App.StringUtils.substitude(LangChat.L_PHRASE_LEN,ChatEnum.CHAT_PHRASE_LEN));
			return;
		}
		if(this.txt_level.text.length==0){
			Tip.showTip(LangChat.L_PHRASE_EMPTY);
			return;
		}
		if(this.txt_level.text!=this._data.phrase_S){
			var data:any = {id:this._data.phraseId_I,phrase:this.txt_level.text};
			EventManager.dispatch(UIEventEnum.ChatSaveLang,data);
		}
		this.hide();
	}
}