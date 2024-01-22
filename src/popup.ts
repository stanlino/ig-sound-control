chrome.tabs.query({}, (tabs) => {
  const root = document.querySelector('.root') as HTMLDivElement;
  for (const tab of tabs) {
    if (!tab.audible) continue;
    const tabVolumeController = createTabVolumeController(tab);
    if (!tabVolumeController) continue;
    root.appendChild(tabVolumeController);
  }
})

function createTabVolumeController(tab: chrome.tabs.Tab) {
  if (!tab.id) return null;
  const url = new URL(tab.url || '');

  const header = document.createElement('header');

  const img = document.createElement('img');
  img.src = tab.favIconUrl || '';
  header.appendChild(img);

  const span = document.createElement('span');
  span.textContent = tab.title || '';
  header.appendChild(span);

  const footer = document.createElement('footer');

  const input = document.createElement('input');
  input.type = 'range';
  input.min = '0.01';
  input.max = '1';
  input.step = '0.01';

  let inputVolume: number | null = null;

  chrome.storage.sync.get(`${tab.id}`, (data) => {
    const volume = data[`${tab.id}`];
    if (!volume) return;
    input.value = volume;
  });

  if (!inputVolume) {
    chrome.storage.sync.get(`default-${url.hostname}`, function(data) {
      const volume = data[`default-${url.hostname}`] || 0.2;
      input.value = volume;
    });
  }

  input.addEventListener('change', (event) => {
    const volume = (event.target as HTMLInputElement).value;
    input.value = volume;
    chrome.storage.sync.set({ [`${tab.id}`]: volume });
    chrome.storage.sync.set({ [`default-${url.hostname}`]: volume });
    if (tab.id) chrome.tabs.sendMessage(tab.id, { volume });
  });

  footer.appendChild(input);

  const tabVolumeController = document.createElement('div');
  tabVolumeController.classList.add('tab-volume-controller');
  tabVolumeController.appendChild(header);
  tabVolumeController.appendChild(footer);

  return tabVolumeController;
}