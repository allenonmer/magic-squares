var config = {
  "neighbor": {},
  "number": {"moves": 0},
  "resize": {"timeout": null},
  "addon": {
    "homepage": function () {
      return chrome.runtime.getManifest().homepage_url;
    }
  },
  "random": function () {
    var today = new Date();
    var tmp = today.getTime();
    return Math.round(Math.abs(Math.sin(tmp) * 1000000)) % 9;
  },
  "init": {
    "array": function () {
      this.length = config.init.array.arguments.length;
      for (var i = 0; i < this.length; i++) {
        this[i + 1] = config.init.array.arguments[i];
      }
    }
  },
  "reset": function (e) {
    var actions = [...document.querySelectorAll("input[action]")];
    if (e) {
      for (var i = 0; i < actions.length; i++) {
        actions[i].setAttribute("class", e);
      }
    } else {
      for (var i = 0; i < actions.length; i++) {
        actions[i].removeAttribute("class");
      }
    }
  },
  "storage": {
    "local": {},
    "read": function (id) {return config.storage.local[id]},
    "load": function (callback) {
      chrome.storage.local.get(null, function (e) {
        config.storage.local = e;
        callback();
      });
    },
    "write": function (id, data) {
      if (id) {
        if (data !== '' && data !== null && data !== undefined) {
          var tmp = {};
          tmp[id] = data;
          config.storage.local[id] = data;
          chrome.storage.local.set(tmp, function () {});
        } else {
          delete config.storage.local[id];
          chrome.storage.local.remove(id, function () {});
        }
      }
    }
  },
  "game": {
    "log": function (e) {
      for (var i = 0; i < 9; i++) document.forms[0].elements[i].value = e[i];
      document.forms[0].moves.value = config.number.moves;
      config.game.over();
      config.render();
    },
    "over": function () {
      var a = config.pos[0] === 1;
      var b = config.pos[1] === 2;
      var c = config.pos[2] === 3;
      var d = config.pos[3] === 4;
      var e = config.pos[4] === 5;
      var f = config.pos[5] === 6;
      var g = config.pos[6] === 7;
      var h = config.pos[7] === 8;
      var i = config.pos[8] === 0;
      /*  */
      if (a && b && c && d && e && f && g && h && i) {
        window.setTimeout(function () {config.reset("winner")}, 300);
        window.alert("Congratulations, you did it! Please press on the - New Game - button to start a new game.");
      }
    },
    "new": function () {
      var x = 1;
      for (var i = 0; i < 9; i++) config.pos[i] = 9;
      for (var i = 0; i < 9; i++) {
        randomnum = config.random();
        if (randomnum === 9) randomnum = 8;
        x = 1;
        for (var j = 0; j < 9; j++) {
          if (j === i) continue;
          if (randomnum === config.pos[j]) {x = 0; break}
        }
        if (x == 0) {i--; continue}
        config.pos[i] = randomnum;
      }
      config.number.moves = 0;
      config.game.log(config.pos);
    }
  },
  "move": function (num) {
    if (num < 8 && config.pos[num + 1] === 0) {
      config.pos[num + 1] = config.pos[num];
      config.pos[num] = 0;
      config.number.moves++;
    } else if (num > 0 && config.pos[num - 1] === 0) {
      config.pos[num - 1] = config.pos[num];
      config.pos[num] = 0;
      config.number.moves++;
    } else if (num > 2 && config.pos[num - 3] === 0) {
      config.pos[num - 3] = config.pos[num];
      config.pos[num] = 0;
      config.number.moves++;
    } else if (num < 6 && config.pos[num + 3] === 0) {
      config.pos[num + 3] = config.pos[num];
      config.pos[num] = 0;
      config.number.moves++;
    }
    /*  */
    config.game.log(config.pos);
  },
  "render": function () {
    var valid = function (e) {
      var a = (e !== 2 && e !== 5 && e !== 8) && config.pos[e + 1] === 0;
      var b = (e !== 0 && e !== 3 && e !== 6) && config.pos[e - 1] === 0;
      var c = (e !== 0 && e !== 1 && e !== 2) && config.pos[e - 3] === 0;
      var d = (e !== 6 && e !== 7 && e !== 8) && config.pos[e + 3] === 0;
      return a || b || c || d;
    };
    /*  */
    config.reset(null);
    var action = parseInt(document.querySelector("input[value='0']").getAttribute("action"));
    /*  */
    config.neighbor.top = document.querySelector("input[value='" + config.pos[action - 3] + "']");
    config.neighbor.left = document.querySelector("input[value='" + config.pos[action - 1] + "']");
    config.neighbor.right = document.querySelector("input[value='" + config.pos[action + 1] + "']");
    config.neighbor.bottom = document.querySelector("input[value='" + config.pos[action + 3] + "']");
    /*  */
    if (config.neighbor.top && valid(action - 3)) config.neighbor.top.setAttribute("class", "neighbor");
    if (config.neighbor.left && valid(action - 1)) config.neighbor.left.setAttribute("class", "neighbor");
    if (config.neighbor.right && valid(action + 1)) config.neighbor.right.setAttribute("class", "neighbor");
    if (config.neighbor.bottom && valid(action + 3)) config.neighbor.bottom.setAttribute("class", "neighbor");
  },
  "load": function () {
    var reload = document.querySelector("#reload");
    var support = document.querySelector("#support");
    var submit = document.querySelector("#new-game");
    var donation = document.querySelector("#donation");
    var actions = [...document.querySelectorAll("input[action]")];
    /*  */
    reload.addEventListener("click", function () {
      document.location.reload();
    });
    /*  */
    support.addEventListener("click", function () {
      var url = config.addon.homepage();
      chrome.tabs.create({"url": url, "active": true});
    }, false);
    /*  */
    donation.addEventListener("click", function () {
      var url = config.addon.homepage() + "?reason=support";
      chrome.tabs.create({"url": url, "active": true});
    }, false);
    /*  */
    submit.addEventListener("click", config.game.new);
    /*  */
    for (var i = 0; i < actions.length; i++) {
      var action = actions[i];
      action.addEventListener("click", function () {
        config.move(parseInt(this.getAttribute("action")));
      });
    }
    /*  */
    config.pos = new config.init.array(9, 9, 9, 9, 9, 9, 9, 9, 9);
    window.removeEventListener("load", config.load, false);
    config.game.new();
  }
};

window.addEventListener("resize", function () {
  if (config.resize.timeout) window.clearTimeout(config.resize.timeout);
  config.resize.timeout = window.setTimeout(function () {
    config.storage.write("width", window.innerWidth || window.outerWidth);
    config.storage.write("height", window.innerHeight || window.outerHeight);
  }, 1000);
}, false);

window.addEventListener("load", config.load, false);
