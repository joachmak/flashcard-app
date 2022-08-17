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

    @action(detail=False, methods=["delete"])
    def delete_many(self, request):
        if type(request.data) != list:
            return Response(status=status.HTTP_400_BAD_REQUEST, data={"error": "Request data is not a list of IDs"})
        self.queryset.filter(pk__in=request.data).delete()
        return Response(status=status.HTTP_200_OK)

    @action(detail=False, methods=["patch"])
    def patch_many(self, request):
        data = {  # we need to separate out the id from the data
            i['id']: {k: v for k, v in i.items() if k != 'id'}
            for i in request.data
        }
        for inst in self.queryset.filter(id__in=data.keys()):
            serializer = CardSerializer(inst, data=data[inst.id], partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            data.pop(inst.id)
        if len(data.keys()) > 0:
            return Response(status=status.HTTP_400_BAD_REQUEST, data={"error": "Not all cards were updated"})
        return Response(status=status.HTTP_200_OK)
