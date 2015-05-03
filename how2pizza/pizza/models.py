from django.db import models

# Create your models here.
class PizzaOrder(models.Model):
    name = models.CharField(max_length=80)
    url = models.CharField(max_length=64, primary_key=True)


class PizzaOrderUser(models.Model):
    username = models.CharField(max_length=80)
    order = models.ForeignKey(PizzaOrder)


class PizzaType(models.Model):
    name = models.CharField(max_length=80)
    user = models.ForeignKey(PizzaOrderUser)
