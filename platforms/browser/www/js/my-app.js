// Initialize app
var myApp = new Framework7({
  material: true,
  cache:true,
  precompileTemplates: true
});

var $$ = Dom7;

var welcomescreen_slides = [
  {
    id: 'slide0',
    picture: '<div class="tutorialicon"></div>',
    text: 'Welcome to What To Watch!</br> We think you are going to love it.'
  },
  {
    id: 'slide1',
    picture: '<div class="tutorialicon"></div>',
    text: 'This is a movie newsfeed app with a wizard that lets you find and sort movies and tv series easily!'
  },
  {
    id: 'slide2',
    picture: '<a href="#" class="floating-button color-white custom-floating-button-tutorial">' +
      '<i class="material-icons color-deeppurple-custom">movie' +
      '</i>' +
    '</a>',
    text: 'Just press this button when you are in the newsfeed to fire up the wizard!'
  },
  {
    id: 'slide3',
    picture: '<div class="tutorialicon"></div>',
    text: 'That\'s about it really! Enjoy!<br><br><a class="button button-big button-raised button-fill color-deeppurple tutorial-close-btn" href="#">End Tutorial</a>'
  }
];

var options = {
  'bgcolor': '#393939',
  'fontcolor': '#fff',
  'pagination': false,
  'parallax': true,
  'parallaxBackgroundImage': 'img/tutorial-back-cut.png',
  'parallaxSlideElements':  {title: -100, subtitle: -300, text: 0}
}
var welcomescreen = myApp.welcomescreen(welcomescreen_slides, options);

$$('.tutorial-close-btn').on('click', function () {
  welcomescreen.close();
});

// var provider;

// Add view
var mainView = myApp.addView('.view-main', {
  // Because we want to use dynamic navbar, we need to enable it for this view:
  dynamicNavbar: true
});

var selectedOrderByCategory;
var selectedGenres;
var tmdbApiKey = "17bad8fd5ecafe775377303226579c19";

// function onSignIn(googleUser) {
//   console.log('Google Auth Response', googleUser);
//   // We need to register an Observer on Firebase Auth to make sure auth is initialized.
//   var unsubscribe = firebase.auth().onAuthStateChanged(function(firebaseUser) {
//     unsubscribe();
//     // Check if we are already signed-in Firebase with the correct user.
//     if (!isUserEqual(googleUser, firebaseUser)) {
//       // Build Firebase credential with the Google ID token.
//       var credential = firebase.auth.GoogleAuthProvider.credential(
//           googleUser.getAuthResponse().id_token);
//       // Sign in with credential from the Google user.
//       firebase.auth().signInWithCredential(credential).catch(function(error) {
//         // Handle Errors here.
//         var errorCode = error.code;
//         var errorMessage = error.message;
//         // The email of the user's account used.
//         var email = error.email;
//         // The firebase.auth.AuthCredential type that was used.
//         var credential = error.credential;
//         // ...
//       });
//     } else {
//       console.log('User already signed-in Firebase.');
//     }
//   });
// }
//
// function isUserEqual(googleUser, firebaseUser) {
//   if (firebaseUser) {
//     var providerData = firebaseUser.providerData;
//     for (var i = 0; i < providerData.length; i++) {
//       if (providerData[i].providerId === firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
//           providerData[i].uid === googleUser.getBasicProfile().getId()) {
//         // We don't need to reauth the Firebase connection.
//         return true;
//       }
//     }
//   }
//   return false;
// }

// Handle Cordova Device Ready Event
$$(document).on('deviceready', function() {
  StatusBar.backgroundColorByHexString("#000000");
  document.addEventListener("backbutton", exitPrompt, false);

  console.log("Device is ready!");
});

function goBack(){
  var mainView = myApp.addView('.view-main');
  mainView.router.back();
}

function goToIndex() {
  var mainView = myApp.addView('.view-main');
  mainView.router.loadPage('index.html');
}

function goToTabs(){
  var mainView = myApp.addView('.view-main');
  mainView.router.loadPage('homeTabView.html');
}

function goToWizard(){
  var mainView = myApp.addView('.view-main');
  mainView.router.loadPage('wizard.html');
}

function exitPrompt(){
  myApp.confirm('Are you sure you want to exit?', "", function () {
    navigator.app.clearHistory();
    navigator.app.exitApp();
  });
}

myApp.onPageBeforeInit('home', function () {
  StatusBar.backgroundColorByHexString("#000000");
  document.removeEventListener("backbutton", goToWizard, false);
  document.removeEventListener("backbutton", goToTabs, false);
  document.removeEventListener("backbutton", goToIndex, false);
  document.addEventListener("backbutton", exitPrompt, false);
})

myApp.onPageInit('home', function () {
  console.log("index onPageInit");
  // if (!firebase.apps.length) {
  //   provider = new firebase.auth.GoogleAuthProvider();
  //   console.log("inside if");
  // }
  // $$('.google-auth-button').on('click', function () {
  //   console.log("!!!! google button event");
  //   firebase.auth().signInWithRedirect(provider).then(function() {
  //     firebase.auth().getRedirectResult().then(function(result) {
  //       var token = result.credential.accessToken;
  //       var user = result.user;
  //       goToTabs();
  //     }).catch(function(error) {
  //       console.log(error.code);
  //       console.log(error.message);
  //     });
  //   });
  // });
  //
  // $$('#panel-signout').on('click', function () {
  //   firebase.auth().signOut().then(function() {
  //     myApp.closePanel('left');
  //     goToIndex();
  //   }).catch(function(error) {
  //     console.log("Cant sign out from google from some reason.");
  //   });
  // });

});

myApp.onPageBeforeInit('login-with-email', function () {
  StatusBar.backgroundColorByHexString("#551f70");
  document.removeEventListener("backbutton", goToWizard, false);
  document.removeEventListener("backbutton", goToTabs, false);
  document.removeEventListener("backbutton", exitPrompt, false);
  document.addEventListener("backbutton", goToIndex, false);
})

myApp.onPageBeforeInit('tabs-main', function () {
  StatusBar.backgroundColorByHexString("#551f70");
  document.removeEventListener("backbutton", goToWizard, false);
  document.removeEventListener("backbutton", goToTabs, false);
  document.removeEventListener("backbutton", goToIndex, false);
  document.addEventListener("backbutton", exitPrompt, false);
})

myApp.onPageBeforeInit('wizard', function () {
  StatusBar.backgroundColorByHexString("#222");
  document.removeEventListener("backbutton", goToWizard, false);
  document.removeEventListener("backbutton", exitPrompt, false);
  document.removeEventListener("backbutton", goToIndex, false);
  document.addEventListener("backbutton", goToTabs, false);
})

myApp.onPageBeforeInit('wizard-order-by', function () {
  StatusBar.backgroundColorByHexString("#222");
  document.removeEventListener("backbutton", exitPrompt, false);
  document.removeEventListener("backbutton", goToIndex, false);
  document.removeEventListener("backbutton", goToTabs, false);
  document.addEventListener("backbutton", goToWizard, false);
})

myApp.onPageInit('wizard-order-by', function () {
  $$('.wizard-order-by-next-button').on('click', function () {
    $$('select[name="order-by-form"] option:checked').each(function () {
      selectedOrderByCategory = this.value;
    });
  });
})

myApp.onPageBeforeInit('wizard-result', function () {
  StatusBar.backgroundColorByHexString("#551f70");
  document.removeEventListener("backbutton", goToWizard, false);
  document.removeEventListener("backbutton", exitPrompt, false);
  document.removeEventListener("backbutton", goToIndex, false);
  document.addEventListener("backbutton", goToTabs, false);
})

//Login screen methods inside this
myApp.onPageInit('login-with-email', function () {
  myApp.loginScreen();

  //go back button in sign in with email view
  $$('.close-login-screen').on('click', function () {
    var mainView = myApp.addView('.view-main');
    goToIndex();
    myApp.closeModal('.login-screen');
  });

  //sign in with email button click method
  $$('.login-to-main-view').on('click', function () {
    var mainView = myApp.addView('.view-main');
    mainView.router.loadPage('homeTabView.html');
    myApp.closeModal('.login-screen');
  });
})

myApp.onPageInit('tabs-main', function () {
  var myApp = new Framework7({
    swipePanel: 'left',
    swipePanelActiveArea: 20,
    cache:true,
    hideTabbarOnPageScroll:true,
    showBarsOnPageScrollEnd:false
  });

  var myFeed = myApp.feeds('.movie-feed', {
    url: 'http://www.cinemablend.com/rss.php',
    openIn: 'popup',
    customItemFields: ["enclosure||url"],
    itemPopupTemplate: '<div class="popup">' +
        '<div class="view navbar-fixed">' +
            '<div class="navbar theme-deeppurple">' +
                '<div class="navbar-inner">' +
                    '<div class="left sliding">' +
                        '<a href="homeTabView.html" class="close-popup link">' +
                            '<i class="icon icon-back"></i>' +
                            '<span>Back</span>' +
                        '</a>' +
                    '</div>' +
                '</div>' +
            '</div>' +
            '<div class="pages">' +
                '<div class="page feeds-page-movie" data-page="feeds-page-{{index}}">' +
                    '<div class="page-content">' +
                    '<img src="{{enclosure}}" class="full-width">' +
                        '<div class="content-block">' +
                            '<a onClick="cordova.InAppBrowser.open(\'{{link}}\', \'_self\', \'location=yes\');">{{title}}</a><br>' +
                            '<small>{{formattedDate}}</small>' +
                        '</div>' +
                        '<div class="content-block"><div class="content-block-inner">{{description}}</div></div>' +
                    '</div>' +
                '</div>' +
            '</div>' +
        '</div>' +
    '</div>'
  });

  var myFeed = myApp.feeds('.tv-feed', {
    url: 'http://www.cinemablend.com/rss_television.xml',
    openIn: 'popup',
    customItemFields: ["enclosure||url"],
    itemPopupTemplate: '<div class="popup">' +
        '<div class="view navbar-fixed">' +
            '<div class="navbar theme-deeppurple">' +
                '<div class="navbar-inner">' +
                    '<div class="left sliding">' +
                        '<a href="homeTabView.html" class="close-popup link">' +
                            '<i class="icon icon-back"></i>' +
                            '<span>Back</span>' +
                        '</a>' +
                    '</div>' +
                '</div>' +
            '</div>' +
            '<div class="pages">' +
                '<div class="page feeds-page-tv" data-page="feeds-page-{{index}}">' +
                    '<div class="page-content">' +
                    '<img src="{{enclosure}}" class="full-width">' +
                        '<div class="content-block">' +
                            '<a onClick="cordova.InAppBrowser.open(\'{{link}}\', \'_self\', \'location=yes\');">{{title}}</a><br>' +
                            '<small>{{formattedDate}}</small>' +
                        '</div>' +
                        '<div class="content-block"><div class="content-block-inner">{{description}}</div></div>' +
                    '</div>' +
                '</div>' +
            '</div>' +
        '</div>' +
    '</div>'
  });

  $$('.open-left-panel').on('click', function (e) {
    myApp.openPanel('left');
  });

  var ptrContent = $$('.pull-to-refresh-content');
  ptrContent.on('refresh', function (e) {
    myApp.pullToRefreshDone(); // After we refreshed page content, we need to reset pull to refresh component to let user pull it again:
  });

  // Loading flag
  var loading = false;

  // Max items to load
  var maxItems = 60;

  // Append items per load
  var itemsPerLoad = 1;

  // Attach 'infinite' event handler
  $$('.infinite-scroll').on('infinite', function () {
    // Exit, if loading in progress
    if (loading) return;
    // Set loading flag
    loading = true;

    // Emulate 1s loading
    setTimeout(function () {
      // Generate new items HTML
      var html = '';
      for (var i = 0; i < itemsPerLoad; i++) {
        html += '<div class="card facebook-card">' +
        '<div class="card-header no-border">' +
        '<div class="facebook-avatar"><img src="img/destiny-2.jpg" width="34" height="34"></div>' +
        '<div class="facebook-name">John Doe</div>' +
        '<div class="facebook-date">Monday at 3:47 PM</div>' +
        '</div>' +
        '<div class="card-content"><img src="img/destiny-2.jpg" width="100%"></div>' +
        '<div class="card-footer no-border">' +
        '<a href="#" class="link">Like</a>' +
        '<a href="#" class="link">Comment</a>' +
        '<a href="#" class="link">Share</a>' +
        '</div>' +
        '</div>';
      }

      // Nothing more to load, detach infinite scroll events to prevent unnecessary loadings
      myApp.detachInfiniteScroll($$('.infinite-scroll'));
      // Remove preloader
      $$('.infinite-scroll-preloader').remove();

      // Append new items
      $$('.infinite-scroll').append(html);

      // Reset loading flag
      loading = false;
    }, 2000);
  });
})

//wizard page
myApp.onPageInit('wizard', function (page) {
  var myList = myApp.virtualList('.list-block.virtual-list', {
    // Array with items data
    items: [
      {
        id: 28,
        title: "Action"
      },
      {
        id: 12,
        title: "Adventure"
      },
      {
        id: 16,
        title: "Animation"
      },
      {
        id: 35,
        title: "Comedy"
      },
      {
        id: 80,
        title: "Crime"
      },
      {
        id: 99,
        title: "Documentary"
      },
      {
        id: 18,
        title: "Drama"
      },
      {
        id: 10751,
        title: "Family"
      },
      {
        id: 14,
        title: "Fantasy"
      },
      {
        id: 36,
        title: "History"
      },
      {
        id: 27,
        title: "Horror"
      },
      {
        id: 10402,
        title: "Music"
      },
      {
        id: 9648,
        title: "Mystery"
      },
      {
        id: 10749,
        title: "Romance"
      },
      {
        id: 878,
        title: "Science Fiction"
      },
      {
        id: 10770,
        title: "TV Movie"
      },
      {
        id: 53,
        title: "Thriller"
      },
      {
        id: 10752,
        title: "War"
      },
      {
        id: 37,
        title: "Western"
      }
    ],
    // Template 7 template to render each item
    template: '<li>' +
    '<label class="label-checkbox item-content">' +
    '<input type="checkbox" name="genre_ids" value={{id}} >' +
    '<div class="item-media">' +
    '<i class="icon icon-form-checkbox"></i>' +
    '</div>' +
    '<div class="item-inner">' +
    '<div class="item-title">{{title}}</div>' +
    '</div>' +
    '</label>' +
    '</li>'
  });

  $$('.wizard-home-next-button').on('click', function(){
    var formData = myApp.formToJSON('#genre-form');
    selectedGenres = formData;
  });
})

//wizard page
myApp.onPageInit('wizard-result', function (page) {
  var selectedTemplateName = "popularity";
  switch (selectedOrderByCategory) {
    case "vote_average":
    selectedTemplateName = "average vote";
    break;
    case "primary_release_date":
    selectedTemplateName = "release date";
    break;
    case "revenue":
    selectedTemplateName = "revenue";
    break;
    default:

  }
  var wizardHtml = Template7.templates.wizardResultTitleTemplate({
    selectedValue: selectedTemplateName
  });

  $$('.wizard-result-title').append(wizardHtml);

  console.log(selectedGenres);

  var genreString = "&with_genres=";
  var apiObject;

  if(selectedGenres.genre_ids.length === 0) {
    genreString = "";
  } else {
    for (var i = 0; i < selectedGenres.genre_ids.length; i++) {
      genreString += selectedGenres.genre_ids[i];
      if(i !== selectedGenres.genre_ids.length - 1) {
        genreString += ',';
      }
    }
  }

  console.log(genreString);

  //make api call, make object and assign it to items below
  $$.ajax({
    url: 'https://api.themoviedb.org/3/discover/movie?api_key=' + tmdbApiKey + genreString + '&sort_by=' + selectedOrderByCategory + '.desc',
    statusCode: {
      404: function (xhr) {
        console.log('page not found');
      },
      200: function (xhr) {

        apiObject = JSON.parse(xhr.response).results;
        for (var i = 0; i < apiObject.length; i++) {
          apiObject[i].poster_path = "http://image.tmdb.org/t/p/w185/" + apiObject[i].poster_path;
          if(apiObject[i].vote_average === 0) {
            apiObject[i].vote_average = "Unknown";
          }
        }
        console.log(apiObject);

        var myList = myApp.virtualList('.list-block.virtual-list', {
          // Array with items data
          items: apiObject,
          // Template 7 template to render each item
          template:  '<li>' +
          ' <a href="#" class="item-link item-content">' +
          '<div class="item-media"><img src="{{poster_path}}" alt="Image not found" onerror="this.onerror=null;this.src=\'img/default-movie-poster.jpg\';" width="100" height="148"></div>' +
          '<div class="item-inner">' +
          '<div class="item-title-row">' +
          '<div class="item-title">{{title}}</div>' +
          '</div>' +
          '<div class="item-subtitle">Average vote: {{vote_average}}</div>' +
          '<div class="item-text">{{overview}}</div>' +
          '</div>' +
          '</a>' +
          '</li>',
          height: function (item) {
            console.log(item);
            if (item.picture) {
              return 164; //item with picture is 164px height
            }
            else {
              return 44; //item without picture is 44px height
            }
          }
        });
      }
    }
  })
})
