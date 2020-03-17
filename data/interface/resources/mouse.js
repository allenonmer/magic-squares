var mouse = {
  "listeners": {
    "keydown": function (e) {
      var up = e.code === "ArrowUp";
      var down = e.code === "ArrowDown";
      var left = e.code === "ArrowLeft";
      var right = e.code === "ArrowRight";
      /*  */
      if (up && config.neighbor.top) config.neighbor.top.click();
      if (left && config.neighbor.left) config.neighbor.left.click();
      if (right && config.neighbor.right) config.neighbor.right.click();
      if (down && config.neighbor.bottom) config.neighbor.bottom.click();
    }
  }
};

document.addEventListener("keydown", mouse.listeners.keydown);
