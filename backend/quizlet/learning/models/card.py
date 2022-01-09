from django.db import models
from learning.models.set import Set


class Card(models.Model):
    term = models.TextField()
    definition = models.TextField()
    set = models.ForeignKey(Set, models.CASCADE)
    score = models.SmallIntegerField()
    last_practiced = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Set: {self.set} Term: {self.term}, definition: {self.definition}"

    class Meta:
        verbose_name = "Card"
