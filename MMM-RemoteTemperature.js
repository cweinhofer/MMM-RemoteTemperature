/* global Module, moment */

/* Magic Mirror Module: MMM-RemoteTemperature (https://github.com/balassy/MMM-RemoteTemperature)
 * By György Balássy (https://www.linkedin.com/in/balassy)
 * MIT Licensed.
 */

Module.register('MMM-RemoteTemperature', {
  defaults: {
    sensorId: null,
    icon: 'home',
    showMore: true
  },

  requiresVersion: '2.1.0',

  getScripts() {
    return [
      'moment.js'
    ];
  },

  getStyles() {
    return [
      'MMM-RemoteTemperature.css',
      'font-awesome.css',
      'font-awesome5.css'
    ];
  },

  getTranslations() {
    return {
      en: 'translations/en.json',
      hu: 'translations/hu.json'
    };
  },

  start() {
    this.viewModel = null;
    this._initCommunication();
  },

  getDom() {
    const wrapper = document.createElement('div');

    if (this.viewModel) {
      const firstLineEl = document.createElement('div');

      if (this.config.icon) {
        const iconEl = document.createElement('span');
        iconEl.classList = `symbol fa fa-${this.config.icon}`;
        firstLineEl.appendChild(iconEl);
      }

      if (this.viewModel.temp) {
        const tempEl = document.createElement('span');
        tempEl.classList = 'temp';
        tempEl.innerHTML = `${this.viewModel.temp}&deg;`;
        firstLineEl.appendChild(tempEl);
      }

      if (this.viewModel.humidity) {
        const humidityEl = document.createElement('span');
        humidityEl.classList = 'humidity';
        humidityEl.innerHTML = `${this.viewModel.humidity}%`;
        firstLineEl.appendChild(humidityEl);
      }

      wrapper.appendChild(firstLineEl);

      if (this.viewModel.other1) {
        const other1El = document.createElement('span');
        other1El.classList = 'other1';
        other1El.innerHTML = `${this.viewModel.other1}`;
        secondLineEl.appendChild(other1El);
      }

      if (this.viewModel.other2) {
        const other2El = document.createElement('span');
        other2El.classList = 'other2';
        other2El.innerHTML = `${this.viewModel.other2}`;
        secondLineEl.appendChild(other2El);
      }

      wrapper.appendChild(secondLineEl);

      if (this.config.showMore) {
        const thirdLineEl = document.createElement('div');
        thirdLineEl.classList = 'more dimmed small';
        thirdLineEl.innerHTML = `<span class="fa fa-refresh"></span> ${this._formatTimestamp(this.viewModel.timestamp)}`;

        if (this.viewModel.battery) {
          thirdLineEl.innerHTML += `<span class="fa fa-battery-half"></span> ${this.viewModel.battery}%`;
        }

        wrapper.appendChild(thirdLineEl);
      }
    } else {
      const loadingEl = document.createElement('span');
      loadingEl.innerHTML = this.translate('LOADING');
      loadingEl.classList = 'dimmed small';
      wrapper.appendChild(loadingEl);
    }

    return wrapper;
  },

  socketNotificationReceived(notificationName, payload) {
    if (notificationName === 'MMM-RemoteTemperature.VALUE_RECEIVED' && payload) {
      if (!this.config.sensorId || (this.config.sensorId && this.config.sensorId === payload.sensorId)) {
        this.viewModel = {
          temp: payload.temp,
          humidity: payload.humidity,
          other1: payload.other1,
          other2: payload.other2,
          battery: payload.battery,
          timestamp: Date.now()
        };

        this.updateDom();
      }
    }
  },

  _initCommunication() {
    this.sendSocketNotification('MMM-RemoteTemperature.INIT', {
      sensorId: this.config.sensorId
    });
  },

  _formatTimestamp(timestamp) {
    return moment(timestamp).format('HH:mm');
  }
});
