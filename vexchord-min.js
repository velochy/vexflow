CanvasRenderingContext2D.prototype.vexLine=function(b,c,a,d){this.beginPath();this.moveTo(b,c);this.lineTo(a,d);this.stroke();return this};CanvasRenderingContext2D.prototype.circle=function(b,c,a){this.beginPath();this.arc(b,c,a,2*Math.PI,false);this.stroke();return this};
CanvasRenderingContext2D.prototype.rect=function(b,c,a,d,e){if(a<2*e)e=a/2;if(d<2*e)e=d/2;this.beginPath();this.moveTo(b+e,c);this.arcTo(b+a,c,b+a,c+d,e);this.arcTo(b+a,c+d,b,c+d,e);this.arcTo(b,c+d,b,c,e);this.arcTo(b,c,b+a,c,e);this.closePath();this.stroke();return this};CanvasRenderingContext2D.prototype.text=function(b,c,a){this.fillText(a,b,c);return this};
CanvasRenderingContext2D.prototype.attr=function(b,c){if(b=="fill"){this.save();this.fill();this.restore()}else if(b=="stroke-width"){this.save();this.lineWidth=c;this.stroke();this.restore()}return this};
ChordBox=function(b,c,a,d,e){this.canvas=b;this.x=c;this.y=a;this.width=!d?100:d;this.height=!e?100:e;this.num_strings=6;this.num_frets=5;this.metrics={circle_radius:this.height/28,text_shift_x:this.width/29,text_shift_y:this.height/29,font_size:Math.ceil(this.width/9),bar_shift_x:this.width/28,bridge_stroke_width:Math.ceil(this.height/36),chord_fill:"#404040"};this.spacing=this.width/this.num_strings;this.fret_spacing=(this.height-this.metrics.bridge_stroke_width)/(this.num_frets+2);this.metrics.circle_radius=
0.8*(this.fret_spacing/2);this.metrics.font_size=this.metrics.circle_radius*2;this.x+=this.spacing/2;this.y+=this.fret_spacing+this.metrics.bridge_stroke_width;this.position_text=this.position=0;this.chord=[];this.bars=[]};ChordBox.prototype.setChord=function(b,c,a,d,e){this.chord=b;this.position=c||0;this.position_text=d||0;this.bars=a||[];this.tuning=e||["E","A","D","G","B","E"];if(e==[])this.fret_spacing=(this.height-this.metrics.bridge_stroke_width)/(this.num_frets+1);return this};
ChordBox.prototype.setPositionText=function(b){this.position_text=b;return this};
ChordBox.prototype.draw=function(){var b=this.spacing,c=this.fret_spacing;this.canvas.save();this.canvas.font=this.metrics.font_size+"pt Arial";this.canvas.textAlign="center";this.position<=1?this.canvas.vexLine(this.x,this.y-this.metrics.bridge_stroke_width/2,this.x+b*(this.num_strings-1),this.y-this.metrics.bridge_stroke_width/2).attr("stroke-width",this.metrics.bridge_stroke_width):this.canvas.text(this.x-this.spacing/2-this.metrics.text_shift_x,this.y+this.fret_spacing/2+this.metrics.text_shift_y+
this.fret_spacing*this.position_text,this.position).attr("font-size",this.metrics.font_size);for(var a=0;a<this.num_strings;++a)this.canvas.vexLine(this.x+b*a,this.y,this.x+b*a,this.y+c*this.num_frets);for(a=0;a<this.num_frets+1;++a)this.canvas.vexLine(this.x,this.y+c*a,this.x+b*(this.num_strings-1),this.y+c*a);if(this.tuning!=[]){b=this.tuning;for(a=0;a<b.length;++a)this.canvas.text(this.x+this.spacing*a,this.y+(this.num_frets+1)*this.fret_spacing,b[a]).attr("font-size",this.metrics.font_size)}for(a=
0;a<this.chord.length;++a)this.lightUp(this.chord[a][0],this.chord[a][1]);for(a=0;a<this.bars.length;++a)this.lightBar(this.bars[a].from_string,this.bars[a].to_string,this.bars[a].fret);this.canvas.restore()};
ChordBox.prototype.lightUp=function(b,c){b=this.num_strings-b;var a=0;if(this.position==1&&this.position_text==1)a=this.position_text;var d=false;if(c=="x"){c=0;d=true}else c-=a;b=this.x+this.spacing*b;a=this.y+this.fret_spacing*c;if(c==0)a-=this.metrics.bridge_stroke_width;if(d)this.canvas.text(b,a-(this.fret_spacing-this.metrics.font_size)/2,"X").attr({"font-size":this.metrics.font_size});else{d=this.canvas.circle(b,a-Math.floor(this.fret_spacing/2),this.metrics.circle_radius);c>0&&d.attr("fill",
this.metrics.chord_fill)}return this};
ChordBox.prototype.lightBar=function(b,c,a){if(this.position==1&&this.position_text==1)a-=this.position_text;string_from_num=this.num_strings-b;string_to_num=this.num_strings-c;b=this.x+this.spacing*string_from_num-this.metrics.bar_shift_x;c=this.y+this.fret_spacing*(a-1)+(this.fret_spacing/2-this.metrics.circle_radius);this.canvas.rect(b,c,this.x+this.spacing*string_to_num+this.metrics.bar_shift_x-b,this.y+this.fret_spacing*(a-1)+(this.fret_spacing/2+this.metrics.circle_radius)-c,this.metrics.circle_radius).attr("fill",
this.metrics.chord_fill);return this};function drawVexChordChart(b,c,a,d,e,f){c=new ChordBox(c,a,d,e,f);c.setChord(b.chord,b.position,b.bars,b.position_text,b.tuning);c.draw()};
