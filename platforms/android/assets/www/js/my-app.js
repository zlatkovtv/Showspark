// Initialize app
var myApp = new Framework7({
  material: true,
  cache:true,
  precompileTemplates: true,
  onAjaxStart: function (xhr) {
    // SpinnerPlugin.activityStart(null, {dimBackground: false});

  },
  onAjaxComplete: function (xhr) {
    // SpinnerPlugin.activityStop();
  },
  swipePanel: 'left',
  swipePanelActiveArea: 30,
  showBarsOnPageScrollEnd: false
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
    text: 'That\'s about it really! Enjoy!<br><br><a class="button button-big button-raised button-fill color-white color-black-custom  tutorial-close-btn" href="#">End Tutorial</a>'
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
  welcomescreen.close();
});

$$('.tutorial-open').on('click', function () {
  myApp.closePanel('left');
  welcomescreen.open();
});

// Add view
var mainView = myApp.addView('.view-main', {
  // Because we want to use dynamic navbar, we need to enable it for this view:
  dynamicNavbar: true
});

var selectedOrderByCategory;
var selectedGenres;
var tmdbApiKey = "17bad8fd5ecafe775377303226579c19";
var mostPopMovieObject = [];

// Handle Cordova Device Ready Event
$$(document).on('deviceready', function() {
  StatusBar.backgroundColorByHexString("#111112");
  // statusbarTransparent.enable();
  document.addEventListener("backbutton", exitPrompt, false);

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log("There is a logged user");

      welcomescreen.close();
      goToTabs();
    } else {
      console.log("No user is logged in");
    }
  });

  var provider = new firebase.auth.GoogleAuthProvider();
  var fbProvider = new firebase.auth.FacebookAuthProvider();

  $$('.google-auth-button').on('click', function () {
    console.log("!!!! google button event");
    firebase.auth().signInWithRedirect(provider).then(function() {
      firebase.auth().getRedirectResult().then(function(result) {
        var token = result.credential.accessToken;
        var user = result.user;
        console.log(user);
        goToTabs();
      }).catch(function(error) {
        console.log(error.code);
        console.log(error.message);
      });
    });
  });

  $$('.facebook-auth-button').on('click', function () {
    console.log("!!!! facebook button event");
    firebase.auth().signInWithRedirect(fbProvider).then(function() {
      firebase.auth().getRedirectResult().then(function(result) {
        var token = result.credential.accessToken;
        var user = result.user;
        console.log(user);
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
  mainView.router.back();
}

function goToPage(pageName) {
  mainView.router.loadPage(pageName + '.html');
}

function goToIndex() {
  mainView.router.loadPage('index.html');
}

function goToTabs(){
  mainView.router.loadPage('home.html');
}

function goToWizard(){
  mainView.router.loadPage('wizard.html');
}

function goToWizardOrderby() {
  mainView.router.loadPage('wizardOrderBy.html');
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
      message: 'Press back button again to exit',
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

myApp.onPageBeforeInit('login', function () {
  document.removeEventListener("backbutton", goToWizard, false);
  document.removeEventListener("backbutton", goToTabs, false);
  document.removeEventListener("backbutton", goToIndex, false);
  document.addEventListener("backbutton", exitPrompt, false);
})

myApp.onPageInit('login', function () {
  console.log("index onPageInit");

  var currUser = firebase.auth().currentUser;
  console.log(currUser);
  if(currUser) {
    $$('.user-name-label').text("Signed in as " + currUser.displayName);
  }

  var provider = new firebase.auth.GoogleAuthProvider();
  var fbProvider = new firebase.auth.FacebookAuthProvider();

  $$('.google-auth-button').on('click', function () {
    console.log("!!!! google button event");
    firebase.auth().signInWithRedirect(provider).then(function() {
      firebase.auth().getRedirectResult().then(function(result) {
        var token = result.credential.accessToken;
        var user = result.user;
        console.log(user);
        goToTabs();
      }).catch(function(error) {
        console.log(error.code);
        console.log(error.message);
      });
    });
  });

  $$('.facebook-auth-button').on('click', function () {
    console.log("!!!! facebook button event");
    firebase.auth().signInWithRedirect(fbProvider).then(function() {
      firebase.auth().getRedirectResult().then(function(result) {
        var token = result.credential.accessToken;
        var user = result.user;
        console.log(user);
        goToTabs();
      }).catch(function(error) {
        console.log(error.code);
        console.log(error.message);
      });
    });
  });
});

function normalizeApiObj(obj) {
  if (obj instanceof Array) {
    for (var i = 0; i < obj.length; i++) {
      obj[i].poster_path = "http://image.tmdb.org/t/p/w342/" + obj[i].poster_path;
      obj[i].backdrop_path = "http://image.tmdb.org/t/p/w1920/" + obj[i].backdrop_path;
      obj[i].release_year = obj[i].release_date.substring(0,4);
      if(obj[i].vote_average === 0) {
        obj[i].vote_average = "No rating yet";
      }
    }
  } else {
    obj.poster_path = "http://image.tmdb.org/t/p/w342" + obj.poster_path;
    obj.backdrop_path = "http://image.tmdb.org/t/p/w1920" + obj.backdrop_path;
    obj.release_year = obj.release_date.substring(0,4);
    if(obj.vote_average === 0) {
      obj.vote_average = "No rating yet";
    }
  }

  return obj;
}

function buildSortedMovieList(xhr) {
  apiObject = JSON.parse(xhr.response).results;
  apiObject = normalizeApiObj(apiObject);

  var myList = myApp.virtualList('.list-block.virtual-list', {
    // Array with items data
    items: apiObject,
    renderItem: function (index, item) {
      return '<li>' +
      '<a href="#" class="item-link item-content detail-link" id="'+ item.id + '">' +
      '<div class="item-media"><img src="' + item.poster_path + '" alt="Image not found" onerror="this.onerror=null;this.src=\'img/default-movie-poster.jpg\';" width="100" height="148"></div>' +
      '<div class="item-inner">' +
      '<div class="item-title-row">' +
      '<div class="item-title">' + (index + 1) + '. ' + item.original_title + '</div>' +
      '<div class="item-after">' + item.vote_average + '</div>' +
      '</div>' +
      '<div class="item-subtitle">' + item.release_year + '</div>' +
      '<div class="item-text item-text-5-rows">' + item.overview + '</div>' +
      '</div>' +
      '</a>' +
      '</li>';
    },
    height: 176
  });

  $$('.detail-link').on('click', function () {
    var clickedObjId = $$(this).prop('id');

    getMovieDetailInfo(clickedObjId);
  });
}

function getMovieDetailInfo(id) {
  $$.ajax({
    complete: function () {
      console.log("ajaxcomplete");
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

        popUpMovieDetail(movieObj);
        changeNavbarColor(movieObj);
        attachTrailer(id);
        getSimilarMovies(id);
        // getMovieReviews(id);
      }
    }
  })
}

function popUpMovieDetail(movieObj) {
  movieObj = normalizeApiObj(movieObj);
  var popupHTML = Template7.templates.movieDetailTemplate({
    obj: movieObj
  });
  myApp.popup(popupHTML);
}

function changeNavbarColor(obj) {
  var navbarColor = "black";

  var img = new Image();
  img.onload = function () {
    var colorThief = new ColorThief();
    navbarColor = colorThief.getColor(img);
    console.log(navbarColor);
    $$('#movieDetailNavbar').css('background-color', 'rgb(' + navbarColor[0]+ ',' + navbarColor[1] + ',' + navbarColor[2] + ')');
  };
  img.crossOrigin = 'Anonymous';
  img.src = obj.poster_path;
}

function getMovieReviews(id) {
  $$.ajax({
    complete: function () {
      console.log("ajaxcomplete");
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

        var popupHTML = '<div class="content-block-title">Reviews</div>' +
        '<div class="swiper-container swiper-1">' +
        '<div class="swiper-pagination"></div>' +
        '<div class="swiper-wrapper">';

        for (var i = 0; i < silimarMovieArr.length; i++) {
          silimarMovieArr[i] = normalizeApiObj(silimarMovieArr[i]);
          popupHTML += Template7.templates.similarMovieTemplate({
            obj: silimarMovieArr[i]
          });
        }

        popupHTML += '</div>'+
        '</div>';

        $$('#similarMovies').append(popupHTML);
      }
    }
  })
}

function attachTrailer(id) {
  $$.ajax({
    complete: function () {
      console.log("ajaxcomplete");
    },
    url: 'https://api.themoviedb.org/3/movie/' + id + '/videos?api_key=17bad8fd5ecafe775377303226579c19&language=en-US',
    statusCode: {
      404: function (xhr) {
        console.log('page not found');
      },
      200: function (xhr) {
        var movieObj = JSON.parse(xhr.response).results[0];
        if(!movieObj.key) {
          $$('#movie-detail-trailer-a').addClass('hidden');
        } else {
          $$('#movie-detail-trailer-a').on('click', function () {
            console.log("playing");
            YoutubeVideoPlayer.openVideo(movieObj.key, function(result) { console.log('YoutubeVideoPlayer result = ' + result); });
          });
        }
      }
    }
  })
}

function getSimilarMovies(id) {
  $$.ajax({
    complete: function () {
      console.log("ajaxcomplete");
    },
    url: 'https://api.themoviedb.org/3/movie/' + id + '/recommendations?api_key=17bad8fd5ecafe775377303226579c19&language=en-US',
    statusCode: {
      404: function (xhr) {
        console.log('page not found');
      },
      200: function (xhr) {
        var silimarMovieArr = JSON.parse(xhr.response).results;
        console.log("silimarMovieArr");
        console.log(silimarMovieArr);

        if(!silimarMovieArr || !silimarMovieArr instanceof Array || silimarMovieArr.length === 0) {
          return;
        }

        silimarMovieArr = silimarMovieArr.filter(function (movie) {
          return movie.backdrop_path != undefined;
        });

        var popupHTML = '<div class="content-block-title">Similar movies</div>' +
        '<div class="swiper-container swiper-1">' +
        '<div class="swiper-pagination"></div>' +
        '<div class="swiper-wrapper">';

        for (var i = 0; i < silimarMovieArr.length; i++) {
          // if(silimarMovieArr[i].id === id) {
          //   duplicate
          // }
          if(i >= 10) {
            break;
          }

          silimarMovieArr[i] = normalizeApiObj(silimarMovieArr[i]);
          popupHTML += Template7.templates.similarMovieTemplate({
            obj: silimarMovieArr[i]
          });
        }

        popupHTML += '</div>'+
        '</div>';

        $$('#similarMovies').append(popupHTML);

        var mySwiper1 = myApp.swiper('.swiper-1', {
          pagination:'.swiper-1 .swiper-pagination',
          spaceBetween: 50
        });
      }
    }
  })
}
