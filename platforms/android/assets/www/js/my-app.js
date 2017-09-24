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
var wizardMovieRepository = [];
var firebaseDb;
var firebaseAuth;

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
  screen.orientation.lock('portrait');
  document.addEventListener("backbutton", exitPrompt, false);
  firebaseDb = firebase.database();
  var provider = new firebase.auth.GoogleAuthProvider();
  var fbProvider = new firebase.auth.FacebookAuthProvider();
  fbProvider.addScope('email');

  //check for pending redirect if past login has dropped
  firebase.auth().getRedirectResult().then(function(result) {
    var token = result.credential.accessToken;
    var user = result.user;
    goToTabs();
  }).catch(function(error) {
    if(!error.email) {
      return;
    }

    firebase.auth().fetchProvidersForEmail(error.email)
    .then(function(providers) {
      var isEmailRegisteredInGoogle = providers.indexOf("google.com") > -1;
      if(isEmailRegisteredInGoogle) {
        provider.setCustomParameters({login_hint: error.email});
        signInWithProvider(provider);
      }
    });
  });

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      loggedUser = user;
      console.log(user);
      welcomescreen.close();
      attachProfileStatsToPanel(user);
      goToTabs();
    } else {
      goToIndex();
      console.log("No user is logged in");
    }
  });

  $$('.google-auth-button').on('click', function () {
    signInWithProvider(provider);
  });

  $$('.facebook-auth-button').on('click', function () {
    signInWithProvider(fbProvider);
  });

  console.log("Device is ready!");
});

function signInWithProvider(provider) {
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
}

function attachProfileStatsToPanel(user) {
  $$("#profileFullName").text(user.displayName);
  $$("#profileEmail").text(user.email);
  $$("#profileImage").css({
    "background-image": "url("+ user.photoURL +")",
    "display": "block"
  });
}

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
}

function initiateWelcomeScreen() {
  welcomescreen_slides = [
    {
      id: 'slide0',
      picture: '<div class="tutorialicon"></div>',
      text: 'Welcome to Showspark!</br> We think you are going to love it. </br> Swipe left to continue. </br> <i class="material-icons md-36">arrow_forward</i>'
    },
    {
      id: 'slide1',
      picture: '<div class="tutorialicon"></div>',
      text: 'This is an app that lets you discover and browse </br> through your favourite movies or TV series! </br> <i class="material-icons md-36">arrow_forward</i>'
    },
    {
      id: 'slide2',
      picture: '<a href="#" class="floating-button color-white custom-floating-button-tutorial pulse-btn">' +
      '<i class="material-icons color-deeppurple-custom">movie' +
      '</i>' +
      '</a>',
      text: 'Just press this button when you are in the newsfeed to discover new stuff! </br> <i class="material-icons md-36">arrow_forward</i>'
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

  if(!window.localStorage.getItem('has_run')) {
    window.localStorage.setItem('has_run', true);
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
  if ($$('body').hasClass('with-panel-left-cover')) {
    myApp.closePanel();
    return;
  }

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

    if(arr[i].vote_average !== 10 && arr[i].vote_average.toString().length >= 4) {
      arr[i].vote_average = Math.round( arr[i].vote_average * 10 ) / 10;
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

function buildSortedItemList(xhr, listElementToAppendTo, link) {
  wizardMovieRepository = [];
  $$(listElementToAppendTo).html('');

  apiObject = JSON.parse(xhr.response).results;
  console.log(link);
  apiObject = normalizeApiObj(apiObject);
  if(apiObject && apiObject.length === 0) {
    myApp.addNotification({
      message: 'No items found for these specifiers',
      hold: 2500
    });
  }

  var listHtml = '<ul>';
  for (var i = 0; i < apiObject.length; i++) {
    listHtml += '<li>' +
    '<a href="#" class="item-link item-content" id="'+ apiObject[i].id + '" onClick="handleDetailClick(this.id)">' +
    '<div class="item-media" style="padding: 0px;"><img class="card" src="' + apiObject[i].poster_path + '" alt="Image not found" onerror="this.onerror=null;this.src=\'img/default-movie-poster.jpg\';" width="100" height="148"></div>' +
    '<div class="item-inner">' +
    '<div class="item-title-row">' +
    '<div class="item-title">' + (i + 1) + '. ' + apiObject[i].title + '</div>' +
    '<div class="item-after">' + apiObject[i].vote_average + '</div>' +
    '</div>' +
    '<div class="item-subtitle">' + apiObject[i].release_year + '</div>' +
    '<div class="item-text item-text-5-rows">' + apiObject[i].overview + '</div>' +
    '</div>' +
    '</a>' +
    '</li>'
  }

  listHtml += '</ul>';

  $$(listElementToAppendTo).append(listHtml);
  wizardMovieRepository = wizardMovieRepository.concat(apiObject);

  attachLazyLoaderToList(listElementToAppendTo, link);
}

function handleDetailClick(clickedObjId) {
    tvOrMovie = wizardMovieRepository.find(x => x.id == clickedObjId).type;
    getMovieDetailInfo(clickedObjId);
}

function attachLazyLoaderToList(listElementToAppendTo, link) {
  var loading = false;
  var lastIndex = $$(listElementToAppendTo + ' li').length;
  var maxItems = 100;
  var itemsPerLoad = 20;
  var pageToGet = 2;
  myApp.attachInfiniteScroll("#searchPopupPageContent");
  $$('.infinite-scroll').on('infinite', function () {
    if (loading) return;
    loading = true;

    $$.ajax({
      complete: function () {
      },
      url: link + '&page=' + pageToGet,
      statusCode: {
        404: function (xhr) {
          console.log('page not found');
        },
        200: function (xhr) {
          apiObject = JSON.parse(xhr.response).results;
          apiObject = normalizeApiObj(apiObject);
          loading = false;
          if (lastIndex >= maxItems) {
            myApp.detachInfiniteScroll($$('.infinite-scroll'));
            $$('.infinite-scroll-preloader').remove();
            return;
          }

          var html = '';
          for (var i = 0; i < apiObject.length; i++) {
            html += '<li>' +
            '<a href="#" class="item-link item-content" id="'+ apiObject[i].id + '" onClick="handleDetailClick(this.id)">' +
            '<div class="item-media" style="padding: 0px;"><img class="card" src="' + apiObject[i].poster_path + '" alt="Image not found" onerror="this.onerror=null;this.src=\'img/default-movie-poster.jpg\';" width="100" height="148"></div>' +
            '<div class="item-inner">' +
            '<div class="item-title-row">' +
            '<div class="item-title">' + (i + 1 + lastIndex) + '. ' + apiObject[i].title + '</div>' +
            '<div class="item-after">' + apiObject[i].vote_average + '</div>' +
            '</div>' +
            '<div class="item-subtitle">' + apiObject[i].release_year + '</div>' +
            '<div class="item-text item-text-5-rows">' + apiObject[i].overview + '</div>' +
            '</div>' +
            '</a>' +
            '</li>'
          }

          $$('.list-block ul').append(html);

          lastIndex = $$(listElementToAppendTo + ' li').length;
          pageToGet++;
          wizardMovieRepository = wizardMovieRepository.concat(apiObject);
        }
      }
    })
  });
}

var typingTimer;

function callApiOnSearchEvent(searchValue) {
  if(!searchValue || searchValue.length === 0 || searchValue === '') {
    return;
  }

  var link = 'https://api.themoviedb.org/3/search/multi' + '?query=' + searchValue + '&include_adult=false&api_key=' + tmdbApiKey;

  clearTimeout(typingTimer);
  typingTimer = setTimeout(function() {
    $$("#searchPopupPageContent").scrollTop(0);

    $$.ajax({
      complete: function () {
      },
      url: link,
      statusCode: {
        404: function (xhr) {
          console.log('page not found');
        },
        200: function (xhr) {
          buildSortedItemList(xhr, '.list-block.search-result-list.virtual-list.media-list', link);
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
    replaceEventListener(closeSearch);
  });
}

function replaceEventListener(methodRef) {
  removeAllEventListeners();
  document.addEventListener("backbutton", methodRef, false);
}

function closePopups() {
  myApp.closeModal();
  replaceEventListener(goToTabs);
}

function closeSearch() {
  isSearchPoppedUp = false;
  myApp.closeModal('.popup-search');
  replaceEventListener(exitPrompt);
}

function closeSignUpPopup() {
  myApp.closeModal('.popup-sign-up');
  replaceEventListener(goToIndex);
}

function closeDetailPopup() {
  myApp.closeModal('.popup-movie-detail');
  replaceEventListener(closePopups);
}

function closeDetailPopupOnSearch() {
  myApp.closeModal('.popup-movie-detail');
  replaceEventListener(closeSearch);
}

function closeDetailPopupWhenCheckedForSearch() {
  if(isSearchPoppedUp) {
    closeDetailPopupOnSearch();
  } else {
    closePopups();
  }
}

function removeAllEventListeners() {
  document.removeEventListener("backbutton", goToWizard, false);
  document.removeEventListener("backbutton", exitPrompt, false);
  document.removeEventListener("backbutton", goToIndex, false);
  document.removeEventListener("backbutton", closeSearch, false);
  document.removeEventListener("backbutton", goToTabs, false);
  document.removeEventListener("backbutton", closeDetailPopupOnSearch, false);
  document.removeEventListener("backbutton", closeDetailPopup, false);
  document.removeEventListener("backbutton", closePopups, false);
  document.removeEventListener("backbutton", closeSignUpPopup, false);
}

function popToBeImplementedNotification() {
  myApp.addNotification({
    message: 'Feature not yet implemented...',
    hold: 2500
  });
}
