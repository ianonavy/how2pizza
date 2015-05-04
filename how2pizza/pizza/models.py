from django.db import models
from django.core.urlresolvers import reverse
import uuid


DEFAULT_PIZZAS = {u'cheese', u'pepperoni', u'veggie'}


def random_number():
    return int(os.urandom(8).encode('hex'), 16)


class PizzaOrder(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=36, default="How2Pizza")
    created_at = models.DateTimeField(auto_now=True, blank=False, null=False)

    def get_absolute_url(self):
        return reverse('pizza.views.orders', args=[self.id])

    def get_pizza_types(self):
        pizza_types = PizzaType.objects.filter(user_choice__order=self)
        return sorted(DEFAULT_PIZZAS | set([unicode(p) for p in pizza_types]))

    def __str__(self):
        return str(self.id)


class PizzaOrderUserChoice(models.Model):
    name = models.CharField(max_length=24)
    order = models.ForeignKey(PizzaOrder, related_name='user_choices')

    def get_types_as_csv(self):
        return ', '.join(sorted(p.name for p in self.pizza_types.all()))

    def get_pizza_types(self):
        return {unicode(p.name) for p in self.pizza_types.all()}

    def __str__(self):
        return self.name


class PizzaType(models.Model):
    name = models.CharField(max_length=24)
    user_choice = models.ForeignKey(PizzaOrderUserChoice, related_name='pizza_types')

    def __str__(self):
        return self.name
