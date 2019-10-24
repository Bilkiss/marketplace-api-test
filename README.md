# Marketplace platform test api

API for a test marketplace plaform

# To start you will need:
- Install node: https://nodejs.org/en/
- Install express: `npm install express —-save`
- Clone the Marketplace project: `git clone ` the repo
- To run the project: `npm install` at the root of the project, then `nodemon server.js` will connect to the db

Note: 

    - Add your mongo credentials, in 'config/database.js' to be able to connect to the database
    `'database': "mongodb://<username>:<password>@<dbname>" `
    You can create an account here: https://mlab.com
    
    - Upload an image: Create an account on https://cloudinary.com and update it in 'routes/cars.js'
    `cloudinary.config({
         cloud_name: '<cloudname>',
         api_key: '<apikey>',
         api_secret: '<apisecret>'
     });`
