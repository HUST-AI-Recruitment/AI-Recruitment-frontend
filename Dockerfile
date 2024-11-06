# ===== 第一阶段：构建应用 =====
FROM node:20-alpine AS build-stage
WORKDIR /usr/src/app

# 复制依赖文件
COPY package*.json ./

# 安装依赖
RUN npm install

# 复制源代码
COPY . .

# 构建应用
RUN npm run build

# ===== 第二阶段：生产环境 =====
FROM nginx:latest

# 复制构建产物到 Nginx 的默认静态文件目录
COPY --from=build-stage /usr/src/app/build /usr/share/nginx/html

# 如果您有自定义的 Nginx 配置文件，可以取消注释并确保 `nginx.conf` 存在
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露端口
EXPOSE 80

# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"]