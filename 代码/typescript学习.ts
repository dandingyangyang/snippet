/*
 * @Descripttion: 
 * @Author: yangxia
 * @Date: 2021-12-08 14:55:56
 */
// 一. 有条件类型 extends 关键字
interface SomeProps {
    a: string
    b: number
    c: (e: MouseEvent) => void
    d: (e: TouchEvent) => void
}

// 如何得到 'c' | 'd' ？

// 取出函数属性的属性名，返回联合类型
type FunctionPropertyNames<T> = {
    [K in keyof T]: T[K] extends Function ? K : never
}[keyof T]
type A = FunctionPropertyNames<string>
type B = FunctionPropertyNames<{
    f1: () => void;
    f2: () => string;
    index: number
}>

// 取出函数属性的属性值，返回联合类型
type FuncitonProperties<T> = {
    [K in keyof T]: T[K] extends Function ? T[K] : never
}[keyof T]
// 使用Pick, 返回对象
type FuncitonProperties2<T> = Pick<T, FunctionPropertyNames<T>>
type A1 = FuncitonProperties<{
    f1: () => void;
    f2: () => string;
    index: number
}>
type AA1 = FuncitonProperties2<{
    f1: () => void;
    f2: () => string;
    index: number
}>

type NonFunctionPropertyNames<T> = {
    [K in keyof T]: T[K] extends Function ? never : K
}[keyof T]
type A3 = NonFunctionPropertyNames<{
    f1: () => void;
    f2: () => string;
    index: number
}>

// 从 T 中取出 一系列 K 的属性,K是联合类型,返回对象
type Pick_copy<T, K extends keyof T> = {
    [P in K]: T[P]
}
type A2 = Pick<{
    f1: () => void;
    f2: () => string;
    index: number
}, 'f1' | 'index'>

// 接口的交集
// https://juejin.cn/post/6999905088949256228
type C1 = { name: string; age: number; visible: boolean };
type C2 = { name: string; age: number; sex: number };



type Intersection<T extends object, U extends object> = Pick<T, Extract<keyof T, keyof U> & Extract<keyof U, keyof T>>
type C3 = Intersection<C1, C2>;

// 接口的差集
type Diff<T extends object, U extends object> = Omit<T, Extract<keyof T, keyof U> & Extract<keyof U, keyof T>>;
// 或者
type Diff2<T extends object, U extends object> = Pick<T, Exclude<keyof T, keyof U>>;
type C4 = Diff<C1, C2>;
type C44 = Diff2<C1, C2>;
type C5 = Diff<C2, C1>;
type C55 = Diff2<C2, C1>;

// 接口的并集
// 自己写的：通过Diff和Intersection的运算
type Merge<T extends object, U extends object> = Diff<T, U> & Diff<U, T> & Intersection<T, U>;
type C6 = Merge<C1, C2>;
/**
 * 把鼠标hover到C6 上 ，显示的C6 的类型不是 
 * {
 *  name: string;
 *  age: number;
 *  visible: boolean,
 *  sex: number
 * }
 * 而是 type C6 = Diff<C1, C2> & Diff<C2, C1> & Intersection<C1, C2>
 * 
 * 应该代表的类型都一样吧，为了测试下，我用const1变量试了一下，虽然显示不一样，但是应该没问题
 */
let const1:C6 = {
    name: '1',
    age: 1,
    visible: true,
    sex: 2
}

// 假如C11和C22都有age属性，但是一个是number，一个是string，在做接口并集的时候如何覆盖？
type C11 = { name: string; age: number; visible: boolean };
type C22 = { name: string; age: string; sex: number };

type Overwrite<
  T extends object,
  U extends object,
  I = Diff2<T, U> & Intersection<U, T>
> = Pick<I, keyof I>;
  
type overwrite = Overwrite<C11, C22>;
/**
 * 这里有个很神奇的问题，和上面 【把鼠标hover到C6 上，不会显示实际类型而显示运算表达式】是同种问题。
 * 上面的overwrite会直接显示类型，但是如果我把Overwrite改成
 * type Overwrite2<
    T extends object,
    U extends object,
    > = Diff2<T, U> & Intersection<U, T>
    overwrite就不会显示类型而是显示成运算表达式。这里的区别就在于Overwrite使用的是Pick，是原生的运算，
    而Overwrite2最终的结果是有Diff2和Intersection运算而成，不是原生的运算，所以不显示最终类型吗？
 */



// 二. 有条件类型中的类型推断
// 这个推断的类型变量可以在有条件类型的true分支中被引用。 允许出现多个同类型变量的infer。
type ReturnType_copy<T> = T extends (...args: any[]) => infer R ? R : any
function f() { return { a: 3, b: 2}; }
type FReturn = ReturnType<typeof f>;

// 三. 深入类型系统
//  1. 基本类型，可以理解为原子类型，包括number, boolean, string, function, undefined, 字面量（1，2，true，false，'aa'）, array等，他们无法再细分

//  2. 复合类型。

// （1）TS的复合类型可以分为两类：set和map。set是指一个无序的、无重复元素的集合。而map则和JS中的对象一样，是一些没有重复键的键值对
// set
type Size = 'small' | 'default' | 'big' | 'large';
// map
interface IA {
    a: string
    b: number
}

// （2）复合类型间的转换
// map => set
type IAKeys = keyof IA
type IAValues = IA[keyof IA]
// 下面这个取出函数属性值得type就用到了类似IAValues的方法
type FuncitonPropertie_2<T> = {
    [K in keyof T]: T[K] extends Function ? T[K] : never
}[keyof T]

// set => map
// PS：在JS里面for...in是用来遍历对象的，而在TS里面in是用来遍历联合类型的
type SizeMap = {
    [K in Size]: number
}
// set => map 使用Record  type Record<P extends any, T> = {[K in P]: T}
type SizeMap2 = Record<Size, number>


// (3) map上的操作
// 索引取值
type SubA = IA['a']
// 属性修饰符
type Person = {
    age: number
    readonly name: string // 只读属性，初始化时必须赋值
    nickname?: string // 可选属性，相当于 | undefined
}
// 保留map的一部分:Pick  type Pick<T, K extends keyof T> = {[P in K]: T[P]}
type BiggerSizeMap = Pick<SizeMap, 'large' | 'big'>
// 删除map的一部分:Omit  type Omit<T, K> = Pick<T, Exclude<keyof T,K>>
type DefaultSizeMap = Omit<SizeMap, 'small' | 'big' | 'large'>

// (4) set上的操作
// 保留set的一部分:Extract Extract<T, U> = T extends U ? T : never
type Result = 1 | 2 | 3 | 'error' | 'success'
type StringResult = Extract<Result, string>
// 删除set的一部分:Exclude Exclude<T, U> = T extends U ? never : T
type NumberResult = Exclude<Result, string>

总结: Map上使用的是Pick，Omit， keyof
     Set上使用的是Exclude，Extract， Record， in

// (4) 映射类型和同态类型
在TypeScript中，有以下几种常见的映射类型。它们的共同点是只接受一个传入类型，生成的类型中key都来自于keyof传入的类型，value都是传入类型的value的变种。
type Partial_copy<T> = { [P in keyof T]?: T[P] }    // 将一个map所有属性变为可选的
type Required_copy<T> = { [P in keyof T]-?: T[P] }    // 将一个map所有属性变为必选的
type Readonly_copy<T> = { readonly [P in keyof T]: T[P] }    // 将一个map所有属性变为只读的
type Mutable_copy<T> = { -readonly [P in keyof T]: T[P] }    // ts标准库未包含，将一个map所有属性变为可写的
此类变换，在TS中被称为同态变换。在进行同态变换时，TS会先复制一遍传入参数的属性修饰符，再应用定义的变换。
interface Fruit {
    readonly name: string
    size: number
}
type PF = Partial<Fruit>;    // PF.name既只读又可选，PF.size只可选

// 3. 关于枚举
// 枚举可以简单分为数字枚举、字符串枚举和常量枚举

// （1）数字枚举被编译后，key和value都会作为编译结果对象的key存在
enum Tristate {
    False,
    True,
    Unknown
}
  
  console.log(Tristate[0]); // 'False'
  console.log(Tristate['False']); // 0
  console.log(Tristate[Tristate.False]); // 'False' because `Tristate.False == 0`

// 默认从开始，也可以指定固定开始值

// （2）字符串枚举被编译后，只有枚举的key值会作为编译结果对象的key值存在
export enum EvidenceTypeEnum {
    UNKNOWN = '',
    PASSPORT_VISA = 'passport_visa',
    PASSPORT = 'passport',
}
Object.keys(EvidenceTypeEnum) //  ['UNKNOWN', 'PASSPORT_VISA', 'PASSPORT']

// (3)常量枚举
const enum Tristate2 {
    False,
    True,
    Unknown
  }
  
const lie = Tristate2.False;
// 将会被编译成： let lie = 0; Tristate2 在运行时不存在了，如果想让Tristate2存在，需要设置preserveConstEnums选项


