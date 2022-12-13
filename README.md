 <NPM packages>

 * npm init -y 
 * npm i express 
 * npm i nodemon (restart node -> local install) OR npm install -g nodemon (global install)
 * npm install axios
 * npm i ejs (ejs for templating)
 * npm install --save-dev webpack (webpack local)
 * npm install uuid
 * npm i method-override
 * npm i mongoose
 * npm install morgan
 * npm install ejs-mate --save
 * npm i joi

 Install with:
<npm install>

<How to use the API>

* Get <Status> of each page:
Use <GET> method on each page's <URL>

* Create <New> location post:
Use <POST> method on <baseURL>/locations
Add required data payload as shown:
<locations[title]>

* <Update> existing location post:
Use <PUT> method on <baseURL>/locations/<id>
Add required data payload as shown:
<locations[title]>

* <Delete> existing location post:
Use <Delete> method on <baseURL>/locations/<id>/delete