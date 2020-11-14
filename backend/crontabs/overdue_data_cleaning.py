# -*- coding: UTF-8 -*-
"""
# www.missshi.cn
# 过期数据清理
"""
import time
from models.mock_records import remove_mock_records


def mongodb_overdue_data_cleaning():
    """
    # 定期清理MongoDB中无效的数据
    :return:
    """
    end_time = int(time.time()) - 60 * 60 * 6  # 6小时之前的数据删除
    remove_mock_records({
        "timestamp": {
            "$lt": end_time
        }
    })
