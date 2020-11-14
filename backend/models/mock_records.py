# -*- coding: UTF-8 -*-
"""
# www.missshi.cn
"""
import json
from utils.mongoize import JSONEncoder
from models.connection import mongodb_instance


collection_name = "mock_records"


def add_mock_records(data):
    """
    # 写入一条Mock请求记录
    :return: container_list
    """
    item_id = mongodb_instance[collection_name].insert(data)
    return str(item_id)


def query_mock_records_by_condition(conditions):
    """
    # 根据指定查询条件进行记录查询
    :param conditions:
    :return:
    """
    result = list(mongodb_instance[collection_name].find(conditions))
    result = json.loads(JSONEncoder().encode(result))
    return result


def remove_mock_records(conditions):
    """
    # 删除无效请求记录
    :param conditions:
    :return:
    """
    mongodb_instance[collection_name].remove(conditions)
