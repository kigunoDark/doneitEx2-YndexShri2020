exports.json = `{
    "block": "grid",
    "mods": {
        "m-columns": "10"
    },
 
    "content": [
        {
            "block": "grid",
            "elem": "fraction",
            "elemMods": {
                "m-col": "2"
            },
            "content": [
                {
                    "block": "payment"
                }
            ]
        },
        {
            "block": "grid",
            "elem": "fraction",
            "elemMods": {
                "m-col": "8"
            },
            "content": [
                {
                    "block": "offer"
                }
            ]
        }
    ]
 }
`;
exports.errorsPrediction = [
  {
    code: 'GRID.TOO_MUCH_MARKETING_BLOCKS',
    error: 'Слишком много макркетинговых блоков в Grid',
    location: { start: { column: 1, line: 1 }, end: { column: 3, line: 33 } },
  },
];
