// const API_URL = '/example.json?domain=';
const API_URL = 'https://apis.is/isnic?domain=';

document.addEventListener('DOMContentLoaded', () => {
  const domains = document.querySelector('.domains');

  program.init(domains);
});

/**
 * Leit að lénum á Íslandi gegnum apis.is
 */
const program = (() => {
  let domains;

  function displayDomain(domainsList) {
    if (domainsList.length === 0) {
      displayError('Lén er ekki skráð');
      return;
    }

    let [{ domain, registered, lastChange, expires, registrantname, email,
      address, country }] = domainsList;

    const baseData = ['Lén', 'Skráð', 'Seinast breytt', 'Rennur út',
      'Skráningaraðili', 'Netfang', 'Heimilisfang', 'Land'];
    let dataList = [domain, registered, lastChange, expires,
        registrantname, email, address, country];
    const dl = document.createElement('dl');

    for(let i=0;i<3;i++) {
      let temp = Date.parse(dataList[i+1]);
      let temp2 = new Date(temp);
      let temp3 = temp2.toLocaleDateString('en-GB');
      dataList[i+1] = temp3.split('/').reverse().join('-');
    }

    for(let i=0;i<baseData.length;i++) {
      if (dataList[i] != false) {
        let ele = document.createElement('dt');
        ele.appendChild(document.createTextNode(baseData[i]));
        dl.appendChild(ele);

        let valueElement = document.createElement('dd');
        valueElement.appendChild(document.createTextNode(dataList[i]));
        dl.appendChild(valueElement);
      }
    }

    const container = domains.querySelector('.results');

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    container.appendChild(dl);
  }

  function displayGif() {
    const container = domains.querySelector('.results');
    const loader = document.createElement('div');
    loader.setAttribute('class', 'loading');
    const gif = document.createElement('IMG');
    gif.setAttribute('src', 'loading.gif');
    loader.appendChild(gif);
    const loadingText = document.createTextNode('Leita að léni...');
    loader.appendChild(loadingText);

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    
    container.appendChild(loader);
  }

  function displayError(error) {
    const container = domains.querySelector('.results');

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    container.appendChild(document.createTextNode(error));
  }

  function fetchData(url) {
    fetch(`${API_URL}${url}`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }

        throw new Error('Villa við að sækja gögn');
      })
      .then((data) => {
        displayDomain(data.results);
      })
      .catch((error) => {
        displayError('Lén verður að vera strengur');
        console.error(error);
      })
  }

  function onSubmit(e) {
    e.preventDefault();
    displayGif();
    const input = e.target.querySelector('input');

    fetchData(input.value);
  }

  function init(_domains) {
    domains = _domains;

    const form = domains.querySelector('form');
    form.addEventListener('submit', onSubmit);
  }

  return {
    init,
  };
})();
