# -*- coding: UTF-8 -*-
"""
# MISSSHI
"""
import string
import random


def generator_id(size=16, chars=string.ascii_uppercase + string.ascii_lowercase + string.digits):
    """
    # 生成一个随机数
    :param size:
    :param chars:
    :return:
    """
    return ''.join(random.choice(chars) for _ in range(size))
