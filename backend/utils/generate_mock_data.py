# -*- coding: UTF-8 -*-
"""
# www.missshi.cn
"""
import time
import random
from flask import make_response
from flask import jsonify


def generate_mock_info_by_script(path, method, json_data, param_data, form_data, headers, script):
    """
    # 根据请求信息构建响应信息
    :param path:
    :param method:
    :param json_data:
    :param param_data:
    :param form_data:
    :param headers:
    :return:
    """
    response_data = {}
    response_code = 200
    response_format = "json"
    return response_data, response_code, response_format


def generate_mock_info_by_fixed(response_option):
    """
    # 根据请求信息构建响应信息
    :param path:
    :param method:
    :param json_data:
    :param param_data:
    :param form_data:
    :param headers:
    :return:
    """
    response_data = response_option["response_data"]
    if "response_code" in response_option and response_option["response_code"]:
        response_code = int(response_option["response_code"])
    else:
        response_code = 200
    response_format = response_option["response_format"]
    return response_data, response_code, response_format


def get_mock_response(path, method, json_data, param_data, form_data, headers, response_options):
    """
    # 构建响应数据
    :param path:
    :param method:
    :param json_data:
    :param param_data:
    :param form_data:
    :param headers:
    :param response_options:
    :return:
    """
    # Step1: 根据weight选择策略
    total_weight = 0
    for response_option in response_options:
        if "weight" in response_option and response_option["weight"]:
            total_weight += int(response_option["weight"])
        else:
            total_weight += 1
    random_value = random.randint(1, total_weight)
    choose_weight = 0
    choose_option = None
    for response_option in response_options:
        if "weight" in response_option and response_option["weight"]:
            choose_weight += int(response_option["weight"])
        else:
            total_weight += 1
        if choose_weight >= random_value:
            choose_option = response_option
            break

    # Step2: 根据策略类型执行策略
    if choose_option["generate_way"] == "fixed":
        response_data, response_code, response_format = generate_mock_info_by_fixed(choose_option)
    else:
        response_data, response_code, response_format = generate_mock_info_by_script(
            path, method, json_data, param_data, form_data, headers, choose_option["script_content"]
        )
    return response_data, response_code, response_format


def get_mock_rules(global_url_config, url, method, source_ip):
    """
    # 根据url, method, source_ip判断是否有对应的规则
    :param global_url_config:
    :param url:
    :param method:
    :param source_ip:
    :return:
    """
    keys = [
        "%s|%s|%s" % (url, method, source_ip),
        "%s|%s" % (url, source_ip),
        "%s|%s" % (url, method),
        url
    ]
    for key in keys:
        if key in global_url_config:
            return key, global_url_config[key]
    return "", None


def generate_mock_response(response_data, response_code, response_format):
    """
    # 生成HTTP响应结果
    :param response_data:
    :param response_code:
    :param response_format:
    :return:
    """
    if response_format == "text":
        result = make_response(response_data, response_code)
    else:
        result = make_response(jsonify(response_data), response_code)
    return result


def apply_mock_chaos(chaos_rules):
    """
    # 执行Chaos注入的相关异常
    :param chaos_rules:
    :return:
    """
    chaos_list = []
    for chaos_rule in chaos_rules:
        if chaos_rule["type"] == "delay":
            if random.randint(1, 100) >= int(chaos_rule["percent"]):
                # 异常策略生效
                delay_time = random.randint(int(chaos_rule["max"]), int(chaos_rule["min"]))
                time.sleep(delay_time / 1000.0)
                chaos_list.append({
                    "type": "delay",
                    "delay_time": delay_time
                })
    return chaos_list
