class PanTiltCard extends HTMLElement {
  set hass(hass) {
    if (!this.content) {
      const card = document.createElement('ha-card');
      //card.header = 'Pan-Tilt card';
      this.content = document.createElement('div');
      //this.content.style.padding = '0 16px 16px';
      this.content.style.padding = '0 0px 0px';
      this.content.style.height = '400px';
      card.appendChild(this.content);
      this.appendChild(card);
    }

    const entityX = this.config.entity_x;
    this.stateX = hass.states[entityX];
    this.flipX = (this.config.flip_x) ? -1 : 1;

    const entityY = this.config.entity_y;
    this.stateY = hass.states[entityY];
    this.flipY = (this.config.flip_y) ? -1 : 1;

    var that = this;
    this.content.addEventListener('click', function(ev) {that._click(ev, hass);});

    if (!this.targetDot) {
      this.targetDot = document.createElement('div');
      this.targetDot.style.pointerEvents = "none";
      this.targetDot.style.height = "4px";
      this.targetDot.style.width = "4px";
      this.targetDot.style.backgroundColor = "red";
      this.targetDot.style.position = "absolute";
      this.content.appendChild(this.targetDot);
    }
    const pos = this.inputToCard(this.stateX.state, this.stateY.state);
    this.targetDot.style.left = pos['x'] - 2 + "px";
    this.targetDot.style.top = pos['y'] - 2+ "px";
  }

  cardToInput(x,y) {
    const w = this.content.clientWidth;
    const h = this.content.clientHeight;
    const minX = this.stateX.attributes.min;
    const maxX = this.stateX.attributes.max;
    const stepX = this.stateX.attributes.step;
    const stepX = this.stateX.attributes.step;
    const minY = this.stateY.attributes.min;
    const maxY = this.stateY.attributes.max;
    const stepY = this.stateY.attributes.step;

    return {
      x: Math.round((((x / w) * (maxX - minX)) + minX) / stepX) * stepX * this.flipX,
      y: Math.round((((y / h) * (maxY - minY)) + minY) / stepY) * stepY * this.flipY
    }
  }

  inputToCard(x,y) {
    const w = this.content.clientWidth;
    const h = this.content.clientHeight;
    const minX = this.stateX.attributes.min;
    const maxX = this.stateX.attributes.max;
    const minY = this.stateY.attributes.min;
    const maxY = this.stateY.attributes.max;

    return {
      x: (((x * this.flipX) - minX) / (maxX - minX)) * w,
      y: (((y * this.flipY) - minY) / (maxY - minY)) * h
    }
  }

  _click(event, hass) {
    const rect = event.srcElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const pos = this.cardToInput(x, y);
    console.log(pos);
    hass.callService("input_number", "set_value", {
      entity_id: this.config.entity_x,
      value: pos['x']
    });
    hass.callService("input_number", "set_value", {
      entity_id: this.config.entity_y,
      value: pos['y']
    });
  }

  setConfig(config) {
    if (!config.entity_x) {
      throw new Error('You need to define an entity for the X value');
    }
    if (!config.entity_y) {
      throw new Error('You need to define an entity for the Y value');
    }
    this.config = config;
  }

  // The height of your card. Home Assistant uses this to automatically
  // distribute all cards over the available columns.
  getCardSize() {
    return 8;
  }
}

customElements.define('pan-tilt-card', PanTiltCard);
