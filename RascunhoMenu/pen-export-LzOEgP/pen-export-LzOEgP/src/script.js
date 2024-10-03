var App = React.createClass({
  getInitialState: function() {
    return {
      movies: []
    }
  },
  componentDidMount: function() {
    // Is there a React-y way to avoid rebinding `this`? fat arrow?
    var th = this;
    this.serverRequest = 
      axios.get(this.props.source)
        .then(function(result) {    
          th.setState({
            movies: result.data
          });
        })
  },
  componentWillUnmount: function() {
    this.serverRequest.abort();
  },
  render: function() {
    return (
      <div className="div-master">
        <div className="before">
          <div className="arrow-left"></div>
        </div>
        <h4 className="title">Popular Movies</h4>
        <div className="middle">
          <div className="carrossel">
          {this.state.movies.map(function(movie) {
            return (
              <div className="item-c">
                <img src={movie.poster_url}/>
                <div className="play"></div>
                <div className="caption">{movie.title}</div>
              </div>
            );
          })}
          </div>
        </div>
        <div className="after">
          <div className="arrow-right"></div>
        </div>
      </div>
    )      
  }
});

React.render(<App source="https://s3.amazonaws.com/popular-movies/movies.json" />, document.querySelector("#app"));



var App2 = React.createClass({
  getInitialState: function() {
    return {
      movies2: []
    }
  },
  componentDidMount: function() {
    // Is there a React-y way to avoid rebinding `this`? fat arrow?
    var th = this;
    this.serverRequest = 
      axios.get(this.props.source)
        .then(function(result) {    
          th.setState({
            movies2: result.data
          });
        })
  },
  componentWillUnmount: function() {
    this.serverRequest.abort();
  },
  render: function() {
    return (
      <div className="div-master2">
        <div className="before">
          <div className="arrow-left"></div>
        </div>
        <h4 className="title">Popular Movies</h4>
        <div className="middle">
          <div className="carrossel">
          {this.state.movies2.map(function(movie2) {
            return (
              <div className="item-c">
                <img src={'https://raw.githubusercontent.com/FEND16/movie-json-data/master/img/'+movie2.poster}/>
                <div className="play"></div>
                <div className="caption">{movie2.title}</div>
              </div>
            );
          })}
          </div>
        </div>
        <div className="after">
          <div className="arrow-right"></div>
        </div>
      </div>
    )      
  }
});

React.render(<App2 source="https://api.myjson.com/bins/ex9pp" />, document.querySelector("#app2"));

function moveL(elm){
  var leftPos = $(elm).scrollLeft();
    console.log(leftPos);    
    $(elm).animate({
        scrollLeft: leftPos - 200
    }, 800);
}

function moveR(elm){
  var leftPos = $(elm).scrollLeft();
    console.log(leftPos);    
    $(elm).animate({
        scrollLeft: leftPos + 200
    }, 800);
}

$('.div-master .before').on('click', function(){
  moveL('.div-master');
});
$('.div-master .after').on('click', function(){
  moveR('.div-master')
});

$('.div-master2 .before').on('click', function(){
  moveL('.div-master2');
});
$('.div-master2 .after').on('click', function(){
  moveR('.div-master2')
});