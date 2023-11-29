# MoveAss

Movement assessment application for fitbit


## Running

Open `index.html`


## Developing

### Setup

In the root of the working directory

```bash
npm install
```


### Formatting

Formatting is done with "prettier"

```bash
npm run format
```


### Testing

Jest is used for unit testing
HOWEVER, it wont work as the code currently is. 
The exports and imports for the tests to work are commented 
out because I could not get things working with CommonJS code
to be run in the browser. 

If the stuff is un-commented out, this is how one tests


```bash
npm test
```
