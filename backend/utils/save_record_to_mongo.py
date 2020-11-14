# -*- coding: UTF-8 -*-
"""
# WANGZHE12
"""
import time
from datetime import datetime
from logzero import logger
from models.mock_records import add_mock_records


def send_mock_service_record_to_mongo(action_result):
    """
    # 将Action历史结果存储进入Mongo
    :param action_result:
    :return:
    """
    try:
        logger.info("准备写入访问Mock服务的运行结果")
        action_result["datetime"] = datetime.now().strftime('%Y-%m-%dT%H:%M:%SZ')
        action_result["timestamp"] = int(time.time())
        add_mock_records(action_result)
        logger.info("Mongo数据写入完成，task_id：" + str(action_result["request_id"]))
    except Exception as e:
        logger.error("向Mongo中写入数据失败：" + str(e))
