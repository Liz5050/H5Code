/**
 * 回调
 */
class CallBack {
	public fun: Function;
	public caller: any;
	public param: any;

	public constructor(fun: Function, caller: any, param: any = null) {
		this.fun = fun;
		this.caller = caller;
		this.param = param;
	}
}