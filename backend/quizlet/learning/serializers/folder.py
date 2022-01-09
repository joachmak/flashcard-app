from rest_framework.serializers import ModelSerializer, CharField, DateTimeField
from learning.models import Folder


class FolderSerializer(ModelSerializer):
    class Meta:
        model = Folder
        fields = '__all__'
