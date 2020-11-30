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
from jsonschema import validate
from utils.etcd_utils import insert_etcd_data
from utils.etcd_utils import delete_etcd_key
from utils.etcd_utils import fetch_all_etcd_data_list


response_options_schema = {
    "type": "array",
    "minItems":1,
    "items": {
        "type": "object",
        "required": [
            "generate_way",
            "response_code",
            "response_data",
            "response_format",
            "weight"
        ],
        "properties": {
            "generate_way": {
                "type": "string",
                "enum" : ["fixed", "script"]
            },
            "response_code": {
                "type": "number"
            },
            "response_data": {
                "type": "object"
            },
            "response_format": {
                "type": "string",
                "enum" : ["json"]
            },
            "weight": {
                "type": "number"
            }
        }
    }
}

chaos_rules_schema = {
    "type": "array",
    "items": {
        "type": "object",
        "required": [
            "type",
            "percent",
            "max",
            "min"
        ],
        "properties": {
            "type": {
                "type": "string",
                "enum" : ["delay"]
            },
            "percent": {
                "type": "number"
            },
            "max": {
                "type": "number"
            },
            "min": {
                "type": "number"
            }
        }
    }
}


rules_api = Blueprint("rules_api", __name__)


@rules_api.route('/api/mock_rules', methods=['GET', 'POST', 'DELETE'])
def mock_rules_manage():
    """
    # mock规则管理
    # POST用于新增和覆盖
    # DELETE用于删除
    :return:
    """
    if request.method == 'GET':
        page_number = int(request.args.get('page_num', 1))
        page_size = int(request.args.get("page_size", 10))
        search_url = request.args.get("url", "")
        search_method = request.args.get("method", "")
        search_source_ip = request.args.get("source_ip", "")
        result_list = []
        result_count = 0
        rule_list = fetch_all_etcd_data_list()
        for item in rule_list:
            key = item.key.replace("/mock_urls", "")
            key_info = key.split("|")
            item_info = {}
            if len(key_info) == 3:
                item_info["url"] = key_info[0]
                item_info["method"] = key_info[1]
                item_info["source_ip"] = key_info[2]
            elif len(key_info) == 2:
                item_info["url"] = key_info[0]
                item_info["method"] = key_info[1]
                item_info["source_ip"] = "*"
            elif len(key_info) == 1:
                item_info["url"] = key_info[0]
                item_info["method"] = "*"
                item_info["source_ip"] = "*"
            if item.value:
                if search_url not in item_info["url"]:
                    continue
                if search_method not in item_info["method"]:
                    continue
                if search_source_ip not in item_info["source_ip"]:
                    continue
                config = json.loads(item.value)
                item_info["response_options"] = json.loads(item.value)["response_options"]
                if "chaos_rules" in config:
                    item_info["chaos_rules"] = json.loads(item.value)["chaos_rules"]
                else:
                    item_info["chaos_rules"] = []
                result_list.append(item_info)
                result_count += 1
        result_list = sorted(result_list, key=lambda rule_item: rule_item["url"] + rule_item["method"]
                                                                + rule_item["source_ip"])
        result_list = result_list[(page_number - 1) * page_size: page_number * page_size]
        result = {
            "code": 200,
            "message": "success",
            "data": {
                "rule_list": result_list,
                "total": result_count
            }
        }
        return make_response(jsonify(result))
    elif request.method == 'POST':
        json_data = request.get_json()
        if "url" not in json_data or not json_data["url"]:
            result = {
                "code": 400,
                "message": "url is required",
                "data": None
            }
            return make_response(jsonify(result))
        if not json_data["url"].startswith("/"):
            result = {
                "code": 400,
                "message": "url must startwith /",
                "data": None
            }
            return make_response(jsonify(result))
        key = "/mock_urls" + json_data["url"]
        if "method" in json_data and json_data["method"] in ["GET", "POST", "PUT", "DELETE"]:
            key = key + "|" + json_data["method"]
        if "source_ip" in json_data and json_data["source_ip"] and json_data["source_ip"] != "*":
            key = key + "|" + json_data["source_ip"]

        response_options = json.loads(json_data["response_options"])
        try:
            validate(instance=response_options, schema=response_options_schema)
        except Exception as e:
            result = {
                "code": 400,
                "message": "响应配置参数校验失败: %s" % str(e),
                "data": None
            }
            return make_response(jsonify(result))

        insert_data = {
            "response_options": response_options
        }

        if "chaos_rules" in json_data and json_data["chaos_rules"]:
            chaos_rules = json.loads(json_data["chaos_rules"])
            try:
                validate(instance=chaos_rules, schema=chaos_rules_schema)
            except Exception as e:
                result = {
                    "code": 400,
                    "message": "异常注入参数校验失败: %s" % str(e),
                    "data": None
                }
                return make_response(jsonify(result))
            insert_data["chaos_rules"] = chaos_rules

        logger.info("update rule key: %s" % key)
        insert_etcd_data(key, json.dumps(insert_data))
        result = {
            "code": 200,
            "message": "success",
            "data": None
        }
        return make_response(jsonify(result))
    elif request.method == 'DELETE':
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
        logger.info("delete rule key: %s" % key)
        delete_etcd_key(key)
        result = {
            "code": 200,
            "message": "success",
            "data": None
        }
        return make_response(jsonify(result))
