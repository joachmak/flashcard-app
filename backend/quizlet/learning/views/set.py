from django.shortcuts import get_object_or_404
from rest_framework import mixins, status, viewsets
from learning.models import Set
from learning.serializers.set import SetSerializer
from rest_framework.response import Response


class SetViewset(mixins.ListModelMixin, mixins.RetrieveModelMixin, mixins.CreateModelMixin, mixins.DestroyModelMixin, mixins.UpdateModelMixin,
                 viewsets.GenericViewSet):
    queryset = Set.objects.all()
    serializer_class = SetSerializer

    def list(self, request, *args, **kwargs):
        """ Return all sets of the current user """
        set_data = self.queryset.all()
        serializer = SetSerializer(set_data, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def retrieve(self, request, pk=None, *args, **kwargs):
        """ Return all sets of the current user """
        set = get_object_or_404(Set, pk=pk)
        serializer = SetSerializer(set, many=False)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):
        serializer = SetSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
        return Response(status=status.HTTP_200_OK, data=serializer.data)

    def delete(self, _, pk):
        obj = get_object_or_404(Set, pk=pk)
        obj.delete()
        return Response(status=status.HTTP_200_OK)
