FROM node:16.7.0

USER root

RUN mkdir -p /bot
WORKDIR /bot

ADD src/ /bot/src
ADD templates/ /bot/templates
ADD package.json /bot
ADD yarn.lock /bot
ADD tsconfig.json /bot
ADD tslint.json /bot
ADD LICENSE.txt /bot

RUN yarn install && yarn build

ENV TZ UTC
ENV NODE_ENV production

CMD ["node", "./dist"]
