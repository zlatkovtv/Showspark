myApp.onPageBeforeInit('home', function () {
  replaceEventListener(exitPrompt);
});

myApp.onPageInit('home', function () {
  myApp.params.swipePanel = 'left';
  myApp.params.swipePanelActiveArea = 30;
  myApp.params.showBarsOnPageScrollEnd = false;

  myApp.showTab("#tab-newsfeed");

  attachSearchButton();

  var pressed = window.localStorage.getItem("isFloatingBPressed");
  if(!pressed) {
    var d = document.getElementById("main-fl-button");
    d.className += " pulse-btn";
  }

  $$('#main-fl-button').on('click', function () {
    window.localStorage.setItem("isFloatingBPressed", false);
    document.getElementById("main-fl-button").classList.remove("pulse-btn");
  });

  $$('#moviesFab').on('click', function () {
    tvOrMovie = "movie";
    goToWizard();
  });

  $$('#tvFab').on('click', function () {
    tvOrMovie = "tv";
    goToWizard();
  });

  $$('.open-left-panel').on('click', function (e) {
    myApp.openPanel('left');
  });

  $$('.panel-signout').on('click', function () {
    console.log("inside logout");
    firebase.auth().signOut().then(function() {
      myApp.closePanel('left');
      goToIndex();
    }).catch(function(error) {
      console.log("Cant sign out for some reason.");
    });
  });

  $$('.report-bug').on('click', function () {
    var onReportBugSuccess = function(result) {

    }

    var onReportBugError = function(msg) {
      myApp.addNotification({
        message: 'Report bug failed - ' + msg,
        hold: 2500
      });
    }

    window.plugins.socialsharing.shareViaEmail(
      '',
      'Showspark Bug Report',
      ['konstantinzlatkov@gmail.com'], // TO: must be null or an array
      null, // CC: must be null or an array
      null, // BCC: must be null or an array
      null, // FILES: can be null, a string, or an array
      onReportBugSuccess, // called when sharing worked, but also when the user cancelled sharing via email. On iOS, the callbacks' boolean result parameter is true when sharing worked, false if cancelled. On Android, this parameter is always true so it can't be used). See section "Notes about the successCallback" below.
      onReportBugError // called when sh*t hits the fan
    );
  });

  getCollectionFromTmdb('now_playing', '.in-theaters-container');
  getCollectionFromTmdb('upcoming', '.upcoming-container');

  initiateNewsFeed();
  initiateReviewsFeed();

  var ptrContent = $$('.pull-to-refresh-content');
  ptrContent.on('refresh', function (e) {
    myApp.pullToRefreshDone(); // After we refreshed page content, we need to reset pull to refresh component to let user pull it again:
  });
});

function initiateNewsFeed() {
  var myFeed = myApp.feeds('.news-feed', {
    url: 'https://feeds.feedburner.com/cinemablendallthing?format=xml',
    openIn: 'none',
    customItemFields: ["enclosure||url"],
    onAjaxStart: function () {
    },
    onAjaxComplete: function () {

    },
    listTemplate: '<ul>' +
    '{{#each items}}' +
    '<li>' +
    '<a class="item-link feeds-item-link" data-index="{{@index}}" onClick="cordova.plugins.browsertab.openUrl(\'{{link}}\');">' +
    '<div class="card md-card demo-card-header-pic">' +
    '<div style="background-image:url({{enclosure}})" valign="bottom" class="card-header color-white no-border text-border-black">{{title}}</div>' +
    '</a>' +
    '<div class="card-footer padding-4">' +
    '<a href="#" class="link icon-only share-news" onclick="shareNews(\'{{link}}\')">' +
    '<i class="material-icons link">share</i>' +
    '</a>' +
    '<label>{{pubDate.slice(0,-5)}}</label>' +
    '<a href="#" class="link icon-only">' +
    '<i class="material-icons link">bookmark_border</i>' +
    '</a>' +
    '</div>' +
    '</div>' +
    '</li>' +
    '{{/each}}' +
    '</ul>',
    itemPopupTemplate: '<div class="popup">' +
    '<div class="view navbar-fixed">' +
    '<a href="home.html" class="close-popup link no-navbar-icon">' +
    '<i class="material-icons text-shadow-1">arrow_back</i>' +
    '</a>' +
    '<div class="pages">' +
    '<div class="page feeds-page-movie" data-page="feeds-page-{{index}}">' +
    '<img src="{{enclosure}}" class="full-width">' +
    '<div class="content-block">' +
    '<a onClick="cordova.plugins.browsertab.openUrl(\'{{link}}\');">{{title}}</a><br>' +
    '<small>{{formattedDate}}</small>' +
    '</div>' +
    '<div class="content-block"><div class="content-block-inner">{{description}}</div></div>' +
    '</div>' +
    '</div>' +
    '</div>' +
    '</div>'
  });
}

function shareNews(link) {
  var options = {
    files: [],
    url: link,
    chooserTitle: 'Share via'
  }

  var onShareSuccess = function(result) {

  }

  var onShareError = function(msg) {
    myApp.addNotification({
      message: 'Sharing failed - ' + msg,
      hold: 2500
    });
  }

  if(link) {
    window.plugins.socialsharing.shareWithOptions(options, onShareSuccess, onShareError);
  } else {
    onShareError('no news link found');
  }
}

function initiateReviewsFeed() {
  var myFeed3 = myApp.feeds('.reviews-feed', {
    url: 'http://www.cinemablend.com/rss_review.php',
    openIn: 'popup',
    customItemFields: ["enclosure||url"],
    onAjaxStart: function () {
    },
    onAjaxComplete: function () {
    },
    listTemplate: '<ul>' +
    '{{#each items}}' +
    '<li class="accordion-item"><a href="#" class="item-content item-link">' +
    '<div class="item-inner">' +
    '<div class="item-title">{{index+1}}. {{title}}</div>' +
    '</div></a>' +
    '<div class="accordion-item-content" style="padding-bottom: 5px;">' +
    '<div class="content-block">' +
    '<p>{{description}}</p>' +
    '<a class="button button-raised button-fill custom-purple-color float-left" onClick="cordova.plugins.browsertab.openUrl(\'{{link}}\');">Read full review</a>' +
    '</div>' +
    '</div>' +
    '</li>' +
    '{{/each}}' +
    '</ul>',
    itemPopupTemplate: '<div class="popup">' +
    '<div class="view navbar-fixed">' +
    '<div class="navbar theme-deeppurple">' +
    '<div class="navbar-inner">' +
    '<div class="left sliding">' +
    '<a href="home.html" class="close-popup link">' +
    '<i class="material-icons">arrow_back</i>' +
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
    '<a onClick="cordova.plugins.browsertab.openUrl(\'{{link}}\');">{{title}}</a><br>' +
    '<small>{{formattedDate}}</small>' +
    '</div>' +
    '<div class="content-block"><div class="content-block-inner">{{description}}</div></div>' +
    '</div>' +
    '</div>' +
    '</div>' +
    '</div>' +
    '</div>'
  });
}

function getCollectionFromTmdb(collectionName, elementToAppendTo) {
  $$.ajax({
    complete: function () {
    },
    url: 'https://api.themoviedb.org/3/movie/' + collectionName + '?api_key=17bad8fd5ecafe775377303226579c19&region=US&page=1',
    statusCode: {
      404: function (xhr) {
        console.log('page not found');
      },
      200: function (xhr) {
        var html = "";
        var mostPopMovieObject = JSON.parse(xhr.response).results;
        for (var i = 0; i < mostPopMovieObject.length; i++) {
          if(!mostPopMovieObject[i].backdrop_path) {
            continue;
          }
          html += Template7.templates.showcaseCardTemplate({
            obj: mostPopMovieObject[i]
          });
        }

        $$(elementToAppendTo).append(html);
        if(collectionName === 'upcoming') {
          $$('.video-link').on('click', function () {
            console.log("video");
            var clickedObjId = $$(this).prop('id');
            attachVideoToDiv(clickedObjId);
          });
        }
      }
    }
  })
}

function attachVideoToDiv(clickedObjId) {
  $$.ajax({
    complete: function () {
    },
    url: 'https://api.themoviedb.org/3/movie/' + clickedObjId + '/videos?api_key=17bad8fd5ecafe775377303226579c19&language=en-US',
    statusCode: {
      404: function (xhr) {
        console.log('page not found');
      },
      200: function (xhr) {
        var movieObj = JSON.parse(xhr.response).results[0];
        console.log();
        YoutubeVideoPlayer.openVideo(movieObj.key, function(result) { console.log('YoutubeVideoPlayer result = ' + result); });
      }
    }
  })
}
