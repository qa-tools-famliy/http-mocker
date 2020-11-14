# -*- coding: UTF-8 -*-
"""
# www.missshi.cn
"""
from flask import Blueprint
from flask import make_response
from flask import jsonify


common_web_api = Blueprint("common_web", __name__)


@common_web_api.route("/api/currentUser", methods=["GET"])
def current_user():
    """
    # 查询当前用户信息
    :return:
    """
    user_name = "MISSSHI"
    result = {
        "name": user_name,
        "token": "",
        "avatar": "https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png",
        "userid": "123",
        "notifyCount": 0
    }
    return make_response(jsonify(result))


@common_web_api.route('/health')
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
