class WindowMethodDecompose extends BaseWindow {

    private list_heart : List;
    private btn_fenjie : fairygui.GButton;
    private btn_color2 : fairygui.GButton;
    private btn_color3 : fairygui.GButton;
    private btn_color4 : fairygui.GButton;
    private btn_color5 : fairygui.GButton;
    private loader_icon : GLoader;
    private txt_num : fairygui.GTextField;
    private txt_add : fairygui.GTextField;
    private itemDatas: Array<ItemData>;
	private index : number;
	private colorBtn: any;

    public costCode = 32000000;
	private itemNum : number;

	private runeCoinAdd: number;

    public constructor() {
        super(PackNameEnum.MagicWare , "WindowMethodDecompose");
    }
    
    public initOptUI() : void {
		this.title = "心法分解";
        this.list_heart = new List(this.getGObject("heart_list").asList);
        this.btn_fenjie = this.getGObject("btn_resolve").asButton;
        this.btn_color2 = this.getGObject("btn_color2").asButton;
        this.btn_color3 = this.getGObject("btn_color3").asButton;
        this.btn_color4 = this.getGObject("btn_color4").asButton;
        this.btn_color5 = this.getGObject("btn_color5").asButton;
        this.loader_icon = <GLoader>this.getGObject("icon_loader");
        this.txt_num = this.getGObject("item_num").asTextField;
        this.txt_add = this.getGObject("item_add").asTextField;
		this.runeCoinAdd = 0;
		this.colorBtn = {};
		for(let color = EColor.EColorBlue; color <= EColor.EColorRed; color ++){
			let btn: fairygui.GButton = this.getGObject(`btn_color${color}`).asButton;
			btn.addClickListener(this.onSelectColor, this);
			this.colorBtn[`color_${color}`] = btn;
		}
		this.itemNum = 0;
		this.list_heart.list.addEventListener(fairygui.ItemEvent.CLICK, this.onClickItem, this);
		this.btn_fenjie.addClickListener(this.clickDecomposeBtn, this);
    }

    public updateAll(data : any) {
		if(data && data != null) {
			this.index = data;
		}
		else{
			this.index = 0;
		}
		this.runeCoinAdd = 0;
		this.updateList();
		this.UpdateNowTxt();
		this.UpdateAddTxt();
		this.autoSelect();
    }

	public updateProp() {
		this.runeCoinAdd = 0;
		this.updateList();
		this.UpdateNowTxt();
		this.UpdateAddTxt();
	}


	public updateList() {
		let decomposeData: Array<ItemData> = [];
        this.itemDatas = CacheManager.pack.propCache.getAllHeartMethodByPos(this.index + 1);
        this.sortRuneDecompose();
        for(let data of this.itemDatas){
			let max: number = data.getItemAmount();
			for(let i = 0; i < max; i++){
				decomposeData.push(data);
			}
		}
		this.list_heart.data = decomposeData;
		if(this.list_heart.list.numItems > 0){
			this.list_heart.list.scrollToView(0);
		}
	}

    public sortRuneDecompose():void {
		if(this.itemDatas && this.itemDatas.length > 0){
			this.itemDatas.sort((a: any, b:any): number =>{
				return this.getMethodSort(a, b);
			});
		}
	}

    private getMethodSort(a: ItemData, b: ItemData):number{
		if(a.getColor() > b.getColor()){//先根据颜色排序
			return -1;
		}else if(a.getColor() < b.getColor()){
			return 1;
		}else{//再根据type排序
			if(a.getType() > b.getType()){
				return -1;
			}else if(a.getType() < b.getType()){
				return 1;
			}else{
				if(a.getItemExtInfo().level > b.getItemExtInfo().level){
					return -1;
				}else if(a.getItemExtInfo().level < b.getItemExtInfo().level){
					return 1;
				}
			}
		}
		return 0;
	}

	private onClickItem(e: fairygui.ItemEvent): void {
		let decomposeItem: HeartMethodDecomposeItem = <HeartMethodDecomposeItem>e.itemObject;
		if (decomposeItem.itemData) {
			if(decomposeItem.selected){
				this.runeCoinAdd += decomposeItem.addCoin;
			}
			else{
				this.runeCoinAdd -= decomposeItem.addCoin;
			}
		}
		this.UpdateAddTxt();
		//this.updateExp();
	}

	private UpdateNowTxt() {
		let itemCfg: any = ConfigManager.item.getByPk(this.costCode );
        this.loader_icon.load(URLManager.getIconUrl(itemCfg.icon, URLManager.ITEM_ICON));
        let costitems:ItemData = CacheManager.pack.propCache.getItemByCode(this.costCode);
        if(costitems){
            this.itemNum = costitems.getItemAmount();
        }
        else{
            this.itemNum = 0;
        }
		this.txt_num.text = this.itemNum.toString();
	}
	
	private UpdateAddTxt() {
		if(this.runeCoinAdd > 0) {
			this.txt_add.text = "+"+this.runeCoinAdd.toString();
		}
		else {
			this.txt_add.text = "";
		}
	}


	private updateSelect(selected: any): void{
		let decomposeItems: Array<HeartMethodDecomposeItem> = this.list_heart.list._children as Array<HeartMethodDecomposeItem>;
		for(let decomposeItem of decomposeItems){
			if(decomposeItem.itemData.getColor() == selected["color"]){
				if(selected["isSelect"]){
					if(!decomposeItem.selected){
						decomposeItem.selected = true;
						this.runeCoinAdd += decomposeItem.addCoin;
					}
				}
				else{
					if(decomposeItem.selected){
						decomposeItem.selected = false;
						this.runeCoinAdd -= decomposeItem.addCoin;
					}
				}
			}
		}
		this.UpdateAddTxt();
	}

	private autoSelect(): void{
		for(let color = EColor.EColorBlue; color <= EColor.EColorRed; color ++){
			let btn: fairygui.GButton = this.colorBtn[`color_${color}`];
			if(color == EColor.EColorBlue){
				let select: any = {"color": color, "isSelect": true};
				this.updateSelect(select);
				btn.selected = true;
			}else{
				btn.selected = false;
			}
		}
	}

	/**点击符文复选框 */
	private onSelectColor(e: any): void{
		let btn: fairygui.GButton = e.target.asButton;
		let color: number = Number(btn.name.replace("btn_color", ""));
		let select: any = {"color": color, "isSelect": e.target.selected};
		this.updateSelect(select);
	}

		/**分解按钮操作 */
	private clickDecomposeBtn():void{
		let decomposeRune: any = {};
		let isCanDecompose: boolean = false;
		let decomposeItems: Array<HeartMethodDecomposeItem> = this.list_heart.list._children as Array<HeartMethodDecomposeItem>;
		let listSelection: Array<number> = this.list_heart.list.getSelection();
		for(let select of listSelection){
			let decomposeItem = this.list_heart.list.getChildAt(select) as HeartMethodDecomposeItem;
			if(ItemsUtil.isTrueItemData(decomposeItem.itemData)){
				let uid: string = decomposeItem.itemData.getUid();
				if(decomposeRune[uid]){
					decomposeRune[uid]++;
				}else{
					decomposeRune[uid] = 1;
				}
				if(!isCanDecompose){
					isCanDecompose = true;
				}
			}
		}
		if(isCanDecompose){
			let sendUids: Array<string> = [];
			let sendAmounts: Array<number> = [];
			for(let uid in decomposeRune){
				if(sendUids.length == 50){
					EventManager.dispatch(LocalEventEnum.HeartMethodDecompose, sendUids, sendAmounts);
					sendUids = [];
					sendAmounts = [];
				}
				sendUids.push(uid);
				sendAmounts.push(decomposeRune[uid]);
			}
			if(sendUids.length > 0){
				EventManager.dispatch(LocalEventEnum.HeartMethodDecompose, sendUids, sendAmounts);
			}
		} else {
			EventManager.dispatch(LocalEventEnum.ShowRollTip, "未选中需要分解的心法");
		}
	}
}