// Register the service worker
if ('serviceWorker' in navigator) {
  // Wait for the 'load' event to not block other work
  window.addEventListener('load', async () => {
    // Try to register the service worker.
    try {
      // Capture the registration for later use, if needed
      let reg;

      // Use ES Module version of our Service Worker in development
      if (import.meta.env?.DEV) {
        reg = await navigator.serviceWorker.register('sw.js', {
          type: 'module',
        });
      } else {
        // In production, use the normal service worker registration
        reg = await navigator.serviceWorker.register('sw.js');
      }

      console.log('main.js: Service worker registered!', reg);
    } catch (err) {
      console.log('main.js: Service worker registration failed: ', err);
    }
  });
}

// UI elements.
const deviceNameLabel = document.getElementById('device-name');
const connectButton = document.getElementById('connect');
const disconnectButton = document.getElementById('disconnect');
const terminalContainer = document.getElementById('terminal');
const sendForm = document.getElementById('send-form');
const inputField = document.getElementById('input');

const gnssDATE = document.getElementById('gnss-DATE');
const gnssTIME = document.getElementById('gnss-TIME');
const gnssHDOP = document.getElementById('gnss-HDOP');
const gnssSAT = document.getElementById('gnss-SAT');
const gnssSPD = document.getElementById('gnss-SPD');
const gnssALT = document.getElementById('gnss-ALT');
const gnssLAT = document.getElementById('gnss-LAT');
const gnssLNG = document.getElementById('gnss-LNG');
const gnssLPD = document.getElementById('gnss-LPD');
const gnssODO = document.getElementById('gnss-ODO');
const gnssUPTIME = document.getElementById('gnss-UPTIME');
const gnssSTATE = document.getElementById('gnss-STATE');
const gnssKey1 = document.getElementById('gnss-KEY1');
const gnssKey2 = document.getElementById('gnss-KEY2');
const gnssKey3 = document.getElementById('gnss-KEY3');
const gnssKey4 = document.getElementById('gnss-KEY4');

function setGNSS(data)
{

  if (data.startsWith('DATE: '))
  {
    gnssDATE.textContent = data.slice(6);
    gnssSTATE.textContent = '';
    return;
  }

  if (data.startsWith('TIME: '))
  {
    gnssTIME.textContent = data.slice(6);
    gnssSTATE.textContent = '';
    return;
  }

  if (data.startsWith('HDOP: '))
  {
    gnssHDOP.textContent = data.slice(6);
    gnssSTATE.textContent = '';
    return;
  }

  if (data.startsWith('SAT: '))
  {
    gnssSAT.textContent = data.slice(5);
    gnssSTATE.textContent = '';
    return;
  }

  if (data.startsWith('SPD: '))
  {
    gnssSPD.textContent = data.slice(5);
    gnssSTATE.textContent = '';
    return;
  }

  if (data.startsWith('ALT: '))
  {
    gnssALT.textContent = data.slice(5);
    gnssSTATE.textContent = '';
    return;
  }

  if (data.startsWith('LAT: '))
  {
    gnssLAT.textContent = data.slice(5);
    gnssSTATE.textContent = '';
    return;
  }

  if (data.startsWith('LNG: '))
  {
    gnssLNG.textContent = data.slice(5);
    gnssSTATE.textContent = '';
    return;
  }

  if (data.startsWith('LPD: '))
  {
    gnssLPD.textContent = data.slice(5);
    gnssSTATE.textContent = '';
    return;
  }

  if (data.startsWith('ODO: '))
  {
    gnssODO.textContent = data.slice(5);
    gnssSTATE.textContent = '';
    return;
  }

  if (data.startsWith('UPTIME: '))
  {
    gnssUPTIME.textContent = data.slice(8);
    return;
  }

  if (data.startsWith('STATE: '))
  {
    gnssSTATE.textContent = data.slice(7);
    return;
  }

  if (data.startsWith('HUD: Key1 '))
  {
    gnssKey1.textContent = data.slice(10);
    return;
  }

  if (data.startsWith('HUD: Key2 '))
  {
    gnssKey2.textContent = data.slice(10);
    return;
  }

  if (data.startsWith('HUD: Key3 '))
  {
    gnssKey3.textContent = data.slice(10);
    return;
  }

  if (data.startsWith('HUD: Key4 '))
  {
    gnssKey4.textContent = data.slice(10);
    return;
  }

  if (data.startsWith('.clr'))
  {
    terminalContainer.textContent = '';
    return;
  }

  logToTerminal(data, 'in')

}

// Helpers.
const defaultDeviceName = 'Terminal';
const terminalAutoScrollingLimit = terminalContainer.offsetHeight / 2;
let isTerminalAutoScrolling = true;

const scrollElement = (element) => {
  const scrollTop = element.scrollHeight - element.offsetHeight;

  if (scrollTop > 0) {
    element.scrollTop = scrollTop;
  }
};

const logToTerminal = (message, type = '') => {
  terminalContainer.insertAdjacentHTML('beforeend',
      `<div${type && ` class="${type}"`}>${message}</div>`);

  if (isTerminalAutoScrolling) {
    scrollElement(terminalContainer);
  }
};

// Obtain configured instance.
const terminal = new BluetoothTerminal();

// Override `receive` method to log incoming data to the terminal.
terminal.receive = function(data)
{

  //logToTerminal(data, 'in');

  setGNSS(data);

};

// Override default log method to output messages to the terminal and console.
terminal._log = function(...messages) {
  // We can't use `super._log()` here.
  messages.forEach((message) => {
    logToTerminal(message);
    console.log(message); // eslint-disable-line no-console
  });
};

// Implement own send function to log outcoming data to the terminal.
const send = (data) => {

  terminal.send(data).
      then(() => logToTerminal(data, 'out')).
      catch((error) => logToTerminal(error));

   // TEST
   setGNSS(data);

};

// Bind event listeners to the UI elements.
connectButton.addEventListener('click', () => {
  terminal.connect().
      then(() => {
        deviceNameLabel.textContent = terminal.getDeviceName() ?
            terminal.getDeviceName() : defaultDeviceName;
      });
});

disconnectButton.addEventListener('click', () => {
  terminal.disconnect();
  deviceNameLabel.textContent = defaultDeviceName;
});

sendForm.addEventListener('submit', (event) => {
  event.preventDefault();

  send(inputField.value);

  inputField.value = '';
  inputField.focus();
});

// Switch terminal auto scrolling if it scrolls out of bottom.
terminalContainer.addEventListener('scroll', () => {
  const scrollTopOffset = terminalContainer.scrollHeight -
      terminalContainer.offsetHeight - terminalAutoScrollingLimit;

  isTerminalAutoScrolling = (scrollTopOffset < terminalContainer.scrollTop);
});
