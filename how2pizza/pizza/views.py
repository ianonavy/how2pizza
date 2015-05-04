from django.shortcuts import render, redirect, get_object_or_404
from pizza.models import PizzaOrder, PizzaType, PizzaOrderUserChoice

# Create your views here.
def home(request):
    return render(request, 'pizza/index.html')


def new_order(request):
    order = PizzaOrder.objects.create()
    return redirect(order)


def orders(request, order_uuid):
    order = get_object_or_404(PizzaOrder, id=order_uuid)
    if request.method == 'POST':
        name = request.POST.get('name')
        user_choice, created = PizzaOrderUserChoice.objects.get_or_create(
            name=name,
            order=order)
        chosen_types = set([t.lower()
                            for t in request.POST.getlist('types[]')
                            if t != ''])
        pizza_types = PizzaType.objects.filter(user_choice=user_choice).all()
        pizza_types = set([p.name for p in pizza_types])
        types_to_delete = pizza_types - chosen_types
        missing_types = chosen_types - pizza_types
        PizzaType.objects.filter(user_choice=user_choice,
                                 name__in=types_to_delete).delete()
        for missing_type in missing_types:
            PizzaType.objects.create(name=missing_type, user_choice=user_choice)
    return render(request, 'pizza/order.html', {'order': order})
