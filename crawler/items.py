from scrapy.item import Item, Field

class ImgItem(Item):
    hashmd5 = Field()
    name = Field()
    link = Field()
    refer = Field()
    tags = Field()
    path = Field()
    height = Field()
    width = Field()
    image_urls = Field()
    image_paths = Field()
    images = Field()

    def __str__(self):
        return ("ImgItem:%s"%(self['link']))
