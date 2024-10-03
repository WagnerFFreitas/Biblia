var App = React.createClass({ displayName: "App",
  getInitialState: function () {
    return {
      movies: [] };

  },
  componentDidMount: function () {
    // Is there a React-y way to avoid rebinding `this`? fat arrow?
    var th = this;
    this.serverRequest =
    axios.get(this.props.source).
    then(function (result) {
      th.setState({
        movies: result.data });

    });
  },
  componentWillUnmount: function () {
    this.serverRequest.abort();
  },
  render: function () {
    return /*#__PURE__*/(
      React.createElement("div", { className: "div-master" }, /*#__PURE__*/
      React.createElement("div", { className: "before" }, /*#__PURE__*/
      React.createElement("div", { className: "arrow-left" })), /*#__PURE__*/

      React.createElement("h4", { className: "title" }, "Popular Movies"), /*#__PURE__*/
      React.createElement("div", { className: "middle" }, /*#__PURE__*/
      React.createElement("div", { className: "carrossel" },
      this.state.movies.map(function (movie) {
        return /*#__PURE__*/(
          React.createElement("div", { className: "item-c" }, /*#__PURE__*/
          React.createElement("img", { src: movie.poster_url }), /*#__PURE__*/
          React.createElement("div", { className: "play" }), /*#__PURE__*/
          React.createElement("div", { className: "caption" }, movie.title)));


      }))), /*#__PURE__*/


      React.createElement("div", { className: "after" }, /*#__PURE__*/
      React.createElement("div", { className: "arrow-right" }))));



  } });


React.render( /*#__PURE__*/React.createElement(App, { source: "https://s3.amazonaws.com/popular-movies/movies.json" }), document.querySelector("#app"));



var App2 = React.createClass({ displayName: "App2",
  getInitialState: function () {
    return {
      movies2: [] };

  },
  componentDidMount: function () {
    // Is there a React-y way to avoid rebinding `this`? fat arrow?
    var th = this;
    this.serverRequest =
    axios.get(this.props.source).
    then(function (result) {
      th.setState({
        movies2: result.data });

    });
  },
  componentWillUnmount: function () {
    this.serverRequest.abort();
  },
  render: function () {
    return /*#__PURE__*/(
      React.createElement("div", { className: "div-master2" }, /*#__PURE__*/
      React.createElement("div", { className: "before" }, /*#__PURE__*/
      React.createElement("div", { className: "arrow-left" })), /*#__PURE__*/

      React.createElement("h4", { className: "title" }, "Popular Movies"), /*#__PURE__*/
      React.createElement("div", { className: "middle" }, /*#__PURE__*/
      React.createElement("div", { className: "carrossel" },
      this.state.movies2.map(function (movie2) {
        return /*#__PURE__*/(
          React.createElement("div", { className: "item-c" }, /*#__PURE__*/
          React.createElement("img", { src: 'https://raw.githubusercontent.com/FEND16/movie-json-data/master/img/' + movie2.poster }), /*#__PURE__*/
          React.createElement("div", { className: "play" }), /*#__PURE__*/
          React.createElement("div", { className: "caption" }, movie2.title)));


      }))), /*#__PURE__*/


      React.createElement("div", { className: "after" }, /*#__PURE__*/
      React.createElement("div", { className: "arrow-right" }))));



  } });


React.render( /*#__PURE__*/React.createElement(App2, { source: "https://api.myjson.com/bins/ex9pp" }), document.querySelector("#app2"));

function moveL(elm) {
  var leftPos = $(elm).scrollLeft();
  console.log(leftPos);
  $(elm).animate({
    scrollLeft: leftPos - 200 },
  800);
}

function moveR(elm) {
  var leftPos = $(elm).scrollLeft();
  console.log(leftPos);
  $(elm).animate({
    scrollLeft: leftPos + 200 },
  800);
}

$('.div-master .before').on('click', function () {
  moveL('.div-master');
});
$('.div-master .after').on('click', function () {
  moveR('.div-master');
});

$('.div-master2 .before').on('click', function () {
  moveL('.div-master2');
});
$('.div-master2 .after').on('click', function () {
  moveR('.div-master2');
});