(function() {
  define([], function() {
    return localStorage.getItem('beetProject') || {
      name: 'test',
      fx: {
        eq: {
          params: {
            hpf: [50, 1],
            lmf: [828, 1.8, 18.3],
            mf: [2400, 2.2, -24, 5],
            lpf: [5000, 1.1]
          }
        },
        reverb: {
          room: 0.1,
          damp: 0.4,
          mix: 0.55
        }
      },
      groups: {
        '1': {
          sounds: [
            {
              pad: 1,
              src: '/sounds/additiv/1.wav',
              keyCode: 54
            }, {
              pad: 2,
              src: '/sounds/additiv/2.wav',
              keyCode: 55
            }, {
              pad: 3,
              src: '/sounds/additiv/3.wav',
              keyCode: 56
            }, {
              pad: 4,
              src: '/sounds/additiv/4.wav',
              keyCode: 57
            }, {
              pad: 5,
              src: '/sounds/additiv/5.wav',
              keyCode: 89
            }, {
              pad: 6,
              src: '/sounds/additiv/6.wav',
              keyCode: 85
            }, {
              pad: 7,
              src: '/sounds/additiv/7.wav',
              keyCode: 73
            }, {
              pad: 8,
              src: '/sounds/additiv/8.wav',
              keyCode: 79
            }, {
              pad: 9,
              src: '/sounds/additiv/9.wav',
              keyCode: 72
            }, {
              pad: 10,
              src: '/sounds/additiv/10.wav',
              keyCode: 74
            }, {
              pad: 11,
              src: '/sounds/additiv/11.wav',
              keyCode: 75
            }, {
              pad: 12,
              src: '/sounds/additiv/12.wav',
              keyCode: 76
            }, {
              pad: 13,
              src: '/sounds/additiv/13.wav',
              keyCode: 78
            }, {
              pad: 14,
              src: '/sounds/additiv/14.wav',
              keyCode: 77
            }, {
              pad: 15,
              src: '/sounds/additiv/15.wav',
              keyCode: 188,
              fx: {
                eq: {
                  params: {
                    hpf: [50, 1],
                    lmf: [828, 1.8, 18.3],
                    mf: [2400, 2.2, -24, 5],
                    lpf: [5000, 1.1]
                  }
                },
                reverb: {
                  room: 1,
                  damp: 0.4,
                  mix: 0.55
                }
              }
            }, {
              pad: 16,
              src: '/sounds/additiv/16.wav',
              keyCode: 190
            }
          ]
        }
      }
    };
  });

}).call(this);
