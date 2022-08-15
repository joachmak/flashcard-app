from django.shortcuts import get_object_or_404
from rest_framework import mixins, status, viewsets
from rest_framework.decorators import action

from learning.models import Card
from learning.serializers.card import CardSerializer
from rest_framework.response import Response


class CardViewset(mixins.ListModelMixin, mixins.CreateModelMixin, mixins.DestroyModelMixin, mixins.UpdateModelMixin,
                 viewsets.GenericViewSet):
    queryset = Card.objects.all()
    serializer_class = CardSerializer

    def list(self, request, *args, **kwargs):
        """ Return all sets of the current user """
        card_data = self.queryset.all()
        serializer = CardSerializer(card_data, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):
        serializer = CardSerializer(data=request.data, many=isinstance(request.data, list))
        if serializer.is_valid(raise_exception=True):
            serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, _, pk):
        obj = get_object_or_404(Card, pk=pk)
        obj.delete()
        return Response(status=status.HTTP_200_OK)
