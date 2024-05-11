var background = {
  "port": null,
  "message": {},
  "receive": function (id, callback) {
    if (id) {
      background.message[id] = callback;
    }
  },
  "connect": function (port) {
    chrome.runtime.onMessage.addListener(background.listener); 
    /*  */
    if (port) {
      background.port = port;
      background.port.onMessage.addListener(background.listener);
      background.port.onDisconnect.addListener(function () {
        background.port = null;
      });
    }
  },
  "send": function (id, data) {
    if (id) {
      if (context !== "webapp") {
        chrome.runtime.sendMessage({
          "method": id,
          "data": data,
          "path": "interface-to-background"
        }, function () {
          return chrome.runtime.lastError;
        });
      }
    }
  },
  "post": function (id, data) {
    if (id) {
      if (background.port) {
        background.port.postMessage({
          "method": id,
          "data": data,
          "port": background.port.name,
          "path": "interface-to-background"
        });
      }
    }
  },
  "listener": function (e) {
    if (e) {
      for (let id in background.message) {
        if (background.message[id]) {
          if ((typeof background.message[id]) === "function") {
            if (e.path === "background-to-interface") {
              if (e.method === id) {
                background.message[id](e.data);
              }
            }
          }
        }
      }
    }
  }
};

var config = {
  "neighbor": {},
  "number": {
    "moves": 0
  },
  "addon": {
    "homepage": function () {
      return chrome.runtime.getManifest().homepage_url;
    }
  },
  "random": function () {
    const today = new Date();
    const tmp = today.getTime();
    /*  */
    return Math.round(Math.abs(Math.sin(tmp) * 1000000)) % 9;
  },
  "init": {
    "array": function () {
      this.length = config.init.array.arguments.length;
      for (let i = 0; i < this.length; i++) {
        this[i + 1] = config.init.array.arguments[i];
      }
    }
  },
  "reset": function (e) {
    const actions = [...document.querySelectorAll("input[action]")];
    if (e) {
      for (let i = 0; i < actions.length; i++) {
        actions[i].setAttribute("class", e);
      }
      /*  */
      if (e === "winner") {
        window.setTimeout(function () {
          window.alert("Congratulations, you did it! Please press on the - New Game - button to start a new game.");
        }, 300);
      }
    } else {
      for (let i = 0; i < actions.length; i++) {
        actions[i].removeAttribute("class");
      }
    }
  },
  "resize": {
    "timeout": null,
    "method": function () {
      if (config.port.name === "win") {
        if (config.resize.timeout) window.clearTimeout(config.resize.timeout);
        config.resize.timeout = window.setTimeout(async function () {
          const current = await chrome.windows.getCurrent();
          /*  */
          config.storage.write("interface.size", {
            "top": current.top,
            "left": current.left,
            "width": current.width,
            "height": current.height
          });
        }, 1000);
      }
    }
  },
  "port": {
    "name": '',
    "connect": function () {
      config.port.name = "webapp";
      const context = document.documentElement.getAttribute("context");
      /*  */
      if (chrome.runtime) {
        if (chrome.runtime.connect) {
          if (context !== config.port.name) {
            if (document.location.search === "?win") config.port.name = "win";
            background.connect(chrome.runtime.connect({"name": config.port.name}));
          }
        }
      }
      /*  */
      document.documentElement.setAttribute("context", config.port.name);
    }
  },
  "storage": {
    "local": {},
    "read": function (id) {
      return config.storage.local[id];
    },
    "load": function (callback) {
      chrome.storage.local.get(null, function (e) {
        config.storage.local = e;
        callback();
      });
    },
    "write": function (id, data) {
      if (id) {
        if (data !== '' && data !== null && data !== undefined) {
          let tmp = {};
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
    const valid = function (e) {
      const a = (e !== 2 && e !== 5 && e !== 8) && config.pos[e + 1] === 0;
      const b = (e !== 0 && e !== 3 && e !== 6) && config.pos[e - 1] === 0;
      const c = (e !== 0 && e !== 1 && e !== 2) && config.pos[e - 3] === 0;
      const d = (e !== 6 && e !== 7 && e !== 8) && config.pos[e + 3] === 0;
      /*  */
      return a || b || c || d;
    };
    /*  */
    config.reset(null);
    const action = parseInt(document.querySelector("input[value='0']").getAttribute("action"));
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
    const reload = document.querySelector("#reload");
    const support = document.querySelector("#support");
    const submit = document.querySelector("#new-game");
    const donation = document.querySelector("#donation");
    const actions = [...document.querySelectorAll("input[action]")];
    /*  */
    reload.addEventListener("click", function () {
      document.location.reload();
    });
    /*  */
    support.addEventListener("click", function () {
      const url = config.addon.homepage();
      chrome.tabs.create({"url": url, "active": true});
    }, false);
    /*  */
    donation.addEventListener("click", function () {
      const url = config.addon.homepage() + "?reason=support";
      chrome.tabs.create({"url": url, "active": true});
    }, false);
    /*  */
    submit.addEventListener("click", config.game.new);
    /*  */
    for (let i = 0; i < actions.length; i++) {
      const action = actions[i];
      action.addEventListener("click", function () {
        config.move(parseInt(this.getAttribute("action")));
      });
    }
    /*  */
    config.pos = new config.init.array(9, 9, 9, 9, 9, 9, 9, 9, 9);
    /*  */
    config.game.new();
    window.removeEventListener("load", config.load, false);
  },
  "game": {
    "log": function (e) {
      for (let i = 0; i < 9; i++) {
        document.forms[0].elements[i].value = e[i];
      }
      /*  */
      document.forms[0].moves.value = config.number.moves;
      config.game.over();
      config.render();
    },
    "over": function () {
      const a = config.pos[0] === 1;
      const b = config.pos[1] === 2;
      const c = config.pos[2] === 3;
      const d = config.pos[3] === 4;
      const e = config.pos[4] === 5;
      const f = config.pos[5] === 6;
      const g = config.pos[6] === 7;
      const h = config.pos[7] === 8;
      const i = config.pos[8] === 0;
      /*  */
      if (a && b && c && d && e && f && g && h && i) {
        window.setTimeout(function () {
          config.reset("winner");
        }, 300);
      }
    },
    "new": function () {
      let x = 1;
      for (let i = 0; i < 9; i++) {
        config.pos[i] = 9;
      }
      /*  */
      for (let i = 0; i < 9; i++) {
        let rand = config.random();
        if (rand === 9) {
          rand = 8;
        }
        /*  */
        x = 1;
        /*  */
        for (let j = 0; j < 9; j++) {
          if (j === i) continue;
          if (rand === config.pos[j]) {
            x = 0; 
            break;
          }
        }
        /*  */
        if (x == 0) {
          i--; 
          continue;
        }
        /*  */
        config.pos[i] = rand;
      }
      /*  */
      config.number.moves = 0;
      config.game.log(config.pos);
    }
  }
};

config.port.connect();

window.addEventListener("load", config.load, false);
window.addEventListener("resize", config.resize.method, false);
