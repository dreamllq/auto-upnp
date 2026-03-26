# auto-upnp

自动注册本机到光猫的UPnP端口映射工具。

## 安装

```bash
# 全局安装
npm install -g auto-upnp

# 或本地开发
git clone https://github.com/dreamllq/auto-upnp.git
cd auto-upnp
npm install
npm run build
npm link
```

## 使用

```bash
# 单端口映射
auto-upnp -p 8080:80/tcp

# 多端口映射
auto-upnp -p 8080:80/tcp -p 3000:3000/udp
```

### 参数格式

`-p <内部端口>:<外部端口>/<协议>`

- 内部端口: 本机服务监听的端口
- 外部端口: 路由器对外开放的端口
- 协议: `tcp` 或 `udp`

## 定时任务

配合 cron 实现自动注册（如每10分钟）：

```bash
# 编辑 crontab
crontab -e

# 添加定时任务
*/10 * * * * auto-upnp -p 8080:80/tcp
```

## 退出码

- 0: 成功
- 1: 参数错误
- 2: 运行时错误（如UPnP失败）
