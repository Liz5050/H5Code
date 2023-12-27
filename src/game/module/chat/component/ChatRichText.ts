/**聊天内容的真正包装器(这个已经弃用了) */
class ChatRichText extends fairygui.GComponent {
	
	private static FACE_CAL_W: number = 50;
	private static FACE_W: number = 40;
	private static FACE_H: number = 40;
	private static TEXT_H: number = 30;
	/**这个值不是固定 */
	//public static LINE_MAX_W: number = 600;

	/**固定的 聊天对话框的宽 */
	public static CHATITEM_W: number = 550;
	/**固定的 主界面显示的聊天内容宽 */
	public static CHANELITEM_W: number = 400;
	/**行距 */
	public static LINE_GAP:number = 3;

	/**为了准确计算文本占的宽度 */
	public static MEASURE_TXT: fairygui.GRichTextField = new fairygui.GRichTextField();
	protected _contentW: number = 0;
	protected _contentH: number = 0;
	protected _curLineW: number = 0;
	protected _curLineH: number = 0;
	protected _lineNum: number = 1;
	/**最大宽度 */
	protected _maxWid:number = 0;
	protected _faceArr: Array<any>;
	protected _RTxtArr: Array<fairygui.GRichTextField>;
	protected _curItemIndex:number = 0;
	protected _msgData:SChatMsg;

	protected _curLineEleDict:any;
	protected _lineHInfDict:any;



	public constructor(maxWid:number) {
		super();
		this._faceArr = [];
		this._RTxtArr = [];
		this._curLineEleDict = {};
		this._lineHInfDict = {};
		this._maxWid = maxWid;
	}

	public update(data: any): void {
		this.resetContent();
		this._msgData = <SChatMsg>data;
		var chatArr: string[] = App.StringUtils.anlysisMsg(this._msgData.content_S,ChatUtils.FIND_FACE_REG);
		var preTxt: fairygui.GRichTextField;
		var face: ChatFaceItem;
		var curX: number = 0;
		var curY: number = 0;
		var newLineFlag: boolean = false;
		for (var i: number = 0; i < chatArr.length; i++) {
			var isFace: boolean = ChatUtils.isFaceStr(chatArr[i]);
			var curAddW: number = 0;
			newLineFlag = false;
			if (isFace) {
				var id: string = chatArr[i].slice(1);
				curAddW = ChatRichText.FACE_CAL_W;
				this._curLineH = Math.max(ChatRichText.FACE_H, this._curLineH);
				this.setLineHInf(this._lineNum,this._curLineH);
				newLineFlag = this.isNewLine(curAddW);				
				if (newLineFlag) {
					curX = 0;
					face = this.addFace(id,curX,this._contentH+5); //y 不包括当前行高的高					
					this._curLineW = 0;
					this._lineNum++;
					this.setLineHInf(this._lineNum,this._curLineH);
					this._contentH += this._curLineH;
					curY = face.y;
				} else {
					this._contentH = Math.max(this._curLineH, this._contentH);
					face = this.addFace(id,curX,curY);				
				}
				curX = face.x + curAddW;
			} else {
				var msgStr: string = chatArr[i];
				var srcMsg:string = msgStr;
				var html: string = HtmlUtil.html(msgStr, Color.Blue);
				curAddW = this.getTextW(html);
				newLineFlag = this.isNewLine(curAddW); //判断当前文本的宽度是否需要换行
				this._curLineH = Math.max(this._curLineH, ChatRichText.TEXT_H);
				this.setLineHInf(this._lineNum,this._curLineH);
				this._contentH = Math.max(this._curLineH, this._contentH);
				//文本需要换行
				if (newLineFlag) {
					//计算当前文本需要多少行
					html = "";
					var reg:RegExp = /\]/g;								
					
					var curCalStr: string = "";
					var curCalIdx: number = 0;
					var itemIdx:number = this._curItemIndex;
					for (var j: number = 0; j < msgStr.length; j++) {
						curCalStr = msgStr.slice(curCalIdx, j + 1);
						var link:string=this.cutItemLink(msgStr,j,itemIdx,curCalIdx);
						if(link){
							curCalStr = link;
							itemIdx++;							
						}
						var lw: number = this.getCurLineSpaceW();
						var tw: number = this.getTextW(HtmlUtil.html(curCalStr, Color.Blue));					
						if (tw > lw) { //换行了							
							preTxt = this.addTextField(curX, curY,  msgStr.slice(curCalIdx, j)); //当前行剩余可以放置的文本内容	
							this.addLineTxtElement(preTxt,this._lineNum);							
							curX = 0; //换行 从0开始
							this._curLineW += preTxt.textWidth;
							this._contentW = Math.max(this._contentW, this._curLineW);
							this._lineNum++;							
							this._curLineH = Math.max(this._curLineH, ChatRichText.TEXT_H);
							this.setLineHInf(this._lineNum,this._curLineH);
							curY = Math.max(this._contentH, this._curLineH); //下一行的Y等于当前高							
							this._contentH += this._curLineH;
							//重置行宽 计算剩余字符串是否一行可以放得下
							this._curLineW = 0;
							srcMsg = msgStr.slice(j, msgStr.length);							
							if (this.checkLeftLine(srcMsg)) { //剩余的下一行可以放得下了
								curX = 0;
								break;
							} else {
								curCalIdx = j;
							}

						} else {
							srcMsg = curCalStr;
						}
					}

				} else {
					this._contentH = Math.max(this._curLineH, this._contentH);
					this.setLineHInf(this._lineNum,this._curLineH);
				}
				preTxt = this.addTextField(curX, curY, srcMsg);
				this.addLineTxtElement(preTxt,this._lineNum);
				curAddW = preTxt.textWidth;
				curX = preTxt.x + curAddW;
			}
			this.calSizeW(newLineFlag,curAddW);
		}
		this.layoutAllTxt();
	}

	/**计算当前行的宽或总宽 */
	private calSizeW(newLineFlag:boolean,curAddW:number):void{
		if (!newLineFlag) {
			this._curLineW += curAddW;
		} else {
			this._curLineW = Math.max(this._curLineW, curAddW);
		}
		this._contentW = Math.max(this._contentW, this._curLineW);
	}

	/**检查剩余的行宽度是否可以放得下字符串 */
	private checkLeftLine(srcMsg:string):boolean{		
		var lw:number = this.getCurLineSpaceW(); //当前行剩余宽度
		var html:string = HtmlUtil.html(srcMsg, Color.Blue);							
		var tw:number = this.getTextW(html); //目前需要的宽度
		return lw>tw;
	}

	/**查找物品字符串 匹配就截取 */
	private cutItemLink(msgStr:string,j:number,itemIdx:number,curCalIdx:number):string{
		var reg:RegExp = /\]/g;
		var curCalStr:string = "";
		if(msgStr.charAt(j)=="["){ //遇到疑似物品开头
			reg.lastIndex = 0;
			var tempStr:string = msgStr.slice(j,msgStr.length);
			var tempIdx:number = tempStr.search(reg);
			var chatItem:any = CacheManager.chat.getChatItem(this._msgData,itemIdx);
			var endIdx:number = tempIdx + j + 1;
			var itemName:string = msgStr.slice(j+1,endIdx-1);
			if(tempIdx>-1 && chatItem && ItemsUtil.checkName(chatItem.itemCode_I,itemName)){ //判断是否真正的物品
				curCalStr =  msgStr.slice(curCalIdx, endIdx); //包含物品				
			}		
		}
		return curCalStr;
	}
	
	protected addTextField(curX: number, curY: number, srcMsg: string): fairygui.GRichTextField {
		var preTxt:fairygui.GRichTextField = ObjectPool.pop("fairygui.GRichTextField");
		this.addChild(preTxt);
		var html:string = this.fmtHtml(srcMsg);
		preTxt.text = html;
		preTxt.x = curX;
		var txt:egret.TextField = <egret.TextField>preTxt.displayObject;
		preTxt.y = curY;		
		this._RTxtArr.push(preTxt);
		if(html.indexOf("href")>-1 && !preTxt.hasEventListener(egret.TextEvent.LINK)){
			preTxt.addEventListener(egret.TextEvent.LINK,this.onClickLink,this);
		}		
		return preTxt;
	}

	private onClickLink(e:egret.TextEvent):void{		
		CacheManager.chat.isClickLink = true;
		e.stopPropagation();
		EventManager.dispatch(UIEventEnum.ChatClickLink,e.text);
	}

	protected addFace(id: string,px:number,py:number): ChatFaceItem {
		var face:ChatFaceItem = ObjectPool.pop("ChatFaceItem");
		this.addChild(face);
		face.setSize(ChatRichText.FACE_W,ChatRichText.FACE_H);
		face.setData({id:Number(id)});		
		face.x = px;
		face.y = py;
		this._faceArr.push(face);
		return face;
	}

	protected fmtHtml(srcMsg: string):string{
		var html:string = "";
		var href:string;
		var splitStr:string = "|";
		var clr:string = ChatUtils.getChatChanelColor(this._msgData.chatType_I,false);

		if(ChatUtils.isMsgPosStr(srcMsg)){ // 创建坐标链接: <测试地图|601000|1|134>
			srcMsg = srcMsg.slice(1,srcMsg.length-1);
			var arr:string[] = srcMsg.split(splitStr);
			href =  ChatEnum.CHAT_LINK_POS+splitStr+arr.slice(1,arr.length).join(splitStr);
			html = HtmlUtil.html(`${arr[0]}|[${arr[2]},${arr[3]}]`,clr,false,0,href,true); 
		}else if(ChatUtils.isHasItemMsg(srcMsg)){
			var strArr:string[] = App.StringUtils.anlysisMsg(srcMsg,ChatUtils.FIND_ITEM_REG);
			var len:number = strArr.length;
			var isItem:boolean;
			var str:string;
			for(var i:number = 0;i<len;i++){
				str = strArr[i];
				isItem = ChatUtils.isItemStr(str);
				var playerItem:any = CacheManager.chat.getChatItem(this._msgData,this._curItemIndex);
				if(isItem && playerItem && ItemsUtil.checkName(playerItem.itemCode_I,str.slice(1,str.length-1))){ //创建物品链接
					var itemClr = ItemsUtil.getColorBySPlayerItem(playerItem); //物品 用物品颜色
					href =ChatEnum.CHAT_LINK_ITEM+splitStr+ItemsUtil.sPlayerItemToStr(playerItem)
					html += HtmlUtil.html(str,itemClr,false,0,href,true);
					this._curItemIndex++;
				}else{
					html += HtmlUtil.html(str, clr);
				}
			} 
			
		}else{
			html = HtmlUtil.html(srcMsg,clr);
		}	
		return html;	
	}

	/**计算字符串占文本的宽度 */
	protected getTextW(html: string): number {
		var tw: number = 0;
		ChatRichText.MEASURE_TXT.text = html;
		tw = ChatRichText.MEASURE_TXT.textWidth;
		return tw;
	}

	/**根据一个宽度判断 是否需要换行 */
	protected isNewLine(currentW: number): boolean {
		var maxW: number = this._maxWid;
		if (this._curLineW >= maxW || this._curLineW + currentW > maxW) {
			return true;
		}
		return false;
	}

	/**获取当前行剩余的空间 */
	protected getCurLineSpaceW(): number {
		var maxW: number = this._maxWid;
		var w: number = maxW - this._curLineW;
		return w;
	}

	/**记录每一行的文本元素 */
	protected addLineTxtElement(ele:fairygui.GRichTextField,line:number):void{
		if(!this._curLineEleDict[line]){
			this._curLineEleDict[line] = [];
		}
		this._curLineEleDict[line].push(ele);
	}
	/**重新布局排列所有文本的Y坐标 */
	protected layoutAllTxt():void{
		for(var line in this._lineHInfDict){
			this.layoutTxtByLine(Number(line));
		}
	}
	/**重新排列每一行的坐标 */
	protected layoutTxtByLine(line:number):void{
		var txtArr:fairygui.GRichTextField[] = this._curLineEleDict[line];
		if(txtArr){
			for(let txt of txtArr){
				var h:number = this._lineHInfDict[line];
				var t:egret.TextField = <egret.TextField>txt.displayObject;
				txt.y = txt.y + (h-ChatRichText.TEXT_H)/2;
			}
		}
	}

	/**记录每行的行高 */
	protected setLineHInf(line:number,h:number):void{
		this._lineHInfDict[line] = h;
	}

	/**设置最大宽度 */
	public setMaxWid(maxWid:number):void{
		this._maxWid = maxWid;
	}

	public get contentW(): number {
		return this._contentW;
	}
	public get contentH(): number {
		return this._contentH;
	}

	public get lineNum(): number {
		return this._lineNum;
	}

	/**
	 * 重置
	 */
	public resetContent(): void {
		while (this._faceArr.length > 0) {
			ObjectPool.push(this._faceArr.splice(0, 1)[0]);
		}
		while (this._RTxtArr.length > 0) {
			var rtxt:fairygui.GRichTextField = <fairygui.GRichTextField>this._RTxtArr.splice(0, 1)[0];
			ObjectPool.push(rtxt);
			if(rtxt.hasEventListener(egret.TextEvent.LINK)){
				rtxt.removeEventListener(egret.TextEvent.LINK,this.onClickLink,this);
			}
		}
		this.removeChildren();
		this._contentW = 0;
		this._contentH = 0;
		this._curLineW = 0;
		this._curLineH = 0;
		this._lineNum = 1;
		this._curItemIndex = 0;
		ObjectUtil.emptyObj(this._curLineEleDict);
		ObjectUtil.emptyObj(this._lineHInfDict);
	}

}