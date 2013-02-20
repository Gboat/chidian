import pymongo
from datetime import datetime
from cStringIO import StringIO
from PIL import Image
from scrapy.exceptions import DropItem
from scrapy.conf import settings
from scrapy import log

from scrapy.contrib.pipeline.images import ImagesPipeline
from scrapy.exceptions import DropItem
from scrapy.http import Request


class MyImagesPipeline(ImagesPipeline):

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
        item['image_paths'] = image_paths
        return item

class mysql_storage(object):
    def __init__(self):
        mysql.conn()
        #redis.conn()
        #mongo.conn()

    def process_item(self, item, spider):
        if 'ImgItem' == item.__class__.__name__:
            mysql.insert("chidian_pin",dict(item))
        return item
