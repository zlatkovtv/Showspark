var tmdbApiKey = "17bad8fd5ecafe775377303226579c19";

// Initialize app
var myApp = new Framework7({
  material: true,
  cache:true,
  precompileTemplates: true,
  onAjaxStart: function (xhr) {
    console.log("Ajax start");
    // SpinnerPlugin.activityStart(null, {dimBackground: false});

  },
  onAjaxComplete: function (xhr) {
    console.log("Ajax complete");
    // SpinnerPlugin.activityStop();
  },
  swipePanel: 'left',
  swipePanelActiveArea: 30,
  showBarsOnPageScrollEnd: false,
  upscroller : {
    text: "Go to top"
  }
});

screen.orientation.lock('portrait');

var $$ = Dom7;

var welcomescreen_slides = [
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

var options = {
  'bgcolor': '#393939',
  'fontcolor': '#fff',
  'pagination': false,
  'parallax': true,
  'parallaxBackgroundImage': 'img/tutorial-back-cut.png',
  'parallaxSlideElements':  {title: -100, subtitle: -300, text: 0},
  'open': false
}

var welcomescreen = myApp.welcomescreen(welcomescreen_slides, options);

if(window.localStorage.getItem('has_run') === '') {
  window.localStorage.setItem('has_run', 'true');
  welcomescreen.open();
}

$$('.tutorial-close-btn').on('click', function () {
  console.log("CLOSING");
  welcomescreen.close();
});

$$('.tutorial-open').on('click', function () {
  myApp.closePanel('left');
  welcomescreen.open();
  $$('.tutorial-close-btn').on('click', function () {
    welcomescreen.close();
  });
});

// Add view
var mainView = myApp.addView('.view-main', {
  // Because we want to use dynamic navbar, we need to enable it for this view:
  dynamicNavbar: true
});

var selectedOrderByCategory;
var selectedGenres;
var mostPopMovieObject = [];

// Handle Cordova Device Ready Event
$$(document).on('deviceready', function() {
  statusbarTransparent.enable();
  document.addEventListener("backbutton", exitPrompt, false);

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log("There is a logged user");

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

var pressed = false;

function exitPrompt(){
  if(pressed) {
    pressed = false;
    navigator.app.clearHistory();
    navigator.app.exitApp();
  } else {
    pressed = true;
    myApp.addNotification({
      message: 'Press back again to exit',
      hold: 2500,
      onClose: function () {
        pressed = false;
      }
    });
  }
}

function closeSignUpPopup() {
  myApp.closeModal('.popup-sign-up');
  document.removeEventListener("backbutton", closeSignUpPopup, false);
  document.addEventListener("backbutton", goToIndex, false);
}

function normalizeApiObj(obj) {
  var arr = [];
  if(obj instanceof Array) {
    arr = obj;
  } else {
    arr.push(obj);
  }

  for (var i = 0; i < arr.length; i++) {
    arr[i].poster_path = "http://image.tmdb.org/t/p/w342/" + arr[i].poster_path;
    arr[i].backdrop_path = "http://image.tmdb.org/t/p/w1920/" + arr[i].backdrop_path;
    arr[i].release_year = arr[i].release_date.substring(0,4);
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
    url: 'https://api.themoviedb.org/3/movie/' + id + '?api_key=17bad8fd5ecafe775377303226579c19&language=en-US',
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

        attachTrailer(id);
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
  '<div class="padding-sides-8">' +
  '<a href="#" id="homepageButton" class="button button-raised button-fill custom-purple-color float-left margin-right-5">Official website</a>' +
  '<a href="#" id="imdbButton" class="float-left margin-right-5">' +
  '</a>' +
  '</div>' +
  '</div>';

  $$('#socialButtonsContainer').append(html);

  $$('#imdbButton').on('click', function () {
    cordova.plugins.browsertab.openUrl('http://www.imdb.com/title/' + obj.imdb_id);
  });

  $$('#homepageButton').on('click', function () {
    cordova.plugins.browsertab.openUrl(obj.homepage);
  });
}

function closePopups() {
  myApp.closeModal();
  document.removeEventListener("backbutton", closePopups, false);
  document.addEventListener("backbutton", goToTabs, false);
}

function popUpMovieDetail(movieObj) {
  movieObj = normalizeApiObj(movieObj);
  var popupHTML = Template7.templates.movieDetailTemplate({
    obj: movieObj
  });
  myApp.popup(popupHTML);

  document.removeEventListener("backbutton", goToTabs, false);
  document.removeEventListener("backbutton", goToWizard, false);
  document.addEventListener("backbutton", closePopups, false);
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

    // var colorThief = new ColorThief();
    // navbarColor = colorThief.getColor(img);
    $$('#movieDetailNavbar').css('background-color', navbarColor);
  };
  img.crossOrigin = 'Anonymous';
  img.src = obj.poster_path;
}

function getMovieReviews(id) {
  $$.ajax({
    complete: function () {
    },
    url: 'https://api.themoviedb.org/3/movie/' + id + '/reviews?api_key=17bad8fd5ecafe775377303226579c19&language=en-US',
    statusCode: {
      404: function (xhr) {
        console.log('page not found');
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
              '<div class="card-content-inner max-height-195 justify clamp noselect">' + reviewArr[i].content + '</div>' +
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

function attachTrailer(id) {
  $$.ajax({
    complete: function () {
    },
    url: 'https://api.themoviedb.org/3/movie/' + id + '/videos?api_key=17bad8fd5ecafe775377303226579c19&language=en-US',
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
    url: 'https://api.themoviedb.org/3/movie/' + id + '/recommendations?api_key=17bad8fd5ecafe775377303226579c19&language=en-US',
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
