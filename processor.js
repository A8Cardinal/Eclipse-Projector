//outline setting and function
var cBOX=document.getElementById("boxoutline").getContext("2d");
cd=[[50,30,700,470,"White"],[780,530,600,215,"#EAEAEA"],[780,30,600,470,"#2F2F2F"],[50,530,350,215,"#EAEAEA"],[400,530,350,215,"#EAEAEA"],[51.1,89,697.8,342,"#649FE9"],[50,30,700,470,"#373737"]]

//default settings
var SliderDefault=2, ScaleDefault=135, hprDefault=0.05, RenderDefault=65000, ViewDefault=0, PolygonDisplacementDefault=0, ProjectionModeDefault=0
var hpr=hprDefault, Scale=ScaleDefault, Render=RenderDefault, View=ViewDefault, time=0, r=3.5, Slider=SliderDefault, PolygonDisplacement=PolygonDisplacementDefault, ProjectionMode=ProjectionModeDefault, ENumberKeeper=-1

function boxoutline() {
	cBOX.clearRect(0,0,1450,740)
	for (var i=0; i<cd.length-1; i++) {
		cBOX.beginPath();
		cBOX.fillStyle = cd[i][4]
		cBOX.rect(cd[i][0],cd[i][1],cd[i][2],cd[i][3]);
		if (i!=cd.length-2) {endStroke(cBOX)}
		else {cBOX.fill()}
	}
	if (ProjectionMode==1) {
		cBOX.beginPath();
		cBOX.fillStyle = cd[cd.length-1][4]
		cBOX.rect(cd[cd.length-1][0],cd[cd.length-1][1],cd[cd.length-1][2],cd[cd.length-1][3]);
		endStroke(cBOX)
	}
	//Sliders and Projection Default Mode
	slider(Slider)
	projectorslider(ProjectionMode)
}

function slider(g) {
	cBOX.clearRect(1381,30,69,300)
	for (i=0; i<2; i++) {
		cBOX.beginPath();
		if (i+1==g) {cBOX.fillStyle="White"}
		else {cBOX.fillStyle="#888"}
		cBOX.moveTo(1381,30+i*130)
		cBOX.lineTo(1401,40+i*130)
		cBOX.lineTo(1401,150+i*130)
		cBOX.lineTo(1381,160+i*130)
		endStroke(cBOX)
	}
	planetdisplay=g
	Slider=g
}

function projectorslider(a) {
	cBOX.clearRect(550,501,200,25)
	for (i=0; i<2; i++) {
		cBOX.beginPath()
		if (i==a) {cBOX.fillStyle="White"}
		else {cBOX.fillStyle="#888"}
		cBOX.moveTo(550+i*92,501)
		cBOX.lineTo(560+i*92,521)
		cBOX.lineTo(632+i*92,521)
		cBOX.lineTo(642+i*92,501)
		endStroke(cBOX)
	}
	ProjectionMode=a
	if (ENumberKeeper>-1) {interpretEclipsePath(ENumberKeeper)}
}


//model default tools
var c=document.getElementById("PlanetaryMotion").getContext("2d");
c.font = "12px Lucida Console"; c.fillStyle = "white"; c.strokeStyle = "white"

//constants
var AU=149598073, G=6.674*Math.pow(10,-11)
var t=3600 
var date=0, yrct=[146097,36524,1461,365], datei=[2021,1,3,0,0], daten=[0,0,0,0,0], dateMLEAP=[31,29,31,30,31,30,31,31,30,31,30,31], dateMN=[31,28,31,30,31,30,31,31,30,31,30,31]

//planetary information (units: km, e24kg, km/s, degrees)
var SUN={dx:0, dy:0, dz:0, m:1989000, vx:0, vy:0, vz:0, radius:696340};
var EARTH={dx:-32630789.25, dy:-143428220.1, dz:0, m:5.97237, vx:-29.53653183, vy:6.719739984, vz:0, semiMJAX:149596000, tilt:0, eccentricity:0.01671022, radius:6371, TILT:23.44*Math.PI/180};
var MERCURY={dx:40763651.04, dy:47899480.38, dz:-7650053.777, m:0.33011, vx:27.37409456, vy:-33.87786527, vz:0.2209525773, semiMJAX:57909050, tilt:7.005, eccentricity:0.20563069, period:2110};
var VENUS={dx:-61503646.3, dy:89199475.78, dz:2351176.646, m:4.8675, vx:28.60330646, vy:20.0411873, vz:-1.920654933, semiMJAX:108208000, tilt:3.39471, eccentricity:0.00677323, period:5393};
var MARS={dx:88142611.55, dy:-208294760.3, dz:2177456.437, m:6.4171, vx:-21.39531845, vy:-11.49924644, vz:-0.7528089472, semiMJAX:227939200, tilt:1.85061, eccentricity:0.09341233, period:16487};
var JUPITER={dx:459901827.4, dy:607774555.2, dz:-7713031.48, m:1898.2, vx:10.57408135, vy:-8.130451869, vz:0.2729652622, semiMJAX:778570000, tilt:1.3053, eccentricity:0.04839266, period:103982};
var SATURN={dx:829025298.9, dy:1242817751, dz:-11115824.67, m:568.34, vx:7.510937317, vy:-5.343782223, vz:-0.4000210902, semiMJAX:1433529000, tilt:2.48446, eccentricity:0.05415060, period:258221};
var URANUS={dx:2286001574, dy:-1876822439, dz:-22712876, m:86.813, vx:-4.359575429, vy:-4.953481437, vz:0.06784991345, semiMJAX:2872463000, tilt:0.76986, eccentricity:0.04716771, period:736524};
var NEPTUNE={dx:4411337698, dy:759149246.7, dz:-85504224.91, m:102.413, vx:0.8930381855, vy:-5.381001304, vz:0.1364254957, semiMJAX:4495060000, tilt:1.76917, eccentricity:0.00858587, period:1444368};
var MOON={dx:-32956524.32, dy:-143621575.5, dz:32536.00341, m:0.07346, vx:-30.02587881, vy:7.620048017, vz:0.02948723275, semiMJAX:384399, tilt:5.145, eccentricity:0.0549, radius:1737.1};
var planets=[SUN,EARTH,MERCURY,VENUS,MARS,JUPITER,SATURN,URANUS,NEPTUNE,MOON]
for (i=1; i<planets.length; i++) {
	planets[i].semiMIAX=planets[i].semiMJAX*Math.sqrt(1-Math.pow(planets[i].eccentricity,2))
	planets[i].d=Math.sqrt(Math.pow(planets[i].dx,2)+Math.pow(planets[i].dy,2)+Math.pow(planets[i].dz,2))
	planets[i].g=G*SUN.m*Math.pow(10,24)/Math.pow(planets[i].d*1000,2)
	planets[i].count=0
}

//variable declare
var distance=[], dist=EARTH.d, Coordinates=[[],[],[],[],[],[],[],[],[],[]];
var dispx=[0,-520000,2500000,-1000000,19500000,14500000,3000000,-130000000,25000000,0]
var dispy=[0,-2450000,-11400000,-500000,8800000,8500000,-75000000,-10000000,-10000000,0]
var dispAng=[0,-0.2237,0.2138,-0.7536,-1.1405,1.3786,0.05056,1.6902,0,0]
var tilt=[0,1,0.9925,0.9983,0.9995,0.9997,0.9991,0.9999,1,0]
var text=["Sun","Earth","Mercury","Venus","Mars","Jupiter","Saturn","Uranus","Neptune","Moon"]
var color=["#F48941","#3DFFFD","#8A8989","#BF8A45","#F1672A","#D39A50","#C7AC6B","#7DCECF","#6A84D0","#F0F0F0","#3DCED0",0,0,0,0,0,0,0,"#D0D0D0"]
var MoonEarthRadius=[362600,405400,250000,500000,750000]
var MoonLogCounter=-1, MoonDisplayCounter=-1, EclipseDisplayCounter=0
var DisplayTime=[[],[],[],[],[],[],[],[],[],[]]

//Main planetary motion functions
function initialdata() {
	document.getElementById("hpr").innerHTML=(hpr/24).toFixed(4)+' ('+(hpr*60).toFixed(1)+' minutes/cycle)'
	document.getElementById("Scale").innerHTML=Scale
	document.getElementById("Render").innerHTML=Render
	document.getElementById("logMoon1").innerHTML="waiting..."
	document.getElementById("logEclipse1").innerHTML="waiting...      ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎  ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎‎ ‎ ‎"
	for (i=0; i<planets.length; i++) {CoordinateUpdate(i);}
}

//Display Solar System and Moon Projection
function display() {
	c.clearRect(0,0,600,470)
	if (planetdisplay==1) {
		key(100,2,Scale)
		if (Scale>140) {if (Scale>200) {key(0.1,1,Scale)}; key(0.5,0,Scale)}
		else if (Scale>40) {if (Scale>80) {key(0.5,1,Scale)}; key(1.0,0,Scale)}
		else if (Scale>10) {if (Scale>20) {key(1,1,Scale)}; key(5.0,0,Scale)}
		else {key(5,1,Scale); key(10.0,0,Scale)}
		for (i=0; i<Coordinates.length-1; i++) {
			c.fillStyle = "White";
			x=(Coordinates[i][0])/AU*Scale+300;
			y=(Coordinates[i][1])/AU*Scale+235;
			c.fillText(text[i], x, y-12);
			Draw(i,x,y,r,0,Math.PI*2)
			if (i!=0) {ellipse(300-dispx[i]/AU*Scale,235-dispy[i]/AU*Scale,planets[i].semiMIAX/AU*tilt[i]*Scale,planets[i].semiMJAX/AU*tilt[i]*Scale,dispAng[i]+Math.PI,0,2*Math.PI)
			}	
		}
	} else {
		key(0.001,1,Render);
		angle=Math.atan(-Coordinates[1][1]/Coordinates[1][0])
		if ((angle<0 && Coordinates[1][1]<0) || (angle>0 && Coordinates[1][1]>0)) {o=Math.PI}
		else {o=0}
		angle= Math.atan(-Coordinates[1][1]/Coordinates[1][0])-o
		for (var i=9; i>0; i-=8) {
			c.fillStyle="White"
			x=(Coordinates[i][0]-Coordinates[1][0])/AU*Render
			y=(Coordinates[i][1]-Coordinates[1][1])/AU*Render
			z=(Coordinates[i][2]-Coordinates[1][2])/AU*Render
			if (View==0) {
				c.fillText(text[i],300+(x*Math.cos(angle)-y*Math.sin(angle)),223+(x*Math.sin(angle)+y*Math.cos(angle)))
				for (j=0; j<2; j++) {
					Draw(i+9*j,300+(x*Math.cos(angle)-y*Math.sin(angle)),235+(x*Math.sin(angle)+y*Math.cos(angle)),r+3-i/2,Math.PI/2+j*Math.PI,Math.PI/2*3+j*Math.PI)
				}
			} 
			if (View==1 && x*Math.sin(angle)+y*Math.cos(angle)<=0) {
				c.fillText(text[i],300+(x*Math.cos(angle)-y*Math.sin(angle)),223+z)
				for (j=0; j<2; j++) {
					Draw(i+9*j,300+(x*Math.cos(angle)-y*Math.sin(angle)),235+z,r+3-i/2,Math.PI/2+j*Math.PI,Math.PI/2*3+j*Math.PI)
				}		
			} else if (View==1 && i==9) {
				c.fillText(text[1],300,223)
				for (j=0; j<2; j++) {
					Draw(1+9*j,300,235,r+3-1/2,Math.PI/2+j*Math.PI,Math.PI/2*3+j*Math.PI)
				}
				c.fillStyle="White"
				c.fillText(text[i],300+(x*Math.cos(angle)-y*Math.sin(angle)),223+z)
				for (j=0; j<2; j++) {
					Draw(i+9*j,300+(x*Math.cos(angle)-y*Math.sin(angle)),235+z,r+3-i/2,Math.PI/2+j*Math.PI,Math.PI/2*3+j*Math.PI)
				}
				i=0
			}
		}
		c.strokeStyle="#BABABA"
		c.fillStyle="White"
		if (View==0) {
			for (i=0; i<MoonEarthRadius.length; i++) {
				if (i>1) {c.strokeStyle="#656565"}
				c.beginPath();
				c.arc(300,235,MoonEarthRadius[i]/AU*Render,0,Math.PI*2)
				c.stroke();
			} 
			c.fillText("Top View",530,455)
		} else if (View==1) {
			for (i=0; i<4; i++) {
				ellipse(300,235,MoonEarthRadius[Math.floor(i/2)]/AU*Render,MoonEarthRadius[Math.floor(i/2)]/AU*Render*0.8,0,-Math.PI/12+i*Math.PI,Math.PI/12+i*Math.PI,)
			}
		c.fillText("Apogee",122,186)
		c.fillText("Perigee",154,199)
		c.fillText("Side View",523,455)
		}
		c.strokeStyle="#A7A7A7"
		c.fillStyle="White"
		c.beginPath();
		c.moveTo(20,235);
		c.lineTo(40,225);
		c.lineTo(40,245);
		endStroke(c);
		c.fillText("Sun",45,238)
		label(0.001*Render); 
		c.fillText(0.001+" AU",536, 20);
	}	
	c.fillStyle="White"
	window.setTimeout(display,33)
}

//Calcualte position
function motion() {
	for (i=0; i<planets.length; i++) {
		for (l=0; l<planets.length-1; l++) {
			if (i!=l && i!=0) {
				if (l==0) {
					planets[i].g=G*SUN.m*Math.pow(10,24)/Math.pow(planets[i].d*1000,2)
					dist=0
					if (i==1 || i==9 || time/planets[i].period<planets[i].count) {
						for (j=0; j<3; j++) {
							Coordinates[i][j]+=Coordinates[i][j+4]*t*hpr
							distance[j]=Coordinates[0][j]-Coordinates[i][j]
							dist+=Math.pow(distance[j],2)
						}
						dist=Math.sqrt(dist)
						planets[i].d=dist
						for (k=0; k<3; k++) {Coordinates[i][k+4]+=planets[i].g/1000*distance[k]/dist*t*hpr}
					} else {
						CoordinateUpdate(i);
						planets[i].count++;
					}	
				} else if (i==1 || i==9 || time/planets[i].period<planets[i].count) {
					for (j=0; j<3; j++) {
						distance[j]=Coordinates[l][j]-Coordinates[i][j]
						dist+=Math.pow(distance[j],2)
					}
					dist=Math.sqrt(dist)
					planets[i].g=G*planets[l].m*Math.pow(10,24)/Math.pow(dist*1000,2)
					for (k=0; k<3; k++) {Coordinates[i][k+4]+=planets[i].g/1000*distance[k]/dist*t*hpr}	
				}
			}
		}
	}
	angle=Math.atan(-Coordinates[1][1]/Coordinates[1][0])
	if ((angle<0 && Coordinates[1][1]<0) || (angle>0 && Coordinates[1][1]>0)) {o=Math.PI}
	else {o=0}
	angle= Math.atan(-Coordinates[1][1]/Coordinates[1][0])-o
	X=(Coordinates[9][0]-Coordinates[1][0])
	Y=(Coordinates[9][1]-Coordinates[1][1])
	Z=(Coordinates[9][2]-Coordinates[1][2])
	distP=Math.sqrt(Math.pow(Coordinates[1][0],2)+Math.pow(Coordinates[1][1],2))
	if (MoonLogCounter==-1 && X*Math.sin(angle)+Y*Math.cos(angle)>0) {
		document.getElementById("logMoonN").innerHTML=updatedate(1)+' (GMT)'
		for (j=10; j>1; j-=1) {document.getElementById('logMoon'+j).innerHTML=document.getElementById('logMoon'+(j-1)).innerHTML}
		document.getElementById("logMoon1").innerHTML=updatedate(1)+' (New Moon)'
		MoonLogCounter=1
		DisplayTime[0][1]=time
	} else if (MoonLogCounter==1 && X*Math.sin(angle)+Y*Math.cos(angle)<0) {
		document.getElementById("logMoonF").innerHTML=updatedate(1)+' (GMT)'
		for (j=10; j>1; j-=1) {document.getElementById('logMoon'+j).innerHTML=document.getElementById('logMoon'+(j-1)).innerHTML}
		document.getElementById("logMoon1").innerHTML=updatedate(1)+' (Full Moon)'	
		MoonLogCounter=-1
		DisplayTime[0][1]=time
	}
	if (MoonDisplayCounter==-1 && Math.abs(X*Math.sin(angle)+Y*Math.cos(angle))<698077.1/(distP-Math.sqrt(X*X+Y*Y))*distP-696340+6371 && X*Math.cos(angle)-Y*Math.sin(angle)<0) {
		if (Math.abs(Z)<698077.1/(distP-Math.sqrt(X*X+Y*Y))*distP-696340+6371) {
			if (Math.abs(Z)<694602.9/(distP-Math.sqrt(X*X+Y*Y))*distP-696340+6371) {document.getElementById("logEclipse").innerHTML=updatedate(1)+' (GMT) - Solar (U)'} 
			else {document.getElementById("logEclipse").innerHTML=updatedate(1)+' (GMT) - Solar (P)'}
			for (j=10; j>1; j-=1) {
				document.getElementById('logEclipse'+j).innerHTML=document.getElementById('logEclipse'+(j-1)).innerHTML
				DisplayTime[j-1]=DisplayTime[j-2]
			}
			document.getElementById("logEclipse1").innerHTML=updatedate(1)+' (Solar)'
			DisplayTime[0]=[]
			DisplayTime[0][0]=-1
			EclipseDisplayCounter=-1
		}
		MoonDisplayCounter=1
	} else if (MoonDisplayCounter==1 && Math.abs(X*Math.sin(angle)+Y*Math.cos(angle))<702711/distP*(distP+Math.sqrt(X*X+Y*Y))-696340+1737.1 && X*Math.cos(angle)-Y*Math.sin(angle)>0) {
		if (Math.abs(Z)<702711/distP*(distP+Math.sqrt(X*X+Y*Y))-696340+1737.1) {
			if (Math.abs(Z)<689969/distP*(distP+Math.sqrt(X*X+Y*Y))-696340+1737.1) {document.getElementById("logEclipse").innerHTML=updatedate(1)+' (GMT) - Lunar (U)'} 
			else {document.getElementById("logEclipse").innerHTML=updatedate(1)+' (GMT) - Lunar (P)'}
			for (j=10; j>1; j-=1) {
				document.getElementById('logEclipse'+j).innerHTML=document.getElementById('logEclipse'+(j-1)).innerHTML
				DisplayTime[j-1]=DisplayTime[j-2]
			}
			document.getElementById("logEclipse1").innerHTML=updatedate(1)+' (Lunar)'
			DisplayTime[0]=[]
			DisplayTime[0][0]=1
			EclipseDisplayCounter=1
		}
		MoonDisplayCounter=-1
	}
	if (EclipseDisplayCounter==-1 && Math.abs(X*Math.sin(angle)+Y*Math.cos(angle))<698077.1/(distP-Math.sqrt(X*X+Y*Y))*distP-696340+6371) {
		DisplayTime[0][DisplayTime[0].length]=[time,[Coordinates[9][0],Coordinates[9][1],Coordinates[9][2]],[Coordinates[1][0],Coordinates[1][1]],angle]
	} else if (EclipseDisplayCounter==1 && Math.abs(X*Math.sin(angle)+Y*Math.cos(angle))<702711/distP*(distP+Math.sqrt(X*X+Y*Y))-696340+1737.1) {
		DisplayTime[0][DisplayTime[0].length]=time
	} else {
		if (EclipseDisplayCounter!=0) {interpretEclipsePath(0)}
		EclipseDisplayCounter=0
	}
	time+=hpr;
	updatedate(0);
	window.setTimeout(motion,4)
}

//Take Enumber and convert to saved display
function interpretEclipsePath(ENumber) {
	cDraw.clearRect(0,0,700,500)
	if (DisplayTime[ENumber][0]==1) {
		ETDev=(DisplayTime[ENumber][DisplayTime[ENumber].length-1]-DisplayTime[ENumber][2])*2.5
		ETAve=DisplayTime[0][1]
		ETy=-23.44*Math.cos(2*Math.PI*ETAve/365.2425+26/365.2425)
		ETx=(ETAve%24)*-15+270
		projectEclipsePath(ETx-ETDev,ETy,0)
		projectEclipsePath(ETx-2*ETDev,ETy,0)
		projectEclipsePath(ETx-3*ETDev,ETy,0)
		projectEclipsePath(ETx+3*ETDev,ETy,0)
		projectEclipsePath(ETx+2*ETDev,ETy,0)
		projectEclipsePath(ETx+ETDev,ETy,0)
		projectEclipsePath(ETx,ETy,1)
	} else if (DisplayTime[ENumber][0]==-1) {
		projectSolarPath(ENumber)
	}
	ENumberKeeper=ENumber
	// document.getElementById("data1").innerHTML=ETAve
}

var cDraw=document.getElementById("EclipseProjection").getContext("2d");
DrawCord=[]

function projectEclipsePath(PathX,PathY,SunMoon) {
	EPD=PathX+PolygonDisplacement
	Lat=PathY*Math.PI/180
	MoonPoint=(PathY+90)%180-90
	cDraw.beginPath()
	for (j=-90; j<=90; j++) {
		X=Math.cos(j*Math.PI/90)
		Y=-Math.sin(j*Math.PI/90)*Math.sin(Lat)
		Z=-Math.sin(j*Math.PI/90)*Math.cos(Lat)
		DrawCord[2*j+180]=Math.atan(Y/X)*180/Math.PI
		if(X<0) {DrawCord[2*j+180]+=180}
		//Long
		DrawCord[2*j+181]=Math.asin(Z)*180/Math.PI
		//Lat
	}
	for (j=0; j<4; j++) {
		cDraw.beginPath()
		cDraw.moveTo(-1051+700*j+(DrawCord[0]+EPD)*35/18,234-DrawCord[1]*35/18)
		for (k=1; k<DrawCord.length/2; k++) {
			cDraw.lineTo(-1051+700*j+(DrawCord[2*k]+EPD)*35/18,234-DrawCord[2*k+1]*35/18)
		}
		cDraw.globalAlpha=0.1
		cDraw.fillStyle="#270E33"
		cDraw.fill()
		cDraw.closePath()
	}
	if (MoonPoint>0) {
		MoonMin=0
		for (i=0; i<DrawCord.length/2; i++) {
			if (DrawCord[2*i+1]<MoonMin) {
				MoonMin=DrawCord[2*i+1]
			}
		} 
		cDraw.rect(0,234-MoonMin*35/18,700,176+MoonMin*35/18)
	} else {
		MoonMax=0
		for (i=0; i<DrawCord.length/2; i++) {
			if (DrawCord[2*i+1]>MoonMax) {
				MoonMax=DrawCord[2*i+1]
			}
		}
		cDraw.rect(0,58,700,176-MoonMax*35/18)
	}
	cDraw.fill()
	cDraw.globalAlpha=1
	if (SunMoon==1) {
		for (j=0; j<3; j++) {
			MoonDrawx=[0,-5,-6,-1,-5,-1,0,1,1,4,8]
			MoonDrawy=[0,3,6,8,-6,5,4,-1,5,6,5]
			MoonDrawRad=[12,3,2,3,2,3,4,2,3,2,2]
			for (i=0; i<12; i++) {
				cDraw.beginPath()
				cDraw.arc(-874+MoonDrawx[i]+700*j+EPD*35/18,234+MoonDrawy[i]+MoonPoint*35/18,MoonDrawRad[i],0,Math.PI*2)
				if (i==0) {	
					cDraw.lineWidth=4
					cDraw.stroke()
					cDraw.lineWidth=1
					cDraw.fillStyle="#C8C8C8"
				} else {
					cDraw.fillStyle="#AEAEAE"
				}
				cDraw.fill()
			}
			cDraw.beginPath()
			cDraw.arc(-524+700*j+EPD*35/18,234-MoonPoint*35/18,14,0,Math.PI*2)
			cDraw.fillStyle="#F46D00"
			cDraw.strokeStyle="#FA4C00"
			cDraw.lineWidth=1.8
			endStroke(cDraw)
			cDraw.lineWidth=1
			cDraw.strokeStyle="Black"
		}
	}
}

X2=[]
Writ=[]
function projectSolarPath(i) {
	Writ=[]
	SolarCord=[]
	for (j=2; j<DisplayTime[i].length; j++) {
		X1X=DisplayTime[i][j][1][0]*Math.cos(DisplayTime[i][j][3])-DisplayTime[i][j][1][1]*Math.sin(DisplayTime[i][j][3])
		Y1Y=DisplayTime[i][j][1][0]*Math.sin(DisplayTime[i][j][3])+DisplayTime[i][j][1][1]*Math.cos(DisplayTime[i][j][3])
		Z1Z=DisplayTime[i][j][1][2]
		X2X=DisplayTime[i][j][2][0]*Math.cos(DisplayTime[i][j][3])-DisplayTime[i][j][2][1]*Math.sin(DisplayTime[i][j][3])
		if (Math.pow(EARTH.radius,2)*(X1X*X1X+Y1Y*Y1Y+Z1Z*Z1Z)-X2X*X2X*(Y1Y*Y1Y+Z1Z*Z1Z)>0) {
			lambda=(X1X*X2X-Math.sqrt(Math.pow(X1X*X2X,2)-(X1X*X1X+Y1Y*Y1Y+Z1Z*Z1Z)*(X2X*X2X-Math.pow(EARTH.radius,2))))/(X1X*X1X+Y1Y*Y1Y+Z1Z*Z1Z)
			SolarLong=180/Math.PI*Math.atan((X2X-X1X*lambda)/Y1Y*lambda)
			if (SolarLong>0) {SolarLong-=180}
			SolarLong=SolarLong*-1-DisplayTime[i][j][0]%24*15+90
			SolarLat=180/Math.PI*Math.acos(Z1Z*lambda/EARTH.radius)
			SolarCord[SolarCord.length]=[SolarLong,SolarLat]
		}
	}
	cDraw.clearRect(0,0,700,700)
	for (j=0; j<SolarCord.length; j+=2) {
		if (ProjectionMode==0) {
			cDraw.globalAlpha=0.4
			cDraw.fillStyle="#270E33"
			for (q=0; q<3; q++) {
				cDraw.beginPath();
				cDraw.arc(-1051+700*q+(SolarCord[j][0]+PolygonDisplacement)*35/18,234-SolarCord[j][1]*35/18,7,0,Math.PI*2)
				cDraw.fill()
			}
		}
		if (ProjectionMode==1) {
			cDraw.beginPath();	
			cDraw.globalAlpha=0.4
			cDraw.fillStyle="#270E33"	
			X2[0]=EARTH.radius*Math.cos(SolarCord[j][1]/180*Math.PI)*Math.cos((SolarCord[j][0]+PolygonDisplacement)/180*Math.PI)
			if (X2[0]>0) { //change later (to make sure no coordinates are behind the globe)
				X2[1]=EARTH.radius*Math.cos(SolarCord[j][1]/180*Math.PI)*Math.sin((SolarCord[j][0]+PolygonDisplacement)/180*Math.PI)
				X2[2]=EARTH.radius*Math.sin(SolarCord[j][1]/180*Math.PI)
				X=100000*X2[1]/(X2[0]-X0[0])/Minimizer
				Y=100000*X2[2]/(X1[0]-X0[0])/Minimizer
				Writ[Writ.length]=[X,Y]
				cDraw.arc(350+X,234-Y,7,0,Math.PI*2)
				cDraw.fill();
			}
		}
	}
	// document.getElementById("testerr").innerHTML=Writ
}

//Convert time to date
function updatedate(a) {
	date=""
	daten=[0,0,0,0,0]
	daten[2]=time/24
	daten[3]=(time/24-Math.floor(daten[2]))*24
	daten[4]=(daten[3]-Math.floor(daten[3]))*60
	for (i=2; i<=4; i++) {daten[i]=Math.floor(daten[i])}
	for (i=0; i<daten.length; i++) {daten[i]+=datei[i]}
	for (i=0; i<yrct.length; i++) {
		for (j=yrct[i]; j<daten[2]; daten[2]-=j, daten[0]+=Math.floor(yrct[i]/365)) {}
	}
	if (daten[0]%4==0 && (daten[0]%100!=0 || daten[0]%400==0)) {
		for (i=0; dateMLEAP[i]<daten[2]; daten[2]-=dateMLEAP[i], daten[1]++, i++) {}
	} else {
		for (i=0; dateMN[i]<daten[2]; daten[2]-=dateMN[i], daten[1]++, i++) {}
	}
	for (i=0; i<daten.length; i++) {
		if (i!=0) {daten[i]=('0'+daten[i]).slice(-2)}
	}
	if (a==0) {
		document.getElementById("date").innerHTML=(daten[0]+' / '+daten[1]+' / '+daten[2]+' : '+daten[3]+' : '+daten[4]+' (GMT)')
		document.getElementById("time").innerHTML=(time/24).toFixed(2)+' (days)';
	} else {
		return (daten[0]+' / '+daten[1]+' / '+daten[2]+' : '+daten[3]+' : '+daten[4])
	}
}

//Map Drawing
var ctx=document.getElementById("GlobeMap").getContext("2d");
ProjectionLine=[[0,58,698,58],[0,410,698,410]]
var X0=[-360000], X1=[], Minimizer=8, ARC=221

function Projection() {
	ctx.clearRect(0,0,700,700)
	if (ProjectionMode==0) {
		ctx.strokeStyle="#666666"
		for (i=0; i<6; i++) {
			ctx.beginPath()
			ctx.moveTo(0,116.5+350/6*i)
			ctx.lineTo(698,116.5+350/6*i)
			ctx.stroke();
		}
		for (i=0; i<36; i++) {
			ctx.beginPath()
			ctx.moveTo(-1341.75+700/12*i+PolygonDisplacement*35/18,58)
			ctx.lineTo(-1341.75+700/12*i+PolygonDisplacement*35/18,400)
			ctx.stroke();
		}
		ctx.fillStyle="White"
		ctx.strokeStyle="#121212"
		DrawMap()
		ctx.strokeStyle="#121212"
		for (i=0; i<2; i++) {
			ctx.beginPath();
			ctx.moveTo(ProjectionLine[i][0],ProjectionLine[i][1])
			ctx.lineTo(ProjectionLine[i][2],ProjectionLine[i][3])
			ctx.stroke();
		}
	} else {
		ctx.fillStyle="#649FE9"
		ctx.strokeStyle="#000"
		ctx.lineWidth=2
		ctx.beginPath();
		ctx.arc(349,234,ARC,0,Math.PI*2)
		endStroke(ctx)
		ctx.lineWidth=1
		ctx.strokeStyle="#555555"
		for (i=0; i<12; i++) {
			ctx.beginPath();
			for (j=-90; j<90; j+=2) {
				X1[0]=EARTH.radius*Math.cos(j*Math.PI/180)*Math.cos((30*i+PolygonDisplacement)*Math.PI/180)
				X1[1]=EARTH.radius*Math.cos(j*Math.PI/180)*Math.sin((30*i+PolygonDisplacement)*Math.PI/180)
				X1[2]=EARTH.radius*Math.sin(j*Math.PI/180)
				X=100000*X1[1]/(X1[0]-X0[0])/Minimizer
				Y=100000*X1[2]/(X1[0]-X0[0])/Minimizer
				if (X1[0]>0) {
					if (j==-90) {ctx.moveTo(349+(X*Math.cos(EARTH.TILT)+Y*Math.sin(EARTH.TILT)), 234+(X*Math.sin(EARTH.TILT)-Y*Math.cos(EARTH.TILT)))}
					else {ctx.lineTo(349+(X*Math.cos(EARTH.TILT)+Y*Math.sin(EARTH.TILT)), 234+(X*Math.sin(EARTH.TILT)-Y*Math.cos(EARTH.TILT)))}
				}
			}
			ctx.stroke();
		}
		for (i=-3; i<3; i++) {
			ctx.beginPath();
			for (j=-90; j<90; j+=2) {
				X1[0]=EARTH.radius*Math.cos(i*Math.PI/6)*Math.cos((j)*Math.PI/180)
				X1[1]=EARTH.radius*Math.cos(i*Math.PI/6)*Math.sin((j)*Math.PI/180)
				X1[2]=EARTH.radius*Math.sin(i*Math.PI/6)
				X=100000*X1[1]/(X1[0]-X0[0])/Minimizer
				Y=100000*X1[2]/(X1[0]-X0[0])/Minimizer
				if (j==-180) {ctx.moveTo(349+(X*Math.cos(EARTH.TILT)+Y*Math.sin(EARTH.TILT)), 234+(X*Math.sin(EARTH.TILT)-Y*Math.cos(EARTH.TILT)))}
				else {ctx.lineTo(349+(X*Math.cos(EARTH.TILT)+Y*Math.sin(EARTH.TILT)), 234+(X*Math.sin(EARTH.TILT)-Y*Math.cos(EARTH.TILT)))}
			}
			ctx.stroke();
		}
		ctx.lineWidth=2
		
		DrawMap()
		ctx.lineWidth=1
	}
	boxoutline()
	window.setTimeout(Projection,1000)
	// window.setTimeout(Projection,50)
}

//Display Map 
function POLYGON (a) {
	ctx.fillStyle="White"
	if (ProjectionMode==0) {
		for (j=0; j<3; j++) {
			ctx.beginPath()
			ctx.moveTo(-1051+700*j+(a[0]+PolygonDisplacement)*35/18,234-a[1]*35/18)
			for (i=0; i<a.length/2; i++) {
				ctx.lineTo(-1051+700*j+(a[2*i]+PolygonDisplacement)*35/18,234-a[2*i+1]*35/18)
			}
			ctx.stroke()
			ctx.fill()
		}
	} else {
		counterA=0
		for (i=0; i<a.length/2; i++) {
			if (Math.cos(a[2*i+1]*Math.PI/180)*Math.cos((a[2*i]+PolygonDisplacement)*Math.PI/180)<0) {
				counterA++
			}
		}
		if (counterA!=a.length/2) {
			ctx.strokeStyle="#000"
			ctx.fillStyle="White"
			ctx.beginPath();					
			for (i=0; i<a.length/2; i++) {
				X1[0]=EARTH.radius*Math.cos(a[2*i+1]*Math.PI/180)*Math.cos((a[2*i]+PolygonDisplacement)*Math.PI/180)
				X1[1]=EARTH.radius*Math.cos(a[2*i+1]*Math.PI/180)*Math.sin((a[2*i]+PolygonDisplacement)*Math.PI/180)
				X1[2]=EARTH.radius*Math.sin(a[2*i+1]*Math.PI/180)
				Multiplier=(ARC)/Math.sqrt(Math.pow(X1[1],2)+Math.pow(X1[2],2))
				X=100000*X1[1]/(X1[0]-X0[0])/Minimizer
				Y=100000*X1[2]/(X1[0]-X0[0])/Minimizer
				if (i==0) {
					if (X1[0]>0) {
						ctx.moveTo(349+(X*Math.cos(EARTH.TILT)+Y*Math.sin(EARTH.TILT)), 234+(X*Math.sin(EARTH.TILT)-Y*Math.cos(EARTH.TILT)))
					} else {
						ctx.moveTo(349+(X1[1]*Math.cos(EARTH.TILT)+X1[2]*Math.sin(EARTH.TILT))*Multiplier,234+(X1[1]*Math.sin(EARTH.TILT)-X1[2]*Math.cos(EARTH.TILT))*Multiplier)
					}	
				} else {
					if (X1[0]>0) {
						ctx.lineTo(349+(X*Math.cos(EARTH.TILT)+Y*Math.sin(EARTH.TILT)), 234+(X*Math.sin(EARTH.TILT)-Y*Math.cos(EARTH.TILT)))
					} else {
						ctx.lineTo(349+(X1[1]*Math.cos(EARTH.TILT)+X1[2]*Math.sin(EARTH.TILT))*Multiplier,234+(X1[1]*Math.sin(EARTH.TILT)-X1[2]*Math.cos(EARTH.TILT))*Multiplier)
					}
				}	
			}
			ctx.stroke()
			ctx.fill()
		}	
	}
}

//Display Cities
function LABEL (f,g,h,i) {
	if (ProjectionMode==0 && i==1) {
		for (j=0; j<3; j++) {
			ctx.fillStyle="#808080"
			ctx.beginPath()
			ctx.arc(-1051+700*j+(f+PolygonDisplacement)*35/18,234-g*35/18,2,0,Math.PI*2)
			endStroke(ctx)
			ctx.fillStyle="#000"
			ctx.fillText(h,-1049+700*j+(f+PolygonDisplacement)*35/18,232-g*35/18)
		}
	} 
	if (ProjectionMode==1) {
		X1[0]=EARTH.radius*Math.cos(g*Math.PI/180)*Math.cos((f+PolygonDisplacement)*Math.PI/180)
		X1[1]=EARTH.radius*Math.cos(g*Math.PI/180)*Math.sin((f+PolygonDisplacement)*Math.PI/180)
		X1[2]=EARTH.radius*Math.sin(g*Math.PI/180)
		X=100000*X1[1]/(X1[0]-X0[0])/Minimizer
		Y=100000*X1[2]/(X1[0]-X0[0])/Minimizer
		if (X1[0]>0) {
			ctx.fillStyle="#808080"
			ctx.beginPath()
			ctx.arc(349+(X*Math.cos(EARTH.TILT)+Y*Math.sin(EARTH.TILT)), 234+(X*Math.sin(EARTH.TILT)-Y*Math.cos(EARTH.TILT)),2,0,Math.PI*2)
			endStroke(ctx)
			ctx.fillStyle="#000"
			ctx.fillText(h,351+(X*Math.cos(EARTH.TILT)+Y*Math.sin(EARTH.TILT)), 232+(X*Math.sin(EARTH.TILT)-Y*Math.cos(EARTH.TILT)))
		}
	}
}

//Keyboard Action
window.onkeydown=function(e) {
	if (e.keyCode==13) {
		Scale=ScaleDefault; hpr=hprDefault; Render=RenderDefault
	}
	if (e.keyCode==39 && hpr<24) {
		if (hpr<0.2) {hpr=Math.floor(hpr*100+1)/100}
		else {hpr=Math.floor(hpr*10+2)/10}
	}
	if (e.keyCode==37 && hpr>0) {
		if (hpr>0.2) {hpr=Math.floor(hpr*10-2)/10} 
		else {hpr=Math.floor(hpr*100-1)/100}	
	}
	if (e.keyCode==32) {
		if (hpr!=0) {hpr=0}
		else {hpr=hprDefault}
	}
	if (planetdisplay==1) {
		if (e.keyCode==38 && Scale<450) {
			if (Scale>400) {Scale=450} 
			else {Scale*=1.1}
		}
		if (e.keyCode==40 && Scale>7) {
			if (Scale<8) {Scale=7} 
			else {Scale*=0.9}
		}
	}
	if (e.keyCode==76) {
		PolygonDisplacement+=1
		PolygonDisplacement=PolygonDisplacement%360
		interpretEclipsePath(ENumberKeeper)
	}
	if (planetdisplay==2 && (e.keyCode==38 || e.keyCode==40)) {View=(View+1)%2}
	document.getElementById("hpr").innerHTML=(hpr/24).toFixed(4)+' ('+(hpr*60).toFixed(1)+' minutes/cycle)'
	document.getElementById("Scale").innerHTML=Math.floor(Scale)
}	

//simplifiers
function endStroke(n) {
	n.fill();
	n.stroke();
	n.closePath();
}

function CoordinateUpdate(n) {
	Coordinates[n][0]=planets[n].dx
	Coordinates[n][1]=planets[n].dy
	Coordinates[n][2]=planets[n].dz
	Coordinates[n][3]=planets[n].m
	Coordinates[n][4]=planets[n].vx
	Coordinates[n][5]=planets[n].vy
	Coordinates[n][6]=planets[n].vz
}

function ellipse(p,q,r,s,t,u,v) {
	c.beginPath();
	c.ellipse(p,q,r,s,t,u,v)
	c.stroke();
} 

function Draw(t,u,v,x,y,z) {
	if (SliderDefault==2 && z==Math.PI*3/2) {
		grd=c.createLinearGradient(u,0,u+x*120,0)
		grd.addColorStop(0,"#000000");
		grd.addColorStop(1,"#2F2F2F")
		c.fillStyle=grd;
		c.beginPath();
		c.moveTo(u,v-x-1)
		c.lineTo(u+x*120,v)
		c.lineTo(u,v+x+1)
		c.fill();
	}
	c.fillStyle=color[t]
	c.strokeStyle=color[t]
	c.beginPath();
	c.arc(u,v,x,y,z)
	endStroke(c);
}

function key(a,d,e) {
	c.beginPath()
	if (d==0) {c.strokeStyle="#424949"}
	if (d==1) {c.strokeStyle="#373737"}
	if (d==2) {c.strokeStyle="#666666"}
	var b=300/(e*a)
	for (i=Math.floor(-b); i<b; i++) {
		c.moveTo(300+i*a*e,0);
		c.lineTo(300+i*a*e,470);
		c.closePath();
		c.moveTo(0,235+i*a*e);
		c.lineTo(600,235+i*a*e);
		c.closePath();
	}
	endStroke(c);
	if (d==0) {
		label(a*e);
		if (a!=10) {c.fillText(a.toFixed(1)+" AU", 550, 20)}
		else {c.fillText(a.toFixed(1)+" AU", 543, 20)}
	}		
}

function label(p) {
	c.strokeStyle="White"
	c.beginPath();
	c.moveTo(590,30);
	c.lineTo(590-p,30);
	c.closePath();
	for (i=0; i<2; i++) {
		c.moveTo(590-i*p,35);
		c.lineTo(590-i*p,25);
		c.closePath();
	}
	c.stroke()
}