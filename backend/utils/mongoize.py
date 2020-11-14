# coding: utf-8
"""
MISSSHI
"""
from bson import ObjectId
import json


class JSONEncoder(json.JSONEncoder):
    """
    get json from mongo cursor
    """
    def default(self, o):
        """
        cursor object ->

        string -> string

        +-------------------+---------------+
        | Python            | JSON          |
        +===================+===============+
        | dict              | object        |
        +-------------------+---------------+
        | list, tuple       | array         |
        +-------------------+---------------+
        | str, unicode      | string        |
        +-------------------+---------------+
        | int, long, float  | number        |
        +-------------------+---------------+
        | True              | true          |
        +-------------------+---------------+
        | False             | false         |
        +-------------------+---------------+
        | None              | null          |
        +-------------------+---------------+

        :param o:
        :return: a kind of json
        """
        if isinstance(o, ObjectId):
            return str(o)
        return json.JSONEncoder.default(self, o)
