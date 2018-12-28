import {file_get_contents} from "locutus/php/filesystem";

class Helper {
    is_readable(file) {
        //http://phpjs.org/functions/file_get_contents:400
        var _file = file_get_contents(file);
        if (_file) {
            var _length1 = _file.replace("<h1>Object not found!</h1>", "LOL", _file);
            var _length2 = _file;
            return _length1.length === _length2.length;

        }
    }
}

module.exports = Helper;