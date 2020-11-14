# -*- coding: UTF-8 -*-
"""
# missshi
"""
import time
from pymongo import MongoClient

from config import MONGODB_PORT
from config import MONGODB_URL_LIST
from config import MONGODB_DBNAME


mongodb_str = "mongodb://"
if isinstance(MONGODB_URL_LIST, list):
    for mongodb_url in MONGODB_URL_LIST:
        mongodb_str += mongodb_url + ":" + str(MONGODB_PORT) + ","
    mongodb_str = mongodb_str[:-1]
else:
    mongodb_str = "mongodb://" + MONGODB_URL_LIST + ":" + str(MONGODB_PORT)


def get_mongodb():
    """
    通过pymongo方式连接数据库
    :return: assessDB对象
    """
    while True:
        try:
            mongodb_client = MongoClient(mongodb_str)
            if mongodb_client:
                break
            else:
                time.sleep(1)
        except Exception as e:
            time.sleep(1)
    return mongodb_client


mongodb_instance = get_mongodb()[MONGODB_DBNAME]
