FROM python:3

MAINTAINER wangzhe "wangzhe0912@tju.edu.cn"

ENV LC_ALL en_US.UTF-8
ENV LANG en_US.UTF-8

WORKDIR /home/work/mock-management

COPY requirements.txt ./

RUN pip3 install -r requirements.txt

COPY . .

CMD [ "python3", "/home/work/mock-management/flask_server.py"]

EXPOSE 8080
