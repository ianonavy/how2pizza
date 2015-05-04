from django.contrib import admin
from pizza.models import PizzaOrder, PizzaOrderUserChoice, PizzaType


@admin.register(PizzaOrder)
class PizzaOrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'created_at')


@admin.register(PizzaOrderUserChoice)
class PizzaOrderUserChoiceAdmin(admin.ModelAdmin):
    pass


@admin.register(PizzaType)
class PizzaTypeAdmin(admin.ModelAdmin):
    pass

