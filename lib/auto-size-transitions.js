'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

(function () {
  // select the element node
  var requestAnimationFrame = window.requestAnimationFrame;

  var queryAll = function queryAll(selector) {
    var context = arguments.length <= 1 || arguments[1] === undefined ? window.document : arguments[1];
    return [].concat(_toConsumableArray(context.querySelectorAll(selector)));
  };

  var getTargetHeight = function getTargetHeight(element) {
    return window.getComputedStyle(element).height;
  };

  var whenItChanged = function whenItChanged(getProp, targetValue, cb) {
    //const rawTGTValue = extractAndRound(targetValue);

    var recur = function recur() {
      if (getProp() === targetValue) {
        // console.log('ok !');
        cb();
      } else {
        requestAnimationFrame(recur);
        // console.log('not yet');
      }
    };

    recur();
  };

  var initAutoSizeTransitionCheck = function initAutoSizeTransitionCheck(element) {

    var prevHeight = null;

    // select the target node
    var target = document.getElementById('some-id');

    var transitionManually = function transitionManually(element, currentHeight, cb) {
      element.style.transitionProperty = '';
      var transitionProperty = window.getComputedStyle(element).transitionProperty;
      var noHeightTransition = transitionProperty.split(',').filter(function (prop) {
        return !prop.match(/ ?height/);
      }).join(',');

      element.style.transitionProperty = noHeightTransition;
      //console.log('it changed', prevHeight, currentHeight);
      element.style.height = prevHeight;

      whenItChanged(function () {
        return getTargetHeight(element);
      }, prevHeight, function () {
        // console.log('is', window.getComputedStyle(element).height, 'shouldBe', prevHeight);
        element.style.transitionProperty = transitionProperty;
        element.style.height = currentHeight;

        whenItChanged(function () {
          return getTargetHeight(element);
        }, currentHeight, function () {
          // console.log('is', window.getComputedStyle(element).height, 'shouldBe', currentHeight);
          element.style.height = '';
          element.style.transitionProperty = noHeightTransition;
          prevHeight = currentHeight;
          cb();

          // console.log('fin');
        });
      });
    };

    // configuration of the observer:
    var config = { attributes: true, childList: true, characterData: true, subtree: true };

    // create an observer instance
    var observer = new MutationObserver(function (mutations) {
      // console.log('mutation');

      var check = function check() {
        var computed = window.getComputedStyle(element);
        var currentHeight = computed.height;

        // console.log('observed!', currentHeight, prevHeight);
        if (currentHeight !== prevHeight) {
          observer.disconnect();
          console.log('disconnected it changed mutation !!!');
          transitionManually(element, currentHeight, function () {

            // order is important. Todo -> clean this up
            observer.observe(document.body, config);
            check();
            // console.log('end, restarting observe');
          });
        }
      };

      check();
    });

    prevHeight = window.getComputedStyle(element).height;

    // pass in the target node, as well as the observer options
    observer.observe(document.documentElement, config);

    // later, you can stop observing
    // observer.disconnect();

    var checkHeightChange = function checkHeightChange() {
      var computed = window.getComputedStyle(element);
      var currentHeight = computed.height;

      if (prevHeight === null) {
        prevHeight = currentHeight;
      }

      if (prevHeight !== currentHeight) {
        // transitionManually(element, currentHeight, () => requestAnimationFrame(checkHeightChange));
      } else {
        requestAnimationFrame(checkHeightChange);
      }
    };

    //requestAnimationFrame(checkHeightChange);
  };

  // console.log(extractRawHeight('200.5px'));

  window.addAutoSizeTransitionsElements = function (pElements) {
    pElements.forEach(function (element) {
      initAutoSizeTransitionCheck(element);
    });
  };

  var stateCheck = setInterval(function () {
    if (document.readyState === 'complete') {

      clearInterval(stateCheck);
      try {
        addAutoSizeTransitionsElements(queryAll('[data-auto-size-transitions]'));
      } catch (error) {
        console.log(error);
      }
    }
  }, 100);
})();