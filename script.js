let peerConnection;
const configuration = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };

document.getElementById('connectBtn').addEventListener('click', connectToBroadcast);
document.getElementById('disconnectBtn').addEventListener('click', disconnect);

async function connectToBroadcast() {
    const connectionId = document.getElementById('connectionIdInput').value.trim();
    if (!connectionId) {
        updateStatus("Please enter a Connection ID");
        return;
    }
    
    try {
        updateStatus("Connecting...");
        
        // In a real app, you'd get the offer from a signaling server
        // For this demo, we're using localStorage
        const offerData = JSON.parse(localStorage.getItem('voiceOffer'));
        if (!offerData || offerData.id !== connectionId) {
            updateStatus("Invalid Connection ID");
            return;
        }
        
        // Create peer connection
        peerConnection = new RTCPeerConnection(configuration);
        
        // Set up audio stream
        peerConnection.ontrack = (event) => {
            const audioPlayer = document.getElementById('audioPlayer');
            audioPlayer.srcObject = event.streams[0];
        };
        
        // Set remote description
        await peerConnection.setRemoteDescription(offerData.offer);
        
        // Create answer
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        
        // In a real app, you'd send the answer back to the sender via signaling server
        // For this demo, we're skipping that step
        
        updateStatus("Connected! You should hear audio now.");
        document.getElementById('connectBtn').disabled = true;
        document.getElementById('disconnectBtn').disabled = false;
        
    } catch (error) {
        updateStatus(`Error: ${error.message}`);
        console.error(error);
    }
}

function disconnect() {
    if (peerConnection) {
        peerConnection.close();
        peerConnection = null;
    }
    
    const audioPlayer = document.getElementById('audioPlayer');
    audioPlayer.srcObject = null;
    
    updateStatus("Disconnected");
    document.getElementById('connectBtn').disabled = false;
    document.getElementById('disconnectBtn').disabled = true;
}

function updateStatus(message) {
    document.getElementById('status').textContent = `Status: ${message}`;
}
