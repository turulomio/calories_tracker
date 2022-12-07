# Calories Tracker project

## Installation method



```sh
# You need to create a new database. I recommend postgresql.
createdb -U postgres calories_tracker -h 127.0.0.1

# Clone repository and install requirements
git clone https://github.com/turulomio/django_calories_tracker
cd django_calories_tracker
pip install -r requirements.txt

# Edit settings.py if needed and run backend
python manage.py migrate
python manage.py createsuperuser
python manage.py update_catalogs
python manage.py sqlsequencereset calories_tracker | python manage.py dbshell
python manage.py runserver

# Clone repository and install node_modules
git clone https://github.com/turulomio/calories_tracker
cd calories_tracker
npm install

# Run frontend
npm run serve
```

## Health links used to develop calories_tracker
- https://www.weekendbakery.com/cooking-conversions/
- https://cardiacos.net/sal-y-sodio/


## Changelog
### 0.2.0 (2022-07-30)
- Basic features
