import pymongo
from datetime import datetime

from scrapy.exceptions import DropItem
from scrapy.conf import settings
from scrapy import log

class mysql_storage(object):
    def __init__(self):
        pass

    def process_item(self, item, spider):
        if 'ImgItem' == item.__class__.__name__:
            self.process_meta_item(item)
        return item

    def process_img_item(item):
        pass

class redis_storage(object):
    def __init__(self):
        pass
    def process_item(self, item, spider):
        if 'LinkItem' == item.__class__.__name__:
            self.process_meta_item(item)
        return item

    def process_link_item(item):
        pass

class mongo_storage(object):
    def __init__(self):
        conn = pymongo.Connection(settings['MONGODB_SERVER'], settings['MONGODB_PORT'])
        db = conn[settings['MONGODB_DB']]

    def create_index(self):
        if not db.system.index.find({"name":"marketmeta"}):
            db.system.index.insert({})
                                     
    def process_item(self, item, spider):
        if 'MetaItem' == item.__class__.__name__:
            #self.process_meta_item(item)
            pass
        elif 'CommentItem' == item.__class__.__name__:
            #self.process_comment_item(item)
            pass
