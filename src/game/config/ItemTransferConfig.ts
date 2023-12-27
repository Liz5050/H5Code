class ItemTransferConfig extends BaseConfig {
	public constructor() {
		super("t_item_transfer","targetItemCode");
	}

	/**是否只能分解 */
	public isOnlySmelt(info:any):boolean{
		return info.transferLimit==1; //转换限制（1：只能分解（正向）；2：只能合成（反向）；3：可分解可合成（双向<1+2>））
	}

}