# Generated by Django 4.0 on 2022-08-14 05:59

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('learning', '0003_remove_folder_user_remove_set_user'),
    ]

    operations = [
        migrations.AlterField(
            model_name='card',
            name='set',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='cards', to='learning.set'),
        ),
    ]