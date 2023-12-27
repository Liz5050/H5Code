/**
 * 聊天枚举
 */
class ChatEnum {
	
	//---------聊天模块必须以CHAT_开头------
	/**聊天区域 坐标链接 */
	public static CHAT_LINK_POS:string = "CHAT_LINK_POS";
	/**聊天区域 物品链接 */
	public static CHAT_LINK_ITEM:string = "CHAT_LINK_GOOD";
	/**人物链接 */
	public static CHAT_LINK_PLAYER:string = "CHAT_LINK_PLAYER";
	public static CHAT_LINK_COLOR:string = "CHAT_LINK_COLOR";
	/**boss刷出 */
	public static CHAT_LINK_BOSS:string = "CHAT_LINK_BOSS";
	/**快速加入仙盟 */
	public static CHAT_LINK_APPLY_GUILD:string = "CHAT_LINK_APPLY_GUILD";
	/**打开模块的链接 */
	public static CHAT_LINK_OPEN_MODULE:string = "CHAT_LINK_OPEN_MODULE";
    /**快速加入队伍 */
    public static CHAT_LINK_APPLY_TEAM:string = "CHAT_LINK_APPLY_TEAM";
    /**快速加入跨服队伍 */
    public static CHAT_LINK_APPLY_TEAM_CROSS:string = "CHAT_LINK_APPLY_TEAM_CROSS";
	/**打开战场活动界面 */
	public static CHAT_GAME_PLAY_OPEN:string = "CHAT_GAME_PLAY_OPEN";
	/**伪造的充值广播<点击领取> */
	public static CHAT_FAKE_RECHARGE:string = "CHAT_FAKE_RECHARGE";
	public static CHAT_NONE:string = "CHAT_NONE";
	public static CHAT_COPY_ASSIT:string = "CHAT_COPY_ASSIT";

	/**聊天表情最大id */
	public static CHAT_FACE_MAX:number = 35;
	public static CHAT_PHRASE_LEN:number = 30;
	
	/**标签类型 */
	public static Label_None:number = 0;
	public static Label_Text:number = 1;
	public static Label_Img:number = 2;

	/**聊天窗口 系统频道标签和内容的间距 */
	public static LABEL_GAP:number = 15;
	public static VIP_GAP:number = 5;

	public static CHAT_GOLDCARD_OPEN :string = "CHAT_GOLDCARD_OPEN";
	public static CHAT_PRIVILEGECARD_OPEN : string = "CHAT_PRIVILEGECARD_OPEN";

}