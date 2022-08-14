from rest_framework.serializers import ModelSerializer
from learning.models import Folder


class FolderSerializer(ModelSerializer):
    class Meta:
        model = Folder
        fields = '__all__'
