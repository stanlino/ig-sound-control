let volume = 0.2;
chrome.storage.sync.get('volume', function(data) {
  volume = data.volume || 0.2;
});

function updateVolume(videoElement) {
  videoElement.volume = volume;
}

function callback() {
  const videos = document.querySelectorAll("video");
  videos.forEach(video => updateVolume(video));
}

function observeMutations() {
  const observer = new MutationObserver(callback);
  observer.observe(document.body, { childList: true, subtree: true, attributes: true });
}

if (window.location.hostname === "www.instagram.com") {
  observeMutations();

  window.addEventListener("play", callback, true);

  chrome.runtime.onMessage.addListener(function(request) {
    volume = request.volume;
    const videos = document.querySelectorAll("video");
    videos.forEach(video => {
      updateVolume(video);
    });
  });
}
