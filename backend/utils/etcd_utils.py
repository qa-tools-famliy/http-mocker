# -*- coding: UTF-8 -*-
"""
# www.missshi.cn
"""
import json
import etcd
from config import ETCD_ADDRESS, ETCD_PORT

etcd_client = etcd.Client(host=ETCD_ADDRESS, port=int(ETCD_PORT))


def create_etcd_dir():
    """
    # 创建对应的ETCD目录
    :return:
    """
    pass
    # etcd_client.write("/mock_urls", "", dir=True)


def delete_etcd_key(key):
    """
    # 从ETCD中删除指定key
    :param key:
    :return:
    """
    etcd_client.delete(key)


def insert_etcd_data(key, value):
    """
    # 向etcd中写入键值对
    :param key:
    :param value:
    :return:
    """
    etcd_client.write(key, value)


def fetch_all_etcd_data_list():
    """
    # 获取etcd中的全部数据
    :return:
    """
    try:
        data_list = etcd_client.read("/mock_urls", recursive=True).children
    except Exception as e:
        data_list = []
    return data_list


def watch_etcd_data_change():
    """
    # 监听ETCD中的数据变化
    :return:
    """
    data = etcd_client.read("/mock_urls", recursive=True, wait=True, timeout=10)
    return data
