/*
 * Vex Guitar Chord Chart Renderer.
 * Mohit Muthanna Cheppudira -- http://0xfe.blogspot.com
 * Modified to work on canvas by Margus Niitsoo
 */

// Functions to emulate Raphael on canvas.

CanvasRenderingContext2D.prototype.vexLine = function(x, y, new_x, new_y) {
  this.beginPath();
  this.moveTo(x,y);
  this.lineTo(new_x,new_y);
  this.stroke();
  return this;
}

CanvasRenderingContext2D.prototype.circle = function(x,y,r) {
  this.beginPath();
  this.arc(x,y,r,2*Math.PI,false);
  this.stroke();

  return this;

} 

CanvasRenderingContext2D.prototype.rect = function(x,y,w,h,r) {
  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;
  this.beginPath();
  this.moveTo(x+r, y);
  this.arcTo(x+w, y,   x+w, y+h, r);
  this.arcTo(x+w, y+h, x,   y+h, r);
  this.arcTo(x,   y+h, x,   y,   r);
  this.arcTo(x,   y,   x+w, y,   r);
  this.closePath();
  this.stroke();

  return this;
} 

CanvasRenderingContext2D.prototype.text = function(x,y,txt) {
  this.fillText(txt, x, y);
  return this;
} 

CanvasRenderingContext2D.prototype.attr = function(a,val)  {
  if (a=="fill") {
      this.save();
      this.fillStyle = val;
      this.fill();
      this.restore();
  }
  else if (a=="stroke-width") {
      this.save();
      this.lineWidth = val;
      this.stroke();
      this.restore();
  }
  
  return this;
}


// Chord functionality 

ChordBox = function(canvas, x, y, width, height) {
  this.canvas = canvas;
  this.x = x;
  this.y = y;

  this.width = (!width) ? 100 : width;
  this.height = (!height) ? 100 : height;
  this.num_strings = 6;
  this.num_frets = 5;

  this.metrics = {
    circle_radius: this.height / 28,
    text_shift_x: this.width / 29,
    text_shift_y: this.height / 29,
    font_size: Math.ceil(this.width / 9),
    bar_shift_x: this.width / 28,
    bridge_stroke_width: Math.ceil(this.height / 36),
    chord_fill: "#404040"
  };

  this.spacing = this.width / (this.num_strings);
  this.fret_spacing = (this.height-this.metrics.bridge_stroke_width)  / (this.num_frets + 2);


  this.metrics.circle_radius=0.8*(this.fret_spacing/2);
  this.metrics.font_size = this.metrics.circle_radius*2;

  // Add room on sides for finger positions on 1. and 6. string
  this.x += this.spacing/2;
  this.y += this.fret_spacing + this.metrics.bridge_stroke_width;

  // Content
  this.position = 0;
  this.position_text = 0;
  this.chord = [];
  this.bars = [];
}

ChordBox.prototype.setChord = function(chord, position, bars, position_text, tuning) {
  this.chord = chord;
  this.position = position || 0;
  this.position_text = position_text || 0;
  this.bars = bars || [];
  this.tuning =  tuning || ["E", "A", "D", "G", "B", "E"]; 
  if (tuning == []) 
      this.fret_spacing = (this.height-this.metrics.bridge_stroke_width)  / (this.num_frets + 1);
  return this;
}

ChordBox.prototype.setPositionText = function(position) {
  this.position_text = position;
  return this;
}

ChordBox.prototype.draw = function() {
  var spacing = this.spacing;
  var fret_spacing = this.fret_spacing;

  this.canvas.save();
  this.canvas.font = this.font_size+"pt Arial";
  this.canvas.textAlign = "center";

  // Draw guitar bridge
  if (this.position <= 1) {
    this.canvas.vexLine(this.x, this.y - this.metrics.bridge_stroke_width/2,
                       this.x + (spacing * (this.num_strings - 1)),
                       this.y - this.metrics.bridge_stroke_width/2 ).
      attr("stroke-width", this.metrics.bridge_stroke_width);
  } else {
    // Draw position number
    this.canvas.text(this.x - (this.spacing / 2) - this.metrics.text_shift_x,
                    this. y + (this.fret_spacing / 2) +
                    this.metrics.text_shift_y +
                    (this.fret_spacing * this.position_text),
                    this.position).attr("font-size", this.metrics.font_size);
  }

  // Draw strings
  for (var i = 0; i < this.num_strings; ++i) {
    this.canvas.vexLine(this.x + (spacing * i), this.y,
      this.x + (spacing * i),
      this.y + (fret_spacing * (this.num_frets)));
  }

  // Draw frets
  for (var i = 0; i < this.num_frets + 1; ++i) {
    this.canvas.vexLine(this.x, this.y + (fret_spacing * i),
      this.x + (spacing * (this.num_strings - 1)),
      this.y + (fret_spacing * i));
  }

  // Draw tuning keys
  if (this.tuning!=[]) { 
      var tuning = this.tuning;
      for (var i = 0; i < tuning.length; ++i) {
        var t = this.canvas.text(
          this.x + (this.spacing * i),
          this.y +
          ((this.num_frets + 1) * this.fret_spacing),
          tuning[i]);
        t.attr("font-size", this.metrics.font_size);
      }
  }

  // Draw chord
  for (var i = 0; i < this.chord.length; ++i) {
    this.lightUp(this.chord[i][0], this.chord[i][1]);
  }

  // Draw bars
  for (var i = 0; i < this.bars.length; ++i) {
    this.lightBar(this.bars[i].from_string,
                  this.bars[i].to_string,
                  this.bars[i].fret);
  }

  this.canvas.restore();
}

ChordBox.prototype.lightUp = function(string_num, fret_num) {
  string_num = this.num_strings - string_num;

  var shift_position = 0;
  if (this.position == 1 && this.position_text == 1) {
    shift_position = this.position_text;
  }

  var mute = false;

  if (fret_num == "x") {
    fret_num = 0;
    mute = true;
  } 
  else {
      fret_num -= shift_position;
  }
 
  var x = this.x + (this.spacing * string_num);
  var y = this.y + (this.fret_spacing * (fret_num)) ;

  if (fret_num == 0) y -= this.metrics.bridge_stroke_width;
 
  if (!mute) {
    var c = this.canvas.circle(x, y-Math.floor(this.fret_spacing/2), this.metrics.circle_radius)
    if (fret_num > 0) c.attr("fill", this.metrics.chord_fill);
  } else {
    c = this.canvas.text(x, y-(this.fret_spacing-this.metrics.font_size)/2, "X").attr({"font-size": this.metrics.font_size});
  }

  return this;
}

ChordBox.prototype.lightBar = function(string_from, string_to, fret_num) {
  if (this.position == 1 && this.position_text == 1) {
    fret_num -= this.position_text;
  }

  string_from_num = this.num_strings - string_from;
  string_to_num = this.num_strings - string_to;

  var x = this.x + (this.spacing * string_from_num) - this.metrics.bar_shift_x;
  var x_to = this.x + (this.spacing * string_to_num) + this.metrics.bar_shift_x;

  var y = this.y + (this.fret_spacing * (fret_num - 1)) +
    (this.fret_spacing/2 - this.metrics.circle_radius );
  var y_to = this.y + (this.fret_spacing * (fret_num - 1)) +
    (this.fret_spacing/2 + this.metrics.circle_radius );

  this.canvas.rect(x, y, (x_to - x), (y_to - y), this.metrics.circle_radius).
    attr("fill", this.metrics.chord_fill);

  return this;
}

/* Two utility functions */

function createChordChartElement(chord_struct,w,h) {
  var chordcanvas = $('<canvas/>',{width:w,height:h});
  chordcanvas[0].width=w; chordcanvas[0].height=h;
  var canvas = chordcanvas[0].getContext('2d');

  var chord = new ChordBox(canvas, 0, 0, w, h);

  chord.setChord(
      chord_struct.chord,
      chord_struct.position,
      chord_struct.bars,
      chord_struct.position_text,
      chord_struct.tuning);
  chord.draw();

  return chordcanvas;
}

function createChordChartWithName(chord_struct,w,h) {
  var chordbox = $('<div>').addClass('chordbox').css({width:w+"px"});
  var chordname = $('<div>').addClass('chordname').css({fontSize: Math.floor(0.32*h)+"px", textAlign:"center", lineHeight:Math.floor(0.32*h)+"px"});

  chordbox.append(chordname);
  chordbox.append(createChordChartElement(chord_struct,w,0.68*h));
  chordname.append(chord_struct.name);

  return chordbox;
}
