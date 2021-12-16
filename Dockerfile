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
ADD tsconfig.json /bot
ADD tslint.json /bot
ADD LICENSE.txt /bot

ENV YOUTUBE_DL_FILENAME yt-dlp
ENV YOUTUBE_DL_HOST 'https://api.github.com/repos/yt-dlp/yt-dlp/releases?per_page=1'
RUN yarn install && yarn build

ENV TZ UTC
ENV NODE_ENV production

CMD ["node", "./dist"]
