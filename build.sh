docker login --username=kkkstra registry.cn-hangzhou.aliyuncs.com
docker build -t ai-recruit-frontend:latest .
docker tag ai-recruit-frontend:latest registry.cn-hangzhou.aliyuncs.com/kkkstra/ai-recruit-frontend:latest
docker push registry.cn-hangzhou.aliyuncs.com/kkkstra/ai-recruit-frontend:latest