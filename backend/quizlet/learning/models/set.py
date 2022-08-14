from django.db import models
from learning.models.folder import Folder


class Set(models.Model):
    title = models.CharField(max_length=100)
    description = models.CharField(max_length=250, blank=True)
    folder = models.ForeignKey(Folder, on_delete=models.SET_NULL, blank=True, null=True)
    created_date = models.DateTimeField(auto_now_add=True)
    last_updated_date = models.DateTimeField(auto_now=True)  # when its sets were last updated

    def save(self, *args, **kwargs):
        if not self.folder:
            self.folder = None
        super(Set, self).save(*args, **kwargs)

    def __str__(self):
        return f"Set {self.title} created on {self.created_date}"

    class Meta:
        verbose_name = "Set"
