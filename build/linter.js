// I WISH TO SEE COMPLETE INFO
require("util").inspect.defaultOptions.depth = null;

// TEST DATA
const str = `{
    "block": "warning",
    "content": [
        {
            "block": "placeholder",
            "mods": { "size": "m" }
        },
        {
            "block": "text",
            "mods": { "type": "h1" }
        }, 
        {
            "block": "text",
            "mods": { "type": "h1" }
        },   
        {
            "block": "text",
            "mods": { "type": "h1" }
        },   
        {
            "elem": "content",
            "content": [
                {
                    "block": "text",
                    "mods": { "size": "m" }
                },
                {
                    "block": "text",
                    "mods": { "size": "l" }
                }
            ]
        }
    ]
    }`;
  

// JSON-SOURCE-MAP

'use strict';

let escapedChars = {
  'b': '\b',
  'f': '\f',
  'n': '\n',
  'r': '\r',
  't': '\t',
  '"': '"',
  '/': '/',
  '\\': '\\'
};

let A_CODE = 'a'.charCodeAt();


parse = (source, _, options) => {
  let pointers = {};
  let line = 0;
  let column = 0;
  let pos = 0;
  let bigint = options && options.bigint && typeof BigInt != 'undefined';
  return {
    data: _parse('', true),
    pointers: pointers
  };

  function _parse(ptr, topLevel) {
    whitespace();
    let data;
    map(ptr, 'value');
    let char = getChar();
    switch (char) {
      case 't': read('rue'); data = true; break;
      case 'f': read('alse'); data = false; break;
      case 'n': read('ull'); data = null; break;
      case '"': data = parseString(); break;
      case '[': data = parseArray(ptr); break;
      case '{': data = parseObject(ptr); break;
      default:
        backChar();
        if ('-0123456789'.indexOf(char) >= 0)
          data = parseNumber();
        else
          unexpectedToken();
    }
    map(ptr, 'valueEnd');
    whitespace();
    if (topLevel && pos < source.length) unexpectedToken();
    return data;
  }

  function whitespace() {
    loop:
      while (pos < source.length) {
        switch (source[pos]) {
          case ' ': column++; break;
          case '\t': column += 4; break;
          case '\r': column = 0; break;
          case '\n': column = 0; line++; break;
          default: break loop;
        }
        pos++;
      }
  }

  function parseString() {
    let str = '';
    let char;
    while (true) {
      char = getChar();
      if (char == '"') {
        break;
      } else if (char == '\\') {
        char = getChar();
        if (char in escapedChars)
          str += escapedChars[char];
        else if (char == 'u')
          str += getCharCode();
        else
          wasUnexpectedToken();
      } else {
        str += char;
      }
    }
    return str;
  }

  function parseNumber() {
    let numStr = '';
    let integer = true;
    if (source[pos] == '-') numStr += getChar();

    numStr += source[pos] == '0'
              ? getChar()
              : getDigits();

    if (source[pos] == '.') {
      numStr += getChar() + getDigits();
      integer = false;
    }

    if (source[pos] == 'e' || source[pos] == 'E') {
      numStr += getChar();
      if (source[pos] == '+' || source[pos] == '-') numStr += getChar();
      numStr += getDigits();
      integer = false;
    }

    let result = +numStr;
    return bigint && integer && (result > Number.MAX_SAFE_INTEGER || result < Number.MIN_SAFE_INTEGER)
            ? BigInt(numStr)
            : result;
  }

  function parseArray(ptr) {
    whitespace();
    let arr = [];
    let i = 0;
    if (getChar() == ']') return arr;
    backChar();

    while (true) {
      let itemPtr = ptr + '/' + i;
      arr.push(_parse(itemPtr));
      whitespace();
      let char = getChar();
      if (char == ']') break;
      if (char != ',') wasUnexpectedToken();
      whitespace();
      i++;
    }
    return arr;
  }

  function parseObject(ptr) {
    whitespace();
    let obj = {};
    if (getChar() == '}') return obj;
    backChar();

    while (true) {
      let loc = getLoc();
      if (getChar() != '"') wasUnexpectedToken();
      let key = parseString();
      let propPtr = ptr + '/' + escapeJsonPointer(key);
      mapLoc(propPtr, 'key', loc);
      map(propPtr, 'keyEnd');
      whitespace();
      if (getChar() != ':') wasUnexpectedToken();
      whitespace();
      obj[key] = _parse(propPtr);
      whitespace();
      let char = getChar();
      if (char == '}') break;
      if (char != ',') wasUnexpectedToken();
      whitespace();
    }
    return obj;
  }

  function read(str) {
    for (let i=0; i<str.length; i++)
      if (getChar() !== str[i]) wasUnexpectedToken();
  }

  function getChar() {
    checkUnexpectedEnd();
    let char = source[pos];
    pos++;
    column++; // new line?
    return char;
  }

  function backChar() {
    pos--;
    column--;
  }

  function getCharCode() {
    let count = 4;
    let code = 0;
    while (count--) {
      code <<= 4;
      let char = getChar().toLowerCase();
      if (char >= 'a' && char <= 'f')
        code += char.charCodeAt() - A_CODE + 10;
      else if (char >= '0' && char <= '9')
        code += +char;
      else
        wasUnexpectedToken();
    }
    return String.fromCharCode(code);
  }

  function getDigits() {
    let digits = '';
    while (source[pos] >= '0' && source[pos] <= '9')
      digits += getChar();

    if (digits.length) return digits;
    checkUnexpectedEnd();
    unexpectedToken();
  }

  function map(ptr, prop) {
    mapLoc(ptr, prop, getLoc());
  }

  function mapLoc(ptr, prop, loc) {
    pointers[ptr] = pointers[ptr] || {};
    pointers[ptr][prop] = loc;
  }

  function getLoc() {
    return {
      line: line + 1,
      column: column + 1,
    };
  }

  function unexpectedToken() {
    throw new SyntaxError('Unexpected token ' + source[pos] + ' in JSON at position ' + pos);
  }

  function wasUnexpectedToken() {
    backChar();
    unexpectedToken();
  }

  function checkUnexpectedEnd() {
    if (pos >= source.length)
      throw new SyntaxError('Unexpected end of JSON input');
  }
};


exports.stringify = function (data, _, options) {
  if (!validType(data)) return;
  let wsLine = 0;
  let wsPos, wsColumn;
  let whitespace = typeof options == 'object'
                    ? options.space
                    : options;
  switch (typeof whitespace) {
    case 'number':
      let len = whitespace > 10
                  ? 10
                  : whitespace < 0
                    ? 0
                    : Math.floor(whitespace);
      whitespace = len && repeat(len, ' ');
      wsPos = len;
      wsColumn = len;
      break;
    case 'string':
      whitespace = whitespace.slice(0, 10);
      wsPos = 0;
      wsColumn = 0;
      for (let j=0; j<whitespace.length; j++) {
        let char = whitespace[j];
        switch (char) {
          case ' ': wsColumn++; break;
          case '\t': wsColumn += 4; break;
          case '\r': wsColumn = 0; break;
          case '\n': wsColumn = 0; wsLine++; break;
          default: throw new Error('whitespace characters not allowed in JSON');
        }
        wsPos++;
      }
      break;
    default:
      whitespace = undefined;
  }

  let json = '';
  let pointers = {};
  let line = 0;
  let column = 0;
  let pos = 0;
  let es6 = options && options.es6 && typeof Map == 'function';
  _stringify(data, 0, '');
  return {
    json: json,
    pointers: pointers
  };

  function _stringify(_data, lvl, ptr) {
    map(ptr, 'value');
    switch (typeof _data) {
      case 'number':
      case 'bigint':
      case 'boolean':
        out('' + _data); break;
      case 'string':
        out(quoted(_data)); break;
      case 'object':
        if (_data === null) {
          out('null');
        } else if (typeof _data.toJSON == 'function') {
          out(quoted(_data.toJSON()));
        } else if (Array.isArray(_data)) {
          stringifyArray();
        } else if (es6) {
          if (_data.constructor.BYTES_PER_ELEMENT)
            stringifyArray();
          else if (_data instanceof Map)
            stringifyMapSet();
          else if (_data instanceof Set)
            stringifyMapSet(true);
          else
            stringifyObject();
        } else {
          stringifyObject();
        }
    }
    map(ptr, 'valueEnd');

    function stringifyArray() {
      if (_data.length) {
        out('[');
        let itemLvl = lvl + 1;
        for (let i=0; i<_data.length; i++) {
          if (i) out(',');
          indent(itemLvl);
          let item = validType(_data[i]) ? _data[i] : null;
          let itemPtr = ptr + '/' + i;
          _stringify(item, itemLvl, itemPtr);
        }
        indent(lvl);
        out(']');
      } else {
        out('[]');
      }
    }

    function stringifyObject() {
      let keys = Object.keys(_data);
      if (keys.length) {
        out('{');
        let propLvl = lvl + 1;
        for (let i=0; i<keys.length; i++) {
          let key = keys[i];
          let value = _data[key];
          if (validType(value)) {
            if (i) out(',');
            let propPtr = ptr + '/' + escapeJsonPointer(key);
            indent(propLvl);
            map(propPtr, 'key');
            out(quoted(key));
            map(propPtr, 'keyEnd');
            out(':');
            if (whitespace) out(' ');
            _stringify(value, propLvl, propPtr);
          }
        }
        indent(lvl);
        out('}');
      } else {
        out('{}');
      }
    }

    function stringifyMapSet(isSet) {
      if (_data.size) {
        out('{');
        let propLvl = lvl + 1;
        let first = true;
        let entries = _data.entries();
        let entry = entries.next();
        while (!entry.done) {
          let item = entry.value;
          let key = item[0];
          let value = isSet ? true : item[1];
          if (validType(value)) {
            if (!first) out(',');
            first = false;
            let propPtr = ptr + '/' + escapeJsonPointer(key);
            indent(propLvl);
            map(propPtr, 'key');
            out(quoted(key));
            map(propPtr, 'keyEnd');
            out(':');
            if (whitespace) out(' ');
            _stringify(value, propLvl, propPtr);
          }
          entry = entries.next();
        }
        indent(lvl);
        out('}');
      } else {
        out('{}');
      }
    }
  }

  function out(str) {
    column += str.length;
    pos += str.length;
    json += str;
  }

  function indent(lvl) {
    if (whitespace) {
      json += '\n' + repeat(lvl, whitespace);
      line++;
      column = 0;
      while (lvl--) {
        if (wsLine) {
          line += wsLine;
          column = wsColumn;
        } else {
          column += wsColumn;
        }
        pos += wsPos;
      }
      pos += 1; // \n character
    }
  }

  function map(ptr, prop) {
    pointers[ptr] = pointers[ptr] || {};
    pointers[ptr][prop] = {
      line: line +1,
      column: column +1,
    };
  }

  function repeat(n, str) {
    return Array(n + 1).join(str);
  }
};


let VALID_TYPES = ['number', 'bigint', 'boolean', 'string', 'object'];
function validType(data) {
  return VALID_TYPES.indexOf(typeof data) >= 0;
}


let ESC_QUOTE = /"|\\/g;
let ESC_B = /[\b]/g;
let ESC_F = /\f/g;
let ESC_N = /\n/g;
let ESC_R = /\r/g;
let ESC_T = /\t/g;

function quoted(str) {
  str = str.replace(ESC_QUOTE, '\\$&')
           .replace(ESC_F, '\\f')
           .replace(ESC_B, '\\b')
           .replace(ESC_N, '\\n')
           .replace(ESC_R, '\\r')
           .replace(ESC_T, '\\t');
  return '"' + str + '"';
}


let ESC_0 = /~/g;
let ESC_1 = /\//g;
function escapeJsonPointer(str) {
  return str.replace(ESC_0, '~0')
            .replace(ESC_1, '~1');
}


// THIS IS MY PART OF CODE

let rules = {
    "warning_text_size": {
        "code": 'WARNING.TEXT_SIZES_SHOULD_BE_EQUAL',
        "error": 'Тексты в блоке warning должны быть одного размера'
    },
    "warning_button_size": {
        "code": 'WARNING.INVALID_BUTTON_SIZE',
        "error": "Размер кнопки блока warning должен быть на 1 шаг больше эталонного (например, для размера l таким значением будет xl)"
    },
    "warning_button_place": {
        "code": 'WARNING.INVALID_BUTTON_POSITION',
        "error": 'Блок button в блоке warning не может находиться перед блоком placeholder на том же или более глубоком уровне вложенности'
    },
    "warning_placeholder_size": {
        "code": 'WARNING.INVALID_PLACEHOLDER_SIZE',
        "error": 'Допустимые размеры для блока placeholder в блоке warning (значение модификатора size): s, m, l'
    },
    "text_several_h1": {
        "code": 'TEXT.SEVERAL_H1',
        "error": 'Заголовок первого уровня (блок text с модификатором type h1) на странице должен быть единственным'
    },
    "text_h2_position": {
        "code": 'TEXT.INVALID_H2_POSITION',
        "error": 'Заголовок второго уровня (блок text с модификатором type h2) не может находиться перед заголовком первого уровня на том же или более глубоком уровне вложенности'
    },
    "text_h3_position": {
        "code": 'TEXT.INVALID_H3_POSITION',
        "error": 'Заголовок третьего уровня (блок text с модификатором type h3) не может находиться перед заголовком второго уровня на том же или более глубоком уровне вложенности'
    }
    // Тут еще будет что-то по гридам
}

let findLocation = (pointers, path) => {
    let location =  {};
    for (let point in pointers) {
        if(point === path) {
           location.start = {
               "column": pointers[point].value.column + 1,
               "line": pointers[point].value.line + 1
           };

           location.end = {
               "column": pointers[point].valueEnd.column + 1,
               "line": pointers[point].valueEnd.line + 1,
           };
        };
    };

   return location;
};

let search = (obj, err) => {
    let titleCounter = 0;
    let pointers = obj.pointers;
    let object   = obj.data;
    let text_several_h1;


    let iterate = (obj, map = "") => {
        if (Array.isArray(obj)) {
            obj.forEach((e, i) => {
                iterate(e, `${map}/${i}`);
            });
            return;
        };
    
        for (const el in obj) {
            const path = `${map}/${el}`;
            if (obj[el] === "warning") {
                
            }
        
            if (el === "content") {
             iterate(obj[el], path);
           
            }
            if (el === "mods" && obj[el].type === "h1") {
                titleCounter++;
                if(titleCounter > 1) {
                    rules.text_several_h1.location = findLocation(pointers,path);
                    text_several_h1 = rules.text_several_h1;
                };
            };
        };
    };
    iterate(object);
    err.push(text_several_h1);
    return err;
};


let linter = (str) => {
  let errors = [];
  const obj = parse(str);
  errors = search(obj, errors)
  return errors;
};

console.log(linter(str));
linter(str);