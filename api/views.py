from rest_framework import viewsets, filters
from rest_framework.response import Response

from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.decorators import action
from django.views.decorators.csrf import csrf_exempt

from api.models import Location, Player, Schedule, Game, Attending
from api.serializers import (
		GameSerializer,
		PlayerSerializer,
		LocationSerializer,
		ScheduleSerializer,
		AttendingSerializer,
)

import pdb
# from users.models import User


class GameViewSet(viewsets.ModelViewSet):
		queryset = Game.objects.all()
		serializer_class = GameSerializer

		filter_backends = (DjangoFilterBackend, filters.OrderingFilter,)
		filter_fields = ['season_id']
		ordering_fields = ['date', 'time']
		ordering = ('date', 'time')


class PlayerViewSet(viewsets.ModelViewSet):

		queryset = Player.objects.all()
		serializer_class = PlayerSerializer

		filter_backends = (DjangoFilterBackend, filters.OrderingFilter,)
		filter_fields = ['games']
		ordering_fields = ['name',]
		ordering = ('name')


class LocationViewSet(viewsets.ModelViewSet):

		queryset = Location.objects.all()
		serializer_class = LocationSerializer


class ScheduleViewSet(viewsets.ModelViewSet):

		queryset = Schedule.objects.all()
		serializer_class = ScheduleSerializer
		filter_backends = (filters.OrderingFilter,)
		ordering_fields = ['start_date', 'end_date']
		ordering = ('-start_date')

		@action(methods=['post'], detail=True)
		def player(self, request, pk=None):
				schedule = self.get_object()
				player_id = request.data['player_id']
				player = Player.objects.get(pk=player_id)
				if player in schedule.roster.all():
						schedule.roster.remove(player)
				else:
						schedule.roster.add(player)
				return Response(ScheduleSerializer(schedule).data)


class AttendingViewSet(viewsets.ModelViewSet):

		queryset = Attending.objects.all()
		serializer_class = AttendingSerializer

		filter_backends = (DjangoFilterBackend, filters.OrderingFilter)
		filter_fields = ['game', 'player']
		ordering_fields = ['player']
		ordering = ('player')

		# def get_serializer_class(self):
				# if self.request.method == 'POST':
#             return NewRackItemSerializer
#         return RackItemSerializer