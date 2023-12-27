/**
 * 结构体工具类
 */
class StructUtil {

	/**
	 * 转字典
	 * @param input DictIntInt
	 */
	public static dictIntIntToDict(input: any, output: any = null): any {
		let dict: any = output;
		if (dict == null) {
			dict = {};
		}
		let keyArray: Array<number> = input.key_I;
		let valueArray: Array<number> = input.value_I;
		for (let i: number = 0; i < keyArray.length; i++) {
			dict[keyArray[i]] = valueArray[i];
		}
		return dict;
	}
}