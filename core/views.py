from django.http import JsonResponse
from django.shortcuts import render
from django.utils.timezone import now


def index(request):
    return render(request, 'core/index.html')


def health(request):
    return JsonResponse({
        'status': 'ok',
        'game': 'Cyborg Chess Edition',
        'timestamp': now().isoformat(),
    })
