Groove.js
========
A lightweight wrapper on the WebAudio API to create node graphs and signal processing mixes. 

#Usage
```js
  var groove = new Groove();

  groove.createNode('hi-hat.wav').then(function(node) {
    node.play();
  });

  groove.createNode('hi-hat.wav').then(function(node) {
    node.addEffect('reverb', {room: 10});
    node.play();
  });
```
