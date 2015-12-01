#React RnD
A Research and Development React component repository for learning new techniques of React Data management using Relay-like REST API queries or Centralizing Application state with ImmutableJS. 

##Simple Usage

```
npm install
npm run start-server & npm start
open http://localhost:3001
```

##Current Research
Currently on display is a Star Wars Starship tracker. It allows for favoriting ships from the Star Wars Universe (data retrieved from [Star Wars API](http://swapi.co)). It supports typical CRUD operations for adding and deleting ships. 

###Sub-Modules
These are the current Data management modules I am testing. 

####Query Container Store "RESTful Relay"

The RESTful Relay project is meant to mimic somewhat Facebook's [Relay]() library but instead of GraphQL we use traditional REST API endpoints. I wish to make this module as simple and concise as possible to achieve RESTful API transactions with higher order components. 

The ```src/query``` folder contains a Store and a Container component. 

The Container component is similar to Relay's [createContainer]() higher-order component. In short, it is a function that takes a React component arg then takes an options object. The object contains the data to define the "route" to retrieve and a unique data "key" definition to label the route.

```
//Query Container Component

export default Query.createContainer(Starships, {
    "key": "starships",  //Unique identifier for route result caching
    "route": "http://localhost:3000/starships" //REST Route endpoint
});

//React component

let Starships = React.createClass({
    propTypes: {
        queryData: React.PropTypes.shape({ //this.props.queryData object
            res: React.PropTypes.object, //Axios AJAX result object
            req: React.PropTypes.object, //Request object based on createContainer args
            
            //this.props.setVariables({...}) Alter the injected REST API query.
            //Instantly async runs and returns results via props.
            setVariables: React.PropTypes.func, 
            
            isLoaded: React.PropTypes.bool, //Simple isLoaded boolean
            isError: React.PropTypes.bool //Simple isError boolean
        })
    },
    //... Rest of component
});

```







