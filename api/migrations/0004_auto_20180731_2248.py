# Generated by Django 2.0.6 on 2018-07-31 22:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_auto_20180731_2215'),
    ]

    operations = [
        migrations.AlterField(
            model_name='attending',
            name='attending',
            field=models.BooleanField(default=True),
        ),
    ]
