javascript:(function(){
  const assistant = document.createElement('div');
  assistant.id = 'halku';
  assistant.style = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 130px;
    height: 130px;
    background: linear-gradient(135deg, #ff9a9e, #fad0c4);
    border-radius: 50%;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
    text-align: center;
    line-height: 130px;
    font-family: 'Arial', sans-serif;
    color: white;
    font-weight: bold;
    cursor: pointer;
    z-index: 999999;
    transition: transform 0.2s ease;
  `;
  assistant.textContent = "Halku";
  document.body.appendChild(assistant);

  const leftEar = document.createElement('div');
  leftEar.id = 'left-ear';
  leftEar.style = `
    position: absolute;
    top: -40px;
    left: 15px;
    width: 40px;
    height: 70px;
    background: #ff7f7f;
    border-radius: 50%;
    text-align: center;
    line-height: 70px;
    font-size: 11px;
    font-weight: bold;
    color: white;
    cursor: pointer;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
    transition: transform 0.2s ease;
  `;
  leftEar.textContent = "Explain";
  assistant.appendChild(leftEar);

  const rightEar = document.createElement('div');
  rightEar.id = 'right-ear';
  rightEar.style = `
    position: absolute;
    top: -40px;
    right: 15px;
    width: 40px;
    height: 70px;
    background: #ff7f7f;
    border-radius: 50%;
    text-align: center;
    line-height: 70px;
    font-size: 12px;
    font-weight: bold;
    color: white;
    cursor: pointer;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
    transition: transform 0.2s ease;
  `;
  rightEar.textContent = "QR";
  assistant.appendChild(rightEar);

  [leftEar, rightEar].forEach(ear => {
    ear.addEventListener('mouseover', () => {
      ear.style.transform = 'scale(1.1)';
    });
    ear.addEventListener('mouseout', () => {
      ear.style.transform = 'scale(1)';
    });
  });

  const closeButton = document.createElement('div');
  closeButton.id = 'close-button';
  closeButton.style = `
    position: absolute;
    top: -10px;
    right: -10px;
    width: 25px;
    height: 25px;
    background: #ff4d4d;
    border-radius: 50%;
    text-align: center;
    line-height: 25px;
    font-size: 14px;
    font-weight: bold;
    color: white;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  `;
  closeButton.textContent = "✕";
  assistant.appendChild(closeButton);

  closeButton.addEventListener('click', () => {
    assistant.remove();
  });

  assistant.addEventListener('click', () => {
    if (!document.getElementById('ai-prompt-container')) {
      const promptContainer = document.createElement('div');
      promptContainer.id = 'ai-prompt-container';
      promptContainer.style = `
        position: fixed;
        bottom: 170px;
        right: 20px;
        width: 320px;
        background: white;
        border: 2px solid #ff9a9e;
        border-radius: 10px;
        padding: 15px;
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
        font-family: Arial, sans-serif;
        z-index: 999999;
      `;
      promptContainer.innerHTML = `
        <textarea id="ai-prompt" placeholder="Ask me anything..." style="width: 100%; height: 60px; border: 1px solid #ccc; border-radius: 6px; padding: 8px; font-size: 14px;"></textarea>
        <button id="ai-submit" style="margin-top: 10px; background: #ff7f7f; color: white; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer;">Submit</button>
        <button id="ai-close" style="margin-top: 10px; background: #ccc; color: black; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer; float: right;">Close</button>
        <div id="ai-response" style="margin-top: 10px; font-size: 14px; color: black;"></div>
      `;
      document.body.appendChild(promptContainer);

      document.getElementById('ai-submit').addEventListener('click', async () => {
        const prompt = document.getElementById('ai-prompt').value.trim();
        if (!prompt) {
          alert("Please enter a prompt!");
          return;
        }
        document.getElementById('ai-response').textContent = "Thinking...";
        try {
          const response = await fetch("https://ai.hackclub.com/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              messages: [
                { role: "system", content: "Answer precisely and shortly" },
                { role: "user", content: prompt }
              ]
            })
          });
          const data = await response.json();
          const reply = data.choices[0].message.content;
          document.getElementById('ai-response').textContent = reply;
        } catch (error) {
          document.getElementById('ai-response').textContent = "Error: Unable to fetch response.";
        }
      });

      document.getElementById('ai-close').addEventListener('click', () => {
        promptContainer.remove();
      });
    }
  });

  leftEar.addEventListener('click', async () => {
    const selectedText = window.getSelection().toString().trim();
    if (!selectedText) {
      alert("No text selected! Highlight some text to explain it.");
      return;
    }
    assistant.textContent = "Explaining...";
    try {
      const response = await fetch("https://ai.hackclub.com/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messages: [
            { role: "system", content: "You are a savage AI that explains things in a brutally honest way. Be short and rude and rizz him up like he loves aga and he is a nerd in gen z terms" },
            { role: "user", content: `Explain this savagely: "${selectedText}"` }
          ]
        })
      });
      const data = await response.json();
      const reply = data.choices[0].message.content;
      document.getElementById('ai-response').textContent = reply;
    } catch (error) {
      alert("Error: Unable to fetch explanation.");
    }
    assistant.textContent = "Halku";
  });

  rightEar.addEventListener('click', () => {
    const url = prompt("Enter the URL to generate a QR Code:", window.location.href);
    if (!url) {
      alert("No URL provided!");
      return;
    }
    const qrWindow = window.open(
      `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`,
      "_blank"
    );
    if (!qrWindow) {
      alert("Popup blocked! Please allow popups for this website.");
    }
  });
})();
