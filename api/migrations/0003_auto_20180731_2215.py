# Generated by Django 2.0.6 on 2018-07-31 22:15

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_auto_20180731_2116'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='attending',
            unique_together={('game', 'player')},
        ),
    ]
