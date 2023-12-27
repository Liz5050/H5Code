class HtmlUtil {
	public constructor() {
	}
	public static brText:string = "\n";
	public static Parser:egret.HtmlTextParser = new egret.HtmlTextParser();

    public static br(text:string):string{
		if(!text) {
			return "";
		}
        return text.replace(/<br>/g, HtmlUtil.brText);
    }
	/**
	 * 构造一个html文本
	 * @params text 要设置的文本内容
	 * @params color 文本颜色 字符串(需要自带#)或者整数
	 * @params newLine 是否换行
	 * @params size 字体大小
	 */
	public static html(text:string,color:any=Color.White,newLine:boolean=false,size:number=0,href:string="",isUnderline:boolean=false):string{
		var cStr:string = "" 
		if(color){
			cStr = typeof(color)=="number"?"#"+color.toString(16):color;
			cStr = `color="${cStr}"`;
		}
		var sizeStr:string = "";
		if(size>0){
			sizeStr = `size="${size}"`;
		}

		if(isUnderline){
			text = `<u>${text}</u>`;
		}
		if(href){			
			text = `<a href='event:${href}'>${text}</a>`;
		}		
		var br:string = newLine?HtmlUtil.brText:"";
		return `<font ${cStr} ${sizeStr} >${text}</font>`+br;
	}

	/**
	 * 解析富本文格式
	 */
	public static parser(text:string):egret.ITextElement[]
	{
		return HtmlUtil.Parser.parser(text);
	}

	public static color(text:string,color:string):egret.ITextElement[]
	{
		let _html:string = "<font color = '" + color + "'>" + text + "</font>";
		return HtmlUtil.parser(_html);
	}

    private static ColorTagReg: RegExp = /<c\s*(\d{1,9})\s*>/gm;
    private static ColorEndTagReg: RegExp = /<\/c\s*(\d{1,9})\s*>/gm;
    /**
     * 解析自定义颜色标签<c1>XXX</c1>,数字对应Color中的Color_1,2,3...
	 * 后面参数是占位符替换，跟StringUtils.substitude一样的用法
     */
    public static colorSubstitude(text:string, ... rest):string
    {
    	let result:string = text;
        let params:string[];
        while (null != (params  = HtmlUtil.ColorTagReg.exec(text))) {
            result = result.replace(params[0], "<font color = '" + Color["Color_" + params[1]] + "'>");
		}
        result = result.replace(HtmlUtil.ColorEndTagReg, "</font>");

        if (rest && rest.length) {
            result = App.StringUtils.substitude(result, ... rest);
		}
        return result;
    }

	public static getColorStr(color:EColor):string
	{
		return LangCommon["LANG1"+color];
	}
}