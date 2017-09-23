var tmdbApiKey = "17bad8fd5ecafe775377303226579c19";

var myApp;
var $$;
var mainView;
var welcomescreen_slides;
var options;
var welcomescreen;

var loggedUser;

var backButtonIsPressed = false;
var isSearchPoppedUp = false;
initiateApp();
initiateWelcomeScreen();

$$('.tutorial-close-btn').on('click', function () {
  welcomescreen.close();
});

$$('.tutorial-open').on('click', function () {
  myApp.closePanel('left');
  welcomescreen.open();
  $$('.tutorial-close-btn').on('click', function () {
    welcomescreen.close();
  });
});

var movieGenresJson = [
  {
    "id": 28,
    "title": "Action",
    "min_votes": 1000
  },
  {
    "id": 12,
    "title": "Adventure",
    "min_votes": 1000
  },
  {
    "id": 16,
    "title": "Animation",
    "min_votes": 1000
  },
  {
    "id": 35,
    "title": "Comedy",
    "min_votes": 1000
  },
  {
    "id": 80,
    "title": "Crime",
    "min_votes": 1000
  },
  {
    "id": 99,
    "title": "Documentary",
    "min_votes": 100
  },
  {
    "id": 18,
    "title": "Drama",
    "min_votes": 1000
  },
  {
    "id": 10751,
    "title": "Family",
    "min_votes": 1000
  },
  {
    "id": 14,
    "title": "Fantasy",
    "min_votes": 1000
  },
  {
    "id": 36,
    "title": "History",
    "min_votes": 1000
  },
  {
    "id": 27,
    "title": "Horror",
    "min_votes": 1000
  },
  {
    "id": 10402,
    "title": "Music",
    "min_votes": 1000
  },
  {
    "id": 9648,
    "title": "Mystery",
    "min_votes": 1000
  },
  {
    "id": 10749,
    "title": "Romance",
    "min_votes": 1000
  },
  {
    "id": 878,
    "title": "Science Fiction",
    "min_votes": 1000
  },
  {
    "id": 10770,
    "title": "TV Movie",
    "min_votes": 1000
  },
  {
    "id": 53,
    "title": "Thriller",
    "min_votes": 1000
  },
  {
    "id": 10752,
    "title": "War",
    "min_votes": 1000
  },
  {
    "id": 37,
    "title": "Western",
    "min_votes": 1000
  }
]

var tvGenresJson = [
    {
      "id": 10759,
      "title": "Action & Adventure"
    },
    {
      "id": 16,
      "title": "Animation"
    },
    {
      "id": 35,
      "title": "Comedy"
    },
    {
      "id": 80,
      "title": "Crime"
    },
    {
      "id": 99,
      "title": "Documentary"
    },
    {
      "id": 18,
      "title": "Drama"
    },
    {
      "id": 10751,
      "title": "Family"
    },
    {
      "id": 10762,
      "title": "Kids"
    },
    {
      "id": 9648,
      "title": "Mystery"
    },
    {
      "id": 10763,
      "title": "News"
    },
    {
      "id": 10764,
      "title": "Reality"
    },
    {
      "id": 10765,
      "title": "Sci-Fi & Fantasy"
    },
    {
      "id": 10766,
      "title": "Soap"
    },
    {
      "id": 10767,
      "title": "Talk"
    },
    {
      "id": 10768,
      "title": "War & Politics"
    },
    {
      "id": 37,
      "title": "Western"
    }
  ]

var selectedOrderByCategory;
var selectedGenres;
var tvOrMovie;
var combineGenres;

$$(document).on('deviceready', function() {
  statusbarTransparent.enable();
  document.addEventListener("backbutton", exitPrompt, false);

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log(user);
      loggedUser = user;
      welcomescreen.close();
      goToTabs();
    } else {
      goToIndex();
      console.log("No user is logged in");
    }
  });

  var provider = new firebase.auth.GoogleAuthProvider();
  var fbProvider = new firebase.auth.FacebookAuthProvider();

  $$('.google-auth-button').on('click', function () {
    firebase.auth().signInWithRedirect(provider).then(function() {
      firebase.auth().getRedirectResult().then(function(result) {
        var token = result.credential.accessToken;
        var user = result.user;
        goToTabs();
      }).catch(function(error) {
        console.log(error.code);
        console.log(error.message);
      });
    });
  });

  $$('.facebook-auth-button').on('click', function () {
    firebase.auth().signInWithRedirect(fbProvider).then(function() {
      firebase.auth().getRedirectResult().then(function(result) {
        var token = result.credential.accessToken;
        var user = result.user;
        goToTabs();
      }).catch(function(error) {
        console.log(error.code);
        console.log(error.message);
      });
    });
  });

  console.log("Device is ready!");
});

function initiateApp() {
  myApp = new Framework7({
    material: true,
    cache:true,
    precompileTemplates: true,
    onAjaxStart: function (xhr) {
      console.log("Ajax start");
      SpinnerPlugin.activityStart(null, {dimBackground: false});

    },
    onAjaxComplete: function (xhr) {
      console.log("Ajax complete");
      SpinnerPlugin.activityStop();
    },
    swipePanel: 'left',
    swipePanelActiveArea: 30,
    showBarsOnPageScrollEnd: false,
    upscroller : {
      text: "Go to top"
    }
  });

  $$ = Dom7;
  mainView = myApp.addView('.view-main');
  screen.orientation.lock('portrait');
}

function initiateWelcomeScreen() {
  welcomescreen_slides = [
    {
      id: 'slide0',
      picture: '<div class="tutorialicon"></div>',
      text: 'Welcome to What To Watch!</br> We think you are going to love it. </br> <i class="material-icons md-36">chevron_right</i>'
    },
    {
      id: 'slide1',
      picture: '<div class="tutorialicon"></div>',
      text: 'This is a movie newsfeed app with a wizard that lets you find and sort movies and tv series easily! </br> <i class="material-icons md-36">chevron_right</i>'
    },
    {
      id: 'slide2',
      picture: '<a href="#" class="floating-button color-white custom-floating-button-tutorial">' +
      '<i class="material-icons color-deeppurple-custom">movie' +
      '</i>' +
      '</a>',
      text: 'Just press this button when you are in the newsfeed to fire up the wizard! </br> <i class="material-icons md-36">chevron_right</i>'
    },
    {
      id: 'slide3',
      picture: '<div class="tutorialicon"></div>',
      text: 'That\'s about it really! Enjoy!<br><br><a class="button button-big button-raised button-fill color-white color-black-custom tutorial-close-btn" href="#">End Tutorial</a>'
    }
  ];

  options = {
    'bgcolor': '#393939',
    'fontcolor': '#fff',
    'pagination': false,
    'parallax': true,
    'parallaxBackgroundImage': 'img/tutorial-back-cut.png',
    'parallaxSlideElements':  {title: -100, subtitle: -300, text: 0},
    'open': false
  }

  welcomescreen = myApp.welcomescreen(welcomescreen_slides, options);

  if(window.localStorage.getItem('has_run') === '') {
    window.localStorage.setItem('has_run', 'true');
    welcomescreen.open();
  }
}

function goBack(){
  mainView.router.back({
    animatePages: false
  });
}

function goToPage(pageName) {
  mainView.router.loadPage(pageName + '.html');
}

function goToIndex() {
  mainView.router.loadPage({
    url:'login.html',
    animatePages:false
  });
}

function goToTabs(){
  mainView.router.loadPage({
    url: 'home.html',
    animatePages: false
  });
}

function goToWizard(){
  mainView.router.loadPage('wizard.html');
}

function goToWizardResult(){
  mainView.router.loadPage('wizardResult.html');
}

function exitPrompt(){
  if(backButtonIsPressed) {
    backButtonIsPressed = false;
    navigator.app.clearHistory();
    navigator.app.exitApp();
  } else {
    backButtonIsPressed = true;
    myApp.addNotification({
      message: 'Press back again to exit',
      hold: 2500,
      onClose: function () {
        backButtonIsPressed = false;
      }
    });
  }
}

function normalizeApiObj(obj) {
  var arr = [];
  if(obj instanceof Array) {
    arr = obj;
  } else {
    arr.push(obj);
  }

  arr = arr.filter(function(item){return item.media_type !== "person";});

  for (var i = 0; i < arr.length; i++) {
    arr[i].poster_path = "http://image.tmdb.org/t/p/w342/" + arr[i].poster_path;
    arr[i].backdrop_path = "http://image.tmdb.org/t/p/w1920/" + arr[i].backdrop_path;
    if(arr[i].release_date) {
      arr[i].release_year = arr[i].release_date.substring(0,4);
      arr[i].type = 'movie';
    }

    if(arr[i].first_air_date) {
      arr[i].release_year = arr[i].first_air_date.substring(0,4);
      arr[i].type = 'tv';
    }

    if(arr[i].name) {
      arr[i].title = arr[i].name;
    }

    if(arr[i].vote_average === 0) {
      arr[i].vote_average = "No rating yet";
    }

    if(arr[i].vote_average % 1 === 0) {
      arr[i].vote_average = arr[i].vote_average + '.0';
    }

    if(arr[i].overview === "" || arr[i].overview === null) {
      arr[i].overview = "No overview found."
    }
  }

  if(obj instanceof Array) {
    return arr;
  } else {
    return arr[0];
  }
}

function getMovieDetailInfo(id) {
  $$.ajax({
    complete: function () {
    },
    url: 'https://api.themoviedb.org/3/' + tvOrMovie + '/' + id + '?api_key=17bad8fd5ecafe775377303226579c19&language=en-US',
    statusCode: {
      404: function (xhr) {
        console.log('page not found');
      },
      200: function (xhr) {
        var movieObj = JSON.parse(xhr.response);
        if(!movieObj.backdrop_path && !movieObj.poster_path) {
          myApp.addNotification({
            message: 'No movie info',
            hold: 2500
          });
          return;
        }

        console.log(movieObj);
        popUpMovieDetail(movieObj);

        if(movieObj.imdb_id || movieObj.homepage) {
          attachButtons(movieObj);
        }

        changeNavbarColor(movieObj);
        if (typeof movieObj.genres !== 'undefined' && movieObj.genres.length > 0) {
          attachGenres(movieObj.genres);
        }

        attachTrailer(movieObj);
        getCast(id);
        getSimilarMovies(id);

        getMovieReviews(id);
      }
    }
  })
}

function attachButtons(obj) {
  var html = '<div class="row">' +
  '<div class="content-block-title">Social</div>' +
  '</div>' +
  '<div class="row">' +
  '<div class="padding-sides-8">';
  if(obj.homepage) {
    html += '<a href="#" id="homepageButton" class="button button-raised button-fill custom-purple-color float-left margin-right-10">Official website</a>';
  }

  if(obj.imdb_id) {
    html += '<a href="#" id="imdbButton" class="float-left margin-right-10"></a>';
  }

  if(obj.id) {
    html += '<a href="#" id="tmdbButton" class="float-left margin-right-10"></a>';
  }

  html += '</div>' +
  '</div>';

  $$('#socialButtonsContainer').append(html);

  $$('#homepageButton').on('click', function () {
    cordova.plugins.browsertab.openUrl(obj.homepage);
  });

  $$('#imdbButton').on('click', function () {
    cordova.plugins.browsertab.openUrl('http://www.imdb.com/title/' + obj.imdb_id);
  });

  $$('#tmdbButton').on('click', function () {
    cordova.plugins.browsertab.openUrl('https://www.themoviedb.org/' + obj.type + '/' + obj.id);
  });
}


function popUpMovieDetail(movieObj) {
  movieObj = normalizeApiObj(movieObj);
  var popupHTML = Template7.templates.movieDetailTemplate({
    obj: movieObj
  });
  myApp.popup(popupHTML);

  $$('.share-movie').on('click', function () {
    var options = {
      files: [],
      url: 'http://www.imdb.com/title/' + movieObj.imdb_id,
      chooserTitle: 'Share movie via' // Android only, you can override the default share sheet title
    }

    var onShareSuccess = function(result) {

    }

    var onShareError = function(msg) {
      myApp.addNotification({
        message: 'Sharing failed - ' + msg,
        hold: 2500
      });
    }

    if(movieObj && movieObj.imdb_id) {
      window.plugins.socialsharing.shareWithOptions(options, onShareSuccess, onShareError);
    } else {
      onShareError('no movie link found');
    }
  });

  if(isSearchPoppedUp) {
    attachSearchDetailCloseFunctionality();
  } else {
    attachClosePopupsToBackButton();
  }
}

function changeNavbarColor(obj) {
  var navbarColor = "black";

  var img = new Image();
  img.onload = function () {
    var vibrant = new Vibrant(img);
    var swatches = vibrant.swatches();
    for (var swatch in swatches){
        if (swatches.hasOwnProperty(swatch) && swatches[swatch]){
            navbarColor = swatches[swatch].getHex();
            break;
        }
    }

    $$('#movieDetailNavbar').css('background-color', navbarColor);
  };
  img.crossOrigin = 'Anonymous';
  img.src = obj.poster_path;
}

function getCast(id) {
  $$.ajax({
    complete: function () {
    },
    url: 'https://api.themoviedb.org/3/' + tvOrMovie + '/' + id + '/credits?api_key=17bad8fd5ecafe775377303226579c19',
    statusCode: {
      404: function (xhr) {
        console.log('page not found');
      },
      200: function (xhr) {
        var crewObj = JSON.parse(xhr.response);
        console.log(crewObj);
        var cast = crewObj.cast.slice(0, 20);
        var crew = crewObj.crew;

        if((!cast && !crew) || (cast.length === 0 && crew.length === 0)) {
          return;
        }

        var directorArr = crew.filter(function( obj ) {
          return obj.job === "Director";
        });

        var director = directorArr[0];

        var crewHtml = '<div class="horizontal-scroll" style="padding: 0px 4px; margin:0px;height: 295px;"><div>';
        if(director && director.name && director.job) {
          crewHtml += '<div class="content-block-title director-title display-inline-block">Director</div>';
        }

        if(cast.length !== 0) {
          crewHtml += '<div class="content-block-title cast-title display-inline-block">Cast</div>';
        }

        crewHtml += '</div>';
        if(director && director.name && director.job) {
          crewHtml += '<div class="card director-crew-card display-inline-block" style="background:url(http://image.tmdb.org/t/p/w342' + director.profile_path + '")  50% / 100%;">' +
      			'<img class="innerImgResizer" src="http://image.tmdb.org/t/p/w342' + director.profile_path + '">' +
      			'<div class="absolute card similar-movie-title">' +
      				director.name +
      			'</div>' +
      		'</div>';
        }

        for (var i = 0; i < cast.length; i++) {
          if(!cast[i].profile_path || !cast[i].name) {
            continue;
          }

          crewHtml += Template7.templates.castTemplate({
            obj: cast[i]
          });
        }

        crewHtml += '</div>';

        $$('#castContainer').append(crewHtml);
      }
    }
  })
}

function getMovieReviews(id) {
  $$.ajax({
    complete: function () {
    },
    url: 'https://api.themoviedb.org/3/' + tvOrMovie + '/' + id + '/reviews?api_key=17bad8fd5ecafe775377303226579c19&language=en-US',
    statusCode: {
      404: function (xhr) {
        console.log('No reviews for item');
      },
      200: function (xhr) {
        var reviewArr = JSON.parse(xhr.response).results;
        if(!reviewArr || !reviewArr instanceof Array || reviewArr.length === 0) {
          return;
        }

        var rvHtml = '<div class="content-block-title">Reviews</div>';

        for (var i = 0; i < reviewArr.length; i++) {
          rvHtml += '<div class="card" onClick="cordova.plugins.browsertab.openUrl(\'' + reviewArr[i].url + '\');">'+
            '<div class="card-header noselect">From ' + reviewArr[i].author + '</div>' +
            '<div class="card-content">' +
              '<div class="card-content-inner max-height-195 clamp noselect">' + reviewArr[i].content + '</div>' +
            '</div>' +
          '</div>';
        }

        $$('#reviewsContainer').append(rvHtml);

        var clampArr = $$('.clamp');
        for (var i = 0; i < clampArr.length; i++) {
          $clamp(clampArr[i], {clamp: 10});
        }
      }
    }
  })
}

function attachTrailer(obj) {
  var navbarColor = "black";

  var img = new Image();
  img.onload = function () {
    var vibrant = new Vibrant(img);
    var swatches = vibrant.swatches();
    for (var swatch in swatches){
        if (swatches.hasOwnProperty(swatch) && swatches[swatch]){
            navbarColor = swatches[swatch].getHex();
            break;
        }
    }

    $$('#movie-detail-trailer-a').css('background-color', navbarColor);
  };
  img.crossOrigin = 'Anonymous';
  img.src = obj.poster_path;

  $$.ajax({
    complete: function () {
    },
    url: 'https://api.themoviedb.org/3/' + tvOrMovie + '/' + obj.id + '/videos?api_key=17bad8fd5ecafe775377303226579c19&language=en-US',
    statusCode: {
      404: function (xhr) {
        console.log('page not found');
      },
      200: function (xhr) {
        var movieObj = JSON.parse(xhr.response).results[0];
        if(!movieObj || !movieObj.key) {
          $$('#movie-detail-trailer-a').addClass('hidden');
        } else {
          $$('#movie-detail-trailer-a').on('click', function () {
            console.log("playing");
            YoutubeVideoPlayer.openVideo(movieObj.key, function(result) {
              console.log('YoutubeVideoPlayer result = ' + result);
            });
          });
        }
      }
    }
  })
}

function getSimilarMovies(id) {
  $$.ajax({
    complete: function () {
    },
    url: 'https://api.themoviedb.org/3/' + tvOrMovie + '/' + id + '/recommendations?api_key=17bad8fd5ecafe775377303226579c19&language=en-US',
    statusCode: {
      404: function (xhr) {
        console.log('page not found');
      },
      200: function (xhr) {
        var silimarMovieArr = JSON.parse(xhr.response).results;

        if(!silimarMovieArr || !silimarMovieArr instanceof Array || silimarMovieArr.length === 0) {
          return;
        }

        silimarMovieArr = silimarMovieArr.filter(function (movie) {
          return movie.backdrop_path != undefined;
        });

        if(silimarMovieArr.length < 1) {
          return;
        }

        var popupHTML = '<div class="row">' +
        '<div class="content-block-title">Similar movies</div>' +
        '<div class="swiper-container swiper-1">' +
        '<div class="swiper-pagination"></div>' +
        '<div class="swiper-wrapper">';

        for (var i = 0; i < silimarMovieArr.length; i++) {
          if(i >= 10) {
            break;
          }

          silimarMovieArr[i] = normalizeApiObj(silimarMovieArr[i]);
          popupHTML += Template7.templates.similarMovieTemplate({
            obj: silimarMovieArr[i]
          });
        }

        popupHTML += '</div>'+
        '</div>' +
        '</div>';

        $$('#similarMoviesContainer').append(popupHTML);

        var mySwiper1 = myApp.swiper('.swiper-1', {
          pagination:'.swiper-1 .swiper-pagination',
          spaceBetween: 50
        });

        $$('.similar-movie-div').on('click', function () {
          var clickedObjId = $$(this).prop('id');
          clickedObjId = clickedObjId.replace('similarMovieId', '');
          console.log(clickedObjId);
          $$('#movieDetailContainer').remove();
          getMovieDetailInfo(clickedObjId);
        });
      }
    }
  })
}

function attachGenres(genresArr) {
  genresArr.sort(compareGenres);
  var popupHTML = '<div class="row">' +
  '<div class="content-block-title">Genres</div>' +
  '</div>' +
  '<div class="row">' +
  '<div class="padding-sides-8 horizontal-scroll movie-detail-horizontal-scroll">' +
  '<div class="inner-horizontal-scroll">';

  genresArr = genresArr.map(function(genre) {
    return genre.name;
  });

  for (var i = 0; i < genresArr.length; i++) {
    popupHTML +=
       '<div class="chip">' +
         '<div class="chip-label">' + genresArr[i] + '</div>' +
       '</div>';
  }

  popupHTML += '</div>' +
  '</div>' +
  '</div>';

  $$('#genresContainer').append(popupHTML);
}

function compareGenres(a,b) {
  if (a.name < b.name)
    return -1;
  if (a.name > b.name)
    return 1;
  return 0;
}

function buildSortedItemList(xhr, listElementToAppendTo) {
  apiObject = JSON.parse(xhr.response).results;
  apiObject = normalizeApiObj(apiObject);
  if(apiObject && apiObject.length === 0) {
    myApp.addNotification({
      message: 'No items found for these specifiers',
      hold: 2500
    });
  }

  var myList = myApp.virtualList(listElementToAppendTo, {
    items: apiObject,
    renderItem: function (index, item) {
      return '<li>' +
      '<a href="#" class="item-link item-content detail-link" id="'+ item.id + '">' +
      '<div class="item-media" style="padding: 0px;"><img class="card" src="' + item.poster_path + '" alt="Image not found" onerror="this.onerror=null;this.src=\'img/default-movie-poster.jpg\';" width="100" height="148"></div>' +
      '<div class="item-inner">' +
      '<div class="item-title-row">' +
      '<div class="item-title">' + (index + 1) + '. ' + item.title + '</div>' +
      '<div class="item-after">' + item.vote_average + '</div>' +
      '</div>' +
      '<div class="item-subtitle">' + item.release_year + '</div>' +
      '<div class="item-text item-text-5-rows">' + item.overview + '</div>' +
      '</div>' +
      '</a>' +
      '</li>';
    },
    height: 163
  });

  $$('.detail-link').on('click', function () {
    var clickedObjId = $$(this).prop('id');
    tvOrMovie = apiObject.find(x => x.id == clickedObjId).type;

    getMovieDetailInfo(clickedObjId);
  });
}

var typingTimer;

function callApiOnSearchEvent(searchValue) {
  if(!searchValue || searchValue.length === 0 || searchValue === '') {
    return;
  }

  clearTimeout(typingTimer);
  typingTimer = setTimeout(function() {
    $$.ajax({
      complete: function () {
      },
      url: 'https://api.themoviedb.org/3/search/multi' + '?query=' + searchValue + '&include_adult=false&api_key=' + tmdbApiKey,
      statusCode: {
        404: function (xhr) {
          console.log('page not found');
        },
        200: function (xhr) {
          buildSortedItemList(xhr, '.list-block.search-result-list.virtual-list.media-list');
        }
      }
    })
  }, 700);
}

function attachSearchButton() {
  $$('.search-button').on('click', function () {
    var popupHTML = Template7.templates.searchTemplate({
    });
    isSearchPoppedUp = true;
    myApp.popup(popupHTML);
    attachCloseSearchFunctionality();
  });
}

function attachExitToBackButton() {
  document.removeEventListener("backbutton", goToWizard, false);
  document.removeEventListener("backbutton", goToTabs, false);
  document.removeEventListener("backbutton", goToIndex, false);
  document.addEventListener("backbutton", exitPrompt, false);
}

function attachIndexToBack() {
  document.removeEventListener("backbutton", goToWizard, false);
  document.removeEventListener("backbutton", goToTabs, false);
  document.removeEventListener("backbutton", exitPrompt, false);
  document.addEventListener("backbutton", goToIndex, false);
}

function attachTabsToBackButton() {
  document.removeEventListener("backbutton", goToWizard, false);
  document.removeEventListener("backbutton", exitPrompt, false);
  document.removeEventListener("backbutton", goToIndex, false);
  document.addEventListener("backbutton", goToTabs, false);
}

function attachClosePopupsToBackButton() {
  document.removeEventListener("backbutton", goToWizard, false);
  document.removeEventListener("backbutton", exitPrompt, false);
  document.removeEventListener("backbutton", goToIndex, false);
  document.removeEventListener("backbutton", goToTabs, false);
  document.addEventListener("backbutton", closePopups, false);
}

function attachCloseDetailPopupToBackButton() {
  document.removeEventListener("backbutton", goToWizard, false);
  document.removeEventListener("backbutton", exitPrompt, false);
  document.removeEventListener("backbutton", goToIndex, false);
  document.removeEventListener("backbutton", goToTabs, false);
  document.addEventListener("backbutton", closeDetailPopup, false);
}

function attachCloseSearchFunctionality() {
  document.removeEventListener("backbutton", goToWizard, false);
  document.removeEventListener("backbutton", exitPrompt, false);
  document.removeEventListener("backbutton", goToIndex, false);
  document.removeEventListener("backbutton", goToTabs, false);
  document.addEventListener("backbutton", closeSearch, false);
}

function attachSearchDetailCloseFunctionality() {
  myApp.addNotification({
    message: 'in',
    hold: 2500
  });
  document.removeEventListener("backbutton", goToWizard, false);
  document.removeEventListener("backbutton", exitPrompt, false);
  document.removeEventListener("backbutton", goToIndex, false);
  document.removeEventListener("backbutton", goToTabs, false);
  document.addEventListener("backbutton", closeDetailPopupOnSearch, false);
}

function closePopups() {
  myApp.closeModal();
  document.removeEventListener("backbutton", closePopups, false);
  document.addEventListener("backbutton", goToTabs, false);
}

function closeSearch() {
  isSearchPoppedUp = false;
  myApp.closeModal('.popup-search');
  document.removeEventListener("backbutton", closeSearch, false);
  document.addEventListener("backbutton", exitPrompt, false);
}

function closeSignUpPopup() {
  myApp.closeModal('.popup-sign-up');
  document.removeEventListener("backbutton", closeSignUpPopup, false);
  document.addEventListener("backbutton", goToIndex, false);
}

function closeDetailPopup() {
  myApp.closeModal('.popup-movie-detail');
  document.removeEventListener("backbutton", closeDetailPopup, false);
  document.addEventListener("backbutton", closePopups, false);
}

function closeDetailPopupOnSearch() {
  isSearchPoppedUp = false;
  //myApp.closeModal('.popup-movie-detail');
  document.removeEventListener("backbutton", closeDetailPopupOnSearch, false);
  document.addEventListener("backbutton", closeSearch, false);
}

function closeDetailPopupWhenCheckedForSearch() {
  if(isSearchPoppedUp) {
    closeDetailPopupOnSearch();
  } else {
    closePopups();
  }
}
