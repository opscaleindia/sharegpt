#  FROM node:lts
# RUN apt-get update
# RUN apt-get install -y openssl
# WORKDIR /app
# COPY ["package.json", "package-lock.json", "./"]
# RUN npm install --production
# RUN npm i -g prisma
# COPY . .
# RUN npx prisma generate --schema ./prisma/schema.prisma
# RUN npx next build
# EXPOSE 3000
# CMD ["npm", "run", "start"]


# FROM node:lts
# RUN apt-get update
# RUN apt-get install -y openssl
# WORKDIR /app
# COPY ["package.json", "package-lock.json", "./"]
# RUN npm install --production
# RUN npm i -g prisma
# COPY . .
# CMD npm run build && npm run start

FROM node:lts
RUN apt-get update && apt-get install supervisor vim -y
COPY supervisor_prod.conf /etc/supervisor/conf.d/
WORKDIR /app
COPY ./package*.json .
RUN npm install --production
RUN npm i -g prisma
COPY . .
CMD ["supervisord"]