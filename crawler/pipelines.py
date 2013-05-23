#!/usr/bin/env python
# -*- coding: UTF-8 -*-
import pymongo
import xmlrpclib
import requests
import re
from md5 import md5
from datetime import datetime
from cStringIO import StringIO
from PIL import Image
from scrapy.exceptions import DropItem
from scrapy.conf import settings
from scrapy import log

from scrapy.contrib.pipeline.images import ImagesPipeline
from scrapy.exceptions import DropItem
from scrapy.http import Request
from crawler.settings import MONGODB

class images_process(ImagesPipeline):
    def get_images(self, response, request, info):
        key = self.image_key(request.url)
        orig_image = Image.open(StringIO(response.body))

        width, height = orig_image.size
        #if width < self.MIN_WIDTH or height < self.MIN_HEIGHT:
        #    raise ImageException("Image too small (%dx%d < %dx%d): %s" % \
        #            (width, height, self.MIN_WIDTH, self.MIN_HEIGHT, response.url))

        image, buf = self.convert_image(orig_image)
        yield key, image, buf

        #for thumb_id, size in self.THUMBS.iteritems():
        thumb_id = "orign"
        size = (750,int(height*750/width))
        thumb_key = self.thumb_key(request.url, thumb_id)
        thumb_image, thumb_buf = self.convert_image(image, size)
        yield thumb_key, thumb_image, thumb_buf

        thumb_id = "thumb"
        size = (260,int(height*260/width))
        thumb_key = self.thumb_key(request.url, thumb_id)
        thumb_image, thumb_buf = self.convert_image(image, size)
        yield thumb_key, thumb_image, thumb_buf

    def get_media_requests(self, item, info):
        yield Request(item['link'])
        #for image_url in item['link']:
        #    yield Request(image_url)

    def item_completed(self, results, item, info):
        image_paths = [x['path'] for ok, x in results if ok]
        if not image_paths:
            raise DropItem("Item contains no images")
        else:
            #item['image_paths'] = image_paths
            item['name'] = image_paths[0][5::]
        return item

class mongo_storage(object):
    db = None
    def __init__(self):
        self.db=pymongo.Connection(MONGODB['host'],MONGODB['port'])[MONGODB['name']]
    def process_item(self, item, spider):
        if 'ImgItem' == item.__class__.__name__:
            self.process_img_item(item)

    def process_img_item(self,item):
        if self.db.pin.find({"name":item['name']}).count() is 0:
            self.db.pin.insert(dict(item))
            if re.match(ur".*\.jpg",item['link']):
                self.wordpress(item)
                pass
               #self.datacore("CHIDIAN",item['link'] + " " + item['tags'])
    def wordpress(self,item):
        if re.match(ur".*\.jpg",item['link']):
            wp_url = "http://chidian/wp/xmlrpc.php"
            wp_user= "admin"
            wp_pass= "admin"
            wp_blog_id = ""

            status_drft = 0
            status_published = 1

            server = xmlrpclib.ServerProxy(wp_url)

            title = item['tags']
            content = "<img src=\"http://localhost:8000/pic/thumbs/orign/"+item['name']+"\" height=\""+str(int(750*item["height"]/item["width"])) +"\" width=\"750\" >"
            print content
            categories = [u"default"]
            tags = [u"美食",u"食品"]

            data = {'title':title,
                    'description':content,
                    #'dateCreated':xmlrpclib.DateTime(datetime.now()),
                    'categories':categories,
                    'mt_keywords':tags,
                    'post_status':'publish',
                    }

            post_id = server.metaWeblog.newPost(wp_blog_id, wp_user, wp_pass, data, status_published)
            print post_id

    def datacore(self, username, content):
        APIURL = "http://localhost/datacore/api.php"
        data = {}
        data['__API__[charset]'] = 'utf-8'
        data['__API__[output]'] = 'json' 
        data['__API__[app_key]'] = 476991604  
        data['__API__[app_secret]'] = '315bd254d9d56da49e47261a278379cc'
        #ata['__API__[app_key]'] = 1446517087#476991604  
        #data['__API__[app_secret]'] = '610f11361c3f3b7e83a69b8ff3f9ebfd'#'315bd254d9d56da49e47261a278379cc' 
        data['__API__[username]'] = 'admin' 
        data['__API__[password]'] = md5('admin'+md5('admin').hexdigest()).hexdigest()
        data['mod'] = 'topic'
        data['code'] = 'add'
        data['content'] = username + ' ' + content.replace("#"," ").replace("@","&")

        r = requests.post(APIURL,data=data)
