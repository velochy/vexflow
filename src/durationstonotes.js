// Calculate the appropriate rhythmic notation
// based on note durations and emphasis pattern
// Margus Niitsoo <velochy@gmail.com>
//
// Copyright Margus Niitsoo 2013
//
// Requires... umm... everything?

// printRhythmFromDurations - print a line of rhythm notation given durations
// durations is a list of durations such as [1,0.5,0.5,1,1]
// beat_boundaries describes how the bar is to be divided rhytmically
//      for instance [2,2] or [1.5,1.5,1] or [1,1,1,1]
//      (the latter is equivalent to [1] as the pattern is taken as repeating)
// bar duration is the lenght of a bar in beats, most commonly 4
// x,y are top left coordinates of the area
// width is the width of the area. Height is fixed (around 60) 

// NB! This is currently built for a very specific use case (for noting just rhythm) but most of this code should be straightforward to generalise for anyone interested. 

Vex.Flow.printRhythmFromDurations = function(durations,beat_boundaries,bar_duration,x,y,width,ctx) {

  var TICKS_PER_PULSE = 8*3*5;  // Because float arithmetic is a pain in the behind, turn the durations into integers
  var durInTicks = []; durations.forEach(function(d) { durInTicks.push(Math.round(d*TICKS_PER_PULSE)); });
  var barInTicks = Math.round(bar_duration*TICKS_PER_PULSE);
  var boundsInTicks = [];  beat_boundaries.forEach(function(d) { boundsInTicks.push(Math.round(d*TICKS_PER_PULSE)); });


  note_names = ["w","h","q","8","16","32"];
  function getSym(x) {
    var i=0;
    for (var d=4*TICKS_PER_PULSE;d>x;d/=2) i++;

    var n = note_names[i];  var ds = d;
    while ( x>=ds+0.5*d ) {
        d*=0.5; ds+=d; n+="d";
    }

    return { name: n, duration: ds };
  }

  function createNote(name) {
    var note = new Vex.Flow.StaveNote({ keys: ["f/4"], duration: name });
    var ndots = name.match(/d/g);
    ndots=(ndots==null?0:ndots.length);
    for(var i=0; i<ndots; i++) note.addDotToAll();
    return note;
  }

  function createTie(n1,n2) {
    return new Vex.Flow.StaveTie({
            first_note: n1,
            last_note: n2,
            first_indices: 0,
            last_indices: 0
        });
  }

  function createBeam(vfnotes) {
    return new Vex.Flow.Beam(vfnotes,true);
  }

  var nextBound = boundsInTicks[0];
  var prevBound = 0;
  var nextBoundIndex = 0;
 
  var sum = 0; // Duration up to the current point
  var vfnotes = []; // The notes to be rendered
  var beatNotes = []; // The on-beat notes (for returning later)
  var ties = []; // Note ties
  var beams =[]; // Note beams 
  var cbeam = []; // List of notes under the current beam
  var barBeginners = []; // Notes at the beginning of bars

  // Iterate over all durations
  for(var i=0;i<durInTicks.length;i++) { 
      var clen = durInTicks[i];
      var cties = [];

      // Choose the notes that would compose the duration
      while (clen>0) {

          // Respect bar and (to lesser degree) beat boundaries
          var sym = getSym(Math.min(clen, // Never take a note longer than required to complete the current duration
                    sum>prevBound? // Already mid-beat?
                        nextBound-sum: // Yes - respect the beat boundary
                        barInTicks-(sum%barInTicks) // No - only respect bar boundary
                ));

          cties.push(vfnotes.length);
          vfnotes.push(createNote(sym["name"]));

          // If this is the first note for the duration, mark it down
          if (beatNotes.length<=i) { beatNotes.push(vfnotes[vfnotes.length-1]); }
    
          // If first note in the bar, remmember it so the barline could be drawn later
          if (sum>0 && sum%barInTicks == 0) { barBeginners.push(vfnotes.length-1); }

          sum += sym["duration"];
          clen -= sym["duration"];
 
          // Is a beam required?
          if (sym["duration"]<TICKS_PER_PULSE) {
              cbeam.push(vfnotes[vfnotes.length-1]);
          }   

          // Did we cross a beat boundary (in which case a beam should end here)
          if (cbeam.length>0 && (sum==nextBound || sym["duration"]>=TICKS_PER_PULSE)) {
            if (cbeam.length>1) beams.push(createBeam(cbeam));
            cbeam=[];
          }

          // If we crossed an emphasis boundary, increment the emphasis counter
          if (sum >= nextBound) {
            prevBound = nextBound;
            nextBoundIndex = (nextBoundIndex+1)%boundsInTicks.length;
            nextBound += boundsInTicks[nextBoundIndex];
          }
      }
      // If we decomposed the duration to more than one note, tie them together
      if (cties.length>1) 
          for( var j=1; j<cties.length; j++) {
              ties.push(createTie(vfnotes[cties[j-1]],vfnotes[cties[j]]));
          }
  } 

  var stave = new Vex.Flow.Stave(x, y, width,{num_lines:0,space_below_staff_ln:0,space_above_staff_ln:1,bottom_text_position:0,top_text_position:0});
  stave.setContext(ctx);

  // Create a voice in 4/4
  var voice = new Vex.Flow.Voice({
    num_beats: Math.round(durations.reduce(function(prev,cur) { return prev+cur; })),
    beat_value: 4,
    resolution: Vex.Flow.RESOLUTION
  });

  // Add notes to voice
  voice.addTickables(vfnotes);


  // Format and justify the notes to 500 pixels
  var formatter = new Vex.Flow.Formatter().
    joinVoices([voice]).formatToStave([voice],stave);


  // Render voice
  voice.draw(ctx, stave);
  
  // Draw beams
  beams.forEach(function(beam){
    beam.setContext(ctx).draw();
  });

  // Draw ties
  ties.forEach(function(tie){
    tie.setContext(ctx).draw();
  });
 

  // Draw bar lines
  barBeginners.forEach(function(nid) { 
      var delta = Math.min((vfnotes[nid].getAbsoluteX()-vfnotes[nid-1].getAbsoluteX()-vfnotes[nid-1].glyph.head_width)/2, 5);
      ctx.fillRect(Math.round(vfnotes[nid].getAbsoluteX())-delta,y+5,2,45);
  });
  ctx.fillRect(x+width,y+5,2,45);


  var note_positions=[];
  beatNotes.forEach(function(t) { note_positions.push(Math.round(t.getAbsoluteX())); });

  return note_positions;
};

