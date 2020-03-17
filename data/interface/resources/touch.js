var touch = {
  "diff": {'X': null, 'Y': null},
  "initial": {'X': null, 'Y': null},
  "current": {'X': null, 'Y': null},
  "container": document.querySelector(".tile"),
  "listeners": {
    "start": function (e) {
      touch.initial.X = e.touches[0].clientX;
      touch.initial.Y = e.touches[0].clientY;
    },
    "move": function (e) {
      e.preventDefault();
      /*  */
      if (touch.initial.X === null) return;
      if (touch.initial.Y === null) return;
      /*  */
      touch.current.X = e.touches[0].clientX;
      touch.current.Y = e.touches[0].clientY;
      touch.diff.X = touch.initial.X - touch.current.X;
      touch.diff.Y = touch.initial.Y - touch.current.Y;
      /*  */
      if (Math.abs(touch.diff.X) > Math.abs(touch.diff.Y)) {
        if (touch.diff.X > 0) {
          if (config.neighbor.left) {
            config.neighbor.left.click();
          }
        } else {
          if (config.neighbor.right) {
            config.neighbor.right.click();
          }
        }
      } else {
        if (touch.diff.Y > 0) {
          if (config.neighbor.top) {
            config.neighbor.top.click();
          }
        } else {
          if (config.neighbor.bottom) {
            config.neighbor.bottom.click();
          }
        }
      }
      /*  */
      touch.initial.X = null;
      touch.initial.Y = null;
    }
  }
};

touch.container.addEventListener("touchmove", touch.listeners.move, false);
touch.container.addEventListener("touchstart", touch.listeners.start, false);
