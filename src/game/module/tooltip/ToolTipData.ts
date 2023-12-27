class ToolTipData {
	public type: ToolTipTypeEnum;
	public data: any;
	public extData: any;
	public shopData: any;
	/**是否启用操作按钮列表 */
	public isEnableOptList: boolean = false;
	/**是否遮罩显示 */
	public modal: boolean = true;
	/**是否居中显示 */
	public isCenter: boolean = true;
	public x: number = -1;
	public y: number = -1;
	/**tip来源 */
	public source: ToolTipSouceEnum = ToolTipSouceEnum.None;
	/**操作列表，优先级最高 */
	public optBtnList: Array<ToolTipOptEnum>;

	public roleIndex : number;

	public constructor() {
	}
}