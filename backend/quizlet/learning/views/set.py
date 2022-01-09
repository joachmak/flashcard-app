from rest_framework import mixins, status, viewsets
from learning.models import Set
from learning.permissions import IsAuthenticatedAndOwner
from learning.serializers.set import SetSerializer
from rest_framework.response import Response
import copy


class SetViewset(mixins.ListModelMixin, mixins.CreateModelMixin, mixins.DestroyModelMixin, mixins.UpdateModelMixin,
                 viewsets.GenericViewSet):
    permission_classes = (IsAuthenticatedAndOwner, )
    queryset = Set.objects.all()
    serializer_class = SetSerializer

    def list(self, request):
        """ Return all sets of the current user """
        set_data = self.queryset.filter(user=request.user)
        serializer = SetSerializer(set_data, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def create(self, request):
        data = copy.deepcopy(request.data)
        data["user"] = request.user.pk
        serializer = SetSerializer(data=data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
        return Response(status=status.HTTP_200_OK)
        