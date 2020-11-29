# -*- coding: UTF-8 -*-
"""
# MISSSHI
"""
import os

# 端口信息
HTTP_PORT = os.getenv("HTTP_PORT", "8080")

# 持久化存储地址
MONGODB_URL_LIST = [
    x.strip() for x in os.getenv("MONGODB_URL_LIST", "192.168.1.22").split(",")
]
MONGODB_PORT = os.getenv("MONGODB_PORT", "27017")
MONGODB_DBNAME = "mock_management"

# ETCD地址
ETCD_ADDRESS = os.getenv("ETCD_ADDRESS", "192.168.1.22")
ETCD_PORT = os.getenv("ETCD_PORT", "2379")

# 请求记录保存时间
EVENTS_RESERVED_HOURS = int(os.getenv("EVENTS_RESERVED_HOURS", "6"))
