---
title: Advanced Calculus Formulas
published: 2025-05-01
description: "基本上用不到的数学公式"
category: Math
tags: ["calculus", "math", "Newton", "Leibniz", "Mathjax"]
draft: false
--- 

## 一、极限与连续

### 数列极限

$$
\lim_{n \to \infty} a_n = A
$$

### 函数极限

$$
\lim_{x \to a} f(x) = L
$$

### 无穷小与无穷大

$$
\lim_{x \to 0} x^2 = 0 \quad (\text{无穷小})
$$

$$
\lim_{x \to 0} \frac{1}{x} = \infty \quad (\text{无穷大})
$$

### 洛必达法则

$$
\lim_{x \to a} \frac{f(x)}{g(x)} = \lim_{x \to a} \frac{f'(x)}{g'(x)} \quad \text{（0/0 型或 ∞/∞ 型）}
$$

---

## 二、导数与微分

### 导数定义

$$
f'(x) = \lim_{\Delta x \to 0} \frac{f(x + \Delta x) - f(x)}{\Delta x}
$$

### 常见函数导数

$$
\frac{d}{dx} x^n = nx^{n-1}, \quad \frac{d}{dx} \sin x = \cos x, \quad \frac{d}{dx} e^x = e^x
$$

### 微分

$$
dy = f'(x)\,dx
$$

---

## 三、微分中值定理

### 罗尔定理

若 $f(a) = f(b)$，则存在 $\xi \in (a, b)$ 使得：
$$
f'(\xi) = 0
$$

### 拉格朗日中值定理

$$
f'(\xi) = \frac{f(b) - f(a)}{b - a}
$$

### 柯西中值定理

$$
\frac{f'(\xi)}{g'(\xi)} = \frac{f(b) - f(a)}{g(b) - g(a)}
$$

---

## 四、不定积分

### 基本积分表

$$
\int x^n \, dx = \frac{x^{n+1}}{n+1} + C \quad (n \ne -1)
$$

$$
\int e^x \, dx = e^x + C, \quad \int \frac{1}{x} \, dx = \ln|x| + C
$$

---

## 五、定积分

### 定积分定义

$$
\int_a^b f(x)\,dx = \lim_{n \to \infty} \sum_{i=1}^{n} f(x_i^*)\Delta x
$$

### 牛顿-莱布尼茨公式

$$
\int_a^b f(x)\,dx = F(b) - F(a)
$$

---

## 六、积分技巧

### 换元积分法

若 $x = \varphi(t)$，则：
$$
\int f(x)\,dx = \int f(\varphi(t)) \varphi'(t)\,dt
$$

### 分部积分法

$$
\int u\,dv = uv - \int v\,du
$$

---

## 七、曲线积分

### 第一类曲线积分

$$
\int_L f(x, y)\, ds
$$

### 第二类曲线积分

$$
\int_L P(x, y)\,dx + Q(x, y)\,dy
$$

---

## 八、二重积分

### 直角坐标系下

$$
\iint_D f(x, y)\, dx\,dy
$$

### 极坐标下

$$
\iint_D f(r, \theta)\, r\,dr\,d\theta
$$

---

## 九、其他重要公式

### 泰勒展开（以 $x = a$ 展开）

$$
f(x) = f(a) + f'(a)(x - a) + \frac{f''(a)}{2!}(x - a)^2 + \cdots
$$

### 麦克劳林展开（$a = 0$）

$$
\sin x = x - \frac{x^3}{3!} + \frac{x^5}{5!} - \cdots
$$

---

以上是高等数学中常见的重要公式，建议配合图形、例题或练习一起使用，帮助记忆和理解。
