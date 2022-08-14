from rest_framework.serializers import ModelSerializer
from learning.models import Set
from learning.serializers.card import CardSerializer


class SetSerializer(ModelSerializer):
    cards = CardSerializer(many=True, read_only=True)

    class Meta:
        model = Set
        fields = '__all__'
