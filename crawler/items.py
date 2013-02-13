#coding:utf-8
# Define here the models for your scraped items
#
# See documentation in:
# http://doc.scrapy.org/topics/items.html

from scrapy.item import Item, Field

class CrawlerItem(Item):
    # define the fields for your item here like:
    # name = Field()
    pass
class MarketItem(Item):
    date = Field()
    name = Field()
    app_category = Field()
    game_category = Field()
    appsum = Field()
    app_num = Field()
    game_num = Field()

    def __str__(self):
        return ("MarketItem:%s"%(self['name']))

class MetaItem(Item):
    md5 = Field()
    app_id = Field() 
    name = Field()
    update_time = Field()
    app_version = Field()
    developer = Field()
    language = Field()
    package_url = Field()
    package_md5 = Field()
    size = Field()
    comment_url = Field()
    icon = Field()
    url = Field()
    market = Field()
    description = Field()
    images = Field()
    category = Field()
    category_general = Field()
    category_detail = Field()
    package_name = Field()
    email = Field()
    level = Field()
    devpage = Field()
    rate = Field()
    price = Field()

    def __str__(self):
        return ("MetaItem:%s\t%s"%(self['md5'],self['name']))

class ApkItem(Item):
    md5 = Field()
    package_name = Field()
    size = Field()
    sdk = Field()
    apk_store_path = Field()
    def __str__(self):
        return ("ApkItem")

class CommentItem(Item):
    md5 = Field()
    comment = Field()
    username = Field()
    date = Field()
    def __str__(self):
        return ("CommentItem")
    
class LinkItem(Item):
    md5 = Field()
    url = Field()
    tag = Field() #1:
    recommend = Field()#1:ture;0:false

    rank = Field()#in rank inc 1
    avaiable = Field()#1:ture;0:false
    market = Field()
    def __str__(self):
        return ("LinkItem")

class ImgItem(Item):
    md5 = Field()
    link = Field()
    refer = Field()
    tags = Field()
    path = Field()
    hight = Field()
    width = Field()
    image_urls = Field()
    image_paths = Field()
    images = Field()
    def __str__(self):
        return ("ImgItem:%s"%(self['link']))
    
class UpdateItem(Item):
    md5 = Field()
    url = Field()
    down = Field()
    rate = Field()
    date = Field()
    market=Field()

    def __str__(self):
        return ("UpdateItem")

class ErrorItem(Item):
    md5 = Field()
    market = Field()
    itemtype = Field()
    info = Field()
    traceback = Field()

    def __str__(self):
        return ("ErrorItem: %s,%s"%(self['market'],self['info']))
