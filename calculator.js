export const motors=[
{id:"bg95",name:"BG95x40 dCore · Standard 48 V (40-V-Projektvariante unbestätigt)",rpm:3940,idle:4400,nom:1.7,peak:6.33,J:950,note:"48-V-Standarddaten; 88595.01992 (40 V) nicht bestätigt"},
{id:"bg75",name:"BG75x25 · Daten fehlen – Platzhalter",rpm:0,idle:0,nom:0,peak:0,J:0,note:"Nicht für Eignungsnachweis verwenden"}];
export const gears=[{id:"ng500",name:"NG500 · 16:1",ratio:16,eta:.8,cont:21,peak:42,note:"NG500 Herstellerreferenz; 80 % konservative Auslegungsannahme"}];
export const defaults={projectName:"FTF BG95x40 / NG500",unloaded:200,payload:550,drives:2,wheel:160,ratio:16,eta:.8,roll:.02,slope:0,speed:1.4,accel:.5,brake:.7,curveSpeed:.3,positionSpeed:.1,curveRadius:0,adhesion:0,drivenFraction:1,reverseEta:.8,motorId:"bg95",gearId:"ng500",rpm:3940,idle:4400,nom:1.7,peak:6.33,J:950,cont:21,gearPeak:42};
export function calc(c){
const m=c.unloaded+c.payload,r=c.wheel/2000,z=c.drives,i=c.ratio,eta=c.eta,g=9.81,ang=Math.atan(c.slope/100),J=c.J*1e-7;
for(const k of ["unloaded","payload","drives","wheel","ratio","eta","roll","slope","speed","accel","brake","curveSpeed","positionSpeed","curveRadius","adhesion","drivenFraction","reverseEta","rpm","idle","nom","peak","J","cont","gearPeak"])if(!Number.isFinite(c[k]))return {error:"Ungültiger Zahlenwert: "+k};
if(m<=0||c.unloaded<0||c.payload<0||!Number.isInteger(z)||z<1||r<=0||i<=0||eta<=0||eta>1||c.reverseEta<=0||c.reverseEta>1||c.drivenFraction<=0||c.drivenFraction>1||c.roll<0||c.speed<0||c.accel<0||c.brake<=0||c.curveRadius<0||c.adhesion<0||Math.abs(c.slope)>100||[c.rpm,c.idle,c.nom,c.peak,c.J,c.cont,c.gearPeak,c.curveSpeed,c.positionSpeed].some(v=>v<0))return {error:"Unzulässige Eingaben – positive Massen, Durchmesser, Übersetzung, Wirkungsgrade und Rampen prüfen."};
const roll=m*g*Math.cos(ang)*c.roll,hill=m*g*Math.sin(ang),res=roll+hill,force=m*c.accel+res,n=c.speed*60*i/(2*Math.PI*r),wheel=force*r/z,motor=wheel/(i*eta)+J*(c.accel/r)*i,wb=(m*c.brake-res)*r/z,mb=wb*c.reverseEta/i+J*(c.brake/r)*i,maxA=(z*c.gearPeak/r-res)/m,atLimit=c.gearPeak/(i*eta)+J*(maxA/r)*i,adh=c.adhesion?m*g*Math.cos(ang)*c.adhesion*c.drivenFraction:null;
const results=[
["Gesamtmasse",m,"kg","m = Leergewicht + Zuladung"],
["Motordrehzahl bei Zielgeschwindigkeit",n,"min⁻¹","n = v · 60 · i / (2πr)"],
["Theoretische Leerlaufgeschwindigkeit",c.idle?c.idle*2*Math.PI*r/(60*i):null,"m/s","v₀ = n₀ · 2πr / (60i)"],
["Rollwiderstand",roll,"N","Fᵣ = m · g · cos(α) · cᵣ"],
["Hangabtriebskraft",hill,"N","Fₕ = m · g · sin(α)"],
["Beschleunigungskraft gesamt",force,"N","F = m · a + Fᵣ + Fₕ"],
["Radmoment pro Antrieb",wheel,"Nm","Mᵣ = F · r / z"],
["Motormoment pro Antrieb",motor,"Nm","Mₘ = Mᵣ/(iη) + J · (a/r) · i"],
["Getriebegrenze Beschleunigung (Modell)",c.gearPeak?maxA:null,"m/s²","aₘₐₓ = (z · Mɢ,B / r − Fᵣ − Fₕ) / m"],
["Motorbedarf bei Getriebegrenze",c.gearPeak?atLimit:null,"Nm","Mₘ = Mɢ,B/(iη) + J · (aₘₐₓ/r) · i"],
["Getriebe-Dauermomentreserve",c.cont?100*(c.cont-wheel)/c.cont:null,"%","(Mɢ,D − Mᵣ)/Mɢ,D · 100"],
["Motornennmomentreserve",c.nom?100*(c.nom-motor)/c.nom:null,"%","(Mₘ,N − Mₘ)/Mₘ,N · 100"],
["Beschleunigungszeit",c.accel?c.speed/c.accel:null,"s","t = v/a"],
["Beschleunigungsweg",c.accel?c.speed*c.speed/(2*c.accel):null,"m","s = v²/(2a)"],
["Radbremsmoment pro Antrieb",wb,"Nm","Mᵣ,B = (m · b − Fᵣ − Fₕ) · r / z"],
["Motormoment beim geregelten Bremsen (Modell)",mb,"Nm","Mₘ,B ≈ Mᵣ,B · ηᵣ/i + J · (b/r) · i"],
["Bremszeit",c.speed/c.brake,"s","t = v/b"],
["Bremsweg ohne Reaktionszeit",c.speed*c.speed/(2*c.brake),"m","s = v²/(2b)"],
["Haftkraft (grobes Modell)",adh,"N","Fₕₐ𝒇𝓽 = μ · m · g · cos(α) · Antriebsachslastanteil"],
["Querbeschleunigung",c.curveRadius?c.curveSpeed*c.curveSpeed/c.curveRadius:null,"m/s²","a_q = vₖ²/R"]
];
const warnings=["Nur vereinfachte Vorauslegung, keine Sicherheits- oder Herstellerfreigabe. Bremsreaktion, Haftung, thermisches Lastkollektiv, Rücktrieb und Kippstabilität gesondert prüfen."];
if(c.motorId==="bg95")warnings.unshift("Motorwerte: 48-V-Standardreferenz; 40-V-Projektartikel 88595.01992 nicht einzeln bestätigt.");
if(c.motorId==="bg75")warnings.unshift("BG75x25: Daten fehlen. Keine Eignungsaussage möglich.");
if(c.cont&&wheel>c.cont)warnings.unshift("Getriebe-Dauermoment überschritten.");
if(c.gearPeak&&wheel>c.gearPeak)warnings.unshift("Getriebe-Beschleunigungsmoment überschritten.");
if(c.nom&&motor>c.nom)warnings.unshift("Motornennmoment überschritten.");
if(c.peak&&atLimit>c.peak)warnings.unshift("Motor kann errechnete Getriebegrenze nicht erreichen.");
if(c.rpm&&n>c.rpm)warnings.unshift("Erforderliche Drehzahl über Motornennwert.");
if(adh!==null&&force>adh)warnings.unshift("Haftkraft reicht im Modell nicht.");
if(c.slope)warnings.push("Steigungsmodell für Bergauffahrt; Bremsen bergab separat prüfen.");
if(wb<0)warnings.push("Negatives geregeltes Bremsmoment: passive Fahrwiderstände übersteigen die Sollverzögerung.");
if(!c.nom||!c.peak||!c.cont||!c.gearPeak)warnings.push("Motor-/Getriebegrenzen unvollständig; Reserven nicht zuverlässig bewertbar.");
return {results,warnings,metrics:{mass:m,rpm:n,wheel,motor,brakeDist:c.speed*c.speed/(2*c.brake)}};
}