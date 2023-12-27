/**
 * 子控制器，见ArenaController
 * @author Chris
 */
abstract class SubController {
    protected _module:any;

    public constructor() {
        this.addListenerOnInit();
    }

    protected addListenerOnInit():void {
    }

    public addListenerOnShow(): void {
    }

    public removeListenerOnHide(): void {
    }

    protected addListen0(name: any, listener: Function, listenerObj: any): void {
        EventManager.addListener(name, listener, listenerObj);
    }

    /**
     * 主动移除指定监听
     */
    protected removeListener(name: any, listener: Function, caller: any): void {
        EventManager.removeListener(name, listener, caller);
    }

    /**
     * 添加服务器消息监听
     */
    protected addMsgListener(type: string, listener: Function, listenerObj: any): void {
        App.MessageCenter.addListener(type, listener, listenerObj);
    }

    public get isShow():boolean {
        return this._module && this._module.isShow;
    }

    public setModule(module:any):void {
        this._module = module;
    }

    /**
     * 子类重写
     */
    abstract getModule(): any;
}