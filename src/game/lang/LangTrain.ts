class LangTrain {
	public static EStrengthenExType = EStrengthenExType;


	/**{0}阶 */
	public static L1:string = "{0}阶";
	/**任务未完成，无法升级 */
	public static L2:string = "任务未完成，无法升级";
	/**已达到最高等级，无法提升*/
	public static L3:string = "已达到最高等级，无法提升";
	/**历练不足 */
	public static L4:string = "历练不足";

	//图鉴
	public static L5:string = "<font color='#2f1603'>需要：</font>图鉴经验x{0}";
	public static L6:string = "（已集齐{0}/{1}）";
	public static L7:string = "图鉴经验{0}";
	public static L8:string = "{0}套装加成";
	public static L9:string = "图鉴经验×{0}";
	public static L10:string = "阶";
	public static L11:string = "激  活";
	public static L12:string = "<u>获取途径</u>";
	public static L13:string = "提  升";
	public static L14:string = "<u>获取图鉴经验</u>";
	public static L15:string = "集齐套装效果：";
	public static L16:string = "需要：<font color='{2}'>{0}x{1}</font>";

	public static L17:string = "1、爵位等级越高属性越强，每次提升都能获得一份晋升奖励\n" +
"2、爵位达到一定等级后，可领取极品装备<c6>官印</c6>\n" +
"3、爵位越高，可领取的官印越高级，属性效果越强\n" +
"4、升级爵位消耗历练值，每天完成<c6>列表任务</c6>，可获得海量历练值\n" +
"5、每天获得的历练值达到一定量后，可领取<c6>历练奖励</c6>" ;

	/** 次数:{0}*/
	public static L18:string = "次数：{0}";
	/**历练：{0} */
	public static L19:string = "历练：{0}";

	/**爵位中文名字 */
	public static LA1:string[] = ["平民","男爵","子爵","伯爵","侯爵","公爵","太渊•王爵","天煞•王爵","无极•王爵","璇玑•王爵","苍穹•王爵"];

	public static LangMedalItemName:any={
		[EStrengthenExType.EStrengthenExTypeWing]:"翅膀等级",
		[EStrengthenExType.EStrengthenExTypeUpgrade]:"强化等级",
		[EStrengthenExType.EStrengthenExTypeRefine]:"精炼等级",
		[EStrengthenExType.EStrengthenExTypeCast]:"铸造等级",
		[EStrengthenExType.EStrengthenExTypeInternalForce]:"内功等级",
		[EStrengthenExType.EStrengthenExTypeDragonSoul]:"龙炎等级",
		[EStrengthenExType.EStrengthenExTypeSKill]: "技能等级"//技能
	};
	

}