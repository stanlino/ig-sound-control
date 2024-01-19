const volumeControl = document.getElementById('volume-control-23');
chrome.storage.sync.get('volume', function(data) {
  volumeControl.value = data.volume || 0.2;
});

volumeControl.addEventListener('change', (event) => {
  const volume = event.target.value;
  chrome.storage.sync.set({ volume });
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { volume });
  });
});