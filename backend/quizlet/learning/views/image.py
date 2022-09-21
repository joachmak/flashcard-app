from rest_framework.response import Response
from ..models import Image
from ..serializers import ImageSerializer
from rest_framework import viewsets, mixins, status
from rest_framework.parsers import MultiPartParser, FormParser
import os
from django.conf import settings


class ImageViewset(viewsets.ModelViewSet, mixins.DestroyModelMixin):
    queryset = Image.objects.all()
    serializer_class = ImageSerializer
    parser_classes = (MultiPartParser, FormParser)

    def perform_create(self, serializer):
        serializer.save()

    def destroy(self, request, pk=None, *args, **kwargs):
        if pk is None:
            return Response(status=status.HTTP_400_BAD_REQUEST, data={"error": "No pk in request"})
        img: Image = Image.objects.all().filter(pk=pk).first()
        if img is None:
            return Response(status=status.HTTP_400_BAD_REQUEST, data={"error": "No image with this pk"})
        filepath = settings.MEDIA_ROOT + "/" + str(img.image)
        if os.path.isfile(filepath):
            os.remove(filepath)
            img.delete()
            return Response(status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST, data={"error": "Filepath " + filepath + "not found"})
