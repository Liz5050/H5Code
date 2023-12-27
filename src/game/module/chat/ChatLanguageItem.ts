class ChatLanguageItem extends ListRenderer {

	public static lastEditeBtn:fairygui.GButton;

	private txt_input:fairygui.GTextInput;
	private btn_edit:fairygui.GButton;
	public constructor() {
		super();
	}
	protected constructFromXML(xml:any):void{
		super.constructFromXML(xml);
		this.txt_input = this.getChild("txt_luanguage").asTextInput;
		this.btn_edit = this.getChild("btn_edit").asButton;
		this.btn_edit.addClickListener(this.onClickEdit,this);
		this.txt_input.addEventListener(egret.FocusEvent.FOCUS_OUT,this.onFocusOut,this);
		this.txt_input.addEventListener(egret.Event.CHANGE,this.onInputChange,this);	
	}
	protected onInputChange(e:egret.Event):void{
		this.checkOutLen();		
	}
	protected checkOutLen():boolean{
		var b:boolean = ChatUtils.isMsgOutLen(this.txt_input.text);
		if(b){
			this.txt_input.text = this.txt_input.text.slice(0,ChatCache.MAX_INPUT);
			Tip.showTip(LangChat.L_OUT_LEN);
		}
		return b;
	}
	public setData(data:any,index:number):void{
		this._data = data;
		this.txt_input.text = data.phrase_S;
		this.btn_edit.selected = false;
		this.setEditable(CacheManager.chat.isCurEditeId(this._data.phraseId_I));
	}

	protected onClickEdit(e:egret.TouchEvent):void{
		e.stopPropagation();		
		if(ChatLanguageItem.lastEditeBtn && ChatLanguageItem.lastEditeBtn!=this.btn_edit){
			ChatLanguageItem.lastEditeBtn.selected = false;
		}
		ChatLanguageItem.lastEditeBtn = this.btn_edit; 
		this.setEditable(this.btn_edit.selected);
		EventManager.dispatch(UIEventEnum.ChatEditeChange,this._data.phraseId_I,this.btn_edit.selected);
		this.saveLang();
	}

	private onFocusOut(e:egret.FocusEvent):void{
		this.saveLang();
		this.setEditable(false);
		//console.log("失去焦点了 btn_edit",this.btn_edit.selected);		
		EventManager.dispatch(UIEventEnum.ChatEditeChange,this._data.phraseId_I,false);
	}

	/**向服务器保存数据 */
	public saveLang():void{
		if(this._data.phrase_S!=this.txt_input.text){
			let data:any = {id:this._data.phraseId_I,phrase:this.txt_input.text};
			EventManager.dispatch(UIEventEnum.ChatSaveLang,data);			
		}	
	}

	public setEditable(value:boolean):void{
		let tf:egret.TextField = this.txt_input['_textField'];
		if (value){			
			tf.type = egret.TextFieldType.INPUT;
			tf.setFocus();
			this.txt_input.text = this._data.phrase_S;
		}else{
			tf.type = egret.TextFieldType.DYNAMIC;
		}		
		this.txt_input["renderNow"]();
				
	}

}