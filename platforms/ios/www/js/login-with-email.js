myApp.onPageBeforeInit('login-with-email', function () {
  document.removeEventListener("backbutton", goToWizard, false);
  document.removeEventListener("backbutton", goToTabs, false);
  document.removeEventListener("backbutton", exitPrompt, false);
  document.addEventListener("backbutton", goToIndex, false);
});

//Login screen methods inside this
myApp.onPageInit('login-with-email', function () {
  myApp.loginScreen();

  //go back button in sign in with email view
  $$('.close-login-screen').on('click', function () {
    var mainView = myApp.addView('.view-main');
    goToIndex();
    myApp.closeModal('.login-screen');
  });

  $$('.open-sign-up-popup').on('click', function () {
    myApp.popup('.popup-sign-up');
    document.removeEventListener("backbutton", goToIndex, false);
    document.addEventListener("backbutton", closeSignUpPopup, false);
  });

  //sign in with email button click method
  $$('.validate-signin').on('click', function () {
    //auto login below (disabled when commented)
    goToTabs();
    // var formData = myApp.formToJSON('#email-signin-form');
    // if(formData.password === '' || formData.email === '') {
    //   myApp.alert('Please fill in everything before you submit', 'Fields missing');
    //   return;
    // }
    //
    // if(formData.email.indexOf('@') === -1 || formData.email.indexOf('.') === -1) {
    //   myApp.alert('Please enter a valid email', 'Email invalid');
    //   return;
    // }
    //
    // firebase.auth().signInWithEmailAndPassword(formData.email, formData.password).catch(function(error) {
    //   // Handle Errors here.
    //   var errorCode = error.code;
    //   var errorMessage = error.message;
    //   console.log(errorMessage);
    // });
  });

  $$('.validate-signup').on('click', function () {
    var formData = myApp.formToJSON('#email-signup-form');
    if(formData.password === '' || formData.confirm_password === '' || formData.email === '') {
      myApp.alert('Please fill in everything before you submit', 'Fields missing');
      return;
    }

    if(formData.email.indexOf('@') === -1 || formData.email.indexOf('.') === -1) {
      myApp.alert('Please enter a valid email', 'Email invalid');
      return;
    }

    if(formData.password != '' && (formData.password != formData.confirm_password)) {
      myApp.alert('Please make sure that your passwords match', 'Password missmatch');
      return;
    }

    firebase.auth().createUserWithEmailAndPassword(formData.email, formData.password).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorMessage);
    });
  });

  $$('.pop-forgotten-password').on('click', function () {
    var emailAddress;
    myApp.prompt('Please enter your email', 'Resetting password', function (value) {
      emailAddress = value;
      if(emailAddress.indexOf('@') === -1 || emailAddress.indexOf('.') === -1) {
        myApp.alert('Please enter a valid email', 'Email invalid');
      } else {
        firebase.auth().sendPasswordResetEmail(emailAddress).then(function() {
          myApp.alert('An email has been sent to you with steps to reset your password');
        }, function(error) {
          myApp.alert('An error occured');
        });
      }
    });
  });
});
