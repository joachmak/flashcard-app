from django.db import models
from django.contrib.auth.models import User


class Folder(models.Model):
    name = models.CharField(max_length=50)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_date = models.DateTimeField(auto_now_add=True)
    last_updated_date = models.DateTimeField(auto_now=True)  # when its sets were last updated

    def __str__(self):
        return f"Folder {self.name} created by {self.user} on {self.created_date}"

    class Meta:
        verbose_name = "Folder"
