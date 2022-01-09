from rest_framework.serializers import ModelSerializer, CharField, DateTimeField
from learning.models import Set


class SetSerializer(ModelSerializer):
    class Meta:
        model = Set
        fields = '__all__'

    title = CharField(max_length=100)
    description = CharField(max_length=250)
    created_date = DateTimeField()
    last_updated_date = DateTimeField()

    def create(self, validated_data):
        return Set.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.title = validated_data.get("title", instance.title)
        instance.description = validated_data.get("description", instance.description)
        instance.created_date = validated_data.get("created_date", instance.created_date)
        instance.last_updated_date = validated_data.get("last_updated_date", instance.last_updated_date)
        instance.save()
        return instance
