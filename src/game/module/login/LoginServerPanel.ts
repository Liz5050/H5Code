class LoginServerPanel extends BaseView {
	/**服务器列表 */
	private list_serverName: List;
	/**最近登录的服 */
	private list_serverInterval: List;
	private selectCbFn: Function;
	private selectCbFnCaller: any;
	/** 指定服务器 */
	private specifiedServer: number;
	private serverList: any[];
	private recentList: any[];
	private _curSelectInf: any;

	public constructor(v: fairygui.GComponent) {
		super(v);
	}
	protected initOptUI(): void {
		this.list_serverName = new List(this.getGObject("list_serverName").asList);
		this.list_serverInterval = new List(this.getGObject("list_serverInterval").asList);

		this.list_serverName.list.addEventListener(fairygui.ItemEvent.CLICK, this.onClickItem, this);
		this.list_serverInterval.list.addEventListener(fairygui.ItemEvent.CLICK, this.onClickItem, this);

	}
	public updateAll(data?: any): void {
		this.selectCbFn = data.cbFn;
		this.selectCbFnCaller = data.caller;
		this.updateList();
	}


	

	private updateList(): void {
		let serverListConfig: any;
		if (App.DeviceUtils.IsWXGame) {
			if(Sdk.WXGameServerListJson) {
				serverListConfig = Sdk.WXGameServerListJson;
			}
			else {
				serverListConfig = JSON.parse(Sdk.WXGameServerList);
			}
		} else {
			serverListConfig = App.ServerList;
			//serverListConfig = JSON.parse(Sdk.TestServerList);
		}
		this.serverList = serverListConfig.list;
		this.recentList = serverListConfig.recent;
		this.list_serverName.setVirtual(this.serverList);
		if(!this.recentList) {
			this.list_serverInterval.setVirtual(this.serverList);
		}
		else{
			this.list_serverInterval.setVirtual(this.recentList);
		}
		this.specifiedServer = serverListConfig.specified; //自动选择的服
		this.setDfSelect();
	}

	private setDfSelect(): void {
		var dfIndex: number = 2;//默认程序测试服

		if (App.JSUtils.IsUrlOutside) {
			dfIndex = this.specifiedServer;
		} else if (!App.JSUtils.IsUrlOutside && App.JSUtils.IsClientStable) {
			dfIndex = 0; //稳定测试服，固定链接稳定服务端
		} else {
			//临时功能
			if(this.specifiedServer) {
				dfIndex = this.specifiedServer - 1;
			}
			var lastName: string = LocalStorageUtils.getItem(LoginView.LAST_LOGIN_SERVER);
			if (lastName) {
				for (var i: number = 0; i < this.serverList.length; i++) {
					var inf: any = this.serverList[i];
					if (inf.url == lastName) {
						this._curSelectInf = inf;
						dfIndex = i;
						break;
					}
				}
			}
		}
		this._curSelectInf = this.serverList[dfIndex];
		this.list_serverName.scrollToView(dfIndex, false);
		this.list_serverName.selectedIndex = dfIndex;
		var item: LoginBaseItem = <LoginBaseItem>this.list_serverName.selectedItem;
		item.selected = true;
	}

	private onClickItem(e: fairygui.ItemEvent): void {
		var item: LoginBaseItem = <LoginBaseItem>e.itemObject;
		this._curSelectInf = item.getData();
		this.selectCbFn.call(this.selectCbFnCaller);
	}

	/**当前选中的服务器信息 */
	public get curSelectInf(): any {
		return this._curSelectInf;
	}

}