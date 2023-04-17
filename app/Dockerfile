FROM node:lts
RUN apt-get update
ENV APP_ROOT /app
WORKDIR ${APP_ROOT}
COPY ./package*.json ${APP_ROOT}/
RUN apt-get install -y openssl
RUN npm install --production
RUN npm i -g prisma
COPY ./ ${APP_ROOT}/
ARG DATABASE_URL=mysql://root:password@0.0.0.0:3306/sharegpt
# RUN npx prisma migrate deploy --schema ${APP_ROOT}/prisma/schema.prisma
RUN npm run build
EXPOSE 3000
EXPOSE 80
CMD ["npm", "run", "start"]


# FROM node:lts
# RUN apt-get update && apt-get install supervisor vim -y
# COPY supervisor_prod.conf /etc/supervisor/conf.d/
# WORKDIR /app
# COPY ./package*.json .
# RUN npm install --production
# RUN npm i -g prisma
# COPY . .
# CMD ["supervisord"]