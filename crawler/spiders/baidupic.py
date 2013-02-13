import urlparse
import re
import json
import requests
from md5 import md5

from scrapy.contrib.spiders import CrawlSpider, Rule
from scrapy.contrib.linkextractors.sgml import SgmlLinkExtractor
from scrapy.selector import HtmlXPathSelector
from scrapy.http import Request,FormRequest
from scrapy.conf import settings
from crawler.items import *

class Spider(CrawlSpider):
    name = 'baidupic'
    start_urls = [
            'http://www.baidu.com',
            'http://www.baidu.com',
            'http://www.baidu.com',
            ]
    is_start = True
    def parse(self,response):
        items = []
        data = json.loads(response.text)['data']

    def return_item(self,item):
        return item
