FROM ubuntu:20.04

ARG DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install python3 python3-pip -y

COPY $PWD/requirements.txt /requirements.txt
RUN pip3 install -r requirements.txt

ADD . /app
COPY ./src /app
WORKDIR /app

ENTRYPOINT ["tail"]
CMD ["-f","/dev/null"]
