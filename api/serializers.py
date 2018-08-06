from rest_framework import serializers
from api.models import Game, Player, Location, Schedule, Attending
import datetime
import pdb
from time import strftime


class PlayerSerializer(serializers.ModelSerializer):

		class Meta:
				model = Player
				fields = (
						'id',
						'name',
						'gender',
				)


class GamePlayerSerializer(serializers.ModelSerializer):

		player_id = serializers.ReadOnlyField(source='player.id')
		name = serializers.ReadOnlyField(source='player.name')
		gender = serializers.ReadOnlyField(source='player.gender')

		class Meta:
		    model = Attending
		    fields = ('id', 'attending', 'name', 'player_id', 'gender')


class GameSerializer(serializers.ModelSerializer):

		time = serializers.SerializerMethodField(read_only=True)
		date = serializers.SerializerMethodField(read_only=True)
		day = serializers.SerializerMethodField(read_only=True)
		date_time = serializers.SerializerMethodField(read_only=True)
		is_upcoming = serializers.SerializerMethodField(read_only=True)
		attendance = serializers.SerializerMethodField(read_only=True)
		season = serializers.PrimaryKeyRelatedField(queryset=Schedule.objects.all(), write_only=True)



		class Meta:
				model = Game
				fields = (
						'id',
						'date',
						'time',
						'date_time',
						'day',
						'field',
						'goals_for',
						'goals_against',
						'is_upcoming',
						'attendance',
						'season'
				)

		def get_is_upcoming(self, obj):
				return (obj.date - datetime.date.today()).days >= 0

		def get_date(self, obj):
				return obj.date.strftime("%A, %b %d")

		def get_time(self, obj):
				return obj.time.strftime("%H:%M")

		def get_date_time(self, obj):
				date = obj.date.strftime("%b %d")
				time = obj.time.strftime("%H:%M")
				return "%s | %s" % (date, time)

		def get_day(self, obj):
				return obj.date.strftime("%A")

		def get_attendance(self, instance):
				attending = Attending.objects.filter(game_id=instance.id).order_by('player__name')
				return GamePlayerSerializer(attending, many=True,).data


class LocationSerializer(serializers.ModelSerializer):
	
		class Meta:
				model = Location
				fields = (
						'id',
						'lat',
						'lng',
						'title',
						'description',
						'address',
				)


class ScheduleSerializer(serializers.ModelSerializer):
	
		class Meta:
				model = Schedule
				fields = (
						'id',
						'title',
						'roster',
				)

class AttendingSerializerPost(serializers.ModelSerializer):

		# player = PlayerSerializer(read_only=True)
		# game = GameSerializer(read_only=True)
		player_id = serializers.PrimaryKeyRelatedField(read_only=True)
		gender = serializers.ReadOnlyField(source='player.gender', read_only=True)
		name = serializers.ReadOnlyField(source='player.name')

		class Meta:
				model = Attending
				fields = ('id', 'attending', 'player_id', 'gender', 'name')


class AttendingSerializer(serializers.ModelSerializer):

		player = serializers.PrimaryKeyRelatedField(queryset=Player.objects.all(), write_only=True)
		game = serializers.PrimaryKeyRelatedField(queryset=Game.objects.all(), write_only=True)


		class Meta:
		    model = Attending
		    fields = ('id', 'game', 'attending', 'player', )

		def to_representation(self, instance):
				# if self.context['request'].method == 'POST':
				serializer = AttendingSerializerPost(instance)
				return serializer.data
				# return super().to_representation(instance)

