from rest_framework import mixins, status, viewsets
from rest_framework.permissions import IsAuthenticated
from learning.models import Set
from learning.serializers.set import SetSerializer
from rest_framework.response import Response
from django.shortcuts import get_object_or_404


class SetViewset(mixins.ListModelMixin, mixins.CreateModelMixin, mixins.DestroyModelMixin, mixins.UpdateModelMixin,
                 viewsets.GenericViewSet):
    permission_classes = (IsAuthenticated,)
    queryset = Set.objects.all()

    def list(self, request):
        """ Return all sets of the current user """
        set_data = self.queryset.filter(user=request.user)
        serializer = SetSerializer(set_data, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def create(self, request):
        data = request.data
        data["user"] = request.user.pk
        serializer = SetSerializer(data=data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
        return Response(status=status.HTTP_200_OK)

    def destroy(self, request, pk):
        set_obj = get_object_or_404(Set, pk=pk)
        set_obj.delete()
        return Response(status=status.HTTP_200_OK)

    def update(self, request, pk):
        set_obj = get_object_or_404(Set, pk=pk)
        