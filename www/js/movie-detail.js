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

  firebaseDb.ref('/users/' + loggedUser.uid + '/' + movieObj.id).once('value', function(movieSnapshot) {
    var result = movieSnapshot.val()
    if (!result) {
      return;
    }

    $$("#saveMovieIcon").html('bookmark');
  });

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

  $$('.save-movie').on('click', function () {
    if(firebaseDb) {
      saveMovieToFbDb(movieObj);
    }
  });
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

function saveMovieToFbDb(movie) {
  var timeStampInMs = window.performance && window.performance.now
  && window.performance.timing
  && window.performance.timing.navigationStart
  ? window.performance.now()
  + window.performance.timing.navigationStart
  : Date.now();

  var movieToAdd = {};
  movieToAdd[movie.id] = movie;
  movieToAdd[movie.id].timestamp = timeStampInMs;

  firebaseDb.ref('users/' + loggedUser.uid).update(movieToAdd).then(function(){
    console.log("Successfully posted");
    $$("#saveMovieIcon").html('bookmark');
    myApp.addNotification({
      message: 'Added to saved',
      hold: 2500
    });
  }).catch(function(error) {
    console.log("Data could not be saved." + error);
    myApp.addNotification({
      message: 'Couldn\'t save item. Error: ' + error,
      hold: 2500
    });
  });
}
