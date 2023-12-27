/**
 * 属性信息
 */
class AttrInfo {
	public type: number;
	public name: string;
	public value: number;
	public addValue: number;
	public color: string = "#FFFFFF";

	public constructor() {
	}

	public get nextValue(): number {
		return this.value + this.addValue;
	}
}