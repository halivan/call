# Video Call App

This is a simple web application for video calls using the PeerJS library to establish peer-to-peer connections. Users can exchange video and audio in real-time.

## Description

This application allows users to:
- Generate a unique ID for connection.
- Connect to another user via their ID.
- Make a video call with the ability to toggle video and audio.
- Copy their ID or link for easy sharing with others.

## Features

- **Connection System:** Input the peer's ID to start a call.
- **Video Control:** Toggle local and remote video on/off.
- **Audio Control:** Toggle local and remote audio on/off.
- **ID and Link Copying:** Easily copy your unique ID or link for sharing.

## Project Structure

- **index.html:** The main HTML page with the user interface for video calls.
- **peerjs.min.js:** The library used for P2P connection.
- **script.js:** JavaScript file that manages the video call functionality.
- **svg/**: A folder containing icons for controlling audio and video.

## How to Run

1. Clone the repository:
    ```bash
    git clone https://github.com/halivan/video-call.git
    ```

2. Open the `index.html` file in your browser to start video calling.

3. To use the app:
    - Generate your unique ID.
    - Share your ID with a friend.
    - Enter your friend’s ID and click "Connect" to start the call.

## Notes

- For video calls to work, both users must use a browser that supports WebRTC.
- Ensure your browser has access to your camera and microphone.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.