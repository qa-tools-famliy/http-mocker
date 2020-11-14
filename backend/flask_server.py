# -*- coding: UTF-8 -*-
"""
# 自定义的Mock服务
"""
import os
import time
import json
import logzero
import logging
import signal
from threading import Thread
import etcd
from logzero import logger
from flask import Flask
from flask import jsonify
from flask import make_response
from flask import request
from models.mock_records import query_mock_records_by_condition
from crontabs.overdue_data_cleaning import mongodb_overdue_data_cleaning
from utils.id_generator import generator_id
from utils.generate_mock_data import get_mock_response
from utils.generate_mock_data import get_mock_rules
from utils.generate_mock_data import generate_mock_response
from utils.generate_mock_data import apply_mock_chaos
from utils.save_record_to_mongo import send_mock_service_record_to_mongo
from utils.etcd_utils import insert_etcd_data
from utils.etcd_utils import delete_etcd_key
from utils.etcd_utils import fetch_all_etcd_data_list
from utils.etcd_utils import watch_etcd_data_change
from config import HTTP_PORT


app = Flask(__name__)


@app.route('/health')
def health():
    """
    # 健康检查脚本
    :return:
    """
    result = {
        "code": 200,
        "message": "success",
        "data": "READY"
    }
    return make_response(jsonify(result))


@app.route('/keys')
def inner_keys():
    """
    # 获取内部的KEY
    :return:
    """
    global global_url_config
    result = {
        "code": 200,
        "message": "success",
        "data": global_url_config
    }
    return make_response(jsonify(result))


@app.route('/mock_rules', methods=['POST', 'DELETE'])
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
        delete_etcd_key(key)
    else:
        insert_data = {
            "response_options": json_data["response_options"]
        }
        if "chaos_rules" in json_data and json_data["chaos_rules"]:
            insert_data["chaos_rules"] = json_data["chaos_rules"]
        insert_etcd_data(key, json.dumps(insert_data))
    result = {
        "code": 200,
        "message": "success",
        "data": None
    }
    return make_response(jsonify(result))


@app.route('/query_mock_records', methods=['GET', 'POST'])
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


@app.route('/<path:path>', methods=['GET', 'POST', 'PUT', 'DELETE'])
def get_dir(path):
    """
    # 匹配全部路径
    :param path:
    :return:
    """
    # 解析传入的数据
    # 请求方式
    path = "/" + path
    request_id = generator_id()
    logger.info("接收一个新的请求，请求path为%s，处理ID为%s" % (path, request_id))
    method = request.method
    logger.info("%s 接收到的请求方式为%s" % (request_id, method))

    try:
        # json传入
        json_data = request.get_json()
        logger.info("%s 接收到的JSON数据为%s" % (request_id, json.dumps(json_data)))
    except Exception as e:
        json_data = {}
        logger.info("解析接收到的JSON数据异常%s" % str(e))
    # param传入
    # 说明：request.args中每个key对应一个list，而不是一个元素，后期可能需要专门处理
    try:
        param_data = dict(request.args)
        logger.info("%s 接收到的param数据为%s" % (request_id, json.dumps(param_data)))
    except Exception as e:
        param_data = {}
        logger.info("解析接收到的param数据异常%s" % str(e))
    # form传入
    try:
        form_data = request.form.to_dict()
        logger.info("%s 接收到的form数据为%s" % (request_id, json.dumps(form_data)))
    except Exception as e:
        form_data = {}
        logger.info("解析接收到的form数据异常%s" % str(e))
    # headers传入
    try:
        headers = dict(request.headers)
        logger.info("%s 接收到的headers为%s" % (request_id, json.dumps(headers)))
    except Exception as e:
        headers = {}
        logger.info("解析接收到的headers数据异常%s" % str(e))

    # Step2：构造对应的Mock数据
    # Step2.1: 从全局变量中找出对应的规则
    global global_url_config
    mock_rule_name, mock_rule_info = get_mock_rules(global_url_config, path, method, source_ip=request.remote_addr)
    if not mock_rule_info:
        logger.info("%s 没有匹配到对应的规则" % request_id)
        response_data = {}
        response_code = 200
        response_format = "json"
        chaos_list = []
    else:
        logger.debug("%s 匹配到对应的规则: %s" % (request_id, json.dumps(mock_rule_info)))
        if "chaos_rules" in mock_rule_info and mock_rule_info["chaos_rules"]:
            logger.debug("%s 包含chaos规则: %s，开始执行" % (request_id, json.dumps(mock_rule_info["chaos_rules"])))
            chaos_list = apply_mock_chaos(mock_rule_info["chaos_rules"])
        else:
            chaos_list = []
        response_data, response_code, response_format = get_mock_response(
            path, method, json_data, param_data, form_data, headers, mock_rule_info["response_options"]
        )
        logger.info("%s 构造得到的响应数据为%s，返回码为%s，返回格式为%s" % (
            request_id, json.dumps(response_data), str(response_code), response_format
        ))

    # 将结果写入ES中
    send_mock_service_record_to_mongo({
        "request_id": request_id,
        "method": method,
        "json_data": json.dumps(json_data),
        "param_data": json.dumps(param_data),
        "form_data": json.dumps(form_data),
        "headers": json.dumps(headers),
        "requests_path": path,
        "response_data": response_data,
        "response_code": response_code,
        "response_format": response_format,
        "source_ip": request.remote_addr,
        "chaos_list": chaos_list,
        "mock_rule": mock_rule_name
    })
    # Step3：返回结果
    return generate_mock_response(response_data, response_code, response_format)


class HistoryCleaner(object):
    """
    # 历史数据清除
    """
    def __init__(self):
        """
        # 初始化函数
        """
        self._running = True

    def terminate(self):
        """
        # 终止函数
        """
        self._running = False

    def run(self):
        """
        # 启动函数
        """
        logger.info("HistoryCleaner starting")
        count = 0
        while self._running:
            time.sleep(6)  # 10分钟执行一次
            count += 1
            if count % 100 != 0:
                continue
            count = 0
            try:
                mongodb_overdue_data_cleaning()
                logger.info("HistoryCleaner success.")
            except Exception as e:
                logger.error("HistoryCleaner error: %s" % str(e))
        logger.info("HistoryCleaner grace exit")


class EtcdWatcher(object):
    """
    # ETCD数据监听
    """
    def __init__(self):
        """
        # 初始化函数
        """
        self._running = True

    def terminate(self):
        """
        # 终止函数
        """
        self._running = False

    def run(self):
        """
        # 启动函数
        """
        logger.info("EtcdWatcher starting")
        global global_url_config

        # 启动时读取全部数据
        init_data_list = fetch_all_etcd_data_list()
        for item in init_data_list:
            key = item.key.replace("/mock_urls", "")
            value = item.value
            if value:
                global_url_config[key] = json.loads(value)

        # 常驻监听更新任务
        while self._running:
            try:
                data = watch_etcd_data_change()
                action = data.action
                key = data.key.replace("/mock_urls", "")
                value = data.value
                if action == "set":
                    global_url_config[key] = json.loads(value)
                elif action == "delete":
                    if key in global_url_config:
                        del global_url_config[key]
                print("etcd watch data: %s" % str(data))
            except etcd.EtcdWatchTimedOut as _:
                continue
            except Exception as e:
                logger.error("etcd watcher process error: %s" % str(e))
        logger.info("EtcdWatcher grace exit")


def create_app():
    """
    # 根据环境信息加载配置
    :param env:
    :return:
    """
    logger.info("create_app online")
    app.config.from_object('config')
    return app


def sig_handler(sig, frame):
    """
    # 停止信号处理
    """
    global history_cleaner_thread
    global etcd_watcher_thread
    try:
        # 第一步：停止mq consumer保活策略
        history_cleaner.terminate()
        etcd_watcher.terminate()
        history_cleaner_thread.join()
        logger.info("history_cleaner_thread exit sig handle done")
        etcd_watcher_thread.join()
        logger.info("etcd_watcher_thread exit sig handle done")
        exit(0)
    except Exception as e:
        exit(0)


if __name__ == '__main__':
    logger.info('[*] Waiting for messages. To exit press CTRL+C')
    pwd = os.path.dirname(os.path.abspath(__file__))
    logzero.logfile(
        "%s/logs/mock_server.log" % pwd,
        loglevel=logging.DEBUG,
        maxBytes=1*1024*1024*1024,
        backupCount=3
    )
    app.config.from_object('config')

    signal.signal(signal.SIGTERM, sig_handler)
    signal.signal(signal.SIGINT, sig_handler)

    # 实例级别Monitor（实时状态同步）
    history_cleaner = HistoryCleaner()
    history_cleaner_thread = Thread(
        target=history_cleaner.run,
        name="history_cleaner",
        daemon=True
    )
    history_cleaner_thread.start()

    # ETCD数据监听
    global_url_config = {}
    etcd_watcher = EtcdWatcher()

    etcd_watcher_thread = Thread(
        target=etcd_watcher.run,
        name="etcd_watcher",
        daemon=True
    )
    etcd_watcher_thread.start()

    # 启动
    app.run(host="0.0.0.0", port=int(HTTP_PORT), debug=False)
