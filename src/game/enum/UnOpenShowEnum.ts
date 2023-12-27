/**
 * 功能未开启时提示类型
 */
enum UnOpenShowEnum {
	/**隐藏入口 */
	Hide_Entrance = 1,
	/**显示入口，但不给进，点击显示文本提示 */
	Show_Tips = 2,
	/**显示入口，可点击预览功能界面（界面内容不能操作） */
	Preview = 3,
}