/**
 * 游戏中用到的颜色
 */
class Color {
    //统一色值，与界面规范中对应
    public static Color_1: string = "#3894fc";//蓝色
    public static Color_2: string = "#fea700";
    public static Color_3: string = "#f61eff";
    public static Color_4: string = "#ff2d14";
    public static Color_5: string = "#eee43f";
    public static Color_6: string = "#09c73d";
    public static Color_7: string = "#d3bf96";
    public static Color_8: string = "#f5e8ce";
    public static Color_9: string = "#786b52";
    public static Color_10: string = "#fcf9d7";
    public static Color_11: string = "#ad906b";

	public static White: number = 0xFFFFFF;
	public static Green: number = 0x09c73d; //副本结算面板倒计时颜色
	public static Green2: number = 0x09c73d;
	public static Red: number = 0xFF0000;
	public static Red2: number = 0xff2d14;
	public static Yellow: number = 0xFEA700; //黄色 副本面板标题用到
	public static Yellow2: number = 0xECDDBC; //黄色 副本面板描述用到
	public static Yellow3: number = 0x4F3F23; //
	public static Blue: number = 0x0000FF; //黄色 副本面板描述用到
	public static TitleAttrName: number = 0x2F1603;//咖啡色，称号属性加成属性名颜色
	public static ButtonTitleGrayColor: number = 0x464646;//按钮灰掉文本描边颜色

	/**公共绿色 */
	public static GreenCommon: string = "#09c73d";
	/**公共红色 */
	public static RedCommon: string = "#ff2d14";

	/** 白色 #feffff */
	public static BASIC_COLOR_0 = "#feffff"; //
	/** 暗褐色 #2f1603 */
	public static BASIC_COLOR_1 = "#2f1603"; //
	/** 淡橙色 #853d07 */
	public static BASIC_COLOR_2 = "#853d07"; //
	/** 淡粉色 #d3bf96 */
	public static BASIC_COLOR_3 = "#d3bf96"; //
	/** 绿色 #09c73d */
	public static BASIC_COLOR_4 = "#09c73d"; //
	/** 蓝色 #0178fe */
	public static BASIC_COLOR_5 = "#0178fe"; //
	/** 紫色 #df22e7 */
	public static BASIC_COLOR_6 = "#df22e7"; //紫色
	/** 红色 #df140f */
	public static BASIC_COLOR_7 = "#df140f"; //红色
	/** 橙色 #fea700 */
	public static BASIC_COLOR_8 = "#fea700"; //橙色
	/** 柠檬黄色 #eee43f */
	public static BASIC_COLOR_9 = "#eee43f"; //柠檬黄色
	/** 灰色 #8f7c68 */
	public static BASIC_COLOR_10 = "#8f7c68"; //-灰色
	/** 白色装备颜色 #a1a1a1 */
	public static BASIC_COLOR_11 = "#a1a1a1"; //-白色装备颜色
	/** 淡绿色 #4afe7d */
	public static BASIC_COLOR_12 = "#4afe7d"; //淡绿色
	/** 暗橙色 #d36d00 */
	public static BASIC_COLOR_13 = "#d36d00"; //暗橙色

	/** 职业颜色*/
	public static CAREER_COLOR_1 = "#ff6912"; //天权
	public static CAREER_COLOR_2 = "#6fddfa"; //璇玑
	public static CAREER_COLOR_4 = "#ff65ae"; //穹苍

	/**物品颜色值 */
	public static ItemColor: any = {
		"0": "#8C8C8C",//"灰色"
		"1": "#feffff",//"白色"
		"2": "#3894fc",//"蓝色"
		"3": "#f61eff",//"紫色"
		"4": "#fea700",//"橙色"
		"5": "#ff2d14",//"红色"
		"6": "#eee43f",//"金色"
		"7": "#e20074",//"粉色"
	};

	/**物品颜色值0x */
	public static ItemColorHex: any = {
		"0": 0x8C8C8C,//"灰色"
		"1": 0xfeffff,//"白色"
		"2": 0x3894fc,//"蓝色"
		"3": 0xf61eff,//"紫色"
		"4": 0xfea700,//"橙色"
		"5": 0xff2d14,//"红色"
		"6": 0xeee43f,//"金色"
		"7": 0xe20074,//"粉色"
	};

	/**广播配置用到的颜色 */
	public static rumor: any = {
		"0": "#8C8C8C",  //灰
		"1": "#ffffff",  //白
		"2": "#09c73d", 	//绿
		"3": "#00effe", 	//蓝
		"4": "#f61eff", 	//紫
		"5": "#fea700", 	//橙
		"6": "#ff2d14", 	//红
		"7": "#eee43f", 	//黄
		"8": "#00a8ff",//祡霄
		"9": "#00e841",//星辰
		"10": "#ffb400",//苍穹
		"11": "#3a92fe",
		"12": "#fea700",//橘黄色
	};

	/**称号品质颜色 */
	public static titleQuality : any = {
		"1":"#3894fc",
		"2":"#f61eff",
		"3":"#ff2d14"
	};

	/**
	 * 阵地争夺经验飘字提示文本颜色
	 */
	public static expOccupyTips :any = {
		"1":0xf5e8ce,
		"2":0x3894fc,
		"3":0xf61eff,
		"5":0xfea700,
	};

	/**爵位名字颜色 */
	public static nobilityColor:string[]= [
		"#ffffff","#09c73d","#3894fc","#f61eff","#fea700","#ff2d14","#eee43f","#eee43f","#eee43f","#eee43f","#eee43f"
	];

	/**广播配置用到的颜色 */
	public static getRumor(index: string): string {
		return Color.rumor[index];
	}

	public static getItemColr(index: string): string {
		return Color.ItemColor[index];
	}

	public static getStColor(index: number): string {
		return Color["Color_" + index];
	}

	/**根据爵位等阶获取名字颜色 */
	public static getNobilityColor(stage:number):string{		
		let clr:string = "";
		if(stage>-1 && stage<=Color.nobilityColor.length){
			let idx:number = stage-1;
			idx = Math.max(0,idx);
			clr = Color.nobilityColor[idx];
		}
		return clr;
	}

	public static toNum(str: string): number {
		str = str.substr(1, str.length);
		return parseInt(str, 16);
	}

	public static toStr(clr: number): string {
		let str: string = clr.toString(16);
		return "#" + str;
	}

}