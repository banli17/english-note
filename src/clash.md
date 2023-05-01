# centos 安装 clash 

## 1. 安装 clash

https://github.com/Dreamacro/clash/releases

大多数时候下载 clash-linux-amd64-vxxxx.gz 即可。

```sh
gunzip clash-linux-amd64-v1.8.0.gz
mv clash-linux-amd64-v1.8.0 ~/clash
chmod +x ~/clash
./clash
```

## 2. 配置 clash

执行 `./clash` 会生成默认配置文件 `~/.config/clash`。里面有 config.yaml 和 Country.mmdb 两个文件。

```sh
ls ~/.config/clash
```

显示结果：

```sh
cache.db  config.yaml  Country.mmdb
```

大多情况下 config.yaml 中已经写好了规则，包括 HTTP/HTTPS 代理的端口，如果不确定的话可以打开 `config.yaml` 查看。

执行以下命令即可临时设置系统代理：

```sh
export http_proxy=http://127.0.0.1:7890
export https_proxy=http://127.0.0.1:7890
```

使用自己的订阅配置替换 `config.yaml`。

```sh
wget -O config.yaml https://service.tencecs.com/link/jtfEpoG3c?clash=1
mv config.yaml ~/.config/clash
```

然后验证 google 是否可以访问。

```sh
$] curl google.com
<HTML><HEAD><meta http-equiv="content-type" content="text/html;charset=utf-8">
<TITLE>301 Moved</TITLE></HEAD><BODY>
<H1>301 Moved</H1>
The document has moved
<A HREF="http://www.google.com/">here</A>.
</BODY></HTML>
```

## 3. Clash 自启动及后台运行

将以下脚本保存为 `/etc/systemd/system/clash.service` ：

```sh
[Unit]
Description=Clash service
After=network.target

[Service]
Type=simple
User=root
ExecStart=/root/clash
Restart=on-failure
RestartPreventExitStatus=23

[Install]
WantedBy=multi-user.target
```

使用以下命令启动服务，设置开机启动，以及检查服务状态



```sh
# 重载服务
sudo systemctl daemon-reload
# 开机启动
sudo systemctl enable clash
# 启动服务
sudo systemctl start clash
# 查看服务状态
sudo systemctl status clash
```

## 4. 代理设置

运行 `vim ~/.bashrc` ，在文件末尾添加：

```sh
export http_proxy=127.0.0.1:7890
export https_proxy=127.0.0.1:7890
```

保存后运行 `source ~/.bashrc` 使配置生效。之后可以重启服务器，然后运行 `sudo systemctl status clash` 检查 Clash 的服务状态，再访问需要代理的网站验证是否可用。

## 参考

- https://www.idcbuy.net/it/linux/981.html