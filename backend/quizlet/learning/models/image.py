from django.db import models
from learning.models.card import Card


class Image(models.Model):
    image = models.ImageField(upload_to="images/")
    is_term_image = models.BooleanField()
    card = models.ForeignKey(Card, models.CASCADE, related_name="images", null=True, blank=True)

    def __str__(self):
        return self.image.name
