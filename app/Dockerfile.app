FROM node:lts
RUN apt-get update
WORKDIR /app
COPY ./package.json .
RUN npm install --production --save
RUN npm i -g prisma
COPY . .
# RUN npx prisma generate --schema ./prisma/schema.prisma
# RUN npx prisma migrate dev --schema prisma/schema.prisma
# RUN npm run build
EXPOSE 3000
# CMD ["npm", "run", "start"]
ENTRYPOINT ["tail"]
CMD ["-f", "/dev/null"]