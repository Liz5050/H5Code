/**
 * View基类接口
 */
interface IBaseView {
    /**
     * 是否已经初始化
     * @returns {boolean}
     */
    isInit():boolean;

    /**
     * 面板是否显示
     * @return
     *
     */
    isShow():boolean;

    /**
     * 添加到父级
     */
    addToParent():void;

    /**
     * 从父级移除
     */
    removeFromParent():void;

    /**
     *对面板进行显示初始化，用于子类继承
     *
     */
    initUI():void;

    /**
     *对面板数据的初始化，用于子类继承
     *
     */
    initData():void;

    /**
     * 面板开启执行函数，用于子类继承
     * @param param 参数
     */
    open(...param:any[]):void;

    /**
     * 面板关闭执行函数，用于子类继承
     * @param param 参数
     */
    close(...param:any[]):void;

    /**
     * 销毁
     */
    destroy(...params:any[]):void;

    /**
     * 触发本模块消息
     * @param key 唯一标识
     * @param param 参数
     *
     */
    applyFunc(key:any, ...param:any[]):any;


    /**
     * 设置是否隐藏
     * @param value
     */
    setVisible(value:boolean):void;

    /**
     * 设置初始加载资源
     * @param resources
     */
    setResources(resources:string[]):void;

    /**
     * 分模块加载资源
     */
    loadResource(loadComplete:Function, initComplete:Function):void;

    /**
	 * 打开指定标签页
     * @param index
     * @param controllerName 控制器名称
	 */
	gotoTab(index:number, controllerName:string):void;
}