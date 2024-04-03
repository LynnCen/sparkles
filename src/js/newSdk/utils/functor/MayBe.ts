/**
 * @description 可以去访问操作一个不确定的 数据结构, 兼容undefined 和 null 控制处理。类似于可选链
 * @example {
 * let data =  { children: []} || { error }
 * MayBe.of(data).map(item => item['children]).map(item => item.find(xxxx))
 * }
 */

export const MayBe = function (val: any) {
    // @ts-ignore
    this.value = val;
};

// pointed 函子
MayBe.of = function (val: any) {
    // @ts-ignore
    return new MayBe(val);
};

MayBe.prototype.isNothing = function () {
    return this.value === null || this.value === undefined;
};

MayBe.prototype.map = function (fn: Function) {
    return this.isNothing() ? MayBe.of(null) : MayBe.of(fn(this.value));
};

MayBe.prototype.join = function () {
    return this.isNothing() ? MayBe.of(null) : this.value;
};

// Monad 函子
MayBe.prototype.chain = function (f: Function) {
    return this.map(f).join();
};

export default MayBe;
