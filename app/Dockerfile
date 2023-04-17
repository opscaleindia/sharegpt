FROM node:18.15.0
RUN apt-get update
WORKDIR /app
COPY ./package.json .
RUN apt-get install -y openssl
RUN npm install --production --save
RUN npm i -g prisma
COPY . .
ARG DATABASE_URL=mysql://root:password@0.0.0.0:3306/sharegpt
RUN npx prisma generate --schema ./prisma/schema.prisma
RUN npx prisma migrate deploy --schema prisma/schema.prisma
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start"]
# ENTRYPOINT ["tail"]
# CMD ["-f", "/dev/null"]


# FROM node:lts
# RUN apt-get update && apt-get install supervisor vim -y
# COPY supervisor_prod.conf /etc/supervisor/conf.d/
# WORKDIR /app
# COPY ./package*.json .
# RUN npm install --production
# RUN npm i -g prisma
# COPY . .
# CMD ["supervisord"]