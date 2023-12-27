class AlertII extends BaseWindow
{
	private static gInstance:AlertII;
	private gBtns:fairygui.GButton[];
	private gAlertTxt:fairygui.GRichTextField;
	private gCheckBox: fairygui.GButton;
	// private gCheckTxt:fairygui.GTextField;
	private gCheckTxtStr:string;
	private gNoAlertType:string; 
	private gAlertStr:string;
	private gBtnLabels:string[];
	private gBtnTypes:AlertType[];
	private gCallBack:Function;
	private gCallBackObj:any;
	private btnGray:boolean;
	
	// private static gNoAlertTypes:{[type:string]:boolean} = {};
	public constructor() 
	{
		super(PackNameEnum.Common,"AlertII");
	}

	public static get instance():AlertII {
		return this.gInstance;
	}

	private setData(alertStr:string,noAlertType:string = null,callBack:Function = null,callBackObj:any = null,
					btnLabels:string[] = null,btnTypes:AlertType[] = null,checkBoxTxt:string = LangCommon.L28,isPopup:boolean = true,
					btnGray: boolean = false):void
	{
		this.isPopup = isPopup;
		this.gAlertStr = alertStr;
		this.gNoAlertType = noAlertType;
		this.gCallBack = callBack;
		this.gCallBackObj = callBackObj;
		this.gBtnLabels = btnLabels;
		this.gBtnTypes = btnTypes;
		this.gCheckTxtStr = checkBoxTxt;
		this.btnGray = btnGray;
	}

	public initOptUI():void
	{
		this.gBtns = [];
		this.gAlertTxt = this.getGObject("txt_tip").asRichTextField;
		this.gCheckBox = this.getGObject("check_box").asButton;
		// this.gCheckTxt = this.getGObject("check_txt").asTextField;
		for(let i:number = 1; i < 3; i++)
		{
			let _btn:fairygui.GButton = this.getGObject("btn_" + i).asButton;
			_btn.addClickListener(this.onBtnClickHandler,this);
			_btn.visible = false;
			this.gBtns.push(_btn);
		}
	}

	public updateAll():void
	{
		this.gCheckBox.selected = false;
		this.gCheckBox.visible = this.gNoAlertType != null;
		this.gCheckBox.title = this.gCheckTxtStr;
		this.gAlertTxt.text = this.gAlertStr;
		if(this.gBtnTypes == null || this.gBtnTypes.length <= 1)
		{
			this.gBtns[1].text = this.gBtnLabels == null || this.gBtnLabels.length >= 2 ? LangCommon.L26 : this.gBtnLabels[0];
			this.gBtns[1].x = 155;
			this.gBtns[1].y = this.gNoAlertType != null ? 234 : 210;
			this.gBtns[1].visible = true;
			App.DisplayUtils.grayButton(this.gBtns[1], this.btnGray, this.btnGray);
			this.gBtns[0].visible = false;
		}
		else
		{
			this.gBtns[1].x = 280;
			App.DisplayUtils.grayButton(this.gBtns[1], this.btnGray, this.btnGray);
			for(let i:number = 0; i < this.gBtnTypes.length; i++)
			{
				this.gBtns[i].visible = true;
				this.gBtns[i].title = this.gBtnLabels[i];
				this.gBtns[i].y = this.gNoAlertType != null ? 234 : 210;
			}
		}
	}

	private onBtnClickHandler(evt:egret.Event):void
	{
		this.hide();
		let _index:number = this.gBtns.indexOf((evt.currentTarget as fairygui.GButton));
		if(this.gBtnLabels && this.gBtnLabels.length > 0)
		{
			if(this.gCallBack != null) {
				let call:Function = this.gCallBack;
				this.gCallBack = null;
				call.call(this.gCallBackObj,this.gBtnTypes[_index]);
			}
		}
	}

	public hide():void
	{
		if(this.gCheckBox)
		{
			if(this.gCheckBox.selected)
			{
				let _time:number = CacheManager.serverTime.getServerTime();
				if(LocalStorageUtils.isLocalStorageSupported())
				{
					LocalStorageUtils.setKey(this.gNoAlertType, "" + _time);
				}
				// else
				// {
				// 	AlertII.gNoAlertTypes[this.gNoAlertType] = true;
				// }
			}
			// else
			// {
			// 	delete AlertII.gNoAlertTypes[this.gNoAlertType];
			// }
		}
		super.hide();
	}

	/**
	 * @param alertStr 提示内容
	 * @param noAlertType 不再提示类型
	 * @param callBack 回调函数
	 * @param callBackObj 回调作用域
	 * @param btnTypes 按钮对应索引
	 * @param btnLabels 按钮文本
	 * @param btnGray 确定按钮是否置灰
	 */
	public static show(alertStr:string,noAlertType:string = null,callBack:Function = null,callBackObj:any = null,
		btnTypes:AlertType[] = [AlertType.NO,AlertType.YES],btnLabels:string[] = [LangCommon.L27,LangCommon.L26],
		checkBoxTxt:string = LangCommon.L28,isPopup:boolean = true,btnGray:boolean = false):AlertII
	{
		if(!LocalStorageUtils.isAlertExpire(noAlertType))
		{
			if(callBack != null) callBack.call(callBackObj,AlertType.YES);
		}
		else
		{
			if(AlertII.gInstance == null)
			{
				AlertII.gInstance = new AlertII();
			}
			AlertII.gInstance.setData(alertStr,noAlertType,callBack,callBackObj,btnLabels,btnTypes,checkBoxTxt,isPopup,btnGray);
			AlertII.gInstance.show();
			return AlertII.gInstance;
		}
		return null;
	}
}

enum AlertType
{
	/**确定 */
	YES = 1,
	/**取消 */
	NO = 2,
	TEST = 3,
}