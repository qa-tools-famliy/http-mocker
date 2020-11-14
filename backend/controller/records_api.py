# -*- coding: UTF-8 -*-
"""
# www.missshi.cn
"""
import time
from logzero import logger
from flask import Blueprint
from flask import make_response
from flask import jsonify
from flask import request
from models.mock_records import query_mock_records_by_condition


records_api = Blueprint("records_api", __name__)


@records_api.route('/query_mock_records', methods=['GET', 'POST'])
def query_mock_records():
    """
    # 查询Mock服务请求记录
    :return:
    """
    json_data = request.get_json()
    query_condition = {}
    if not json_data:
        result = {
            "code": 400,
            "message": "fail: latest_time_range must be input",
            "data": []
        }
        return make_response(jsonify(result), 400)
    if "begin_time" in json_data and "end_time" in json_data:
        pass
    elif "latest_time_range" in json_data:
        begin_time = int(time.time()) - int(json_data["latest_time_range"])
        query_condition["timestamp"] = {
            "$gt": begin_time
        }
    else:
        result = {
            "code": 400,
            "message": "fail: latest_time_range must be input",
            "data": []
        }
        return make_response(jsonify(result), 400)
    if "url" in json_data:
        query_condition["requests_path"] = json_data["url"]
    if "device_ip" in json_data:
        query_condition["source_ip"] = json_data["device_ip"]
    records_items = query_mock_records_by_condition(query_condition)
    result = {
        "code": 200,
        "message": "success",
        "data": records_items
    }
    return make_response(jsonify(result))
