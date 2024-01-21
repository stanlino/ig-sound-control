const volumeControl = document.getElementById('volume-control-23') as HTMLInputElement;
chrome.storage.sync.get('volume', function(data) {
  if (!volumeControl) return;
  volumeControl.value = data.volume || 0.2;
});

volumeControl.addEventListener('change', (event) => {
  const target = event.target as HTMLInputElement;
  const volume = target.value;
  chrome.storage.sync.set({ volume });
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    const [tab] = tabs;
    if (!tab) return;
    chrome.tabs.sendMessage(tab.id!, { volume });
  });
});