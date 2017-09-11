myApp.onPageBeforeInit('home', function () {
  document.removeEventListener("backbutton", goToWizard, false);
  document.removeEventListener("backbutton", goToTabs, false);
  document.removeEventListener("backbutton", goToIndex, false);
  document.addEventListener("backbutton", exitPrompt, false);
});

myApp.onPageInit('home', function () {
  myApp.params.swipePanel = 'left';
  myApp.params.swipePanelActiveArea = 30;
  myApp.params.showBarsOnPageScrollEnd = false;

  myApp.showTab("#tab-cinema");

  var pressed = window.localStorage.getItem("isFloatingBPressed");
  if(!pressed) {
    var d = document.getElementById("main-fl-button");
    d.className += " pulse-btn";
  }

  $$('#main-fl-button').on('click', function () {
    window.localStorage.setItem("isFloatingBPressed", false);
  });

  $$('#moviesFab').on('click', function () {
    tvOrMovie = "movie";
    goToWizard();
  });

  $$('#tvFab').on('click', function () {
    tvOrMovie = "tv";
    goToWizard();
  });

  // $$('.search-button').on('click', function () {
  //   $$('.left').hide();
  //   $$('.center').hide();
  //   $$('.right').hide();
  //   var html = 	'<div class="searchBarMain">' +
	// 	'<i class="material-icons searchBarSearchIcon noselect">search</i>' +
	// 	'<input type="text" name="header-search" value="" id="searchBarInput" placeholder="Search, discover, explore...">' +
	// 	'<i class="material-icons clearSearchBarField noselect"">clear</i>' +
	//    '</div>';
  //   $$(".navbar-inner").append(html);
  //   $$('.searchBarSearchIcon').on('click', function () {
  //     console.log("reverting");
  //     $$('.left').show();
  //     $$('.center').show();
  //     $$('.right').show();
  //     $$('.searchBarMain').hide();
  //   });
  // });

  var html = "";
  var colorArr = ["#e74c3c", "#f1c40f", "#9b59b6", "#4CAF50", "#3F51B5", "#7f8c8d", "#2c3e50", "#f39c12"];

  $$.ajax({
    complete: function () {
    },
    url: 'https://api.themoviedb.org/3/movie/upcoming?api_key=17bad8fd5ecafe775377303226579c19&region=US&page=1',
    statusCode: {
      404: function (xhr) {
        console.log('page not found');
      },
      200: function (xhr) {
        var mostPopMovieObject = JSON.parse(xhr.response).results;
        for (var i = 0; i < mostPopMovieObject.length; i++) {
          if(!mostPopMovieObject[i].backdrop_path) {
            continue;
          }
          html += Template7.templates.showcaseCardTemplate({
            obj: mostPopMovieObject[i]
          });
        }

        $$('.showcase-container').append(html);

        $$('.video-link').on('click', function () {
          console.log("video");
          var clickedObjId = $$(this).prop('id');

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
        });
      }
    }
  })

  var myFeed = myApp.feeds('.cinema-feed', {
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
    '<a href="#" class="link icon-only">' +
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

  // var myFeed2 = myApp.feeds('.theaters-feed', {
  //   url: 'http://www.cinemablend.com/rss_preview.php',
  //   openIn: 'popup',
  //   customItemFields: ["enclosure||url", "description"],
  //   onAjaxStart: function () {
  //     console.log("ajaxstart");
  //   },
  //   onAjaxComplete: function () {
  //     console.log("ajaxcomplete");
  //   },
  //   listTemplate: '<ul>' +
  //   '{{#each items}}' +
  //   '<li>' +
  //   '<a class="item-link feeds-item-link" data-index="{{@index}}">' +
  //   '<div class="card demo-card-header-pic">' +
  //   '<div style="background-image:url({{enclosure}})" valign="bottom" class="card-header color-white no-border text-border-black">{{title}}</div>' +
  //   '</a>' +
  //   '<div class="card-footer">' +
  //   '<i class="material-icons link">bookmark_border</i>' +
  //   '<i class="material-icons link">share</i>' +
  //   '</div>' +
  //   '</div>' +
  //   '</li>' +
  //   '{{/each}}' +
  //   '</ul>',
  //   itemPopupTemplate: '<div class="popup">' +
  //   '<div class="view navbar-fixed">' +
  //   '<div class="navbar theme-deeppurple">' +
  //   '<div class="navbar-inner">' +
  //   '<div class="left sliding">' +
  //   '<a href="home.html" class="close-popup link">' +
  //   '<i class="material-icons">arrow_back</i>' +
  //   '<span>Back</span>' +
  //   '</a>' +
  //   '</div>' +
  //   '</div>' +
  //   '</div>' +
  //   '<div class="pages">' +
  //   '<div class="page feeds-page-tv" data-page="feeds-page-{{index}}">' +
  //   '<div class="page-content">' +
  //   '<img src="{{enclosure}}" class="full-width">' +
  //   '<div class="content-block">' +
  //   '<a onClick="cordova.plugins.browsertab.openUrl(\'{{link}}\');">{{title}}</a><br>' +
  //   '<small>{{formattedDate}}</small>' +
  //   '</div>' +
  //   '<div class="content-block"><div class="content-block-inner">{{description}}</div></div>' +
  //   '</div>' +
  //   '</div>' +
  //   '</div>' +
  //   '</div>' +
  //   '</div>'
  // });

  var myFeed3 = myApp.feeds('.rv-feed', {
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
});
