/**九幽魔窟 89*/
class JiuYouCopyPanel extends BaseCopyPanel {

	public constructor(copyInf: any) {
		super(copyInf, "JiuYouCopyPanel");
	}
	protected updateProcess(): void {
				
		var curRing: number = 0;
		var maxRing: number = 0;
		if (this.cache.copyRingInf) {
			curRing = this.cache.copyRingInf.curRing;
			maxRing = this.cache.copyRingInf.maxRing;
		}
		var tempStr: string = "当前进度：" + HtmlUtil.html(curRing + "/" + maxRing + "波", Color.Green);
		var html: string = HtmlUtil.html(tempStr, Color.Yellow, true);
		var killNum_I: number = 0;
		var expStr: string = "0";
		var insBufStr: string = "0%";
		var drupBufStr: string = "0%";
		var teamBufStr: string = "0%";
		if (this.cache.expCopyInf) {
			killNum_I = this.cache.expCopyInf.killNum_I;
			var rewardExp_L64: any = this.cache.expCopyInf.experience_L64;
			expStr = App.MathUtils.formatNum64(rewardExp_L64, false);
			insBufStr = (this.cache.expCopyInf.coinInspireNum_I + this.cache.expCopyInf.goldInspireNum_I) * 10 + "%";
			drupBufStr = this.cache.expCopyInf.drupExpAdd_I + "%";
			teamBufStr = this.cache.expCopyInf.teamExpAdd_I + "%";
		}
		tempStr = "组队杀怪：" + HtmlUtil.html("" + killNum_I, Color.Green);
		html += HtmlUtil.html(tempStr, Color.Yellow, true);

		tempStr = "经验获得：" + HtmlUtil.html("" + expStr, Color.Green);
		html += HtmlUtil.html(tempStr, Color.Yellow, true);

		tempStr = "鼓舞伤害：" + HtmlUtil.html(insBufStr, Color.Green);
		html += HtmlUtil.html(tempStr, Color.Yellow, true);
		//攻击力加成
		tempStr = "药水经验加成：" + HtmlUtil.html(drupBufStr, Color.Green);
		html += HtmlUtil.html(tempStr, Color.Yellow, true);

		tempStr = "组队经验加成：" + HtmlUtil.html(teamBufStr, Color.Green);
		html += HtmlUtil.html(tempStr, Color.Yellow, true);
		this.txt_target.text = html;
	}

}