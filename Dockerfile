FROM node:17

WORKDIR /usr/src

COPY server server
COPY sumsynth-client sumsynth-client

WORKDIR /usr/src/server

RUN ./install-docker.sh

RUN npm i
RUN npm i -g nodemon


WORKDIR /usr/src/sumsynth-client
RUN npm i


WORKDIR /usr/src
COPY entrypoint.sh entrypoint.sh

CMD ./entrypoint.sh
