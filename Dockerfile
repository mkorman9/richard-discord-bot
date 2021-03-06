FROM node:16.7.0

USER root

RUN rm /usr/bin/python && \
  ln -s /usr/bin/python3 /usr/bin/python

RUN mkdir -p /bot
WORKDIR /bot

ADD src/ /bot/src
ADD templates/ /bot/templates
ADD package.json /bot
ADD yarn.lock /bot
ADD .npmrc /bot
ADD tsconfig.json /bot
ADD tslint.json /bot
ADD LICENSE.txt /bot

RUN yarn install && yarn build

ENV TZ UTC
ENV NODE_ENV production

CMD ["npm", "run", "exec"]
