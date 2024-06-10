FROM node:14

ENV LANG C.UTF-8
ENV LC_ALL C.UTF-8

RUN apt-get update

RUN apt install -y python3-pip

RUN pip3 install ansible && pip3 install "pywinrm>=0.2.2"