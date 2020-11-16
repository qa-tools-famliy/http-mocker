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
from models.mock_records import query_mock_records_by_condition_and_page


records_api = Blueprint("records_api", __name__)


@records_api.route('/api/query_mock_records', methods=['GET', 'POST'])
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
    if "requests_path" in json_data and json_data["requests_path"]:
        query_condition["requests_path"] = json_data["requests_path"]
    if "source_ip" in json_data and json_data["source_ip"]:
        query_condition["source_ip"] = json_data["source_ip"]
    if "method" in json_data and json_data["method"]:
        query_condition["method"] = json_data["method"]
    if "page_num" in json_data:
        page_number = int(json_data["page_number"])
    else:
        page_number = 1
    if "page_size" in json_data:
        page_size = int(json_data["page_size"])
    else:
        page_size = 10
    records_items, total_number = query_mock_records_by_condition_and_page(
        query_condition, page_number, page_size
    )
    result = {
        "code": 200,
        "message": "success",
        "data": {
            "record_list": records_items,
            "total": total_number
        }
    }
    return make_response(jsonify(result))
