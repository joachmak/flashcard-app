from rest_framework import serializers
from ..models import Image, Card


class ImageSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(required=False)
    is_term_image = serializers.BooleanField()
    card = serializers.PrimaryKeyRelatedField(many=False, queryset=Card.objects.all(), required=False)

    class Meta:
        model = Image
        fields = ['id', 'image', 'is_term_image', 'card']
