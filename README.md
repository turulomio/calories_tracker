# CaloriesTracker 

This is the Vue 3 evolution of the branch vue2 of project https://github.com/turulomio/calories_tracker/ and it's the frontend app of  https://github.com/turulomio/django_calories_tracker backend.

## Installation

### Unogenerator installation
You must configure unogenerator.

If you want to install it in Gentoo you can use my ebuild at myportage.

In other Linux distributions you must run

```bash
    pip install unogenerator
    unogenator_start
```

### Django_calories_tracker installation

 You need to create a new database. I recommend postgresql.

`createdb -U postgres calories_tracker -h 127.0.0.1`

Clone https://github.com/turulomio/django_calories_tracker and https://github.com/turulomio/calories_tracker repositories or download same version releases

```bash
cd django_calories_tracker
poetry shell
poetry install
```

Edit settings.py if needed and run backend

```bash
python manage.py migrate
python manage.py createsuperuser
python manage.py loaddata calories_tracker/fixtures/all.json
python manage.py runserver
```


### CaloriesTracker installation

Compiles and hot-reloads for development
```bash
cd calories_tracker
npm run dev
```

## Testing

### e2e Tests
In django_calories_tracker sources root: poe cypress_test_server
In calories_tracker sources root: npm run cypress


## Changelog