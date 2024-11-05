# 使用官方的 Node.js 18 版本作为基础镜像
FROM node:22-alpine

# 在容器内创建并设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json（如果有）到工作目录
COPY package*.json ./

# 安装依赖
RUN npm install

# 复制应用程序的所有源代码到工作目录
COPY . .

# 暴露应用运行的端口
EXPOSE 3000

# 定义容器启动时运行的命令
CMD ["npm", "start"]