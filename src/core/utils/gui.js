import $ from 'jquery';


const keyCallbacks = {};

class Gui {
  init() {
    this.$popup = $('<div>', {'id': 'tofu_popup_box'});
    $('body').append(this.$popup);

    document.body.onclick = (event) => {
      if ($(event.target).is("#tofu_popup_box")) {
        this.hide();
      }
    };

    document.addEventListener('keydown', function(evt) {
      evt = evt || window.event;
      if (keyCallbacks[evt.key]) {
        for (let m of keyCallbacks[evt.key]) {
          m();
        }
      }
    }, false);

    this.addHotkey('Escape', () => this.hide());
  }
    
  displayText(tx) {
    this.displayHtml("<div>" + tx + "</div>");
  }

  displayHtml(html) {
    this.hide();
    const child = document.createElement('div');
    child.innerHTML = html;
    var $div = document.createElement('div');
    $div.appendChild(child);

    this.$popup.append($div);
    this.$popup.show();
    return $div;
  }

  hide() {
    this.$popup.hide();
    this.$popup.children().remove();
  }

  addHotkey(key, method) {
    if (!keyCallbacks[key]) {
      keyCallbacks[key] = [];
    }
    keyCallbacks[key].push(method);
  }
  removeHotkey(key, method) {
    keyCallbacks[k] = keyCallbacks[k].filter(m => m != method);
  }
}

export default new Gui();