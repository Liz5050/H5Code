class AlertData {
	/**提示框的默认标题 */
	public static DF_TITLE:string = "提示";
	/**
	 * 提示文本
	 */
	public tip:string = "";
	public title:string = "";
	public checkLabel:string = "";
	public checkKey:string = "";

	/**确定回调 */
	public yesFun:Function;

	/**取消回调 */
	public noFun:Function;

	/**调用者 */
	public caller:any;
	/**要显示的按钮  */
	public btns:number = Alert.YES|Alert.NO;
	/**按钮标签 第一个必定是确定按钮 */
	public btnLabels:string[];

}