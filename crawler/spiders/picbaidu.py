#!/usr/bin/env python
# -*- coding: UTF-8 -*-
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
    name = 'pic'
    start_urls = [
            'http://image.baidu.com/i?tn=listjson&word=liulan&oe=utf-8&ie=utf8&tag1=%E7%BE%8E%E9%A3%9F&tag2=%E5%85%A8%E9%83%A8&sorttype=0&pn=60&rn=60&requestType=1&1360056617726',
            #'http://pic.sogou.com/pics?start=72&load_data=load_data&pic_num=24&liwidth=null&len=24&query=%C3%C0%CA%B3&w=05002100&p=&_asf=pic.sogou.com&_ast=1360133653&oq=meishi&ri=0&sourceid=sugg',
            #'http://cn.bing.com/images/async?q=美食&async=content&first=98&count=35&dgst=ro_u2489*&IID=images.1&SFX=4&IG=0b961585c355413990b4e438359ea115&CW=1600&CH=492',
            #'http://www.google.com.hk/search?q=%E7%BE%8E%E9%A3%9F&hl=zh-CN&newwindow=1&safe=strict&tbo=d&site=imghp&biw=1615&bih=158&tbm=isch&ijn=2&ei=FgASUfHbCqbBiQfugYGgBQ&start=100&csl=1',
            ]

    is_start = True
    def parse(self,response):
        items = []
        if re.match(ur".*\.baidu\.com.*",response.url):
            items+=parse_baidu(response)
            if re.match(ur".*page=1.*",response.url):
                for pagenum in range(6):
                    url="http://www.baidu.com/?kw="+k
                    yield Request(url,callback=self.parse)

        elif re.match(ur".*\.google\..*",response.url):
            items+=parse_google(response)
            if re.match(ur".*page=1.*",response.url):
                for pagenum in range(6):
                    url="http://www.baidu.com/?kw="+k
                    yield Request(url,callback=self.parse)

        elif re.match(ur".*\.weibo\..*",response.url):
            items+=parse_google(response)
            if re.match(ur".*page=1.*",response.url):
                for pagenum in range(6):
                    url="http://www.baidu.com/?kw="+k
                    yield Request(url,callback=self.parse)

        for item in items:
            yield self.return_item(item)

    def return_item(self,item):
        return item

def parse_google(response):
    items = []
    hxs=HtmlXPathSelector(response)
    return items

def parse_baidu(response):
    items = []
    data = json.loads(response.body)['data']
    for p in data:
        if p not in ['',{}]:
            item = ImgItem()
            item['tags'] = p['tags']
            item['link'] = p['obj_url']
            item['image_urls'] = p['obj_url']
            item['refer'] = p['from_url']
            item['hight'] = p['image_height']
            item['width'] = p['image_height']
            items.append(item)
    return items

def parse_weibo(response):
    items = []
    hxs=HtmlXPathSelector(response)
    return items
