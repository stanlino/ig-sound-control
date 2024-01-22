let volume = 0.2;
chrome.runtime.sendMessage({ type: "getTabVolume" }, function(response) {
  console.log('retornou', response)
  if (response && response.volume) {
    volume = response.volume;
    callback();
  }
});

function updateVolume(videoElement: HTMLVideoElement | HTMLAudioElement) {
  videoElement.volume = volume;
}

function callback() {
  const videos = document.querySelectorAll("video, audio") as NodeListOf<HTMLVideoElement | HTMLAudioElement>;
  videos.forEach(video => updateVolume(video));
}

function observeMutations() {
  const observer = new MutationObserver(callback);
  observer.observe(document.body, { childList: true, subtree: true, attributes: true });
}

if (window.location.hostname) {
  observeMutations();

  window.addEventListener("play", callback, true);

  chrome.runtime.onMessage.addListener(function(request) {
    volume = request.volume;
    callback();
  });
}
