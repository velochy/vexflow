chord_charts = [
    {
      name: "A",
      chord: [[1, 0], [2, 2], [3, 2], [4, 2], [5, 0], [6, "x"]],
      position: 0,
      bars: []
    },
    {
      name: "Am",
      chord: [[1, 0], [2, 1], [3, 2], [4, 2], [5, 0], [6, "x"]],
      position: 0,
      bars: []
    },
    {
      name: "A7",
      chord: [[1, 0], [2, 2], [3, 0], [4, 2], [5, 0], [6, "x"]],
      position: 0,
      bars: []
    },
    {
      name: "Am7",
      chord: [[1, 0], [2, 1], [3, 0], [4, 2], [5, 0], [6, "x"]],
      position: 0,
      bars: []
    },
    {
      name: "B",
      chord: [[2, 4], [3, 4], [4, 4], [6, "x"]],
      position: 0,
      bars: [{from_string: 5, to_string: 1, fret: 2}]
    },
     {
      name: "B7",
      chord: [[1, 2], [2, 0], [3, 2], [4, 1], [5, 2], [6, "x"]],
      position: 0,
      bars: []
    },
    {
      name: "Bm",
      chord: [[2, 3], [3, 4], [4, 4], [6, "x"]],
      position: 0,
      bars: [{from_string: 5, to_string: 1, fret: 2}]
    },
    {
      name: "C",
      chord: [[1, 0], [2, 1], [3, 0], [4, 2], [5, 3], [6, "x"]],
      position: 0,
      bars: []
    },
    {
      name: "Cmaj7",
      chord: [[1, 0], [2, 0], [3, 0], [4, 2], [5, 3], [6, "x"]],
      position: 0,
      bars: []
    },
    {
      name: "C7",
      chord: [[1, 0], [2, 1], [3, 3], [4, 2], [5, 3], [6, "x"]],
      position: 0,
      bars: []
    },
    {
      name: "D",
      chord: [[1, 2], [2, 3], [3, 2], [4, 0], [5, "x"], [6, "x"]],
      position: 0,
      bars: []
    },
     {
      name: "Dm",
      chord: [[1, 1], [2, 3], [3, 2], [4, 0], [5, "x"], [6, "x"]],
      position: 0,
      bars: []
    },
     {
      name: "Dm7",
      chord: [[1, 1], [2, 1], [3, 2], [4, 0], [5, "x"], [6, "x"]],
      position: 0,
      bars: [{from_string: 2, to_string: 1, fret: 1}]
    },
      {
      name: "D7",
      chord: [[1, 2], [2, 1], [3, 2], [4, 0], [5, "x"], [6, "x"]],
      position: 0,
      bars: []
    },
      {
      name: "Dsus4",
      chord: [[1, 3], [2, 3], [3, 2], [4, 0], [5, "x"], [6, "x"]],
      position: 0,
      bars: []
    },
    {
      name: "E",
      chord: [[1, 0], [2, 0], [3, 1], [4, 2], [5, 2], [6, 0]],
      position: 0,
      bars: []
    },
	{
      name: "Em",
      chord: [[1, 0], [2, 0], [3, 0], [4, 2], [5, 2], [6, 0]],
      position: 0,
      bars: []
    }, 
      {
      name: "E7",
      chord: [[1, 0], [2, 0], [3, 1], [4, 0], [5, 2], [6, 0]],
      position: 0,
     bars: []
    },
    {
      name: "Em7",
      chord: [[1, 0], [2, 0],[3, 0], [4, 0], [5, 2], [6, 0]],
      position: 0,
      bars: []
    },
    {
    name: "F",
    chord: [[3, 2], [4, 3], [5, 3]],
    bars: [{from_string: 6, to_string: 1, fret: 1}]
    },
	{
      name: "G",
      chord: [[1, 3], [2, 0], [3, 0], [4, 0], [5, 2], [6, 3]],
      position: 0,
      bars: []
    },
    {
    name: "Gm",
    chord: [[4, 5], [5, 5]],
    bars: [{from_string: 6, to_string: 1, fret: 3}]
    },
    {
      name: "G7",
      chord: [[1, 1], [2, 0], [3, 0], [4, 0], [5, 2], [6, 3]],
      position: 0,
      bars: []
    },
    {
    name: "F#m",
    chord: [[4, 4], [5, 4]],
    bars: [{from_string: 6, to_string: 1, fret: 2}]
    },
    {
    name: "F#",
    chord: [[3, 3], [4, 4], [5, 4]],
    bars: [{from_string: 6, to_string: 1, fret: 2}]
    }
   
    ];

cc_index = {};
chord_charts.forEach(function(cc) {cc.tuning=[]; cc_index[cc.name]=cc;});

