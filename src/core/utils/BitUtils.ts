class BitUtils {
	
	public static band(optVal1:number,optVal2:number):number {
		return optVal1 & optVal2;
	}

	public static bor(optVal1:number,optVal2:number):number{
		return optVal1 | optVal2;
	}

	/**
     * 根据高低位 构造64位整数
     */
    public static makeLong64(lo:number,hi:number):number{
        var ret:number = lo + hi * 0x100000000; // 2^32
	    return ret;
    }

}