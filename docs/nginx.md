# Nginx

## Http 服务

URL 格式分为 9 部分：

```sh
<scheme>://<username>:<password>@<host>:<port>/<path>;<parameters>?<query>#<fragment>
```

- scheme: 协议，必须以字母开头，并以`:`号和 URL 其余部分分隔
- username: 用户名，http 中不常见, ftp 中比较常见
- password：密码
- host：主机，可能是域名或 IP 地址，域名会被解析为 ip(DNS 查找)
- port：端口，表示要连接的服务器进程（监听的端口）
- path：路径，表示资源在服务器的位置
- parameters：参数，用 `;` 分隔，不常见
- query：查询，通常用 & 分隔，用分号分隔也可以
- fragment: 片段，用于定位资源中的特定部分，http 中它不会发送给后端

```sh
http://example.com/foo;key1=value1?key2=value2#key3=value3
```

## URL 特殊字符

关于在 URL 中使用哪些字符是安全的，哪些不安全，以及 URL 应该如何正确编码，存在很多混淆。

当涉及到 URL 时，您需要注意几组字符。

1、URL 保留字

```sh
“；” | “/” | “？” | “：” | “@” | “&” | “=”| “+” | “$” | ","
```

这些字符通常按原样在 URL 中使用，并且在 URL 上下文中有意义。

2、非保留字符

```sh
“-” | “_” | “。” | “！” | “~” | “*” | "'" | “（” | “）”
```

这些字符可以按原样包含在 URL 的任何部分。不建议编码和转义。

3、不明智字符

```sh
“{” | “}” | “|” | “\” | “^” | “[” | "]" | “`”
```

这些字符可能被网关作为分隔符，如果它作为 URL 一部分（如 query），应始终对它们编码和转义。

4、排除字符，由控制字符，空格字符和后面的字符（定界符）组成

```sh
“<” | “>” | “#” | “％” | '"'
```

控制字符是不可打印字符，必须转义，# 和 % 在 URL 上有特殊意义，相当于保留字符。`< > "` 常用于分隔文本中的 URL。

编码方式是 % + ASCII 十六进制字符，如空格字符的 URL 编码是 %20，% 字符编码是 %25。

https://condor.depaul.edu/sjost/it236/documents/ascii.htm
https://www.ietf.org/rfc/rfc2396.txt

## 绝对 URL 和相对 URL

1、带协议的 URL 是绝对 URL。

2、相对 URL 通过 index.html 中的 base URL 定位。如果没有指定 base URL，则以当前页面 URL 作为相对 URL。