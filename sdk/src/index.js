let _apiKey = null;       
let _host = '';          
let _userId = null;       
let _initialized = false; 

export function init(apiKey, options = {}) {
  if (!apiKey) {
    console.warn('[@bhavishyaone/sdk] init() requires an API key.');
    return;
  }
  _apiKey = apiKey;
  _host = options.host || '';
  _initialized = true;
  console.log('[@bhavishyaone/sdk] Initialized successfully.');
}


export function identify(userId) {
  if (!userId) {
    console.warn('[@bhavishyaone/sdk] identify() requires a userId.');
    return;
  }
  _userId = userId;
}




export function track(eventName, properties = {}) {
  if (!_initialized) {
    console.warn('[@bhavishyaone/sdk] SDK not initialized. Call init() first.');
    return;
  }
  if (!eventName) {
    console.warn('[@bhavishyaone/sdk] track() requires an event name.');
    return;
  }
  const body = {
    name: eventName,
    userId: _userId,
    properties: properties,
    timestamp: new Date().toISOString(),
  };

  _sendRequest('/api/events/track', body);
}



export function batchTrack(events = []) {
  if (!_initialized) {
    console.warn('[@bhavishyaone/sdk] SDK not initialized. Call init() first.');
    return;
  }
  if (!Array.isArray(events) || events.length === 0) {
    console.warn('[@bhavishyaone/sdk] batchTrack() requires a non-empty array of events.');
    return;
  }

  const enrichedEvents = events.map((e) => ({
    name: e.name,
    userId: e.userId || _userId,
    properties: e.properties || {},
    timestamp: e.timestamp || new Date().toISOString(),
  }));

  _sendRequest('/api/events/batch', { events: enrichedEvents });
}


async function _sendRequest(path, body) {

  const url = `${_host}${path}`;
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': _apiKey,
    },
    body: JSON.stringify(body),
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      console.warn(`[@bhavishyaone/sdk] Event tracking failed: ${response.status}`);
    }
  } 
  catch (err) {
    console.warn('[@bhavishyaone/sdk] Request failed, retrying in 500ms...');

    setTimeout(async () => {

      try {
        const retryResponse = await fetch(url, options);
        if (!retryResponse.ok) {
          console.warn(`[@bhavishyaone/sdk] Retry also failed: ${retryResponse.status}`);
        }
      } 
      catch (retryErr) {
        console.warn('[@bhavishyaone/sdk] Retry failed. Event not tracked.');
      }
      
    }, 500);
  }
}