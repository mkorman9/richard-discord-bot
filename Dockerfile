FROM node:16.7.0

RUN adduser --disabled-password --gecos "" --shell /bin/false --home /bot bot && \
    rm -rf /bot/* && \
    chown -R bot:bot /bot

ADD src/ /bot/src
ADD package.json /bot
ADD yarn.lock /bot
ADD tsconfig.json /bot
ADD tslint.json /bot
ADD LICENSE.txt /bot

WORKDIR /bot
USER bot

RUN yarn install && yarn build

ENV TZ UTC
ENV NODE_ENV production

CMD exec node ./dist
