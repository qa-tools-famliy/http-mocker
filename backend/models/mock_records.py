# -*- coding: UTF-8 -*-
"""
# www.missshi.cn
"""
import json
import pymongo
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


def query_mock_records_by_condition_and_page(conditions, page_number, page_size):
    """
    # 根据指定查询条件进行记录查询
    :param conditions:
    :return:
    """
    total = mongodb_instance[collection_name].find(conditions).count()
    result_list = list(mongodb_instance[collection_name].find(conditions).sort(
            "datetime", pymongo.DESCENDING
        ).skip((page_number - 1) * page_size).limit(page_size))
    result = json.loads(JSONEncoder().encode(result_list))
    return result, total


def remove_mock_records(conditions):
    """
    # 删除无效请求记录
    :param conditions:
    :return:
    """
    mongodb_instance[collection_name].remove(conditions)
