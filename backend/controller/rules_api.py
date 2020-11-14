# -*- coding: UTF-8 -*-
"""
# www.missshi.cn
"""
import json
from logzero import logger
from flask import Blueprint
from flask import make_response
from flask import jsonify
from flask import request
from utils.etcd_utils import insert_etcd_data
from utils.etcd_utils import delete_etcd_key


rules_api = Blueprint("rules_api", __name__)


@rules_api.route('/mock_rules', methods=['POST', 'DELETE'])
def mock_rules_manage():
    """
    # mock规则管理
    # POST用于新增和覆盖
    # DELETE用于删除
    :return:
    """
    json_data = request.get_json()
    if "url" not in json_data or not json_data["url"]:
        result = {
            "code": 400,
            "message": "url is required",
            "data": None
        }
        return make_response(jsonify(result))
    key = "/mock_urls" + json_data["url"]
    if "method" in json_data and json_data["method"] in ["GET", "POST", "PUT", "DELETE"]:
        key = key + "|" + json_data["method"]
    if "source_ip" in json_data and json_data["source_ip"]:
        key = key + "|" + json_data["source_ip"]
    request_method = request.method
    if request_method == "DELETE":
        logger.info("delete rule key: %s" % key)
        delete_etcd_key(key)
    else:
        insert_data = {
            "response_options": json_data["response_options"]
        }
        if "chaos_rules" in json_data and json_data["chaos_rules"]:
            insert_data["chaos_rules"] = json_data["chaos_rules"]
        logger.info("update rule key: %s" % key)
        insert_etcd_data(key, json.dumps(insert_data))
    result = {
        "code": 200,
        "message": "success",
        "data": None
    }
    return make_response(jsonify(result))
