from django.db import models


class Player(models.Model):

		FEMALE = 0
		MALE = 1
		UNKNOWN = 2

		GENDER_OPTIONS = (
				(FEMALE, 'Female'),
				(MALE, 'Male'),
				(UNKNOWN, 'Unknown'),
		)

		email = models.CharField(max_length=100, blank=True, null=True, unique=True)
		number = models.IntegerField(blank=True, null=True)
		active = models.BooleanField(default=True)
		name = models.CharField(max_length=100)
		admin = models.BooleanField(default=False)
		bio = models.TextField(null=True, blank=True, max_length=300)
		gender = models.IntegerField(
			choices=GENDER_OPTIONS,
			default=UNKNOWN,
			null=False,
			blank=False)
		updated_at = models.DateTimeField(auto_now=True)
		created_at = models.DateTimeField(auto_now_add=True)

		def __str__(self):
				return self.name


class Schedule(models.Model):

		LEAGUE = 'League'
		TOURNAMENT = 'Tournament'

		SCHEDULE_TYPE_OPTIONS = (
			(0, LEAGUE),
			(1, TOURNAMENT),
		)

		title = models.CharField(max_length=100, null=True, blank=True)
		start_date = models.DateField()
		end_date = models.DateField()
		notes = models.TextField(null=True, blank=True, max_length=300)
		cat = models.IntegerField(
			choices=SCHEDULE_TYPE_OPTIONS,
			default=0,
			null=False,
			blank=False)
		roster = models.ManyToManyField(Player, related_name='schedules')
		players_per_game = models.IntegerField(null=True, blank=True)
		updated_at = models.DateTimeField(auto_now=True)
		created_at = models.DateTimeField(auto_now_add=True)

		def __str__(self):
				return self.title


class Location(models.Model):

		lat = models.CharField(max_length=100)
		lng = models.CharField(max_length=100)
		title = models.CharField(max_length=100)
		description = models.TextField(null=True, blank=True, max_length=300)
		address = models.CharField(max_length=100)
		updated_at = models.DateTimeField(auto_now=True)
		created_at = models.DateTimeField(auto_now_add=True)

		def __str__(self):
				return self.title


class Game(models.Model):

		date = models.DateField(null=True, blank=True)
		time = models.TimeField(null=True, blank=True)
		players = models.ManyToManyField(Player, through='Attending', related_name='games')
		field = models.ForeignKey(Location, on_delete=models.CASCADE, null=True)
		season = models.ForeignKey(Schedule, on_delete=models.CASCADE, related_name='games')
		updated_at = models.DateTimeField(auto_now=True)
		created_at = models.DateTimeField(auto_now_add=True)
		goals_for = models.IntegerField(blank=True, null=True)
		goals_against = models.IntegerField(blank=True, null=True)

		def __str__(self):
				return "%s | %s" % (self.date, self.time)


class Attending(models.Model):

		game = models.ForeignKey(Game, on_delete=models.CASCADE, related_name='attendance')
		player = models.ForeignKey(Player, on_delete=models.CASCADE, related_name='responses')
		attending = models.BooleanField(default=True)

		class Meta:
				unique_together = ('game', 'player')

		def __str__(self):
				return "%s | %s" % (self.player.name, self.game.date)


# class Comment(models.Model):

	# body = TextField(null=False, blank=False, max_length=200)
	# game = ForeignKey(Game, related_name='comments')
	# user = ForeignKey(User, related_name='comments')

	# def __str__(self):
		# return "%s | %s" % (self.player.name, self.game.date)