import os
PROJECT_DIR = os.path.realpath(os.path.dirname(__file__) + '/../')
# 90 days of delay for image expiration
IMAGES_EXPIRES = 90

IMAGES_STORE =  PROJECT_DIR +'/data/pic'
#IMAGES_THUMBS = {
#    'small': (50, 50),
#    'big': (270, 270),
#    }
IMAGES_MIN_HEIGHT = 110
IMAGES_MIN_WIDTH = 110
LOG_LEVEL = "DEBUG"#"WARNING"

BOT_NAME = 'crawler'

SPIDER_MODULES = ['crawler.spiders']
NEWSPIDER_MODULE = 'crawler.spiders'

USER_AGENT = ''
USER_AGENT_LIST = [
    "Googlebot/2.1 (+http://www.google.com/bot.html)",
    "Googlebot/2.2 (+http://www.google.com/bot.html)",
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/535.19 (KHTML, like Gecko) Ubuntu/11.10 Chromium/18.0.1025.168 Chrome/18.0.1025.168 Safari/535.19',
    'Mozilla/5.0 (iPad; U; CPU iPhone OS 3_2 like Mac OS X; en-us) AppleWebKit/531.21.10 (KHTML, like Gecko) Version/4.0.4 Mobile/7B314 Safari/531.21.10'
    ]

DEFAULT_ITEM_CLASS = 'crawler.items.CrawlerItem'
ITEM_PIPELINES = [
    'crawler.pipelines.images_process',
    'crawler.pipelines.mongo_storage',
    ]
EXTENSIONS = {
    #'scrapy.contrib.corestats.CoreStats': 500,
    #'crawler.statstodb.StatsToMongo': 1000,
    }

DOWNLOADER_MIDDLEWARES = {
#    'crawler.middlewares.UMDownloadMiddleware': 400,
#    'scrapy.contrib.downloadermiddleware.useragent.UserAgentMiddleware': None,
    }
REDIRECT_ENABLED = False
REDIRECT_MAX_TIMES =0 

MONGODB_SERVER = "localhost"
MONGODB_PORT = 27017
#MONGODB_DB = "marketcrawler"
MONGODB_DB = "test"

MONGODB = {'host':'localhost','port':27017,'name':'chidian'}
MYSQLDB = {'host':'localhost','port':27017,'name':'chidian','user':'root','pwd':'root'}

MAIL_DEBUG = False
MAIL_HOST = 'mail.google.com'
MAIL_PORT = 25
MAIL_FROM = 'gongming@umeng.com'
MAIL_PASS = 'umeng123'
MAIL_USER = 'gongming@umeng.com'

COOKIES_ENABLED = True
DNSCACHE_ENABLED = True

DEFAULT_REQUEST_HEADERS = {
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'cn',
}

PROXIES = [{'ip_port': 'xx.xx.xx.xx:xxxx', 'user_pass': 'foo:bar'},
           {'ip_port': 'PROXY2_IP:PORT_NUMBER', 'user_pass': 'username:password'},
           {'ip_port': 'PROXY3_IP:PORT_NUMBER', 'user_pass': ''},]
