FROM --platform=linux/amd64 node:16.14.2-alpine
RUN apk upgrade --available && sync
RUN apk --no-cache --virtual build-dependencies add \
  python3 \
  make \
  g++ \
  bash
WORKDIR /app
COPY package.json .
COPY yarn.lock .
RUN yarn install --frozen-lockfile
RUN yarn prebuild bcrypt --build-from-source
COPY . .
RUN yarn prisma generate
RUN yarn build
CMD yarn prisma migrate deploy && yarn start
