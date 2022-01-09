from rest_framework.serializers import ModelSerializer, CharField, DateTimeField
from learning.models import Set


class SetSerializer(ModelSerializer):
    class Meta:
        model = Set
        fields = '__all__'
