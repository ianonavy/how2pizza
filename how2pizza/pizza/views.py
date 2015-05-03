from django.shortcuts import render

# Create your views here.
def home(request):
    return render(request, 'pizza/index.html')


def orders(request):
    return render(request, 'pizza/order.html')
