# 工欲善其事 必先利其器
## 先快速熟练以下基本技能，才能顺利往前走：

1. element 表单组件的熟练 model/rules/validate
    1）按文档从上到下走一遍
    done.
2. element 表单组件‘嵌套表单’的处理（liteOS里新增策略有这种需求）
    Q1: 子组件的校验问题


3. slot插槽
    done 20200812
4. table组件


5. flex布局


todo. el 关联组件


### buglist
1. el-popover css 为什么无法穿透进去？
2. ColumnTemplate 栏目序号 input
      <!-- todo 这里输入为什么会失焦？ -->

## 部署
1. nginx代理 vs webpack配置

### webpack配置：


### nginx代理：
#### 客户端代码修改
1. 添加timestamp/noncestr随机数，防止服务器缓存‘对接口的请求’

#### 服务器端部署配置：
1. 先确定部署在测试服务器哪个位置
2. 拉取远程代码
3. 部署nginx
4. 如果后端有两个环境，设置两个端口转发代理

部署前端项目
下面以一个 vue 项目为例子，仅供参考 

1. 拉取项目
cd /var/www
// 拉取项目 
// 注意在 'http://' 和 'gitlab' 之间要加上用户名
git clone http://liangweiliang@gitlab.skysri.com/liangweiliang/coocaa-activity.git
2. 修改 nginx 配置
修改文件 /etc/nginx/conf.d/default.conf, 在 server 节点，添加下面配置
sudo vim /etc/nginx/conf.d/default.conf

location /coocaa-activity/ {
    alias /var/www/coocaa-activity/dist/;
}
# 转发后端的请求的配置，如果不需要转发，则不用
location /admin-api/ {
    proxy_pass http://172.20.139.237:3085;
}
3. 热重启 nginx
# 检查 nginx 配置是否有错误 
sudo nginx -t
# 如果没提示有错误， 用下面命令热重启
sudo nginx -s reload

