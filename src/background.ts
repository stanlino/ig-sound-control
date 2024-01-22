let tabVolume: number | null = null;
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log('request', request)
  if (request.type === "getTabVolume") {
    if (!sender.tab) return;

    chrome.storage.sync.get(`${sender.tab.id}`, (data) => {
      if (!sender.tab) return;
      const volume = data[`${sender.tab.id}`];
      if (!volume) return;
      tabVolume = volume;
    });
  
    if (!tabVolume) {
      const url = new URL(sender.tab.url || '');
      chrome.storage.sync.get(`default-${url.hostname}`, function(data) {
        const volume = data[`default-${url.hostname}`] || 0.2;
        tabVolume = volume;
      });
    }

    console.log('tabVolume', tabVolume)

    sendResponse({ volume: tabVolume });
  }
});