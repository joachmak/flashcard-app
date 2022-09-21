from rest_framework.serializers import ModelSerializer, SerializerMethodField
from learning.models import Card
from .image import ImageSerializer


class CardSerializer(ModelSerializer):
    images_term = SerializerMethodField()
    images_definition = SerializerMethodField()

    def get_images_term(self, instance):
        images_term = instance.images.filter(is_term_image=True)
        return ImageSerializer(images_term, many=True).data

    def get_images_definition(self, instance):
        images_definition = instance.images.filter(is_term_image=False)
        return ImageSerializer(images_definition, many=True).data

    class Meta:
        model = Card
        fields = '__all__'
