exports.json = `{
    "block": "page",
    "content": [
        {
          "block": "text",
          "mods": {
              "type": "h3"
          },
          "content": "header"
        },
        {
            "block": "page",
            "elem": "section",
            "content": [
                {
                    "block": "page",
                    "elem": "content",
                    "content": [
                        {
                            "block": "text",
                            "mods": {
                                "type": "h1"
                            },
                            "content": "header"
                        },
                        {
                            "block": "text",
                            "mods": {
                                "type": "h1"
                            },
                            "content": "header"
                        },
                        {
                            "block": "text",
                            "mods": {
                                "type": "h2"
                            },
                            "content": "header"
                        },
                        {
                            "block": "container",
                            "content": {
                                "block": "text",
                                "mods": {
                                    "type": "h1"
                                },
                                "content": "header"
                            }
                        },
                        {
                          "block": "container",
                          "content": {
                              "block": "text",
                              "mods": {
                                  "type": "h1"
                              },
                              "content": "header"
                          }
                      }
                    ]
                }
            ]
        }
    ]
  }`;

exports.errorsPrediction = [
  {
    code: 'TEXT.SEVERAL_H1',
    error: 'Заголовок первого уровня (блок text с модификатором type h1)на странице должен быть единственным',    
    location: { start: { column: 25, line: 26 }, end: { column: 26, line: 32 } },
  },
  {
    code: 'TEXT.INVALID_H3_POSITION',
    error: 'Заголовок третьего уровня (блок text с модификатором type h3)не может находиться перед заголовком второго уровня на том же или более глубокомSуровне вложенности',
    location: { start: { column: 9, line: 4 }, end: { column: 10, line: 10 } },
  },
  {
    code: 'TEXT.SEVERAL_H1',
    error: 'Заголовок первого уровня (блок text с модификатором type h1)на странице должен быть единственным',    
    location: { start: { column: 40, line: 42 }, end: { column: 30, line: 48 } },
  },
  {
    code: 'TEXT.INVALID_H2_POSITION',
    error: 'Заголовок второго уровня (блок text с модификатором type h2)не может находиться перед заголовком первого уровня на том же или более глубоком уровне вложенности',
    location: { start: { column: 25, line: 33 }, end: { column: 26, line: 39 } },
  },
  {
    code: 'TEXT.SEVERAL_H1',
    error: 'Заголовок первого уровня (блок text с модификатором type h1)на странице должен быть единственным',    
    location: { start: { column: 38, line: 52 }, end: { column: 28, line: 58 } },
  },
];
