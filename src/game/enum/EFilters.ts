class EFilters {

	public static GRAY_FILTER: egret.ColorMatrixFilter = new egret.ColorMatrixFilter([
		0.3, 0.6, 0, 0, 0,
		0.3, 0.6, 0, 0, 0,
		0.3, 0.6, 0, 0, 0,
		0, 0, 0, 1, 0
	]);

	/**灰度滤镜 */
	public static GRAYS:egret.Filter[] = [EFilters.GRAY_FILTER];

	/**剧情广播发光滤镜 */
	public static GLOW_FILTER:egret.GlowFilter = new egret.GlowFilter( 0xffffff, 0.8, 10, 10,
    2, egret.BitmapFilterQuality.HIGH, false, false );

	/**剧情广播发光滤镜 */
	public static GLOWS:egret.Filter[] = [EFilters.GLOW_FILTER];


	public static BLACK_FILTER: egret.ColorMatrixFilter = new egret.ColorMatrixFilter([
		0, 0, 0, 0, 0,
		0, 0, 0, 0, 0,
		0, 0, 0, 0, 0,
		0, 0, 0, 0.3, 0
	]);
	public static BLACKS:egret.Filter[] = [EFilters.BLACK_FILTER];

}