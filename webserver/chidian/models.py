from django.db import models
class album(models.Model):
    """
    album infomations
    """
    album_id = models.CharField(max_length=15)
    album_name = models.CharField(max_length=20)
    album_width = models.IntegerField()
    album_pin_count = models.IntegerField()
    is_already_forward = models.BooleanField()
    is_already_follow = models.BooleanField()
    user_id = models.IntegerField()

    def __str__(self):
        return self.name

class user(models.Model):
    """
    pictures owner infomation
    """
    user_id = models.IntegerField()
    name = models.CharField(max_length=30)
    nickname = models.CharField(max_length=12)
    qq = models.IntegerField(max_length=12)
    large_head_url = models.URLField()
    password = models.CharField(max_length=32)
    unlock_pin_count = models.IntegerField()

    def __str__(self):
        return self.name

class pin(models.Model):
    """
    picture infomation
    """
    pin_id = models.IntegerField()
    obj_url = models.URLField()
    refer = models.URLField()
    height = models.IntegerField()
    width  = models.IntegerField()
    comment = models.CharField(max_length=50)
    store_path = models.URLField()
    tags = models.CharField(max_length=30)
    hashmd5 = models.CharField(max_length=32)

    def __str__(self):
        return self.name

class ad(models.Model):
    """
    AD info ,support to show in pictures
    """
    ad_id = models.IntegerField()
    tags_id = models.IntegerField()
    user_id = models.IntegerField()
    url = models.URLField()
    loacttion = models.IntegerField()
    address = models.CharField(max_length=140)

    def __str__(self):
        return self.name

class cate(models.Model):
    """
    cate infomation, contains introduce.
    category use code support
    """
    cate_id = models.IntegerField()
    tags_id = models.IntegerField()
    name = models.CharField(max_length=30)
    category = models.IntegerField()
    introduce = models.CharField(max_length=140)
    suit = models.CharField(max_length=140)
    unsuit = models.CharField(max_length=140)

    def __str__(self):
        return self.name

class ingredients(models.Model):
    """
    ingredients
    """
    tags_id = models.IntegerField()
    name = models.CharField(max_length=30)
    introduce = models.CharField(max_length=140)
    famous = models.CharField(max_length=140)
    recommond = models.CharField(max_length=140)
    suit = models.IntegerField()
    unsuit = models.IntegerField()

    def __str__(self):
        return self.name


