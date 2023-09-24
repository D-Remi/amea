Project Name

Description

This project is built using Symfony 6.2, with the EasyAdmin bundle for administration functionality, and ReactJS for the frontend. It requires PHP 8.1 to run.

Initial Setup

1: Clone the repository to your local machine
2: Run composer install to install the necessary dependencies
3: Create a new database and update the DATABASE_URL in the .env file to match the new database credentials
4: Run php bin/console doctrine:schema:create to create the database tables
5: Run yarn install or npm install to install the necessary javascript dependencies.
6: Run yarn run build or npm run build to build the javascript assets
7: Start the symfony server using symfony server:start
8: Access the application on http://localhost:8000

Additional commands

Run php bin/console doctrine:schema:update --force to update the database schema
Run yarn run watch or npm run watch to automatically rebuild the javascript assets on changes

EasyAdmin

The EasyAdmin bundle is already configured in the project. Access the admin interface on http://localhost:8000/admin

Note

Before starting the project you need to install PHP 8.1 and configure it on your local machine
