let count = 0;
let sessionData;
let fieldData;
let matcher = '';

window.addEventListener('onWidgetLoad', function (obj) {
    fieldData = obj.detail.fieldData;
  	matcher = String(fieldData.matcherUsername);
  	matcher = matcher.toLowerCase();
});


window.addEventListener('onEventReceived', (obj) => {
    if(!obj.detail.event) return;
    let event = obj.detail.listener;
    let data = obj.detail.event;
    if (data.bulkGifted)
      return;
  	if (event == 'subscriber-latest') {
      if (data.sender) {
        if (data.sender.toLowerCase() == matcher) {
          decreaseCounter(tierValue(data.tier));
          return;
        }
        if (fieldData.allowGiftedSubs)
          increaseCounter(tierValue(data.tier));
        return;
      }
      if (fieldData.allowResubs && data.amount > 1 && data.tier)
      	increaseCounter(tierValue(data.tier));
      else if (fieldData.allowResubs && data.amount > 1)
      	increaseCounter(1);
      else if (fieldData.allowFirstTimeSubs && data.amount == 1 && data.tier)
      	increaseCounter(tierValue(data.tier));
      else if (fieldData.allowFirstTimeSubs && data.amount == 1)
      	increaseCounter(1);
      else return;
    }
  	else if (event == 'cheer-latest' && fieldData.allowBitsforSubs) {
      increaseCounter((data.amount - (data.amount%fieldData.bitsPerSub)) / fieldData.bitsPerSub);
    }
  	else if (event == 'tip-latest' && fieldData.allowDonosforSubs) {
      increaseCounter((data.amount - (data.amount%fieldData.dollarsPerSub)) / fieldData.dollarsPerSub);
    }
});

function tierValue(tier) {
  if (tier == 3000) return 6;
  else if (tier == 2000) return 2;
  else return 1;
}

function updateData(data) {
}

function increaseCounter(value) {
  count += value;
  update();
}
function decreaseCounter(value) {
  count -= value;
  update();
}

function test(text) {
    $("#count").html(text);
}

function update() {
    $("#count").html(count);
}