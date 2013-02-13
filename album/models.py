from django.db import models

class album(models.Model):
    album_id = models.CharField(max_length=15)
    album_name = models.CharField(max_length=20)
    album_width = models.IntegerField()
    album_pin_count = models.IntegerField(db_index=True)
    origin_album_id = models.IntegerField()

    is_already_forward = models.BooleanField()
    is_already_follow = models.BooleanField()
    user_id = models.IntegerField()

    def __str__(self):
        return self.name

class user(models.Model):
    user_id = models.IntegerField()
    name = models.CharField(max_length=30)
    nickname = models.CharField(max_length=12)
    qq = models.CharField(max_length=12)
    large_head_url = models.URLField()
    password = models.CharField(max_length=32)
    unlock_pin_count = models.IntegerField()

    def __str__(self):
        return self.name

class pin(models.Model):
    pin_id = models.IntegerField()
    large_image_url = models.URLField()
    large_image_height = models.IntegerField()

    def __str__(self):
        return self.name
