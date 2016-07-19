(function () {
  // select the element node
  const requestAnimationFrame = window.requestAnimationFrame;

  const queryAll = (selector, context = window.document) =>
      [...context.querySelectorAll(selector)];


  const getTargetHeight = element => window.getComputedStyle(element).height;

  const whenItChanged = (getProp, targetValue, cb) => {
    //const rawTGTValue = extractAndRound(targetValue);

    const recur = () => {
      if (getProp() === targetValue) {
        // console.log('ok !');
        cb();
      }
      else
      {
        requestAnimationFrame(recur);
        // console.log('not yet');
      }
    };

    recur();
  };

  const initAutoSizeTransitionCheck = element => {

    let prevHeight = null;

    // select the target node
    var target = document.getElementById('some-id');

    const transitionManually = (element, currentHeight, cb) => {
      element.style.transitionProperty = '';
      const transitionProperty = window.getComputedStyle(element).transitionProperty;
      const noHeightTransition = transitionProperty.split(',')
        .filter(prop => !prop.match(/ ?height/))
        .join(',');

      element.style.transitionProperty = noHeightTransition;
      //console.log('it changed', prevHeight, currentHeight);
      element.style.height = prevHeight;

      whenItChanged(() => getTargetHeight(element), prevHeight, () => {
        // console.log('is', window.getComputedStyle(element).height, 'shouldBe', prevHeight);
        element.style.transitionProperty = transitionProperty;
        element.style.height = currentHeight;

        whenItChanged(() => getTargetHeight(element), currentHeight, () => {
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
    const config = { attributes: true, childList: true, characterData: true, subtree: true };

    // create an observer instance
    const observer = new MutationObserver(mutations => {
      // console.log('mutation');

      const check = () => {
        const computed = window.getComputedStyle(element);
        const currentHeight = computed.height;

        // console.log('observed!', currentHeight, prevHeight);
        if (currentHeight !== prevHeight) {
          observer.disconnect();
          console.log('disconnected it changed mutation !!!');
          transitionManually(element, currentHeight, () => {

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

    const checkHeightChange = () => {
      const computed = window.getComputedStyle(element);
      const currentHeight = computed.height;

      if (prevHeight === null) { prevHeight = currentHeight; }

      if (prevHeight !== currentHeight) {
        // transitionManually(element, currentHeight, () => requestAnimationFrame(checkHeightChange));
      }
      else
      {
        requestAnimationFrame(checkHeightChange);
      }
    };

    //requestAnimationFrame(checkHeightChange);
  };

  // console.log(extractRawHeight('200.5px'));

  window.addAutoSizeTransitionsElements = pElements => {
    pElements.forEach(element => {
      initAutoSizeTransitionCheck(element);
    });
  };

  const stateCheck = setInterval(() => {
    if (document.readyState === 'complete') {

      clearInterval(stateCheck);
      try {
        addAutoSizeTransitionsElements(queryAll('[data-auto-size-transitions]'));
      }
      catch (error) {
        console.log(error);
      }
    }
  }, 100);
})();

