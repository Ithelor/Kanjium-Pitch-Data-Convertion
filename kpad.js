// Conversion script of Kanjium pitch accent data for Japanese Pitch Accent anki addon (148002038).
//
// The original version allowed multiple patterns in the pitch column. Most commented code lines refer to this.
// Max number of patterns in the pitch column has been limited to one since the targeted algorithm somehow
//  doesn't seem to be working with this specific data structure despite it being similar to the original.
//
// Once a solution is found the rest of the patterns come back to the column.

const
    FileStream = require('fs'),
    ReadLine = require('readline'),
    wanakana = require("wanakana");

    readStream = FileStream.createReadStream('accents.txt'),
    writeStream = FileStream.createWriteStream('user_pitchdb.csv'),
    readLine = ReadLine.createInterface({ input: readStream, output: writeStream });

readLine.on('line', function(line) {

    var splitter = line.split('\t'),
        expression = splitter[0],
        reading = splitter[1],
        pitch_splitter = splitter[2].split(','),

        pitchArray = new Array(),
        excess = 0;

        // The targeted algorythm requires 'reading' column to not be empty.
        // Fires on kana-only expressions.
        if (!reading) reading = expression;

        const combiners = ['ゃ', 'ゅ', 'ょ', 'ぁ', 'ぃ', 'ぅ', 'ぇ', 'ぉ', 'ャ', 'ュ', 'ョ', 'ァ', 'ィ', 'ゥ', 'ェ', 'ォ'];
        combiners.forEach(combiner => excess += reading.split(combiner).length - 1)

    // for (var i = 0; i < pitch_splitter.length; i++) {

        var count = 0, 
            pitch_final = '';
            
        let dropped = false;

        // resolving heiban
        // if (pitch_splitter[i] == 0) {
        if (pitch_splitter[0] == 0) {

                pitch_final += 'L';
                count++;

                while (count <= reading.length - excess) {

                    pitch_final += 'H';
                    count++;
                }
        }
        // resolving atamadaka
        // else if (pitch_splitter[i] == 1) {
        else if (pitch_splitter[0] == 1) {

            pitch_final += 'H';
            count++;

            while (count <= reading.length - excess) {

                pitch_final += 'L';
                count++;
            }
        }
        // resolving nakadaka with the drop on the 2nd mora
        // else if (pitch_splitter[i] == 2) {
        else if (pitch_splitter[0] == 2) {

            pitch_final += 'LH';
            count += 2;

            while (count <= reading.length - excess) {

                pitch_final += 'L';
                count++;
            }
        }
        // resolving odaka
        // else if (pitch_splitter[i] == reading.length - excess) {
        else if (pitch_splitter[0] == reading.length - excess) {

            pitch_final += 'L';
            count++;

            while (count < reading.length - excess) {

                pitch_final += 'H';
                count++;
            }
            if (count == reading.length - excess)
                pitch_final += 'L';
                count++;
        }
        // resolving the rest
        else {

            pitch_final += 'LH';
            count += 2;

            while (count <= reading.length - excess) {

                count++;

                if (count == pitch_splitter[0]) {

                    pitch_final += 'H';
                    dropped = true;
                }
                else if (dropped == false) pitch_final += 'H';
                else pitch_final += 'L';
            }
        }
        
        pitchArray.push(pitch_final);
    // }
    
    writeStream.write(expression + '\t' + reading + '\t' + pitchArray.toString() + '\n');
});