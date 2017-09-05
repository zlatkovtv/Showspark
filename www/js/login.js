myApp.onPageBeforeInit('login', function () {
  document.removeEventListener("backbutton", goToWizard, false);
  document.removeEventListener("backbutton", goToTabs, false);
  document.removeEventListener("backbutton", goToIndex, false);
  document.addEventListener("backbutton", exitPrompt, false);
});

myApp.onPageInit('login', function () {
  var currUser = firebase.auth().currentUser;
  if(currUser) {
    $$('.user-name-label').text("Signed in as " + currUser.displayName);
  }

  var provider = new firebase.auth.GoogleAuthProvider();
  var fbProvider = new firebase.auth.FacebookAuthProvider();

  $$('.google-auth-button').on('click', function () {
    firebase.auth().signInWithRedirect(provider).then(function() {
      firebase.auth().getRedirectResult().then(function(result) {
        var token = result.credential.accessToken;
        var user = result.user;
        goToTabs();
      }).catch(function(error) {
        goToIndex();
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
});
