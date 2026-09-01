---
title: C与指针笔记
published: 2025-09-21
description: "我去是C语言大佬!?"
image: "./cover.jpg"
category: C
tags: ["c", "language", "programming", "code"]
author: Akeboshi Himari
draft: false
--- 

<h1><center>快速上手</center></h1>

-----------

## 1.1.1 空白和注释

1. 遵守一些规定会让C语言代码变得更加容易阅读和修改
2. 注释告诉读者程序能做些什么
3. 使用#if和#endif预处理有效地将代码从程序中去除

~~~
#if 0       //条件(真执行，假不执行)
    statements
#endif
~~~

## 1.1.2 预处理指令

~~~
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#define MAX_COLS 20
#define MAX_INPUT 1000 
~~~

| 这五行被称为预处理指令，因为它们是由预处理器解释的。

~~~
int read_column_numbers(int columns[], int max);
void rearrange(char *output, char const *input,
                int n_columns, int const columns[]);
~~~

| 这些声明被称为**函数原型(function prototype)**。它告诉编译器这些以后将在源文件中定义的函数的特征。

## 1.1.3 main函数

**每个C程序都必须有一个main函数，因为它是程序执行的起点。**

<code>n_columns = read_column_numbers(columns,MAX_COLS);</code>

> 这条语句调用函数read_column_numbers。数组columns和MAX_COLS代表的常量20作为参数传递给这个函数。在C语言中，数组参数是以 **引用(reference)** 传递的，也就是传址调用，而标量和常量则是按 **值(value)** 传递的。

## 1.1.4 关于scanf的格式代码

常用的scanf格式代码除了`%c,%s`以外在输入值前的空白都会被省略。所以在使用scanf函数中的格式代码%c,%s输入时不能在输入值前有空格、换行和tab

<h1><center>基本概念</center></h1>

-------

## 2.1 环境

在ANSI C的任何一种实现中存在两种不同的环境
</br>
一种是**翻译环境(translation environment)**，在这个环境源代码被转换为可执行的机器指令。
</br>
一种是**执行环境(execution environment)**，用于实际执行代码

## 2.1.1 翻译

翻译过程：编辑源文件->对源文件进行编译->对编译好的目标文件和链接器捆绑到一起->形成可执行程序
</br>
编译过程： **预处理器(preprocessor)** 处理-> **源代码解析(parse)** 处理->产生目标代码( **优化器(optimizer)** 会对目标代码进一步处理)

## 2.1.2 执行

程序必须载入到内存中(具有操作系统由操作系统执行)，无操作系统时必须手动载入

------------

在 C 语言的翻译过程中，通常的顺序是：

预处理（Preprocessing）：
这一步会处理所有的宏定义（#define）、头文件包含（#include）以及条件编译（#if）等指令。预处理器生成一个扩展后的 C 代码，这个阶段的产物是一个没有预处理指令的纯 C 源代码。

编译（Compilation）：
在这一阶段，编译器将预处理后的 C 代码转换成汇编语言代码。编译器主要做语法分析、语义分析、优化等工作。最终生成的是与特定平台相关的汇编代码文件（通常以 .s 为后缀）。

汇编（Assembly）：
汇编器将编译生成的汇编代码转换成机器码，生成目标文件（通常以 .o 或 .obj 为后缀）。目标文件包含机器指令，但没有完整的可执行程序所需的所有内容。

链接（Linking）：
链接器将多个目标文件和库文件合并，解决符号（如函数和变量的地址）之间的依赖关系，最终生成可执行文件（如 .exe 或没有后缀的文件）。如果有外部库函数或其他目标文件，链接器会将它们合并成一个完整的可执行程序。

总结起来，C 语言的翻译过程是：

预处理

编译（生成汇编代码）

汇编（生成目标文件）

链接（生成可执行文件）

所以，是先编译再汇编，然后通过汇编生成目标文件，最后由链接器生成可执行程序。

-----

## 2.2 词法规则

词法规则就是**标记(token)**

## 2.2.1 字符

使用**转义序列(escape sequence)**和**字符转义(character escape)** 对上下文环境中特定字符表示

常见的有`\? \" \' \\`和`\a \b \f \n \r \t \v`

用于表示八进制和十六进制的转义符有
`\ddd \xddd`

## 2.2.2 注释

注意跨越多行的注释

## 2.2.3 自由形式的源代码

c格式相对自由，相邻的标记之间有一个或多个空白

## 2.2.4 标识符(identifier)

标识符就是变量、函数、类型等的名字，由大小写字母、数字和下划线组成，不能以数字开头。有**32**个关键字

## 2.2.5 程序的形式

一个C程序的源文件应该包含一组相关的函数，这是C程序较为合理的组织形式。

-------

## 2.3 程序风格

C 语言程序风格（Coding Style）是指在编写 C 语言代码时，为了提高可读性、可维护性和可扩展性而遵循的一些规范和约定。良好的程序风格可以让代码更加清晰，减少错误，并便于团队协作。以下是一些常见的 C 语言编程风格规范：

### 1. 代码缩进

使用统一的缩进风格。常见的缩进方法有**空格缩进**（通常是 4 个空格）和 **制表符缩进**（Tab 键）。

推荐： 一般来说，现代 C 编程习惯推荐使用 4 个空格进行缩进，避免混用空格和制表符。

~~~
int main(){
    if(condition){
        // statements
    }
}
~~~

### 2. 大括号风格

K&R风格（Kernighan & Ritchie）和 Allman风格 是常见的大括号样式。建议选择一致的风格。

推荐： K&R 风格通常更简洁，常用于 C 语言。即大括号 "{}" 在同一行。

示例（K&R 风格）：

~~~
if(condition){
    // 代码块
} else {
    // 代码块
}
~~~

### 3.命名规范

变量、函数、宏、结构体等命名应有一致性，且能清楚地表达含义。

推荐：

变量使用小写字母，单词之间用下划线分隔，如 int total_count;。

函数使用小写字母，多个单词之间使用下划线分隔，如 int calculate_area(int width, int height);。

宏常量使用全大写字母，单词之间用下划线分隔，如 #define MAX_BUFFER_SIZE 1024。

结构体和 类型常使用大写开头的驼峰式命名，如 typedef struct Student Student;。

## 2.4 总结

- 一个C程序的代码保存在一个或多个源文件中，但一个函数只能完整地出现在同一个源文件中。把相关函数放在同一个文件内是一种好策略。
-

<h1><center>数据</center></h1>

------

## 3.1 基本数据类型

- 在C语言中，只有四种基本数据类型：**整形、浮点型、指针和聚合类型(数组和结构)**

> 字符型是整型的一种

## 3.1.1 整型家族

分为字符型、短整型、整型和长整型，且分为有符号(signed)和无符号(unsigned)

- **长整型至少应该和整型一样长，整型至少应该和短整型一样长。**
- 如果显示地把变量声明为signed或unsigned可以提高这类程序的可移植性。

1.整型字面值

**字面值(literal)** 这个术语是字面值常量的缩写————这是一种实体，指定了自身的值并且不允许发生改变。所以ANSI C允许 **命名常量const**

在整数值后面添加l或L将整数解释为长整型值、u或U将数值指定为unsigned整型值。ul和UL就是这两个的结合

对于多字节字符如果一个多字节字符常量的前面有一个L那么它就是**宽字符常量(wide character literal)**如：
`L'X' L'e^'`

不管采用何种字符集，使用字符常量所产生的总是正确的值，所以字符常量能提高程序的可移植性

2.枚举类型

**枚举(enumerated)类型**就是指它的值为符号常量而不是字面值的类型

~~~
enum Jar_Type { CUP, PINT, QUART, HALF_GALLON, GALLON}; //声明了一个enum类型称为Jar_Type
enum { CUP, PINT, QUART, HALF_GALLON, GALLON} milk_jug,gas_can; // 匿名枚举类型并直接定义枚举类型变量 milk_jug,gas_can
enum Jar_Type { CUP = 8, PINT = 10, QUART = 11, HALF_GALLON, GALLON};
// 根据enum赋值规律，HALF_GALLON的值为12，GALLON为13
~~~

## 3.1.2 浮点类型

浮点数字面值在缺省情况下都是double类型的，后跟L为long double，跟F为float

## 3.1.3 指针

1. 指针常量

指针常量只能通过已分配的内存的元素得知。</br>
因此，把指针常量表达为数值字面值的形式几乎没有用处。

1. 字符串常量

可以把字符串常量赋值给一个指向字符类型的数组char* </br>
不能把字符串常量赋值给一个字符数组char[]

## 3.2 基本声明

变量声明的基本形式是：`说明符(一个或多个) 声明表达式列表`

`int* a,b,c和int *a,*b,*c`是在声明指针时非常容易搞混的两个概念，为避免概念上的错误建议将*号写在靠近变量名那一侧

## 3.2.4 隐式声明

一条语句实际上是一个声明时，如果它缺少类型名，编译器会假定它为整型
> 依赖隐式声明不是一个好主意

## 3.3 typedef

typedef 为数据类型定义新名字

~~~
char *ptr_to_char; 是一个指向字符的指针
在添加关键字typedef后
typedef char* ptr_to_char;
这个声明把标识符ptr_to_char 作为指向字符的指针类型的新名字
ptr_to_char a; 声明a是一个指向字符的指针
~~~

- 在定义函数指针或指向数组的指针时使用typedef更为合适。

## 3.4 常量

对于普通的数据类型来说
`int const a; 和 const int a;`没有什么区别，因为对于整型只有值会变成常量

但是对于指针来说有两种东西可能成为常量：‘**指针变量**’和‘**指针所指向的实体**’

~~~
int *pi; 是一个普通的指向整型的指针
而
int const *pci;
则是一个指向整型常量的指针，可以修改指针的值但不能修改它所指向的值
相比之下
int *const pci; 
则是一个指向整型的常量指针。此时指针是常量，它的值无法修改，但是可以修改它所指向的整型的值。
~~~

-----

在 C 语言中，“指向整型的常量指针”和“指向常量整型的指针”是两个非常常见的概念，它们在语法和使用上有所不同。下面我会分别讲解这两者的含义：

1. 指向整型常量的指针（`const int *ptr` 或 `int const *ptr`）
这种指针类型表示 指针指向的数据是常量，即指针指向的 整型数据不可修改，但是指针本身可以修改，使其指向不同的地址。

~~~
int a = 10;
int b = 20;
int const *ptr = &a; // 或者 const int *ptr = &a;
*ptr = 15; // 错误，不能修改指向的数据
ptr = &b; // 正确，指针本身可以修改
~~~

1. 指向整型的常量指针（int *const ptr）
这种指针类型表示 指针本身是常量，即指针的值（即它指向的地址）不可修改，但是指针指向的 整型数据 是可以修改的。

~~~
int a = 10;
int b = 20;
int *const ptr = &a; *ptr = 15; // OK，指向的值可以修改
ptr = &b; // 错误，不能修改指针的地址(指针本身是常量)
~~~

1. 两者结合使用（const int*const ptr 或 int const* const ptr）
如果同时声明指针是常量且指向的数据是常量，那么就变成了“常量指针指向常量数据”。

~~~
int a = 10;
const int* const ptr = &a;

*ptr = 15;  // 错误！不能修改指向的数据
ptr = &b;   // 错误！不能修改指针本身
~~~

## 3.5 作用域(scope)

## 3.5.1 代码块作用域

特殊情况类似内层代码和外层代码拥有同一个标识符名字内层的标识符会隐藏外层的标识符
> 应该避免在嵌套的代码块中出现相同的变量名

## 3.6 链接属性

链接属性一共有三种：**external(外部)、internal(内部)和none(无)**

1. 外部链接（External Linkage）
具有外部链接的符号可以在整个程序的多个翻译单元中访问。它意味着符号可以在一个文件中声明，并在其他文件中定义或使用。

全局变量：如果在一个文件中声明了全局变量，并在其他文件中引用该变量，它会具有外部链接。

外部函数：同样地，外部函数可以在一个文件中定义，并在其他文件中调用。

示例：

~~~
// file1.c 
#include <stdio.h>

int global_var = 10; // 外部链接
void func()
{
    printf("Hello World!\n");
}

// file2.c 
extern int global_var; //声明具有外部链接的变量
extern void func(); // 声明外部函数

int main()
{
    func();
    printf("Global variable: %d\n",global_var);
    return 0;
}
~~~

- `global_var`和`func()`都具有外部链接，可以在file2.c中访问

1. 内部链接（Internal Linkage）
具有内部链接的符号只能在同一翻译单元（即同一源文件及其包含的头文件）中访问。它们不能跨文件使用。

static 关键字：使用 static 关键字声明的变量或函数具有内部链接。它意味着该符号的作用域仅限于当前源文件。

示例：

~~~
// file1.c 
#include <stdio.h>
static int internal_var = 10; // 内部链接，只能在file1.c中使用
static void internal_func(){
    // 内部链接，只能在file1.c中调用
    printf("This is an internal function\n");
}

int main()
{
    internal_func();
    printf("Internal variable: %d\n",internal_var);
    return 0;
}

// file2.c 
extern void internal_func(); // 无法调用，因为internal_func在file1.c中是静态的
extern int internal_var; // 无法访问，因为internal_var是静态的
~~~

- `internal_var`和`internal_func()`只能在file1.c中使用，其他文件无法访问它们

1. 无链接（No Linkage）
没有链接的符号意味着它们在某个特定范围内是唯一的，通常这些符号仅限于局部作用域。局部变量和函数的参数一般都是无链接的。

局部变量：它们的作用域仅限于函数内部，其他函数无法访问。

示例：

~~~
void func() {
    int local_var = 10;  // 无链接，仅在func内部有效
    printf("Local variable: %d\n", local_var);
}

int main() {
    func();
    // 下面的代码会导致错误，因为local_var在main函数外不可见
    // printf("Local variable in func: %d\n", local_var);
    return 0;
}
~~~

- `local_var`只能在`func()`内部使用，其他地方无法访问

总结：

**外部链接（External Linkage）**：符号可以在多个翻译单元（源文件）之间共享。通过 `extern` 关键字进行声明。

**内部链接（Internal Linkage）**：符号仅在当前源文件内有效，不能跨文件访问。通过 `static` 关键字来定义。

**无链接（No Linkage）**：符号仅在局部作用域内有效，通常用于函数参数和局部变量。

~~~
static int i;
int func()
{
    int j;
    extern int k;
    extern int i; 
}
~~~

- 当`extern`关键字用于源文件中一个标识符的第一次声明时，它指定该标识符具有external链接属性。但是如上面所示在int i一开始声明了static后并不会在func内部修改extern int i为external链接属性

## 3.7 存储类型

有三个地方可以用于存储变量：普通内存、运行时堆栈、硬件寄存器。

- 凡是在任何代码块之外的声明的变量总是存储于静态内存中，也就是不属于堆栈的内存，这类变量称为静态(static)变量
- 在代码块内部声明的变量的缺省存储类型是自动的(automatic)，也就是说它存储于堆栈中，称为自动(auto)变量
- 对于在代码块内部声明的变量如果给它加上关键字static，可以使它的存储类型从自动变为静态。函数的形参不能声明为静态，因为实参总是在堆栈中传递给函数
- 关键字register可以用于自动变量的声明，声明变量应该存储于机器的硬件寄存器而不是内存

**初始化**

- (P44)自动变量初始化和静态变量初始化存在一个重要的差别。

> 在静态变量初始化中我们可以把可执行程序想要初始化的值放在当程序执行时变量将会使用的位置。

> 自动变量的初始化需要更多的开销,因为当程序链接时还无法判断自动变量的存储位置，事实上函数的局部变量在函数的每次调用时都可能占据不同的位置

>**自动变量的初始化较之赋值语句效率并无提高**，除了声明为`const`的变量之外这两者只有风格之差，并无效率之别。

> 优点是由于初始化在运行时执行因此可以用任何表达式作为初始化值，例如：

~~~
int
func(int a)
{
    int b = a + 2;
}
~~~

> 最后一个后果是除非对自动变量进行显式的初始化，否则当自动变量创建时，它们的值总是垃圾。

## 3.8 static关键字

当用于函数定义时，或者用于代码块之外的变量声明时，static关键字用于修改标识符的连接属性(从external 改为 internal)，但标识符的存储类型和作用域不受影响。

用于代码块内部的变量声明时static关键字用于修改变量的存储类型，从自动变量改为静态变量，但变量的链接属性和作用域不受影响。

## 3.10 总结

- 具有external链接属性的实体总是具有静态存储类型
- 如果一个变量声明于代码块内部，在它前面添加extern关键字将使它所引用的是全局变量而不是局部变量。

<h1><center>语句</center></h1>

----

## 4.1 空语句

`;`空语句本身不执行任何任务

## 4.2 表达式语句

只要在表达式后面加上一个分号，就可以把表达式转变为语句

~~~
x = y + 3;
ch = getchar();
~~~

是表达式语句

> 类似于printf函数这类没有返回值的函数在标准输出中输出内容的作用称为副作用(side effect)

## 4.3 代码块

- 一对花括号之内的可选的声明和语句列表

~~~
{
    declarations
    statements
}
~~~

## 4.4 if语句

- C 并不具备布尔类型而是用整型来替代
- else语句从属于最靠近它的不完整的if语句

## 4.5 while语句

..............

## 4.9 goto语句

`goto 语句标签;`

1. 资源清理和错误处理(C中没有异常机制)

~~~
#include <stdio.h>
#include <stdlib.h>

int func()
{
    int *p = malloc(100);
    if(!p) goto fail;
    
    FILE *fp = fopen("file.txt","r");
    if(!fp) goto cleanup;
    
    // 正常执行逻辑
    fclose(fp);
    free(p);
    return 0;
cleanup:
    free(p);
fail:
    return -1;
}
~~~

1. 从多层嵌套中快速跳出

~~~
for (int i = 0; i < 5; ++i) {
    for (int j = 0; j < 5; ++j) {
        if (i + j == 6) goto done;
    }
}
done:
printf("Exited nested loops\n");
~~~

goto 是 C 的原始控制流工具，能**跳到代码中的任意标签**；

不推荐**滥用**，但在特定情况下（如资源清理、退出多层嵌套）是非常有效的；

如果你在写**可读性强、模块化的现代代码**，能不用就尽量不用；

如果你在写**驱动、内核、嵌入式或老式 C 代码**，合理使用是完全 OK 的。

## 4.10 总结

<h1><center>操作符和表达式</center></h1>

## 5.1 运算符

- 算数运算符(右结合)

`+ - * / %`除了`%`其他的操作符都适用于整型和浮点型

- 移位操作符(右结合)

`<< >>`左移和右移操作符
左移右边多出来填充0，右移左边多出来填充0或1(具体看是逻辑运算还是算数运算（符号位1填1，符号位0填0）)
> `a << -5`左移-5位是什么意思其实不重要，结果是由编译器决定的，且其结果无意义，不能在程序中出现这种情况

- 位操作符(右结合)

`& | ^`分别执行与或和异或操作

或操作符与左移操作符结合：

~~~
int value = 0b00001010;
int bit_number = 1;
value = value | (1 << bit_number);
// 即 value = 0b00001010 | ob00000010 = 0b00001010 （值没有发生改变）
bit_number = 2;
value = value | (1 << bit_number);
// 即：value = 0b00001010 | 0b00000100 = 0b00001110 （值变成 14）
~~~

- 赋值符和复合赋值符(左结合)

可以用复合赋值符改写上面的操作

~~~
value |= 1 << bit_number;
value &= 1 << bit_number;
~~~

- 单目运算符(左结合)

`~`操作符对二进制数进行求补操作，操作数原为1则为0，原为 0则为1

`&`操作符为取址符

`*`间接访问操作符

`sizeof()`判断操作数类型长度

<h1><center>指针</center></h1>

## 6.1 内存和地址

我们对两件事情感兴趣：

- 内存中的每个位置由一个独一无二的地址标识：
- 内存中的每个位置都包含一个值：

>名字与内存位置之间的关联并不是硬件提供的，而是由编译器为我们实现的。

**硬件仍然通过地址访问内存位置。**

## 6.2 值和类型

- **不能简单地通过检查一个值的位来判断它的类型。**

~~~
int a = 112;
float b = 3.14;
int *c = &a;
int *d = &b;
~~~

在这上面变量a被解释为整型值，但b存储的为浮点值，在内存中却可能被解释为整型值，变成一个非常大的整型值。由于解释方法不同有可能被解释为整数`1078523331`。
> 大部分情况编译器会帮助我们避免这些错误。当程序访问时编译器就会产生浮点型指令。

## 6.3 指针变量的内容

上面的变量c和d为指针，指针初始化是用`&`操作符完成的，该操作数用于产生操作数的内存地址。

区分变量c、d的地址和c、d存储的内容是非常重要的。c、d存储的内容为a、b的地址，c、d的地址为变量自身在内存中的地址。

## 6.4 间接访问操作符

`*`操作符执行**间接访问(idirection)** 或 **解引用(dereferencing the pointer)**。

## 6.5 未初始化和非法的指针

~~~
int *a;
*a = 12;
~~~

> a指向了哪里，我们声明了这个变量但是未对他进行初始化，所以没有办法预测12这个值将存储于什么地方。
>> *无论是哪种情况声明一个指向整型的指针都不会“创建”用于存储整型值的内存空间。*
>
> 所以程序执行这个赋值操作，有可能：
>
> **1.** a的初始值会是个非法地址，这样赋值语句将会出错，从而终止程序。在UNIX系统上这个错误被称为 *“段违例”(segmentation violation)* 或 *内存错误(memory fault)*。它提示程序试图访问一个并未分配给程序的内存空间。
>
> **2.** 对于那些要求整数必须存储于特定边界的机器而言，如果这种类型的数据在内存中的存储地址处于错误的边界上，那么对这个地址进行访问时将会产生一个错误。这个错误在UNIX系统中被称为 *总线错误(bus error)* 。
>
> **3.** 一种更为严重的情况是，这个指针偶尔可能包含了一个合法的地址。接下来的事情很简单：**位于那个位置的值被修改！**
>
## 6.6 NULL指针

要使一个指针变量为NULL可以给它赋一个零值。
> p96 NULL指针用法

- 对一个NULL指针解引用是非法的，因为NULL指针没有指向任何东西。

## 6.7 指针、间接访问和左值

~~~
int a;
int *d = &a;

*d = 10 - *d;       // 1.正确
d = 10 - *d;        // 2.错误
~~~

第一条语句包含了两个间接操作。右边的间接访问作为右值使用，所以它的值d所指向的位置所存储的值(a的值)。左边的间接访问作为左值使用，所以d所指向的位置a把赋值符右边的表达式的计算结果作为它的新值。

第二条语句是非法的，因为它表示把一个整型变量(10 - *d)存储于一个指针变量中，当实际使用的变量类型和应该使用的变量类型不一致时，编译器会发出警告。

## 6.8 指针、间接变量和变量

`*&a = 25` 和 `a = 25`的效力是相同的，但是它涉及更多的操作，且这种写法会使得代码可读性更差。

## 6.9 指针常量

如果变量a存储于位置100

`*100 = 25;`看上去像是把25赋值给a，但是这是错的！因为字面值100的类型是整型而不是指针类型表达式，如果想把25存储于位置100必须使用强制类型转换。

`*(int *)100 = 25;`这种写法合法，但是需要使用这种技巧的地方几乎碰不到！因为*在编译器执行前无法确定变量会存储在内存的什么位置。*

## 6.10 指针的指针

```
int a = 12;
int *b = &a;
int **c = &b;
```

`*`操作符具有从右向左的结合性，表达式`**c`的类型是int，它是指针的指针。`*c`访问c所指向的位置，我们知道这是变量b。

|表达式|相当的表达式|
|:---:|:---:|
|a|12|
|b|&a|
|*b|a,12|
|c|&b|
|*c|b,&a|
|**c|*b,a,12|

## 6.11 指针表达式

符号优先级：() > ++ > * > -

- 分析几个重要的指针表达式

~~~
char ch = 'a';
char * cp = &ch;
~~~

1. `*cp + 1`
2. `*(cp + 1)`
3. `++cp`
4. `cp++`
5. `*++cp`
6. `*cp++`
7. `++*cp`
8. `(*cp)++`
9. `++*++cp`
10. `++*cp++`

- `*cp + 1`
先执行间接访问操作得到它的值，后取得这个值的**副本**执行与1相加的操作。表达式最终结果为字符'b'。该表达式最终结果的存储位置并未清晰定义，所以不是一个合法左值。
- `*(cp + 1)`
指针加法运算的结果是一个右值，之后对这个右值进行间接访问操作后可以将其作为左值使用，尽管`cp + 1`本身并不是左值。

> **间接访问操作符是少数几个其结果为左值的操作符之一。**

- `++cp`和`cp++`唯一区别是这两个表达式的返回值一个是cp + 1的副本，一个是cp的副本。且这两个表达式都不是合法的左值。
- `*cp++`和`*++cp`与不加间接访问操作的上面两个式子不同。右值为`ch + 1` 或 `ch`那个**内存地址的值**，左值为**那个位置本身**(作为变量使用)。
- `++*cp`与上式不同，由于`*`和`++`操作符都是左结合性，首先执行间接访问操作，然后cp所指向的位置的值加一，表达式结果是这个增值后的值的一个副本。
- `(*cp)++`是原本cp增值前的原先值，和`ch++`操作相同
- `++*++cp`先执行`*++cp`后执行`++*++cp`，结果为`*++cp`自增后的拷贝。
- `++*cp++`和上式的唯一区别是`*++cp`和`*cp++`的区别。

## 6.12 实例

程序6.1：字符串的长度

~~~
#include <stdlib.h>
size_t
strlen(char *string)
{
    int     length = 0;
    while(*string++ != '\0')
        length += 1;
    return length;
}
~~~

程序6.2：在一组字符串中查找指定的字符(版本1)

~~~
#include <stdio.h>
#define     TRUE    1
#define     FALSE   0

int
find_char(char **strings, char value)
{
    char* string;
    // 未初始化的字符串类型
    
    // 对于列表中的每个字符串
    
    while( (string = *strings++) != NULL)
    {
        // 观察字符串中的每个字符
        while( *string != '\0')
        {
            if( *string++ == value)
                return TRUE;
        }
    }
    return FALSE;
}
~~~

程序6.3：在一组字符串中查找(版本2)

~~~
#include <stdio.h>
#include <assert.h>
#define TRUE 1
#define FALSE 0

int 
find_char(char **strings, int value)
{
    assert(strings != NULL);
    while(*strings != NULL)
    {
        while(**strings != '\0')
        {
            if(*(*strings)++ == value)
                return TRUE;
        }
        strings++;
    }
    return FALSE;
}
~~~

## 6.13 指针运算

- 对指针的操作不依赖于指针的类型

### 6.13.1 算数运算

1. 指针 +/- 整数
2. 指针 - 指针
只有两个指针都指向同一个数组中的元素时才允许从一个指针减去另一个指针。

~~~
int arr[5] = {1,2,3,4,5};
int *a = &arr[0];
int *b = &arr[3];
// b - a = 3
// a - b = -3 ----> 指针可以进行反向运算并结果为负数
~~~

### 6.13.2 关系运算

关系运算的前提也是指针都指向一个数组中的元素

用于清除一个数组中的所有元素

~~~
#define N_VALUES    5
float values[N_VALUES];
float *vp;
for(vp = &value[0]; vp < &values[N_VALUES];)
    *vp++ = 0;
~~~

> 这里使用`!=`替换`<`也是可行的

for循环的另一种写法

~~~
for(vp = &values[N_VALUES - 1]; vp >= &values[0];vp--)
    *vp = 0;
~~~

这种写法有一个问题，vp--最后会访问到一个未知的内存位置在满足`vp == &values[0]`后。

## 6.14 总结

- 计算机内存中的每个位置都由一个地址标识。通常邻近的内存位置合成一组，这样就允许存储更大范围的值。指针的值表示的是内存地址的变量。

# 😠 函数

## 7.1 函数定义

- 函数的定义就是**函数体的实现**:
- 函数体就是一个**代码块**，它在函数被调用时执行:

~~~shell
类型
函数名( 形式参数 )
代码块

function_name()
{

}
~~~

**存根(stub)**：为那些此时尚未实现的代码保留一个位置。

> **K&R C**形参声明

~~~shell
int *
find_int(key, array, array_len)
int key;
int array[];
int array_len;
{}
~~~

**return语句**

- return语句允许从函数体的*任何位置*返回。
- return expression中的`expression`是可选的。
- 通常，表达式的类型就是函数声明的返回类型。

> 没有返回值或`return;`的函数类型应该设置为void函数。
>> 函数被分为有返回值的函数(**真函数**)和没有返回值的函数(**过程或副作用**)。

## 7.2 函数声明

- 使用 ***函数原型(function prototype)*** 为编译器提供函数的完整信息:
- 对于*K&R C*风格函数编译器只知道函数返回值类型:

> 标准表示，在同一个代码块中，函数原型必须与**同一个函数**的**任何先前原型**匹配。

### 7.2.2 函数的缺省认定

- 无法见到原型的函数，编译器认为该函数返回值为整数类型。

## 7.3 函数的参数

- C函数的所有参数均以 **"传值调用"** 方式进行传递，即传递参数的副本。
- 传递指针和数组的行为实际上为 **"传址调用"** 。

> 对指针和数组进行*间接访问操作*。

**缺省参数提升**：使用K&R C旧风格的形参类型*类似char 和 short类型*会被提升为`int`类型,*float类型*会被提升为`double`类型

## 7.4 ADT和黑盒

- C语言可以用于设计和实现**抽象数据类型(ADT, Abstract Data Type)**，因为它可以***限制***函数和数据定义的作用域。

- **抽象数据类型(ADT, Abstract Data Type)** 是一种编程概念，它将数据的表示(如何存储)和对数据的操作(如何使用)分离开来。

### ADT的核心思想

1. **数据隐藏(Data Hiding)**：数据的具体存储方式被隐藏起来，外部代码无法直接访问或修改。

2. **接口(Interface)**：ADT提供一组明确定义的公共函数，作为与外部世界的唯一交互方式。

- 限制对模块的访问是通过合理使用`static`关键字来实现的，它可以限制对那些并非接口的函数和数据的访问。

### 示例：一个简单的计数器模块

`counter.h`(公共接口)

这是模块的”对外合同“，它只声明了其他文件可以访问的公共函数。

~~~shell
#ifndef COUNTER_H
#define COUNTER_H

// Increment the counter by 1.
void increment_counter(void);

// Get the current value of the counter. 
int get_counter(void);
#endif // COUNTER_H
~~~

`counter.c`(黑盒实现)

这是模块的”内部黑盒“。`static`关键字使得`count`变量和`private_helper`函数无法被其他文件直接访问。

~~~shell
#include "counter.h"
#include <stdio.h>
// This is a static variable. Its value is kept for the lifetime of the program,
// but it is only visible and accessible within this file (counter.c).
static int count = 0;

// This is a static function. It's a private helper and cannot be called
// from outside this file.
static void private_helper()
{
  printf("--- (Internal) The counter is now being updated... ---\n");
}

// Public API function. It calls the private helper function
void increment_counter()
{
  private_helper(); // This is allowed bacause private_helper is in the same file.
  count++;
}

// Public API function. It returns the value of the private variable.
int get_counter()
{
  return count;
}
~~~

`main.c`(使用模块)

这个文件只能通过`counter.h`中声明的公共函数与`counter.c`交互。任何试图访问内部私有函数的行为都将导致编译或链接错误。

~~~shell
#include <stdio.h>
#include "counter.h"

int main()
{
  printf("Initial counter value: %d\n",get_counter());
  
  // Call the public function to increment the counter.
  increment_counter();
  printf("Counter value after first increment: %d\n", get_counter());

  increment_counter();
  printf("Counter value after second increment: %d\n", get_counter());

  // COMPILE/LINK ERROR!
  // The linker will fail because private_helper() is not a public symbol.
  // private_helper(); 

  return 0; 
}
~~~

> 如果不包含最后一行`private_helper()`的调用程序将编译和链接成功。

## 7.5 递归

- 递归函数就是直接或间接调用自身的函数。
- C通过**运行时堆栈**支持递归函数的实现。
- 递归的效率大部分情况下都非常低。

### 使用递归与迭代来表示阶乘的计算

~~~shell
factorial(n) =
├── n <= 0 : 1
└── n > 0 : n x factorial(n - 1)
~~~

**递归方法**

~~~shell
long 
factorial(int n)
{
  if (n <= 0)
    return 1;
  else 
    return n * factorial(n - 1);
}
~~~

**迭代方法**

~~~shell
long
factorial(int n)
{
  int result = 1;
  while (n > 1)
  { 
    result *= n;
    n -= 1;
  }
  
  return result;
}
~~~

> 许多问题是以递归的形式进行解释的，这只是因为它比非递归形式更为清晰，但是这些问题的迭代实现往往比递归实现效率更高。

### 使用递归与迭代来表示斐波那契数

~~~shell
Fibonacci(n) =
├── n <= 1 : 1 
├── n = 2 : 1
├── n > 2 : Fibonacci(n - 1) +Fibonacci(n - 2)
~~~

**递归方法**

~~~shell
long fibonacci(int n)
{
  if (n <= 2)
    return 1;

  return fibonacci(n - 1) + fibonacci(n - 2);
}
~~~

**迭代方法**

~~~shell
long fibonacci(int n)
{
  long result;
  long previous_result;
  long next_older_result;
  
  result = previout_result = 1;
  
  if (n <= 2)
    return 1;
  
  while (n > 2)
  {
    n -= 1;
    next_older_result = previous_result;
    previous_result = result;
    result = previous_result + next_older_result;
  }
}
~~~

> 使用递归实现斐波那契数的代价比你远想的要大。

## 7.6 可变参数列表

- 使用`stdarg`宏实现可变参数列表，这些宏定义在`stdarg.h`头文件
- 在定义可变参数列表时在省略号前一定是代表后面可变参数列表**参数个数**

这个头文件声明了一个类型`va_list`和3个宏---`va_start`、`va_arg`和`va_end`

### 计算标量参数平均值(非可变参数)

~~~shell
float average(int n_values, int v1,int v2, int v3, int v4, int v5)
{
  float sum = v1; 
  
  if ( n_values >= 2)
    sum += v2;
  if ( n_values >= 3 )
    sum += v3;
  if ( n_values >= 4 )
    sum += v4;
  if ( n_values >= 5 )
    sum += v5;

  return sum / n_values;
}
~~~

### 计算标量参数平均值(可变参数)

~~~shell
#include <stdarg.h>

float average(int n_values, ...) // 传递任意数量的未知数
{
  va_list var_arg;
  int count;
  float sum;
  
  // 准备访问可变参数
  va_start (var_arg, n_values);
  
  // 添加取自可变参数列表的值
  for (count = 0;count < n_values;count += 1)
    sum += va_arg(var_arg, int);
  
  // 完成处理可变参数
  va_end(var_arg);
  
  return sum / n_values;
}
~~~

# 🖐 数组

## 8.1 一维数组

- **指针与数组并不是相等的。**

### 8.1.1 数组名

考虑下面的这些声明:

~~~shell
int a;
int b[10];
~~~

> a为标量，因为它是一个单一的值；b为数组，因为它是一些值的集合。

**数组**: 相同类型的值的集合。

> int b[10]中的b并不表示整个数组而是表示数组首个元素的地址。数组为`int`类型表示数组名的类型为"指向int的常量指针"。

- 区分指针与数组差别的其中一个理由是数组名是**指针常量**而不是**指针变量**。

> 常量的值是不能修改的，这也就意味着如果有一个指针`int *c`那么b = c这种赋值是非法的，因为b是常量。

### 8.1.2 下标引用

- **除优先级外，下标引用和间接访问完全相同。**

~~~shell
array[subscript] == *(array + (subscript))
~~~

**证明相等性:**

~~~shell
int array[10];
int *ap = array + 2;
~~~

|statement|expression|
|:----:|:---:|
|ap|array + 2 and &array[2]|
|*ap|array[2] and *(array + 2)|
|ap[0]|*(ap + 0) and array[2]|
|ap+6|array + 8 and &array[8]|
|*ap+6|array[2] + 6|
|*(ap+6)|array[8]|
|ap[6]|*(ap+6)|
|&ap|**unpredictable**|
|ap[-1]|**correct operation and its array[1]**|
|ap[9]|**unpredictable**|

> **偏移量的负数是可以允许的**

最后两个例子显示了为什么**下标检查**在C中是一项困难的任务。最初的C编译器并不检查下标，而最新的编译器有些依然不检查下标。且如果编译器进行下标检查涉及的开销比想象的多。

> 2[array] 是一个**合法**的数组表示！它表示的是 *(2 + array)，也就是*(array + 2)即array[2]。

### 8.1.3 指针与下标

- 如果可以互换地使用指针表达式和下标表达式，下标绝不会比指针更有效率，指针表达式有时候比下标表达式**更有效率**。

**下标方案执行循环**

~~~shell
int array[10],a;
for (a = 0;a < 10;a++)
  array[a] = 0;
~~~

**指针间接访问方案执行循环**

~~~shell
int array[10],*ap;
for (ap = array;ap < array + 10;ap++)
  *ap = 0;
~~~

- 在比较老的编译器中指针间接访问比下标访问更有效率  

**1. 数组下标版本**  
对于`array[a] = 0;`这行代码，计算机在每次循环时都必须做以下三件事：  
a. 找到数组的起始地址(`array`);  
b. 将循环变量`a`乘以`int`类型的大小(例如四字节)；  
c. 将相乘的结果**加到**起始地址，才能找到`array[a]`的准确内存位置。

> 这个过程在每次循环中都涉及**一次乘法和一次加法**。

**2. 指针间接访问版本**  
对于`*ap = 0;`这行代码，计算机的处理方法更直接：  
a. 指针`ap`已经直接存储了当前要操作的内存地址。  
b. `*ap`操作直接访问地址，非常快。  
c. `ap++`操作只需要简单地在`ap`的地址上加上`int`类型的大小(例如四字节)，就能得到下一个元素的地址。

> 这个过程只涉及**一次简单的加法**，比乘法要快得多。

- 但现代编译器**非常智能**，像数组下标版本会被**优化成更高效的指针算术指令**。

### 8.1.4 指针的效率

- 程序的效率取决于你的**编译器**和**机器**。

把一个数组的内容复制到另一个数组：

~~~shell
#define SIZE 50
int x[SIZE];
int y[SIZE];
int i;
int *p1,*p2;
~~~

下标版本函数：

~~~shell
void try1()
{
  for(i = 0; i < SIZE;i++)
    x[i] = y[i];
}
~~~

指针版本函数：

~~~shell
void try2()
{
    for( p1 = x, p2 = y; p1 - x < SIZE;)
      *p1++ = *p2++;
}
~~~

重新使用计数器：

~~~shell
void try3()
{
  for( i = 0, p1 = x, p2 = y; i < SIZE; i++)
  {
    *p1++ = *p2++;
  }
}
~~~

寄存器指针变量：

~~~shell
void try4()
{
  register int *p1, *p2;
  register int i;
  
  for( i = 0,p1 = x, p2 = y;i < SIZE; i++)
    *p1++ = *p2++;
}
~~~

消除计数器：

~~~shell
void try5()
{
  register int *p1, *p2;

  for( p1 = x, p2 = y;p1 < &x[SIZE])
  {
    *p1++ = *p2++;
  }
}
~~~

重新使用计数器是一个比较不错的写法，而消除计数器则是一个更加快速的执行代码。

**结论**:  

1. 使用指针变量将比使用下标产生效率更高的代码。当这个增量是1并且机器具有地址自动增量模型时，这点表现得更为突出。
2. 如果有经过初始化并经过调整的内容来判断循环是否应该终止，就不需要使用一个单独的计数器。
3. 那些必须在运行时求值的表达式诸如`&array[SIZE]`或`array+SIZE`这样的常量表达式往往代价更高。

### 8.1.5 数组和指针

- 指针和数组并不是相等的。

在使用`int a[10]` 和 `int *b`这两个指针值时表达式`*a`是合法而`*b`是非法的；表达式`b++`可以通过编译，但`a++`不行。

### 8.1.6 作为函数参数的数组名

~~~shell
void strcpy(char *buffer, char const *string)
{
  while (*buffer++ = *string++ != '\0');
}
~~~

while语句中的`*string++`表达式取得string所指向的那个字符，并且产生一个副作用，就是修改`string`，使它指向下一个字符。用这种方法修改形参并不会影响调用程序的实参，因为只有传递给函数的那份拷贝进行了修改。

### 8.1.7 声明数组参数

`int strlen(char * string)`和`int strlen(char string[])`这两种声明是相等的，**但是只在当前这个上下文环境中**。

- 使用`char *string`指针声明数组参数更加准确，且数组作为形参不需要传递元素个数，因为函数并不为数组参数分配内存空间，**形参只是一个指针**。

### 8.1.8 初始化

`int vector[5] = {10,20,30,40,50};`是一个标准的数组初始化。

#### 静态和自动初始化

- 数组初始化的方式类似于标量变量的初始化方式---也就是取决于它们的存储类型。
- 存储在静态内存的数组只初始化一次，也就是在程序开执行之前。
- 对于自动变量而言自动变量位于运行时堆栈编译器没办法在程序开始前对它进行初始化。所以自动变量在缺省情况下是未初始化的。

> 当数组的初始化局部于一个函数(或代码块)时，你应该仔细考虑一下，在程序的执行流每次进入该函数(或代码块)时，每次都对数组进行重新初始化是不是值得。如果答案是否定的，就把数组声明为`static`，这样数组的初始化只需在程序开始前执行一次。

### 8.1.9 不完整的初始化

- 初始化值数目大于数组长度(编译时错误)；小于则将未初始化的元素初始化为0，且只允许省略最后几个初始值。

### 8.1.10 自动计算数组长度

`int vector[] = {1,2,3,4,5};`让编译器识别数组大小

### 8.1.11 字符数组的初始化

两种初始化方法：  
1.`char message[] = {'H','e','l','l','o',0};`  
2.`char message[] = "Hello";`

这两种初始化方法是相同的，都是一个字符数组初始化列表，而`char* message = "Hello";`是一个**字符串常量**，即一个指向常量字符串"Hello"的指针。上面两个都是可修改的字符数组。

## 8.2 多维数组

- `int martix[6][10]`在某些上下文环境中，既是6行10列，也是10行6列。

### 8.2.1 存储顺序

`int array[4];`是一个存储三个整型元素的数组  
`int array[4][6];`在上面的基础上将三个整型元素改为三个包含6个元素的数组

- 在C中，多维数组的元素存储顺序按照最右边下标率先变化的原则称为**行主序(row major order)**。比如读取`array[2][4]`往下读取应该是`array[2][5]`后是`array[3][0]`。

### 8.2.2 数组名

- 一维数组名的值是一个指针常量，它的类型是"指向元素类型的指针"
- 多维数组和一维数组为一个区别是多维数组的第一维元素实际上是另一个数组

`int martix[3][10];`这个数组名`matrix`的值是一个指向它第一个元素的指针，所以`matrix`是一个指向一个包含10个整型的数组的指针。

### 8.2.3 下标

`matrix`: 指向包含10个整型元素的数组的指针  
`matrix+1`: 指向包含10个整型元素的数组的指针，但是指向的是matrix的下一行  
`*(matrix + 1)`: 包含10个整型元素的子数组(常量指针)，与`matrix[1]`相等  
`*(matrix + 1) + 5`: 上面的常量指针右移5位  
`*(*(matrix + 1) + 5)`: 上面指针所指向的元素，与`matrix[1][5]`值相等  
上面的式子可以改写为：*(matrix[1] + 5)

### 8.2.4 指向数组的指针

~~~shell
int   vector[10], *vp = vector;
int   matrix[3][10], *mp = matrix;
~~~

第一个声明是合法的，第二个声明是非法的。  
`matrix`不是一个指向整型的数组而是一个指向整型数组的指针。

`int (*p)[10]`是一个合法的指向二维数组的数组指针。因为下标引用的优先级高于间接访问
，所以要给`*p`加上括号。

~~~shell
int *pi = &matrix[0][0];
int *pi = matrix[0];
~~~

上面的两个指针指向二维数组的首地址可以逐个访问整型元素而不是逐行在数组中移动
> 应该避免使用`int  (*p)[] = matrix;`这种没有数组长度的声明，因为没有声明数组长度当执行指针运算时它的值将根据空数组的长度进行调整(与0相乘)

### 8.2.5 作为函数参数的多维数组

如果是二维数组你可以声明为以下的任意一个

~~~shell
void func2(int (*mat)[10]);
void func2(int mat[][10]);
~~~

- 编译器必须知道**第二个**及以后各维的长度才能对各下标进行求值，因此在原型中必须声明这些维的长度，也就是在原数组声明时至少为`int mat[][10]`这种并且在函数形参声明时也写成这样

`void func2(int **mat);`是一个指向整型指针的指针，和一开始说的一样，指针和数组是不同的，和指向整型数组的指针不是一回事。

### 8.2.6 初始化

~~~shell
int matrix[2][3] = {100,101,102,110,111,112};

int two_dim[3][5] = {
  {00,01,02,03,04},
  {00,01,02,03,04},
  {00,01,02,03,04}
};
~~~

上面两种初始化的方法都可以，对于三维以上的数组来说也是类似，和一维数组一样也可以省略尾部的几个初始值。

## 8.3 指针数组

`int  *api[10];`: 下标引用的优先级高于间接访问，在这个表达式中首先执行下标引用。  

使用指针数组的场景：

~~~shell
char const *keyword[] = {
    "do",
    "for",
    "register",
    "return",
    "switch",
    "while",
    NULL 
};
#define N_KEYWORD \
  (sizeof(keyword) / sizeof(keyword[0]))

# 判断参数是否与一个关键字列表中的任何单词匹配，并返回匹配的索引值。
# 如果未找到匹配函数返回-1
#include <string.h>

int lookup_keyword( char const* const desired_word, 
              char const *keyword_table[], int const size)
{
  char const **kwp;
  
  // 对于表中的每个单词 ...
  // for (kwp = keyword_table; kwp < keyword_table + size; kwp++)
  // {
  //   if (strcmp(desired_word, *kwp) == 0)
  //       return kwp - keyword_table;
  // }
  for (kwp = keyword_table; kwp != NULL;kwp++)
  {
    if (strcmp(desired_word, *kwp) == 0)
      return kwp - keyword_table;
  }
  

  // 没有找到
  return -1;
}

~~~

> 使用sizeof()对数组元素个数进行自动计数

## 8.4 总结

1. `sizeof(array)`返回的是整个数组所占用的字节而不是一个指针所占用的字节。
2. &array 和 array 指向的地址相同，但是&array的类型为`int (*)[]`而array的类型为`int*`
3. 其他使用数组名的地方数组名都是指向数组第一个元素的指针
4. `数组地址(类似于&array[1][2]) = 数组基地址 + (行索引 * 每行总大小) + (列索引 * 单个元素大小)`

`地址 = 基地址 + ((行索引 * 一行元素个数) + 列索引) * sizeof(元素类型)`

假如`int array[4][2]`,int大小为2,array的地址为0x1000，则 &array[1][2] = `0x1000 + (2 * 2) + (2 * 2) == 0x1008`

# 💝 字符串、字符和字节

- 字符串是一种重要的数据类型，但是C语言并没有显式的字符串数据类型，因为字符串以字符串常量的形式出现或者存储于字符数组中。
- 操作字符串变量时必须额外小心各种可能导致缓冲区溢出的操作。

## 9.1 字符串基础

- 字符串是一串**零个或多个字符**，并且以一个**位模式为全0的NUL字符结尾**。

> 字符串所包含的字符内部不能出现NUL字节
>
## 9.2 字符串长度

- 字符串的长度就是它所包含的字符个数。

使用标准库头文件`#include <string.h>`中的函数计算字符串长度

~~~shell
strlen 原型
size_t strlen (char const *string);
~~~

> size_t 是一个无符号整数类型，且这个类型是在头文件`stddef.h`中定义的

- 无符号数的使用需要考虑是否会产生负数

~~~shell
if (strlen(x) >= strlen(y)) ...
if (strlen(x) - strlen(y) >= 0) ...
~~~

这两个式子是不相等的，第二行的`strlen(x) - strlen(y)`的返回结果是一个无符号数，**无符号数绝不可能是负数**！

**strlen原型**

~~~shell
#include <stddef.h>

size_t 
strlen(char const *string)
{
  int length;
  
  for (length = 0; *string++ != '\0';)
    length += 1;
  return length;
}
~~~

- 表达式中如果同时存在无符号数和有符号数，可能会产生奇怪的结果

~~~shell
if (strlen(x) >= 10) ...
if (strlen(x) - 10 >= 0) ...
~~~

这两个式子也是不相等的，原因和上面相同。
> 如果把strlen的返回值强制转换为`int`，就可以消除这个问题。

**tips:**
> 自己重写一个标准库函数可能会比标准库函数效率更高，如果合理使用寄存器register声明和一些技巧，**但事实上很少能如愿**。
>> <u>寻找一种更好的算法比改良一种差劲的算法更有效率，复用已经存在的软件比重新开发一个效率更高。</u>

## 9.3 不受限制的字符串函数

- 最常用的字符串函数都是**不受限制**的，就是说它们只是通过寻找字符串参数结尾的`NUL`字节来判断它的长度。

### 9.3.1 复制字符串

~~~shell
char *strcpy(char *dst, char const *src);
~~~

这个函数把参数src字符串复制到dst参数，<u>由于dst参数将进行修改，所以它必须是个字符数组或者是一个指向动态分配内存的数组的指针，**不能使用字符串常量**</u>

> <u>程序员必须保证目标字符数组的空间足以容纳需要复制的字符串。</u>因为如果字符串比数组长，多余的字符仍然被复制，它们将覆盖原先存储于数组后面的内存空间的值。
>> strcpy无法解决这个问题，因为它无法判断目标字符数组的长度。

### 9.3.2 连接字符串

~~~shell
char *strcat( char *dst, char const *src);
~~~

- 找到字符串末尾NUL并将src中的首字符覆盖掉NUL  

常见`strcat`用法

~~~shell
strcpy( message, "Hello ");
strcat( message, customer_name );
strcpy( message, ", how are you?");
~~~

### 9.3.3 函数的返回值

- `strcpy`和`strcat`都返回它第一个参数的一份拷贝

将函数返回值作为另一个函数的参数

~~~shell
strcat(strcpy(dst,a),b);
~~~

> 首先执行`strcpy`将字符串从a复制到dst并返回dst。然后这个返回值成为`strcat`函数的第一个参数，`strcat`函数把b添加到dst的后面。

但是在可读性上其实不如

~~~shell
strcpy(dst,a);
strcat(dst,b);
~~~

- 事实上，在这些函数的绝大多数调用中它们的返回值只是被简单地忽略。

### 9.3.4 字符串比较

- 比较两个字符串涉及对两个字符串对应的字符逐个进行比较，直到发现不匹配为止。
- 那个最先不匹配的字符中较"小"(字符集中序数较小)的那个字符所在的字符串被认为"小于"另外一个字符串

~~~shell
int strcmp(char const *s1, char const *s2);
~~~

如果`s1`小于`s2`，strcmp函数返回一个小于零的值，反之返回一个大于零的值。相等返回零。

~~~shell
if (strcmp(a,b)) // 用于布尔值测试是一种坏风格
if (strcmp(a,b) > 0) // 用于与零进行比较更好
else if (strcmp(a,b) < 0)
else
~~~

## 9.4 长度受限的字符串函数

<u>标准库还包含了一些函数，它们以一种不同的方式处理字符串。</u>

~~~shell
char *strncpy(char *dst, char const *src, size_t len);
char *strncat(char *dst, char const *src, size_t len);
char *strncmp(char const *s1, char const *s2, size_t len);
~~~

这些函数接受一个显式的长度参数，用于**限定**进行复制或比较的字符数。

- 注意⚠️：如果strlen(src)的值大于或等于len，<u>那么只有len个字符被复制到dst中。它的结果将不会以**NUL**字节结尾。</u>

> strncpy 调用的结果可能不是一个字符串，因此字符串必须以NUL字节结尾。

保证strncpy的结果是以'\0'结尾的

~~~shell
char buffer[BSIZE];
...
strncpy(buffer, name, BSIZE);
buffer[BSIZE - 1] = '\0';
~~~

如果name的内容可以容纳于buffer中最后的赋值语句无效。

如果strlen(name) >= BSIZE 那么最后一条赋值语句可以截断name的字符防止缓存区溢出。

> strncat总是在结果字符串后面添加一个NUL字节，所以不会有这种问题；strncmp只比较len长度的字符串是否相等，如果strlen(name)比BSIZE大则只比较BSIZE长度个字符。

## 9.5 字符串查找基础

### 9.5.1 查找一个字符

~~~shell
char *strchr(char const *str, int ch);
char *strrchr(char const *str, int ch);
~~~

> 虽然ch是`int`类型但是包含一个字符值。

- `strchr`在字符串str中查找字符ch第一次出现的位置，找到后函数返回一个指向该位置的指针，如果该字符不存在则返回NULL指针。strrchr返回一个指向字符串中最后一次出现的位置。

~~~shell
char string[20] = "Hello there, honey.";
char *ans;
ans = strchr(string, 'h');
~~~

### 9.5.2 查找任何几个字符

~~~shell
char *strpbrk(char const *str, char const *group);
~~~

- 返回一个指向str中第一个匹配group中任何一个字符的字符位置。如果未找到匹配则返回NULL指针。区分大小写。

~~~shell
char string[20] = "Hello there, honey.";
char *ans;
ans = strchr(string, "aeiou");
~~~

ans所指向的位置是string + 1，因为这个位置是第二个参数中的字符第一次出现的位置。区分大小写。

### 9.5.3 查找一个子串

~~~shell
char *strstr(char const *s1, char const *s2);
~~~

- 在s1中查找s2第一次出现的位置，并返回一个指向该位置的指针；如果s2并没有完出现在s1返回一个NULL指针；如果第二个参数是一个空指针函数返回s1。

#### 自己实现一个 `strtstr` 和 `strrpbrk` 函数

~~~shell
#include <string.h>

char*
my_strrstr(char const *s1, char const *s2)
{
  register char *last;
  register char *current;

  // 把指针初始化为我们已经找到的前一次匹配
  last = NULL;
  
  // 只在第二个字符串不为空的时候进行查找，如果s2为空返回NULL
  
  if (*s2 != '\0')
  {
    // 查找 s2 在 s1 中第一次出现的位置。
    current = strstr(s1,s2);
    while (current != NULL)
    {
      last = current;
      current = strstr(last + 1, s2);
    }
  }
  return last; // 返回指向我们找到的最后一次匹配的起始位置的指针。
}
~~~

~~~shell
#include <string.h>

char *
my_strrpbrk(char const *str, char const *group)
{
  register char *last;
  register char current;
  
  // 把指针初始化为我们已经找到的前一次匹配
  last = NULL;
  
  if (*s2 != '\0')
  {
    current = strpbrk(str, group);
    while (current != NULL)
    {
      last = current;
      current = strpbrk(last + 1, group);
    }
  }
  return last;
}
~~~

## 9.6 高级字符串查找

### 9.6.1 查找一个字符串前缀

- `strspn`和`strcspn`函数用于计算字符串开头连续匹配指定字符集中的字符的个数

~~~shell
size_t strspn(char const *str, char const *group);
size_t strcspn(char const *str, char const *group);
~~~

`str`: 要检查的字符串。  
`group`：包含要匹配的字符集的字符串。

>`strspn` 从 `str1` 的第一个字符开始，依次检查每个字符。只要这个字符在 `str2` 中能找到，就继续向后检查。**一旦遇到一个不在 `str2` 中的字符，函数就停止并返回已匹配的字符数。**

> `strcspn` 从 `str1` 的第一个字符开始，依次检查每个字符。只要这个字符不在 `str2` 中，就继续向后检查。一旦遇到一个在 `str2` 中的字符，函数就停止并返回已检查的字符数。

~~~shell
#include <stdio.h>
#include <string.h>

int main() {
    const char *sentence = "Hello, world!";
    const char *charset_vowels = "aeiou";
    const char *charset_alpha = "abcdefghijklmnopqrstuvwxyz";

    size_t length1 = strspn(sentence, "Heo");
    printf("The length of the initial part of \"%s\" consisting of 'H', 'e', 'o' is: %zu\n", sentence, length1); 
    // 输出: 2 (因为 'l' 不在 "Heo" 中)

    size_t length2 = strspn(sentence, charset_alpha);
    printf("The length of the initial part of \"%s\" consisting of letters is: %zu\n", sentence, length2);
    // 输出: 5 (因为 ' ' 不在字母表中)

    return 0;
}
~~~

### 9.6.2 查找标记

- `strtok`函数用于分割字符串。它会根据指定的分隔符，将字符串分解成一系列的标记(token)。

~~~shell
char *strtok(char *str, char const *sep);
~~~

`str`：要被分割的字符串。
`sep`：包含一个或多个分隔符的字符串。

> strtok是在字符串本身进行处理的(in-place)，建议使用原字符串的拷贝进行操作。

- `strtok`的使用非常特殊，因为它是有状态的：
  - 第一次调用：传入要分割的字符串`str`。它会找到第一个分隔符，用`\0`替换它，并返回第一个标记的指针。
  - 后续调用：传入`NULL`作为`str`参数。`strtok`会从上次停止的位置继续，找到下一个分隔符，用`\0`替换它，并返回下一个标记的指针。

~~~shell
#include <stdio.h>
#include <string.h>

int main(void)
{
  char str[] = "apple,banana-orange";
  const char *delimiters = ",-";
  char *token;

  // 第一次调用， 传入字符串
  token = strtok(str,delimiters);
  printf("First token: %s\n", token);
  
  // 后续调用，传入NULL
  while(token != NULL)
  {
    token = strtok(NULL,delimiters);
    if (token != NULL){
      printf("Next token: %s\n",token);
    }
  }
  return 0;
}
~~~

## 9.7 错误信息

- 当你调用一些函数，请求操作系统执行一些功能如打开文件时，如果出现错误，操作系统是通过设置一个外部的整型变量`errno`进行错误代码报告的。`strerror`函数把其中一个错误代码作为参数并返回一个指向用于描述错误的字符串的指针。

~~~shell
char *stderror(int error_number);
~~~

事实上，返回值应该被声明为`const`，因为你不应该修改它。

- `strerror`函数用于将错误编号转换为人类可读的错误信息字符串。

~~~shell
#include <stdio.h>
#include <string.h>
#include <errno.h>
// 必须包含此头文件来使用 errno

int main(void)
{
  FILE *file;
  // 尝试打开一个不存在的文件
  file = fopen("non_existent_file.txt", "r");
  
  // 如果 fopen 失败
  if (file == NULL)
    printf("Error opening file: %s\n", strerror(errno));
  else
  {
    printf("File opened successfully.\n");
    fclose(file);
  }
  return 0;
}
~~~

## 9.8 字符操作

- 字符操作的原型位于`ctype.h`头文件中，分为字符分类函数和字符转换函数

### 9.8.1 字符分类

<h4>字符分类函数</h4>

|函数|如果它的参数符合下列条件就返回真|
|:---:|:---:|
|isspace|空白字符: '空格', 换页'\f'，换行 '\n', 回车 '\r', 制表符 '\t'或垂直制表符'\v'|
|isdigit|十进制数字0~9|
|isxdigit|十六进制数字，包括所有十进制数字，小写字母a\~f,大写字母A\~F|
|islower|小写字母a~z|
|isupper|大写字母A~Z|
|isalpha|字母a\~z A\~Z|
|isalnum|字母或数字，a\~z,A\~z或0~9|
|ispunct|标点符号，任何不属于数字或字母的图形字符(可打印符号)|
|isgraph|任何图形字符|
|isprint|任何可打印字符，包括图形字符和空白字符|

### 9.8.2 字符转换

~~~shell
int tolower(int ch);
int toupper(int ch);

if (ch >= 'A' && ch <= 'Z') 在ASCII字符集的机器上能够运行，但是其他字符集有可能会失败
if (isupper(ch))
就都能顺利运行
~~~

## 9.9 内存操作

- 根据定义，字符串由一个NUL字节结尾，所以字符串内部不能包含任何NUL字符。但是非字符串数据内部包含零值的情况并不罕见。你无法使用字符串函数来处理这种类型的数据，因为当它们遇到第一个NUL字节时将停止工作。
- 使用**内存操作函数**可以处理任意的字节序列

~~~shell
void *memcpy(void *dst, void const *src, size_t length);
void *memmove(void *dst, void const *src, size_t length);
void *memcmp(void const *a, void const *b, size_t length);
void *memchr(void const *a, int ch, size_t length);
void *memset(void *a, int ch, size_t length);
~~~

- 和字符操作函数类似，对于memcpy()函数，如果src与dst以任何形式出现了重叠，它的结果是未定义的。但是memmove()函数可以重叠。
- 内存操作函数传入的长度为内存长度不是元素长度。
- 任何类型的指针都可以转换为`void*`型指针。

`memcpy`

`memcpy` copies a block of memory from a source to a destination location.

**Parameters:**

- `dest`: A pointer to the destination memory block.
- `src`: A pointer to the source memory block.
- `n`: The number of bytes to copy

**Use case:** Copying data between non_overlapping memory regions.

~~~shell
#include <stdio.h>
#include <string.h>

int main(void)
{
  int source_array[] = {1,2,3,4,5};
  int destinaion_array[5];
  
  // copy 5 integers from soure_array to destination_array
  memcpy(destination_array, source_array, sizeof(source_array));

  printf("Destinaion array: ");
  for (int i = 0; i < 5; i++)
  {
    printf("%d ",destination_array[i]);
  }
  printf("\n");
  return 0;
}
~~~

`memmove`

`memmove` copies a block of memory from a source location to a destination location, even if the memory blocks overlap.

**Parameters:** Same as `memcpy`

**Use case:** Shifting data within the same array or buffer. This is safer than `memcpy` for overlapping regions.

~~~shell
#include <stdio.h>
#include <string.h>

int main(void)
{
  char str[] = "abcdefgh";
  
  // Shift the string two characters to the left
  // The source and destination overlap (str + 2 and str)
  memmove(str, str + 2,strlen(str) - 2);
  
  // manually add the null terminator since memmove doesn't
  str[strlen(str) - 2] = '\0';
  printf("String after memmove: %s\n", str); // prints "cdefgh"

  return 0;

}
~~~

`memchr`

`memchr` search a block of memory for the first occurrence of a specific byte.

**Parameters:**

- `a`: A pointer to the memory block to search
- `ch`: The byte value to search for. It's passed as an `int` but is treated as an `unsigned char`.
- `length`: The number of bytes to search.

**Return Value:**

- A pointer to the first occurrence of the byte `ch` within the first `n` bytes of the memory block `a`.
- A null pointer (`NULL`) if the byte is not found.

**Use Case:** Searching for a specific byte within a block of raw binary data.Unlike string functions like `strchr`. `memchr` continues its search past null terminators (`\0`).

~~~shell
#include <stdio.h>
#include <string.h>

int main(void) {
  // This array contains a null byte in the middle.
  char data[] = {'h', 'e', 'l', 'l', 'o', '\0', 'w', 'o', 'r', 'l', 'd'};
  char *result;
- 
  // Search for the character 'o' within the first 11 bytes of the array.
  // A string search function like strchr would stop at the '\0'
  result = memchr(data, 'o', sizeof(data));
  if (result != NULL) {
    printf("Found 'o' at memory address: %p\n", result);
    printf("Character found: '%c'\n", *result);

    // Calculate the index of the found character
    size_t index = (size_t)(result - data);
    printf("It is located at index: %zu\n", index);
  } else {
    printf("The character was not found.\n");
  }
  return 0;
}
~~~

`memcmp`

`memcmp` compares a specified number of bytes in two memory blocks

**Parameter:**

- `a`: A pointer to the first memory block
- `b`: A pointer to the second memory block
- `length`: The number of bytes to compare.

**Use case:** Comparing raw binary data, which may contain null bytes that would terminate string functions like `strcmp`.

~~~shell
#include <stdio.h>
#include <string.h>

int main(void)
{
  char data1[] = "Hello";
  char data2[] = "HellO";
  char data3[] = "Hello";
  
  // compare the first 5 bytes of data1 and data2
  int result1 = memcmp(data1, data2, 5);
  if (result1 != 0)
  {
    printf("data1 and data2 are different.\n");
  }
  // compare the first 5 bytes of data1 and data2
  
  int result2 = memcmp(data1, data3, 5);
  if(result2 != 0)
  {
    printf("data1 and data3 are different.\n");
  }
  return 0;
}
~~~

`memset`

`memset` fills a block of memory with a specified byte value.

**Parameters:**

- `a`: A pointer to the memory block to fill.
- `ch`: The value to be set. It's passed as an `int` but is converted to an `unsigned char`.
- `length`: The number of bytes to fill.

**Use case:** Initializing a block of memory, such as an array or a structure, to all zeros or a specific value.

~~~shell
#include <stdio.h>
#include <string.h>

int main(void)
{
  char buffer[10];
  
  // Initialize all 10 bytes of the buffer to 'A'
  memset(buffer, 'A', sizeof(buffer));
  printf("Buffer after memset: %.10s\n",buffer);
  
  // Initialize the buffer to all zeros (a common and safe practice)
  memset(buffer, 0, sizeof(buffer));
  printf("Buffer after zeroing: %d\n", buffer[0]); // Prints 0

  return 0;
}
~~~

## 9.10 总结

- 字符串就是零个或多个字符的序列，该序列以一个NUL字节结尾。

## 9.13 问题

1. C语言缺少显式字符串数据类型，这是一个优点还是一个缺点？

Answer:

C语言缺少显式的字符串数据类型，既是它的**优点**，也是它的**缺点**。  

优点：灵活性和高效性

C语言的字符串被实现为以 **空字符（\0）** 结尾的字符数组，这带来了以下几个显著的优点：

- 内存效率高：C语言的字符串存储非常紧凑，没有额外的元数据（如长度信息）。这使得C语言程序在处理大量文本时，内存开销极小。

- 直接操作内存：字符串作为数组，可以像普通数组一样通过指针直接访问和操作每个字符。这给予了程序员极大的灵活性，可以实现各种高效的算法，例如原地修改、零拷贝（zero-copy）等。这在系统编程、嵌入式开发和性能关键的应用中至关重要。

- 互操作性强：几乎所有编程语言都支持字节数组或指针，这使得C语言的字符串可以轻松地与其他语言（如Python、Rust、Java等）进行接口交互，而无需复杂的类型转换。

缺点：安全性和易用性

这种设计也带来了明显的缺点，尤其是在安全和易用方面：

- 安全性风险：由于字符串的长度信息不是显式存储的，字符串处理函数（如 strcpy、strcat、sprintf）都假定目标缓冲区足够大，这极易导致缓冲区溢出。这是C语言长期以来面临的最大安全挑战之一。程序员必须手动跟踪字符串长度，否则会引发严重的漏洞。

- 容易出错：忘记在字符串末尾添加 \0，或不小心覆盖了它，都会导致程序读取到无效内存，引发未定义行为。初学者经常会因为这些问题而感到困惑。

- 操作不便：字符串的拼接、截取等操作不像高级语言那样简洁。例如，要拼接两个字符串，你需要手动计算所需空间、分配内存、然后使用 strcpy 和 strcat，整个过程繁琐且容易出错。

# 🤖 结构和联合

- C提供了两种类型的*聚合数据类型(aggregate data type)*。**数组**是相同类型的元素的集合，**结构体**是可具有不同类型的元素的集合。

- ***数组***可以通过下标访问，且数据不能相互赋值，只能通过循环逐个赋值。
- ***结构体***通过名字访问，相同类型的结构体变量可以相互赋值。

## 10.1 结构基础知识

- 结构体是一些值的集合，这些值称为它的**成员(member)**，<u>但一个结构体的各个成员可能具有不同的类型。</u>

- <u>结构变量属于标量类型，所以你可以像对待其他标量类型那样执行相同类型的操作。</u>

### 10.1.1 结构声明

在声明结构时，必须列出它包含的所有成员。

~~~shell
struct tag {member-list} variable-list;
~~~

结构声明语法的不同

~~~shell
struct {
  int   a;
  char  b;
  float c;
}x;


struct {
  int   a;
  char  b;
  float c;
} y[20],*z;
~~~

<u>这两个声明被编译器当作两种截然不同的类型，即使它们的成员列表完全相同。</u>

~~~shell
z = &x;
~~~

这条语句是非法的。

- 使用 **标签(tag)** 和 **类型定义别名(typedef)** 来更方便地声明和定义一个结构体变量。

**标签(tag)** 字段允许为成员列表提供一个名字。

~~~shell
struct SIMPLE{
  int   a;
  char  b;
  float c;
};

struct SIMPLE x,y[20],*z;
~~~

这个声明使用标签来创建变量，且现在`x`,`y`,`z`都是同一种类型的结构变量。

**类型定义别名(typedef)** 字段可以创建一个新的类型。

~~~shell
typedef struct {
  int   a;
  char  b;
  float c;
} Simple;

Simple x;
Simple y[20], *z;
~~~

`Simple`现在是一个类型而不是个结构标签。
> 如果你想在多个源文件中使用同一种类型的结构，你应该把标签声明或`typedef`形式的声明放在一个头文件中。当源文件需要这个声明时可以使用`#include`指令把那个头文件包含进来。

### 10.1.2 结构成员

~~~shell
struct COMPLEX{
  float f;
  int a[20];
  long *lp;
  struct SIMPLE s;
  struct SIMPLE sa[10];
  struct SIMPLE *sp;
};
~~~

结构成员可以是标量、数组、指针甚至是其他结构体。

### 10.1.3 结构成员的直接访问

- 结构变量的成员是通过点操作符`.`访问的。
- 点操作符接受两个参数，左操作数就是结构变量的名字，右操作数就是需要访问的成员的名字。这个表达式的结果就是指定的成员。

~~~shell
struct COMPLEX comp;
(comp.s).a; // 类型为struct SIMPLE 
(comp.sa)[4]; // 同上类型的数组
((comp.sa)[4]).c // 取出数组元素
结合性都是从左到右
comp.sa[4].c; equals ((comp.sa)[4]).c;
~~~

### 10.1.4 结构成员的间接访问

- 对于指向结构体的指针要访问其元素应该执行**间接访问操作`->`**。

~~~shell
void func(struct COMPLEX *cp);
// 第一种访问方式
(*cp).f;
// 第二种访问方式
cp->f;
~~~

### 10.1.5 结构的自引用

~~~shell
// 作为结构这种声明是非法的，程序内部会无限包含自身和结构的成员。(永不终止的递归程序)
// 如果我定义了 struct SELF_REF1 b; 那么 sizeof(SELF_REF1) = sizeof(int) + (4+4+4+.....) + sizeof(int)
// 无法计算，无法在内存中分配一个固定大小的空间。

struct SELF_REF1 {
  int   a;
  struct SELF_REF1 b; // 非法，不能这样定义。
  int   c;

};

// 作为指针这个声明是合法的，因为指针的长度在编译器确定结构体长度前就知道了。
// sizeof(SELF_REF2) = sizeof (int) + sizeof(SELF_REF2*) + sizeof(int)
// 可以计算固定大小空间

struct SELF_REF2{
  int   a;
  struct SELF_REF2 *b;
  int   c;
};

~~~

**<u>事实上一个结构内指向自身结构的指针所指向的是同一种类型的不同结构。</u>**
更高级的数据结构如链表和树，都是用这些技巧实现的。每个结构指向链表的下一个元素或树的下一个分支。

~~~shell
// 这个结构体创建失败了，因为SELF_REF3 直到声明的末尾才定义，所以在结构
// 声明的内部时还尚未定义。
typedef struct {
  int   a;
  SELF_REF3 *b;
  int   c;
}SELF_REF3;

// 解决方案是定义一个结构标签来声明b
typedef struct SELF_REF3_TAG {
  int   a;
  struct SELF_REF3_TAG *b;
  int   c;
}SELF_REF3
// 这次正确定义了结构体。
~~~

### 10.1.6 不完整的声明

- 在声明一些相互之间存在依赖的结构时使用不完整声明(incomplete declaration)

~~~shell
struct B;

struct A {
    struct B  *parnter;
      
};
struct B {
    struct A  *partner;
};
~~~

在A的成员列表中需要标签B的不完整声明。一旦A被声明之后，B的成员列表也可以被声明。

### 10.1.7 结构的初始化

- 位于花括号，由逗号分隔。

~~~shell
struct INI_EX {
  int   a;
  short b[10];
  Simple c;

}x = {
  10,
  {1,2,3,4,5},
  {25,'x',1.9},
};
// 另一种初始化
struct INI_EX x1 = {
  10,
  {1,2,3,4,5},
  {25,'x',1.9},
};
~~~

## 10.2 结构、指针和成员

声明和定义一些结构体和结构体变量

~~~shell
typedef struct {
  int   a;
  short b[2];
}Ex2;

typedef struct EX{
  int   a;
  char  b[3];
  Ex2   c;
  struct EX   *d;
}Ex;

// 定义并初始化
Ex x = {10, "Hi", {5,{ -1 , 25 }}, 0};
Ex *px = &x;
~~~

### 10.2.1 访问指针

**step1:** `px`是一个指针变量，`px`的表达式`Ex *px = x;`表示作为左值的`px`旧值将被一个新值取代。
> 考虑表达式`px + 1`。这个表达式并不是一个合法的左值，因为它的值并不存储于任何可标识的内存位置。`px`的右值更有意思，如果px指向一个结构数组的元素，这个表达式将指向该数组的下一个结构。就算如此`px + 1`仍是非法的，因为我们没办法分辨内存下一个位置所存储的是这些结构元素之一还是其他东西。编译器无法检测到这类错误。

### 10.2.2 访问结构

**step2:** `*px`的右值是px所指向的整个结构。可以用于同类型结构体赋值，作为点操作符的左操作数，访问一个指定的成员，作为参数传递给函数，作为函数的返回值返回。`px`的左值是从`x`接收来的新值，它将接受它的所有成员的新值。

- 作为左值，重要的是位置，而不是这个位置所保存的值。

表达式`*px + 1`是非法的，因为`*px`的结果是一个结构。C语言并没有定义结构体和整型值之间的加法运算。但表达式`*(px+1)`中的`px+1`表示结构体指针但x是一个标量所以这个表达式也是非法的。

### 10.2.3 访问结构成员

**step3:** 表达式`px->a`右值是`10`,`x.a`和`px->a`值相同。

<u>`*px`和`px->a`之间的关系</u>。在这两个表达式中`px`所保存的地址都用于寻找这个结构。但结构体的第一个成员是`a`。所以`a`的地址和结构的地址是一样的。<u>这样`px`看上去是指向整个结构，同时指向结构的第一个成员。</u>但是他们的类型不同，变量`px`被声明为一个指向结构的指针，所以表达式`*px`的结果是整个结构而不是它的第一个成员。

~~~shell
int *pi;

pi = px;
// 这个操作是非法的，因为它们的类型不匹配。
pi = (int *)px;
// 使用强制类型转换就能奏效

// 但是这种方法很危险，因为它避开了编译器的类型检查。
// 正确的表达式更为简单
pi = &px->a;
// -> 操作符的优先级高于&操作符的优先级，所以这个表达式无需使用括号。

~~~

`px->b`的值是一个指针常量，因为`b`是一个数组这个表达式`px->b`不是一个合法的左值。

~~~shell
char *pc;
pc = px->b; // 一个指针常量
pc = px->b[1]; // 指向数组的第二个元素
~~~

### 10.2.4 访问嵌套的结构

**step4:** 表达式`px->c`也是指向一个结构体，它的左值是整个结构。

~~~shell
int num = px->c.a; 指向结构体内结构体并访问结构体成员a
short *num1 = px->c.b;
int num2 = *px->c.b;
~~~

### 10.2.5 访问指针成员

**step5:** `px->d`的右值是0，左值是本身的内存位置。`*px->d`是非法的操作，因为d内包含了一个NULL指针，所以它不指向任何东西。

~~~shell
Ex te;
te = *px->d;
x.d = &te;
~~~

> **空指针的本质：地址0**
>> 空指针是一个特殊的指针值，它表示该指针不指向任何有效的内存对象。
>> *解引用空指针后CPU会尝试访问地址0*-->*操作系统会捕获异常*-->*触发硬件异常(Page Fault)或(Segmentation Fault)*-->*内核终止程序*。

## 10.3 结构的存储分配

- 编译器按照成员列表的顺序一个接一个地给每个成员分配内存。<u>只有当存储成员时需要满足正确的边界要求时，成员之间才可能出现用于填充的额外内存空间。</u>

~~~shell
struct ALIGN{
  char  a;
  int   b; 
  char  c;
};
~~~

这个结构体实际分配了12个字节的内存空间但是有6个字节空间实际上不能访问。

~~~shell
struct ALIGN2{
  int b;
  char a;
  char c;

};
~~~

这个结构体实际分配了8个字节的内存空间。（两个字符可以紧挨着存储，最后有2个字节被浪费）
> 但是实际上依程序的可维护性和可读性而言不是特别大的内存损失都不需要重新排。

- 在程序创建成百上千个结构体时内存浪费问题就更为明显。
- 可以使用`offsetof`宏（定义于`stddef.h`）判断结构体内成员距离首地址的偏移值

~~~shell
offsetof(type,member) // type 是结构体类型名，member是结构体里面的成员名
offsetof(struct ALIGN, b) // 返回值是 4,也就是成员a占用了4个字节用于结构体内内存对齐
~~~

## 10.4 作为函数参数的结构

- 非必要不建议将结构体作为函数参数传递
- 结构体作为一个标量的大小可能会比想象中的大

~~~shell
typedef struct
{
  char    product[PRODUCT_SIZE];
  int     quantity;
  float   unit_price;
  float   total_amount;
};

void print_receipt(Transaction trans);
void print_receipt(Transaction *trans);
~~~

一个传递的是结构体的拷贝，一个传递的是结构体指针。就大小而言指针比结构体小得多，效率更高。

~~~shell
Transaction print_receipt(Transaction trans);
void print_receipt(Transaction *trans);
~~~

如果结构体作为函数返回值在堆栈上的操作效率会更低，传递结构体指针可以直接在函数内部完成结构体成员的修改。

## 10.5 位段

- 结构体具有实现 **位段(bit field)** 的能力
- 位段的成员是一个或多个位的字段，这些不同长度的字段实际上存储于一个或多个整型变量中。
- 位段成员必须声明为`int`,`unsigned int`,`signed int`, `_Bool(C99)`类型，在成员名的后面是一个冒号和一个整数。
- 不能对位段成员取地址(不能使用`&`运算符)
- 位段不能是数组
- 可移植性的程序应该避免使用位段。
- 位段和结构体成员一样之间需要内存对齐(在位段与位段之间插入填充位(Padding))

~~~shell
struct CHAR {
  unsigned  ch  : 7;
  unsigned font : 6;
  unsigned size : 19;
};
~~~

因为最后一个位段`size`过于庞大(大于短整型的长度)，所以可以利用前两个位段`ch`和`font`所剩余的位来增加`size`的位数，这样就避免了声明一个32位的整数来存储`size`位段。
> CHAR这个结构体内的位段说明了位段可以把长度为奇数的数据包装在一起，节省存储空间

## 10.6 联合

- 联合所有成员引用的是**内存中的相同位置**
- 适用于在不同时刻把不同的东西存储于同一个位置时

~~~shell
union {
  float f;
  int   i;
} fi;

fi.f = 3.14159;
printf("%d\n", fi.i);
~~~

在一个浮点型和整型都是32位的机器上，变量 `fi` 只占据内存中的一个32位的字。最后用占位符`%d`输出一个浮点数不是`3`而是`1078530000`，与IEEE754单精度浮点标准有关。

### 10.6.1 变体记录

- 内存中某个特定的区域将在不同的时刻存储不同类型的值

在 C 语言中，可以使用 **联合体（Union）** 和 **结构体（Struct）** 结合的方式来模拟 `Pascal` 语言中的**变体记录（Variant Record）**，也称为**带标签的联合体（Tagged Union）**。

这种模式是 C 语言处理异构数据集合的标准方法，同时提供了类型安全性和可预测性。

#### 一个存货系统的变体记录

~~~shell
// 前两个结构指定每个零件和装配件必须存储的内容
struct PARTINFO {
  int     cost;
  int     supplier;
};

struct SUBASSYINFO {
  int     n_parts;
  struct {
    char partno[10];
    short quan;
  }part[MAXPARTS];
};

// 存货记录包含每个项目的一般信息并包含了一个联合
struct INVREC {
  char    partno[10];
  int     quan;
  enum    { PART, SUBPASSY }    type;
  union   {
          struct PARTINFO       part;
          struct SUBASSYIINFO   subassy;
  }info;
};

// 操作名为 rec 的 INVERC 结构变量
if (rec.type == PART){
  y = rec.info.part.cost;
  z = rec.info.part.supplier;
}
else{
  y = rec.info.subpassy.nparts;
  z = rec.info.subpassy.parts[0].quan;
}
~~~

### 10.6.2 联合的初始化

- 联合初始化的初始值必须是联合第一个成员的类型，且必须位于一对花括号里

~~~shell
union {
  int   a;
  float b;
  char  c[4];
} x = { 5 };
~~~

> 把`x.a`初始化为 5,如果给出的初始值是任何其他类型都会被转换为一个整数并赋值给`x.a`

# ♿ 动态内存分配

- 数组的元素存储于内存中连续的位置上。当一个数组被声明时，它所需要的内存在**编译时**就被分配。但是也可以使用动态内存分配在**运行时**为它分配内存。

## 11.1 为什么使用动态内存分配

如果是已经知道数量大小的数组分配发生在编译时，但如果在编译时不能确定数组长度(数组的长度常常在运行时才知道)，因为所需内存空间取决于输入数据。

## 11.2 malloc和free

- `malloc`执行动态内存分配`free`执行分配内存的释放。这些函数维护一个可用内存池。
- `malloc`分配的动态内存没有初始化，可以使用`calloc`函数初始化也可以手动初始化。

函数原型(在`stdlib.h`中声明)

~~~c
void *malloc(size_t size);
void *free(void *pointer);
~~~

`malloc`分配的是一块连续的内存，如果请求分配100字节的内存那么实际分配的内存就是100个连续的字节。
> `malloc`分配的内存可能比请求的内存大小稍微多一点，这个行为是由编译器定义的。

内存池如果是空的(可用内存无法满足请求)`malloc`函数会像操作系统请求得到更多的内存。并在这块新的内存上执行分配任务。如果操作系统无法向malloc提供更多的内存，malloc就返回一个NULL指针。***因此对malloc所分配的内存确保其是非空(NULL)是非常重要的***。

~~~c
int *a_pointer = (int*)malloc(sizeof(int) * 100);
if (a_pointer == NULL)
  return -1; // 在函数内提前退出并返回错误值-1
~~~

`free`的参数只能是`NULL`或是之前请求分配内存函数`malloc`,`calloc`或`realloc`的返回值。向`free`函数传递一个NULL参数没有任何意义。
> 因为malloc的返回值是一个`void*`类型，在比较老的编译器(C89或之前)可能会要求对返回值进行强制类型转换(int*)。

> 二次释放和悬空指针：对同一块内存调用两次`free(ptr)`会导致堆损坏和程序崩溃；`free(ptr)`后`ptr`仍然指向已释放的内存。为了安全应立即执行`ptr=NULL`将指针置为空指针，避免后续误用。

## 11.3 calloc和realloc

函数原型(在`stdlib.h`中声明)

~~~c
void *calloc(size_t num_elements, size_t element_size);
void *realloc(void *ptr,size_t new_size);
~~~

`calloc`也用于分配内存，而`realloc`用于修改一个原先已经分配的内存块大小，使用`realloc`可以扩大和缩小内存大小。

> `malloc`分配的内存是未初始化的，内容是随机的垃圾值；`calloc`分配的内存会被初始化为全0。  
> `realloc`重新分配内存大小失败时会返回NULL但原始指针ptr指向的内存块仍有效，数据保持不变。

> realloc(NULL,size) == malloc(size)  
> realloc(ptr,0) == free(ptr)并返回NULL

## 11.4 使用动态分配的内存

~~~c
int *pi;
...
pi = malloc(100); // 如果分配成功，在整型为 4 个字节大小的机器上被当作25个整型元素的数组
pi = malloc(25 * sizeof(int)); // 这种分配方式更好一些因为它是可移植的
...
// 使用内存：为内存分配元素
int *pi2, i;

pi2 = pi;
for(;pi2 != pi + 25;)
  *pi2++ = 0;

// 使用下标
for(i = 0; i < 25; i++)
  pi[i] = 0;
~~~

## 11.5 常见的动态内存错误

- 释放内存的一部分是不允许的，动态分配的内存必须一起释放。可以使用`realloc`函数缩小一块动态分配的内存并有效地释放尾部的部分内存(还是用原分配函数的返回值)

~~~c
pi = malloc(10 * sizeof(int));
free(pi + 5); // 释放部分内存
~~~

**内存泄露**

分配内存但在使用完毕后不释放将引起内存泄露(memory leak)。在那些所有执行程序共享一个通用内存池的操作系统中，内存泄露将一点点地榨干可用内存。

其他操作系统能够记住每个程序当前拥有的内存段，这样当一个程序终止时，所有分配给它但未被释放的内存都归还给内存池。

# 🤧使用结构和指针

## 12.1 链表

- **链表(linked_list)** 就是一些包含数据的独立数据结构的集合。链表中的每个节点通过链或指针连接在一起。程序通过指针访问链表中的节点。通常节点是动态分配的，也有由节点数组构建的链表。

## 12.2 单链表

- 在单链表中，每个节点包含一个指向链表下一节点的指针。链表最后一个节点的指针字段的值为`NULL`，提示链表后面不在有其他节点。在找到链表的第一个节点后，指针就可以带你访问剩余的所有节点。为了记住链表的起始位置，可以使用一个**根指针(root pointer)**。根指针指向链表的第一个节点。注意根指针只是一个指针，它不包含任何数据。

~~~c
typedef struct NODE{
  struct NODE *link; // 指向下一个节点的指针
  int         value; // 存储数据的变量 
} Node;
~~~

> 单链表无法从结束位置往前遍历

### 12.2.1 在单链表中插入

~~~c
// 插入到一个有序的单链表。函数的参数是一个指向链表第一个节点的指针以及需要插入的值。

#include <stdlib.h>
#include <stdio.h>
#include "sll_node.h"

#define FALSE 0
#define TRUE  1

int sll_insert(Node *current, int new_value)
{
  Node *previous;
  Node *new;

  // 寻找正确的插入位置，方法是按顺序访问链表，直到到达其值大于或等于新插入值的节点。
  
  while(current->value < new_value)
  {
    previous = current;
    current = current->link;
  }
  // 为新节点分配内存，并把新值存储到新节点中，如果内存分配失败。
  // 函数返回false
  new = (Node*)malloc(sizeof(Node));
  if (new == NULL)
    return FALSE;
  new->value = new_value;

  // 把新节点插入到链表中，并返回true 
  new->link = current;
  previous->link = new; 
  return TRUE;
}
~~~

~~~c
result = sll_insert(root,12); // 假设有一个节点存储15，插入在这个节点前
~~~

- 这个插入函数是**不正确**的，它不能处理插入最后一个节点后的场景(最后一个节点的link为NULL)，也不能处理插入第一个节点前的场景(函数不能访问root，previous未定义)
- 可以将一个指向root的指针作为参数传递给函数。然后使用间接访问，函数不仅可以获得root(指向链表第一个节点的指针，也就是根指针)的值，也可以向它存储一个新的指针值(解决current和previous分开的问题，函数总是可以判断Node\*\*是否满足条件并间接访问root判断值大小是否满足。Node\*\*总是作为当前节点的前一个链接字段。)

~~~c
#include <stdlib.h>
#include <stdio.h>
#include "sll_node.h"

#define FALSE 0
#define TRUE  1

int sll_insert(Node **rootp, int new_value)
{
  Node *current;
  Node *previous;
  Node *new;
  
  // 得到指向第一个节点的指针
  current = *rootp;
  previous = NULL;
  
  // 寻找正确的插入位置，方法是按序访问链表，直到到达一个其值大于或等于新值的节点
  while(current != NULL && current->value < new_value)
  {
    previous = current;
    current = current->link;
  }

  // 为新节点分配内存，并把新值存储到新节点中，如果内存分配失败，
  // 函数返回false
  new = (Node*)malloc(sizeof(Node));
  if (new == NULL)
    return FALSE;
  new->link = current;
  if (previous == NULL)
    *rootp = new;
  else
    previous->link = new;
  return TRUE;
}

int sll_insert_ease(Node **head, int new_value)
{
  Node *new_node;
  
  // current_ptr 现在指向的是一个指针 (head 或 link 字段)
  // 初始时指向调用者的 head 指针变量
  Node **current_ptr = head;
  
  // 1. 寻找插入位置：循环直到指针指向NULL(末尾)或指向的值 >= new_value
  while (*current_ptr != NULL && (*current_ptr)->value < new_value)
    current_ptr = &(*current_ptr)->link;
  
  // 2. 分配新节点
  new_node = (Node*)malloc(sizeof(Node));
  if (new_node == NULL)
    return FALSE;
  new_node->value = new_value;
  
  // 3. 插入：新节点指向 current_ptr 当前指向的那个节点
  new_node->link = *current_ptr;
  
  // 4. 核心：更新current_ptr 指向的指针变量，让它指向新节点
  *current_ptr = new_node; // *current_ptr 其实就是上一个节点的link
  return TRUE;
}
// 书上的优化
int sll_insert(register Node **linkp, int new_value)
{
  register Node *current;
  register Node *new;
  
  while ((current = *linkp) != NULL && current->value < new_value)
    linkp = &current->link;

  new = (Node*)malloc(sizeof(Node));
  if (new == NULL)
    return FALSE;
  new->value = new_value;
  
  new->link = current;
  *linkp = new;
  return TRUE;
}
~~~

## 12.3 双链表

- 单链表的替代方案是双链表。在一个双链表中，每个节点都包含两个指针，指向前一个节点的指针和指向后一个节点的指针。这样就可以以任何方向遍历双链表，甚至可以忽前忽后地在双链表中访问。

~~~c
typedef struct NODE {
  struct NODE   *fwd;
  struct NODE   *bwd;
  int           value;
};
~~~

现在存在两个指针：一个指向链表的第一个节点(*fwd)，另一个指向最后一个节点(*bwd)。如果当前链表为空，这两字段都为`NULL`。

### 12.3.1 在双链表中插入

- `dll_insert`函数接受两个参数：一个指向根节点的指针和一个整型值。
- 先前所编写的单链表插入函数把重复的值也添加到链表中。在有些应用程序中，不插入重复的值可能更为合适。`dll_insert`函数只有当欲插入的值原先不存在于链表中时才将其插入。

考虑四种情况：

1. 新值可能必须插入到链表的中间位置。
2. 新值可能必须插入到链表的起始位置。
3. 新值可能必须插入到链表的结束位置。
4. 新值可能必须既插入到链表的初始位置，又插入到链表的结束位置(即原链表为空)。

~~~c
/*
  把一个值插入到一个双链表，rootp是一个指向根节点的指针，
  value是欲插入的新值
  返回值：如果欲插值原先已存在于链表中，函数返回0；
  如果内存不足导致无法插入，函数返回-1；如果插入成功，函数返回1。
*/
#include <stdlib.h>
#include <stdio.h>
#include "doubly_linked_list_node.h"

int dll_insert(Node *rootp, int value)
{
  Node *this;
  Node *next;
  Node *newnode;
  
  /*
    查看value是否已经存在于链表中，如果是就返回
    否则，为新值创建一个新节点("newnode"将指向它)
    "this"将指向应该在新节点之前的那个节点。
    "next"将指向应该在新节点之前的那个节点。
  */
  for (this = rootp; (next = this->fwd) != NULL; this = next){
    if (next->value == value)
      return 0;
    if (next->value > value)
      break;
  }

  newnode = (Node*)malloc(sizeof(Node));
  if (newnode == NULL)
    return -1;
  newnode->value = value;

  // 把新值添加到链表中
  if (next != NULL)
  {
    // 情况1或2:并非位于链表尾部
    if (this != rootp) // 情况1：并非位于链表起始位置
    {
      newnode->fwd = next;
      this->fwd = newnode;
      newnode->bwd = this;
      next->bwd = newnode;
    }
    else // 情况2：位于链表的起始位置
    {
      newnode->fwd = next;
      rootp->fwd = newnode;
      newnode->bwd = NULL;
      next->bwd = newnode;
    }   
  }
  else
  {
    // 情况3或4:位于链表的尾部
    if (this != rootp) // 情况3：并非位于链表的起始位置
    {
      newnode->fwd = NULL;
      this->fwd = newnode;
      newnode->bwd = this;
      rootp->bwd = newnode;
    }
    else // 情况4：位于链表的起始位置
    {
      newnode->fwd = NULL;
      rootp->fwd = newnode;
      newnode->bwd = NULL;
      rootp->bwd = newnode;
    }
  }
  return 1;
}
~~~

#### 语句提炼(statement factoring)
>
> 上面的双链表在最后判断节点插入位置时各个嵌套的if语句群存在大量的相似之处，可以使用**语句提炼**技巧消除这些重复代码

~~~c
if (x == 3)
{
  i = 1;
  some statement;
  j = 2;
}
else
{
  i = 1;
  some statement different;
  j = 2; 
}
~~~

> 这里不管`x == 3`的值是真是假，语句`i = 1` 和 `j = 2`都将执行。且这两天语句在if条件判断前都不会执行，所以：

~~~c
i = 1; 
if (x == 3)
  some statement;
else 
  some statement different;
j = 2;
~~~

> ***但是如果是对测试的结果有所影响的语句千万不能提炼出来！***

~~~c
/*
  双链表部分代码使用语句提炼
*/
// 把新节点添加到链表中
if(next != NULL)
{
  newnode->fwd = next;
  if (this != rootp)
  {
    this->fwd = newnode;
    newnode->bwd = this;
  }
  else
  {
    rootp->fwd = newnode;
    newnode->bwd = NULL;
  }
  next->bwd = newnode;
}
else
{
  newnode->fwd = NULL;
  if (this != rootp)
  {
    this->fwd = newnode;
    newnode->bwd = this;
  }
  else
  {
    rootp->fwd = newnode;
    newnode->bwd = NULL;
  }
  rootp->bwd = newnode;
}
~~~

第二个简化技巧

~~~c
if (pointer != NULL)
  field = pointer;
else
  field = NULL;
~~~

这段代码的意思是设置一个和pointer相等的变量，如果pointer未指向任何东西，这个变量就设置为NULL。但是：

~~~c
field = pointer;
~~~

这个代码的意思其实和上面的一模一样，也就是第三四种情况的else语句内的`newnode->fwd = NULL`可以写成`newnode->fwd = next`；同理`rootp->fwd = newnode`也可以写成`this->fwd = newnode`。

~~~c
/*
  最终提炼的双链表插入函数
*/
#include <stdio.h>
#include <stdlib.h>
#include "doubly_linked_list_node.h"

int dll_insert(register Node *rootp, int value)
{
  register Node *this;
  register Node *next;
  register Node *newnode;
  
  /*
    查看value是否已经存在于链表中，如果是就返回。
    否则，为新值创建一个新节点("newnode"将指向它)。
    "this"将指向应该在新节点之前的那个节点，
    "next"将指向应该在新节点之后的那个节点。
  */
  for (this = rootp; (next = this->fwd) != NULL; this = next)
  {
    if (next->value == value)
      return 0;
    if (next->value > value)
      break;
  }
  newnode = (Node*)malloc(sizeof(Node));
  if (newnode == NULL)
    return -1;
  newnode->value = value;

  // 把新节点添加到链表中
  newnode->fwd = next;
  this->fwd = newnode;

  //if (this != rootp)
  //  newnode->bwd = this;
  //else
  //  newnode->bwd = NULL;
  newnode->bwd = (this != rootp) ? this : NULL;
  
  //if (next != NULL)
  //  next->bwd = newnode;
  //else
  //  rootp->bwd = newnode;
  (next != NULL ? next : rootp)->bwd = newnode;
  return 1;
}
~~~

# 🍋‍🟩 预处理器

编译一个C程序涉及很多步骤。其中第一个步骤被称为**预处理(preprocessing)阶段**。C预处理器在源代码编译之前对其进行一些文本性质的操作。它的主要任务包括删除注释、插入被`#include`指令包含的文件的内容、定义和替换由`#define`指令定义的符号以及确定代码的部分内容是否应该根据一些条件编译指令进行编译。

## 14.1 预定义符号

|**符号**|**样例值**|**含义**|
|:---:|:---:|:---:|
|\_\_FILE\_\_|"name.c"|进行编译的源文件名|
|\_\_LINE\_\_|25|文件当前行的行号|
|\_\_DATE\_\_|"Jan 31 1997"|文件被编译的日期|
|\_\_TIME\_\_|"18:04:30"|文件被编译的时间|
|\_\_STDC\_\_|1|如果编译器遵循ANSI C，其值就为1，否则未定义|

`__FILE__`和`__LINE__`在确认调试输出的来源方面很有用处。`__DATE__`和`__TIME__`常常用于在被编译的程序中加入版本信息。`__STDC__`用于那些在ANSI环境和非ANSI环境都必须进行编译的程序中结合条件编译。

**更多实用的预定义符号**

|**符号**|**样例值**|**含义**|
|:---:|:---:|:---:|
|\_\_STDC\_VERSION\_\_|202311|显示编译器当前版本号|
|\_\_func\_\_|main|显示当前所在函数函数名|
|\_\_GUNC\_\_|15|和下面两个预定义符号一起使用，显示gcc当前符号|
|\_\_GUNC\_MINOR\_\_|2|同上|
|\_\_GUNC\_PATCHLEVEL\_\_|1|同上|
|\_\_OPTIMIZE\_\_|1|判断是否使用code optimization|
|\_\_x86\_64\_\_|1|判断系统芯片架构，下面一致|
|\_\_i386\_\_|1|同上|
|\_\_aarch64\_\_|1|同上|
|\_\_arm\_\_|1|同上|
|\_\_powerpc64\_\_|1|同上|
|\_\_powerpc\_\_|1|同上|

## 14.2 #define

在一些简单的用法中`#define`就是为数值命名一个符号

`#define`更为正式的描述

~~~c
#define name stuff
~~~

替换文本并不限于数值字面值常量。使用`#define`指令，你可以把任何文本替换到程序中。

~~~c
#define reg         register
#define do_forever  for(;;)
#define CASE        break;case
~~~

如果定义中的stuff非常长，它可以分成几行，除了最后一行之外，每行的末尾都要加一个反斜杠。

~~~c
#define DEBUG_PRINT(x,y,z)   printf( "File %s line %d:" \
                             " x=%d, y=%d, z=%d", \
                             __FILE__, __LINE__, \
                             x, y, z ) 
~~~

这里使用了相邻的字符串常量被自动连接为一个字符串的这个特性。
> #define 语句末尾不需要加分号`;`
还可以使用`#define`指令把一序列语句插入到程序中。

~~~c
#define PROCESS_LOOP \
        for (i = 0; i < 10; i += 1){  \
            sum += i;                 \
            if (i > 0)                \
            prod *= i;                \
        }
~~~

> 不要滥用这种技巧，如相同的代码需要出现在程序的几个地方，函数是一个更好的实现办法。

### 14.2.1 宏

- #define 机制包括了一个规定，允许把参数替换到文本上，这种实现通常称为 **宏(macro)** 或定义宏(defined macro)

~~~c
#define name(parameter-list) stuff
~~~

`parameter-list(参数列表)`是一个由逗号分隔的值的列表，每个值都与宏定义中的一个参数相对应

~~~c
// 一个接受一个参数的宏
#define SQUARE(x) x * x

// 正常使用没有问题
SQUARE(5) // 返回值是 25

// 下面是这个定义的问题
int a;
a = 5; 
printf("%d\n",SQUARE(a + 1));
// 这里返回值返回 11 而不是 36

// 被替换宏文本
printf("%d\n", a + 1 * a + 1);
// 根据四则运算先执行 1 * a 后执行两个加法
// 修改为
#define SQUARE(x) (x) * (x)
// 这样就可以避免第一个问题

// 另一个问题
#define DOUBLE(x) (x) + (x)
a = 5;
printf("%d\n", 10 * DOUBLE(a));
// 这里返回的是 55 而不是 100
printf("%d\n", 10 * (a) + (a));
// 在原来的定义外添加一个括号
#define DOUBLE(x) ((x) + (x))
// 就可以解决这个问题
~~~

> 所有用于对数值表达式进行求值的宏定义都应该用这种方式加上括号

**一种有趣的宏**

~~~c
#define repeat do
#define until(x) while(!(x))

// 上面的宏定义将下面的循环替换

// 替换
do{
  statements;
}while(!(i >= 10));

// 为
repeat {
  statements;
} until (i >= 10);
~~~

> 应该避免一直使用这种写法
>
### 14.2.2 #define 替换

1. 在调用宏时，首先对参数进行检查，看看是否包含了任何由`#define`定义的符号。如果是，它们首先被替换。
2. 替换文本随后被插入到程序中原来文本的位置。对于宏，参数名被他们的值所替代。
3. 最后，再次对结果文本进行扫描，看看它是否包含了任何由`#define`定义的符号。如果是就重复上述处理过程。

这样宏参数和`#define`可以包含其他`#define`定义的符号。但是宏不可以出现递归。

- 当预处理器搜索`#define`定义的符号时，字符串常量的内容并不进行检查。有两种将宏参数插入到字符串常量的方法

~~~c
#define PRINT(FORMAT, VALUE) \
      printf( "The value is " FORMAT "\n", VALUE)
... 
PRINT("%d", x + 3)
~~~

> 这种技巧只有当字符串常量作为宏参数给出时才能使用

~~~c
#define PRINT(FORMAT, VALUE) \
    printf( "The value of " #VALUE \
    " is " FORMAT "\n", VALUE )
...
PRINT( "%d", x + 3 ) // The value of x + 3 is 25 
~~~

- 第二个技巧使用预处理器把一个宏参数转换为一个字符串。`#argument`这种结构被预处理器翻译为`argument`。

- `##`结构则执行一种不同的任务。它把位于它两边的符号连接成一个符号。作为用途之一，它允许宏定义从分离的文本片段创建标识符。

~~~c
#define ADD_TO_SUM ( sum_number, value ) \
    sun ## sum_number += value
... 
ADD_TO_SUM( 5, 25 );
// 这条语句的意思是 sum5 += 25; 这种连接必须产生一个合法的标识符。否则其结果就是未定义的。
~~~

### 14.2.3 宏与函数

~~~c
#define MAX(a,b) ((a) > (b) ? (a) : (b))
~~~

使用宏来定义简单计算而不是函数有两个优点：

1. 用于调用和从函数返回的代码可能比实际执行这个小型计算工作的代码更大，所以对于简单函数使用宏比使用函数在***程序的规模和速度方面都更胜一筹***。
2. 函数的参数必须声明一种特定的类型，上面这个宏定义可以用于整型、长整型、单浮点型、双浮点型等其他的类型。***宏是与类型无关的***。

还有一些任务无法用函数实现只能用宏定义实现。

~~~c
#define MALLOC(n, type) \ 
    ( (type*)malloc( (n) * sizeof(type)))
// 被转换为
pi = MALLOC(25, int);
pi = ((int*)malloc((25) * sizeof(int)));
~~~

> 请注意宏定义并没有用一个分号结尾。分号出现在调用这个宏的语句中。
>
### 14.2.4 带副作用的宏参数

当宏参数在宏定义中出现的次数超过一次时，如果这个参数具有副作用那么当你使用这个宏时就可能出现危险，导致不可预料的结果。**副作用**就是在表达式求值时出现的永久性效果。例如 :

~~~c
x + 1
~~~

可以重复执行几百次，它每次获得的结果都是一样的。这个表达式不具有副作用。但是：

~~~c
x++
~~~

就具有副作用：它增加`x`的值。当这个值在下一次执行时，它将产生不同的结果。

~~~c
#define MAX(a,b) ((a) > (b) ? (a) : (b))
...
x = 5;
y = 8;
z = MAX( x++, y++ );
printf("x=%d, y=%d, z=%d\n", x, y, z);
// MAX的结果执行后 x = 6, y = 10, z = 9
// 虽然那个较小的值只增加了一次，但那个较大的值却增加了两次(y++) ? (y++)
z = ((x++) > (y++) ? (x++) : (y++));
~~~

### 14.2.5 命名约定

为了区分宏定义和函数的区别需要一个**命名约定**，最明显的区别就是函数名一般用全小写字母，宏定义用全大写字母。

***宏和函数的不同之处***

|属性|#define宏|函数|
|:---:|:---:|:---:|
|代码长度|每次使用时，宏代码都被插入到程序中。除了非常小的宏之外，程序的长度将大幅度增长|函数代码之处限于一个地方；每次使用这个函数时，都调用那个地方的同一份代码|
|执行速度|更快|存在函数调用/返回的额外开销|
|操作符/优先级|宏参数的求值是在所有周围表达式的上下文环境里，除非它们加上括号，否则邻近操作符的优先级可能会产生不可预料的结果|函数参数只在函数调用时求值一次，它的结果值传递给函数。表达式的求值结果更容易预测|
|参数求值|参数每次用于宏定义时，它们都将重新求值。由于多次求值，具有副作用的参数可能会产生不可预测的结果|参数在函数被调用前只求值一次。在函数中多次使用参数并不会导致多种求值过程。参数的副作用并不会造成任何特殊的问题|
|参数类型|宏与类型无关。只要对参数的操作是合法的，它可以使用于任何参数类型|函数的参数是与类型有关的。如果参数的类型不同，就需要使用不同的函数，即使它们执行的任务是相同的|

### 14.2.6 #undef

- 这条预处理指令用于移除一个宏定义。

~~~c
#undef name
~~~

如果一个现存的名字需要被重新定义，那么它的旧定义首先必须用`#undef`移除。

### 14.2.7 命令行定义

许多C编译器提供了在命令行中定义符号，用于启动编译过程。

~~~c
int array[ARRAY_SIZE];

-Dname
-Dname=stuff

cc -DARRAY_SIZE=100 prog.c
~~~

## 14.3 条件编译

- 只用于调试程序的语句就是一个明显的例子它们不应该出现在程序的产品版本中，**但是你可能并不想把这些语句从源代码中物理删除，因为如果需要一些维护性修改时，你可能需要重新调试这个程序，还需要这些语句**。
- 条件编译(conditional compilation)就是用于实现这个目的。

~~~c
#if constant-expression
      statements
#endif
~~~

其中`constant-expression`（常量表达式）由预处理器进行求值。如果它的值是非零值（真），那么`statements`部分就被正常编译，否则预处理器就安静地删除它们。

~~~c
#define DEBUG 1
#if DEBUG
  printf(statements);
#endif
~~~

一个简单的使用条件编译

`#if`的子句`#elif`和`#else`

~~~c
#if constant-expression
      statements
#elif  constant-expression
      other statements ...
#else 
      other statements
#endif
~~~

### 14.3.1 是否被定义

~~~c
#if defined(symbol)
#ifdef symbol

#if !defined(symbol)
#ifndef symbol
~~~

`#if`形式的语句功能更强。因为常量表达式可能包含额外的条件

~~~c
#if X > 0 || defined(ABC) && defined(BCD)
~~~

> 一些老K&R C编译器并未包含所有功能。

### 14.3.2 嵌套指令

~~~c
#if defined( OS_UNIX )
  #ifdef OPTION1
  unix_version_of_option1();
  #endif
  #ifdef OPTION2
  unix_version_of_option2();
  #ifdef OPTION3
  unix_version_of_option3();
#elif defined( OS_MSDOS )
  #ifdef OPTION2
  msdos_version_of_option2();
  #endif
#endif
~~~

> 在每个#endif 后添加一个注释标签可以很好地区分每个嵌套的指令

## 14.4 文件包含

- 一个头文件如果被包含到10个源文件中，它实际上被编译了10次。

> 但实际上这种额外开销实际上并不大。
>
### 14.4.1 函数库文件包含

头文件包含语法

~~~c
#include <filename>
~~~

> UNIX 系统上使用`<>`包含的头文件一般在目录`/usr/include`查找
>> 编译器有一个选项`-I`允许把其他目录添加到这个列表中
>>
### 14.4.2 本地文件包含

~~~c
#include "filename"
~~~

> 优先从.c文件或.h文件所在的当前目录查找
>
### 14.4.3 嵌套文件包含

~~~c
#include "a.h"
#include "b.h"
// 如果b.h 文件里包含了a.h，那么a.h在当前文件就被包含了两次
--------
// another file
#ifndef _HEADERNAME_H
#define _HEADERNAME_H 1 // #define _HEADERNAME_H
// All the stuff that you want in the header file
#endif

// 使用这种方法并不能直接不调用第二次该文件，但是文件内的所有文件会在第二次调用被弃用
~~~

> 这种处理将拖慢编译速度，所以可能尽量避免出现多重包含

## 14.5 其他指令

### 14.5.1 #error

当程序编译之后，`#error`指令允许你生成错误信息，并强制终止编译过程。

~~~c
#error text of error message
// 使用案例
#if defined(OPTION_A)
    stuff needed for optionA
#elif defined(OPTION_B)
    stuff needed for optionA
#elif defined(OPTION_C)
    stuff needed for optionC
#else
    #error No option selected!
#endif

// 检查 C 标准版本
#if __STDC_VERSION__ < 199901L
#error "本项目要求 C99 或更高版本的编译器！"
#endif

#ifdef WINDOWS_ENV 
    // 针对 Windows的代码...
#elif defined(LINUX_ENV)
    // 针对 Linux的代码...
#else
#error "必须定义 WINDOWS_ENV 或 LINUX_ENV 宏以指定编译环境！"
~~~

### 14.5.2 #line

`#line`指令用于改变编译器对当前代码行号和文件名的追踪。

~~~c
#line number "string"
// number 将当前源代码行的行号设置为这个数字
// string 可选，将编译器追踪的文件名设置为这个字符串

// 例子
// 原始文件名 line.c  假设
#include <stdio.h>

int a = 1;

#define DEBUG 0
#undef DEBUG
// gcc -std=c11 -g -Wall -DDEBUG=0 line.c
// gcc -std=c11 -g -Wall -DDEBUG=1 line.c
// 使用-DNAME 控制定义名的值
#if DEBUG
#line 100 "generated_code.c"
#endif
void func() {
  int b = 2;       // 编译器现在认为这是 generated_code.c 的 101 行
  int c = "error"; // 故意制造一个错误
}

// 恢复到当前文件的实际行号
#line __LINE__

int main(void) {
  func();
  return 0;
}
~~~

### 14.5.3 #progma

- 一种特殊的预处理器指令，用于向编译器发出特殊指令或特定于实现的功能。
- `#progma` 的行为完全取决于编译器。

~~~c
#progma 记号序列
// -------------
#progma once // 非标准但广泛使用，确保头文件只被编译一次，防止重复包含错误。
// 不是C标准的一部分，但是几乎所有的现代编译器(GCC, Clang, MSVC)都支持。
#progma STDC // C99/C11 标准用于控制浮点运算和线程。

#progma pack(n) // 控制结构体对齐
// 改变结构体的内存对齐方式
struct DefaultStruct {
  char c;
  int i; // 4 字节，可能有三字节的填充
};

// 设置对齐为 1字节
#progma pack(push, 1)

struct PackedStruct {
  char c; // 1字节
  int i; // 4 字节，紧跟在 c 之后，没有填充
};

#progma pack(pop) // 恢复默认对齐设置
~~~

# 🎶 输入/输出函数

- ANSI C和早期C相比的最大优点之一就是它在规范里所包含的函数库。每个ANSI编译器必须支持一组规定的函数，并具备规范所要求的接口，而且按照规定的行为工作。

## 15.1 错误报告

`perror`函数以一种简单、统一的方式报告错误。（原型定义于stdio.h）

~~~c
void perror(char const *message);
~~~

> 标准库函数在程序存在错误时在一个外部整型变量`errno`（在errno.h中定义）中保存错误代码后把这个信息传递给用户程序，提示操作失败的准确原因。
>> perror最大的优点就是容易使用。

## 15.2 终止执行

`exit`函数用于终止一个程序的执行。（原型定义于stdlib.h）

~~~c
void exit(int status);
~~~

`status`参数返回给操作系统，用于提示程序是否正常完成。
> 预定义符号EXIT_SUCCESS 和 EXIT_FAILURE 分别提示程序的终止是成功还是失败。
>> 一般执行完`perror`后都会执行`exit`

## 15.3 标准I/O函数库

- 标准I/O函数库是在原先I/O库基础上的实现和扩展，例如为printf创建了不同的版本。且函数库引入了缓冲I/O的概念，提高了绝大多数程序的效率。

> 但是标准函数库是在某台特定类型机器上实现的，在其他不同类型的机器上运行相同的程序会出现无法运行的情况。

- ANSI C函数库中的I/O函数在可移植性和完整性上更加完善。

> ANSI C的一个主要优点就是这些修改是通过**增加不同的函数**方式实现，而不是通过对现存函数进行修改来实现，保证了程序的可移植性。

## 15.4 ANSI I/O概念

- 头文件`<stdio.h>`包含了与ANSI函数库的I/O部分有关的声明。

> 尽管不包含这个头文件也能使用某些I/O函数，但绝大多数函数都需要包含这个头文件。
>
### 15.4.1 流

- ANSI C对I/O的概念进行抽象，所有的I/O操作只是简单的移入/移出字节。这种字节流便称为**流(stream)**。

1. 核心概念：抽象(Abstraction)

- **流的本质**：流是对所有I/O操作的抽象
- **统一接口**：所有的I/O设备都被视为类似的设备。
- **程序视角**：对C程序而言，所有的I/O操作都只是在流上进行字节的移进或移出。
- **细节隐藏**：特定的I/O设备的细节对程序员是隐藏的。

1. 核心机制：缓冲(Buffering)

大多数流是***完全缓冲的(fully buffered)***

- **读取操作**：当进行"读取"时，实际上是从一块较大的缓冲区(buffer)中读取数据。当缓冲区空时，程序才通过设备或文件读取下一块较大的输入数据并重新填充缓冲区。
- **写入操作**："写入"也是先写入到内存中的缓冲区，直到缓冲区写满时，数据才被一次性写入(flush,冲洗或刷新)到设备或文件。
- **效率优势**：这种块状写入和读取操作由于减少了与设备或文件的交互次数，能够实现更快速的I/O。

解决输出延迟

~~~c
printf("something or other");
fflush(stdout); // 立即将缓冲区内容写出
~~~

> 在通常的编程测试中，stdout默认是行缓冲模式。

~~~c
// 没有\n触发自动刷新，会暂停五秒后再执行printf
#include <stdio.h>
#include <unistd.h> // for sleep

int main() {
    // 1. 没有 \n，数据进入缓冲区，但不会自动刷新
    printf("等待 5 秒，你可能看不到我...");
    
    // 2. 暂停执行
    sleep(5); 

    // 3. 补上 \n
    printf("\n我现在出来了。\n"); 
    return 0;
}
~~~

~~~c
// 有\n触发自动刷新，会先执行printf后等待五秒后执行另一个printf
#include <stdio.h>
#include <unistd.h> // for sleep

int main() {
    printf("等待 5 秒，你应该能看到我...\n");
    
    // 2. 暂停执行
    sleep(5); 

    // 3. 补上 \n
    printf("\n我现在出来了。\n"); 
    return 0;
}
~~~

> stdin是类似的，都是行缓冲模式。

- 对于输入流来说，只有缓冲区空了，程序才会从外部设备获取新的数据来填充它。
- 对于输出流来说，只有缓冲区满了，缓冲区中的数据才会被写入到外部设备，进行刷新。

#### 一、文本流(Text Stream)

流分为两种，**文本(text)流** 和 **二进制(binary)** 流。文本流的有些特性在不同的系统中可能不同。其中之一就是文本行的最大长度。标准规定至少允许254个字符。另一个可能不同的特性是文本行的结束方式。例如在***MS-DOS***系统中，文本文件约定以一个回车符和一个换行符（或称为行反馈符）结尾。但是***UNIX***系统只使用一个换行符结尾。

- 核心特点：字符翻译

文本流在数据传输中会引入一个**翻译层**，主要针对换行符(`\n`)：

|操作|C程序中的表示|操作系统/文件中实际存储的表示|
|:---:|:---:|:---:|
|写入(`fprintf`,`fputs`)|写入一个换行符(`\n`)|操作系统可能会将其翻译成一个或多个字符序列(例如Windows下的`\r\n`)|
|读取(`fscanf`,`fgets`)|从文件中读取多个字符序列（例如Windows下的`\r\n`）|C运行时库会将这个序列翻译回单个换行符(`\n`)供C程序使用。|

- 优点：保持了跨平台的**文本文件兼容性**。可以在任何系统上打开并正确显示用文本模式创建的文件。
- 缺点：传输的数据量可能与文件中实际存储的字节数**不一致**（因为翻译），且性能略低于二进制流。

#### 二、二进制流(Binary Stream)

二进制流中的字节将完全根据程序编写它们的形式写入到文件或设备中，而且完全根据它们从文件或设备读取的形式读入到程序中。并未做任何改变。

- 核心特点：无翻译

二进制流是**透明的**，它绕过了C运行时库的任何翻译：

|操作|C程序中的表示|操作系统/文件中实际存储的表示|
|:---:|:---:|:---:|
|写入(`fwrite`)|写入N个字节|文件中精确存储N个字节，不做任何修改。|
|读取(`fread`)|读取N个字节|从文件中读取N个原始字节到内存中，不做任何修改。|

- 优点：1.精确性：文件中的字节数与程序处理的字节数总是精准匹配。适用于存储图片、音频、结构体、加密数据等。2.性能：由于没有翻译开销，I/O操作通常更快。
- 缺点：**缺乏可移植性**。如果直接将C结构体写入二进制文件，文件将依赖于机器的字节序(Endianness)和数据类型大小。

#### 三、编程实现上的区别

在C语言中，你通过`fopen()`函数的第二个参数（模式字符串）来指定使用哪种流模式：

|模式|描述|
|:--|:--|
|`"r"`/`"w"`/`"a"`|文本模式(默认)|
|`"rb"`/`"wb"`/`"ab"`|二进制模式(加`b`)|

### 15.4.2 文件

`stdio.h`所包含的声明之一就是`FILE`结构。`FILE`是一个数据结构，用于访问一个流。如果同时激活几个流每个流都有一个相应的`FILE`与它关联。

- 对于每个ANSI C程序，运行时系统必须提供至少三个流：**标准输入(standard input)**、**标准输出(standard output)**和**标准错误(standard error)**。名字分别为`stdin`、`stdout`、`stderr`。这三个流都是指向`FILE`结构的指针。

> 标准输入是缺省输入来源，标准输出是缺省输出设置，标准错误是缺省错误设置。通常标准输入为键盘设置，标准输出为终端或屏幕。
> 可以将标准输入和标准输出设置为其他设备。

### 15.4.3 标准I/O常量

`EOF`是许多函数的返回值，提示达到了文件尾。**EOF所选择的实际值比一个字符多几位，这是为了避免二进制被错误地解释为EOF。**

- 输入函数返回`int`类型：`getchar()`和`fgetc()`等函数被设计为返回`int`(32位或16位)，而不是`char`(8位)。
- EOF的值：一般为负整数`-1`。

|状态|返回值|位宽利用|
|:---:|:---:|:---:|
|成功读取有效字符|返回值是一个0到255之间的整数|仅使用了`int`的低8位来存储字符代码，其余位是0。|
|遇到文件结束(EOF)|返回值是一个负整数(-1)|`int`的所有位都被设置成-1的二进制表示(所有32位都是1)|

> 一个程序至少可以打开**FOPEN_MAX**个文件，至少是8。有一个常量**FILENAME_MAX**提示字符数组应该多大以便容纳编译器所支持的最长合法文件名。

## 15.5 流I/O总览

对于文件流或设备流

1. 使用`FILE*`将处于活动状态的文件选择使用。
2. 流通过调用`fopen`函数打开。为了打开一个流必须指定要访问的文件或设备以及他们的访问方式。`fopen`和操作系统验证文件或设备确实存在并初始化FILE结构。
3. 对文件或设备读取写入。
4. 最后调用`fclose`函数关闭流。防止被再次访问，保证任何存储于缓冲区的数据被正确地写到文件中，并且释放FILE结构使它可以用于另外的文件。

> 标准流不需要打开或关闭。

**执行字符、文本行和二进制I/O的函数**

|数据类型|输入|输出|描述|
|:---|:---|:---|:---|
|字符|getchar|putchar|读取(写入)单个字符|
|文本行|gets/scanf|puts/printf|文本行未格式化的输入(输出)/格式化的输入(输出)|
|二进制数据|fread|fwrite|读取(写入)二进制数据|

> 带f前缀的输入输出函数可以用于所有流。

## 15.6 打开流

`fopen`函数用于创建并打开一个新流。

~~~c
FILE *fopen(char const *name, char const *mode);
~~~

`mode`参数上面编程实现给出
> 在mode 中添加 `a+`表示该文件打开用于更新，并且流既允许读也允许写。
> 但是在向流写入数据前必须调用其中一个文件定位函数(`fseek`、`fsetpos`、`rewind`)。
> 在写后又想读取数据首先必须调用`fflush`函数或文件定位函数之一。

应该始终检查`fopen`函数的返回值！如果函数失败，它会返回一个NULL值。

~~~c
FILE *input;
input = fopen("data3", "r"); // 文本只读
if (input == NULL)
{
  perror("failed to open file data3, Quitting...");
  exit(EXIT_FAILURE);
}
// 在终端报错类似：data3: No such file or directory
~~~

`freopen`函数用于打开（或重新打开）一个特定的文件流。原型如下：

~~~c
FILE* freopen(char const *filename, char const *mode, FILE *stream);
~~~

最大的作用是改变流的输入输出
> `freopen`函数在执行成功时，它返回的指针和传入的第三个参数`stream`是同一个指针，即它们都指向同一个`FILE`结构体。

~~~c
#include <stdio.h>
#include <stdlib.h> // 用于 EXIT_FAILURE

int main() {
    // 1. 初始状态：printf 输出到终端
    printf("--- 程序开始 ---\n");
    printf("这条信息应该显示在终端上。\n");

    // =======================================================
    // 2. 使用 freopen 重定向标准输出 (stdout)
    //    参数: 
    //      "log.txt": 新的文件名
    //      "w": 写入模式 (会覆盖文件原有内容)
    //      stdout: 要重定向的目标流
    // =======================================================
    FILE *original_stdout = freopen("log.txt", "w", stdout);

    // 检查重定向是否成功
    if (original_stdout == NULL) {
        // 如果重定向失败，通常是文件路径问题
        perror("freopen 失败");
        return EXIT_FAILURE;
    }

    // 3. 重定向后的状态：printf 输出到 log.txt 文件
    printf("这条信息不会显示在终端，而是写入 log.txt。\n");
    printf("freopen 成功地将标准输出改变了方向。\n");
    printf("--- 程序结束 ---\n");

    // 4. 关闭文件流并返回
    // freopen 已经关闭了旧的 stdout（终端），并打开了新的文件。
    // 程序结束时会自动关闭 log.txt，但明确关闭是好习惯
    if (fclose(stdout) != 0) {
        perror("关闭 stdout 失败");
    }
    
    // 注意：程序不会输出任何成功信息到终端，因为它被重定向了
    return 0;
}
~~~

## 15.7 关闭流

使用`fclose`关闭流

~~~c
int fclose(FILE *f);
~~~

`fclose`函数在文件关闭前刷新缓冲区。执行成功返回0值，否则返回EOF。
> 是否应该对fclose(或其他操作)进行错误检查？
>>
>> 1. 如果操作成功应该执行什么？  
>> 2. 如果操作失败应该执行什么？
>>
>>> 如果这两个答案是不同的，应该进行错误检查；如果是相同的，跳过错误检查才是合理的。

## 15.8 字符I/O

字符输入

~~~c
int fgetc(FILE *stream);
int getc(FILE *stream);
int getchar(void);
~~~

字符输出

~~~c
int fputc(int character,FILE* stream);
int putc(int character,FILE* stream);
int putchar(int character);
~~~

### 15.8.1 字符I/O宏

除了`fgetc`和`fputc`其他都是`#define`指令定义的宏，两种实现为了不同的场景，但是实际两种操作相差甚微。

### 15.8.2 撤销字符I/O

在流读取时总有一个不想读取的字符，但使用流逐个读取没有条件判断一定会读到一个不满足的字符，为了不丢弃这个字符，使用`ungetc`函数将这个字符从参数中推回stream中。

> `ungetc`函数主要的应用场景是**超前扫描**或**令牌解析**

读取一个整数，直到遇到非数字或EOF

~~~c
#include <stdio.h>
#include <ctype.h> // 用于 isdigit()

// 函数：从标准输入读取一个整数
int read_integer(FILE *stream) {
    int ch;
    int value = 0;

    // 1. 跳过开始的空白字符
    do {
        ch = fgetc(stream);
    } while (isspace(ch));

    // 2. 检查第一个非空白字符是否是数字
    if (!isdigit(ch)) {
        // 如果第一个字符不是数字，就把它放回流中
        if (ch != EOF) {
            ungetc(ch, stream);
        }
        return 0; // 或者返回一个错误代码
    }

    // 3. 读取数字部分
    while (isdigit(ch)) {
        value = value * 10 + (ch - '0');
        ch = fgetc(stream); // 超前读取下一个字符
    }

    // 4. 【核心步骤】
    // 循环停止是因为 ch 遇到了第一个非数字字符（或者 EOF）。
    // 这个非数字字符（例如一个字母 'A'）不属于当前的整数，它属于流的下一个部分。
    if (ch != EOF) {
        ungetc(ch, stream); // 将这个超前读取的字符放回流中
    }
    
    return value;
}

int main() {
    int num1, num2;
    
    printf("请输入数据 (例如: 123ABC456)\n");
    
    // 假设用户输入: 123ABC456\n

    // 第一次调用：读取 123
    num1 = read_integer(stdin); 
    printf("读取到第一个整数: %d\n", num1); 
    // 此时字符 'A' 被 read_integer 读走后又放回了 stdin。

    // 第二次调用：读取下一个字符，它将是 'A'
    printf("下一个字符是: %c\n", fgetc(stdin)); 
    
    // 第三次调用：读取 456
    // read_integer 会消耗 'B', 'C'，直到 456
    // num2 = read_integer(stdin); // 错误：会消耗 'B', 'C'
    
    printf("流中剩余字符:\n");
    // 清空并打印剩余部分，以验证 ungetc 后的字符 'A' 确实被读取了
    int ch;
    while ((ch = getchar()) != EOF) {
        putchar(ch);
    }
    
    return 0;
}
~~~

> 退回字符和流的当前位置有关，如果使用`fseek`,`fsetpos`或`rewind`函数改变了流的位置，所有退回的字符都要被丢弃。
>
## 15.9 未格式化的行I/O

行I/O可以使用两种方式执行————未格式化的和格式化的。这两种形式都用于操作字符串。

~~~c
char *fgets(char* buffer, int buffer_size, FILE *stream);
char *gets(char *buffer);

int fputs(char const *buffer, FILE* stream);
int puts(char const *buffer);
~~~

`fgets`从指定的stream读取字符并把它们复制到buffer中。在读取到换行符或缓冲区内存储的字符达到`buffer_size - 1`时停止读取。

> gets在C99后不推荐使用，C11后已经完全抛弃！在任何情况下`fgets`都会在末尾添加NUL字节表示字符串结束；puts会自动在尾部添加换行符；fputs不会添加换行符。

常见错误

~~~c
#include <stdio.h>

int main() {
    char data[5];

    // 错误操作：数组只有5个字节，但写入了6个字符，没有留空间给 '\0'
    // 实际上是写入了 'H', 'e', 'l', 'l', 'o'，'\0' 溢出到了 data 之外
    // 但在这个例子中，我们假设用 memcpy 或其它方式精确地填满 data，没有 \0
    data[0] = 'A';
    data[1] = 'B';
    data[2] = 'C';
    data[3] = 'D';
    data[4] = 'E'; // <--- 数组已满，没有空终止符

    printf("尝试写入一个非终止字符串...\n");

    // fputs 将会从 data[0] 开始一直读到内存中找到 \0 为止
    // 这将是 UB！
    fputs(data, stdout); 

    printf("\n程序可能崩溃，或者输出了乱码。\n");

    return 0;
}
~~~

> `fgets`第二个参数虽然能指定传入的元素个数，但是如果参数过大溢出它的缓冲区，`fgets`不会引起错误。

一个例子

~~~c
/*
  把标准输入读取的文本行逐行复制到标准输出。
*/
#include <stdio.h>

#define MAX_LINE_LENGTH 1024

void copylines(FILE *input, FILE *output)
{
  char buffer[MAX_LINE_LENGTH];
  
  while( fgets(buffer, MAX_LINE_LENGTH, input) != NULL)
    fputs(buffer, output);
}
~~~

## 15.10 格式化的行I/O

- “格式化的行I/O”这个名字从某种意义上并不准确，因为 `scanf` 和 `printf` 函数家族并不仅限于单行。它们也可以在行的一部分或多行上执行I/O操作。

### 15.10.1 scanf家族

~~~c
int fscanf(FILE *stream, char const *format, ...);
int scanf(char const *format, ...);
int sscanf(char const *string, char const *format, ...);
~~~

***函数无法验证对应的指针参数输入是否是对应格式代码的正确类型。函数会假定它们是正确的，于是继续执行并使用它们。***

### 15.10.2 scanf格式代码

- **空白字符**————与输入中的零个或多个空白字符相匹配，在处理过程中将被忽略。
- **格式代码**————它们指定函数如何解释接下来的输入字符。
- **其他字符**————当任何其他字符出现在格式字符串时，下一个输入字符必须与它匹配。如果匹配，该输入字符随后被丢弃；如果不匹配，函数就不再读取直接返回。

#### 格式代码格式

- 格式代码都是以一个百分号开头，后面可以是
  - 一个可选的星号（赋值抑制符）
  - 一个可选的宽度
  - 一个可选的限定符
  - 格式代码

- 可选的星号具体使用方法
假输入流中有数据：`Item_A: 100, Item_B: 200`

~~~c
int val_b;
// 使用 %*s 跳过 "Item_A:"
// 使用 %*d 跳过 100
// 使用 %*c 跳过 逗号和空格
// Item_B: 选项被匹配后丢弃
// 只读取Item_B 的值
scanf("%*s %*d, Item_B: %d",&val_b);

// 结果：val_b 将被赋值为 200，流中的 "Item_A: 100, "部分被跳过
~~~

#### scanf限定符

| 限定符 | 作用 (用于指定参数大小) | 适用的类型码 | 对应的 C 类型 |
| :---: | :--- | :--- | :--- |
| **`h`** | 读取短整数（Half word size） | `d`, `i`, `u`, `o`, `x`, `n` | `short int`, `unsigned short int` |
| **`hh`** | 读取字符大小的整数 | `d`, `i`, `u`, `o`, `x`, `n` | `signed char`, `unsigned char` |
| **`l`** | 读取长整数 | `d`, `i`, `u`, `o`, `x`, `n` | `long int`, `unsigned long int` |
| **`ll`** | 读取超长整数 | `d`, `i`, `u`, `o`, `x`, `n` | `long long int`, `unsigned long long int` |
| **`l`** | 读取双精度浮点数 | `f`, `e`, `g`, `a` | `double` (注意：`%f` 读取 `float`) |
| **`L`** | 读取超长双精度浮点数 | `f`, `e`, `g`, `a` | `long double` |
| **`z`** | 读取 `size_t` 类型（无符号） | `d`, `i`, `u`, `o`, `x`, `n` | `size_t` |
| **`j`** | 读取最大宽度整数 | `d`, `i`, `u`, `o`, `x`, `n` | `intmax_t`, `uintmax_t` |
| **`t`** | 读取指针差值类型 | `d`, `i`, `u`, `o`, `x`, `n` | `ptrdiff_t` |

一个不能总是正确接收参数的`fscanf()`

~~~c
  int a, b, c;
  a = b = c = 0;
  FILE *f = (FILE *)fopen("./test.txt", "r+");
  FILE *f1 = (FILE *)fopen("./testout.txt", "r+");
  if (f == NULL || f1 == NULL) {
    perror("Failed to read from stream test.txt.\n");
    return EXIT_FAILURE;
  }

  if (fscanf(f, "%d %d", &a, &b) ==
      2) { // 这里如果接收的不是两个整型变量就会导致循环终止，且fscanf跳过空白字符，
           // 所以它没有办法验证这两个值是位于同一行还是分属于两个不同的输入行
    fprintf(stdout, "Two number i got from stream f to stdout is %d - %d\n", a,
            b);
  }

  // 重置文件指针到文件开头
  rewind(f);

  int nfield = fscanf(f, "%4d %4d %4d", &a, &b, &c);
  if (nfield == 2)
    fprintf(f1, "Two number i got from stream f to f1 is %d - %d", a, b);
  else if (nfield == 3)
    fprintf(f1, "Three number i got from stream f to f1 is %d - %d - %d", a, b,
            c);

  fclose(f1);
  fclose(f); 
~~~

一个更为可靠的方法读取这种类型的`fscanf()`

~~~c
#include <stdio.h>

#define BUFFER_SIZE 100

void function(FILE *input)
{
  int a, b, c, d, e;
  char buffer[BUFFER_SIZE];
  
  while (fgets(buffer, BUFFER_SIZE, input) != NULL){
    if (sscanf(buffer,"%d %d %d %d %d", &a, &b, &c, &d, &e) != 4)
    {
      fprintf(stderr,"Bad input skipped: %s", buffer);
      continue;
    }
  }
  // 处理这组输入
}
~~~

### 15.10.3 printf家族

~~~c
int fprintf(FILE *stream, char const *format, ...);
int printf(char const *format, ...);
int sprintf(char *buffer, char const *format, ...);
~~~

> `sprintf()`被认为是有缺陷的(不安全的)，主要因为它存在固有的缓冲区溢出(Buffer Overflow)风险。
>
> 当 buffer被设置为一个固定大小的缓冲区时会有可能超出限制，且无法阻止其**继续覆盖相邻的内存**。
>> C99 标准引入了 `snprintf` 解决`sprintf`的安全问题。

~~~c
int snprintf(char *str, size_t size, const char *format, ...);
~~~

### 15.10.4 printf 格式代码

**`printf`家族格式代码和`scanf`格式代码类似**

几个使用`printf`格式代码的例子

1. 用`printf`格式字符串

|格式代码|转换后的字符串|||
|:---:|:---:|:---:|:---:|
|%s|A|ABC|ABCDEFGH|
|%5s|[][][][]A|[][]ABC|ABCDEFGH|
|%.5s|A|ABC|ABCDE|
|%5.5s|[][][][]A|[][]ABC|ABCDE|
|%-5s|A[][][][]|ABC[][]|ABCDEFGH|

> `%.5s` 中的`.5`是限制精度(限制字符数)，`%.5d`中的`.5`是限制宽度的，而`%5d`是限制精度(限制数字位数)。

1. 用`printf`格式化整数

|格式代码|转换后的数值||||
|:---:|:---:|:---:|:---:|:---:|
|%d|1|-12|12345|123456789|
|%6d|[][][][][]1|[][][]-12|[]12345|123456789|
|%.4d|0001|-0012|12345|123456789|
|%6.4d|[][]0001|[]-0012|[]12345|123456789|
|%-4d|1[][][][]|-12[]|12345|123456789|
|%04d|0001|-012|12345|123456789|
|%+d|+1|-12|+12345|+123456789|

1. 用`printf`格式化浮点数

|格式代码|转换后的数值||||
|:---:|:---:|:---:|:---:|:---:|
||1|.01|.00012345|12345.6789|
|%f|1.000000|0.010000|0.000123|12345.678900|
|%10.2f|[][][][][][]1.00|[][][][][][]0.01|[][][][][][]0.00|[][]12345.67|
|%e|1.000000e+00|1.000000e-02|1.234500e-04|1.234568e+04|
|%.4e|1.0000e+00|1.0000e-02|1.2345e-04|1.2346e+04|
|%g|1|0.01|0.00012345|12345.7|

1. 用`printf`格式化大浮点值

|格式代码|转换后的数值|
|:---:|:---:|
||6.023e23|
|%f|6.02299999999999975882752.000000|
|%10.2f|6.02299999999999975882752.000000|
|%e|6.023000e+23|
|%.4e|6.0230e+23|
|%g|6.023e+23|

## 15.11 二进制I/O

- 把数据写到文件效率最高的方法是用二进制形式写入。二进制输出**避免了在数值转换为字符串过程中所涉及的开销和精度损失**。但二进制数据并非人眼所能阅读，所以这个技巧只有**当数据将被另一个程序按顺序读取时**才能使用。

`fread`函数用于读取二进制数据，`fwrite`函数用于写入二进制数据。

~~~c
size_t fread(void *buffer, size_t size, size_t count, FILE *stream);
size_t fwrite(void *buffer, size_t size, size_t count, FILE* stream);
~~~

`buffer`是一个指向用于保存数据的内存位置的指针，`size`是缓冲区中每个元素的字节数，`count`是读取或写入的元素数，当然`stream`是数据读取或写入的流。

一个例子

~~~c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

// 1. 定义一个存储数据的结构体
typedef struct {
  int id;
  char name[20];
  float salary;
} Employee;

// 辅助函数：打印结构体内容
void print_employee(const Employee *e) // const *类型 指向常量的指针
{
  fprintf(stdout, "ID: %d, Name: %-20s, Salary: %.2f\n", e->id, e->name,
          e->salary);
}

// 定义文件名
#define DATA_FILE "employees.bin"

int main(void) {
  // 2. 准备数据：一个结构体数组
  Employee staff_data[] = {{101, "Alice Johnson", 60000.00f},
                           {102, "Bob Smith", 75000.50f},
                           {103, "Charlie Brown", 50000.25f}};
  const size_t num_employees = sizeof(staff_data) / sizeof(Employee);

  // ------------------------------------------------------------------------
  // 第一步：使用 fwrite 将结构体数组写入文件（输出流）
  // ------------------------------------------------------------------------

  FILE *output_file = fopen(DATA_FILE, "wb"); // write binary
  if (output_file == NULL) {
    perror("Error opening output file");
    return EXIT_FAILURE;
  }

  // fwrite(ptr, size, count, stream)
  // ptr: 要写入的数据块的起始地址
  // size: 每个数据块的大小（这里是 Employee 结构体的大小）
  // count: 要写入的数据块的数量（这里是数组元素的数量）
  // stream: 文件流指针

  size_t written_count =
      fwrite(staff_data, sizeof(Employee), num_employees, output_file);

  if (written_count == num_employees) {
    fprintf(stdout, "成功将 %zu 个 Employee 记录写入文件：%s\n", written_count,
            DATA_FILE);
  } else {
    fprintf(stderr, "警告：写入失败或部分失败。\n");
  }

  fclose(output_file);

  // ------------------------------------------------------------------------
  // 第二步：使用 fread 从文件中读取结构体数组（输入流）
  // ------------------------------------------------------------------------

  FILE *input_file = fopen(DATA_FILE, "rb"); // read binary
  if (input_file == NULL) {
    perror("Error opening input file for reading");
    return EXIT_FAILURE;
  }

  // 3. 准备接收数据的缓冲区（创建一个新的数组来存储读取的数据）
  Employee read_data[num_employees];

  fprintf(stdout, "\n从文件读取数据并输出到标准输出(stdout)：\n");
  printf("--------------------------------------------------------\n");

  // fread(ptr, size, count, stream)
  // ptr: 存储读取数据的内存地址
  // size: 每个数据块的大小（这里是 Employee 结构体的大小）
  // count: 尝试读取的数据块的数量
  // stream: 文件流指针
  size_t read_count =
      fread(read_data, sizeof(Employee), num_employees, input_file);

  if (read_count == num_employees) {
    printf("成功读取 %zu 个 Employee 记录。\n", read_count);

    // 4. 将读取到的结构体数组元素输出到标准输出
    for (size_t i = 0; i < read_count; i++) {
      printf("Record %zu: ", i + 1);
      print_employee(&read_data[i]);
    }
  } else {
    fprintf(stderr, "警告：尝试读取 %zu 个记录，但只读取了 %zu 个。\n",
            num_employees, read_count);
  }

  fclose(input_file);

  // 清理创建的文件（可选）
  // remove(DATA_FILE);

  return EXIT_SUCCESS;
}
~~~

## 15.12 刷新和定位数据

当我们需要立即把输出缓冲区的数据进行物理写入时，应该使用`fflush`这个函数。例如，调用`fflush`函数保证调试信息实际打印出来，而不是保存在缓冲区中直到以后才打印。

~~~c
int fflush(FILE *stream);
~~~

在正常情况下，数据以线性的方式写入，这意味着后面写入的数据在文件中的位置是在以前所有写入数据的后面。C同时支持随机访问I/O，也就是以任意顺序访问文件的不同位置。
`ftell`和`fseek`函数支持上面的操作。

~~~c
long ftell(FILE *stream);
int fseek(FILE *stream, long offset, int from);
~~~

`ftell`返回流的当前位置，也就是说，下一个读取或写入将要开始的位置距离文件起始位置的偏移量(offset)。这个函数允许你保存一个文件的当前位置，这样你可能在将来回到这个位置。在二进制流中这个值就是当前位置距离文件其实位置之间的字节数。

在文本流中这个值表示一个位置，但它并不一定准确地表示当前位置和文件起始位置之间的字符数，因为有些系统将对行末字符进行翻译转换。但是，`ftell`函数返回的值总是可以用于`fseek`函数中，作为一个距离文件起始位置的偏移量。

`fseek`函数运行你在一个流中定位。这个操作将改变下一个读取或写入操作的位置。它的第一个参数是需要改变的流，第二个和第三个参数标识文件中需要定位的位置。

试图定位到一个文件的起始位置之前是一个错误。定位到文件尾之后并进行写入将扩展这个文件。定位到文件尾之后并进行读取将导致返回一条“到达文件尾”的信息。在二进制流中，从**SEEK_END**进行定位可能不被支持，所以应该避免。在文本流中，如果from是**SEEK_CUR**或**SEEK_END**，offset必须是零。如果from是**SEEK_SET**，offset必须是一个从同一个流中以前调用`ftell`所返回的值。

|如果from是|你将定位到...|
|:---:|:---:|
|SEEK_SET|从流的起始位置起offset个字节，offset必须是一个非负值|
|SEEK_CUR|从流的当前位置起offset个字节，offset可正可负|
|SEEK_END|从流的尾部位置起offset个字节，offset可正可负。如果是正值它将定位到文件尾的后面|

另外还有三个额外的函数，用一些限制更严的方式指执行相同的任务。

~~~c
void rewind(FILE *stream);
int fgetpos(FILE *stream, fpos_t *position);
int fsetpos(FILE *stream, fpos_t const *position);
~~~

`rewind`函数将读/写指针设置回指定流的起始位置。它同时清除流的错误提示标志。`fgetpos`和`fsetpos`函数分别是`ftell`和`fseek`函数的替代方案。

它们的主要区别在于这对函数接受一个指向`fpos_t`的指针作为参数。`fgetpos`在这个位置存储文件的当前位置，`fsetpos`把文件位置设置为存储在这个位置的值。

一个使用这些定位函数的例子

~~~c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define FILENAME "demo_file.txt"

int main(void) {
  FILE *fp;

  // ===================================================================
  // 1. 打开文件并写入数据 (使用 "w+" 模式允许读写)
  // ===================================================================

  fp = fopen(FILENAME, "w+");
  if (fp == NULL) {
    perror("Error opening file");
    return EXIT_FAILURE;
  }

  printf("--- 开始写入和控制文件指针 ---\n");

  // 写入第一个字符串
  fputs("ABCDEFGHIJKLMNOP", fp);
  printf("1. 写入 'ABCDEFGHIJKLMNOP'\n");

  // -- fflush 示例 --
  // 尽管没有换行符，fflush 也会强制将数据从缓冲区写入磁盘
  fflush(fp); // fputs没有写入换行符，这里本来fputs的
              // 第一个参数写入到缓冲区还未到fp中，但是
              // 执行fflush可以强制从缓冲区写入磁盘
  printf("2. 使用fflush 强制刷新数据到文件。\n");

  // -- ftell 和 fgetpos 示例 --

  long initial_pos = ftell(fp); // 记录当前位置 （通常是16，即字符串末尾）
  fpos_t saved_fpos;
  fgetpos(fp, &saved_fpos); // 记录当前位置到 fpos_t 结构体中

  printf("3. 当前文件指针位置(ftell): %ld\n", initial_pos);

  // 写入第二个字符串
  fputs("XYZ", fp);
  printf("4. 写入 'XYZ'。\n");

  // -- fssek 示例 --
  // fseek(stream, offset, origin);
  // origin: SEEK_SET 从文件开头， SEEK_CUR 从当前位置，SEEK_END 从文件末尾

  // 将指针 重新定位到第五个字符(索引5)
  fseek(fp, 5, SEEK_SET);
  printf("5. 使用 fseek(5, SEEK_SET) 跳转到索引5。\n");

  // 写入新数据 ，会覆盖掉原有的 'FGHI'
  fputs("1234", fp);
  printf("6. 写入 '1234' (覆盖掉原有的 'FGHI').\n");

  // -- fsetpos 示例 --

  // 将指针重新定位回之前 fgetpos 记录的位置 (initial_pos = 16)
  fsetpos(fp, &saved_fpos);
  printf("7. 使用 fsetpos 跳转回保存的位置(%ld)。\n", initial_pos);

  // 写入数据，会在 16 处 继续 写入
  fputs("999", fp);
  printf("8. 写入'999'。\n");

  // --- rewind 示例 ---
  rewind(fp);
  printf("9. 使用 rewind 将指针 重置到文件开头。\n");

  // ===================================================================
  // 2. 从开头读取最终文件内容
  // ===================================================================

  printf("\n--- 读取文件内容进行验证 ---\n");
  char buffer[50];

  // 尝试从头读取整个文件
  if (fgets(buffer, sizeof(buffer), fp) != NULL)
    printf("文件最终内容：%s\n", buffer);
  else
    printf("读取文件失败\n");

  fclose(fp);

  return EXIT_SUCCESS;
}
~~~

## 15.13 改变缓冲方式

两种改变流缓冲方式的函数

~~~c
void setbuf(FILE* stream, char *buf);
int setvbuf(FILE* stream, char *buf, int mode, size_t size);
~~~

`setbuf` 设置了另一个数组，用于对流进行缓冲。这个数组的字符长度必须为BUFSIZ(在stdio.h中定义)。为一个流自行指定缓冲区可以防I/O函数库为它动态分配一个缓冲区。如果用一个NULL参数调用这个函数，`setbuf`函数将关闭流的所有缓冲方式。字符准确地将程序所规定的方式进行读取和写入。

> 一个流缓冲区使用一个自动数组是很危险的。

`setvbuf`函数更为通用。`mode`参数用于指定缓冲的类型。**_IONBF**指定一个不缓冲的流，**_IOLBF**指定一个行缓冲流，**_IOLBF**指定一个行缓冲流。所谓行缓冲，就是每当一个换行符写入到缓冲区时，缓冲区便进行刷新。

`buf`和`size`参数用于指定需要使用的缓冲区。如果`buf`为NULL，那么`size`的值必须是0。
一般而言，最好用一个长度为BUFSIZ的字符数组作为缓冲区。

一个例子

~~~c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define FILENAME "big_buffer_test.txt"
#define CUSTOM_BUF_SIZE 4096 * 4 // 16 KB 的缓冲区大小

int main(void) {
  FILE *fp;
  char custom_buffer[CUSTOM_BUF_SIZE]; // 声明自定义的内存缓冲区

  // 1. 打开文件进行写入
  fp = fopen(FILENAME, "w");
  if (fp == NULL) {
    perror("Error opening file.");
    return EXIT_FAILURE;
  }

  // 2. 使用 setvbuf 设置为全缓冲模式， 并指定自定义缓冲区
  // 目标：只有当 16KB 缓冲区写满时，才进行一次磁盘写入操作
  int result = setvbuf(fp, custom_buffer, _IOFBF, CUSTOM_BUF_SIZE);

  if (result != 0) {
    fprintf(stderr, "setvbuf 设置失败!\n");
    fclose(fp);
    return EXIT_FAILURE;
  }

  printf("文件流已设置为 %zu 字节的全缓冲模式。\n", (size_t)CUSTOM_BUF_SIZE);

  // 3. 写入数据
  for (int i = 0; i < 100; i++) {
    fprintf(fp, "Line %d : This is buffered data.\n", i);
  }

  printf("数据已写入缓冲区，但可能尚未写入磁盘。\n");
  // 此时，数据仍在内存中的 custom_buffer 中，直到缓冲区满或关闭。

  // 4. 关闭文件(关闭时会自动冲刷缓冲区)
  fclose(fp);
  printf("文件已关闭，缓冲区内容已冲刷到磁盘。\n");

  // remove(FILENAME); // 清理原文件(可选)

  return EXIT_FAILURE;
}
~~~

## 15.14 流错误函数

下面的函数用于判断和管理流的状态

~~~c
int feof(FILE *stream);
int ferror(FILE *stream);
void clearerr(FILE* stream);
~~~

如果流当前处于文件尾，`feof`函数返回真。这个状态可以通过对流执行`fseek`、`rewind`或`fsetpos`函数来清除。`ferror`函数报告流的错误状态，如果出现任何读/写错误函数就返回真。最后`clearerr`函数对指定流的错误标志进行重置。

一个例子

~~~c
#include <stdio.h>
#include <stdlib.h>

#define FILENAME "status_demo.txt"

// 辅助函数：检查并报告文件状态
void report_status(FILE *fp, const char *message);

int main(void) {
  FILE *fp = NULL;
  int c;

  // 1. 创建并初始化文件
  fp = fopen(FILENAME, "w");
  if (fp == NULL)
    return EXIT_FAILURE;
  fputs("Hello C I/O.\n", fp);
  fclose(fp);

  // ===================================================================
  // 步骤 A: 正常读取直到 EOF (feof 示例)
  // ===================================================================

  fp = fopen(FILENAME, "r");
  if (fp == NULL)
    return EXIT_FAILURE;

  printf("1. 首次打开文件，指针位于开头。\n");
  report_status(fp, "状态A - 读取前");

  // 读取所有字符直到文件结束
  while ((c = fgetc(fp)) != EOF) {
    // 确保所有数据都被消耗
  }

  printf("\n2. 已读取文件所有内容(fgetc 返回 EOF)。\n");

  // 此时，文件指针越界，EOF标志被设置
  report_status(fp, "状态B - 读取到 EOF 之后");

  // ===================================================================
  // 步骤 B: 制造错误并清除 (ferror 和 clearerr 示例)
  // ===================================================================

  // 使用 fseek 强制将指针移动到文件末尾（但文件仍然是只读模式）
  // 尝试在只读文件上写入数据，在某些系统上会设置错误标志。
  fseek(fp, 0, SEEK_END);

  // 尝试写入数据，由于文件以 "r" 模式打开（只读），这将失败，并设置错误标志
  // 注意：虽然不能写入，但 ferror 通常在尝试一个非法操作后被设置。
  // 在本例中，我们尝试在只读文件上使用 fputc，它会失败并设置 ferror 标志。
  c = fputc('X', fp);

  // 检查 fputc 是否失败(通常返回 EOF)
  if (c == EOF) {
    printf("\n3. 尝试在只读流上写入数据(fputc)失败。\n");
  }

  // 此时，错误标志 ferror 被设置
  report_status(fp, "状态C - 尝试非法写入后");

  // clearerr 示例
  clearerr(fp);
  printf("4. 使用 clearerr() 清除了 EOF 和错误标志。\n");

  report_status(fp, "状态D - clearerr() 之后");

  fclose(fp);
  remove(FILENAME); // 清理文件

  return EXIT_FAILURE;
}

void report_status(FILE *fp, const char *message) {
  printf("\n--- %s ---\n", message);

  // feof(fp): 检测是否到达文件末尾
  if (feof(fp)) {
    printf("FE_EOF: 文件流已到达文件末尾 (EOF)。\n");
  } else {
    printf("FE_EOF: 文件流未到达文件末尾。\n");
  }

  // ferror(fp)：检测是否发生了 I/O 错误
  if (ferror(fp)) {
    printf("F_ERROR: 文件流发生 I/O 错误。\n");
  } else {
    printf("F_ERROR: 文件流状态正常。\n");
  }
}
~~~

## 15.15 临时文件

使用`tempfile()`函数创建一个以`wb+`模式打开的文本文件用来临时保存数据。当程序结束时这个文件便被删除`自动被执行remove()`函数。

~~~c
FILE *tmpfile(void);
~~~

> 如果想要文件以只读模式打开或不以`wb+`模式打开必须使用`fopen()`函数操作

可以使用`tmpnam()`函数为临时文件创建一个文件名
> tmpnam() 仅仅是生成一个唯一的文件名字符串，但不创建文件。你需要手动使用 fopen() 来创建和打开文件，并负责在程序结束时手动删除它。且**tmpnam**不安全！

~~~c
char *tmpnam(char *name);
~~~

两个例子

~~~c
# include <stdio.h>
# include <stdlib.h>
# include <string.h>
int main(void) {
  FILE *tmp_fp;
  char write_data[] = "Temporary data buffer";
  char read_buffer[100];

  // 1. 创建临时文件流
  // FILE* tmpfile(void);
  tmp_fp = tmpfile();

  if (tmp_fp == NULL) {
    perror("Failed to open tmpfile.\n");
    return EXIT_FAILURE;
  }

  printf("成功创建临时文件流。该文件将在程序退出时自动删除。\n");

  // 2. 写入数据到临时文件
  if (fputs(write_data, tmp_fp) != EOF) {
    printf("写入数据成功：\"%s\"\n", write_data);
  } else {
    perror("Error writing to temporary file");
  }

  // 3. 将文件指针重置到开头
  rewind(tmp_fp);

  // 4. 从临时文件读取数据
  if (fgets(read_buffer, sizeof(read_buffer), tmp_fp) != NULL) {
    printf("从临时文件读取数据：\"%s\"\n", read_buffer);
  } else {
    perror("Error reading from temporary file");
  }

  // 5. 关闭文件流
  // 当文件流关闭时，操作系统会自动删除这个临时文件

  if (fclose(tmp_fp) == 0) {
    printf("\n临时文件流关闭成功，临时文件已被删除。\n");
  } else {
    perror("Error closing temporary file");
  }

  return EXIT_SUCCESS;
}
~~~

~~~c
# include <stdio.h>
# include <stdlib.h>
# include <string.h>
# include <time.h>

int main(void) {
  char
      temp_filename[L_tmpnam]; // L_tmpnam 是 <stdio.h> 中的宏，保证缓冲区足够大
  FILE *fp;

  // 1. 生成一个唯一的文件名
  // 如果传入NULL， tmpnam 会使用 内部静态缓冲区，但我们使用局部数组更安全
  if (tmpnam(temp_filename) != NULL) {
    printf("生成的临时文件名是：%s\n", temp_filename);
  } else {
    fprintf(stderr, "tmpnam failed to generate temporary file.");
    return EXIT_FAILURE;
  }

  // 2. 手动创建和打开文件
  fp = fopen(temp_filename, "w");
  if (fp == NULL) {
    perror("Error opening the generated temporary file");
    return EXIT_FAILURE;
  }

  printf("手动创建并打开了文件。\n");

  // 3. 写入和关闭文件...
  fprintf(fp, "This is manually managed temporary data.\n");
  fclose(fp);

  // 4. 【重要】手动删除文件
  if (remove(temp_filename) == 0) {
    printf("手动删除了临时文件：%s\n", temp_filename);
  } else {
    perror("Error deleting temporary file");
  }
  return EXIT_SUCCESS;
}
~~~

## 15.16 文件操纵函数

有两个函数用于操纵文件但不执行任何输入/输出操作。

~~~c
int remove(char const *filename);
int rename(char const *oldname, char const *newname);
~~~

`remove`函数删除一个指定的文件。如果当remove被调用时文件处于打开状态，其结果取决于编译器。

`rename`函数用于改变一个文件的名字，从**oldname**改为**newname**。如果已经有一个**newname**的文件存在，其结果取决于编译器。

> Tips
>>
>> 1. 调试用`printf`后加`fflush`
>> 2. 检查`fopen`返回值
>> 3. 改变文件的位置将**丢弃**任何被退回到流的字符
>> 4. 在使用`fgets`时指定较大的缓冲区
>> 5. `gets`,`sprintf`溢出检测
>> 6. 使用自动数组作为流的缓冲区时应多加小心
>> 7. 使用`mkstemp`替代`tmpnam`

# 🤤 标准函数库

## 16.1 整型函数

- 这组函数返回整型值。这些函数分为三类：**算术**、**随机数**和**字符串转换**。

### 16.1.1 算数<stdlib.h>

标准库函数包含了4个整型算数函数。

~~~c
int abs(int value);
long int labs(long int value);
div_t div(int numerator, int denominator);
ldiv_t ldiv(long int numer, long int denom);
~~~

`abs`函数返回它的参数的绝对值。如果其结果不能用一个整数表示，这个行为是未定义的。
`labs`用于执行相同的任务，但它作用的对象是长整数。

`div`函数把它的第二个参数(分母)除以第一个参数(分子)，产生商和余数，用一个`div_t`结构返回。这个结构包含下面两个字段。

~~~c
int quot; // 商
int rem; // 余数 
~~~

> 这两个字段并不一定以这个顺序出现。

### 16.2.1 随机数<stdlib.h>

两个函数可以产生**伪随机数(pseudo-random number)**。

~~~c
int rand(void);
void srand(unsigned int seed);
~~~

`rand` 返回一个 范围在 0 和 RAND_MAX(至少为32767)之间的伪随机数。
使用`srand` 获取随机数数列。

常见用法

~~~c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h> 

int main(void)
{
  int i, n;
  time_t t; // <time.h>
  
  n = 5;
  
  // 初始化随机数发生器 
  srand((unsigned) time(&t));

  // 输出 0 到 49 之间的 5 个随机数
  for (i = 0; i < n; i++)
  {
    printf("%d\n", rand() % 50);
  }

  return 0;
}
~~~

~~~c
#include <stdio.h>
#include <stdlib.h>
#include <time.h>
#define TRUE 1
#define FALSE 1

#define PRINT_ARR(ARR, SIZE)                                                   \
  do {                                                                         \
    int __i;                                                                   \
    for (__i = 0; __i < (SIZE); __i++) {                                       \
      printf("%-4d", (ARR)[__i]);                                              \
    }                                                                          \
    printf("\n");                                                              \
  } while (0)

void shuffle(int *deck, int n_cards);

int main(void) {

  int cards[10] = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};
  fputs("Before shuffle: ", stdout);
  PRINT_ARR(cards, sizeof(cards) / sizeof(cards[0]));

  shuffle(cards, 10);

  fputs("After shuffle: ", stdout);
  PRINT_ARR(cards, sizeof(cards) / sizeof(cards[0]));
  return 0;
}

void shuffle(int *deck, int n_cards) {
  int i;
  static int first_time = TRUE;

  // 如果尚未初始化，用当天的当前时间作为随机数发生器
  if (first_time) {
    first_time = FALSE;
    srand((unsigned int)time(NULL));
  }

  // 通过交换随机对的牌进行 "洗牌"
  for (i = n_cards - 1; i > 0; i -= 1) {
    int where;
    int temp;

    where = rand() % i;
    temp = deck[where];
    deck[where] = deck[i];
    deck[i] = temp;
  }
}
~~~

### 16.1.3 字符串转换 <stdlib.h>

字符串转换函数把字符串转换为数值。其中最简单的函数`atoi`和`atol`。

~~~c
int atoi(char const *string);
long int atol(char const *string);
long int strtol(char const *string, char **unused, int base);
unsigned long int strtoul(char const *string, char **unused, int base);
~~~

> 对于上面四个函数第一个参数来说，如果包含了前导空白字符将被跳过；函数把剩余的合法字符转换为指定类型的值。在尾部存在非法缀尾字符也将被忽略。

> `atoi`和`atol`分别把字符转换为整数和长整数值。`strtol`和`atol`一样把参数字符串转换为long。但是`strtol`保存一个指向转换值后面第一个字符的指针。如果函数的第二个参数并非NULL，这个指针便保存在第二个参数所指向的位置。`strtoul`和`strtol`的执行方式相同，但它产生一个无符号长整数。

> 后两个函数的第三个参数是转换所指向的基数(即进制数)。如果基数为0，任何在程序中用于书写整数字面值的形式都将被接收如`0x2af4`和`0377`。

~~~c
x = strtol("    590bear", next, 12);
~~~

上面的表达式x的值为9947，并把一个指向字母e的指针保存在next所指向的变量中。

#### strtol 和 strtoul 返回的错误值

|函数|返回值|
|:---:|:---:|
|strtol|如果值太大且为负数，返回LONG_MIN。如果值太大且为正数，返回LONG_MAX|
|strtoul|如果值太大返回ULONG_MAX|

## 16.2 浮点型函数

- 头文件`math.h`包含了函数库中剩余的数学函数的声明。这些函数的返回值以及绝大多数参数都是double类型。

几种错误

~~~c
1. 未包含头文件math.h

double x;
x = sqrt(5.5);

// 编译器在此之前未曾见到过sqrt函数的原型。

2. 定义域错误(domain error)

sqrt(-5.0);

3. 范围错误(range error)
exp(DBL_MAX);
// 因为结果值太大，这种情况函数会返回HUGE_VAL
~~~

### 16.2.1 三角函数<math.h>

标准函数库提供了常见的三角函数。

~~~c
double sin(double angle);
double cos(double angle);
double tan(double angle);
double asin(double value);
double acos(double value);
double atan(double value);
double atan2(double x, double y);
~~~

`sin`,`cos`和`tan`函数的参数是一个用弧度表示的角度，这些函数分别返回这个角度的正弦、余弦和正切值。

`asin`,`acos`和`atan`函数分别返回它们参数的反正弦、反余弦和反正切值。也会出现定义域错误(比如`asin`和`acos`的参数并不位于-1和1之间，就会出现一个定义域错误)。

### 16.2.2 双曲函数<math.h>

~~~c
double sinh(double angle);
double cosh(double angle);
double tanh(double angle);
~~~

这些函数分别返回它们的参数的双曲正弦、双曲余弦和双曲正切值。

### 16.2.3 对数和指数函数<math.h>

~~~c
double exp(double x);
double log(double x);
double log10(double x);
~~~

`exp`函数返回e值的x次幂，也就是$e^x$  
`log`函数返回x以e为底的对数，也就是自然对数${\ln x}$；`log10`函数返回x以10为底的对数，也就是${\lg x}$
> 任何一个以`b`为底的对数可以通过下面的公式转换

$log_b x = \frac{\ln x} {\ln b}$

$log_b x = \frac{\log_e x} {\log_e b}$
> 如果它们的参数为负数，两个对数函数都将出现定义域错误。

### 16.2.4 浮点表示形式<math.h>

~~~c
double frexp(double value, int *exponent);
double ldexp(double fraction, int exponent);
double modf(double value, double *ipart);
~~~

`frexp`函数计算一个**指数(exponent)**和**小数(fraction)**，这样$\text{fraction} \times 2^
\text{exponent} = \text{value}$，其中 $0.5 <= fraction < 1$，`exponent`是一个整数。exponent存储于第二个参数所指向的内存的位置。函数返回fraction的值。与它相关的函数`ldexp`的返回值是$\text{fraction} \times 2^\text{exponent}$也就是它原先的值。当需要在那些浮点格式不兼容的机器之间传递浮点数时，这些函数非常有用。

`modf`函数把一个浮点值分成整数和小数两个部分，每个部分都具有和原值一样的符号。整数部分以double类型存储于第二个参数错指向的内存位置，小数部分作为函数的返回值返回。
> frexp 和 ldexp 函数通常用于浮点数的内部处理，例如实现快速幂或进行高精度计算。
>
### 16.2.5 幂<math.h>

~~~c
double pow(double x, double y);
double sqrt(double x);
~~~

`pow`函数会返回$\text{x}^\text{y}$的值。由于在计算这个值时可能要用到对数，如果x是一个负数且y不是一个整数会出现一个定义域错误。

`sqrt`函数返回其参数的平方根。如果参数为负，就会出现一个定义域错误。

### 16.2.6 底数、顶数、绝对值和余数<math.h>

~~~c
double floor(double x);
double ceil(double x);
double fabs(double x);
double fmod(double x, double y);
~~~

这些函数都是用来处理浮点数的函数，分别用于取整和求模运算。

`floor`函数为传入的double值向下取整，`ceil`向上取整，`fmod`返回x除以y所产生的余数，
`fabs`返回双精度浮点数绝对值。

### 16.2.7 字符串转换 <stdlib.h>

~~~c
double atof(char const *string);
double strtod(char const *string, char **unused);
~~~

和`strtol`,`atol`类似，任一函数参数包含了前导空白字符，这些字符将被忽略。函数随后将合法的字符转换为一个double值并忽略任何缀尾的非法字符。

`strtod`函数把参数字符串转换为一个double值，其方法和`atof`类似，但保存一个指向字符串中被转换的值后面的第一个字符的指针。

> 值太大会返回 HUGE_VAL，值太小会返回0。这两种情况`errno`都会被设置为`ERANGE`

## 16.3 日期和时间函数

函数库提供了一组非常丰富的函数，用于简化日期和时间的处理。它们的原型位于`time.h`。

### 16.3.1 处理器时间 <time.h>

`clock`函数返回从程序开始执行起处理器所消耗的时间。

~~~c
clock_t clock(void);
~~~

`clock`函数返回一个数字，由编译器定义。通常是处理器时钟滴答的次数，将这个值除以**CLOCKS_PER_SEC**可以得到秒数。

一个例子

~~~c
#include <stdio.h>
#include <stdlib.h>
#include <time.h>

// 设置一个工作的函数
void run_program_logic() {
  long long sum = 0;
  for (int i = 0; i < 500000000; i++) {
    sum += i;
  }
  printf("计算结果: %lld\n", sum);

  // 模拟程序执行过程中可能发生的 I/O等待
  // sleep(1); // 如果加上这行，CPU时间不会等待但实际时间会增加1秒
}

// clock不是一个常用的计算墙上时钟时间的好方法
// time() 适用于秒级精度
// gettimeofday() POSIX: 适用于微秒级精度(更常用)
// clock_gettime() POSIX/C11: 更现代，支持纳秒级精度和
// 多种时钟类型(推荐用于高性能测量)

// clock返回的是处理器时钟滴答的次数。把这个值转换成秒要
// 除以常量 CLOCKS_PER_SEC
int main(void) {
  clock_t start_time, end_time;
  double cpu_time_used;
  // 1. 记录开始时间
  start_time = clock();

  // 运行程序
  run_program_logic();

  // 2. 记录结束时间
  end_time = clock();

  // 3. 计算CPU耗时（以秒为单位）
  // 要将clock_t 转换为 double 才能进行浮点除法
  cpu_time_used = ((double)(end_time - start_time)) / CLOCKS_PER_SEC;

  printf("\n--- 运行时间结果 ---\n");
  printf("总的 CPU 滴答数：%ld\n", (long)(end_time - start_time));
  printf("每秒滴答数(CLOCKS_PER_SEC)： %ld\n", (long)CLOCKS_PER_SEC);
  printf("程序 CPU 运行时间：%f 秒\n", cpu_time_used);
  return EXIT_SUCCESS;
}
~~~

### 16.3.2 当天时间<time.h>

`time`函数返回当前的日期和时间。

~~~c
time_t time(time_t *returned_value);
~~~

如果参数是一个非NULL的指针，时间值也将通过这个指针进行存储。  
如果机器无法提供当前日期和时间或时间值太大无法用`time_t`变量表示，函数返回-1。

- 标准并未规定时间的编码方式，所以不应该使用字面值常量。因为它们在不同的编译器中可能具有不同的含义。
- 一种常见的表示形式是返回从一个任意选定的时刻开始流逝的秒数。在**MS-DOS**和**UNIX**中，这个时刻是*1970年1月1日 00:00:00*

> 调用time函数两次并把两个值相减由此判断时间是很有诱惑力的。但这个技巧是很危险的，因为标准**并未要求函数的结果用秒表示**。使用`difftime`函数计算两次时间差值。

#### 日期和时间的转换<time.h>

用于操作`time_t`的函数

~~~c
char *ctime(time_t const *time_value);
double difftime(time_t time1, time_t time2);
~~~

`ctime`函数的参数是一个指向`time_t`的指针，并返回一个指向字符串的指针，字符串格式为`Sun Jul 4 04:02:48 1976\n\0`。字符串内部空格是固定的。

> ctime 返回的是一个存储在由编译器分配的静态字符数组的首地址，也就是存储在一个外部静态缓冲区(运行时库的静态/全局区域)，不是由调用者定义和分配的空间。

> ctime 的设计模式在多线程中存在数据覆盖的风险。

将调用`ctime`函数的返回值立即拷贝到一个由调用者分配的字符数组中

~~~c
char my_buffer[50];
memset(mybuffer,0,sizeof(my_buffer) / sizeof(my_buffer[0]));
time_t t = time(NULL);
char *s = ctime(&t); // 这里的指针s 只是指向了由编译器分配的一个静态字符数组并不是创建了一个新的存储区域
strcpy(my_buffer,s,sizeof(my_buffer) / sizeof(my_buffer[0]));
~~~

> ctime 也可能以 `asctime(localtime(time_value))`实现。

`difftime`函数计算$time1 - time2$的差，并把结果值转换为秒。返回值是**double**类型

一个例子

~~~c
#include <stdio.h>
#include <time.h>
#include <unistd.h> // POSIX sleep() 函数

// 模拟一段耗时的操作
void heavy_operation() {
    printf("开始执行耗时操作...\n");
    
    // 让程序暂停 2 秒，模拟实际经过的时间
    // time() 和 difftime 测量的是这个实际暂停的时间
    sleep(2); 
    
    printf("操作完成。\n");
}

int main() {
    time_t start_time, end_time;
    double elapsed_time;

    // 1. 记录开始时间
    time(&start_time); 

    // 执行需要计时的程序段
    heavy_operation();

    // 2. 记录结束时间
    time(&end_time);

    // 3. 计算时间差
    // difftime(结束时间, 开始时间)
    elapsed_time = difftime(end_time, start_time);

    printf("\n--- 计时结果 ---\n");
    printf("开始时间 (time_t): %ld\n", (long)start_time);
    printf("结束时间 (time_t): %ld\n", (long)end_time);
    printf("实际经过时间 (秒): %.2f\n", elapsed_time);

    return 0;
}
~~~

两个把time_t值转换为一个tm结构的函数，tm结构更方便访问日期和时间的各个组成部分。

~~~c
struct tm *gmtime(time_t const *time_value);
struct tm *localtime(time_t const *time_value);
~~~

`gmtime`函数把时间值转换为**世界协调时间(Coordinated Universal Time, UTC)**。**UTC**以前被称为**格林尼治标准时间(Greenwich Mean Time)**，这也是gmtime这个名字的来历。
`localtime`函数把一个时间值转换为当地时间。

`struct tm`结构体成员(字段)

| 成员名 | 类型 | 含义 | 范围/备注 |
| :---: | :---: | :---: | :---: |
| **`tm_sec`** | `int` | **秒** | $0$ 到 $60$ (允许 $60$ 来处理闰秒) |
| **`tm_min`** | `int` | **分** | $0$ 到 $59$ |
| **`tm_hour`** | `int` | **时** | $0$ 到 $23$ |
| **`tm_mday`** | `int` | **月中的第几天（日期）** | $1$ 到 $31$ |
| **`tm_mon`** | `int` | **月** | $0$ 到 $11$ ( $0$ 代表一月， $11$ 代表十二月) |
| **`tm_year`** | `int` | **年** | **从 1900 年开始计算的年数**。例如，如果年份是 2025，则 `tm_year` 为 $125$。 |
| **`tm_wday`** | `int` | **周中的第几天** | $0$ 到 $6$ ( $0$ 代表星期日， $6$ 代表星期六) |
| **`tm_yday`** | `int` | **年中的第几天** | $0$ 到 $365$ ( $0$ 代表 1 月 1 日) |
| **`tm_isdst`** | `int` | **夏令时标志** | 如果夏令时生效，值为正；如果未生效，值为 $0$；如果信息不可用，值为负（通常是 $-1$）。 |

当有了一个tm结构之后，既可以直接使用tm结构变量内成员值，也可以把它作为参数传递给下面的函数之一。

~~~c
char *asctime(struct tm const *tm_ptr);
size_t strftime(char *string, size_t maxsize, char const *format,
                struct tm const *tm_ptr);
~~~

`asctime`函数把参数所表示的时间值转换为一个以`Sun Jul 4 04:02:48 1976\n\0`格式表示的字符串。

`strftime`函数把一个tm结构转换为一个根据某个格式字符串而定的字符串。*这个函数在格式化日期方面提供了令人难以置信的灵活性*。如果转换结果字符串的长度小于`maxsize`参数，那么该字符就被复制到第一个参数所指向的数组中，`strftime`函数返回字符串的长度。否则，函数返回-1且数组的内容是未定义的。

格式字符串包含了普通字符和格式代码。普通字符被复制到它们原先在字符串中出现的位置。
格式代码则被一个日期或时间值代替。格式代码包含一个`%`字符，后面跟一个表示所需值的字符。

| 代码 | 含义 | 示例输出 | 备注 |
| :---: | :---: | :---: | :---: |
| **年/世纪** | | | |
| `%Y` | 带世纪的年份 | `2025` | 四位数字 |
| `%y` | 不带世纪的年份 | `25` | 两位数字 (00-99) |
| `%C` | 世纪数 | `20` | (2025 年属于第 20 世纪) |
| **月** | | | |
| `%m` | 月份 | `11` | 两位数字 (01-12) |
| `%B` | 完整的月份名称 | `November` | 依赖本地环境 (Locale) |
| `%b`, `%h` | 缩写的月份名称 | `Nov` | 依赖本地环境 |
| **日/周** | | | |
| `%d` | 月份中的日期 | `15` | 两位数字 (01-31) |
| `%A` | 完整的星期几名称 | `Saturday` | 依赖本地环境 |
| `%a` | 缩写的星期几名称 | `Sat` | 依赖本地环境 |
| `%w` | 周中的第几天 | `6` | 数字 (0=Sunday, 6=Saturday) |
| `%u` | ISO 8601 周中的第几天 | `6` | 数字 (1=Monday, 7=Sunday) |
| `%j` | 年中的第几天 | `319` | 三位数字 (001-366) |
| **时** | | | |
| `%H` | 小时 (24 小时制) | `17` | 两位数字 (00-23) |
| `%I` | 小时 (12 小时制) | `05` | 两位数字 (01-12) |
| `%p` | 上午/下午标志 | `PM` | 依赖本地环境 |
| **分/秒** | | | |
| `%M` | 分钟 | `12` | 两位数字 (00-59) |
| `%S` | 秒 | `26` | 两位数字 (00-60) |
| **日期/时间组合** | | | |
| `%x` | 本地日期表示 | `11/15/25` | 依赖本地环境 |
| `%X` | 本地时间表示 | `17:12:26` | 依赖本地环境 |
| `%c` | 本地日期和时间 | `Sat Nov 15 17:12:26 2025` | 依赖本地环境 |
| **时区/其他** | | | |
| `%Z` | 时区名称 | `JST` 或 `CST` | 依赖本地环境 |
| `%%` | 百分号符号 | `%` | |

| 格式字符串 | 示例输出 | 解释 |
| :---: | :---: | :---: |
| `"%Y-%m-%d %H:%M:%S"` | `2025-11-15 17:12:26` | 国际通用日期和时间格式 |
| `"%a, %b %d, %Y"` | `Sat, Nov 15, 2025` | 英文习惯日期格式 |
| `"%I:%M %p"` | `05:12 PM` | 12 小时制时间 |

`mktime`函数用于把一个tm结构转换为一个time_t值。

~~~c
time_t mktime(struct tm *tm_ptr);
~~~

一个例子

~~~c
#include <stdio.h>
#include <stdlib.h>
#include <time.h>

int main(void) {
  // 1. mktime 手动构建时间结构体
  struct tm time_info = {
      .tm_year = 2025 - 1900, // 年份从 1900 开始算
      .tm_mon = 10 - 1,       // 月份 0 - 11
      .tm_mday = 27,          // 日
      .tm_hour = 23,
      .tm_min = 14,
      .tm_sec = 30,
      .tm_isdst = -1 // 自动判断夏令时
  };

  time_t timestamp = mktime(&time_info);
  printf("mktime生成的时间戳：%ld\n", timestamp);

  // 2. asctime：时间结构体转字符串(固定格式)
  char *ascii_time = asctime(&time_info);
  printf("asctime输出：%s", ascii_time); // 自带换行

  // 3. strftime：自定义格式化时间(最常用)
  char buffer[100];
  strftime(buffer, sizeof(buffer), "%Y-%m-%d %H:%M:%S 星期%w", // 格式串自由组合
           &time_info);
  printf("strftime自定义：%s\n", buffer);

  return EXIT_SUCCESS;
}

~~~

> 其实在这个例子里面使用 asctime非常危险，在编写C语言代码时遇到返回值为指针类型的函数多半要小心是否是返回了一个编译器分配的静态数组指针给你，这会导致在下一次调用这个函数时修改你用指针接收的值，也就是线程不安全的函数，遇到这种情况要及时将静态内存的内容复制出来。

~~~c
time_t time1 = time(NULL);
char buffer[26];
strncpy(buffer, asctime(&time1), sizeof(buffer)); // 以后直接使用buffer就不会变化了
~~~

## 16.4 非本地跳转<setjmp.h>

`setjmp`和`longjmp`函数提供了一种类似goto语句的机制，但它并不局限于一个函数的作用域之内。这些函数常用于深层嵌套的函数调用链。如果在某个低层的函数中检测到一个错误，可以立即返回到顶层函数，不必向调用链中的每个中间层函数返回一个错误标志。

为了使用这些函数必须包含包含头文件<setjmp.h>

~~~c
int setjmp(jmp_buf state);
void longjmp(jmp_buf state, int value);
~~~

声明一个`jmp_buf`变量，调用`setjmp`函数初始化，`setjmp`返回值为零。`setjmp`把程序的状态信息（例如，堆栈指针的当前位置和程序的计数器）保存到跳转缓冲区。调用`setjmp`时所处的函数便称为“顶层”函数。

以后，在顶层函数或其他任何它所调用的函数内的任何地方调用`longjmp`函数，将导致这个被保存的状态重新恢复。`longjmp`的效果就是使执行流通过再次从`setjmp`函数返回，从而立即跳回到顶层函数。

区分`setjmp`函数的两种不同返回方式，当`setjmp`函数第一次被调用时，返回0。当`setjmp`作为`longjmp`的执行结果再次返回时，它的返回值是`longjmp`的第二个参数，它必须是个非0值。通过检查它的返回值可以判断是否调用`longjmp`以及存在多个`longjmp`可以判断是哪个`longjmp`被调用。

### 16.4.1 实例

~~~c
#include <setjmp.h>
#include <stdio.h>
#include <stdlib.h>

// 1. 声明一个 jmp_buf 变量，用于在不同函数之间共享执行环境
// 必须在 setjmp 和 longjmp 都能访问到的作用域内声明（通常是全局或静态）
jmp_buf environment;

// 错误代码定义
#define ERROR_FILE_NOT_FOUND 1
#define ERROR_DATA_CORRUPTED 2

// 模拟一个可能失败的深层函数
void process_data(int step);
// 模拟一个中介函数
void intermediate_function();

int main(void) {

  // 第一次调用 setjmp, 设置跳转恢复点。
  int jump_val = setjmp(environment);

  if (jump_val == 0) {
    // 路径A：正常执行
    printf("【Main】：第一次调用 setjmp，设置了错误处理点。\n");
    intermediate_function(); // 开始执行正常业务逻辑
    printf("【Main】：所有功能正常完成。\n");

  } else {
    // 路径B，从longjmp跳转回来
    printf("\n【Main】：发生了非局部跳转！\n");

    switch (jump_val) {
    case ERROR_DATA_CORRUPTED:
      printf("错误处理：代码%d，数据处理失败，程序安全终止。\n", jump_val);
      break;
    case ERROR_FILE_NOT_FOUND:
 printf("错误处理：代码%d，文件未找到。\n", jump_val);
      break;
    default:
      printf("错误处理：发生了未知错误。\n");
      break;
    }
  }
  return EXIT_SUCCESS;
}

void process_data(int step) {
  printf("--- Function: process_data ---\n");

  if (step == 1) {
    printf("Step 1: 正在读取配置文件...\n");
  } else if (step == 2) {
    printf("Step 2: 正在处理数据块...\n");

    // 假设这里发生了致命错误！
    printf("致命错误：数据损坏！\n");
    // 立即跳转回 setjmp的位置，并将 ERROR_DATA_CORRUPTED 作为返回值传递
    longjmp(environment, ERROR_DATA_CORRUPTED);

    // 注意：longjmp 后的代码不会被执行
    printf("这行代码永远不会被执行。\n");
  }
}

void intermediate_function() {
  printf("\n--- Function: intermediate_function ---\n");
  process_data(1);
  process_data(2); // 这一步将触发 longjmp
  printf("Intermediate Function 正常结束。\n");
}
~~~

### 16.4.2 何时使用非本地跳转

`setjmp`和`longjmp`并不是绝对必需的，因为总是可以通过返回一个错误代码并在调用函数中对其进行检查来实现相同的效果。返回错误代码的方法有时候不是很方便，特别是当函数已经返回了一些值的时候。
> 使用setjmp和longjmp必须要遵循某些戒律。不然会像goto一样使用一多会让代码难以理解。

## 16.5 信号

程序中所发生的事件绝大多数都是由**程序本身所引发的**，例如执行各种语句和请求输入。但是，有些程序必须遇到的事件却不是程序本身所引发的。一个常见的例子就是用户中断了程序。如果部分计算好的结果必须进行保存以避免数据的丢失，程序必须预备对这类事件做出反应，虽然它并没有办法预测什么时候会发生这种情况。

信号就是用于这种目的。**信号(Signal)** 表示一种事件，它可能异步发生，也就是并不与程序执行过程的任何事件同步。如果程序并未安排怎样处理一个特定信号，那么当该信号出现时程序就做出一个缺省的反应。标准并未定义这个缺省反应是什么，但绝大多数编译器都选择终止程序。另外，程序可以调用signal函数，或者忽略这个信号，或者设置一个**信号处理函数(signal handler)**，当信号发生时程序就调用这个函数。

### 16.5.1 信号名 <signal.h>

|信号|含义|
|:----:|:----:|
|SIGABRT|程序请求异常终止|
|SIGFPE|发生一个算数错误|
|SIGILL|检测到非法指令|
|SIGSEGV|检测到对内存的非法访问|
|SIGINT|收到一个交互性注意信号|
|SIGTERM|收到一个终止程序的请求|

**SIGABRT**是一个由`abort`函数所引发的信号，用于终止程序。

至于哪些错误将引发**SIGFPE**信号则取决于编译器。常见的有算术上溢或下溢以及除零错误。有些编译器对这个信号进行了扩展，提供了关于引发这个信号的操作的特定信息。可能对可移植性有影响。

**SIGILL**信号提示CPU试图执行一条非法的指令。这个错误可能由于不正确的编译器设置导致。

**SIGSEGV**信号提示程序试图非法访问内存。有两个最常见的原因：一个是程序试图访问未安装于机器上的内存或者访问操作系统未曾分配给这个程序的内存；另一个是程序违反了内存访问的边界要求。后者可能在那些要求数据边界对齐的机器上发生。

前几个信号是*同步*的，因为它们都是*在程序内部发生的*。尽管无法预测一个算数错误何时将会发生，如所使用相同的数据反复运行这个程序，每次都会在相同的地方发生相同的错误。

最后两个信号**SIGINT**和**SIGTERM**则是*异步*的。它们在*程序的外部产生*，通常是由程序的用户所触发，表示用户试图向程序传达一些信息。

**SIGINT**信号在绝大多数机器中都是当用户试图中断程序时发生的。

**SIGTERM**则是另一种用于请求终止程序的信号。

一种常用的策略是为**SIGINT**定义一个信号处理函数，目的是执行一些日常维护工作并在程序退出前保存数据。但**SIGTERM**则不配备信号处理函数，这样当程序终止时便不必执行这些日常维护工作。

### 16.5.2 处理信号 <signal.h>

通常我们关心的是怎样处理那些自主发生的信号，也就是无法预测其什么时候会发生的信号。**raise**函数用于显式地引发一个信号。

~~~c
int raise(int sig);
~~~

调用这个函数将引发它的参数所指定的信号。程序对这类信号的反应和那些自主发生的信号是相同的。可以调用这个函数对信号处理函数进行测试。

> 如果误用可能会实现一种非局部的goto效果。

当一个信号发生时，程序可以使用三种方式对它做出反应。缺省的反应是由编译器定义的，通常是终止程序。程序也可以指定其他行为对信号做出反应：信号可以被忽略，或者程序可以设置一个信号处理函数，当信号发生时调用这个函数。signal函数用于指定程序希望采取的反应。

~~~c
void (*signal(int sig, void (*handler)(int)))(int);
~~~

分析这个函数原型，首先省略返回类型，对参数进行研究。

~~~c
signal(int sig, void (*handler)(int));
~~~

第一个参数是信号类型，第二个参数是希望为这个信号设置的信号处理函数。这个处理函数是一个函数指针，它所指向的函数接受一个整型参数且没有返回值。当信号发生时，信号的代码作为参数传递给信号处理函数。这个参数运行一个处理函数处理几种不同的信号。

现在将从原型中的去掉参数

~~~c
void (*signal())(int);
~~~

**signal**是一个函数，它返回一个函数指针，后者所指向的函数接受一个整型参数且无返回值。事实上signal函数返回一个指向该信号以前的处理函数的指针（被替换前的信号处理函数指针）。如果调用signal失败，例如由于非法的信号代码所致，函数将返回SIG_ERR值。这个值是个宏，在`signal.h`头文件中定义。

`signal.h`头文件海定义了另外两个宏，**SIG_DFL**和**SIG_IGN**，它们可以作为signal函数的第二个参数。**SIG_DFL**恢复对该信号的缺省反应，**SIG_IGN**使该信号被忽略。

总之信号处理函数原型`void (*signal(int sig, void (*handler)(int)))(int);`声明了一个名为signal的函数，它：

1. 接受一个信号编号`int sig`
2. 接受一个指向信号处理函数的函数指针`void (*handler)(int)`
3. 返回一个指向旧的信号处理函数的函数指针

用途就是利用`signal()`函数来设置新的信号处理方式，并保留旧的处理函数地址，方便之后恢复。

### 16.5.3 信号处理函数

当一个已经设置了信号处理函数的信号发生时，系统首先恢复对该信号的缺省行为。这样做是为了防止如果信号处理函数内部也发生这个信号可能导致的无限循环。然后，信号处理函数被调用，信号代码作为参数传递给函数。

~~~c
void my_handler(int sig){
    // 假设在这里执行了很复杂的操作，并意外再次触发了 SIGINT
    // 如果系统没有恢复缺省行为，my_handler 就会再次被调用，
    // 可能导致堆栈溢出或无限递归，喵！
}

int main(){
  // 第一次调用signal(), 设置 my_handler
  signal(SIGINT, my_handler);
  // ...
}
~~~

- 安全机制：当**SIGINT**发生时，系统内部会执行类似`signal(SIGINT,SIG_DFL);`的操作，然后再调用`my_handler`。
- 如果要保持处理：在信号处理函数的第一行或某处重新调用`signal()`

~~~c
void my_handler(int sig){
  signal(sig,my_handler);
  // 其他处理逻辑
}
~~~

信号处理函数可能执行的工作类型是非常有限的。如果信号是异步的，也就是说不是由于调用`abort`或`raise`函数引起的，信号处理函数便不应该调用除signal之外的任何库函数，因为在这种情况下是未定义的。而且信号处理函数除了能向一个类型为`volatile sig_atomic_t`的静态变量赋一个值以外，可能无法访问其他任何静态数据。为了保证真正的安全，信号处理函数所能做的就是对这些变量之一进行设置然后返回。程序的剩余部分必须定期检查变量的值，看看是否有信号发生。

如果信号是异步的（比如硬件错误、来自操作系统的中断，而不是自己调用 raise() 或 abort() 触发的），那么您的信号处理函数几乎不能调用任何标准库函数，除了 signal() 自身。

~~~c
void unsafe_handler(int sig){
    // 🚨 危险！在异步信号处理中，调用 printf 是未定义行为！
    // 运行时环境可能不安全，可能破坏 stdio 库的内部状态。
    printf("Oops! Signal %d received.\n", sig); 
    
    // 🚨 危险！
    malloc(10); // 堆栈可能处于不完整状态，malloc内部状态可能混乱！
    
    // 应该调用什么？只有极少数函数安全，比如 _Exit 或 signal 本身。
}
~~~

这些严格的限制是由于信号处理的本质产生的。信号通常用于提示发生了错误。在这些情况下，CPU的行为是精确定义的，在程序中，错误所处的上下文环境可能很不相同，因为它们并不一定能够良好定义。例如当`strcpy`函数正在执行时如果产生一个信号，可能当时目标字符串暂时未以NUL字节终结；或者当一个函数被调用时如果产生一个信号，当时堆栈可能处于不完整的状态。如果依赖这种上下文环境的库函数被调用它们就可能以不可预料的方式失败，很可能引发另一个信号。

访问限制定义了在信号处理函数中保证能够运行的最小功能。类型`sig_atomic_t`定义了一种CPU可以以原子方式访问的数据类型，也就是不可分割的访问单位。例如一台16位的机器可以以原子方式访问一个16位整数，但访问一个32位整数可能需要两个操作。在访问非原子数据的中间步骤时如果产生一个信号可能导致不一致的结果，在信号处理函数中把数据访问限制为原子单位可以消除这种可能性。

- 对特定类型静态变量`volatile sig_atomic_t`的测试

~~~c
#include <signal.h>
#include <stdio.h>
#include <stdlib.h>

// 🐱 最佳实践：使用 volatile sig_atomic_t
// 保证了原子性 (CPU 一次操作完成) 和可见性 (防止编译器优化)。
volatile sig_atomic_t g_signal_flag = 0;
// 静态变量默认是0，但如果变量在别的文件，需要声明为 static volatile
// sig_atomic_t

void safe_handler(int sig) {
  // 这是信号处理函数唯一应该做的事情：设置标志并快速返回
  g_signal_flag = sig; // 赋值是原子性的
  // 最好不要做其他事情了！
}

int main(void) {
  signal(SIGINT, safe_handler);

  while (1) {
    // 程序的其余部分必须定期检查这个标志！
    if (g_signal_flag != 0) {
      fprintf(stdout, "\n捕捉到信号 %d, 正在安全退出...\n", g_signal_flag);
      // 安全地调用库函数进行清理工作
      exit(g_signal_flag);
    }
    // 程序正常运行逻辑
  }
  return 0;
}
~~~

> 标准表示信号处理函数可以通过调用exit终止程序。用于处理除了**SIGABRT**之外的所有信号的处理函数也可以通过调用abort终止程序。但是由于这两个都是库函数，所以当它们被异步信号处理函数调用时可能无法正常运行。如果必须用这种方式终止程序，注意仍然存在一种微小的可能性导致它失败。如果发生这种情况，函数的失败可能破坏数据或者表现出奇怪的症状，但程序最终将终止。

## 16.6 打印可变参数列表<stdarg.h>

这组函数可用于可变参数列表必须被打印的场合。要求包含头文件`<stdio.h>` `<stdarg.h>`

~~~c
int vprintf(char const *format, va_list arg);
int vfprintf(FILE *stream, char const *format, va_list arg);
int vsprintf(char *buffer, char const *format, va_list arg);
~~~

> 推荐使用内存更安全的`int vsnprintf(char *str, size_t size, const char *format, va_list ap)`而不是`vsprintf`

#### 例子

用`vprintf`实现打印格式化的log

~~~c
#include <stdarg.h>
#include <stdio.h>

void my_log(const char *format, ...){
  va_list args;
  va_start(args,format);
  
  // 使用vprintf 将格式化字符串和参数列表打印到标准输出
  printf("LOG: ");
  vprintf(format,args);
  printf("\n");
  
  va_end(args);
}
~~~

用`vfprintf`实现打印格式化log到文本流

~~~c
#include <stdarg.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

void file_log(FILE *stream, const char *format, ...);

void remove_line(char *str);

int main(void){
  const char *log = "app.log";
  FILE *fp = fopen(log,"w");
  if (fp == NULL){
    fprintf(stdout,"Failed to open file %s,exit...",log);
    fclose(fp);
    exit(1);
  }

  char name[20],passwd[20];
  memset(name,0,sizeof(name)); 
  memset(passwd,0,sizeof(passwd));
  fputs("Please input your Loginname: \n",stdout);
  fgets(name,sizeof(name) / sizeof(name[0]), stdin);
  remove_line(name);
  fputs("Please input your Loginpasswd: \n",stdout);
  fgets(passwd,sizeof(passwd) / sizeof(passwd[0]), stdin);
  remove_line(passwd);

  file_log(fp, "Everything I found great was sunfaded.");
  file_log(fp, "LoginName: %s", name);
  file_log(fp, "LoginPasswd: %s", passwd);
  fclose(fp);
  return 0;
}

void file_log(FILE *stream, const char *format, ...){
  va_list args;
  va_start(args,format);
  fprintf(stream,"LOG: ");
  vfprintf(stream,format,args);
  fprintf(stream,"\n");

  va_end(args);
}

void remove_line(char *str){
  int size = strlen(str);
  if (size > 0 && str[size - 1] == '\n')
    str[size - 1] = '\0';
}
~~~

使用`vsnprintf` 将格式输出到字符数组内

~~~c
# include <stdarg.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#define MAX_BUFFER 256

// 封装函数：将格式化输出写入到字符串
/*
 *  @brief package function and write down output format to string
 *  @param  buffer is the container of format string
 *  @param  format is the requirement value of vsprintf function
 *  @param  ... is variables argument list
 *  @return return actual format with va_list length
 * */
int format_message(char *buffer, const char *format, ...);

int main(void) {

  char output[MAX_BUFFER];
  memset(output, 0, sizeof(output));

  format_message(output, "%d is the real value of world!\n", 42);
  fprintf(stdout, "%s", output);
  return EXIT_SUCCESS;
}
int format_message(char *buffer, const char *format, ...) {
  va_list args;
  va_start(args, format);

  // 使用 vsnprintf 代替 vsprintf，因为它接受缓冲区大小参数，更安全
  // vsnprintf 是 vprintf 系列中用于写入字符串的最佳实践
  int result = vsnprintf(buffer, MAX_BUFFER, format, args);

  va_end(args);
  return result;
}
~~~

## 16.7 执行环境

### 16.7.1 终止执行<stdlib.h>

这三个函数与正常或不正常的程序终止有关。

~~~c
void abort(void);
void atexit(void (*func)(void));
void exit(int status);
~~~

`abort`函数用于不正常地终止一个正在执行的程序。由于这个函数将引发SIGABRT信号，可以在程序中为这个信号设置一个信号处理函数。

`atexit`函数可以把一些函数注册为**退出函数(exit function)**。当程序将要正常终止时（或者由于调用exit，或者由于main函数返回），退出函数将被调用，退出函数不能接受任何参数。

`exit`函数用于正常终止程序。

当`exit`函数被调用时，所有被`atexit`函数注册为退出函数的函数将按照它们所注册的顺序被反序依次调用。然后所有用于流的缓冲区被刷新，所有打开的文件被关闭。用`tmpfile`函数创建的文件被删除。然后，退出状态返回给宿主环境，程序停止执行。

> 不要在atexit注册的退出函数内再次调用exit函数，其效果未定义会导致一个无限循环，很可能只有当堆栈的内存耗尽后才会终止。

### 16.7.2 断言<assert.h>

断言就是声明某种东西应该为真。ANSI C实现了一个assert宏，在调试程序时很有用。

~~~c
void assert(int expression);
~~~

当它被执行时，这个宏对表达式参数进行测试。如果它的值为假（零），它就向标准错误打印一条诊断信息并终止程序。这条信息格式是由编译器定义的，为真则则不打印任何东西继续执行。

这个宏提供了一种方便的方法，对应该是真的东西进行检。例如，如果一个函数必须用一个不为NULL的指针参数进行调用，那么函数可以用断言验证这个值：

~~~c
assert(value != NULL);
~~~

如果函数错误地接受了一个**NULL**参数，程序就会打印一条类型下面形式的信息：

~~~c
Assertion failed: value != NULL, file.c line 274
~~~

> 用这种方法使用断言使调试变得更容易，因为一旦出现错误，程序就会停止。而且，这条信息准确地提示了症状出现地点。

> asser只适用于验证必须为真的表达式。

可以在编译时通过定义**NDEBUG**消除所有的断言。使用编译器命令`-DNDEBUG`或在源文件头文件`<assert.h>`被包含前增加下面这个定义。

~~~c
#define NDEBUG
~~~

### 16.7.3 环境<stdlib.h>

**环境(environment)**就是一个由编译器定义的名字/值对的列表，它由操作系统进行维护（就是系统的环境变量）。`getenv`函数在这个列表中查找一个特定的名字，如果找到，返回一个指向其对应值的指针。程序不能修改返回的字符串。如果名字未找到，函数就返回一个NULL指针。

~~~c
char *getenv(char const *name);
~~~

#### 使用两种不同的方法分配内存并输出映射的环境变量

~~~c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define MAX_ENV_LEN 128

void safe_getenv_copy(const char *env_name);

void process_env_dup(const char *env_name);

int main(void) {
  safe_getenv_copy("HOME");
  process_env_dup("SHELL");
  return 0;
}

void safe_getenv_copy(const char *env_name) {
  char *env_value = getenv(
      env_name); // 这里env_value
                 // 指向的是在静态存储区中有操作系统维护的一个环境变量表的内存

  if (env_value != NULL) {
    // 1. 在栈上分配缓冲区
    char local_buffer[MAX_ENV_LEN];

    // 2. duplicate: use strncpy function to ensure local_buffer not to
    // overflow. attention:strncpy may lose end symbol \0, so you need to make
    // sure manually
    strncpy(local_buffer, env_value, MAX_ENV_LEN - 1);
    local_buffer[MAX_ENV_LEN - 1] = '\0'; // ensure empty terminate
    printf("Safely copied %s: %s\n", env_name, local_buffer);
    // 3. local_buffer will automatically released when leave function.

  } else {
    printf("%s not found", env_name);
  }
}

void process_env_dup(const char *env_name) {
  char *env_value = getenv(env_name);
  char *heap_copy = NULL;

  if (env_value != NULL) {
    // 1. duplicate: use strdup (or strncpy + malloc) to duplicate to heap
    // strdup can automatically allocate enough memory and copy string
    heap_copy = strdup(env_value);

    if (heap_copy != NULL) {
      printf("Safely duplicated %s: %s\n", env_name, heap_copy);

      free(heap_copy);
    }
  }
}
~~~

### 16.7.4 执行系统命令<stdlib.h>

`system`函数把它的字符串参数传递给宿主操作系统，这样它就可以作为一条命令，由系统的命令处理器执行。

~~~c
void system(char const *command);
~~~

这个任务执行的准确行为因编译器而异，返回值也是一样。

~~~c
int val = system(NULL);
~~~

一种用于查询命令处理器是否存在的调用，如果存在返回非零值，不存在则返回零。

~~~c
#include <stdio.h>
#include <stdlib.h>

int main(void) {

  printf("1. Listing files using system():\n");
  // 调用 ls 命令列出当前目录文件
  system("ls -l --color=auto");

  printf(
      "\n2. Changing terminal background to BLUE using system() and 'tput'\n");

  printf("Press Any key to continue...\n");
  getchar();
  // 使用 tput 命令
  // setab 4 = Set Background Color to Blue (ANSI color 4)
  system("tput setab 4");

  // 清屏
  system("clear");

  printf("The background should now be BLUE.\n");
  printf("This was done by invoking the 'tput' and 'clear' shell commands.\n");
  printf("\n3. Resetting using ANSI escape codes (via echo):\n");
  printf("(Press Enter to reset...)\n");
  getchar();

  // 使用 echo 发送 ANSI 转义字符 (SGR 0 重置属性)
  // \033[0m 是重置所有属性的转移码
  system("echo -e \"\\033[0m\"");
  system("clear");

  printf("Back to normal!\n");
  return 0;
}
~~~

### 16.7.5 排序和查找<stdlib.h>

`qsort`函数在一个数组中以升序的方式对数据进行排序。由于它是和类型无关的，所以可以使用qsort排序任意类型的数据，只是数组中元素的长度是固定的。

~~~c
void qsort(void *base,size_t n_elements, size_t el_size,
           int (*compare)(void const *,void const*));
~~~

第一个参数指向需要排序的数组，第二个参数指定数组中元素的数目，第三个参数指定每个元素的长度（以字符为单位），第四个参数是一个函数指针，用于对需要排序的元素进行比较。在排序时，`qsort`调用这个函数对数组中的数据进行比较。通过传递一个指向合适的比较函数的指针，可以用`qsort`排序任意类型值的数组。

比较函数接受两个参数，它们是指向两个需要进行比较的值的指针。函数应该返回一个整数，大于零、等于零和小于零分别表示第一个参数大于、等于和小于第二个参数。

#### 使用 qsort 对结构体数组按照结构体内成员进行排序

~~~c
#include <stdio.h>
#include <stdlib.h>
#include <time.h>
static int strlen_my(const char *str);

static void remove_line(char *str);

static int strcmp_my(const char *s1, const char *s2);

#define INITMY_ARR(ARR, SIZE)                                                  \
  do {                                                                         \
    int __i;                                                                   \
    for (__i = 0; __i < (SIZE); __i++) {                                       \
      fprintf(stdout, "put No %d key string:\n", __i);                         \
      fgets((ARR)[__i].key, sizeof((ARR)[__i].key), stdin);                    \
      remove_line((ARR)[__i].key);                                             \
      (ARR)[__i].other_data = rand() % 100 + 1;                                \
    }                                                                          \
  } while (0)

#define PRINT_ARR(ARR, SIZE)                                                   \
  do {                                                                         \
    int __i;                                                                   \
    for (__i = 0; __i < (SIZE); __i++) {                                       \
      fprintf(stdout, "%s -> %d\n", (ARR)[__i].key, (ARR)[__i].other_data);    \
    }                                                                          \
  } while (0)

typedef struct {
  char key[10];   // 数组的排序关键字
  int other_data; // 与关键字关联的数据
} Record;

// 比较函数，只比较关键的值。
/*
 *  @brief compare function：only compare key value
 *  @param two void const* variable can execute force transfer for val
 *  @return positive means val1 large than val2 zero means val1 equals to val2
 * negative means val1 less than val2
 * */
static int r_compare(void const *a, void const *b);

int main(void) {
  time_t t;
  srand((unsigned)time(&t));
  const int length = 5;

  Record array[length];
  INITMY_ARR(array, length);

  fputs("before qsort:\n", stdout);
  PRINT_ARR(array, length);
  qsort(array, length, sizeof(Record), r_compare);

  fputs("after qsort:\n", stdout);
  PRINT_ARR(array, length);

  Record target;
  Record *result;

  // 查找
  printf("\n请输入要查找的字符串：\n");
  fgets(target.key, sizeof(target.key), stdin);
  remove_line(target.key);

  // 使用 bsearch 执行二分查找
  result = (Record *)bsearch(&target, array, length, sizeof(Record), r_compare);

  if (result != NULL) {
    printf("找到！key: %s, other_data: %d\n", result->key, result->other_data);
    printf("在数组中内存地址偏移量: %ld\n", result - array);
  } else {
    printf("未找到 key 为 %s 的元素\n", target.key);
  }

  return EXIT_SUCCESS;
}

static int strlen_my(const char *str) {
  const char *p = str;
  while (*p != '\0')
    p++;
  return p - str;
}

static int strcmp_my(const char *s1, const char *s2) {
  while (*s1 != '\0' && *s1 == *s2) {
    s1++;
    s2++;
  }

  // 为什么强制转换为 unsigned char？
  // C 语言标准规定 strcmp 比较时应将字符视为 unsigned char。
  // 如果不转，对于扩展 ASCII 码（如大于 127 的字符），
  // 可能会被当成负数，导致比较结果错误。

  return *(unsigned char *)s1 - *(unsigned char *)s2;
}

static void remove_line(char *str) {
  int size = strlen_my(str);
  if (size != 0 && str[size - 1] == '\n') {
    str[size - 1] = '\0';
  }
}

static int r_compare(void const *a, void const *b) {
  return strcmp_my(((const Record *)a)->key, ((const Record *)b)->key);
}
~~~

## 16.8 locale

为了使C语言在全世界的范围内更为通用，标准定义了locale，这是一组特定的参数，每个国家可能不同。在缺省的情况下是 **"C"locale**，编译器也可以定义其他的locale。修改locale可能影响库函数的运行方式。

`setlocale`函数的原型如下所示，它用于修改整个或部分locale

~~~c
char *setlocale(int category, char const *locale);
~~~

`category`参数指定locale的哪个部分需要进行修改。所允许出现的值于下表

<strong><center>setlocale 类型</center></strong>

|值|修改|
|:--:|:--:|
|LC_ALL|整个locale|
|LC_COLLATE|对照序列，它将影响strcoll和strxfrm函数的行为|
|LC_CTYPE|定义于ctype.h中的函数所使用的字符类型分类信息|
|LC_MONETARY|在格式化货币值时使用的字符|
|LC_NUMERIC|在格式化非货币值时使用的字符。同时修改由格式化输入/输出函数和字符串转换函数所使用的小数点符号|
|LC_TIME|strftime函数的行为|

如果`setlocale`的第二个参数为NULL，函数将返回一个指向给定类型的当前的locale的名字的指针。这个值可能被保存并在后续的`setlocale`函数中使用，用来恢复以前的locale的值。

> 这里`setlocale`函数返回的也是一个静态内存中的值，和ctime，strftime一样最好用一个字符数组接收当前返回的值，否则后续调用`setlocale`函数这个值可能会发生改变。

> 使用`strdup`或`strncpy`复制到堆内存或栈内存上。

~~~c
#include <locale.h> // setlocale
#include <stdio.h>
#include <stdlib.h>
#include <string.h> // strdup (POSIX)

// 打印浮点数，观察小数点是 '.' 还是 ','
inline static void print_number();

int main(void) {
  // 1. 显式设置初始环境为 "C" (标准 C 模式，小数点是点)
  setlocale(LC_NUMERIC, "C");
  printf("1. Initial state (C locale):\n");
  print_number();

  // 获取当前 locale 名称
  char *current_ptr = setlocale(LC_NUMERIC, NULL);

  // 必须拷贝字符串
  char *saved_locale = strdup(current_ptr);

  printf("\n[System] Saved old locale: '%s'\n", saved_locale);

  // 切换到新环境
  char *new_loc = setlocale(LC_NUMERIC, "de_DE.UTF-8");
  if (new_loc == NULL) {
    printf("\n(de_DE.UTF-8 not found, trying system default...)\n");
    new_loc = setlocale(LC_NUMERIC, ""); // 尝试系统默认
  }

  printf("\n2. Temporary state (Changed to '%s'):\n", new_loc);
  print_number();

  // 恢复原来的环境
  printf("\n[System] Restoring previous locale...\n");
  setlocale(LC_NUMERIC, saved_locale);

  printf("\n3. Restored state:\n");
  print_number();

  // 别忘了释放拷贝字符串的内存
  free(saved_locale);

  return 0;
}

inline static void print_number() { printf(" Current Output: %.2f\n", 3.14); }
~~~

### 16.8.1 数值和货币格式 <locale.h>

`localeconv`函数用于获得根据当前的`locale`对非货币值和货币值进行合适的格式化所需要的信息。这个函数并不实际执行格式化任务，它只是提供一些如何进行格式化的信息。

~~~c
struct lconv *localeconv(void);
~~~

`lconv`结构包含两种类型的参数：字符和字符指针。

### 16.8.2 字符串和 locale<string.h>

一台机器的字符集的对照序列是固定的，但locale提供了一种方法指定不同的序列。当你必须使用一个并非缺省的对照序列时，可以使用下列两个函数。

~~~c
int strcoll(char const *s1, char const *s2);
size_t strxfrm(char *s1, char const *s2, size_t size);
~~~

`strcoll`函数用法和`strcmp`类似，对两个字符串根据当前的locale的LC_COLLATE类型参数指定的字符串进行比较。它返回一个大于、等于或小于零的值。
> 这个比较函数所需的计算量可能比`strcmp`需要多的多的计算量。因为它需要遵循一个并非是本地机器的对照序列。

当字符串必须以这种方式反复进行比较时，可以使用`strxfrm`函数减少计算量。它根据当前的locale解释的第二个参数转换为另一个不依赖于locale的字符串。尽管转换后的字符串的内容是未确定的。

~~~c
#include <locale.h>
#include <stdio.h>
#include <string.h>

int main() {
  // set local environment （to let program know the language habit now）
  setlocale(LC_ALL, "");

  const char *s1 = "apple";
  const char *s2 = "Banana";

  printf("Comparing '%s' and '%s' :\n\n", s1, s2);

  // 1. 使用 strcmp (only compare ASCII code)
  // 'a' = 97, 'B' = 66, 97 > 66
  int res_cmp = strcmp(s1, s2);
  printf("[strcmp] Result: %d\n", res_cmp);
  if (res_cmp > 0)
    printf(" -> 'apple' come AFTER 'Banana' (ASCII order)\n");
  else
    printf(" -> 'apple' comes BEFORE 'Banana'\n");

  printf("-------------------------\n");

  // 2. 使用 strcoll （compare with dictionary order ）
  // in the habit of eng, a comes before b unless the lower and upper
  int res_coll = strcoll(s1, s2);
  printf("[strcoll] Result: %d\n", res_coll);
  if (res_coll > 0)
    printf(" -> 'apple' comes AFTER 'Banana'\n");
  else
    printf(" -> 'apple' comes BEFORE 'Banana' (Dictionary order)\n");

  // 3. strxfrm showcase
  printf("\n--- strxfrm Demo ---\n");
  char buf1[100], buf2[100];

  // transform natural language into the compare 'key' used by strcmp
  strxfrm(buf1, s1, sizeof(buf1));
  strxfrm(buf2, s2, sizeof(buf2));

  // the converted content might be a bunch of gibberish or a
  // specific sequence
  // the content after transform maybe a mess of damaged code
  // or specific sequence we only care about the result of strcmp
  int res_xfrm = strcmp(buf1, buf2);
  printf("strcmp(xfrm(s1),xfrm(s2)) Result: %d\n", res_xfrm);

  if (res_coll < 0 && res_xfrm < 0) {
    printf("Verification: strxfrm result matches strcoll result!\n");
  }
  return 0;
}
~~~

> `strcoll`在只需比较少次数的字符串比`strxtrm`快，`strxtrm` + `strcmp`用空间换时间的策略。

~~~c
详细对比：为什么会这样？

  假设我们要排序 1000 个中文名字。

  1. 只用 strcoll (慢)
  排序算法（如 qsort）需要进行约 10,000 次比较 ($N \log N$)。
   * 第 1 次比较：strcoll 查阅复杂的字典规则，算出 "张三" < "李四"。
   * 第 2 次比较：strcoll 再次查阅规则，算出 "张三" > "安二"。
   * ...
   * 第 10,000 次比较：strcoll 第 N 次查阅规则...
   * 结果：同一个字符串的规则被重复解析了无数次，浪费大量 CPU。

  2. 用 strxfrm + strcmp (快)
  这是“空间换时间”的策略。
   * 预处理阶段：调用 1000 次 strxfrm。
       * 把 "张三" 转换成二进制键值 \x05\x01... (假设值)。
       * 把 "李四" 转换成二进制键值 \x08\x02...。
       * 这步虽然有开销，但每个字符串只做一次。
   * 排序阶段：进行 10,000 次 strcmp。
       * strcmp 只需要比较 \x05 和 \x08，极其快（CPU 指令级别）。
   * 结果：最耗时的“查规则”只做了 N 次，而不是 $N \log N$ 次。

  总结公式

   * 如果你只比较一次（比如 if (strcoll(a, b) > 0)）：
       * 直接用 strcoll 更快。因为 strxfrm 需要分配内存、转换，这本身也是开销。
   * 如果你要排序（比较次数远多于元素个数）：
       * strxfrm + strcmp 是王道。
~~~

> `strxfrm`就是为了把昂贵的的逻辑判断“缓存”成廉价的二进制数据。

### 16.8.3 改变locale的效果

1. locale可能向正在执行的程序所使用的字符集增加字符（但可能不会改变现存字符的含义）。
例如许多欧洲语言使用了能够提示重音、货币符号和其他特殊符号的扩展字符集。
2. 打印的方向可能会改变。尤其是，locale决定一个字符应该根据前面一个被打印的字符的那个方向进行打印。
3. printf和scanf函数家族使用当前locale定义的小数点符号。
4. 如果locale扩展了正在使用的字符集，isalpha、islower、isspace和isupper函数可能比以前包括更多的字符。
5. 正在使用的字符集的对照序列可能会改变。这个序列由strcoll函数使用，用于字符串之间的相互比较。

6. strftime函数所产生的日期和时间格式的许多方面都是特定于locale的。
