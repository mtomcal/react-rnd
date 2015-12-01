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

####Query Container "RESTful Relay"

*Dependencies: Axios, EventEmitter, ImmutableJS, Invariant, Lodash*

The RESTful Relay project is meant to mimic somewhat Facebook's [Relay]() library but instead of GraphQL we use traditional REST API endpoints. I wish to make this module as simple and concise as possible to achieve RESTful API transactions with higher order components. 

The ```src/query``` folder contains a Store and a Container component. 

The Container component is similar to Relay's [createContainer]() higher-order component. In short, it is a function that takes a React component arg then takes an options object. The object contains the data to define the "route" to retrieve and a unique data "key" definition to label the route. The createContainer function will decorate the Starships component with a Data component that will run a GET request before loading the child. The query is cached for any child components calling the same endpoint "key"-ed to "starships".

```
//React component

let Starships = React.createClass({
    propTypes: {
        queryData: React.PropTypes.shape({ //this.props.queryData object
            res: React.PropTypes.object, //Axios AJAX result object
            req: React.PropTypes.object, //Request object based on createContainer args
            
            //Alters the injected REST API query 
            //and reruns the query updating props. 
            setVariables: React.PropTypes.func, 
            
            isLoaded: React.PropTypes.bool, //Simple isLoaded boolean
            isError: React.PropTypes.bool //Simple isError boolean
        })
    },
    //... Rest of component
});

//Query Container Component

export default Query.createContainer(Starships, {
    "key": "starships",  //Unique identifier for route result caching
    "route": "http://localhost:3000/starships" //GET Route endpoint
});
```

To perform a POST/UPDATE/PATCH/PUT query, we will use the updateMutation function from ```src/query/Store```. 

```
//AddStarship.js
export default React.createClass({
    onSubmit(e) {
        if (e) {
            e.preventDefault();
        }
        QueryStore.updateMutation({
            method: "post",
            route: "http://localhost:3000/starships",
            payload: {
                //Payload POST values
            },
            affects: ['starships'] //Tells Query Store to Update Starships component
        }, (err, res) => {
        	//Optional callback on query completion
        });
    },
    render() {
        return (
            <div className="row">
                <div className="col-sm-6">
                    <form>
                        //...More JSX
                        <button onClick={this.onSubmit} className="btn btn-default">Add</button>
                    </form>
                </div>
            </div>
        );
    }
});
```

Once the submit button is clicked for the form, it posts the data from the form to the API and notifies any child createContainer components "key"-ed to "starships" to run a fresh GET query to update the cache.








