import { server_url } from '../config.js';
const queryString = require('query-string');

export function getChannelSongURI(channel_id) {
    // Get Songs in channel
    return fetch(`${server_url}/song/get_channel_song_uri?channel_id=${channel_id}`)
    .then((response) => response.json())
    .then((responseJSON) => {
        console.log(responseJSON);
        return responseJSON;
    })
    .catch((error) => {
        console.error(error);
    })
}

export async function playSong(channel_id) {
    const response = await fetch(
        `${server_url}/play?channel_id=${channel_id}`,
        {
            method: 'PUT',
        }
    )
}

export async function resumeSong(channel_id, progress_ms) {
  const response = await fetch(`${server_url}/resume?progress_ms=${progress_ms}&channel_id=${channel_id}`, {
    method: 'PUT'
  });
}

export async function pauseSong(channel_id) {
    const response = await fetch(
        `${server_url}/pause?channel_id=${channel_id}`,
        {
            method: 'PUT',
        }
    )
}

export function skipSongUpdateQueue(channel_id) {
    console.log(channel_id);
    const response = fetch(`${server_url}/skip?channel_id=${channel_id}`,
    {
        method: 'POST',
    });
}
