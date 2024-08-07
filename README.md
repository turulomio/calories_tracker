# CaloriesTracker 

This is the Vue 3 evolution of the branch vue2 of project https://github.com/turulomio/calories_tracker/ and it's the frontend app of  https://github.com/turulomio/django_calories_tracker backend.

## Installation

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

This app has two testing procedures:

- `npm run vitest` Used to test independent functions
- `npm run cypress` or `npm run cypress_console` Used for e2e testing with Cypress, to test UI logic. To use this command, you need to run  from django_calories_tracker sources root: `poe cypress_test_server`

## Changelog