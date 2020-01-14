exports.json = `{
    "block": "warning",
    "content": [
        {
            "block": "placeholder",
            "mods": { "size": "m" }
        },
        {
            "elem": "content",
            "content": [
                {
                    "block": "text",
                    "mods": { "size": "l" }
                },
                {
                    "block": "text",
                    "mods": { "size": "m" }
                },
                { "block": "button", "mods": { "size": "s" } },
                { "block": "placeholder", "mods": { "size": "xs" } }
            ]
        }
    ]
}`;

exports.errorsPrediction = [
  {
    code: 'WARNING.TEXT_SIZES_SHOULD_BE_EQUAL',
    error: 'Все тексты (блоки text) в блоке warning должны быть одного размера',
    location: { start: { column: 1, line: 1 }, end: { column: 2, line: 24 } },
  },
  {
    code: 'WARNING.INVALID_BUTTON_SIZE',
    error: 'Размер кнопки блока warning должен быть на 1 шаг больше текста(например, для размера l таким значением будет xl)',
    location: { start: { column: 17, line: 19 }, end: { column: 63, line: 19 } },
  },
  {
    code: 'WARNING.INVALID_BUTTON_POSITION',
    error: 'Блок button в блоке warning не может находиться перед блоком placeholderна том же или более глубоком уровне вложенности',
    location: { start: { column: 17, line: 19 }, end: { column: 63, line: 19 } },
  },
  {
    code: 'WARNING.INVALID_PLACEHOLDER_SIZE',
    error: 'Допустимые размеры для блока placeholder в блоке warning (значение модификатора size): s, m, l',      
    location: { start: { column: 17, line: 20 }, end: { column: 69, line: 20 } },
  },
];
