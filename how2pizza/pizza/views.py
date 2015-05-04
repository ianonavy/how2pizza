from django.shortcuts import render, redirect, get_object_or_404
from pizza.models import PizzaOrder, PizzaType, PizzaOrderUserChoice

# Create your views here.
def home(request):
    return render(request, 'pizza/index.html')


def new_order(request):
    name = None
    if request.method == 'POST':
        name = request.POST.get('name')
    order = PizzaOrder.objects.create(name=name)
    return redirect(order)


def orders(request, order_uuid):
    order = get_object_or_404(PizzaOrder, id=order_uuid)
    if request.method == 'POST':
        name = request.POST.get('name')[:24]
        request.session['name'] = name
        user_choice, created = PizzaOrderUserChoice.objects.get_or_create(
            name=name,
            order=order)
        chosen_types = set([t.lower().replace(',', '')[:24]
                            for t in request.POST.getlist('types[]')
                            if t.strip() != ''])
        if chosen_types == set():
            user_choice.delete()
        else:
            types = PizzaType.objects.filter(user_choice=user_choice).all()
            types = set([p.name for p in types])
            types_to_delete = types - chosen_types
            missing_types = chosen_types - types
            PizzaType.objects.filter(user_choice=user_choice,
                                     name__in=types_to_delete).delete()
            for missing in missing_types:
                PizzaType.objects.create(name=missing, user_choice=user_choice)
    my_name = request.session.get('name')
    if my_name:
        try:
            user_choice = PizzaOrderUserChoice.objects.get(
                name=my_name,
                order=order)
        except PizzaOrderUserChoice.DoesNotExist:
            user_choice = None
    else:
        user_choice = None
    ctx = {'order': order, 'name': my_name, 'user_choice': user_choice}
    return render(request, 'pizza/order.html', ctx)
