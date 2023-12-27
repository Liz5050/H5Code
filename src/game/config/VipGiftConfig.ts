/**Vip礼包配置 */
class VipGiftConfig extends BaseConfig
{
	
    private _vipGiftDatas:any = {};

	public constructor() {
		super("t_vip_gift_package", "id");
	}

    //获取数据列表
    public getVipGiftDatas(type:number):Array<any> {
        if(!this._vipGiftDatas[type]) {
            let datas: any = this.select({"type": type});
            let arr:Array<any> = [];
            let subDic:any = {};
            for(let key in datas) {
                arr.push(datas[key]);
            }
            App.ArrayUtils.sortOn(arr, "order");

            this._vipGiftDatas[type] = arr;
        }
        return this._vipGiftDatas[type];
    }


}