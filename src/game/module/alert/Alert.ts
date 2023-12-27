class Alert {
	public static YES:number = 4;
	public static NO:number = 2;	
	public static YES_LABEL:string="确  定";	
	public static NO_LABEL:string="取  消";	
	private static current:AlertBase;
	private static map:any = {};

	/**
	 * 显示提示
	 */
	public static info(tip:string, yesFun:Function=null, caller:any=null, noFun:Function=null):void{
		let data:AlertData = new AlertData();
		data.tip = tip;
		data.yesFun = yesFun;
		data.noFun = noFun;
		data.caller = caller;
		Alert.show(data);
	}

    public static get instance():AlertBase {
        return this.current;
    }

	/**
	 * 弹出一个提示框(可以有checkBox)	 
	 * @param tip 提示内容
	 * @param yesFn 点击确定按钮回调函数
	 * @param caller 
	 * @param noFun  点击取消按钮回调函数
	 * @param checkLabel CheckBox的文本(空串会隐藏该文本)
	 * @param checkKey   今日不再提示的key AlertCheckEnum 定义
	 * @param title      提示标题(默认可以传空串会显示为AlertData.DF_TITLE(提示))
	 * @param btns      要显示的按钮 
	 */
	public static alert(tip:string,yesFun:Function=null,caller:any=null,noFun:Function=null,
						checkLabel:string="",checkKey:string="",
						title:string="",btns:number=Alert.YES|Alert.NO,btnLabels:string[] = null):void{
		
		//今日不再提示
		if(checkKey!="" && !LocalStorageUtils.isAlertExpire(checkKey)){
			if(yesFun){
				yesFun.call(caller);
			}
			return;
		}
		let data:AlertData = new AlertData();
		data.tip = tip;
		title==""?title=AlertData.DF_TITLE:null;
		data.title = title;
		data.btns = btns;
		data.yesFun = yesFun;		
		data.noFun = noFun;
		data.caller = caller;
		data.checkLabel = checkLabel;
		data.btnLabels = btnLabels;
		data.checkKey = checkKey;
		Alert.show(data,AlertEnum.CheckBox);
	}


	public static show(data:AlertData, type:AlertEnum=AlertEnum.Normal):void{
		if(data){
			if(Alert.map[type]){
				Alert.current = Alert.map[type];
			}else{
				let tmp:AlertBase = Alert.getAlert(type);
				Alert.current = tmp;
				Alert.map[type] = tmp;
			}
			Alert.current.setData(data);
			Alert.current.show();
		}
	}

	private static getAlert(type:AlertEnum):AlertBase{
		switch(type){
			case AlertEnum.Normal:
				return new AlertNormal();
			case AlertEnum.CheckBox:
				return new AlertCheckBox();
		}
	}
}